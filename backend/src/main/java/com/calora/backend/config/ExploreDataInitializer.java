package com.calora.backend.config;

import com.calora.backend.model.*;
import com.calora.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class ExploreDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExplorePostRepository postRepository;

    @Autowired
    private ExploreCommentRepository commentRepository;

    @Autowired
    private ExploreLikeRepository likeRepository;

    @Autowired
    private ExploreReactionRepository reactionRepository;

    @Autowired
    private ExploreFollowRepository followRepository;

    @Autowired
    private ExploreMessageRepository messageRepository;

    @Override
    public void run(String... args) {
        Map<String, User> users = seedUsers();
        if (users.isEmpty()) {
            return;
        }

        List<Long> userIds = users.values().stream().map(User::getId).toList();

        if (postRepository.countByUserIdIn(userIds) == 0) {
            seedPosts(users);
        }

        if (followRepository.countByFollowerIdIn(userIds) == 0) {
            seedFollows(users);
        }

        if (messageRepository.count() == 0) {
            seedMessages(users);
        }
    }

    private Map<String, User> seedUsers() {
        List<SeedUser> seeds = List.of(
                new SeedUser("lena@calora.local", "Lena Park", "@lena.moves", "Trail Runner", "#FFC50F"),
                new SeedUser("omar@calora.local", "Omar Reed", "@omar.lifts", "Strength Coach", "#4A9782"),
                new SeedUser("sofia@calora.local", "Sofia Mendes", "@sofia.eats", "Meal Prep Enthusiast", "#63A361"),
                new SeedUser("jay@calora.local", "Jay Patel", "@jay.cardio", "HIIT Lover", "#5B532C"),
                new SeedUser("nora@calora.local", "Nora Salem", "@nora.balance", "Mindful Mover", "#FFC50F")
        );

        Map<String, User> created = new HashMap<>();
        for (SeedUser seed : seeds) {
            User user = userRepository.findByEmail(seed.email)
                    .map(existing -> applySeed(existing, seed))
                    .orElseGet(() -> createSeedUser(seed));
            created.put(seed.key(), user);
        }
        return created;
    }

    private User createSeedUser(SeedUser seed) {
        User user = new User(seed.email, seed.name, "password123");
        user.setRole(Role.USER);
        user.setHandle(seed.handle);
        user.setTitle(seed.title);
        user.setAvatarColor(seed.avatarColor);
        user.setGoal("Maintain Weight");
        user.setDailyCalorieTarget(2300);
        user.setBudget(100);
        user.setIsPremium(false);
        return userRepository.save(user);
    }

    private User applySeed(User user, SeedUser seed) {
        boolean updated = false;
        if (user.getHandle() == null) {
            user.setHandle(seed.handle);
            updated = true;
        }
        if (user.getTitle() == null) {
            user.setTitle(seed.title);
            updated = true;
        }
        if (user.getAvatarColor() == null) {
            user.setAvatarColor(seed.avatarColor);
            updated = true;
        }
        if (user.getBudget() == null) {
            user.setBudget(100);
            updated = true;
        }
        if (user.getIsPremium() == null) {
            user.setIsPremium(false);
            updated = true;
        }
        if (updated) {
            return userRepository.save(user);
        }
        return user;
    }

    private void seedPosts(Map<String, User> users) {
        LocalDateTime now = LocalDateTime.now();
        ExplorePost p1 = buildPost(users.get("lena"), ExplorePostType.ACTIVITY,
                "Sunrise 5K", "Cool morning run by the river. Felt strong and steady today.",
                310, null, null, null, 32, now.minusMinutes(35));
        ExplorePost p2 = buildPost(users.get("sofia"), ExplorePostType.MEAL,
                "Salmon Power Bowl", "Protein-heavy lunch with greens, quinoa, and citrus dressing.",
                520, 42, 48, 18, null, now.minusMinutes(90));
        ExplorePost p3 = buildPost(users.get("jay"), ExplorePostType.ACTIVITY,
                "HIIT Circuit", "20-minute interval session. Legs are on fire.",
                210, null, null, null, 20, now.minusMinutes(150));
        ExplorePost p4 = buildPost(users.get("nora"), ExplorePostType.MEAL,
                "Greek Yogurt Parfait", "Quick snack: yogurt, berries, almonds, drizzle of honey.",
                280, 20, 26, 9, null, now.minusMinutes(210));
        ExplorePost p5 = buildPost(users.get("omar"), ExplorePostType.ACTIVITY,
                "Upper Body Strength", "Focused on pull-ups and rows. Post-workout pump was real.",
                260, null, null, null, 45, now.minusMinutes(260));

        List<ExplorePost> saved = postRepository.saveAll(List.of(p1, p2, p3, p4, p5));
        Map<String, ExplorePost> posts = Map.of(
                "p1", saved.get(0),
                "p2", saved.get(1),
                "p3", saved.get(2),
                "p4", saved.get(3),
                "p5", saved.get(4)
        );

        createLike(posts.get("p1"), users.get("sofia"));
        createLike(posts.get("p2"), users.get("lena"));
        createLike(posts.get("p2"), users.get("jay"));
        createLike(posts.get("p4"), users.get("omar"));
        createLike(posts.get("p4"), users.get("sofia"));
        createLike(posts.get("p5"), users.get("sofia"));
        createLike(posts.get("p5"), users.get("nora"));

        createComment(posts.get("p1"), users.get("nora"), "Great pace! Love early runs.", now.minusMinutes(20));
        createComment(posts.get("p2"), users.get("omar"), "That looks like the perfect macro balance.", now.minusMinutes(60));
        createComment(posts.get("p4"), users.get("lena"), "Love this combo. Easy and filling.", now.minusMinutes(180));
    }

    private ExplorePost buildPost(User user, ExplorePostType type, String title, String summary,
                                  Integer calories, Integer protein, Integer carbs, Integer fats,
                                  Integer duration, LocalDateTime createdAt) {
        ExplorePost post = new ExplorePost();
        post.setUser(user);
        post.setType(type);
        post.setTitle(title);
        post.setSummary(summary);
        post.setCalories(calories);
        post.setProtein(protein);
        post.setCarbs(carbs);
        post.setFats(fats);
        post.setDuration(duration);
        post.setCreatedAt(createdAt);
        return post;
    }

    private void createLike(ExplorePost post, User user) {
        ExploreLike like = new ExploreLike();
        like.setPost(post);
        like.setUser(user);
        like.setCreatedAt(LocalDateTime.now());
        likeRepository.save(like);
    }

    private void createComment(ExplorePost post, User user, String text, LocalDateTime createdAt) {
        ExploreComment comment = new ExploreComment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setText(text);
        comment.setCreatedAt(createdAt);
        commentRepository.save(comment);
    }

    private void seedFollows(Map<String, User> users) {
        follow(users.get("lena"), users.get("omar"));
        follow(users.get("lena"), users.get("sofia"));
        follow(users.get("omar"), users.get("lena"));
        follow(users.get("sofia"), users.get("lena"));
        follow(users.get("sofia"), users.get("omar"));
        follow(users.get("jay"), users.get("omar"));
        follow(users.get("jay"), users.get("sofia"));
        follow(users.get("nora"), users.get("lena"));
    }

    private void follow(User follower, User following) {
        if (follower == null || following == null) return;
        if (followRepository.findByFollowerIdAndFollowingId(follower.getId(), following.getId()).isPresent()) {
            return;
        }
        ExploreFollow follow = new ExploreFollow();
        follow.setFollower(follower);
        follow.setFollowing(following);
        follow.setCreatedAt(LocalDateTime.now());
        followRepository.save(follow);
    }

    private void seedMessages(Map<String, User> users) {
        createMessage(users.get("lena"), users.get("omar"), "Great session today! Want to train tomorrow?");
        createMessage(users.get("omar"), users.get("lena"), "Absolutely, let's do it.");
        createMessage(users.get("sofia"), users.get("nora"), "Loved your parfait idea.");
    }

    private void createMessage(User from, User to, String text) {
        if (from == null || to == null) return;
        ExploreMessage message = new ExploreMessage();
        message.setFromUser(from);
        message.setToUser(to);
        message.setText(text);
        message.setCreatedAt(LocalDateTime.now());
        messageRepository.save(message);
    }

    private static class SeedUser {
        final String email;
        final String name;
        final String handle;
        final String title;
        final String avatarColor;

        SeedUser(String email, String name, String handle, String title, String avatarColor) {
            this.email = email;
            this.name = name;
            this.handle = handle;
            this.title = title;
            this.avatarColor = avatarColor;
        }

        String key() {
            if (email.startsWith("lena")) return "lena";
            if (email.startsWith("omar")) return "omar";
            if (email.startsWith("sofia")) return "sofia";
            if (email.startsWith("jay")) return "jay";
            if (email.startsWith("nora")) return "nora";
            return email;
        }
    }
}
