package com.secure.jobs.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "username is required")
    @Size(max = 100, message = "username must be 100 characters or fewer")
    private String username;

    @NotBlank(message = "email is required")
    @Email(message = "email must be a valid email address")
    @Size(max = 254, message = "email must be 254 characters or fewer")
    private String email;

    @NotBlank(message = "password is required")
    @Size(min = 8, max = 120, message = "password must be between 8 and 120 characters")
    private String password;
}
