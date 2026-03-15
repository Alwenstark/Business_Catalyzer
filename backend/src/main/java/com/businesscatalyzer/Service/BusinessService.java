package com.businesscatalyzer.Service;

import com.businesscatalyzer.Model.Role;
import com.businesscatalyzer.Model.User;
import com.businesscatalyzer.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusinessService {

    private final UserRepository userRepository;

    // Create business profile
    public User createBusiness(User user) {

        user.setRole(Role.BUSINESS);

        return userRepository.save(user);
    }

    // Update business profile
    public User updateBusiness(Long id, User updatedUser) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        user.setCompanyName(updatedUser.getCompanyName());
        user.setCompanyAddress(updatedUser.getCompanyAddress());
        user.setGst(updatedUser.getGst());
        user.setPhone(updatedUser.getPhone());

        return userRepository.save(user);
    }

    // Get business by id
    public User getBusiness(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));
    }

    // List all businesses
    public List<User> getAllBusinesses() {

        return userRepository.findByRole(Role.BUSINESS);
    }

    // Search businesses
    public List<User> searchBusiness(String name) {

        return userRepository.findByCompanyNameContainingIgnoreCase(name);
    }
}