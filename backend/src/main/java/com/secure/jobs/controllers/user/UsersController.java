package com.secure.jobs.controllers.user;

import com.secure.jobs.dto.user.ChangeEmailRequest;
import com.secure.jobs.dto.user.ChangeEmailResponse;
import com.secure.jobs.dto.user.ChangePasswordRequest;
import com.secure.jobs.dto.user.ChangeUsernameRequest;
import com.secure.jobs.dto.user.ChangeUsernameResponse;
import com.secure.jobs.dto.user.MeBasicResponse;
import com.secure.jobs.dto.user.UserResponse;
import com.secure.jobs.mappers.UserMapper;
import com.secure.jobs.models.user.auth.User;
import com.secure.jobs.models.company.CompanyApplicationStatus;
import com.secure.jobs.repositories.CompanyApplicationRepository;
import com.secure.jobs.security.services.UserDetailsImpl;
import com.secure.jobs.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UsersController {


    private final UserService userService;
    private final CompanyApplicationRepository companyApplicationRepository;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UserResponse getMyDetails(@AuthenticationPrincipal UserDetailsImpl userDetails){

        User  user = userService.getMe(userDetails.getId());

        CompanyApplicationStatus status =
                companyApplicationRepository.findStatusByUserId(userDetails.getId()).orElse(null);

        return UserMapper.toResponse(user, status);
    }

    @GetMapping("/me/basic")
    @PreAuthorize("isAuthenticated()")
    public MeBasicResponse meBasic(@AuthenticationPrincipal UserDetailsImpl userDetails) {

        String role = userDetails.getAuthorities()
                .stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse(null);

        return new MeBasicResponse(
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                role,
                userDetails.isEnabled()
        );
    }

    @PatchMapping("/me/username")
    @PreAuthorize("isAuthenticated()")
    public ChangeUsernameResponse changeUsername(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody @Valid ChangeUsernameRequest request
    ) {
        return userService.changeUsername(userDetails.getId(), request.username());
    }

    @PatchMapping("/me/email")
    @PreAuthorize("isAuthenticated()")
    public ChangeEmailResponse changeEmail(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody @Valid ChangeEmailRequest request
    ) {
        return userService.changeEmail(userDetails.getId(), request.email());
    }

    @PatchMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody @Valid ChangePasswordRequest request
    ) {
        userService.changePassword(userDetails.getId(), request.currentPassword(), request.newPassword());
        return ResponseEntity.noContent().build();
    }
}