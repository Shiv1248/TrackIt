package com.shivansh.trackit.service;

import com.shivansh.trackit.repository.ExpenseRepository;
import com.shivansh.trackit.entity.Expense;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense save(Expense exp) {
        return expenseRepository.save(exp);
    }

    public List<Expense> findAll() {
        return expenseRepository.findAll();
    }

    public Expense findById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    public void deleteById(Long id) {
        expenseRepository.deleteById(id);
    }
}
