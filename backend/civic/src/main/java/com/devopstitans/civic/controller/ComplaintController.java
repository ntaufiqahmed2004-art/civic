package com.devopstitans.civic.controller;

import com.devopstitans.civic.model.Complaint;
import com.devopstitans.civic.repository.ComplaintRepository;
import com.devopstitans.civic.service.ImageAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.*;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173") 
public class ComplaintController {

    @Autowired
    private ComplaintRepository repository;

    @Autowired
    private ImageAnalysisService aiService;

    // 1. ADMIN DASHBOARD FETCH (FILTERED)
    @GetMapping("/all")
    public List<Complaint> getAllComplaints(
        @RequestParam(required = false) String department, 
        @RequestParam(required = false) String city) {
        
        if (department != null && city != null) {
            System.out.println("Admin Filter Active: " + department + " in " + city);
            return repository.findByDepartmentIgnoreCaseAndLocationContainingIgnoreCase(department, city);
        }
        return repository.findAll();
    }

    // 2. AI SUGGEST ENDPOINT (For the "✨ Suggest Description" button)
    @PostMapping("/describe")
    public ResponseEntity<String> getAIDescription(@RequestParam("image") MultipartFile image) {
        try {
            // FIXED: Using analyzeImage with byte[]
            String aiResult = aiService.analyzeImage(image.getBytes()); 
            
            if (aiResult.contains("PRIVACY_ERROR")) {
                return ResponseEntity.badRequest().body("REJECTED: Person detected. Use a different photo.");
            }
            
            if (aiResult.contains("VALID")) {
                String[] parts = aiResult.split("\\|");
                // Return the description portion (index 1)
                return ResponseEntity.ok(parts.length > 1 ? parts[1].trim() : "Civic issue detected.");
            }
            
            return ResponseEntity.badRequest().body("AI says this isn't a civic issue.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // 3. MAIN SUBMISSION (WITH PRIVACY & VALIDITY GATE)
    @PostMapping("/submit")
    public ResponseEntity<String> submitComplaint(
            @RequestParam("email") String email,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("department") String department,
            @RequestParam("location") String location,
            @RequestParam("image") MultipartFile image) {
        
        Path path = null;
        try {
            String uploadDir = "C:/CIVIC/uploads/";
            File directory = new File(uploadDir);
            if (!directory.exists()) directory.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            path = Paths.get(uploadDir + fileName);
            Files.copy(image.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

            // FIXED: Standardized to analyzeImage(byte[])
            byte[] imageBytes = image.getBytes();
            String aiResult = aiService.analyzeImage(imageBytes); 
            System.out.println("DEBUG: AI Result is -> " + aiResult);

            // Check for Humans (Privacy)
            if (aiResult.contains("PRIVACY_ERROR")) {
                Files.deleteIfExists(path);
                return ResponseEntity.badRequest().body("REJECTED: Person detected in image. Please protect privacy.");
            } 
            
            // Check for Validity
            if (aiResult.contains("NOT_CIVIC_ISSUE")) {
                Files.deleteIfExists(path);
                return ResponseEntity.badRequest().body("REJECTED: No civic issue detected in this photo.");
            }

            if (aiResult.contains("VALID")) {
                String[] parts = aiResult.split("\\|");
                // If AI format is "VALID | Description", the description is at index 1
                String aiDescription = (parts.length > 1) ? parts[1].trim() : "Report filed via AI verification.";

                Complaint complaint = new Complaint();
                complaint.setEmail(email);
                
                // If user description is empty, use AI's description
                if (description == null || description.trim().isEmpty() || description.equals("undefined")) {
                    complaint.setDescription(aiDescription);
                } else {
                    complaint.setDescription(description);
                }

                complaint.setDepartment(department);
                complaint.setLocation(location);
                complaint.setImageUrl(path.toString()); 
                complaint.setStatus("NOT_REVIEWED");

                repository.save(complaint);
                return ResponseEntity.ok("Success! AI verified and issue registered.");
            }

            Files.deleteIfExists(path);
            return ResponseEntity.badRequest().body("AI could not verify the photo. Please try again.");

        } catch (Exception e) {
            try { if (path != null) Files.deleteIfExists(path); } catch (Exception ignored) {}
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // 4. STATUS UPDATE
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long id, 
            @RequestParam("status") String newStatus) {
        
        return repository.findById(id).map(complaint -> {
            complaint.setStatus(newStatus);
            repository.save(complaint);
            return ResponseEntity.ok("Status updated to " + newStatus);
        }).orElse(ResponseEntity.notFound().build());
    }
}