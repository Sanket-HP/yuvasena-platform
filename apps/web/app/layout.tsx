import './globals.css';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './Navbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:8000'),
  title: 'Yuva Sena Digital Platform',
  description: 'Official Yuva Sena Youth Digital Platform for membership, grievance portal, event registrations, and youth leadership drives.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png'
  },
  openGraph: {
    title: 'Yuva Sena Digital Platform',
    description: 'Empowering youth voices and community development across Maharashtra.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Yuva Sena Branding' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yuva Sena Digital Platform',
    description: 'Empowering youth voices and community development across Maharashtra.',
    images: ['/twitter-card.png']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Navigation Header */}
        <Navbar />

        <main style={{ minHeight: 'calc(100vh - 350px)' }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-color)',
          padding: '60px 0 30px 0',
          fontSize: '14px',
          color: 'var(--text-secondary)'
        }}>
          <div className="container" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '15px', fontWeight: '700' }}>YUVA SENA</h4>
              <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>
                Empowering the youth of Maharashtra to lead change, build local capacities, and drive digital governance.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '15px', fontWeight: '700' }}>Resources</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="/news">News Feed</Link></li>
                <li><Link href="/events">Upcoming Events</Link></li>
                <li><Link href="/gallery">Gallery & Albums</Link></li>
                <li><Link href="/downloads">Downloads & Circulars</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '15px', fontWeight: '700' }}>Quick Actions</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="/join">Digital Membership Registration</Link></li>
                <li><Link href="/contact">Contact Support</Link></li>
                <li><a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">Admin Login</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '15px', fontWeight: '700' }}>Legal</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>

          <div className="container" style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            flexWrap: 'wrap'
          }}>
            <Image
              src="/logo.png"
              alt="Yuva Sena Logo"
              width={24}
              height={24}
              style={{ borderRadius: '50%' }}
            />
            <p>© {new Date().getFullYear()} Yuva Sena. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

