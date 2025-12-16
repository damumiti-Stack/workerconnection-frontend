import { useState, useEffect, useCallback } from 'react';
import { attendanceApi, AttendanceRecord } from '../api/attendance';

export function useAttendanceRefresh(intervalSeconds = 10) {
    const [data, setData] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    const fetchData = useCallback(async () => {
        try {
            // Fetch latest activity for the live panel
            const records = await attendanceApi.getTodayAttendance();
            setData(records);
            setError(null);
            setLastUpdated(new Date());
        } catch (err: any) {
            console.error("Failed to refresh attendance:", err);
            // Don't set error on polling failure to avoid UI flicker, just log it
            // unless it's the first load
            if (loading) setError(err.message || 'Failed to load attendance');
        } finally {
            setLoading(false);
        }
    }, []); // dependencies

    useEffect(() => {
        fetchData(); // Initial fetch

        const intervalId = setInterval(fetchData, intervalSeconds * 1000);

        return () => clearInterval(intervalId);
    }, [fetchData, intervalSeconds]);

    return {
        attendanceData: data,
        loading,
        error,
        lastUpdated,
        refresh: fetchData
    };
}
