package com.shivansh.trackIt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shivansh.trackIt.entity.Investment;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {}