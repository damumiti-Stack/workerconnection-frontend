import { api } from './api';

export interface AttendanceRecord {
    workerId: number;
    workerName: string;
    establishmentName?: string;
    checkInTime: string;
    checkOutTime?: string;
    duration?: string; // e.g., "8h 30m"
    status: 'Present' | 'Absent' | 'Checked Out';
}

export const attendanceApi = {
    // Get today's attendance for all or specific worker
    getTodayAttendance: async (workerId?: number): Promise<AttendanceRecord[]> => {
        const query = workerId ? `?workerId=${workerId}` : '';
        const res = await api<{ data: AttendanceRecord[] }>(`/attendance/today${query}`, 'GET');
        return res.data;
    },

    // Get latest attendance events (live feed)
    getLatest: async (): Promise<AttendanceRecord[]> => {
        const res = await api<{ data: AttendanceRecord[] }>('/attendance/latest', 'GET');
        return res.data;
    },

    // Get currently present count
    getCurrentPresentCount: async (): Promise<number> => {
        const res = await api<{ data: { count: number } }>('/attendance/current/count', 'GET');
        return res.data.count;
    },

    // Mark attendance (check-in/out) - used by card scan logic
    markAttendance: async (payload: { cardId: string, location?: string }) => {
        return await api('/worker/checkinorout-by-card', 'POST', payload);
    }
};
