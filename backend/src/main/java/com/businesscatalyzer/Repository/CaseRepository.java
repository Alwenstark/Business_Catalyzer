package com.businesscatalyzer.Repository;

import com.businesscatalyzer.Model.Case;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CaseRepository extends JpaRepository<Case, Long> {
    void deleteByCompanyName(String companyName);
    List<Case> findByUserId(Long userId);
    List<Case> findByCompanyName(String companyName);

}