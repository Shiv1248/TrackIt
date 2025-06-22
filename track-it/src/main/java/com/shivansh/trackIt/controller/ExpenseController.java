package com.shivansh.trackit.controller;

import com.shivansh.trackit.service.ExpenseService;
import com.shivansh.trackit.entity.Expense;
import com.shivansh.trackit.service.UserService;
import com.shivansh.trackit.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Expense> create(@RequestBody Expense expense) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
    
        User user = userService.findByUsername(username);
        expense.setUser(user);
    
        Expense savedExpense = expenseService.save(expense);
        return ResponseEntity.ok(savedExpense);
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAll() {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String username;
            
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else {
                username = principal.toString();
            }
            
            if (username == null || username.isEmpty()) {
                return ResponseEntity.status(401).build();
            }
            
            User user = userService.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(404).body(null);
            }
            
            List<Expense> userExpenses = expenseService.findAll().stream()
                .filter(expense -> expense.getUser() != null && expense.getUser().getId().equals(user.getId()))
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(userExpenses);
            
        } catch (Exception e) {
            return ResponseEntity.status(412).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpense(@PathVariable Long id) {
        Expense expense = expenseService.findById(id);
        if (expense == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(expense);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        
        User user = userService.findByUsername(username);
        
        Expense expense = expenseService.findById(id);
        if (expense == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!expense.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You can only delete your own expenses");
        }
        
        expenseService.deleteById(id);
        return ResponseEntity.ok("Expense deleted successfully");
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody Expense updatedExpense) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        
        User user = userService.findByUsername(username);
        
        Expense existingExpense = expenseService.findById(id);
        if (existingExpense == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingExpense.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You can only update your own expenses");
        }
        
        existingExpense.setAmount(updatedExpense.getAmount());
        existingExpense.setDescription(updatedExpense.getDescription());
        existingExpense.setCategory(updatedExpense.getCategory());
        existingExpense.setExpenseDate(updatedExpense.getExpenseDate());
        
        Expense savedExpense = expenseService.save(existingExpense);
        return ResponseEntity.ok("Expense updated successfully");
    }

}
