'use client';

import React, { useState, useEffect } from 'react';
import { ImageIcon, Film, Download } from 'lucide-react';
import { API_URL } from '../config/api';

const fallbackGallery = [
  {
    id: '1',
    title: 'Yuva Sena Annual Sports Rally 2025',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?fit=crop&w=800&h=450&q=80',
    type: 'PHOTO',
    albumName: 'Rallies'
  },
  {
    id: '2',
    title: 'Tree plantation inauguration by Aditya Thackeray',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?fit=crop&w=800&h=450&q=80',
    type: 'PHOTO',
    albumName: 'Tree Plantation'
  },
  {
    id: '3',
    title: 'Youth Career Guidance Seminars at Pune',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?fit=crop&w=800&h=450&q=80',
    type: 'PHOTO',
    albumName: 'Career Guidance'
  }
];


export default function GalleryPage() {
  const [media, setMedia] = useState<any[]>(fallbackGallery);

  useEffect(() => {
    fetch(`${API_URL}/gallery`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) setMedia(data);
      })
      .catch(() => console.log('Using gallery fallbacks'));
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 0' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="badge">Media Gallery</span>
        <h2 style={{ fontSize: '36px', fontWeight: '800' }}>Moments & Milestones</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Photos and videos captured during Yuva Sena development campaigns across Maharashtra.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        {media.map((item) => (
          <div key={item.id} className="card glass" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              height: '240px',
              backgroundColor: 'var(--bg-tertiary)',
              backgroundImage: `url(${item.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <span className="badge" style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {item.type === 'PHOTO' ? <ImageIcon size={12} /> : <Film size={12} />}
                {item.albumName}
              </span>
            </div>
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{item.title}</span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '6px', borderRadius: '50%' }} aria-label="Download">
                <Download size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

