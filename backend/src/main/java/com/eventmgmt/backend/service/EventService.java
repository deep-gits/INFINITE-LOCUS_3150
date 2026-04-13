package com.eventmgmt.backend.service;

import com.eventmgmt.backend.dto.EventDto;
import com.eventmgmt.backend.model.Event;
import com.eventmgmt.backend.model.User;
import com.eventmgmt.backend.repository.EventRepository;
import com.eventmgmt.backend.repository.RegistrationRepository;
import com.eventmgmt.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RegistrationRepository registrationRepository;

    public Event createEvent(Event event, String organizerId) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));
        event.setOrganizer(organizer);
        event.setCreatedAt(LocalDateTime.now());
        return eventRepository.save(event);
    }

    public Event updateEvent(String id, Event updatedEvent) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setDate(updatedEvent.getDate());
        event.setLocation(updatedEvent.getLocation());
        event.setMaxParticipants(updatedEvent.getMaxParticipants());
        return eventRepository.save(event);
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }

    public List<EventDto> getEventsByOrganizer(String organizerId) {
        List<Event> events = eventRepository.findByOrganizerId(organizerId);
        return events.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public List<EventDto> getAllEvents() {
        return eventRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public EventDto getEventById(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        return convertToDto(event);
    }

    private EventDto convertToDto(Event event) {
        int regCount = registrationRepository.countByEventId(event.getId());
        return new EventDto(event, regCount);
    }
}
