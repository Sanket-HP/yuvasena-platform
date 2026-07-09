'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Share2, Bookmark } from 'lucide-react';

const fallbackNews = [
  {
    id: '1',
    title: 'Yuva Sena State Youth Summit 2026 Announced',
    content: 'Yuva Sena President announced the grand schedule for the annual State Youth Summit to be held in Mumbai this November. Over 50,000 volunteers are expected to attend the event which aims to focus on youth employment, skill development programs, and local leadership workshops.',
    category: 'Summit',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?fit=crop&w=800&h=450&q=80',
    isTrending: true,
    publishAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Free Digital Skills Training Bootcamps across Districts',
    content: 'Yuva Sena is launching computer literacy and modern coding bootcamps across 15 districts of Maharashtra. These bootcamps will offer certified courses in Python, digital marketing, and web design, absolutely free for college student cardholders.',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?fit=crop&w=800&h=450&q=80',
    isTrending: false,
    publishAt: new Date().toISOString()
  }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>(fallbackNews);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/news`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) setNews(data);
      })
      .catch(() => console.log('Using news fallbacks'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '60px 0' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <span className="badge">Newsroom</span>
        <h2 style={{ fontSize: '36px', fontWeight: '800' }}>Latest Announcements</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Keep up to date with Yuva Sena events and initiatives.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px'
      }}>
        {news.map((item) => (
          <article key={item.id} className="card glass" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              height: '200px',
              backgroundColor: 'var(--bg-tertiary)',
              backgroundImage: `url(${item.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <span className="badge" style={{ position: 'absolute', top: '15px', left: '15px', marginBottom: 0, backgroundColor: 'var(--primary)', color: '#FFFFFF' }}>
                {item.category}
              </span>
              {item.isTrending && (
                <span className="badge" style={{ position: 'absolute', top: '15px', right: '15px', marginBottom: 0, backgroundColor: '#dc3545', color: '#FFFFFF' }}>
                  Trending
                </span>
              )}
            </div>
            
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <Calendar size={12} />
                <span>{new Date(item.publishAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              
              <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', lineHeight: '1.4' }}>
                {item.title}
              </h3>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                {item.content}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                <button className="btn btn-secondary" style={{ padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }}>
                  Read More
                </button>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%' }} aria-label="Share">
                    <Share2 size={14} />
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '8px', borderRadius: '50%' }} aria-label="Bookmark">
                    <Bookmark size={14} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
