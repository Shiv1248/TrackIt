package com.shivansh.trackit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shivansh.trackit.entity.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {}