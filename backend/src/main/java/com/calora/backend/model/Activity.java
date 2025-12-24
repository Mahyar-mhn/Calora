package com.calora.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private Integer duration; // in minutes
    private Integer caloriesBurned;
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Activity() {
    }

    public Activity(String type, Integer duration, Integer caloriesBurned, LocalDateTime date, User user) {
        this.type = type;
        this.duration = duration;
        this.caloriesBurned = caloriesBurned;
        this.date = date;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Integer getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
