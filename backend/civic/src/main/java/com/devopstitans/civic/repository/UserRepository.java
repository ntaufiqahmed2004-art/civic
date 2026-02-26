package com.devopstitans.civic.repository;

import com.devopstitans.civic.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // This is crucial for the Login page to work
    Optional<User> findByEmail(String email);
}