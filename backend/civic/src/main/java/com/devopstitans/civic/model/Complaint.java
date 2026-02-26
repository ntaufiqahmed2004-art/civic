package com.devopstitans.civic.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String description;
    private String imageUrl; // Path to the file on D: Drive
    private String department;
    private String location;
    private String status = "NOT_REVIEWED";
    private int priority = 1;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}