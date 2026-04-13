package com.eventmgmt.backend.service;

import com.eventmgmt.backend.model.Event;
import com.eventmgmt.backend.model.Registration;
import com.eventmgmt.backend.model.User;
import com.eventmgmt.backend.repository.EventRepository;
import com.eventmgmt.backend.repository.RegistrationRepository;
import com.eventmgmt.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private EmailService emailService;

    public Registration registerUserForEvent(String userId, String eventId) {
        if (registrationRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new RuntimeException("User is already registered for this event");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        int currentCount = registrationRepository.countByEventId(eventId);
        if (event.getMaxParticipants() != null && currentCount >= event.getMaxParticipants()) {
            throw new RuntimeException("Event is full");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setRegisteredAt(LocalDateTime.now());

        Registration savedReq = registrationRepository.save(registration);

        // Notify WebSocket clients
        int newCount = currentCount + 1;
        messagingTemplate.convertAndSend("/topic/events/" + eventId + "/registrations", newCount);

        // Send Email Notification
        String subject = "Registration Confirmed - " + event.getTitle();
        String body = "Dear " + user.getName() + ",\n\n" +
                "You have successfully registered for the event: " + event.getTitle() + ".\n" +
                "Location: " + event.getLocation() + "\n" +
                "Date: " + event.getDate().toString() + "\n\n" +
                "We look forward to seeing you there!";
        
        // Since SMTP might not be configured locally, we wrap in new thread or just rely on try/catch
        // In real app, consider @Async for this
        new Thread(() -> emailService.sendEmail(user.getEmail(), subject, body)).start();

        return savedReq;
    }

    public List<Registration> getRegistrationsByUser(String userId) {
        return registrationRepository.findByUserId(userId);
    }

    public List<Registration> getRegistrationsByEvent(String eventId) {
        return registrationRepository.findByEventId(eventId);
    }
}
