package com.thefashionschool.theFashionSchool.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.io.Serializable;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationMs;

    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                // CORRECT: Set the subject to the unique username. This is standard.
                .setSubject(userPrincipal.getUsername())
                // OPTIONAL BUT GOOD PRACTICE: Add other info as custom claims.
                .claim("email", userPrincipal.getEmail()) // Add email as a claim if we need it elsewhere
                .claim("role", userPrincipal.getRole().name())

                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key key() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getUserNameFromJwtToken(String token) {
        // Remove "Bearer " prefix if present
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parse(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
    public boolean validateToken(String token) {
        try {
            // Add debug logging
            logger.info("Validating token: " + token);

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key())
                    .setAllowedClockSkewSeconds(120) // Allow 2 minute clock skew
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            logger.info("Token validated for: " + claims.getSubject());
            return true;
        } catch (Exception e) {
            logger.error("Token validation error: " + e.getMessage());
            return false;
        }
    }

    public Serializable getExpirationFromJwtToken(String token) {
        return jwtExpirationMs;
    }
}