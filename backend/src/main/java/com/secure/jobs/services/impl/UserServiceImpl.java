package com.secure.jobs.services.impl;

import com.secure.jobs.dto.admin.UpdateUserModerationRequest;
import com.secure.jobs.dto.admin.UpdateUserModerationResponse;
import com.secure.jobs.dto.user.ChangeEmailResponse;
import com.secure.jobs.dto.user.ChangeUsernameResponse;
import com.secure.jobs.exceptions.ApiException;
import com.secure.jobs.exceptions.BadRequestException;
import com.secure.jobs.exceptions.ResourceNotFoundException;
import com.secure.jobs.mappers.AdminModerationMapper;
import com.secure.jobs.models.user.auth.PasswordResetToken;
import com.secure.jobs.models.user.auth.User;
import com.secure.jobs.repositories.PasswordResetTokenRepository;
import com.secure.jobs.repositories.UserRepository;
import com.secure.jobs.security.jwt.JwtUtils;
import com.secure.jobs.security.util.ResetTokenUtil;
import com.secure.jobs.services.EmailService;
import com.secure.jobs.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.secure.jobs.dto.admin.AdminUserPageResponse;
import com.secure.jobs.dto.admin.AdminUserResponse;
import com.secure.jobs.models.user.auth.AppRole;
import com.secure.jobs.specifications.AdminUserSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;
import java.util.List;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtils jwtUtils;
    private final com.secure.jobs.security.guards.AdminModerationGuard adminModerationGuard;

    @Value("${app.frontend.url:}")
    private String frontendUrl;

    @Override
    public User getMe(Long id) {
        return userRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));
    }

    @Override
public UpdateUserModerationResponse patchModeration(Long actingAdminId, Long userId, UpdateUserModerationRequest request) {
        adminModerationGuard.requireNotSelf(actingAdminId, userId);

        User user = userRepository.findById(userId)
                .orElseThrow(()-> new ResourceNotFoundException("User Not Found"));

        adminModerationGuard.requireNotAdmin(user);

        boolean changed = false;

        if(request.getEnabled() != null){
            user.setEnabled(request.getEnabled());
            changed = true;
        }
    if (request.getAccountNonLocked() != null) {
        user.setAccountNonLocked(request.getAccountNonLocked());
        changed = true;
    }
    if (!changed) {
        throw new ApiException("No moderation fields provided", HttpStatus.BAD_REQUEST);
    }
    return AdminModerationMapper.toUserModerationResponse(user);
}


    @Override
    @Transactional
    public void generatePasswordResetToken(String email) {

        // ✅ do NOT reveal whether email exists
        userRepository.findByEmail(email).ifPresent(user -> {

            // optional cleanup: invalidate previous unused tokens for this user
            passwordResetTokenRepository.deleteByUser_UserIdAndUsedAtIsNull(user.getUserId());

            String rawToken = ResetTokenUtil.generateRawToken();
            String tokenHash = ResetTokenUtil.sha256Hex(rawToken);

            PasswordResetToken token = PasswordResetToken.builder()
                    .user(user)
                    .tokenHash(tokenHash)
                    .createdAt(Instant.now())
                    .expiresAt(Instant.now().plus(24, ChronoUnit.HOURS))
                    .usedAt(null)
                    .build();

            passwordResetTokenRepository.save(token);

            String resetUrl = frontendUrl + "/reset-password?token=" + rawToken;
            emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);
        });
    }

    @Override
@Transactional(readOnly = true)
public AdminUserPageResponse searchUsers(
        Pageable pageable,
        String keyword,
        AppRole role,
        LocalDate from,
        LocalDate to
) {
    Specification<User> spec =
            Specification.where(AdminUserSpecifications.keyword(keyword))
                    .and(AdminUserSpecifications.createdBetween(from, to));

    if (role != null) {
        spec = spec.and(AdminUserSpecifications.hasRole(role));
    }

    Page<User> page = userRepository.findAll(spec, pageable);

    List<AdminUserResponse> users = page.getContent()
            .stream()
            .map(AdminModerationMapper::toAdminUserResponse)
            .toList();

    return new AdminUserPageResponse(
            users,
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isLast()
    );
}

    @Override
    @Transactional
    public void resetPassword(String rawToken, String newPassword) {

        String tokenHash = ResetTokenUtil.sha256Hex(rawToken);

        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token"));

        if (resetToken.isUsed()) {
            throw new BadRequestException("Password reset token has already been used");
        }

        if (resetToken.isExpired()) {
            throw new BadRequestException("Password reset token has expired");
        }

        User user = resetToken.getUser();

        // optional: block disabled users from resetting password
        // if (!user.isEnabled()) throw new RuntimeException("Account disabled");

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsedAt(Instant.now());
        passwordResetTokenRepository.save(resetToken);

        // optional cleanup: delete expired tokens
        passwordResetTokenRepository.deleteByExpiresAtBefore(Instant.now());
    }

    @Override
    @Transactional
    public ChangeUsernameResponse changeUsername(Long userId, String newUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!newUsername.equals(user.getUsername()) && userRepository.existsByUsername(newUsername)) {
            throw new BadRequestException("Username is already taken");
        }

        user.setUsername(newUsername);
        userRepository.save(user);

        // JWT subject is the username — issue a fresh token so the current
        // session isn't invalidated by the change.
        String newToken = jwtUtils.generateToken(newUsername);

        return new ChangeUsernameResponse(newUsername, newToken);
    }

    @Override
    @Transactional
    public ChangeEmailResponse changeEmail(Long userId, String newEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!newEmail.equals(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
            throw new BadRequestException("Email is already in use");
        }

        user.setEmail(newEmail);
        userRepository.save(user);

        return new ChangeEmailResponse(newEmail);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new ApiException("Current password is incorrect", HttpStatus.BAD_REQUEST);
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}