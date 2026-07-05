package com.secure.jobs;

import com.secure.jobs.models.user.auth.AppRole;
import com.secure.jobs.models.user.auth.Role;
import com.secure.jobs.models.user.auth.User;
import com.secure.jobs.repositories.RoleRepository;
import com.secure.jobs.repositories.UserRepository;
import com.secure.jobs.security.jwt.JwtUtils;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifies that a valid JWT is rejected with 401 when the account is
 * disabled or locked — i.e., the filter re-checks account status from
 * the DB on every request, not just at login time.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class DisabledUserJwtIT {

    private static final String ME_URL = "/api/users/me";

    @Autowired MockMvc mockMvc;
    @Autowired UserRepository userRepository;
    @Autowired RoleRepository roleRepository;
    @Autowired JwtUtils jwtUtils;

    // ── helpers ─────────────────────────────────────────────────────────────

    private Role ensureRole(AppRole name) {
        return roleRepository.findByRoleName(name)
                .orElseGet(() -> roleRepository.save(Role.builder().roleName(name).build()));
    }

    private User createActiveUser(String username) {
        return userRepository.save(User.builder()
                .username(username)
                .email(username + "@test.com")
                .passwordHash("x")
                .role(ensureRole(AppRole.ROLE_USER))
                .enabled(true)
                .accountNonLocked(true)
                .accountNonExpired(true)
                .credentialsNonExpired(true)
                .twoFactorEnabled(false)
                .build());
    }

    // ── tests ────────────────────────────────────────────────────────────────

    @Test
    void activeUser_withValidJwt_canAccessProtectedEndpoint() throws Exception {
        User user = createActiveUser("active_jwt_user_" + System.nanoTime());
        String jwt = jwtUtils.generateToken(user.getUsername());

        mockMvc.perform(get(ME_URL).header("Authorization", "Bearer " + jwt))
                .andExpect(status().isOk());
    }

    @Test
    void disabledUser_withValidJwt_isRejectedWith401() throws Exception {
        User user = createActiveUser("disabled_jwt_user_" + System.nanoTime());
        String jwt = jwtUtils.generateToken(user.getUsername());

        // Confirm JWT works while enabled
        mockMvc.perform(get(ME_URL).header("Authorization", "Bearer " + jwt))
                .andExpect(status().isOk());

        // Disable the account
        user.setEnabled(false);
        userRepository.save(user);

        // Same valid JWT must now be rejected
        mockMvc.perform(get(ME_URL).header("Authorization", "Bearer " + jwt))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void lockedUser_withValidJwt_isRejectedWith401() throws Exception {
        User user = createActiveUser("locked_jwt_user_" + System.nanoTime());
        String jwt = jwtUtils.generateToken(user.getUsername());

        // Lock the account
        user.setAccountNonLocked(false);
        userRepository.save(user);

        // Valid JWT must be rejected for a locked account
        mockMvc.perform(get(ME_URL).header("Authorization", "Bearer " + jwt))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void requestWithNoJwt_toProtectedEndpoint_returns401() throws Exception {
        mockMvc.perform(get(ME_URL))
                .andExpect(status().isUnauthorized());
    }
}
