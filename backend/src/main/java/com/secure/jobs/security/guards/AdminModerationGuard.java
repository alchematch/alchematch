package com.secure.jobs.security.guards;

import com.secure.jobs.exceptions.ApiException;
import com.secure.jobs.models.user.auth.AppRole;
import com.secure.jobs.models.user.auth.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class AdminModerationGuard {

    public void requireNotSelf(Long actingAdminId, Long targetUserId) {
        if (actingAdminId.equals(targetUserId)) {
            throw new ApiException("You cannot moderate your own account", HttpStatus.FORBIDDEN);
        }
    }

    public void requireNotAdmin(User targetUser) {
        AppRole targetRole = targetUser.getRole().getRoleName();
        if (targetRole == AppRole.ROLE_ADMIN || targetRole == AppRole.ROLE_SUPER_ADMIN) {
            throw new ApiException("Admin accounts cannot be moderated from this panel", HttpStatus.FORBIDDEN);
        }
    }
}