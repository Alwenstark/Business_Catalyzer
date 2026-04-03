package com.businesscatalyzer.Controller;

import com.businesscatalyzer.Model.User;
import com.businesscatalyzer.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User savedUser = userService.register(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request,
            jakarta.servlet.http.HttpSession session
    ) {

        try {
            String loginId = request.get("loginId");
            String password = request.get("password");

            User user = userService.login(loginId, password);

            session.setAttribute("user", user);

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public User getCurrentUser(jakarta.servlet.http.HttpSession session) {

        User user = (User) session.getAttribute("user");

        if (user == null) {
            throw new RuntimeException("Not logged in");
        }

        return user;
    }
}