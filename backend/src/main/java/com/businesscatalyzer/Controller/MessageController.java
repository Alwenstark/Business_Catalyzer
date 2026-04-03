package com.businesscatalyzer.Controller;

import com.businesscatalyzer.Model.Message;
import com.businesscatalyzer.Model.User;
import com.businesscatalyzer.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping("/{caseId}")
    public Message sendMessage(
            @PathVariable Long caseId,
            @RequestBody Message message,
            jakarta.servlet.http.HttpSession session
    ) {

        User user = (User) session.getAttribute("user");

        if (user == null) {
            throw new RuntimeException("Not logged in");
        }

        return messageService.sendMessage(caseId, user.getId(), message);
    }

    @GetMapping("/{caseId}")
    public List<Message> getMessages(@PathVariable Long caseId) {

        return messageService.getCaseMessages(caseId);

    }
}