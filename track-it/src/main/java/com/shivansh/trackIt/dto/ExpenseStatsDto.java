package com.shivansh.trackIt.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseStatsDto {
    private Long totalExpenses;
    private Double monthlyTotal;
    private java.util.Map<String, Double> categoryBreakdown;
    private java.util.Map<String, Long> statusBreakdown;
    private java.util.List<MonthlyTrendDto> monthlyTrend;
}