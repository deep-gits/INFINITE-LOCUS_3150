package com.eventmgmt.backend.dto;

import com.eventmgmt.backend.model.Event;

import java.time.LocalDateTime;

public class EventDto {
    private String id;
    private String title;
    private String description;
    private LocalDateTime date;
    private String location;
    private Integer maxParticipants;
    private Integer registrationsCount;
    private String organizerId;
    private String organizerName;
    
    public EventDto() {}

    public EventDto(Event event, int registrationsCount) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.date = event.getDate();
        this.location = event.getLocation();
        this.maxParticipants = event.getMaxParticipants();
        this.registrationsCount = registrationsCount;
        if (event.getOrganizer() != null) {
            this.organizerId = event.getOrganizer().getId();
            this.organizerName = event.getOrganizer().getName();
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public Integer getMaxParticipants() { return maxParticipants; }
    public void setMaxParticipants(Integer maxParticipants) { this.maxParticipants = maxParticipants; }
    
    public Integer getRegistrationsCount() { return registrationsCount; }
    public void setRegistrationsCount(Integer registrationsCount) { this.registrationsCount = registrationsCount; }
    
    public String getOrganizerId() { return organizerId; }
    public void setOrganizerId(String organizerId) { this.organizerId = organizerId; }
    
    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
}
