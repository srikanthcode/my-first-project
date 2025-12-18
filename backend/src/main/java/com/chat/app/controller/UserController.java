package com.chat.app.controller;

import com.chat.app.model.User;
import com.chat.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build(); // User already exists
        }
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
