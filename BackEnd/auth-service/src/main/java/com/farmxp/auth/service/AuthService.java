package com.farmxp.auth.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.farmxp.auth.dto.AdminCreateRequest;
import com.farmxp.auth.dto.AdminUserResponse;
import com.farmxp.auth.dto.LoginRequest;
import com.farmxp.auth.dto.RegisterRequest;
import com.farmxp.auth.entity.Role;
import com.farmxp.auth.entity.User;
import com.farmxp.auth.repository.UserRepository;
import com.farmxp.auth.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

        // Public registration can create FARMER only
        user.setRole(Role.FARMER);

        user.setActive(true);

        return userRepository.save(user);
    }

    // =========================
    // LOGIN
    // =========================

    public User login(LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid username or password"
                        )
                );

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new RuntimeException("Account is inactive");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid username or password"
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

    // =========================
    // CHANGE PASSWORD
    // =========================

    public void changePassword(
            String username,
            String currentPassword,
            String newPassword) {

        User user = userRepository
                .findByUsername(username)
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
    
    public List<AdminUserResponse> getAdminUsers() {

        return userRepository.findByRole(Role.ADMIN)
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getUserId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getActive()
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
                user.getRole().name(),
                user.getActive()
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
                saved.getRole().name(),
                saved.getActive()
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
                saved.getRole().name(),
                saved.getActive()
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
}