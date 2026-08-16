import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import './Notifications.css';

// Map raw backend notification to UI shape and pick icon/bg
const normalizeNotification = (raw) => {
  const title = (raw.title ?? raw.subject ?? '').toLowerCase();
  const type = (raw.type ?? raw.notificationType ?? '').toLowerCase();
  
  let icon = '🔔';
  let bg = 'var(--clay-light)';

  if (type.includes('practice') || title.includes('practice') || title.includes('approv')) {
    icon = '✅';
    bg = 'var(--sprout-light)';
  } else if (type.includes('scheme') || title.includes('scheme') || title.includes('subsid')) {
    icon = '🏛️';
    bg = 'var(--harvest-light)';
  } else if (type.includes('market') || title.includes('buyer') || type.includes('match')) {
    icon = '🛒';
    bg = 'var(--sky-light)';
  } else if (type.includes('learn') || title.includes('module') || type.includes('course')) {
    icon = '📚';
    bg = 'var(--sprout-light)';
  } else if (type.includes('reminder') || title.includes('remind')) {
    icon = '⏰';
    bg = 'var(--clay-light)';
  }

  // Format date nicely if present
  let dateStr = '';
  if (raw.createdAt || raw.timestamp) {
    const d = new Date(raw.createdAt || raw.timestamp);
    dateStr = ` · ${d.toLocaleDateString()}`;
  }

  return {
    id: raw.id ?? raw.notificationId,
    icon,
    bg,
    title: raw.title ?? raw.subject ?? 'Notification',
    desc: (raw.message ?? raw.content ?? raw.description ?? '') + dateStr,
    unread: raw.unread ?? raw.isUnread ?? !(raw.read ?? raw.isRead),
  };
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await notificationService.getNotifications();
      const list = Array.isArray(data) ? data : (data?.notifications ?? data?.content ?? []);
      setNotifications(list.map(normalizeNotification));
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load notifications.'
      );
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkRead = async (id) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error('Failed to mark read:', err);
      // Rollback on failure could be implemented here
    }
  };

  const handleMarkAllRead = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  if (loading) {
    return (
      <div className="notif-page">
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notif-page">
        <div className="card" style={{ padding: '24px', color: 'var(--clay)', textAlign: 'center' }}>
          {error}
          <br />
          <button className="btn btn-outline btn-sm" type="button" onClick={loadNotifications} style={{ marginTop: 12 }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notif-page">
      <div className="notif-header">
        <h2 className="notif-title">
          🔔 Notifications
          {unreadCount > 0 && <span className="notif-count">{unreadCount} new</span>}
        </h2>
        {unreadCount > 0 && (
          <button className="link-more" type="button" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="card notif-list-card">
        {notifications.map((n) => (
          <div
            className={`notif-card ${n.unread ? 'notif-unread' : ''}`}
            key={n.id}
            onClick={() => n.unread && handleMarkRead(n.id)}
          >
            <div className="icon-badge" style={{ background: n.bg }}>{n.icon}</div>
            <div className="notif-body">
              <b>{n.title}</b>
              <div className="notif-desc">{n.desc}</div>
            </div>
            {n.unread && <span className="unread-dot" />}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="notif-empty">You're all caught up 🌱</div>
        )}
      </div>
    </div>
  );
};

export default Notifications;