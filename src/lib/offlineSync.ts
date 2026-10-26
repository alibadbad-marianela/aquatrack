import { WaterRecord } from '../types';
import { api } from './api';

const QUEUE_KEY = 'aquatrack_offline_queue';

export interface OfflineQueueItem {
  clientUuid: string;
  activityName: string;
  category: any;
  quantity: number;
  unit: any;
  quantityLiters: number;
  date: string;
  time: string;
  notes?: string;
  isEstimated: boolean;
  createdAt: string;
}

export const offlineSync = {
  getPendingQueue(): OfflineQueueItem[] {
    try {
      const data = localStorage.getItem(QUEUE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  enqueue(item: Omit<OfflineQueueItem, 'clientUuid' | 'createdAt'>): OfflineQueueItem {
    const queue = this.getPendingQueue();
    const newItem: OfflineQueueItem = {
      ...item,
      clientUuid: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    queue.push(newItem);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return newItem;
  },

  clearQueue(): void {
    localStorage.removeItem(QUEUE_KEY);
  },

  async syncPending(onProgress?: (syncedCount: number) => void): Promise<{ success: boolean; syncedCount: number }> {
    const queue = this.getPendingQueue();
    if (queue.length === 0) return { success: true, syncedCount: 0 };

    try {
      const result = await api.syncBatchRecords(queue);
      this.clearQueue();
      if (onProgress) onProgress(result.syncedCount);
      return { success: true, syncedCount: result.syncedCount };
    } catch (err) {
      console.error('Offline sync failed, keeping items in queue', err);
      return { success: false, syncedCount: 0 };
    }
  },
};
