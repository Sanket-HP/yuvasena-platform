'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Check, AlertCircle } from 'lucide-react';

const fallbackEvents = [
  {
    id: '1',
    title: 'Blood Donation Camp & Health Checkup',
    description: 'Join hands with Yuva Sena for the annual mega blood donation camp. Standard health screens and consultations with top specialists will be available for free to all registered citizens.',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Shivaji Park, Dadar, Mumbai',
    maxRegistrations: 1000,
    bannerUrl: 'https://images.unsplash.com/photo-1615461066841-4f104785c3b7?fit=crop&w=800&h=450&q=80',
    status: 'UPCOMING'
  },
  {
    id: '2',
    title: 'Tree Plantation & Environmental Drive',
    description: 'Let us pledge to build a greener Maharashtra. Planting over 10,000 saplings in Pune and nearby talukas. Volunteers will be provided transportation, plantation equipment, and refreshments.',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Vetal Tekdi, Kothrud, Pune',
    maxRegistrations: 500,
    bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?fit=crop&w=800&h=450&q=80',
    status: 'UPCOMING'
  }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>(fallbackEvents);
  const [registered, setRegistered] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/events`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) setEvents(data);
      })
      .catch(() => console.log('Using events fallbacks'));
  }, []);

  const handleRegister = async (eventId: string) => {
    setMessage(null);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setMessage('Please register or log in via the mobile application to enroll in events.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setRegistered(prev => ({ ...prev, [eventId]: true }));
      setMessage('Successfully registered for the event!');
    } catch (err: any) {
      setMessage(err.message || 'Error occurred.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 0' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="badge">Campaigns</span>
        <h2 style={{ fontSize: '36px', fontWeight: '800' }}>State Mobilization Drives</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Register online and check in with your QR membership card at the venue.</p>
      </div>

      {message && (
        <div style={{
          backgroundColor: message.includes('Successfully') ? 'rgba(40,167,69,0.1)' : 'rgba(255,107,0,0.1)',
          border: `1px solid ${message.includes('Successfully') ? 'rgba(40,167,69,0.2)' : 'rgba(255,107,0,0.2)'}`,
          padding: '12px 16px',
          borderRadius: '8px',
          color: message.includes('Successfully') ? '#28a745' : '#FF6B00',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          marginBottom: '30px'
        }}>
          {message.includes('Successfully') ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{message}</span>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px'
      }}>
        {events.map((event) => (
          <article key={event.id} className="card glass" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              height: '200px',
              backgroundColor: 'var(--bg-tertiary)',
              backgroundImage: `url(${event.bannerUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <span className="badge" style={{ position: 'absolute', bottom: '15px', left: '15px', marginBottom: 0, backgroundColor: 'var(--primary)', color: '#FFFFFF' }}>
                {event.status}
              </span>
            </div>
            
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>{event.title}</h3>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                {event.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} color="var(--primary)" />
                  <span>{new Date(event.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="var(--primary)" />
                  <span>{event.location}</span>
                </div>
                {event.maxRegistrations && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={14} color="var(--primary)" />
                    <span>Capacity: {event.maxRegistrations} seats max</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => handleRegister(event.id)} 
                className={`btn ${registered[event.id] ? 'btn-secondary' : 'btn-primary'}`} 
                style={{ width: '100%' }}
                disabled={registered[event.id]}
              >
                {registered[event.id] ? (
                  <>Registered <Check size={16} /></>
                ) : (
                  'Enroll in Drive'
                )}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
