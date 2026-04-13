import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';

export default function UserDashboard() {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]);

    useEffect(() => {
        fetchEvents();
        fetchMyRegistrations();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/events');
            setEvents(res.data);
        } catch (err) {
            console.error('Failed to fetch events', err);
        }
    };

    const fetchMyRegistrations = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/registrations/user/${user.id}`);
            const eventIds = res.data.map(reg => reg.event.id);
            setMyRegistrations(eventIds);
        } catch (err) {
            console.error('Failed to fetch registrations', err);
        }
    };

    const handleRegister = async (eventId) => {
        try {
            await axios.post('http://localhost:8080/api/registrations', { eventId });
            alert('Successfully registered!');
            fetchEvents();
            fetchMyRegistrations();
        } catch (err) {
            alert(err.response?.data || 'Failed to register');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Events</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => {
                    const isRegistered = myRegistrations.includes(event.id);
                    const isFull = event.registrationsCount >= event.maxParticipants;

                    return (
                        <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
                            <div className="p-6 flex-grow">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                                <p className="text-sm text-indigo-600 mb-2">by {event.organizerName}</p>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{event.description}</p>
                                
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
                                        {event.registrationsCount || 0} / {event.maxParticipants} Spots Taken
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 pt-0 mt-auto">
                                <button 
                                    onClick={() => handleRegister(event.id)}
                                    disabled={isRegistered || isFull}
                                    className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                                        ${isRegistered ? 'bg-green-500 cursor-not-allowed' : 
                                          isFull ? 'bg-gray-400 cursor-not-allowed' : 
                                          'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {isRegistered ? 'Registered ✓' : isFull ? 'Event Full' : 'Register Now'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {events.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No upcoming events found. Please check back later.
                </div>
            )}
        </div>
    );
}
