package com.eventmgmt.backend.controller;

import com.eventmgmt.backend.model.Registration;
import com.eventmgmt.backend.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<?> registerUserForEvent(@RequestBody Map<String, String> payload) {
        String eventId = payload.get("eventId");
        
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        com.eventmgmt.backend.security.UserPrincipal userPrincipal = (com.eventmgmt.backend.security.UserPrincipal) auth.getPrincipal();

        try {
            Registration reg = registrationService.registerUserForEvent(userPrincipal.getId(), eventId);
            return ResponseEntity.ok(reg);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Registration>> getRegistrationsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByUser(userId));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Registration>> getRegistrationsByEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(registrationService.getRegistrationsByEvent(eventId));
    }
}
