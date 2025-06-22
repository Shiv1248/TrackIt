package com.shivansh.trackit.service;

import com.shivansh.trackit.repository.SubscriptionRepository;
import com.shivansh.trackit.entity.Subscription;

import org.springframework.stereotype.Service;
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
