package com.shivansh.trackit.controller;

import com.shivansh.trackit.service.InvestmentService;
import com.shivansh.trackit.entity.Investment;
import com.shivansh.trackit.entity.User;
import com.shivansh.trackit.service.UserService;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/investments")
public class InvestmentController {

    @Autowired
    private InvestmentService investmentService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Investment> create(@RequestBody Investment investment) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
    
        User user = userService.findByUsername(username);
        investment.setUser(user);
        Investment savedInvestment = investmentService.save(investment);
        return ResponseEntity.ok(savedInvestment);
    }

    @GetMapping
    public List<Investment> getAll() {
        return investmentService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Investment> getInvestment(@PathVariable Long id) {
        Investment investment = investmentService.findById(id);
        if (investment == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(investment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvestment(@PathVariable Long id) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        
        User user = userService.findByUsername(username);
        
        Investment investment = investmentService.findById(id);
        if (investment == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!investment.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You can only delete your own investments");
        }
        
        investmentService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Investment> updateInvestment(@PathVariable Long id, @RequestBody Investment updatedInvestment) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        User user = userService.findByUsername(username);
        
        Investment existingInvestment = investmentService.findById(id);
        if (existingInvestment == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!existingInvestment.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        existingInvestment.setSymbol(updatedInvestment.getSymbol());
        existingInvestment.setBuyPrice(updatedInvestment.getBuyPrice());
        existingInvestment.setQuantity(updatedInvestment.getQuantity());
        
        Investment savedInvestment = investmentService.save(existingInvestment);
        return ResponseEntity.ok(savedInvestment);
    }
}
