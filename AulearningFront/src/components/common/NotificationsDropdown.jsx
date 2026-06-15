import { useEffect, useState } from 'react';

import NotificationService from '../../services/NotificationService';
import { useUI } from '../../hooks/useUI';

export default function NotificationsDropdown() {
  const { showError } = useUI();

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUnread = async () => {
    try {
      setLoading(true);

      const response = await NotificationService.unread();

      setNotifications(response.data ?? []);
    } catch {
      showError('No se pudieron cargar las notificaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnread();
  }, []);

  const handleRead = async (notification) => {
    try {
      await NotificationService.markAsRead(notification.id);

      setNotifications((prev) =>
        prev.filter((item) => item.id !== notification.id)
      );
    } catch {
      showError('No se pudo marcar la notificación como leída.');
    }
  };

  return (
    <div className="notifications-wrapper">
      <button
        type="button"
        className="notification-button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <i className="bi bi-bell" />

        {notifications.length > 0 && (
          <span>{notifications.length}</span>
        )}
      </button>

      {open && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h6>Notificaciones</h6>

            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={loadUnread}
            >
              <i className="bi bi-arrow-clockwise" />
            </button>
          </div>

          {loading ? (
            <div className="notifications-empty">
              Cargando...
            </div>
          ) : notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.slice(0, 6).map((notification) => (
                <div
                  className="notification-item"
                  key={notification.id}
                >
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.content}</p>
                    <small>
                      {notification.created_at
                        ? new Date(notification.created_at).toLocaleString()
                        : ''}
                    </small>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    title="Marcar como leída"
                    onClick={() => handleRead(notification)}
                  >
                    <i className="bi bi-check2" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="notifications-empty">
              No tienes notificaciones nuevas.
            </div>
          )}
        </div>
      )}
    </div>
  );
}