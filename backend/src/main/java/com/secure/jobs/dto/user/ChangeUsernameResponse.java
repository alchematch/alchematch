package com.secure.jobs.dto.user;

public record ChangeUsernameResponse(
        String username,
        String accessToken
) {}