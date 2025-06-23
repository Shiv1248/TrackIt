package com.shivansh.trackIt.controller;

import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.shivansh.trackIt.dto.*;
import com.shivansh.trackIt.entity.User;
import com.shivansh.trackIt.security.JwtUtil;
import com.shivansh.trackIt.service.UserService;

import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthenticationManager authManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(AuthenticationManager authManager, UserService userService, JwtUtil jwtUtil) {
        this.authManager = authManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest req) {
        User user = new User(null, req.getUsername(), req.getPassword(), LocalDateTime.now());
        userService.save(user);
        return "User registered!";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        String token = jwtUtil.generateToken(request.getUsername());
        return new AuthResponse(token);
    }

    @GetMapping("/me")
    public User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userService.findByUsername(username);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            // Invalidate the token by adding it to blacklist
            jwtUtil.invalidateToken(token);
            
            // Clear the security context
            SecurityContextHolder.clearContext();
            
            return ResponseEntity.ok("Successfully logged out");
        }
        
        return ResponseEntity.badRequest().body("No valid token found");
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        userService.deleteByUsername(username);
        return ResponseEntity.ok("User deleted successfully");
    }
}
