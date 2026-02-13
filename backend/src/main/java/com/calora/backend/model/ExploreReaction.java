package com.calora.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "explore_reactions", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "post_id", "user_id" })
})
public class ExploreReaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private ExplorePost post;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String emoji;

    private LocalDateTime createdAt;

    public ExploreReaction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ExplorePost getPost() { return post; }
    public void setPost(ExplorePost post) { this.post = post; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
