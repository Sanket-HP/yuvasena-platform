'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header className="header-nav glass">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image
            src="/logo.png"
            alt="Yuva Sena Logo"
            width={34}
            height={34}
            priority
            style={{ borderRadius: '50%' }}
          />
          <span style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '0.5px' }}>
            YUVA SENA
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/news" className="nav-link">News</Link>
          <Link href="/events" className="nav-link">Events</Link>
          <Link href="/gallery" className="nav-link">Gallery</Link>
          <Link href="/join" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '8px' }}>Join Us</Link>
        </nav>

        {/* Actions: Theme Switcher & Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={toggleTheme} 
            className="btn btn-secondary" 
            style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="btn btn-secondary mobile-menu-btn" 
            style={{ width: '40px', height: '40px', padding: 0, borderRadius: '8px' }}
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="glass mobile-drawer" style={{
          position: 'absolute',
          top: '70px',
          left: 0,
          width: '100%',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
        }}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="/news" onClick={() => setMobileMenuOpen(false)}>News</Link>
          <Link href="/events" onClick={() => setMobileMenuOpen(false)}>Events</Link>
          <Link href="/gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
          <Link href="/join" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>Join Us</Link>
        </div>
      )}
    </header>
  );
}

