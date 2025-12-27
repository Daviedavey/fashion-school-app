package com.thefashionschool.theFashionSchool.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthEntryPoint authEntryPoint;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtils jwtUtils;

    public SecurityConfig(JwtAuthEntryPoint authEntryPoint,
                          UserDetailsServiceImpl userDetailsService,
                          JwtUtils jwtUtils) {
        this.authEntryPoint = authEntryPoint;
        this.userDetailsService = userDetailsService;
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(authEntryPoint)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints for authentication
                        .requestMatchers("/api/auth/**").permitAll()
                        // Public endpoint for serving images
                        .requestMatchers("/api/images/**").permitAll()
                        // Rule for GET on /api/blog: a public, read-only view
                        .requestMatchers(HttpMethod.GET, "/api/blog", "/api/blog/**").permitAll()
                        // Allow anyone (even unauthenticated users) to see the list of groups for registration
                        .requestMatchers(HttpMethod.GET, "/api/groups").permitAll()

                        // ROLE-SPECIFIC RULES
                        // Rule for POST on /api/blog: only teachers can create posts
                        .requestMatchers(HttpMethod.POST, "/api/blog").hasAuthority("ROLE_TEACHER")
                        // .requestMatchers(HttpMethod.DELETE, "/api/blog/**").hasAuthority("ROLE_TEACHER")
                        // The service layer will then check if they are the OWNER.
                        .requestMatchers(HttpMethod.DELETE, "/api/blog/**").authenticated()
                        // ONLY teachers can create Assignments
                        .requestMatchers(HttpMethod.POST, "/api/assignments").hasAuthority("ROLE_TEACHER")
                        // any logged-in user can view Assignments
                        // This includes both getting the list and downloading files
                        .requestMatchers(HttpMethod.GET, "/api/assignments", "/api/assignments/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/fashion-icon").hasAuthority("ROLE_TEACHER")
                        // Authenticated users (students) can view the current icon
                        .requestMatchers(HttpMethod.GET, "/api/fashion-icon/current").authenticated()


                        // All other requests not specified above must be authenticated
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:8081", // For the ios Simulator
                "http://10.0.2.2:8081",  // For the Android Emulator
                "http://192.168.*.*:8081" // For physical devices on your local Wi-Fi
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtils, userDetailsService);
    }
}