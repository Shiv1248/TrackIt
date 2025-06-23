package com.shivansh.trackIt.service;

import org.springframework.stereotype.Service;

import com.shivansh.trackIt.entity.Investment;
import com.shivansh.trackIt.repository.InvestmentRepository;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class InvestmentService {
    @Autowired
    private InvestmentRepository investmentRepository;

    public Investment save(Investment inv) {
        return investmentRepository.save(inv);
    }

    public List<Investment> findAll() {
        return investmentRepository.findAll();
    }

    public Investment findById(Long id) {
        return investmentRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        investmentRepository.deleteById(id);
    }
}
