package com.shivansh.trackit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shivansh.trackit.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {}