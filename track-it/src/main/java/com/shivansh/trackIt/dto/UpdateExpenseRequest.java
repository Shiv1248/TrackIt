package com.shivansh.trackIt.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateExpenseRequest {
    private String title;
    private String category;
    private String description;
    private Double amount;
    private LocalDate date;
    private String status;
}