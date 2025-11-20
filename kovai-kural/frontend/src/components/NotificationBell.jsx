// frontend/src/components/NotificationBell.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import socketService from '../services/socket'; // if using socket

export default function NotificationBell() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [unreadCount, setUnread] = useState(0);
  const nav = useNavigate();

  async function load() {
    try {
      const res = await api.get(`/notifications?limit=10`);
      setItems(res.data.notifications || []);
      setUnread(res.data.notifications.filter(n=>!n.read).length);
    } catch (e) {}
  }

  useEffect(() => {
    if (!user) return;
    load();
    // socket
    const s = socketService();
    if (s) {
      s.on('notification', (n) => {
        setItems(prev => [n, ...prev]);
        setUnread(u => u + 1);
      });
    }
    return () => { if (s) s.off('notification'); }
  }, [user]);

  async function openNotification(n) {
    // mark read
    await api.post('/notifications/mark-read', { id: n._id });
    setUnread(u => Math.max(0, u - (n.read ? 0 : 1)));
    nav(n.entityType === 'post' ? `/post/${n.entityId}` : `/profile/${n.actor?.handle}`);
  }

  return (
    <div className="notif-bell">
      <button className="bell-btn">🔔<span className="badge">{unreadCount}</span></button>
      <div className="notif-dropdown">
        {items.map(n => (
          <div key={n._id} className={`notif-item ${n.read ? 'read':'unread'}`} onClick={() => openNotification(n)}>
            <div><strong>{n.actor?.name}</strong> {n.message}</div>
            <div className="muted small">{new Date(n.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
