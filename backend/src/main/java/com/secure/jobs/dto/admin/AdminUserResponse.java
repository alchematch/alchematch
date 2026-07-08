package com.secure.jobs.dto.admin;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long userId,
        String username,
        String email,
        String role,
        boolean enabled,
        boolean accountNonLocked,
        LocalDateTime createdDate
) {}