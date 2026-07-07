'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Check, UserPlus, Info, CheckCircle2 } from 'lucide-react';

// Geographic Fallbacks for Instant Frontend Testing
const fallbackDistricts = [
  { id: '1', name: 'Mumbai City' },
  { id: '2', name: 'Pune' },
  { id: '3', name: 'Thane' }
];

const fallbackTalukas: Record<string, { id: string; name: string }[]> = {
  '1': [{ id: '101', name: 'Colaba' }, { id: '102', name: 'Byculla' }],
  '2': [{ id: '201', name: 'Haveli' }, { id: '202', name: 'Shirur' }],
  '3': [{ id: '301', name: 'Kalyan' }, { id: '302', name: 'Ulhasnagar' }]
};

const fallbackBooths: Record<string, { id: string; name: string }[]> = {
  '101': [{ id: '1001', name: 'Booth 101' }, { id: '1002', name: 'Booth 102' }],
  '102': [{ id: '1003', name: 'Booth 201' }, { id: '1004', name: 'Booth 202' }],
  '201': [{ id: '1005', name: 'Booth 301' }, { id: '1006', name: 'Booth 302' }],
  '202': [{ id: '1007', name: 'Booth 401' }, { id: '1008', name: 'Booth 402' }]
};

export default function Join() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    bloodGroup: '',
    occupation: '',
    address: '',
    districtId: '',
    talukaId: '',
    booth: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    profilePhotoUrl: ''
  });

  // Dynamic Geography state
  const [districts, setDistricts] = useState(fallbackDistricts);
  const [talukas, setTalukas] = useState<{ id: string; name: string }[]>([]);
  const [booths, setBooths] = useState<{ id: string; name: string }[]>([]);

  // Load districts on mount (try backend API, fallback on failure)
  useEffect(() => {
    fetch('http://localhost:4000/api/v1/geography/districts')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) setDistricts(data);
      })
      .catch(() => console.log('Using district fallbacks'));
  }, []);

  // Update Talukas when District changes
  useEffect(() => {
    if (!formData.districtId) {
      setTalukas([]);
      return;
    }
    fetch(`http://localhost:4000/api/v1/geography/districts/${formData.districtId}/talukas`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) setTalukas(data);
        else setTalukas(fallbackTalukas[formData.districtId] || []);
      })
      .catch(() => {
        setTalukas(fallbackTalukas[formData.districtId] || []);
      });
    setFormData(prev => ({ ...prev, talukaId: '', booth: '' }));
  }, [formData.districtId]);

  // Update Booths when Taluka changes
  useEffect(() => {
    if (!formData.talukaId) {
      setBooths([]);
      return;
    }
    fetch(`http://localhost:4000/api/v1/geography/talukas/${formData.talukaId}/booths`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) setBooths(data);
        else setBooths(fallbackBooths[formData.talukaId] || []);
      })
      .catch(() => {
        setBooths(fallbackBooths[formData.talukaId] || []);
      });
    setFormData(prev => ({ ...prev, booth: '' }));
  }, [formData.talukaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setError(null);
    // Simple Validation per step
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.bloodGroup || !formData.occupation) {
        setError('Please fill in all required personal details');
        return;
      }
    } else if (step === 2) {
      if (!formData.address || !formData.districtId || !formData.talukaId) {
        setError('Please fill in all address and geographical details');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Format clean empty inputs for socials
    const payload = {
      ...formData,
      facebookUrl: formData.facebookUrl || undefined,
      twitterUrl: formData.twitterUrl || undefined,
      instagramUrl: formData.instagramUrl || undefined,
      profilePhotoUrl: formData.profilePhotoUrl || undefined,
      booth: formData.booth || undefined
    };

    try {
      const response = await fetch('http://localhost:4000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || result.errors?.join(', ') || 'Registration failed');
      }

      setSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container" style={{ padding: '80px 0', maxWidth: '600px', textAlign: 'center' }}>
        <div className="card glass animate-fade-in" style={{ padding: '40px 30px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(40, 167, 69, 0.1)', color: '#28a745', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '15px' }}>Application Submitted</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '25px' }}>
            Thank you for registering, <strong>{formData.name}</strong>. Your membership number is being generated and profile is sent to the District Admin for approval.
          </p>
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '15px', borderRadius: '8px', marginBottom: '30px', fontSize: '14px', textAlign: 'left' }}>
            <p><strong>Email:</strong> {formData.email}</p>
            <p><strong>Mobile:</strong> {formData.phone}</p>
            <p><strong>Status:</strong> <span style={{ color: '#FF6B00', fontWeight: '600' }}>PENDING APPROVAL</span></p>
          </div>
          <button onClick={() => router.push('/')} className="btn btn-primary" style={{ width: '100%' }}>
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 0', maxWidth: '680px' }}>
      <div className="card glass animate-fade-in" style={{ padding: '40px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <UserPlus size={40} color="var(--primary)" style={{ marginBottom: '10px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: '800' }}>Join Yuva Sena</h2>
          <p style={{ color: 'var(--text-muted)' }}>Complete the registration form to acquire your digital membership card.</p>
        </div>

        {/* Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '15px', left: 0, width: '100%', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: '15px', left: 0, width: `${(step - 1) * 50}%`, height: '2px', backgroundColor: 'var(--primary)', zIndex: 2, transition: 'width 0.3s ease' }} />
          
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: step >= s ? 'var(--primary)' : 'var(--bg-tertiary)',
                color: step >= s ? '#FFFFFF' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '12px',
                border: '3px solid var(--bg-secondary)',
                transition: 'background-color 0.3s'
              }}>
                {s}
              </div>
              <span style={{ fontSize: '10px', fontWeight: '600', marginTop: '6px', color: step >= s ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {s === 1 ? 'Personal' : s === 2 ? 'Geographic' : 'Socials'}
              </span>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.2)', padding: '12px 16px', borderRadius: '8px', color: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '20px' }}>
            <Info size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} placeholder="Rahul Kulkarni" required />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="rahul@example.com" required />
                </div>
                <div>
                  <label className="form-label">Mobile Number *</label>
                  <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} placeholder="9876543210" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Create Password *</label>
                <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="form-label">Blood Group *</label>
                  <select name="bloodGroup" className="form-control" value={formData.bloodGroup} onChange={handleChange} required>
                    <option value="">Select Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Occupation *</label>
                  <input type="text" name="occupation" className="form-control" value={formData.occupation} onChange={handleChange} placeholder="Student, Engineer..." required />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Address & Geography */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="form-group">
                <label className="form-label">Residential Address *</label>
                <textarea name="address" rows={3} className="form-control" value={formData.address} onChange={handleChange} placeholder="Flat, Street name..." required />
              </div>
              <div className="form-group">
                <label className="form-label">District *</label>
                <select name="districtId" className="form-control" value={formData.districtId} onChange={handleChange} required>
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="form-label">Taluka *</label>
                  <select name="talukaId" className="form-control" value={formData.talukaId} onChange={handleChange} disabled={!formData.districtId} required>
                    <option value="">Select Taluka</option>
                    {talukas.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Booth (Optional)</label>
                  <select name="booth" className="form-control" value={formData.booth} onChange={handleChange} disabled={!formData.talukaId}>
                    <option value="">Select Booth</option>
                    {booths.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Social & Photo */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="form-group">
                <label className="form-label">Profile Image URL (Optional)</label>
                <input type="url" name="profilePhotoUrl" className="form-control" value={formData.profilePhotoUrl} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label className="form-label">Facebook Profile URL (Optional)</label>
                <input type="url" name="facebookUrl" className="form-control" value={formData.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter Profile URL (Optional)</label>
                <input type="url" name="twitterUrl" className="form-control" value={formData.twitterUrl} onChange={handleChange} placeholder="https://twitter.com/..." />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram Profile URL (Optional)</label>
                <input type="url" name="instagramUrl" className="form-control" value={formData.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', marginTop: '30px', width: '100%' }}>
            {step > 1 && (
              <button type="button" onClick={handleBack} className="btn btn-secondary" style={{ flex: 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="btn btn-primary" style={{ flex: 1 }}>
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 2 }}>
                {loading ? 'Submitting...' : 'Submit Application'} <Check size={16} />
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
