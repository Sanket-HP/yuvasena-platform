'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  BookOpen, 
  Image as ImageIcon, 
  PhoneCall, 
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageSquare
} from 'lucide-react';

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section" style={{
        background: 'radial-gradient(circle at 10% 20%, rgba(255, 107, 0, 0.08) 0%, transparent 40%)',
        padding: '100px 0 80px 0'
      }}>
        <div className="container">
          <span className="badge">Yuva Sena Digital Hub</span>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            marginBottom: '20px',
            color: 'var(--text-primary)'
          }}>
            Empowering Youth,<br />
            <span className="gradient-text">Shaping Tomorrow</span>
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '700px',
            margin: '0 auto 40px auto',
            lineHeight: '1.6'
          }}>
            Join the digital collective of India's strongest youth wing. Register as a cardholder, participate in state development campaigns, voice grievances, and follow leader initiatives.
          </p>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/join" className="btn btn-primary" style={{ fontSize: '16px', padding: '12px 32px' }}>
              Apply for Membership <ArrowRight size={18} />
            </Link>
            <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '16px', padding: '12px 32px' }}>
              Admin Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section style={{ padding: '40px 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          textAlign: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)' }}>100K+</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Active Digital Members</p>
          </div>
          <div>
            <h3 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)' }}>36</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Districts Represented</p>
          </div>
          <div>
            <h3 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)' }}>15,000+</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Complaints Assigned & Resolved</p>
          </div>
          <div>
            <h3 style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)' }}>500+</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>Youth Development Events</p>
          </div>
        </div>
      </section>

      {/* Core Features Cards */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="badge">Services</span>
            <h2 style={{ fontSize: '32px', fontWeight: '700' }}>Platform Offerings</h2>
            <p style={{ color: 'var(--text-muted)' }}>Explore the functional wings of our youth platform.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {/* Membership */}
            <div className="card glass">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '20px', padding: '12px' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Digital Card</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                Get your digital identity with a QR code. Verification at events, state rosters, and local assemblies.
              </p>
              <Link href="/join" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                Generate Card <ArrowRight size={14} />
              </Link>
            </div>

            {/* Events */}
            <div className="card glass">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '20px', padding: '12px' }}>
                <Calendar size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Events & Drives</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                Register for Blood donation camps, Tree plantation drives, Career bootcamps. Quick QR attendance scans.
              </p>
              <Link href="/events" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                Browse Events <ArrowRight size={14} />
              </Link>
            </div>

            {/* Grievance */}
            <div className="card glass">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '20px', padding: '12px' }}>
                <MessageSquare size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Grievance Portal</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '15px' }}>
                Submit civic or college complaints. Upload images of issues directly from your mobile. Admin responds with resolution status.
              </p>
              <Link href="/join" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                Register & Lodge <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Message Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '50px',
          alignItems: 'center'
        }}>
          <div>
            <span className="badge">President's Message</span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.3', marginBottom: '20px' }}>
              Building a Digital and Stronger Maharashtra
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '20px' }}>
              "Our goal is to integrate youth power with modern technology. By digitalizing the Yuva Sena platform, we are bringing administration, social campaigns, and grievance reporting directly onto your phones. Together, let's create an impact."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                backgroundImage: 'url(https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?fit=crop&w=100&h=100&q=80)',
                backgroundSize: 'cover'
              }} />
              <div>
                <h4 style={{ fontWeight: '700' }}>Aditya Thackeray</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>President, Yuva Sena</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="glass card" style={{
              maxWidth: '400px',
              padding: '30px',
              borderLeft: '4px solid var(--primary)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>Important Helplines</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PhoneCall size={16} color="var(--primary)" />
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Emergency Call Center</p>
                    <p style={{ fontWeight: '600' }}>+91-22-26468700</p>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PhoneCall size={16} color="var(--primary)" />
                  <div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Grievance Desk</p>
                    <p style={{ fontWeight: '600' }}>+91-9999988888</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
