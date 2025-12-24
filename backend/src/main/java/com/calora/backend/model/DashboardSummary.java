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

    private Integer proteinTarget = 165; // hardcoded for now
    private Integer carbsTarget = 248;
    private Integer fatsTarget = 73;

    public DashboardSummary() {
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
}
