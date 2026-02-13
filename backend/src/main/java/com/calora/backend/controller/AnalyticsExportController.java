package com.calora.backend.controller;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.calora.backend.model.Activity;
import com.calora.backend.model.Meal;
import com.calora.backend.model.User;
import com.calora.backend.repository.ActivityRepository;
import com.calora.backend.repository.MealRepository;
import com.calora.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/exports")
public class AnalyticsExportController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping("/analytics/{userId}")
    public ResponseEntity<?> exportAnalytics(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "6") int months,
            @RequestParam(defaultValue = "csv") String format
    ) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        if (months < 1) months = 1;
        if (months > 24) months = 24;

        User user = userOpt.get();
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(months).plusDays(1);
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay().minusNanos(1);

        List<Meal> meals = mealRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDateTime, endDateTime);
        List<Activity> activities = activityRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDateTime, endDateTime);

        String safeName = (user.getName() != null && !user.getName().isBlank()) ? user.getName().trim() : "user-" + userId;
        safeName = safeName.replaceAll("[^a-zA-Z0-9-_]", "_");
        String baseFileName = "analytics_" + safeName + "_" + LocalDate.now();

        String normalizedFormat = format.toLowerCase().trim();
        if ("pdf".equals(normalizedFormat)) {
            byte[] pdfBytes = buildPdfReport(user, months, meals, activities, startDate, endDate);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + baseFileName + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        }

        String csv = buildCsvReport(user, months, meals, activities, startDate, endDate);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + baseFileName + ".csv\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(csv.getBytes(StandardCharsets.UTF_8));
    }

    private String buildCsvReport(User user,
                                  int months,
                                  List<Meal> meals,
                                  List<Activity> activities,
                                  LocalDate startDate,
                                  LocalDate endDate) {
        int totalMealCalories = meals.stream().mapToInt(m -> m.getCalories() != null ? m.getCalories() : 0).sum();
        int totalProtein = meals.stream().mapToInt(m -> m.getProtein() != null ? m.getProtein() : 0).sum();
        int totalCarbs = meals.stream().mapToInt(m -> m.getCarbs() != null ? m.getCarbs() : 0).sum();
        int totalFats = meals.stream().mapToInt(m -> m.getFats() != null ? m.getFats() : 0).sum();
        int totalBurned = activities.stream().mapToInt(a -> a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0).sum();

        StringBuilder sb = new StringBuilder();
        sb.append("Report Type,Advanced Analytics\n");
        sb.append("User,").append(csvEscape(user.getName())).append("\n");
        sb.append("Period Months,").append(months).append("\n");
        sb.append("Date Range,").append(startDate).append(" to ").append(endDate).append("\n");
        sb.append("\n");
        sb.append("Metric,Value\n");
        sb.append("Meals Logged,").append(meals.size()).append("\n");
        sb.append("Activities Logged,").append(activities.size()).append("\n");
        sb.append("Total Calories Consumed,").append(totalMealCalories).append("\n");
        sb.append("Total Calories Burned,").append(totalBurned).append("\n");
        sb.append("Total Protein (g),").append(totalProtein).append("\n");
        sb.append("Total Carbs (g),").append(totalCarbs).append("\n");
        sb.append("Total Fats (g),").append(totalFats).append("\n");
        sb.append("\n");
        sb.append("Recent Meals\n");
        sb.append("Date,Name,Calories,Protein,Carbs,Fats,Meal Type,Quantity,Unit\n");
        meals.stream().limit(100).forEach(meal -> sb
                .append(csvEscape(meal.getDate() != null ? meal.getDate().toString() : ""))
                .append(",").append(csvEscape(meal.getName()))
                .append(",").append(meal.getCalories() != null ? meal.getCalories() : 0)
                .append(",").append(meal.getProtein() != null ? meal.getProtein() : 0)
                .append(",").append(meal.getCarbs() != null ? meal.getCarbs() : 0)
                .append(",").append(meal.getFats() != null ? meal.getFats() : 0)
                .append(",").append(csvEscape(meal.getMealType()))
                .append(",").append(meal.getQuantity() != null ? meal.getQuantity() : 1)
                .append(",").append(csvEscape(meal.getUnit()))
                .append("\n"));
        sb.append("\n");
        sb.append("Recent Activities\n");
        sb.append("Date,Type,Duration (min),Calories Burned\n");
        activities.stream().limit(100).forEach(activity -> sb
                .append(csvEscape(activity.getDate() != null ? activity.getDate().toString() : ""))
                .append(",").append(csvEscape(activity.getType()))
                .append(",").append(activity.getDuration() != null ? activity.getDuration() : 0)
                .append(",").append(activity.getCaloriesBurned() != null ? activity.getCaloriesBurned() : 0)
                .append("\n"));
        return sb.toString();
    }

    private byte[] buildPdfReport(User user,
                                  int months,
                                  List<Meal> meals,
                                  List<Activity> activities,
                                  LocalDate startDate,
                                  LocalDate endDate) {
        int totalMealCalories = meals.stream().mapToInt(m -> m.getCalories() != null ? m.getCalories() : 0).sum();
        int totalBurned = activities.stream().mapToInt(a -> a.getCaloriesBurned() != null ? a.getCaloriesBurned() : 0).sum();
        int totalProtein = meals.stream().mapToInt(m -> m.getProtein() != null ? m.getProtein() : 0).sum();
        int totalCarbs = meals.stream().mapToInt(m -> m.getCarbs() != null ? m.getCarbs() : 0).sum();
        int totalFats = meals.stream().mapToInt(m -> m.getFats() != null ? m.getFats() : 0).sum();
        int days = Math.max(1, (int) ChronoUnit.DAYS.between(startDate, endDate) + 1);
        int totalDuration = activities.stream().mapToInt(a -> a.getDuration() != null ? a.getDuration() : 0).sum();
        int netCalories = totalMealCalories - totalBurned;
        int proteinCalories = totalProtein * 4;
        int carbsCalories = totalCarbs * 4;
        int fatsCalories = totalFats * 9;
        int totalMacroCalories = proteinCalories + carbsCalories + fatsCalories;

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 42, 36);
        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(0, 64, 48));
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(90, 110, 110));
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, Color.WHITE);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(0, 64, 48));
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 10, new Color(30, 45, 50));

            Paragraph title = new Paragraph("Calora Advanced Analytics Report", titleFont);
            title.setAlignment(Element.ALIGN_LEFT);
            document.add(title);
            Paragraph subtitle = new Paragraph(
                    "User: " + safeText(user.getName()) +
                            " | Period: Last " + months + " month(s)" +
                            " | " + startDate + " to " + endDate +
                            " | Generated: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")),
                    subtitleFont
            );
            subtitle.setSpacingAfter(14f);
            document.add(subtitle);

            addSectionHeader(document, "User Profile Snapshot", sectionFont);
            PdfPTable profileTable = new PdfPTable(2);
            profileTable.setWidthPercentage(100);
            profileTable.setWidths(new float[]{2f, 3f});
            addInfoRow(profileTable, "Name", safeText(user.getName()), labelFont, valueFont);
            addInfoRow(profileTable, "Email", safeText(user.getEmail()), labelFont, valueFont);
            addInfoRow(profileTable, "Goal", safeText(user.getGoal()), labelFont, valueFont);
            addInfoRow(profileTable, "Daily Calorie Target", formatInt(user.getDailyCalorieTarget()) + " kcal", labelFont, valueFont);
            addInfoRow(profileTable, "Activity Level", safeText(user.getActivityLevel()), labelFont, valueFont);
            addInfoRow(profileTable, "Age / Gender", valueOrDash(user.getAge()) + " / " + valueOrDash(user.getGender()), labelFont, valueFont);
            addInfoRow(profileTable, "Height / Weight", valueOrDash(user.getHeight()) + " cm / " + valueOrDash(user.getWeight()) + " kg", labelFont, valueFont);
            addInfoRow(profileTable, "Premium Status", Boolean.TRUE.equals(user.getIsPremium()) ? "Premium" : "Standard", labelFont, valueFont);
            profileTable.setSpacingAfter(10f);
            document.add(profileTable);

            addSectionHeader(document, "Performance Summary", sectionFont);
            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setWidths(new float[]{2f, 3f});
            addInfoRow(summaryTable, "Meals Logged", String.valueOf(meals.size()), labelFont, valueFont);
            addInfoRow(summaryTable, "Activities Logged", String.valueOf(activities.size()), labelFont, valueFont);
            addInfoRow(summaryTable, "Calories Consumed", formatInt(totalMealCalories) + " kcal", labelFont, valueFont);
            addInfoRow(summaryTable, "Calories Burned", formatInt(totalBurned) + " kcal", labelFont, valueFont);
            addInfoRow(summaryTable, "Net Calories", formatInt(netCalories) + " kcal", labelFont, valueFont);
            addInfoRow(summaryTable, "Average Daily Intake", formatInt(totalMealCalories / days) + " kcal/day", labelFont, valueFont);
            addInfoRow(summaryTable, "Average Daily Burn", formatInt(totalBurned / days) + " kcal/day", labelFont, valueFont);
            addInfoRow(summaryTable, "Activity Duration", formatInt(totalDuration) + " min total", labelFont, valueFont);
            summaryTable.setSpacingAfter(10f);
            document.add(summaryTable);

            addSectionHeader(document, "Macronutrient Distribution", sectionFont);
            PdfPTable macroTable = new PdfPTable(4);
            macroTable.setWidthPercentage(100);
            macroTable.setWidths(new float[]{1.5f, 1f, 1f, 1f});
            addTableHeader(macroTable, "Macro");
            addTableHeader(macroTable, "Grams");
            addTableHeader(macroTable, "Calories");
            addTableHeader(macroTable, "Share");
            addMacroRow(macroTable, "Protein", totalProtein, proteinCalories, totalMacroCalories);
            addMacroRow(macroTable, "Carbs", totalCarbs, carbsCalories, totalMacroCalories);
            addMacroRow(macroTable, "Fats", totalFats, fatsCalories, totalMacroCalories);
            macroTable.setSpacingAfter(10f);
            document.add(macroTable);

            addSectionHeader(document, "Recent Meals (up to 12)", sectionFont);
            PdfPTable mealsTable = new PdfPTable(5);
            mealsTable.setWidthPercentage(100);
            mealsTable.setWidths(new float[]{1.6f, 2.4f, 1f, 1.4f, 1.3f});
            addTableHeader(mealsTable, "Date");
            addTableHeader(mealsTable, "Food");
            addTableHeader(mealsTable, "Kcal");
            addTableHeader(mealsTable, "P/C/F");
            addTableHeader(mealsTable, "Meal");
            for (Meal meal : meals.stream().limit(12).collect(Collectors.toList())) {
                addTableCell(mealsTable, meal.getDate() != null ? meal.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : "-");
                addTableCell(mealsTable, safeText(meal.getName()));
                addTableCell(mealsTable, String.valueOf(meal.getCalories() != null ? meal.getCalories() : 0));
                addTableCell(mealsTable,
                        (meal.getProtein() != null ? meal.getProtein() : 0) + "/" +
                                (meal.getCarbs() != null ? meal.getCarbs() : 0) + "/" +
                                (meal.getFats() != null ? meal.getFats() : 0));
                addTableCell(mealsTable, safeText(meal.getMealType()));
            }
            mealsTable.setSpacingAfter(10f);
            document.add(mealsTable);

            addSectionHeader(document, "Recent Activities (up to 12)", sectionFont);
            PdfPTable activitiesTable = new PdfPTable(4);
            activitiesTable.setWidthPercentage(100);
            activitiesTable.setWidths(new float[]{1.8f, 2.8f, 1.4f, 1.3f});
            addTableHeader(activitiesTable, "Date");
            addTableHeader(activitiesTable, "Type");
            addTableHeader(activitiesTable, "Duration");
            addTableHeader(activitiesTable, "Burned");
            for (Activity activity : activities.stream().limit(12).collect(Collectors.toList())) {
                addTableCell(activitiesTable, activity.getDate() != null ? activity.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) : "-");
                addTableCell(activitiesTable, safeText(activity.getType()));
                addTableCell(activitiesTable, (activity.getDuration() != null ? activity.getDuration() : 0) + " min");
                addTableCell(activitiesTable, (activity.getCaloriesBurned() != null ? activity.getCaloriesBurned() : 0) + " kcal");
            }
            document.add(activitiesTable);
            document.close();
            return baos.toByteArray();
        } catch (DocumentException e) {
            throw new RuntimeException("Failed to generate PDF report", e);
        } finally {
            if (document.isOpen()) {
                document.close();
            }
        }
    }

    private void addSectionHeader(Document document, String text, Font font) throws DocumentException {
        PdfPTable titleTable = new PdfPTable(1);
        titleTable.setWidthPercentage(100);
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setBackgroundColor(new Color(74, 151, 130));
        cell.setPadding(7f);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        titleTable.addCell(cell);
        titleTable.setSpacingBefore(6f);
        titleTable.setSpacingAfter(6f);
        document.add(titleTable);
    }

    private void addInfoRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBackgroundColor(new Color(247, 251, 248));
        labelCell.setPadding(6f);
        labelCell.setBorderColor(new Color(210, 222, 218));
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(valueOrDash(value), valueFont));
        valueCell.setPadding(6f);
        valueCell.setBorderColor(new Color(210, 222, 218));
        table.addCell(valueCell);
    }

    private void addTableHeader(PdfPTable table, String text) {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
        PdfPCell cell = new PdfPCell(new Phrase(text, headerFont));
        cell.setBackgroundColor(new Color(0, 64, 48));
        cell.setPadding(6f);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(cell);
    }

    private void addTableCell(PdfPTable table, String text) {
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new Color(30, 45, 50));
        PdfPCell cell = new PdfPCell(new Phrase(valueOrDash(text), bodyFont));
        cell.setPadding(5f);
        cell.setBorderColor(new Color(210, 222, 218));
        table.addCell(cell);
    }

    private void addMacroRow(PdfPTable table, String macroName, int grams, int calories, int totalMacroCalories) {
        addTableCell(table, macroName);
        addTableCell(table, grams + " g");
        addTableCell(table, calories + " kcal");
        double pct = totalMacroCalories > 0 ? (calories * 100.0) / totalMacroCalories : 0.0;
        addTableCell(table, String.format("%.1f%%", pct));
    }

    private String valueOrDash(String value) {
        return (value == null || value.isBlank()) ? "-" : value;
    }

    private String valueOrDash(Number value) {
        return value == null ? "-" : String.valueOf(value);
    }

    private String formatInt(Integer value) {
        return String.valueOf(value != null ? value : 0);
    }

    private String formatInt(int value) {
        return String.valueOf(value);
    }

    private String csvEscape(String value) {
        if (value == null) return "";
        String escaped = value.replace("\"", "\"\"");
        return "\"" + escaped + "\"";
    }

    private String safeText(String value) {
        if (value == null) return "";
        return value.replace("\n", " ").replace("\r", " ");
    }
}
