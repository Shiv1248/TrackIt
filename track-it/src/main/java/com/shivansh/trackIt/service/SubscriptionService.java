package com.shivansh.trackIt.service;

import org.springframework.stereotype.Service;

import com.shivansh.trackIt.entity.Subscription;
import com.shivansh.trackIt.repository.SubscriptionRepository;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class SubscriptionService {
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    public Subscription save(Subscription sub) {
        return subscriptionRepository.save(sub);
    }

    public List<Subscription> findAll() {
        return subscriptionRepository.findAll();
    }

    public Subscription findById(Long id) {
        return subscriptionRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        subscriptionRepository.deleteById(id);
    }
}
