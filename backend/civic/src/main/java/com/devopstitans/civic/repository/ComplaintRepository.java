package com.devopstitans.civic.repository;

import com.devopstitans.civic.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
    // This naming convention tells Spring: 
    // "Find by Dept (ignore capital letters) AND Location (if it contains the city name)"
    List<Complaint> findByDepartmentIgnoreCaseAndLocationContainingIgnoreCase(String department, String location);
}