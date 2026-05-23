package com.secure.jobs.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.secure.jobs.exceptions.ApiErrorWriter;
import com.secure.jobs.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthEntryPoint authEntryPoint;
    private final ObjectMapper objectMapper;

    public JwtAuthenticationFilter(
            JwtUtils jwtUtils,
            UserDetailsServiceImpl userDetailsService,
            JwtAuthEntryPoint authEntryPoint,
            ObjectMapper objectMapper
    ) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.authEntryPoint = authEntryPoint;
        this.objectMapper = objectMapper;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            // If token is present but invalid => respond 401 immediately (no /error forwarding)
            if (!jwtUtils.validateToken(token)) {
                SecurityContextHolder.clearContext();
                authEntryPoint.commence(
                        request,
                        response,
                        new BadCredentialsException("Invalid or expired token")
                );
                return;
            }

            String username = jwtUtils.extractUsernameIfValid(token);

            if (username == null) {
                SecurityContextHolder.clearContext();
                authEntryPoint.commence(
                        request,
                        response,
                        new BadCredentialsException("Invalid or expired token")
                );
                return;
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Reject requests from disabled, locked, expired, or credentials-expired accounts.
            // UserDetails is loaded fresh from the DB on every request, so this check reflects
            // the current account state even if the JWT itself is still valid.
            if (!userDetails.isEnabled()
                    || !userDetails.isAccountNonLocked()
                    || !userDetails.isAccountNonExpired()
                    || !userDetails.isCredentialsNonExpired()) {
                SecurityContextHolder.clearContext();
                ApiErrorWriter.write(
                        objectMapper,
                        request,
                        response,
                        HttpStatus.UNAUTHORIZED,
                        "Account is disabled or locked"
                );
                return;
            }

            var authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
