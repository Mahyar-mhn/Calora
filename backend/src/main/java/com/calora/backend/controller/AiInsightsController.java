package com.calora.backend.controller;

import com.calora.backend.model.Activity;
import com.calora.backend.model.Meal;
import com.calora.backend.model.User;
import com.calora.backend.repository.ActivityRepository;
import com.calora.backend.repository.MealRepository;
import com.calora.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/ai")
public class AiInsightsController {

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final Map<Long, CachedInsight> cache = new ConcurrentHashMap<>();
    private static final Duration CACHE_TTL = Duration.ofHours(24);

    @GetMapping("/insights/{userId}")
    public ResponseEntity<?> getInsights(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CachedInsight cached = cache.get(userId);
        if (cached != null && !cached.isExpired()) {
            return ResponseEntity.ok(cached.response);
        }

        String apiKey = System.getenv("OPENAI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            return ResponseEntity.ok(fallbackInsight("AI insights are unavailable right now."));
        }

        User user = userOpt.get();
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay().minusNanos(1);

        List<Meal> meals = mealRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDateTime, endDateTime);
        List<Activity> activities = activityRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDateTime, endDateTime);

        int dailyTarget = user.getDailyCalorieTarget() != null ? user.getDailyCalorieTarget() : 2200;

        Map<LocalDate, DayTotals> totalsByDay = new HashMap<>();
        for (Meal meal : meals) {
            if (meal.getDate() == null) {
                continue;
            }
            LocalDate day = meal.getDate().toLocalDate();
            DayTotals totals = totalsByDay.computeIfAbsent(day, k -> new DayTotals());
            totals.calories += safeInt(meal.getCalories());
            totals.protein += safeInt(meal.getProtein());
            totals.carbs += safeInt(meal.getCarbs());
            totals.fats += safeInt(meal.getFats());
        }

        Map<String, Integer> activityCounts = new HashMap<>();
        for (Activity activity : activities) {
            if (activity.getDate() == null) {
                continue;
            }
            LocalDate day = activity.getDate().toLocalDate();
            DayTotals totals = totalsByDay.computeIfAbsent(day, k -> new DayTotals());
            totals.burned += safeInt(activity.getCaloriesBurned());
            String type = activity.getType() != null ? activity.getType() : "Activity";
            activityCounts.put(type, activityCounts.getOrDefault(type, 0) + 1);
        }

        int daysLoggedMeals = 0;
        int daysLoggedActivity = 0;
        int daysOverTarget = 0;
        int totalCalories = 0;
        int totalBurned = 0;
        int totalProtein = 0;
        int totalCarbs = 0;
        int totalFats = 0;

        for (int i = 0; i < 7; i++) {
            LocalDate day = endDate.minusDays(i);
            DayTotals totals = totalsByDay.getOrDefault(day, new DayTotals());
            if (totals.calories > 0) {
                daysLoggedMeals++;
            }
            if (totals.burned > 0) {
                daysLoggedActivity++;
            }
            if (totals.calories > dailyTarget) {
                daysOverTarget++;
            }
            totalCalories += totals.calories;
            totalBurned += totals.burned;
            totalProtein += totals.protein;
            totalCarbs += totals.carbs;
            totalFats += totals.fats;
        }

        int avgCalories = Math.round(totalCalories / 7.0f);
        int avgBurned = Math.round(totalBurned / 7.0f);
        int avgProtein = Math.round(totalProtein / 7.0f);
        int avgCarbs = Math.round(totalCarbs / 7.0f);
        int avgFats = Math.round(totalFats / 7.0f);

        String topActivity = activityCounts.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse("None");

        String prompt = buildPrompt(user, dailyTarget, avgCalories, avgBurned, avgProtein, avgCarbs, avgFats,
                daysOverTarget, daysLoggedMeals, daysLoggedActivity, topActivity);

        String model = Optional.ofNullable(System.getenv("OPENAI_MODEL")).filter(s -> !s.isBlank()).orElse("gpt-5");

        try {
            ObjectNode payload = objectMapper.createObjectNode();
            payload.put("model", model);
            payload.put("input", prompt);
            payload.put("instructions",
                    "You are a friendly wellness coach. Provide concise, non-medical guidance. " +
                            "Return JSON only with keys: title (string), message (string), bullets (array of strings).");
            payload.put("max_output_tokens", 250);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/responses"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(payload)))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                return ResponseEntity.ok(fallbackInsight("AI insights are temporarily unavailable."));
            }

            String outputText = extractOutputText(response.body());
            AiInsightResponse insight = parseInsight(outputText);
            insight.setGeneratedAt(Instant.now().toString());
            insight.setSource("openai");

            cache.put(userId, new CachedInsight(insight, Instant.now()));
            return ResponseEntity.ok(insight);
        } catch (Exception e) {
            return ResponseEntity.ok(fallbackInsight("AI insights are temporarily unavailable."));
        }
    }

    private String buildPrompt(User user,
                               int dailyTarget,
                               int avgCalories,
                               int avgBurned,
                               int avgProtein,
                               int avgCarbs,
                               int avgFats,
                               int daysOverTarget,
                               int daysLoggedMeals,
                               int daysLoggedActivity,
                               String topActivity) {
        String goal = user.getGoal() != null ? user.getGoal() : "Not set";
        String weight = user.getWeight() != null ? String.format("%.1f", user.getWeight()) : "Unknown";

        return "User goal: " + goal + ". " +
                "Current weight (kg): " + weight + ". " +
                "Daily calorie target: " + dailyTarget + " kcal. " +
                "Last 7 days averages: " +
                avgCalories + " kcal consumed/day, " +
                avgBurned + " kcal burned/day, " +
                avgProtein + "g protein/day, " +
                avgCarbs + "g carbs/day, " +
                avgFats + "g fats/day. " +
                "Days over target: " + daysOverTarget + ". " +
                "Days with meals logged: " + daysLoggedMeals + ". " +
                "Days with activity logged: " + daysLoggedActivity + ". " +
                "Most frequent activity: " + topActivity + ". " +
                "Provide a concise insight with 1 short message and 2-3 bullet tips.";
    }

    private AiInsightResponse parseInsight(String outputText) {
        AiInsightResponse response = new AiInsightResponse();
        response.setTitle("AI Insight");
        response.setBullets(Collections.emptyList());

        if (outputText == null || outputText.isBlank()) {
            response.setMessage("No insights available yet.");
            return response;
        }

        String trimmed = outputText.trim();
        try {
            JsonNode node = objectMapper.readTree(trimmed);
            if (node.isObject()) {
                String title = textOrNull(node.get("title"));
                String message = textOrNull(node.get("message"));
                List<String> bullets = new ArrayList<>();
                JsonNode bulletsNode = node.get("bullets");
                if (bulletsNode != null && bulletsNode.isArray()) {
                    for (JsonNode item : bulletsNode) {
                        String value = item.asText();
                        if (!value.isBlank()) {
                            bullets.add(value.trim());
                        }
                    }
                }
                if (title != null && !title.isBlank()) {
                    response.setTitle(title);
                }
                response.setMessage(message != null ? message : trimmed);
                response.setBullets(bullets);
                return response;
            }
        } catch (Exception ignored) {
        }

        response.setMessage(trimmed);
        return response;
    }

    private String extractOutputText(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        JsonNode output = root.get("output");
        if (output != null && output.isArray()) {
            StringBuilder builder = new StringBuilder();
            for (JsonNode item : output) {
                JsonNode content = item.get("content");
                if (content != null && content.isArray()) {
                    for (JsonNode contentItem : content) {
                        String text = contentItem.path("text").asText(null);
                        if (text != null && !text.isBlank()) {
                            if (builder.length() > 0) {
                                builder.append("\n");
                            }
                            builder.append(text);
                        }
                    }
                }
            }
            return builder.toString().trim();
        }
        return "";
    }

    private int safeInt(Integer value) {
        return value != null ? value : 0;
    }

    private String textOrNull(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        String value = node.asText();
        return value != null ? value.trim() : null;
    }

    private AiInsightResponse fallbackInsight(String message) {
        AiInsightResponse response = new AiInsightResponse();
        response.setTitle("AI Insight");
        response.setMessage(message);
        response.setBullets(Collections.emptyList());
        response.setGeneratedAt(Instant.now().toString());
        response.setSource("fallback");
        return response;
    }

    private static class CachedInsight {
        private final AiInsightResponse response;
        private final Instant createdAt;

        private CachedInsight(AiInsightResponse response, Instant createdAt) {
            this.response = response;
            this.createdAt = createdAt;
        }

        private boolean isExpired() {
            return createdAt.plus(CACHE_TTL).isBefore(Instant.now());
        }
    }

    private static class DayTotals {
        private int calories;
        private int protein;
        private int carbs;
        private int fats;
        private int burned;
    }

    public static class AiInsightResponse {
        private String title;
        private String message;
        private List<String> bullets;
        private String generatedAt;
        private String source;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public List<String> getBullets() {
            return bullets;
        }

        public void setBullets(List<String> bullets) {
            this.bullets = bullets;
        }

        public String getGeneratedAt() {
            return generatedAt;
        }

        public void setGeneratedAt(String generatedAt) {
            this.generatedAt = generatedAt;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }
    }
}
