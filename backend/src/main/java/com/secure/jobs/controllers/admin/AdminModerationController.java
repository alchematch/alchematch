package com.secure.jobs.controllers.admin;

import com.secure.jobs.dto.admin.UpdateCompanyEnabledRequest;
import com.secure.jobs.dto.admin.UpdateCompanyEnabledResponse;
import com.secure.jobs.dto.admin.UpdateUserModerationRequest;
import com.secure.jobs.dto.admin.UpdateUserModerationResponse;
import com.secure.jobs.mappers.AdminModerationMapper;
import com.secure.jobs.models.company.Company;
import com.secure.jobs.models.user.auth.User;
import com.secure.jobs.services.CompanyService;
import com.secure.jobs.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.secure.jobs.dto.admin.AdminUserPageResponse;
import com.secure.jobs.models.user.auth.AppRole;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;
import com.secure.jobs.security.services.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminModerationController {
    private final UserService userService;
    private final CompanyService companyService;


    @PatchMapping("/users/{userId}/moderation")
    public UpdateUserModerationResponse patchUserModeration(
            @AuthenticationPrincipal UserDetailsImpl admin,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserModerationRequest request
    ){
        return userService.patchModeration(admin.getId(), userId, request);
    }

    @PatchMapping("/companies/{companyId}/enabled")
    public UpdateCompanyEnabledResponse patchCompanyEnabled(
            @PathVariable Long companyId,
            @Valid @RequestBody UpdateCompanyEnabledRequest  request
            ){
        return companyService.setEnabled(companyId, request.getEnabled());
    }

    @GetMapping("/users")
public AdminUserPageResponse listUsers(
        @PageableDefault(page = 0, size = 20) Pageable pageable,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) AppRole role,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate from,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate to
) {
    Pageable locked = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "createdDate")
    );
    return userService.searchUsers(locked, keyword, role, from, to);
}

}
