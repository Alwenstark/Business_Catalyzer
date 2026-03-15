package com.businesscatalyzer.Repository;

import com.businesscatalyzer.Model.Role;
import com.businesscatalyzer.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmailOrUsername(String email, String username);

    List<User> findByRole(Role role);

    List<User> findByCompanyNameContainingIgnoreCase(String companyName);
}