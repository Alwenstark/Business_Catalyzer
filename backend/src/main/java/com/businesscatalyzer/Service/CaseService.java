package com.businesscatalyzer.Service;

import com.businesscatalyzer.Model.Case;
import com.businesscatalyzer.Model.CaseStatus;
import com.businesscatalyzer.Model.User;
import com.businesscatalyzer.Repository.CaseRepository;
import com.businesscatalyzer.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    public Case createCase(Case caseData) {

        Long userId = caseData.getUser().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        caseData.setUser(user);

        caseData.setStatus(CaseStatus.OPEN);

        return caseRepository.save(caseData);

    }

    public List<Case> getUserCases(Long userId) {

        return caseRepository.findByUserId(userId);

    }

    public List<Case> getAllCases() {

        return caseRepository.findAll();

    }

    public Case getCaseById(Long id) {

        return caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));

    }

    public List<Case> getCasesByCompany(String companyName) {

        return caseRepository.findByCompanyName(companyName);

    }

    public Case save(Case caseData) {

        return caseRepository.save(caseData);

    }

}