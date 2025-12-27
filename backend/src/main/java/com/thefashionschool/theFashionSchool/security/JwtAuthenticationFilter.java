package com.thefashionschool.theFashionSchool.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtils jwtUtils, UserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // This list contains all the paths that the JWT filter should IGNORE.
        List<AntPathRequestMatcher> skippedPaths = Arrays.asList(
                new AntPathRequestMatcher("/api/auth/**"),
                new AntPathRequestMatcher("/api/images/**"),
                new AntPathRequestMatcher("/api/blog", "GET"),// Important: only skip GET for /api/blog
                new AntPathRequestMatcher("/api/groups", "GET")
        );

        return skippedPaths.stream().anyMatch(matcher -> matcher.matches(request));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // Skip filter for public endpoints
            if (request.getServletPath().startsWith("/api/auth")) {
                filterChain.doFilter(request, response);
                return;
            }

            String jwt = parseJwt(request);

            if (jwt == null) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: No token provided");
                return;
            }

            if (!jwtUtils.validateJwtToken(jwt)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: Invalid token");
                return;
            }

            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        return (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer "))
                ? headerAuth.substring(7)
                : null;
    }
}