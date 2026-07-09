'use client';

import React from 'react';
import { ShieldCheck, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '60px 0', maxWidth: '800px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="badge">Who We Are</span>
        <h2 style={{ fontSize: '36px', fontWeight: '800' }}>About Yuva Sena</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Empowering youth voices and community development since 2010.</p>
      </div>

      <div className="card glass" style={{ padding: '40px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: 'var(--primary)' }}>History & Foundation</h3>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Yuva Sena was founded in 2010 under the vision of Aditya Thackeray as the youth wing of Shiv Sena. Our foundation is built on the philosophy of 80% social service and 20% politics, with an emphasis on grassroot youth mobilization, educational reform, environmental responsibility, and civic duty.
        </p>
        <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          By creating this digital portal, we are taking our movement further into the modern age, offering digital identity cards to 100,000+ members, building local dispute resolution databases, tree monitoring, and educational assistance.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        <div className="card glass" style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
            <Target size={20} />
          </div>
          <h4 style={{ fontWeight: '700', marginBottom: '10px' }}>Our Mission</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Empower every student and young professional across Maharashtra to solve local development problems.
          </p>
        </div>

        <div className="card glass" style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
            <ShieldCheck size={20} />
          </div>
          <h4 style={{ fontWeight: '700', marginBottom: '10px' }}>Clean Leadership</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Nurture clean, accountable, and transparent youth leadership at Booth, Taluka, and District scales.
          </p>
        </div>

        <div className="card glass" style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto' }}>
            <Heart size={20} />
          </div>
          <h4 style={{ fontWeight: '700', marginBottom: '10px' }}>Social Welfare</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Coordinate medical drives, blood donations, environment protection, and digital education seminars.
          </p>
        </div>
      </div>
    </div>
  );
}

