package com.shivansh.trackIt.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.shivansh.trackIt.dto.ExpenseDto;
import com.shivansh.trackIt.dto.ExpenseStatsDto;
import com.shivansh.trackIt.dto.UpdateExpenseRequest;
import com.shivansh.trackIt.dto.CreateExpenseRequest;
import com.shivansh.trackIt.entity.Expense;
import com.shivansh.trackIt.entity.User;
import com.shivansh.trackIt.entity.Expense.ExpenseStatus; 
import com.shivansh.trackIt.service.ExpenseService;
import com.shivansh.trackIt.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:4200")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<ExpenseDto> createExpense(@RequestBody CreateExpenseRequest request) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Expense expense = new Expense();
            expense.setTitle(request.getTitle());
            expense.setCategory(request.getCategory());
            expense.setDescription(request.getDescription());
            expense.setAmount(request.getAmount());
            expense.setDate(request.getDate());
            expense.setStatus(ExpenseStatus.valueOf(request.getStatus().toUpperCase()));
            expense.setUser(user);

            Expense savedExpense = expenseService.save(expense);
            return ResponseEntity.ok(convertToDto(savedExpense));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDto>> getAllExpenses(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) Double minAmount,
            @RequestParam(required = false) Double maxAmount,
            @RequestParam(required = false) String search) {
        
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            List<Expense> expenses = expenseService.findByUserWithFilters(user, status, category, dateFrom, dateTo, minAmount, maxAmount, search);
            List<ExpenseDto> expenseDtos = expenses.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(expenseDtos);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDto> getExpenseById(@PathVariable Long id) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Expense expense = expenseService.findById(id);
            if (expense == null || !expense.getUser().getId().equals(user.getId())) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(convertToDto(expense));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDto> updateExpense(@PathVariable Long id, @RequestBody UpdateExpenseRequest request) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Expense existingExpense = expenseService.findById(id);
            if (existingExpense == null || !existingExpense.getUser().getId().equals(user.getId())) {
                return ResponseEntity.notFound().build();
            }

            existingExpense.setTitle(request.getTitle());
            existingExpense.setCategory(request.getCategory());
            existingExpense.setDescription(request.getDescription());
            existingExpense.setAmount(request.getAmount());
            existingExpense.setDate(request.getDate());
            existingExpense.setStatus(ExpenseStatus.valueOf(request.getStatus().toUpperCase()));

            Expense savedExpense = expenseService.save(existingExpense);
            return ResponseEntity.ok(convertToDto(savedExpense));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Expense expense = expenseService.findById(id);
            if (expense == null || !expense.getUser().getId().equals(user.getId())) {
                return ResponseEntity.notFound().build();
            }

            expenseService.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ExpenseStatsDto> getExpenseStats() {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            ExpenseStatsDto stats = expenseService.getExpenseStats(user);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getExpenseCategories() {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            List<Map<String, Object>> categories = expenseService.getExpenseCategories(user);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ExpenseDto> updateExpenseStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(401).build();
            }

            Expense expense = expenseService.findById(id);
            if (expense == null || !expense.getUser().getId().equals(user.getId())) {
                return ResponseEntity.notFound().build();
            }

            expense.setStatus(ExpenseStatus.valueOf(request.get("status").toUpperCase()));
            Expense savedExpense = expenseService.save(expense);
            return ResponseEntity.ok(convertToDto(savedExpense));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<List<ExpenseDto>> getTestExpenses() {
        try {
            // For testing purposes, get all expenses without user authentication
            List<Expense> expenses = expenseService.findAll();
            List<ExpenseDto> expenseDtos = expenses.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(expenseDtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userService.findByUsername(username);
    }

    private ExpenseDto convertToDto(Expense expense) {
        return new ExpenseDto(
                expense.getId(),
                expense.getTitle(),
                expense.getCategory(),
                expense.getDescription(),
                expense.getAmount(),
                expense.getDate(),
                expense.getStatus().name().toLowerCase(),
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }
}
