package com.businesscatalyzer.Controller;

import com.businesscatalyzer.Model.Message;
import com.businesscatalyzer.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/{caseId}/{senderId}")
    public Message sendMessage(
            @PathVariable Long caseId,
            @PathVariable Long senderId,
            @RequestBody Message message
    ) {

        return messageService.sendMessage(caseId, senderId, message);

    }

    @GetMapping("/{caseId}")
    public List<Message> getMessages(@PathVariable Long caseId) {

        return messageService.getCaseMessages(caseId);

    }
}