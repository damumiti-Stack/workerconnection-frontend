import { api } from './api';

export interface WorkerSummary {
    workerId: number;
    fullName: string;
    status: 'Present' | 'Not Present';
    checkInTime?: string;
    checkOutTime?: string;
}

export interface EstablishmentDashboardData {
    workers: WorkerSummary[];
    totalWorkers: number;
    presentCount: number;
    absentCount: number;
}

export const establishmentApi = {
    // Fetch all workers for the logged-in establishment
    getWorkers: async (): Promise<WorkerSummary[]> => {
        const res = await api<{ data: WorkerSummary[] }>('/establishment/workers', 'GET');
        return res.data;
    },

    // Get aggregated dashboard data if available, or we compute from workers
    getDashboardData: async (): Promise<EstablishmentDashboardData> => {
        // This might be a composite call or handled by the component
        const workers = await establishmentApi.getWorkers();

        // Calculate stats on client or fetch if backend provides
        const totalWorkers = workers.length;
        const presentCount = workers.filter(w => w.status === 'Present').length;
        const absentCount = totalWorkers - presentCount;

        return {
            workers,
            totalWorkers,
            presentCount,
            absentCount
        };
    }
};
