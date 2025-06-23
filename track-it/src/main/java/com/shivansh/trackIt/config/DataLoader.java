package com.shivansh.trackIt.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.shivansh.trackIt.entity.Expense;
import com.shivansh.trackIt.entity.User;
import com.shivansh.trackIt.entity.Expense.ExpenseStatus;
import com.shivansh.trackIt.service.ExpenseService;
import com.shivansh.trackIt.service.UserService;

import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ExpenseService expenseService;
    
    @Autowired
    private UserService userService;

    @Override
    public void run(String... args) throws Exception {
        // Only load data if no expenses exist
        if (expenseService.findAll().isEmpty()) {
            loadSampleData();
        }
    }

    private void loadSampleData() {
        System.out.println("Loading sample expense data...");
        
        // Create a test user first
        User testUser = new User();
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        userService.save(testUser);
        
        // Get the saved user
        testUser = userService.findByUsername("testuser");
        
        // Create sample expenses
        Expense expense1 = new Expense();
        expense1.setTitle("Grocery Shopping");
        expense1.setDescription("Weekly groceries from Walmart");
        expense1.setAmount(85.50);
        expense1.setCategory("Groceries");
        expense1.setDate(LocalDate.now().minusDays(2));
        expense1.setStatus(ExpenseStatus.PAID);
        expense1.setUser(testUser);
        
        Expense expense2 = new Expense();
        expense2.setTitle("Gas Station");
        expense2.setDescription("Fuel for car");
        expense2.setAmount(45.00);
        expense2.setCategory("Gas/Fuel");
        expense2.setDate(LocalDate.now().minusDays(1));
        expense2.setStatus(ExpenseStatus.PAID);
        expense2.setUser(testUser);
        
        Expense expense3 = new Expense();
        expense3.setTitle("Netflix Subscription");
        expense3.setDescription("Monthly streaming service");
        expense3.setAmount(15.99);
        expense3.setCategory("Subscriptions");
        expense3.setDate(LocalDate.now());
        expense3.setStatus(ExpenseStatus.PENDING);
        expense3.setUser(testUser);
        
        Expense expense4 = new Expense();
        expense4.setTitle("Restaurant Dinner");
        expense4.setDescription("Dinner with friends at Italian restaurant");
        expense4.setAmount(65.00);
        expense4.setCategory("Food & Dining");
        expense4.setDate(LocalDate.now().minusDays(3));
        expense4.setStatus(ExpenseStatus.PAID);
        expense4.setUser(testUser);
        
        Expense expense5 = new Expense();
        expense5.setTitle("Gym Membership");
        expense5.setDescription("Monthly fitness center membership");
        expense5.setAmount(29.99);
        expense5.setCategory("Fitness/Gym");
        expense5.setDate(LocalDate.now().plusDays(5));
        expense5.setStatus(ExpenseStatus.UPCOMING);
        expense5.setUser(testUser);
        
        try {
            expenseService.save(expense1);
            expenseService.save(expense2);
            expenseService.save(expense3);
            expenseService.save(expense4);
            expenseService.save(expense5);
            
            System.out.println("Sample data loaded successfully!");
            System.out.println("Backend is ready to connect with your Angular frontend!");
        } catch (Exception e) {
            System.err.println("Error loading sample data: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 