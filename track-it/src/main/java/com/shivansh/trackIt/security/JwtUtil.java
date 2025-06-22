package com.shivansh.trackit.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Set;

@Component
public class JwtUtil {

    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256); // ✅ secure random key
    private final long expiration = 3600000; // 1 hour
    
    // In-memory blacklist for invalidated tokens
    // In production, use Redis for distributed systems
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean validateToken(String token) {
        try {
            // Check if token is blacklisted
            if (blacklistedTokens.contains(token)) {
                return false;
            }
            
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    public void invalidateToken(String token) {
        blacklistedTokens.add(token);
    }
    
    // Clean up expired tokens from blacklist periodically
    public void cleanupExpiredTokens() {
        blacklistedTokens.removeIf(token -> {
            try {
                getClaims(token);
                return false; // Token is still valid, keep it
            } catch (JwtException | IllegalArgumentException e) {
                return true; // Token is expired/invalid, remove from blacklist
            }
        });
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
