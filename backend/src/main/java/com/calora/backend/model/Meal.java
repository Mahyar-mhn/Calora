package com.calora.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "meals")
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Meal() {
    }

    public Meal(String name, Integer calories, Integer protein, Integer carbs, Integer fats, LocalDateTime date, User user) {
        this.name = name;
        this.calories = calories;
        this.protein = protein;
        this.carbs = carbs;
        this.fats = fats;
        this.date = date;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public Integer getProtein() { return protein; }
    public void setProtein(Integer protein) { this.protein = protein; }

    public Integer getCarbs() { return carbs; }
    public void setCarbs(Integer carbs) { this.carbs = carbs; }

    public Integer getFats() { return fats; }
    public void setFats(Integer fats) { this.fats = fats; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
