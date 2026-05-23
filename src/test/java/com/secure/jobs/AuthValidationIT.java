package com.secure.jobs;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifies that auth endpoints return 400 Bad Request when the request body
 * fails Jakarta Bean Validation constraints. Validation fires before any
 * service or repository logic, so no DB seed is required.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthValidationIT {

    private static final String LOGIN_URL          = "/api/auth/login";
    private static final String REGISTER_URL       = "/api/auth/register";
    private static final String FORGOT_URL         = "/api/auth/forgot-password";
    private static final String RESET_URL          = "/api/auth/reset-password";

    @Autowired MockMvc mockMvc;

    // ── /api/auth/login ──────────────────────────────────────────────────────

    @Test
    void login_withBlankUsername_returns400() throws Exception {
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "", "password": "validPass1"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_withMissingUsername_returns400() throws Exception {
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"password": "validPass1"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_withBlankPassword_returns400() throws Exception {
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "someuser", "password": ""}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_withUsernameTooLong_returns400() throws Exception {
        String tooLong = "a".repeat(51);
        mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"" + tooLong + "\", \"password\": \"validPass1\"}"))
                .andExpect(status().isBadRequest());
    }

    // ── /api/auth/register ───────────────────────────────────────────────────

    @Test
    void register_withBlankUsername_returns400() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "", "email": "a@b.com", "password": "Password1"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_withBlankEmail_returns400() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "newuser", "email": "", "password": "Password1"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_withInvalidEmail_returns400() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "newuser", "email": "not-an-email", "password": "Password1"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_withShortPassword_returns400() throws Exception {
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username": "newuser", "email": "a@b.com", "password": "short"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_withEmailTooLong_returns400() throws Exception {
        // 255 chars local-part alone far exceeds the 254-char total limit
        String tooLong = "a".repeat(255) + "@example.com";
        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\": \"newuser\", \"email\": \"" + tooLong + "\", \"password\": \"Password1\"}"))
                .andExpect(status().isBadRequest());
    }

    // ── /api/auth/forgot-password ────────────────────────────────────────────

    @Test
    void forgotPassword_withBlankEmail_returns400() throws Exception {
        mockMvc.perform(post(FORGOT_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email": ""}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void forgotPassword_withInvalidEmail_returns400() throws Exception {
        mockMvc.perform(post(FORGOT_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email": "notanemail"}
                                """))
                .andExpect(status().isBadRequest());
    }

    // ── /api/auth/reset-password ─────────────────────────────────────────────

    @Test
    void resetPassword_withBlankToken_returns400() throws Exception {
        mockMvc.perform(post(RESET_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"token": "", "newPassword": "NewPassword1"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void resetPassword_withShortNewPassword_returns400() throws Exception {
        mockMvc.perform(post(RESET_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"token": "some-valid-token", "newPassword": "short"}
                                """))
                .andExpect(status().isBadRequest());
    }
}
