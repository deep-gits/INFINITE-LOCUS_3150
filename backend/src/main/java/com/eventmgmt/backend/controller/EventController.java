package com.eventmgmt.backend.controller;

import com.eventmgmt.backend.dto.EventDto;
import com.eventmgmt.backend.model.Event;
import com.eventmgmt.backend.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Event> createEvent(@RequestBody Event event, @RequestAttribute(name = "userId", required = false) String userIdParam) {
        // Assume userId is fetched securely from context in real scenario, or injected via argument resolver
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        com.eventmgmt.backend.security.UserPrincipal userPrincipal = (com.eventmgmt.backend.security.UserPrincipal) auth.getPrincipal();
        
        Event created = eventService.createEvent(event, userPrincipal.getId());
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<Event> updateEvent(@PathVariable String id, @RequestBody Event event) {
        Event updated = eventService.updateEvent(id, event);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<?> deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/organizer/{organizerId}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<List<EventDto>> getEventsByOrganizer(@PathVariable String organizerId) {
        return ResponseEntity.ok(eventService.getEventsByOrganizer(organizerId));
    }

    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEventById(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }
}
