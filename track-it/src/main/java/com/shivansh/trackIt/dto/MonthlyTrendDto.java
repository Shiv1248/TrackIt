package com.shivansh.trackIt.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyTrendDto {
    private String month;
    private Double amount;
} 