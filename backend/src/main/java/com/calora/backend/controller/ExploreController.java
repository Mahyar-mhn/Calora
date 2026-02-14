package com.calora.backend.controller;

import com.calora.backend.model.*;
import com.calora.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/explore")
public class ExploreController {

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

    @GetMapping("/users")
    public List<ExploreUserSummary> getUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserSummary)
                .collect(Collectors.toList());
    }

    @GetMapping("/users/search")
    public ResponseEntity<?> searchUsersByEmail(
            @RequestParam String email,
            @RequestParam(required = false) Long requesterId
    ) {
        if (email == null || email.trim().isBlank()) {
            return ResponseEntity.badRequest().body("email query is required");
        }

        String query = email.trim();
        List<ExploreUserSummary> response = userRepository.findByEmailContainingIgnoreCase(query).stream()
                .filter(user -> requesterId == null || !user.getId().equals(requesterId))
                .sorted(Comparator.comparing(User::getName, Comparator.nullsLast(String::compareToIgnoreCase)))
                .limit(20)
                .map(this::toUserSummary)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable Long userId) {
        if (userRepository.findById(userId).isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<ExploreFollow> followers = followRepository.findByFollowingId(userId);
        List<ExploreUserSummary> response = followers.stream()
                .map(ExploreFollow::getFollower)
                .map(this::toUserSummary)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}/following")
    public ResponseEntity<?> getFollowing(@PathVariable Long userId) {
        if (userRepository.findById(userId).isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        List<ExploreFollow> following = followRepository.findByFollowerId(userId);
        List<ExploreUserSummary> response = following.stream()
                .map(ExploreFollow::getFollowing)
                .map(this::toUserSummary)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/posts")
    public List<ExplorePostResponse> getPosts(@RequestParam(required = false) Long userId) {
        List<ExplorePost> posts = userId != null
                ? postRepository.findByUserIdOrderByCreatedAtDesc(userId)
                : postRepository.findAllByOrderByCreatedAtDesc();

        return posts.stream()
                .map(this::toPostResponse)
                .collect(Collectors.toList());
    }

    @PostMapping("/posts")
    public ResponseEntity<?> createPost(@RequestBody CreatePostRequest request) {
        if (request == null || request.userId == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }
        if (request.title == null || request.title.isBlank()) {
            return ResponseEntity.badRequest().body("title is required");
        }
        if (request.summary == null || request.summary.isBlank()) {
            return ResponseEntity.badRequest().body("summary is required");
        }

        Optional<User> userOpt = userRepository.findById(request.userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        ExplorePost post = new ExplorePost();
        post.setUser(userOpt.get());
        post.setType(parsePostType(request.type));
        post.setTitle(request.title.trim());
        post.setSummary(request.summary.trim());
        post.setCalories(defaultInt(request.calories));
        post.setProtein(request.protein);
        post.setCarbs(request.carbs);
        post.setFats(request.fats);
        post.setDuration(request.duration);
        post.setCreatedAt(LocalDateTime.now());

        ExplorePost saved = postRepository.save(post);
        return ResponseEntity.ok(toPostResponse(saved));
    }

    @PostMapping("/posts/{postId}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long postId, @RequestParam Long userId) {
        Optional<ExplorePost> postOpt = postRepository.findById(postId);
        Optional<User> userOpt = userRepository.findById(userId);
        if (postOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid post or user");
        }

        Optional<ExploreLike> existing = likeRepository.findByPostIdAndUserId(postId, userId);
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            return ResponseEntity.ok(new LikeState(false));
        }

        ExploreLike like = new ExploreLike();
        like.setPost(postOpt.get());
        like.setUser(userOpt.get());
        like.setCreatedAt(LocalDateTime.now());
        likeRepository.save(like);
        return ResponseEntity.ok(new LikeState(true));
    }

    @PostMapping("/posts/{postId}/reaction")
    public ResponseEntity<?> toggleReaction(@PathVariable Long postId, @RequestBody ReactionRequest request) {
        if (request == null || request.userId == null || request.emoji == null || request.emoji.isBlank()) {
            return ResponseEntity.badRequest().body("userId and emoji are required");
        }

        Optional<ExplorePost> postOpt = postRepository.findById(postId);
        Optional<User> userOpt = userRepository.findById(request.userId);
        if (postOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid post or user");
        }

        Optional<ExploreReaction> existing = reactionRepository.findByPostIdAndUserId(postId, request.userId);
        if (existing.isPresent()) {
            ExploreReaction reaction = existing.get();
            if (reaction.getEmoji() != null && reaction.getEmoji().equals(request.emoji)) {
                reactionRepository.delete(reaction);
                return ResponseEntity.ok(new ReactionState(false));
            }
            reaction.setEmoji(request.emoji);
            reaction.setCreatedAt(LocalDateTime.now());
            reactionRepository.save(reaction);
            return ResponseEntity.ok(new ReactionState(true));
        }

        ExploreReaction reaction = new ExploreReaction();
        reaction.setPost(postOpt.get());
        reaction.setUser(userOpt.get());
        reaction.setEmoji(request.emoji);
        reaction.setCreatedAt(LocalDateTime.now());
        reactionRepository.save(reaction);
        return ResponseEntity.ok(new ReactionState(true));
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long postId, @RequestBody CommentRequest request) {
        if (request == null || request.userId == null || request.text == null || request.text.isBlank()) {
            return ResponseEntity.badRequest().body("userId and text are required");
        }

        Optional<ExplorePost> postOpt = postRepository.findById(postId);
        Optional<User> userOpt = userRepository.findById(request.userId);
        if (postOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid post or user");
        }

        ExploreComment comment = new ExploreComment();
        comment.setPost(postOpt.get());
        comment.setUser(userOpt.get());
        comment.setText(request.text.trim());
        comment.setCreatedAt(LocalDateTime.now());
        ExploreComment saved = commentRepository.save(comment);
        return ResponseEntity.ok(toCommentResponse(saved));
    }

    @PostMapping("/follows")
    public ResponseEntity<?> follow(@RequestBody FollowRequest request) {
        if (request == null || request.followerId == null || request.followingId == null) {
            return ResponseEntity.badRequest().body("followerId and followingId are required");
        }
        if (request.followerId.equals(request.followingId)) {
            return ResponseEntity.badRequest().body("Cannot follow yourself");
        }

        Optional<User> followerOpt = userRepository.findById(request.followerId);
        Optional<User> followingOpt = userRepository.findById(request.followingId);
        if (followerOpt.isEmpty() || followingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid users");
        }

        if (followRepository.findByFollowerIdAndFollowingId(request.followerId, request.followingId).isPresent()) {
            return ResponseEntity.ok().build();
        }

        ExploreFollow follow = new ExploreFollow();
        follow.setFollower(followerOpt.get());
        follow.setFollowing(followingOpt.get());
        follow.setCreatedAt(LocalDateTime.now());
        followRepository.save(follow);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/follows")
    public ResponseEntity<?> unfollow(@RequestParam Long followerId, @RequestParam Long followingId) {
        Optional<ExploreFollow> existing = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (existing.isPresent()) {
            followRepository.delete(existing.get());
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/messages")
    public ResponseEntity<?> getMessages(@RequestParam Long userId, @RequestParam(name = "with") Long withUserId) {
        if (userRepository.findById(userId).isEmpty() || userRepository.findById(withUserId).isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid users");
        }
        List<ExploreMessageResponse> response = messageRepository.findConversation(userId, withUserId).stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/messages/threads")
    public ResponseEntity<?> getThreads(@RequestParam Long userId) {
        if (userRepository.findById(userId).isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        List<ExploreMessage> messages = messageRepository
                .findByFromUserIdOrToUserIdOrderByCreatedAtDesc(userId, userId);

        Map<Long, ExploreThreadSummary> threads = new LinkedHashMap<>();
        for (ExploreMessage message : messages) {
            User other = message.getFromUser().getId().equals(userId)
                    ? message.getToUser()
                    : message.getFromUser();
            if (other == null) continue;
            if (!threads.containsKey(other.getId())) {
                ExploreUserSummary userSummary = toUserSummary(other);
                threads.put(other.getId(), new ExploreThreadSummary(
                        other.getId(),
                        userSummary.name(),
                        userSummary.handle(),
                        userSummary.title(),
                        userSummary.avatarColor(),
                        userSummary.profilePicture(),
                        message.getText(),
                        message.getCreatedAt()
                ));
            }
        }

        return ResponseEntity.ok(new ArrayList<>(threads.values()));
    }

    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest request) {
        if (request == null || request.fromUserId == null || request.toUserId == null
                || request.text == null || request.text.isBlank()) {
            return ResponseEntity.badRequest().body("fromUserId, toUserId, and text are required");
        }
        Optional<User> fromOpt = userRepository.findById(request.fromUserId);
        Optional<User> toOpt = userRepository.findById(request.toUserId);
        if (fromOpt.isEmpty() || toOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid users");
        }
        ExploreMessage message = new ExploreMessage();
        message.setFromUser(fromOpt.get());
        message.setToUser(toOpt.get());
        message.setText(request.text.trim());
        message.setCreatedAt(LocalDateTime.now());
        ExploreMessage saved = messageRepository.save(message);
        return ResponseEntity.ok(toMessageResponse(saved));
    }

    private ExploreUserSummary toUserSummary(User user) {
        long followers = followRepository.countByFollowingId(user.getId());
        long following = followRepository.countByFollowerId(user.getId());
        long posts = postRepository.countByUserId(user.getId());

        String handle = user.getHandle();
        if (handle == null || handle.isBlank()) {
            handle = buildHandle(user.getName(), user.getEmail());
        }

        String title = user.getTitle();
        if (title == null || title.isBlank()) {
            title = "Calora Member";
        }

        String avatarColor = user.getAvatarColor();
        if (avatarColor == null || avatarColor.isBlank()) {
            avatarColor = "#4A9782";
        }

        return new ExploreUserSummary(
                user.getId(),
                user.getName() == null ? "Calora Member" : user.getName(),
                user.getEmail() == null ? "" : user.getEmail(),
                handle,
                title,
                avatarColor,
                user.getProfilePicture(),
                followers,
                following,
                posts
        );
    }

    private ExplorePostResponse toPostResponse(ExplorePost post) {
        List<Long> likes = likeRepository.findByPostId(post.getId()).stream()
                .map(like -> like.getUser().getId())
                .collect(Collectors.toList());

        Map<String, List<Long>> reactions = new LinkedHashMap<>();
        for (ExploreReaction reaction : reactionRepository.findByPostId(post.getId())) {
            String emoji = reaction.getEmoji();
            if (emoji == null) continue;
            reactions.computeIfAbsent(emoji, key -> new ArrayList<>()).add(reaction.getUser().getId());
        }

        List<ExploreCommentResponse> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId()).stream()
                .map(this::toCommentResponse)
                .collect(Collectors.toList());

        return new ExplorePostResponse(
                post.getId(),
                post.getUser().getId(),
                post.getType() != null ? post.getType().name().toLowerCase(Locale.ROOT) : "activity",
                post.getTitle(),
                post.getSummary(),
                defaultInt(post.getCalories()),
                post.getProtein(),
                post.getCarbs(),
                post.getFats(),
                post.getDuration(),
                post.getCreatedAt(),
                likes,
                reactions,
                comments
        );
    }

    private ExploreCommentResponse toCommentResponse(ExploreComment comment) {
        return new ExploreCommentResponse(
                comment.getId(),
                comment.getUser().getId(),
                comment.getText(),
                comment.getCreatedAt()
        );
    }

    private ExploreMessageResponse toMessageResponse(ExploreMessage message) {
        return new ExploreMessageResponse(
                message.getId(),
                message.getFromUser().getId(),
                message.getToUser().getId(),
                message.getText(),
                message.getCreatedAt()
        );
    }

    private ExplorePostType parsePostType(String value) {
        if (value == null) return ExplorePostType.ACTIVITY;
        String normalized = value.trim().toUpperCase(Locale.ROOT);
        if (normalized.equals("MEAL")) return ExplorePostType.MEAL;
        return ExplorePostType.ACTIVITY;
    }

    private int defaultInt(Integer value) {
        return value == null ? 0 : value;
    }

    private String buildHandle(String name, String email) {
        if (email != null && email.contains("@")) {
            return "@" + email.substring(0, email.indexOf("@"));
        }
        if (name == null || name.isBlank()) return "@calora";
        return "@" + name.toLowerCase(Locale.ROOT).replaceAll("\\s+", "");
    }

    public static class CreatePostRequest {
        public Long userId;
        public String type;
        public String title;
        public String summary;
        public Integer calories;
        public Integer protein;
        public Integer carbs;
        public Integer fats;
        public Integer duration;
    }

    public static class CommentRequest {
        public Long userId;
        public String text;
    }

    public static class ReactionRequest {
        public Long userId;
        public String emoji;
    }

    public static class FollowRequest {
        public Long followerId;
        public Long followingId;
    }

    public static class MessageRequest {
        public Long fromUserId;
        public Long toUserId;
        public String text;
    }

    public record ExploreUserSummary(
            Long id,
            String name,
            String email,
            String handle,
            String title,
            String avatarColor,
            String profilePicture,
            long followers,
            long following,
            long posts
    ) {}

    public record ExplorePostResponse(
            Long id,
            Long userId,
            String type,
            String title,
            String summary,
            int calories,
            Integer protein,
            Integer carbs,
            Integer fats,
            Integer duration,
            LocalDateTime createdAt,
            List<Long> likes,
            Map<String, List<Long>> reactions,
            List<ExploreCommentResponse> comments
    ) {}

    public record ExploreCommentResponse(
            Long id,
            Long userId,
            String text,
            LocalDateTime createdAt
    ) {}

    public record ExploreMessageResponse(
            Long id,
            Long fromUserId,
            Long toUserId,
            String text,
            LocalDateTime createdAt
    ) {}

    public record ExploreThreadSummary(
            Long withUserId,
            String withName,
            String withHandle,
            String withTitle,
            String withAvatarColor,
            String profilePicture,
            String lastMessage,
            LocalDateTime lastAt
    ) {}

    public record LikeState(boolean liked) {}

    public record ReactionState(boolean reacted) {}
}
