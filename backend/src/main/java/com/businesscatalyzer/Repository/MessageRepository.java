package com.businesscatalyzer.Repository;

import com.businesscatalyzer.Model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByCaseEntityIdOrderByTimeAsc(Long caseId);

}