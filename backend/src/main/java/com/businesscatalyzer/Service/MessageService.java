package com.businesscatalyzer.Service;

import com.businesscatalyzer.Model.*;
import com.businesscatalyzer.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    public Message sendMessage(Long caseId, Long senderId, Message message) {

        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        message.setCaseEntity(caseEntity);
        message.setSender(sender);
        message.setTime(LocalDateTime.now());

        return messageRepository.save(message);
    }

    public List<Message> getCaseMessages(Long caseId) {

        return messageRepository.findByCaseEntityIdOrderByTimeAsc(caseId);

    }
}