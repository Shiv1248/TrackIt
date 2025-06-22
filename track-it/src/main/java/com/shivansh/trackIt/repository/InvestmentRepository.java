package com.shivansh.trackit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shivansh.trackit.entity.Investment;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {}