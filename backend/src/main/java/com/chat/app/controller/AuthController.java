package com.chat.app.controller;

import com.chat.app.model.OtpRecord;
import com.chat.app.repository.OtpRepository;
import com.chat.app.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}) // Allow frontend access
public class AuthController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpRepository otpRepository;

    /**
     * Send OTP to user's email
     */
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email is required");
            return ResponseEntity.badRequest().body(error);
        }

        // Validate email format
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email format");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            // Generate a random 6-digit OTP
            String otp = String.format("%06d", new Random().nextInt(999999));

            // Save OTP to database
            OtpRecord otpRecord = new OtpRecord(email, otp);
            otpRepository.save(otpRecord);

            // Send OTP via email (using HTML template)
            emailService.sendOtpEmailHtml(email, otp);

            Map<String, String> response = new HashMap<>();
            response.put("message", "OTP sent successfully to " + email);
            response.put("email", email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send OTP: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    /**
     * Verify OTP entered by user
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (email == null || otp == null || email.isEmpty() || otp.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Email and OTP are required");
            return ResponseEntity.badRequest().body(error);
        }

        try {
            // Find the most recent OTP for this email
            Optional<OtpRecord> otpRecordOpt = otpRepository.findFirstByEmailAndVerifiedFalseOrderByCreatedAtDesc(email);

            if (otpRecordOpt.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "No OTP found for this email");
                return ResponseEntity.status(404).body(error);
            }

            OtpRecord otpRecord = otpRecordOpt.get();

            // Check if OTP is expired
            if (otpRecord.isExpired()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "OTP has expired. Please request a new one.");
                return ResponseEntity.status(400).body(error);
            }

            // Verify OTP
            if (!otpRecord.getOtp().equals(otp)) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Invalid OTP");
                return ResponseEntity.status(400).body(error);
            }

            // Mark as verified
            otpRecord.setVerified(true);
            otpRepository.save(otpRecord);

            // Clean up old OTP records for this email
            // otpRepository.deleteByEmail(email); // Uncomment if you want to delete after verification

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP verified successfully");
            response.put("email", email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Verification failed: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
