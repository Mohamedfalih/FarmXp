import { useState } from 'react';
import './Notifications.css';

const Notifications = () => {
  // Mock data — matches the prototype's notifications list.
  // Later this becomes: notificationService.getNotifications().then(setNotifications)
  const [notifications, setNotifications] = useState([
    { id: 1, icon: '✅', bg: 'var(--sprout-light)', title: 'Practice approved', desc: "Your organic mulching submission was approved · 2h ago", unread: true },
    { id: 2, icon: '🏛️', bg: 'var(--harvest-light)', title: 'New scheme match', desc: "You're eligible for the Micro Irrigation Subsidy · 6h ago", unread: true },
    { id: 3, icon: '🛒', bg: 'var(--sky-light)', title: 'Buyer match found', desc: 'GreenGrain Exports wants your paddy · 1 day ago', unread: false },
    { id: 4, icon: '📚', bg: 'var(--sprout-light)', title: 'New module available', desc: '"Composting Basics" was added · 2 days ago', unread: false },
    { id: 5, icon: '⏰', bg: 'var(--clay-light)', title: 'Reminder', desc: "Log this week's water usage · 2 days ago", unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkRead = (id) => {
    // Later this becomes: notificationService.markAsRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleMarkAllRead = () => {
    // Later this becomes: notificationService.markAllAsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

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