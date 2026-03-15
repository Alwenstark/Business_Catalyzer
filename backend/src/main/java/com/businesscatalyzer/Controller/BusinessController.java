package com.businesscatalyzer.Controller;

import com.businesscatalyzer.Model.User;
import com.businesscatalyzer.Service.BusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessService businessService;

    // Create business
    @PostMapping
    public User createBusiness(@RequestBody User user) {
        return businessService.createBusiness(user);
    }

    // Update business
    @PutMapping("/{id}")
    public User updateBusiness(@PathVariable Long id,
                               @RequestBody User user) {
        return businessService.updateBusiness(id, user);
    }

    // Get business by id
    @GetMapping("/{id}")
    public User getBusiness(@PathVariable Long id) {
        return businessService.getBusiness(id);
    }

    // Get all businesses
    @GetMapping
    public List<User> getAllBusinesses() {
        return businessService.getAllBusinesses();
    }

    // Search businesses
    @GetMapping("/search")
    public List<User> searchBusiness(@RequestParam String name) {
        return businessService.searchBusiness(name);
    }
}