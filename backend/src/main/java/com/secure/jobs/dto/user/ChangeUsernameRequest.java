package com.secure.jobs.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeUsernameRequest(
        @NotBlank(message = "username is required")
        @Size(max = 100, message = "username must be 100 characters or fewer")
        String username
) {}