package com.secure.jobs;

import com.secure.jobs.models.user.auth.AppRole;
import com.secure.jobs.models.user.auth.Role;
import com.secure.jobs.models.user.auth.User;
import com.secure.jobs.repositories.RoleRepository;
import com.secure.jobs.repositories.UserRepository;
import com.secure.jobs.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifies that company-application and candidate-profile endpoints return
 * 400 Bad Request when the request body fails Bean Validation constraints.
 *
 * @WithMockUser is overridden by the stateless SecurityContextHolderFilter, so we
 * use SecurityMockMvcRequestPostProcessors.authentication() with a real UserDetailsImpl —
 * the same pattern used in CompanyIsolationIT. Validation fires before any service or
 * repository logic, so the user only needs to exist as a security principal.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProfileAndCompanyAppValidationIT {

    private static final String COMPANY_APP_URL = "/api/company-applications";
    private static final String PROFILE_URL     = "/api/users/me/profile";
    private static final String RESUME_URL      = "/api/users/me/profile/resume";

    @Autowired MockMvc          mockMvc;
    @Autowired UserRepository   userRepository;
    @Autowired RoleRepository   roleRepository;

    /** Reused across all tests in this class. */
    private RequestPostProcessor userAuth;

    @BeforeEach
    void setUpUserPrincipal() {
        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseGet(() -> roleRepository.save(
                        Role.builder().roleName(AppRole.ROLE_USER).build()));

        User user = userRepository.save(User.builder()
                .username("val_user_" + System.nanoTime())
                .email("val_" + System.nanoTime() + "@test.com")
                .passwordHash("x")
                .role(userRole)
                .enabled(true)
                .accountNonLocked(true)
                .accountNonExpired(true)
                .credentialsNonExpired(true)
                .twoFactorEnabled(false)
                .build());

        UserDetailsImpl principal = UserDetailsImpl.build(user);
        var auth = new UsernamePasswordAuthenticationToken(
                principal, null, principal.getAuthorities());
        userAuth = SecurityMockMvcRequestPostProcessors.authentication(auth);
    }

    // ── POST /api/company-applications ───────────────────────────────────────

    @Test
    void applyForCompany_withBlankCompanyName_returns400() throws Exception {
        mockMvc.perform(post(COMPANY_APP_URL).with(userAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "companyName": "",
                                  "documentPublicId": "abc123",
                                  "documentUrl": "https://example.com/doc.pdf"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void applyForCompany_withCompanyNameTooLong_returns400() throws Exception {
        String tooLong = "A".repeat(151);
        mockMvc.perform(post(COMPANY_APP_URL).with(userAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"companyName\":\"" + tooLong + "\","
                                + "\"documentPublicId\":\"abc\","
                                + "\"documentUrl\":\"https://example.com/doc.pdf\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void applyForCompany_withBlankDocumentUrl_returns400() throws Exception {
        mockMvc.perform(post(COMPANY_APP_URL).with(userAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "companyName": "Acme Ltd",
                                  "documentPublicId": "abc123",
                                  "documentUrl": ""
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void applyForCompany_withDocumentUrlTooLong_returns400() throws Exception {
        String tooLong = "https://cdn.example.com/" + "x".repeat(480);
        mockMvc.perform(post(COMPANY_APP_URL).with(userAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"companyName\":\"Acme Ltd\","
                                + "\"documentPublicId\":\"abc\","
                                + "\"documentUrl\":\"" + tooLong + "\"}"))
                .andExpect(status().isBadRequest());
    }

    // ── PATCH /api/users/me/profile ───────────────────────────────────────────

    @Test
    void updateProfile_withPhoneTooLong_returns400() throws Exception {
        String tooLong = "1".repeat(31);
        mockMvc.perform(patch(PROFILE_URL).with(userAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"phone\":\"" + tooLong + "\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProfile_withLocationTooLong_returns400() throws Exception {
        String tooLong = "a".repeat(121);
        mockMvc.perform(patch(PROFILE_URL).with(userAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"location\":\"" + tooLong + "\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateProfile_withNegativeYearsExperience_returns400() throws Exception {
        mockMvc.perform(patch(PROFILE_URL).with(userAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"yearsExperience": -1.0}
                                """))
                .andExpect(status().isBadRequest());
    }

    // ── PUT /api/users/me/profile/resume ──────────────────────────────────────

    @Test
    void updateResume_withResumeUrlTooLong_returns400() throws Exception {
        String tooLong = "https://cdn.example.com/" + "x".repeat(480);
        mockMvc.perform(put(RESUME_URL).with(userAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"resumeUrl\":\"" + tooLong + "\","
                                + "\"resumePublicId\":\"abc\"}"))
                .andExpect(status().isBadRequest());
    }
}
