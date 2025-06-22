package com.shivansh.trackit.service;

import com.shivansh.trackit.repository.InvestmentRepository;
import com.shivansh.trackit.entity.Investment;

import org.springframework.stereotype.Service;
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
