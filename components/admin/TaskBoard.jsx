'use client';

import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '@/app/actions/adminActionsV2';
import { FaClipboardList, FaPlus, FaTrash, FaTimes, FaArrowRight, FaArrowLeft, FaFlag } from 'react-icons/fa';

const COLUMNS = [
  { id: 'todo', label: '📋 To Do', color: '#ff9800' },
  { id: 'in_progress', label: '⚡ In Progress', color: '#2196f3' },
  { id: 'done', label: '✅ Done', color: '#4caf50' },
];

const PRIORITY_MAP = {
  'urgent': { label: 'URGENT', color: '#f44336', bg: '#ffebee' },
  'high': { label: 'HIGH', color: '#ff9800', bg: '#fff3e0' },
  'medium': { label: 'MEDIUM', color: '#2196f3', bg: '#e3f2fd' },
  'low': { label: 'LOW', color: '#9e9e9e', bg: '#f5f5f5' },
};

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', status: 'todo', assignee: '' });

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    setLoading(true);
    const res = await getTasks();
    if (res.success) setTasks(res.data);
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    await createTask(formData);
    setShowModal(false);
    setFormData({ title: '', description: '', priority: 'medium', status: 'todo', assignee: '' });
    fetchTasks();
  }

  async function moveTask(taskId, newStatus) {
    await updateTask(taskId, { status: newStatus });
    fetchTasks();
  }

  async function handleDelete(taskId) {
    if (confirm('Hapus task ini?')) {
      await deleteTask(taskId);
      fetchTasks();
    }
  }

  const getColumnTasks = (status) => tasks.filter(t => (t.status || 'todo') === status);

  if (loading) return <div style={{ padding: '40px', fontWeight: 800, textTransform: 'uppercase' }}>Memuat Task Board...</div>;

  return (
    <div style={{ color: '#000' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '3px solid #000', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '24px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaClipboardList /> Task <span style={{ background: '#ffe600', padding: '0 10px', border: '2px solid #000', borderRadius: '4px' }}>Board</span>
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowModal(true)} style={{
            padding: '10px 20px', background: '#ffe600', border: '2px solid #000', borderRadius: '8px',
            fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
          }}>
            <FaPlus /> Tambah Task
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        {COLUMNS.map(col => (
          <div key={col.id} style={{
            padding: '8px 16px', background: '#fff', border: '2px solid #000', borderRadius: '8px',
            fontWeight: 800, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color }}></div>
            {col.label}: {getColumnTasks(col.id).length}
          </div>
        ))}
        <div style={{ padding: '8px 16px', background: '#ffe600', border: '2px solid #000', borderRadius: '8px', fontWeight: 900, fontSize: '12px' }}>
          Total: {tasks.length}
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', minHeight: '500px' }}>
        {COLUMNS.map(col => (
          <div key={col.id} style={{
            background: '#f8f9fa', border: '3px solid #000', borderRadius: '12px',
            padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.06)'
          }}>
            {/* Column Header */}
            <div style={{
              padding: '10px 14px', background: col.color, color: '#fff',
              borderRadius: '8px', fontWeight: 900, fontSize: '13px',
              textTransform: 'uppercase', textAlign: 'center', border: '2px solid #000'
            }}>
              {col.label} ({getColumnTasks(col.id).length})
            </div>

            {/* Task Cards */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '600px' }}>
              {getColumnTasks(col.id).length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#ccc', fontWeight: 700, fontSize: '12px', border: '2px dashed #ddd', borderRadius: '8px' }}>
                  Kosong
                </div>
              ) : getColumnTasks(col.id).map(task => {
                const priority = PRIORITY_MAP[task.priority || 'medium'];
                const colIdx = COLUMNS.findIndex(c => c.id === col.id);
                return (
                  <div key={task.id} style={{
                    background: '#fff', border: '2px solid #000', borderRadius: '8px',
                    padding: '14px', boxShadow: '2px 2px 0 rgba(0,0,0,0.05)',
                    borderTop: `3px solid ${priority.color}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 900,
                        background: priority.bg, color: priority.color, textTransform: 'uppercase'
                      }}>
                        <FaFlag size={8} /> {priority.label}
                      </span>
                      <button onClick={() => handleDelete(task.id)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '12px'
                      }}>
                        <FaTrash />
                      </button>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '6px' }}>{task.title}</div>
                    {task.description && (
                      <div style={{ fontSize: '11px', color: '#888', marginBottom: '8px', lineHeight: '1.4' }}>{task.description}</div>
                    )}
                    {task.assignee && (
                      <div style={{ fontSize: '10px', color: '#999', fontWeight: 700, marginBottom: '8px' }}>👤 {task.assignee}</div>
                    )}
                    {/* Move Buttons */}
                    <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                      {colIdx > 0 && (
                        <button onClick={() => moveTask(task.id, COLUMNS[colIdx - 1].id)} style={{
                          flex: 1, padding: '6px', background: '#f0f0f0', border: '1px solid #ddd',
                          borderRadius: '4px', cursor: 'pointer', fontWeight: 800, fontSize: '10px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                        }}>
                          <FaArrowLeft size={8} /> {COLUMNS[colIdx - 1].label.replace(/[^\w\s]/g, '').trim()}
                        </button>
                      )}
                      {colIdx < COLUMNS.length - 1 && (
                        <button onClick={() => moveTask(task.id, COLUMNS[colIdx + 1].id)} style={{
                          flex: 1, padding: '6px', background: '#e3f2fd', border: '1px solid #90caf9',
                          borderRadius: '4px', cursor: 'pointer', fontWeight: 800, fontSize: '10px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                        }}>
                          {COLUMNS[colIdx + 1].label.replace(/[^\w\s]/g, '').trim()} <FaArrowRight size={8} />
                        </button>
                      )}
                    </div>
                    <div style={{ fontSize: '9px', color: '#ccc', marginTop: '8px', fontWeight: 700 }}>
                      {new Date(task.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', width: '480px', borderRadius: '12px', border: '3px solid #000', boxShadow: '10px 10px 0 rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '2px solid #000', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
              <h3 style={{ margin: 0, fontWeight: 900 }}>Tambah Task Baru</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}><FaTimes /></button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>Judul Task</label>
                <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '6px', fontWeight: 700, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>Deskripsi</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3} style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '6px', fontWeight: 700, outline: 'none', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>Prioritas</label>
                  <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '6px', fontWeight: 700, background: '#fff' }}>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🔵 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="urgent">🔴 Urgent</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>Assignee</label>
                  <input value={formData.assignee} onChange={e => setFormData({ ...formData, assignee: e.target.value })} placeholder="Nama admin..."
                    style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '6px', fontWeight: 700, outline: 'none' }} />
                </div>
              </div>
              <button type="submit" style={{
                padding: '14px', background: '#ffe600', border: '2px solid #000', borderRadius: '8px',
                fontWeight: 950, cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase',
                boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
              }}>
                Buat Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
