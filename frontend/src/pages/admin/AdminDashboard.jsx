import React, { useEffect, useState } from 'react';
import { Users, CalendarCheck, DollarSign, MessageSquare, Package, ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from '../../components/shared/AdminLayout';
import api from '../../utils/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: '24px 28px', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: 20, border: '1px solid var(--border-color)' }}>
    <div style={{ width: 56, height: 56, borderRadius: 14, background: color === 'var(--accent)' ? 'rgba(201,168,76,0.15)' : color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={24} color={color}/>
    </div>
    <div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);

const ThemedTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isDark = document.documentElement.classList.contains('dark');
    return (
      <div style={{ background: isDark ? '#1b263b' : 'white', padding: '12px 16px', border: `1px solid ${isDark ? '#415a77' : '#e5e7eb'}`, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 13, color: isDark ? '#e0e1dd' : '#1f2937' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: '4px 0', fontSize: 12, color: entry.color, fontWeight: 600 }}>
            {entry.name}: {entry.name === 'revenue' ? `₹${entry.value.toLocaleString()}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topPackages, setTopPackages] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(r => {
        setStats(r.data.stats);
        const data = r.data.monthlyBookings.map(item => ({
          month: `${MONTHS[item._id.month - 1]} ${item._id.year}`,
          bookings: item.count,
          revenue: item.revenue,
        }));
        setChartData(data);
        setCategoryData(r.data.categoryStats.map(c => ({ name: c._id, value: c.count })));
        setTopPackages(r.data.topPackages);
        setRecentBookings(r.data.recentBookings);
      })
      .catch(e => { console.error('Dashboard error:', e); alert(e.response?.data?.message || 'Failed to load dashboard'); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div style={{ padding: 32 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Real-time insights into your travel platform.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><div className="spinner"/></div>
        ) : (
          <>
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
              <StatCard icon={Users}         label="Total Users"     value={stats?.totalUsers}     color="#6366f1" sub="Registered users"/>
              <StatCard icon={CalendarCheck} label="Total Bookings"  value={stats?.totalBookings}  color="#10b981" sub="All time"/>
              <StatCard icon={DollarSign}    label="Total Revenue"   value={`₹${(stats?.totalRevenue/1000).toFixed(0)}K`} color="var(--accent)" sub="Confirmed bookings"/>
              <StatCard icon={MessageSquare} label="Open Feedback"   value={stats?.feedbackCount}  color="#ef4444" sub="Awaiting reply"/>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginBottom: 32 }}>
              {/* Trends Chart */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond' }}>Booking Trends</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Last 6 months performance</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['line', 'bar'].map(t => (
                      <button key={t} onClick={() => setChartType(t)} style={{
                        padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
                        background: chartType === t ? 'var(--accent)' : 'var(--gray-100)',
                        color: chartType === t ? 'var(--primary)' : 'var(--text-main)',
                        fontWeight: chartType === t ? 700 : 500
                      }}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
                    ))}
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={320}>
                  {chartType === 'line' ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5}/>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border-color)' }}/>
                      <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border-color)' }}/>
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border-color)' }}/>
                      <Tooltip content={<ThemedTooltip />} />
                      <Legend/>
                      <Line yAxisId="left"  type="monotone" dataKey="bookings" stroke="var(--primary)"  strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }}/>
                      <Line yAxisId="right" type="monotone" dataKey="revenue"  stroke="var(--accent)"  strokeWidth={3} dot={{ fill: 'var(--accent)', r: 4 }} activeDot={{ r: 6 }}/>
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5}/>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border-color)' }}/>
                      <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border-color)' }}/>
                      <Tooltip content={<ThemedTooltip />} />
                      <Legend/>
                      <Bar dataKey="bookings" fill="var(--primary)"  radius={[4,4,0,0]}/>
                      <Bar dataKey="revenue"  fill="var(--accent)"   radius={[4,4,0,0]}/>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Category Pie Chart */}
              <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond', marginBottom: 24 }}>Category Reach</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>Top Packages</h3>
                  {topPackages.map((pkg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border-color)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{pkg.title}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{pkg.count} bookings</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 20, padding: 28, boxShadow: 'var(--shadow)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', fontFamily: 'Cormorant Garamond' }}>Recent Bookings</h2>
                <button style={{ color: 'var(--accent)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>View All</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>USER</th>
                      <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>PACKAGE</th>
                      <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>DATE</th>
                      <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>AMOUNT</th>
                      <th style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b, i) => (
                      <tr key={i} style={{ borderBottom: i < recentBookings.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                        <td style={{ padding: '16px', fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>{b.user?.name || 'Unknown'}</td>
                        <td style={{ padding: '16px', fontSize: 14, color: 'var(--text-muted)' }}>{b.package?.title}</td>
                        <td style={{ padding: '16px', fontSize: 14, color: 'var(--text-muted)' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '16px', fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>₹{b.totalAmount.toLocaleString()}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ 
                            padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                            background: b.status === 'Confirmed' ? '#dcfce7' : b.status === 'Cancelled' ? '#fee2e2' : '#fef9c3',
                            color: b.status === 'Confirmed' ? '#166534' : b.status === 'Cancelled' ? '#991b1b' : '#854d0e'
                          }}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

