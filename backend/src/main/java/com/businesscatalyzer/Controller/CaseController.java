package com.businesscatalyzer.Controller;

import com.businesscatalyzer.Model.Case;
import com.businesscatalyzer.Model.CaseStatus;
import com.businesscatalyzer.Model.Mood;
import com.businesscatalyzer.Model.User;
import com.businesscatalyzer.Service.CaseService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {

    private final CaseService caseService;

    @PostMapping
    public Case createCase(
            @RequestBody Case caseData,
            jakarta.servlet.http.HttpSession session
    ) {

        User user = (User) session.getAttribute("user");

        if (user == null) {
            throw new RuntimeException("Not logged in");
        }

        caseData.setUser(user);

        return caseService.createCase(caseData);
    }

    @GetMapping("/my-cases")
    public List<Case> getMyCases(HttpSession session) {

        User user = (User) session.getAttribute("user");

        if (user == null) {
            throw new RuntimeException("Not logged in");
        }

        return caseService.getUserCases(user.getId());
    }

    @GetMapping
    public List<Case> getAllCases() {

        return caseService.getAllCases();

    }

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

        if (status == CaseStatus.RESOLVED || status == CaseStatus.CLOSED) {
            caseData.setResolvedAt(java.time.LocalDateTime.now());
        }

        if (status == CaseStatus.REOPENED) {
            caseData.setReopenedAt(java.time.LocalDateTime.now());
        }
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

    @PutMapping("/{id}/resolvedMood")
    public Case updateResolvedMood(
            @PathVariable Long id,
            @RequestParam Mood mood
    ) {

        Case caseData = caseService.getCaseById(id);

        caseData.setResolvedMood(mood);

        return caseService.save(caseData);
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard(
            @RequestParam String companyName,
            @RequestParam(defaultValue = "7") int days
    ) {

        Map<String, Object> result = new HashMap<>();

        result.put("summary", caseService.getDashboard(companyName, days));
        result.put("incomingGraph", caseService.getIncomingGraph(companyName, days));
        result.put("weeklyTrend", caseService.getWeeklyTrend(companyName, days));
        result.put("resolutionGraph", caseService.getResolutionGraph(companyName, days));

        return result;
    }

}