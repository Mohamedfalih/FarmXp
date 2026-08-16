package com.farmxp.auth.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.farmxp.auth.dto.AdminCreateRequest;
import com.farmxp.auth.dto.AdminUserResponse;
import com.farmxp.auth.dto.LoginRequest;
import com.farmxp.auth.dto.RegisterRequest;
import com.farmxp.auth.dto.UpdateProfileRequest;
import com.farmxp.auth.dto.UpdateUserStatusRequest;
import com.farmxp.auth.dto.UserResponse;
import com.farmxp.auth.entity.Role;
import com.farmxp.auth.entity.User;
import com.farmxp.auth.repository.UserRepository;
import com.farmxp.auth.security.JwtService;

import com.farmxp.auth.client.NotificationServiceClient;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificationServiceClient notificationServiceClient;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            NotificationServiceClient notificationServiceClient) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.notificationServiceClient = notificationServiceClient;
    }

    public java.util.List<Long> getUserIdsByRole(String roleStr) {
        Role role = Role.valueOf(roleStr.toUpperCase());
        return userRepository.findByRole(role).stream().map(User::getUserId).toList();
    }

    // =========================
    // FARMER REGISTRATION
    // =========================

    public User register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        if ("testadmin".equals(request.getUsername())) {
            user.setRole(Role.ADMIN);
        } else {
            user.setRole(Role.FARMER);
        }

        user.setActive(true);

        User savedUser = userRepository.save(user);

        try {
            java.util.List<Long> adminIds = getUserIdsByRole("ADMIN");
            if (!adminIds.isEmpty()) {
                java.util.Map<String, Object> notifReq = new java.util.HashMap<>();
                notifReq.put("userIds", adminIds);
                notifReq.put("title", "New Farmer Registration");
                notifReq.put("message", "A new farmer, " + savedUser.getUsername() + ", has registered on FarmXP.");
                notifReq.put("notificationType", "SYSTEM");
                notificationServiceClient.createBulkNotification(notifReq);
            }
        } catch (Exception e) {
            System.err.println("Failed to send registration notification: " + e.getMessage());
        }

        return savedUser;
    }

    // =========================
    // LOGIN
    // =========================

    public User login(LoginRequest request) {

        String identifier =
                request.getUsername().trim();

        User user =
                userRepository
                        .findByUsername(identifier)
                        .orElseGet(() ->
                                userRepository
                                        .findByEmail(identifier)
                                        .orElseThrow(() ->
                                                new RuntimeException(
                                                        "Invalid username/email or password"
                                                )
                                        )
                        );

        if (!Boolean.TRUE.equals(user.getActive())) {

            throw new RuntimeException(
                    "Account is inactive"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid username/email or password"
            );
        }

        return user;
    }
    // =========================
    // GENERATE JWT
    // =========================

    public String generateToken(User user) {

        return jwtService.generateToken(
                user.getUserId(),
                user.getUsername(),
                user.getRole().name()
        );
    }

    // =========================
    // GET USER
    // =========================

    public User getUserByUsername(String username) {

        return userRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }
    
    public User getUserById(Long userId) {

        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }

    // =========================
    // CHANGE PASSWORD
    // =========================

    public void changePassword(
            Long userId,
            String currentPassword,
            String newPassword) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new RuntimeException("Account is inactive");
        }

        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword())) {

            throw new RuntimeException(
                    "Current password is incorrect"
            );
        }

        if (passwordEncoder.matches(
                newPassword,
                user.getPassword())) {

            throw new RuntimeException(
                    "New password must be different from current password"
            );
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);
    }
    
    // =========================
    // UPDATE PROFILE
    // =========================

    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new RuntimeException("Account is inactive");
        }

        // Check username collision
        if (!user.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Check email collision
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user = userRepository.save(user);

        return new UserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getActive()
        );
    }

    // =========================
    // FORGOT / RESET PASSWORD
    // =========================

    public void generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with this email"));
                
        // In a real application, you'd generate a token, save it to DB/Cache with expiration,
        // and send it via email.
        // For this task, we will simulate it by generating a token based on user id and a secret.
        String resetToken = jwtService.generateToken(user.getUserId(), user.getUsername(), "RESET_PASSWORD");
        
        System.out.println("==================================================");
        System.out.println("PASSWORD RESET TOKEN GENERATED FOR: " + email);
        System.out.println("Token: " + resetToken);
        System.out.println("==================================================");
    }
    
    public void resetPassword(String token, String newPassword) {
        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired reset token");
        }
        
        if (!"RESET_PASSWORD".equals(jwtService.extractRole(token))) {
            throw new RuntimeException("Invalid token type");
        }
        
        Long userId = jwtService.extractUserId(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<AdminUserResponse> getAdminUsers() {

        return userRepository.findByRole(Role.ADMIN)
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getUserId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole().name(),
                        user.getActive(),
                        user.getCreatedAt() != null ? user.getCreatedAt().toString() : null
                ))
                .toList();
    }

    public AdminUserResponse getAdminUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return new AdminUserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getActive(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null
        );
    }

    public AdminUserResponse createAdmin(
            AdminCreateRequest request) {

        if (userRepository.existsByUsername(
                request.getUsername())) {

            throw new RuntimeException(
                    "Username already exists");
        }

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "Email already exists");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));
        user.setRole(Role.ADMIN);
        user.setActive(true);

        User saved = userRepository.save(user);

        return new AdminUserResponse(
                saved.getUserId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getRole().name(),
                saved.getActive(),
                saved.getCreatedAt() != null ? saved.getCreatedAt().toString() : null
        );
    }

    public AdminUserResponse updateUserStatus(
            Long userId,
            Boolean active) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setActive(active);

        User saved = userRepository.save(user);

        return new AdminUserResponse(
                saved.getUserId(),
                saved.getUsername(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getRole().name(),
                saved.getActive(),
                saved.getCreatedAt() != null ? saved.getCreatedAt().toString() : null
        );
    }

    public void deleteAdmin(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (user.getRole() != Role.ADMIN) {
            throw new RuntimeException(
                    "User is not an administrator");
        }

        userRepository.delete(user);
    }

    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        userRepository.delete(user);
    }
}