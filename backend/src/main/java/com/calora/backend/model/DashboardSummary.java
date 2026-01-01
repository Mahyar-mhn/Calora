package com.calora.backend.model;

public class DashboardSummary {
    private Integer caloriesConsumed;
    private Integer caloriesBurned;
    private Integer caloriesRemaining;
    private Integer dailyTarget;

    // Macros
    private Integer proteinConsumed;
    private Integer carbsConsumed;
    private Integer fatsConsumed;

    private Integer proteinTarget = 165;
    private Integer carbsTarget = 248;
    private Integer fatsTarget = 73;

    // New fields
    private Double currentWeight;
    private Double weightGoal;

    private java.util.List<RecentActivity> recentActivities;
    private java.util.List<DailyTrend> calorieTrends;

    public DashboardSummary() {
    }

    // Inner Classes
    public static class RecentActivity {
        private Long id;
        private String type;
        private String duration; // e.g. "30 min"
        private Integer calories;
        private String time; // e.g. "2 hours ago"

        public RecentActivity(Long id, String type, String duration, Integer calories, String time) {
            this.id = id;
            this.type = type;
            this.duration = duration;
            this.calories = calories;
            this.time = time;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public Integer getCalories() {
            return calories;
        }

        public void setCalories(Integer calories) {
            this.calories = calories;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }
    }

    public static class DailyTrend {
        private String date; // e.g. "Dec 6"
        private Integer consumed;
        private Integer target;
        private Integer burned;

        public DailyTrend(String date, Integer consumed, Integer target, Integer burned) {
            this.date = date;
            this.consumed = consumed;
            this.target = target;
            this.burned = burned;
        }

        // Getters and Setters
        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Integer getConsumed() {
            return consumed;
        }

        public void setConsumed(Integer consumed) {
            this.consumed = consumed;
        }

        public Integer getTarget() {
            return target;
        }

        public void setTarget(Integer target) {
            this.target = target;
        }

        public Integer getBurned() {
            return burned;
        }

        public void setBurned(Integer burned) {
            this.burned = burned;
        }
    }

    public Integer getCaloriesConsumed() {
        return caloriesConsumed;
    }

    public void setCaloriesConsumed(Integer caloriesConsumed) {
        this.caloriesConsumed = caloriesConsumed;
    }

    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Integer caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public Integer getCaloriesRemaining() {
        return caloriesRemaining;
    }

    public void setCaloriesRemaining(Integer caloriesRemaining) {
        this.caloriesRemaining = caloriesRemaining;
    }

    public Integer getDailyTarget() {
        return dailyTarget;
    }

    public void setDailyTarget(Integer dailyTarget) {
        this.dailyTarget = dailyTarget;
    }

    public Integer getProteinConsumed() {
        return proteinConsumed;
    }

    public void setProteinConsumed(Integer proteinConsumed) {
        this.proteinConsumed = proteinConsumed;
    }

    public Integer getCarbsConsumed() {
        return carbsConsumed;
    }

    public void setCarbsConsumed(Integer carbsConsumed) {
        this.carbsConsumed = carbsConsumed;
    }

    public Integer getFatsConsumed() {
        return fatsConsumed;
    }

    public void setFatsConsumed(Integer fatsConsumed) {
        this.fatsConsumed = fatsConsumed;
    }

    public Integer getProteinTarget() {
        return proteinTarget;
    }

    public void setProteinTarget(Integer proteinTarget) {
        this.proteinTarget = proteinTarget;
    }

    public Integer getCarbsTarget() {
        return carbsTarget;
    }

    public void setCarbsTarget(Integer carbsTarget) {
        this.carbsTarget = carbsTarget;
    }

    public Integer getFatsTarget() {
        return fatsTarget;
    }

    public void setFatsTarget(Integer fatsTarget) {
        this.fatsTarget = fatsTarget;
    }

    public Double getCurrentWeight() {
        return currentWeight;
    }

    public void setCurrentWeight(Double currentWeight) {
        this.currentWeight = currentWeight;
    }

    public Double getWeightGoal() {
        return weightGoal;
    }

    public void setWeightGoal(Double weightGoal) {
        this.weightGoal = weightGoal;
    }

    public java.util.List<RecentActivity> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(java.util.List<RecentActivity> recentActivities) {
        this.recentActivities = recentActivities;
    }

    public java.util.List<DailyTrend> getCalorieTrends() {
        return calorieTrends;
    }

    public void setCalorieTrends(java.util.List<DailyTrend> calorieTrends) {
        this.calorieTrends = calorieTrends;
    }
}
