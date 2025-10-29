import apiClient from '@/lib/api';
import { 
  NotificationFilters, 
  NotificationResponse, 
  NotificationCreateInput,
  BulkActionPayload 
} from '@/types/notification';

export const notificationApi = {
  /**
   * Get user notifications with filtering and pagination
   */
  async getUserNotifications(
    userId: string, 
    filters: NotificationFilters = {}
  ): Promise<NotificationResponse> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/api/notifications/${userId}${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get(endpoint, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    const raw = await response.json();
    // Normalize backend response shapes
    if (Array.isArray(raw)) {
      return {
        notifications: raw,
        unreadCount: 0,
        total: raw.length,
        page: Number(filters.page || 1),
        totalPages: 1,
      } as unknown as NotificationResponse;
    }
    if (raw && typeof raw === 'object') {
      if (!raw.notifications && raw.items && Array.isArray(raw.items)) {
        raw.notifications = raw.items;
        delete raw.items;
      }
      if (typeof raw.totalPages !== 'number' && typeof raw.total === 'number') {
        const pageSize = Number(filters.limit || 10);
        raw.totalPages = Math.max(1, Math.ceil(raw.total / pageSize));
      }
      return raw as NotificationResponse;
    }
    return { notifications: [], unreadCount: 0, total: 0, page: 1, totalPages: 1 } as unknown as NotificationResponse;
  },

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<{ unreadCount: number }> {
    const response = await apiClient.get(`/api/notifications/${userId}/unread-count`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch unread count: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (typeof data?.unreadCount === 'number') return { unreadCount: data.unreadCount };
    if (typeof data?.count === 'number') return { unreadCount: data.count };
    if (typeof data?.unread === 'number') return { unreadCount: data.unread };
    return { unreadCount: 0 };
  },

  /**
   * Create a new notification
   */
  async createNotification(data: NotificationCreateInput) {
    const response = await apiClient.post('/api/notifications', data);
    
    if (!response.ok) {
      throw new Error(`Failed to create notification: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Mark notification as read/unread
   */
  async updateNotification(id: string, isRead: boolean) {
    const response = await apiClient.put(`/api/notifications/${id}`, { isRead });
    
    if (!response.ok) {
      throw new Error(`Failed to update notification: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Bulk mark notifications as read
   */
  async bulkMarkAsRead(payload: BulkActionPayload & { userId: string }) {
    const response = await apiClient.post('/api/notifications/mark-read', payload);
    
    if (!response.ok) {
      throw new Error(`Failed to mark notifications as read: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Delete single notification
   */
  async deleteNotification(id: string, userId: string) {
    const response = await apiClient.delete(`/api/notifications/${id}`, {
      body: JSON.stringify({ userId }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete notification: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Bulk delete notifications
   */
  async bulkDeleteNotifications(payload: BulkActionPayload & { userId: string }) {
    const response = await apiClient.delete('/api/notifications/bulk', {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete notifications: ${response.statusText}`);
    }
    
    return response.json();
  }
};