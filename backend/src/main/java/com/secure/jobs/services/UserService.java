package com.secure.jobs.services;

import com.secure.jobs.dto.admin.UpdateUserModerationRequest;
import com.secure.jobs.dto.admin.UpdateUserModerationResponse;
import com.secure.jobs.dto.user.ChangeEmailResponse;
import com.secure.jobs.dto.user.ChangeUsernameResponse;
import com.secure.jobs.models.user.auth.User;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import com.secure.jobs.dto.admin.AdminUserPageResponse;
import com.secure.jobs.models.user.auth.AppRole;
import org.springframework.data.domain.Pageable;
import java.time.LocalDate;

public interface UserService {
    User getMe(Long id);

    UpdateUserModerationResponse patchModeration(Long actingAdminId, Long userId, @Valid UpdateUserModerationRequest request);

    void generatePasswordResetToken(@NotBlank @Email String email);

    void resetPassword(@NotBlank String token, @NotBlank @Size(min = 8, max = 72) String s);

    AdminUserPageResponse searchUsers(Pageable pageable, String keyword, AppRole role, LocalDate from, LocalDate to);

    ChangeUsernameResponse changeUsername(Long userId, @NotBlank @Size(max = 100) String newUsername);

    ChangeEmailResponse changeEmail(Long userId, @NotBlank @Email @Size(max = 50) String newEmail);

    void changePassword(Long userId, @NotBlank String currentPassword, @NotBlank @Size(min = 8, max = 72) String newPassword);
}