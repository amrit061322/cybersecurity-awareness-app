import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationService';

const NotificationBell = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [lastUnread, setLastUnread] = useState(0);
  const firstLoad = useRef(true);
  const toastTimer = useRef(null);

  const showToast = (message) => {
    setToast(message);
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => setToast(''), 4000);
  };

  const applyUnreadUpdate = (data, allowToast = true) => {
    const nextUnread = data.unreadCount || 0;
    if (!firstLoad.current && allowToast && nextUnread > lastUnread) {
      const newest = data.notifications?.[0];
      showToast(newest?.message || 'New notification');
    }
    firstLoad.current = false;
    setLastUnread(nextUnread);
  };

  const loadUnread = async (allowToast = true) => {
    try {
      const data = await fetchNotifications({ status: 'unread', limit: 5 });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      applyUnreadUpdate(data, allowToast);
    } catch (error) {
      setNotifications([]);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications({ limit: 10 });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      applyUnreadUpdate(data, false);
    } catch (error) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnread(false);
    const interval = setInterval(() => {
      if (open) {
        loadAll();
      } else {
        loadUnread();
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [open]);

  useEffect(() => {
    if (open) {
      loadAll();
    }
  }, [open]);

  useEffect(() => {
    const handleRefresh = () => {
      if (open) {
        loadAll();
      } else {
        loadUnread(false);
      }
    };
    window.addEventListener('notifications:refresh', handleRefresh);
    return () => window.removeEventListener('notifications:refresh', handleRefresh);
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!open) return;
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => () => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
  }, []);

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    setUnreadCount(0);
    setLastUnread(0);
    setNotifications((prev) => prev.map((item) => ({ ...item, readStatus: true })));
  };

  const getNotificationTarget = (item) => {
    if (item.target) return item.target;
    if (item.url) return item.url;

    if (item.type === 'scan') return '/detect-phishing';
    if (item.type === 'badge') return '/profile';
    if (item.type === 'like' || item.type === 'comment' || item.type === 'system') return '/community';

    return '/dashboard';
  };

  // Mark as read and optionally navigate to target
  const handleNotificationClick = async (item) => {
    await markNotificationRead(item._id);
    setNotifications((prev) => prev.map((n) => (n._id === item._id ? { ...n, readStatus: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    setLastUnread((prev) => Math.max(0, prev - 1));
    setOpen(false);
    navigate(getNotificationTarget(item));
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        className="relative w-10 h-10 rounded-full border border-primary-container/30 text-primary-container flex items-center justify-center"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary-container text-on-primary-container text-[10px] font-bold rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>
      {toast && !open && (
        <div className="absolute right-0 mt-2 w-64 glass-panel p-3 border border-primary-container/20 shadow-[0_0_20px_rgba(0,240,255,0.2)] text-sm text-on-surface z-30">
          <p className="font-semibold text-on-surface">New notification</p>
          <p className="text-on-surface-variant text-xs mt-1">{toast}</p>
        </div>
      )}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-surface-container-high border border-primary-container/15 rounded-xl shadow-[0_0_24px_rgba(0,240,255,0.12)] p-3 z-20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white font-semibold">Notifications</p>
            <button type="button" className="text-xs text-primary-container" onClick={handleMarkAll}>
              Mark all read
            </button>
          </div>
          {loading && <p className="text-slate-400 text-sm">Loading...</p>}
          {!loading && notifications.length === 0 && (
            <p className="text-slate-400 text-sm">No new notifications.</p>
          )}
          <div className="space-y-2 max-h-64 overflow-auto">
            {notifications.map((item) => (
              <button
                key={item._id}
                type="button"
                className={`w-full text-left px-3 py-2 rounded-lg border ${item.readStatus ? 'border-outline-variant/20 text-slate-400' : 'border-primary-container/40 text-white'} cursor-pointer hover:bg-cyan-900/10`}
                onClick={() => handleNotificationClick(item)}
              >
                <p className="text-sm">{item.message}</p>
                <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
