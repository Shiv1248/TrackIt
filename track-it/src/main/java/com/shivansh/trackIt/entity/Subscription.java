package com.shivansh.trackit.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double amount;
    private String frequency;
    private LocalDateTime nextRenewalDate;
    private LocalDateTime createdAt = LocalDateTime.now();
    private String notificationChannel;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Subscription() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }

    public LocalDateTime getNextRenewalDate() { return nextRenewalDate; }
    public void setNextRenewalDate(LocalDateTime nextRenewalDate) { this.nextRenewalDate = nextRenewalDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getNotificationChannel() { return notificationChannel; }
    public void setNotificationChannel(String notificationChannel) { this.notificationChannel = notificationChannel; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
