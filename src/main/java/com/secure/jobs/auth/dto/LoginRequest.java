package com.secure.jobs.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "username is required")
    @Size(max = 50, message = "username must be 50 characters or fewer")
    private String username;

    @NotBlank(message = "password is required")
    @Size(max = 120, message = "password must be 120 characters or fewer")
    private String password;
}
