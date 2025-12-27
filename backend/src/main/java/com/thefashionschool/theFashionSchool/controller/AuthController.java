package com.thefashionschool.theFashionSchool.controller;

import com.thefashionschool.theFashionSchool.dto.LoginRequest;
import com.thefashionschool.theFashionSchool.dto.LoginResponse;
import com.thefashionschool.theFashionSchool.security.JwtUtils;
import com.thefashionschool.theFashionSchool.security.UserDetailsImpl;
import com.thefashionschool.theFashionSchool.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import com.thefashionschool.theFashionSchool.dto.RegisterRequest;
import com.thefashionschool.theFashionSchool.dto.RegisterResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @Autowired
    JwtUtils jwtUtils;

    private static final Logger logger = LoggerFactory.getLogger(BlogController.class);


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        RegisterResponse response = authService.registerUser(registerRequest);

        if (!response.isSuccess()) {
            return ResponseEntity
                    .badRequest()
                    .body(response);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Add debug logging
            logger.info("Attempting authentication for: {}", loginRequest.getUsername());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Verify authentication
            if (authentication == null || !authentication.isAuthenticated()) {
                throw new AuthenticationServiceException("Authentication failed");
            }

            String jwt = jwtUtils.generateJwtToken(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            logger.info("Successful login for: {}", userDetails.getUsername());

            return ResponseEntity.ok(new LoginResponse(
                    jwt,
                    userDetails.getUsername(),
                    userDetails.getRole(),// Ensure this returns String
                    userDetails.getName(),
                    userDetails.getSurname(),
                    userDetails.getEmail()

            ));

        } catch (BadCredentialsException e) {
            logger.warn("Bad credentials for: {}", loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("error", "Invalid credentials")
            );
        } catch (AuthenticationServiceException e) {
            logger.error("Authentication service error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Authentication service unavailable")
            );
        } catch (Exception e) {
            logger.error("Unexpected error during authentication: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("error", "Internal server error")
            );
        }
    }


// AuthController.java
    @GetMapping("/api/auth/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            boolean isValid = jwtUtils.validateJwtToken(jwt);
            return ResponseEntity.ok().body(Map.of("valid", isValid));
        } catch (Exception e) {
            return ResponseEntity.ok().body(Map.of("valid", false));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));
        return errors;
    }

    @GetMapping("/debug/verify-token")
    public ResponseEntity<?> verifyToken(@RequestParam String token) {
        try {
            String username = jwtUtils.getUserNameFromJwtToken(token);
            boolean valid = jwtUtils.validateJwtToken(token);
            return ResponseEntity.ok(Map.of(
                    "username", username,
                    "valid", valid,
                    "expires", jwtUtils.getExpirationFromJwtToken(token)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}