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

    @GetMapping("/all")
    public List<Complaint> getAllComplaints() {
        return repository.findAll();
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submitComplaint(
            @RequestParam("email") String email,
            @RequestParam("description") String description,
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

            // AI VERIFICATION
            String aiResult = aiService.verifyImage(path.toString());
            System.out.println("DEBUG: AI Result is -> " + aiResult);

            if (aiResult.contains("PRIVACY_ERROR")) {
                Files.deleteIfExists(path);
                return ResponseEntity.badRequest().body("REJECTED: Person detected.");
            } 
            
            if (aiResult.contains("NOT_CIVIC_ISSUE")) {
                Files.deleteIfExists(path);
                return ResponseEntity.badRequest().body("REJECTED: No civic issue detected.");
            }

            if (aiResult.contains("VALID")) {
                Complaint complaint = new Complaint();
                complaint.setEmail(email);
                complaint.setDescription(description);
                complaint.setDepartment(department);
                complaint.setLocation(location);
                complaint.setImageUrl(path.toString()); 

                repository.save(complaint);
                return ResponseEntity.ok("Success! AI verified and issue registered.");
            }

            Files.deleteIfExists(path);
            return ResponseEntity.badRequest().body("AI could not verify. Try a clearer photo.");

        } catch (Exception e) {
            try { if (path != null) Files.deleteIfExists(path); } catch (Exception ignored) {}
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

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


    // Inside your ComplaintController.java

@PutMapping("/{id}/status")
public ResponseEntity<String> updateStatus(
        @PathVariable Long id, 
        @RequestParam("status") String newStatus) {
    
    return repository.findById(id).map(complaint -> {
        complaint.setStatus(newStatus);
        repository.save(complaint);
        return ResponseEntity.ok("Status successfully updated in MySQL.");
    }).orElse(ResponseEntity.notFound().build());
}

}