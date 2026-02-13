package com.calora.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public/landing")
public class LandingContentController {

    @GetMapping("/features")
    public Map<String, Object> features() {
        return Map.of(
                "title", "Calora Features",
                "subtitle", "Everything users need to track nutrition, activity, goals, and premium insights in one workflow.",
                "items", List.of(
                        Map.of(
                                "title", "Dashboard Overview",
                                "description", "See consumed, burned, and remaining calories with macro progress in real time.",
                                "highlight", "Live macro progress"
                        ),
                        Map.of(
                                "title", "Meal and Food Logging",
                                "description", "Add foods quickly using manual search, barcode scan, or AI-based meal support.",
                                "highlight", "Fast and accurate logging"
                        ),
                        Map.of(
                                "title", "Activity Tracking",
                                "description", "Track workouts, duration, and calories burned while syncing with connected devices.",
                                "highlight", "Device connection support"
                        ),
                        Map.of(
                                "title", "Goal Management",
                                "description", "Set calorie targets, adjust activity level, and monitor goal adherence over time.",
                                "highlight", "Personalized targets"
                        ),
                        Map.of(
                                "title", "Advanced Analytics",
                                "description", "Premium users get deeper trends, exportable reports, and richer historical insights.",
                                "highlight", "CSV and PDF exports"
                        ),
                        Map.of(
                                "title", "Privacy Controls",
                                "description", "Control your profile and account preferences from a dedicated privacy dashboard.",
                                "highlight", "Account-level controls"
                        )
                ),
                "stats", List.of(
                        Map.of("label", "Core Modules", "value", "9"),
                        Map.of("label", "Analytics Reports", "value", "CSV + PDF"),
                        Map.of("label", "Role Support", "value", "User + Premium"),
                        Map.of("label", "Platform", "value", "Web Responsive")
                )
        );
    }

    @GetMapping("/insights")
    public Map<String, Object> insights() {
        return Map.of(
                "title", "Insights That Drive Better Decisions",
                "subtitle", "Calora combines meal logs and activity logs into meaningful trends users can act on daily.",
                "cards", List.of(
                        Map.of(
                                "label", "Nutrition Accuracy",
                                "value", "Macro progress",
                                "description", "Protein, carbs, and fats are compared against daily targets."
                        ),
                        Map.of(
                                "label", "Energy Balance",
                                "value", "Consumed vs Burned",
                                "description", "Users can review net calorie behavior and consistency."
                        ),
                        Map.of(
                                "label", "Historical Trends",
                                "value", "Daily to monthly",
                                "description", "Charts summarize recent behavior and long-term direction."
                        ),
                        Map.of(
                                "label", "Premium Exports",
                                "value", "Shareable reports",
                                "description", "Generate analytics reports in professional CSV/PDF formats."
                        )
                ),
                "recommendations", List.of(
                        "Log meals as they happen to keep progress bars accurate throughout the day.",
                        "Track workouts on the same day to keep net-calorie insights meaningful.",
                        "Review weekly trends before adjusting calorie goals to avoid over-corrections.",
                        "Use Advanced Analytics export for monthly check-ins and coaching reviews."
                )
        );
    }

    @GetMapping("/privacy")
    public Map<String, Object> privacy() {
        return Map.of(
                "title", "Privacy and Account Safety",
                "subtitle", "Calora keeps user profile controls simple and account actions transparent.",
                "principles", List.of(
                        Map.of(
                                "title", "User-Controlled Profile",
                                "description", "Users can update profile data, goals, activity level, and preferences from their account."
                        ),
                        Map.of(
                                "title", "Clear Access Flows",
                                "description", "Authentication and premium access are handled through explicit user actions."
                        ),
                        Map.of(
                                "title", "Scoped Integrations",
                                "description", "Device connections can be connected or disconnected directly by the user."
                        ),
                        Map.of(
                                "title", "Export Transparency",
                                "description", "Report exports are initiated by the user and generated on request."
                        )
                ),
                "controls", List.of(
                        "Profile and password updates",
                        "Manage notifications",
                        "Privacy dashboard settings",
                        "Device connection toggles"
                )
        );
    }
}
