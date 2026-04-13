import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { PlusCircle, Calendar, Users, MapPin } from 'lucide-react';

export default function OrganizerDashboard() {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    // New Event Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [maxParticipants, setMaxParticipants] = useState('');

    useEffect(() => {
        fetchEvents();
        // Setup WebSocket for real-time updates
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            console.log('Connected to WebSocket');
            events.forEach(event => {
                stompClient.subscribe(`/topic/events/${event.id}/registrations`, (msg) => {
                    const newCount = parseInt(msg.body);
                    setEvents(prev => prev.map(ev => 
                        ev.id === event.id ? { ...ev, registrationsCount: newCount } : ev
                    ));
                });
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [events.length]); // Re-subscribe if new events are added

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/events/organizer/${user.id}`);
            setEvents(res.data);
        } catch (err) {
            console.error('Failed to fetch events', err);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/events', {
                title, description, date, location, maxParticipants: parseInt(maxParticipants)
            });
            setShowForm(false);
            fetchEvents();
        } catch (err) {
            console.error(err);
            alert('Failed to create event');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Organizer Dashboard</h1>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Event
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Event Title" required className="border p-2 rounded" 
                            value={title} onChange={e => setTitle(e.target.value)} />
                        <input type="datetime-local" required className="border p-2 rounded" 
                            value={date} onChange={e => setDate(e.target.value)} />
                        <input type="text" placeholder="Location" required className="border p-2 rounded" 
                            value={location} onChange={e => setLocation(e.target.value)} />
                        <input type="number" placeholder="Max Participants" required className="border p-2 rounded" 
                            value={maxParticipants} onChange={e => setMaxParticipants(e.target.value)} />
                        <textarea placeholder="Description" required className="border p-2 rounded md:col-span-2" 
                            value={description} onChange={e => setDescription(e.target.value)} />
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 md:col-span-2">
                            Save Event
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{event.description}</p>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                                    {new Date(event.date).toLocaleString()}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                                    {event.location}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <Users className="h-4 w-4 mr-2 text-indigo-500" />
                                    <span className="font-semibold text-indigo-600 mr-1">{event.registrationsCount || 0}</span> 
                                    / {event.maxParticipants} Registered
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {events.length === 0 && !showForm && (
                <div className="text-center py-12 text-gray-500">
                    No events created yet. Click "Create Event" to get started.
                </div>
            )}
        </div>
    );
}
