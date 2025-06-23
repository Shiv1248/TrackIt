package com.shivansh.trackIt.service;

import org.springframework.stereotype.Service;

import com.shivansh.trackIt.dto.ExpenseStatsDto;
import com.shivansh.trackIt.dto.MonthlyTrendDto;
import com.shivansh.trackIt.entity.Expense;
import com.shivansh.trackIt.entity.User;
import com.shivansh.trackIt.entity.Expense.ExpenseStatus;
import com.shivansh.trackIt.repository.ExpenseRepository;

import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

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

    public List<Expense> findByUser(User user) {
        return expenseRepository.findByUser(user);
    }

    public List<Expense> findByUserWithFilters(User user, String status, String category, 
                                             String dateFrom, String dateTo, 
                                             Double minAmount, Double maxAmount, String search) {
        List<Expense> userExpenses = findByUser(user);
        
        return userExpenses.stream()
                .filter(expense -> status == null || expense.getStatus().name().equalsIgnoreCase(status))
                .filter(expense -> category == null || expense.getCategory().equalsIgnoreCase(category))
                .filter(expense -> dateFrom == null || !expense.getDate().isBefore(LocalDate.parse(dateFrom)))
                .filter(expense -> dateTo == null || !expense.getDate().isAfter(LocalDate.parse(dateTo)))
                .filter(expense -> minAmount == null || expense.getAmount() >= minAmount)
                .filter(expense -> maxAmount == null || expense.getAmount() <= maxAmount)
                .filter(expense -> search == null || 
                        expense.getTitle().toLowerCase().contains(search.toLowerCase()) ||
                        expense.getDescription().toLowerCase().contains(search.toLowerCase()) ||
                        expense.getCategory().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
    }

    public ExpenseStatsDto getExpenseStats(User user) {
        List<Expense> userExpenses = findByUser(user);
        
        if (userExpenses.isEmpty()) {
            return new ExpenseStatsDto(0L, 0.0, new HashMap<>(), new HashMap<>(), new ArrayList<>());
        }

        Long totalExpenses = (long) userExpenses.size();
        Double totalAmount = userExpenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        // Monthly total (current month)
        YearMonth currentMonth = YearMonth.now();
        Double monthlyTotal = userExpenses.stream()
                .filter(expense -> YearMonth.from(expense.getDate()).equals(currentMonth))
                .mapToDouble(Expense::getAmount)
                .sum();

        // Category breakdown
        Map<String, Double> categoryBreakdown = userExpenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ));

        // Status breakdown
        Map<String, Long> statusBreakdown = userExpenses.stream()
                .collect(Collectors.groupingBy(
                        expense -> expense.getStatus().name().toLowerCase(),
                        Collectors.counting()
                ));

        // Monthly trend (last 6 months)
        List<MonthlyTrendDto> monthlyTrend = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth month = currentMonth.minusMonths(i);
            Double monthTotal = userExpenses.stream()
                    .filter(expense -> YearMonth.from(expense.getDate()).equals(month))
                    .mapToDouble(Expense::getAmount)
                    .sum();
            
            monthlyTrend.add(new MonthlyTrendDto(
                    month.format(DateTimeFormatter.ofPattern("MMM yyyy")),
                    monthTotal
            ));
        }

        return new ExpenseStatsDto(totalExpenses, monthlyTotal, categoryBreakdown, statusBreakdown, monthlyTrend);
    }

    public List<Map<String, Object>> getExpenseCategories(User user) {
        List<Expense> userExpenses = findByUser(user);
        
        return userExpenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                expenses -> {
                                    Map<String, Object> result = new HashMap<>();
                                    result.put("category", expenses.get(0).getCategory());
                                    result.put("count", (long) expenses.size());
                                    result.put("total", expenses.stream()
                                            .mapToDouble(Expense::getAmount)
                                            .sum());
                                    return result;
                                }
                        )
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }

    public List<Expense> findByStatus(User user, String status) {
        return findByUser(user).stream()
                .filter(expense -> expense.getStatus().name().equalsIgnoreCase(status))
                .collect(Collectors.toList());
    }

    public List<Expense> findByCategory(User user, String category) {
        return findByUser(user).stream()
                .filter(expense -> expense.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }
}
