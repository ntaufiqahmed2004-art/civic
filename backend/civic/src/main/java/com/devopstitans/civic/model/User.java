package com.devopstitans.civic.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users") // Good practice to name the table
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(unique = true) // Prevents duplicate registrations
    private String email;
    
    private String password;
    
    // For Admins: "Roads", "Sanitation", etc.
    // For Citizens: Can be "General"
    private String department; 
    
    // This will store the City (e.g., "Coimbatore") for the 5km logic
    private String location; 

    @Enumerated(EnumType.STRING)
    private Role role; 
}

// You can keep this in the same file for simplicity during the hackathon
enum Role {
    CITIZEN, ADMIN
}