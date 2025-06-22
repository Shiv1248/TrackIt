package com.shivansh.trackit.controller;

import com.shivansh.trackit.service.SubscriptionService;
import com.shivansh.trackit.entity.Subscription;
import com.shivansh.trackit.entity.User;
import com.shivansh.trackit.service.UserService;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Subscription> create(@RequestBody Subscription subscription) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
    
        User user = userService.findByUsername(username);
        subscription.setUser(user);
        Subscription savedSubscription = subscriptionService.save(subscription);
        return ResponseEntity.ok(savedSubscription);
    }

    @GetMapping
    public List<Subscription> getAll() {
        return subscriptionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subscription> getSubscription(@PathVariable Long id) {
        Subscription subscription = subscriptionService.findById(id);
        if (subscription == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(subscription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubscription(@PathVariable Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        
        User user = userService.findByUsername(username);
        
        Subscription subscription = subscriptionService.findById(id);
        if (subscription == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!subscription.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You can only delete your own subscriptions");
        }
        
        subscriptionService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subscription> updateSubscription(@PathVariable Long id, @RequestBody Subscription updatedSubscription) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        User user = userService.findByUsername(username);
        
        Subscription existingSubscription = subscriptionService.findById(id);
        if (existingSubscription == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingSubscription.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        existingSubscription.setName(updatedSubscription.getName());
        existingSubscription.setAmount(updatedSubscription.getAmount());
        existingSubscription.setFrequency(updatedSubscription.getFrequency());
        existingSubscription.setNextRenewalDate(updatedSubscription.getNextRenewalDate());
        existingSubscription.setNotificationChannel(updatedSubscription.getNotificationChannel());
        
        Subscription savedSubscription = subscriptionService.save(existingSubscription);
        return ResponseEntity.ok(savedSubscription);
    }
}
