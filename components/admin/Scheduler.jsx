'use client';

import React, { useState, useEffect } from 'react';
import { getScheduledEvents, createScheduledEvent, updateScheduledEvent, deleteScheduledEvent } from '@/app/actions/adminActionsV2';
import { FaCalendarAlt, FaPlus, FaTrash, FaEdit, FaTimes, FaCheck, FaClock, FaWrench, FaRocket, FaBell } from 'react-icons/fa';

const EVENT_TYPES = {
  'maintenance': { label: 'Maintenance', color: '#ff9800', icon: <FaWrench /> },
  'update': { label: 'Update', color: '#2196f3', icon: <FaRocket /> },
  'event': { label: 'Event', color: '#9c27b0', icon: <FaCalendarAlt /> },
  'reminder': { label: 'Reminder', color: '#4caf50', icon: <FaBell /> },
};

const STATUS_COLORS = {
  'upcoming': '#2196f3',
  'active': '#4caf50',
  'completed': '#9e9e9e',
  'cancelled': '#f44336',
};

export default function Scheduler() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    title: '', description: '', eventType: 'maintenance', scheduledDate: '', color: '#ffe600'
  });

  useEffect(() => { fetchEvents(); }, []);

  async function fetchEvents() {
    setLoading(true);
    const res = await getScheduledEvents();
    if (res.success) setEvents(res.data);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    await createScheduledEvent(formData);
    setShowModal(false);
    setFormData({ title: '', description: '', eventType: 'maintenance', scheduledDate: '', color: '#ffe600' });
    fetchEvents();
  }

  async function handleStatusChange(eventId, newStatus) {
    await updateScheduledEvent(eventId, { status: newStatus });
    fetchEvents();
  }

  async function handleDelete(eventId) {
    if (confirm('Hapus event ini?')) {
      await deleteScheduledEvent(eventId);
      fetchEvents();
    }
  }

  // Calendar generation
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.scheduledDate?.startsWith(dateStr));
  };

  const today = new Date();
  const isToday = (day) => day === today.getDate() && currentMonth.getMonth() === today.getMonth() && currentMonth.getFullYear() === today.getFullYear();

  const sortedEvents = [...events].sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''));

  if (loading) return <div style={{ padding: '40px', fontWeight: 800, textTransform: 'uppercase' }}>Memuat Kalender...</div>;

  return (
    <div style={{ color: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #000', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '24px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaCalendarAlt /> Kalender <span style={{ background: '#ffe600', padding: '0 10px', border: '2px solid #000', borderRadius: '4px' }}>& Event</span>
        </h2>
        <button onClick={() => setShowModal(true)} style={{
          padding: '10px 20px', background: '#ffe600', border: '2px solid #000', borderRadius: '8px',
          fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
        }}>
          <FaPlus /> Buat Event
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Calendar Grid */}
        <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '24px', boxShadow: '6px 6px 0 rgba(0,0,0,0.08)' }}>
          {/* Month Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              style={{ background: 'none', border: '2px solid #ddd', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 800 }}>
              ◀
            </button>
            <h3 style={{ margin: 0, fontWeight: 900, fontSize: '16px' }}>
              {currentMonth.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              style={{ background: 'none', border: '2px solid #ddd', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 800 }}>
              ▶
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 900, color: '#999', padding: '8px 0', textTransform: 'uppercase' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDay(day);
              return (
                <div key={i} style={{
                  minHeight: '70px', padding: '6px', borderRadius: '6px',
                  background: isToday(day) ? '#fffde7' : day ? '#fafafa' : 'transparent',
                  border: isToday(day) ? '2px solid #ffe600' : '1px solid #eee',
                  position: 'relative'
                }}>
                  {day && (
                    <>
                      <div style={{ fontSize: '12px', fontWeight: isToday(day) ? 900 : 700, color: isToday(day) ? '#000' : '#666' }}>
                        {day}
                      </div>
                      {dayEvents.map((ev, j) => (
                        <div key={j} style={{
                          fontSize: '8px', fontWeight: 800, padding: '2px 4px', marginTop: '2px',
                          background: EVENT_TYPES[ev.eventType]?.color || '#ffe600',
                          color: '#fff', borderRadius: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                          {ev.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: '#fff', border: '3px solid #000', borderRadius: '12px', padding: '20px', boxShadow: '4px 4px 0 rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px', fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
              📋 Daftar Event ({events.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '500px', overflowY: 'auto' }}>
              {sortedEvents.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#999', fontWeight: 700, fontSize: '13px' }}>
                  Belum ada event terjadwal
                </div>
              ) : sortedEvents.map(ev => {
                const type = EVENT_TYPES[ev.eventType] || EVENT_TYPES.maintenance;
                return (
                  <div key={ev.id} style={{
                    padding: '12px', border: '2px solid #eee', borderRadius: '8px',
                    borderLeft: `4px solid ${type.color}`, background: '#fafafa'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {type.icon} {ev.title}
                        </div>
                        {ev.description && <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>{ev.description}</div>}
                        <div style={{ fontSize: '10px', color: '#999', marginTop: '4px', fontWeight: 700 }}>
                          📅 {ev.scheduledDate || 'Belum dijadwalkan'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <select
                          value={ev.status || 'upcoming'}
                          onChange={e => handleStatusChange(ev.id, e.target.value)}
                          style={{
                            fontSize: '10px', fontWeight: 800, padding: '4px 8px',
                            border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer',
                            background: STATUS_COLORS[ev.status || 'upcoming'], color: '#fff'
                          }}
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button onClick={() => handleDelete(ev.id)} style={{
                          background: '#ffebee', border: '1px solid #f44336', borderRadius: '4px',
                          padding: '4px 6px', cursor: 'pointer', color: '#c62828'
                        }}>
                          <FaTrash size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', width: '500px', borderRadius: '12px', border: '3px solid #000', boxShadow: '10px 10px 0 rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '2px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '16px' }}>Buat Event Baru</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}><FaTimes /></button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>Judul Event</label>
                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '6px', fontWeight: 700, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>Deskripsi</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3} style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '6px', fontWeight: 700, outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>Tipe Event</label>
                  <select value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '6px', fontWeight: 700, background: '#fff', cursor: 'pointer' }}>
                    <option value="maintenance">🔧 Maintenance</option>
                    <option value="update">🚀 Update</option>
                    <option value="event">📅 Event</option>
                    <option value="reminder">🔔 Reminder</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>Tanggal</label>
                  <input required type="date" value={formData.scheduledDate} onChange={e => setFormData({ ...formData, scheduledDate: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }} />
                </div>
              </div>
              <button type="submit" style={{
                padding: '14px', background: '#ffe600', border: '2px solid #000', borderRadius: '8px',
                fontWeight: 950, cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
              }}>
                Simpan Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
