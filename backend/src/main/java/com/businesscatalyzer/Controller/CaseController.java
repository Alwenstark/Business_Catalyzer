package com.businesscatalyzer.Controller;

import com.businesscatalyzer.Model.Case;
import com.businesscatalyzer.Model.CaseStatus;
import com.businesscatalyzer.Model.Mood;
import com.businesscatalyzer.Service.CaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;

    // Create case
    @PostMapping
    public Case createCase(@RequestBody Case caseData) {

        return caseService.createCase(caseData);

    }

    // Get cases for a user
    @GetMapping("/user/{userId}")
    public List<Case> getUserCases(@PathVariable Long userId) {

        return caseService.getUserCases(userId);

    }

    // Get all cases
    @GetMapping
    public List<Case> getAllCases() {

        return caseService.getAllCases();

    }

    // Get case by id
    @GetMapping("/{id}")
    public Case getCaseById(@PathVariable Long id) {

        return caseService.getCaseById(id);

    }

    @GetMapping("/company")
    public List<Case> getCompanyCases(@RequestParam String name) {

        return caseService.getCasesByCompany(name);

    }

    @PutMapping("/{id}/status")
    public Case updateCaseStatus(
            @PathVariable Long id,
            @RequestParam CaseStatus status
    ) {

        Case caseData = caseService.getCaseById(id);

        caseData.setStatus(status);

        return caseService.save(caseData);
    }

    @PutMapping("/{id}/mood")
    public Case updateCaseMood(
            @PathVariable Long id,
            @RequestParam Mood mood
    ) {

        Case caseData = caseService.getCaseById(id);

        caseData.setMood(mood);

        return caseService.save(caseData);
    }
}