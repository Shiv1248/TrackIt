package com.shivansh.trackIt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shivansh.trackIt.entity.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {}