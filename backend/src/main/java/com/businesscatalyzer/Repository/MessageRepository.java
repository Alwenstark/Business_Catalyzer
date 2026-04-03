package com.businesscatalyzer.Repository;

import com.businesscatalyzer.Model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Modifying
    @Query("DELETE FROM Message m WHERE m.caseEntity.companyName = :companyName")
    void deleteByCompanyName(@Param("companyName") String companyName);
    List<Message> findByCaseEntityIdOrderByTimeAsc(Long caseId);

}