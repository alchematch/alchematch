package com.secure.jobs.mappers;

import com.secure.jobs.dto.admin.UpdateCompanyEnabledResponse;
import com.secure.jobs.dto.admin.UpdateUserModerationResponse;
import com.secure.jobs.models.company.Company;
import com.secure.jobs.models.user.auth.User;
import com.secure.jobs.dto.admin.AdminUserResponse;

public class AdminModerationMapper {

    public AdminModerationMapper(){}

    public static UpdateUserModerationResponse toUserModerationResponse(User user){

        return new UpdateUserModerationResponse(
                user.getUserId(),
                user.isEnabled(),
                user.isAccountNonLocked()
        );
    }

    public static UpdateCompanyEnabledResponse toCompanyModerationResponse(Company company){

        return new UpdateCompanyEnabledResponse(
                company.getId(),
                company.isEnabled()
        );
    }

    public static AdminUserResponse toAdminUserResponse(User user) {
        return new AdminUserResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getRoleName().name(),
                user.isEnabled(),
                user.isAccountNonLocked(),
                user.getCreatedDate()
        );
    }
}