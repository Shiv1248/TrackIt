package com.shivansh.trackIt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shivansh.trackIt.entity.Expense;
import com.shivansh.trackIt.entity.User;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
}