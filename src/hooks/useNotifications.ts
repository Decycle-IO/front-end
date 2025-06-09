import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: number;
  read: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add a new notification
  const addNotification = useCallback((type: NotificationType, message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: Date.now(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Also show a toast for immediate feedback
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast(message);
        break;
      case 'warning':
        toast(message, {
          icon: '⚠️',
          style: {
            backgroundColor: '#FEF3C7',
            color: '#92400E',
          },
        });
        break;
    }

    return newNotification.id;
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Get unread notifications count
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  // Convenience methods for different notification types
  const success = useCallback(
    (message: string) => addNotification('success', message),
    [addNotification]
  );

  const error = useCallback(
    (message: string) => addNotification('error', message),
    [addNotification]
  );

  const info = useCallback(
    (message: string) => addNotification('info', message),
    [addNotification]
  );

  const warning = useCallback(
    (message: string) => addNotification('warning', message),
    [addNotification]
  );

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    success,
    error,
    info,
    warning,
  };
};
