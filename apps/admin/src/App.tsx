import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Layers, 
  FileSpreadsheet, 
  Check, 
  X, 
  Plus, 
  Download, 
  LogOut, 
  UserCheck, 
  AlertTriangle,
  FileText,
  Activity,
  UserPlus
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [currentTab, setCurrentTab] = useState('overview');
  
  // Login credentials state
  const [loginEmail, setLoginEmail] = useState('admin@yuvasena.org');
  const [loginPassword, setLoginPassword] = useState('Admin@123');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Application Data States
  const [analytics, setAnalytics] = useState<any>({
    summary: { totalMembers: 1, todayRegistrations: 1, pendingApprovals: 1, activeComplaints: 1, totalEvents: 1 },
    charts: { districtGrowth: [{ district: 'Mumbai City', count: 1 }], dailyRegistrations: [{ date: 'Mon', count: 1 }] }
  });
  
  const [members, setMembers] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  
  // Selected items for modal controls
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [complaintReply, setComplaintReply] = useState('');
  
  // Forms states
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', location: '', maxRegistrations: 100 });
  const [newsForm, setNewsForm] = useState({ title: '', content: '', category: 'General', isTrending: false });
  const [notifForm, setNotifForm] = useState({ title: '', body: '', targetAudience: 'ALL' });

  // Load token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch initial tab data
  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token, currentTab]);

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      if (currentTab === 'overview') {
        const res = await fetch(`${API_URL}/analytics/overview`, { headers });
        if (res.ok) {
          const data = await res.json();
          setAnalytics(data);
        }
      } else if (currentTab === 'members') {
        const res = await fetch(`${API_URL}/members`, { headers });
        if (res.ok) {
          const data = await res.json();
          setMembers(data.items || []);
        }
      } else if (currentTab === 'complaints') {
        const res = await fetch(`${API_URL}/complaints/admin`, { headers });
        if (res.ok) {
          const data = await res.json();
          setComplaints(data || []);
        }
      } else if (currentTab === 'events') {
        const res = await fetch(`${API_URL}/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.user.role === 'MEMBER') {
        throw new Error('Access denied: User is not an Administrator');
      }

      localStorage.setItem('adminToken', data.accessToken);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      setToken(data.accessToken);
      setUser(data.user);
    } catch (err: any) {
      setLoginError(err.message || 'Connecting to server failed. Ensure backend API is active.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setUser(null);
  };

  // Member Status Controls (Approve / Suspend)
  const patchMemberStatus = async (memberId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/members/${memberId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Complaint Resolution controls
  const resolveComplaint = async (status: string) => {
    if (!selectedComplaint) return;
    try {
      const res = await fetch(`${API_URL}/complaints/${selectedComplaint.id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, reply: complaintReply })
      });

      if (res.ok) {
        setSelectedComplaint(null);
        setComplaintReply('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Event creation form handler
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...eventForm,
          date: new Date(eventForm.date).toISOString()
        })
      });
      if (res.ok) {
        setEventForm({ title: '', description: '', date: '', location: '', maxRegistrations: 100 });
        fetchData();
        alert('Event campaign created successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // News publishing form handler
  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newsForm,
          publishStatus: 'PUBLISHED'
        })
      });
      if (res.ok) {
        setNewsForm({ title: '', content: '', category: 'General', isTrending: false });
        alert('News article published successfully!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Broadcast push notifications
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notifForm)
      });
      if (res.ok) {
        setNotifForm({ title: '', body: '', targetAudience: 'ALL' });
        alert('Notification broadcasted to targeted users!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Excel Roster Export
  const exportToExcel = () => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    
    const formattedData = members.map(m => ({
      'Membership No': m.membershipNo,
      'Full Name': m.user.name,
      'Email Address': m.user.email,
      'Mobile Phone': m.user.phone,
      'District': m.district.name,
      'Taluka': m.taluka.name,
      'Booth': m.booth ? m.booth.name : 'N/A',
      'Blood Group': m.bloodGroup,
      'Occupation': m.occupation,
      'Status': m.status,
      'Joined Date': new Date(m.createdAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    saveAs(data, `YuvaSena_Members_${Date.now()}${fileExtension}`);
  };

  // Chart configuration sets
  const registrationsChartData = {
    labels: analytics.charts.dailyRegistrations.map((d: any) => d.date),
    datasets: [{
      label: 'Registrations',
      data: analytics.charts.dailyRegistrations.map((d: any) => d.count),
      borderColor: '#FF6B00',
      backgroundColor: 'rgba(255, 107, 0, 0.1)',
      tension: 0.3,
      fill: true
    }]
  };

  const districtChartData = {
    labels: analytics.charts.districtGrowth.map((d: any) => d.district),
    datasets: [{
      label: 'Members count',
      data: analytics.charts.districtGrowth.map((d: any) => d.count),
      backgroundColor: '#FF6B00',
      borderRadius: 4
    }]
  };

  if (!token) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0F0F12', padding: '20px' }}>
        <div className="glass card" style={{ width: '100%', maxWidth: '400px', padding: '40px 30px', borderTop: '4px solid var(--primary)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src="/logo.png" alt="Yuva Sena Logo" style={{ width: '50px', height: '50px', borderRadius: '50%', marginBottom: '15px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Yuva Sena Admin Login</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '5px' }}>Access panel using district or state credentials.</p>
          </div>

          {loginError && (
            <div style={{ backgroundColor: 'rgba(230, 57, 70, 0.1)', border: '1px solid rgba(230, 57, 70, 0.2)', padding: '10px 12px', borderRadius: '6px', color: '#E63946', fontSize: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={14} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="form-control" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '35px' }}>
          <img src="/logo.png" alt="Yuva Sena Logo" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '0.5px' }}>ADMIN CONSOLE</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          <button 
            onClick={() => setCurrentTab('overview')} 
            className={`btn ${currentTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <Activity size={16} /> Overview Dashboard
          </button>
          <button 
            onClick={() => setCurrentTab('members')} 
            className={`btn ${currentTab === 'members' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <Users size={16} /> Member Approvals
          </button>
          <button 
            onClick={() => setCurrentTab('complaints')} 
            className={`btn ${currentTab === 'complaints' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <MessageSquare size={16} /> Grievances Portal
          </button>
          <button 
            onClick={() => setCurrentTab('events')} 
            className={`btn ${currentTab === 'events' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <Calendar size={16} /> Campaigns CRUD
          </button>
        </nav>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' }}>
              SA
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: '600' }}>{user.name}</p>
              <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', gap: '8px' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="main-content">
        <header className="admin-header glass">
          <h2 style={{ fontSize: '18px', fontWeight: '700', textTransform: 'capitalize' }}>
            {currentTab === 'overview' ? 'Overview Analytics' : `${currentTab} Management`}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>API Status:</span>
            <span style={{ color: '#2A9D8F', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2A9D8F' }} /> CONNECTED
            </span>
          </div>
        </header>

        <div className="content-body">
          {/* TAB 1: Overview */}
          {currentTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Counters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}><Users size={24} /></div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TOTAL MEMBERS</p>
                    <h3>{analytics.summary.totalMembers}</h3>
                  </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}><UserPlus size={24} /></div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TODAY'S SIGNUPS</p>
                    <h3>{analytics.summary.todayRegistrations}</h3>
                  </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}><UserCheck size={24} /></div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>PENDING APPROVAL</p>
                    <h3>{analytics.summary.pendingApprovals}</h3>
                  </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' }}><MessageSquare size={24} /></div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>ACTIVE GRIEVANCES</p>
                    <h3>{analytics.summary.activeComplaints}</h3>
                  </div>
                </div>
              </div>

              {/* Chart panels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                <div className="card">
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>7-Day Membership Growth</h3>
                  <div style={{ height: '260px' }}>
                    <Line data={registrationsChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
                <div className="card">
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '20px' }}>District Membership Distribution</h3>
                  <div style={{ height: '260px' }}>
                    <Bar data={districtChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Members Approvals */}
          {currentTab === 'members' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Active Membership Applications</h3>
                <button onClick={exportToExcel} className="btn btn-secondary">
                  <FileSpreadsheet size={16} /> Export to Excel
                </button>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Membership No</th>
                      <th>Name</th>
                      <th>District</th>
                      <th>Taluka</th>
                      <th>Mobile</th>
                      <th>Blood Group</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No member applications found.</td>
                      </tr>
                    ) : (
                      members.map((m) => (
                        <tr key={m.id}>
                          <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{m.membershipNo}</td>
                          <td>{m.user.name}</td>
                          <td>{m.district.name}</td>
                          <td>{m.taluka.name}</td>
                          <td>{m.user.phone}</td>
                          <td>{m.bloodGroup}</td>
                          <td>
                            <span className={`status-badge ${
                              m.status === 'APPROVED' ? 'status-approved' : m.status === 'PENDING' ? 'status-pending' : 'status-suspended'
                            }`}>{m.status}</span>
                          </td>
                          <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {m.status === 'PENDING' && (
                              <button onClick={() => patchMemberStatus(m.id, 'APPROVED')} className="btn btn-success" style={{ padding: '6px 12px' }}>
                                <Check size={12} /> Approve
                              </button>
                            )}
                            {m.status !== 'SUSPENDED' && (
                              <button onClick={() => patchMemberStatus(m.id, 'SUSPENDED')} className="btn btn-danger" style={{ padding: '6px 12px' }}>
                                <X size={12} /> Suspend
                              </button>
                            )}
                            {m.status === 'SUSPENDED' && (
                              <button onClick={() => patchMemberStatus(m.id, 'APPROVED')} className="btn btn-success" style={{ padding: '6px 12px' }}>
                                Approve
                              </button>
                            )}
                            <a href={`${API_URL}/members/${m.id}/card`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '6px' }}>
                              <Download size={14} />
                            </a>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Grievances Portal */}
          {currentTab === 'complaints' && (
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px' }}>Submitted Grievances</h3>
              
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Submitted By</th>
                      <th>District</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No submitted complaints.</td>
                      </tr>
                    ) : (
                      complaints.map((c) => (
                        <tr key={c.id}>
                          <td style={{ fontWeight: '600' }}>{c.title}</td>
                          <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.description}</td>
                          <td>{c.member.user.name}</td>
                          <td>{c.member.district.name}</td>
                          <td>
                            <span className={`status-badge ${
                              c.status === 'RESOLVED' ? 'status-approved' : c.status === 'SUBMITTED' ? 'status-pending' : 'status-suspended'
                            }`}>{c.status}</span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => setSelectedComplaint(c)} className="btn btn-primary" style={{ padding: '6px 12px' }}>
                              Resolve
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* RESOLUTION MODAL OVERLAY */}
              {selectedComplaint && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                  <div className="card glass" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Resolve Complaint</h3>
                      <button onClick={() => setSelectedComplaint(null)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF' }}><X size={18} /></button>
                    </div>
                    
                    <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      <p><strong>Title:</strong> {selectedComplaint.title}</p>
                      <p><strong>Description:</strong> {selectedComplaint.description}</p>
                      <p><strong>Submitted by:</strong> {selectedComplaint.member.user.name} ({selectedComplaint.member.user.phone})</p>
                      {selectedComplaint.imageUrls && selectedComplaint.imageUrls.length > 0 && (
                        <div>
                          <p><strong>Attached Media:</strong></p>
                          <img src={selectedComplaint.imageUrls[0]} alt="Complaint attachment" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginTop: '5px' }} />
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Resolution Reply / Feedback</label>
                      <textarea value={complaintReply} onChange={(e) => setComplaintReply(e.target.value)} rows={3} className="form-control" placeholder="Action taken or response description..." required />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                      <button onClick={() => resolveComplaint('RESOLVED')} className="btn btn-success" style={{ flex: 1 }}>Mark Resolved</button>
                      <button onClick={() => resolveComplaint('CLOSED')} className="btn btn-secondary" style={{ flex: 1 }}>Close Ticket</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Campaign CRUD Panels */}
          {currentTab === 'events' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {/* Event Creation Form */}
              <div className="card">
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '20px', color: 'var(--primary)' }}>Create New Campaign Event</h3>
                <form onSubmit={handleCreateEvent}>
                  <div className="form-group">
                    <label className="form-label">Event Title</label>
                    <input type="text" value={eventForm.title} onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))} className="form-control" placeholder="Blood Donation Camp" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea value={eventForm.description} onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))} rows={2} className="form-control" placeholder="Camp details..." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Event Date</label>
                    <input type="datetime-local" value={eventForm.date} onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input type="text" value={eventForm.location} onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))} className="form-control" placeholder="Dadar, Mumbai" required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Create Event Campaign
                  </button>
                </form>
              </div>

              {/* News Publishing Panel */}
              <div className="card">
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '20px', color: 'var(--primary)' }}>Publish State News</h3>
                <form onSubmit={handleCreateNews}>
                  <div className="form-group">
                    <label className="form-label">Headline</label>
                    <input type="text" value={newsForm.title} onChange={(e) => setNewsForm(prev => ({ ...prev, title: e.target.value }))} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Content</label>
                    <textarea value={newsForm.content} onChange={(e) => setNewsForm(prev => ({ ...prev, content: e.target.value }))} rows={3} className="form-control" required />
                  </div>
                  <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <label className="form-label">Category</label>
                      <input type="text" value={newsForm.category} onChange={(e) => setNewsForm(prev => ({ ...prev, category: e.target.value }))} className="form-control" required />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: '10px', paddingTop: '20px' }}>
                      <input type="checkbox" checked={newsForm.isTrending} onChange={(e) => setNewsForm(prev => ({ ...prev, isTrending: e.target.checked }))} id="trending" />
                      <label htmlFor="trending" style={{ fontSize: '12px' }}>Is Trending?</label>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    Publish News Article
                  </button>
                </form>
              </div>

              {/* Send Notifications Panel */}
              <div className="card">
                <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '20px', color: 'var(--primary)' }}>Broadcast Push Notification</h3>
                <form onSubmit={handleSendNotification}>
                  <div className="form-group">
                    <label className="form-label">Notification Title</label>
                    <input type="text" value={notifForm.title} onChange={(e) => setNotifForm(prev => ({ ...prev, title: e.target.value }))} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message Body</label>
                    <textarea value={notifForm.body} onChange={(e) => setNotifForm(prev => ({ ...prev, body: e.target.value }))} rows={2} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <select value={notifForm.targetAudience} onChange={(e) => setNotifForm(prev => ({ ...prev, targetAudience: e.target.value }))} className="form-control">
                      <option value="ALL">All Users</option>
                      <option value="MEMBERS">Members Only</option>
                      <option value="ADMINS">Admins Only</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Send Push Notification
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
