package com.devopstitans.civic.repository;

import com.devopstitans.civic.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    // Basic save, delete, find methods are already included here by default!
}