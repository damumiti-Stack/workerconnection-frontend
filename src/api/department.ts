import { api } from './api';

export interface DepartmentStats {
    totalEstablishments: number;
    totalWorkers: number;
    workersPresent: number;
    workersAbsent: number;
    totalCheckIns: number;
    totalCheckOuts: number;
}

export interface EstablishmentSummary {
    establishmentId: number;
    name: string;
    location: string;
    totalWorkers: number;
    presentNow: number;
    checkedInList: Array<{
        workerId: number;
        fullName: string;
        checkInTime: string;
    }>;
}

export const departmentApi = {
    // Fetch overall department statistics
    getStats: async (): Promise<DepartmentStats> => {
        // Determine which endpoint maps to this. 
        // If not exact, we might aggregate from establishments, but ideal is a direct endpoint.
        // As per request: GET /api/department/establishments provides list, we might calc stats from it or separate call.
        // Let's assume a dashboard stats endpoint or aggregate on client if needed.
        // For now, let's try to get "card details" which seems to be the stats.
        const res = await api<{ data: DepartmentStats }>('/department/dashboard/stats', 'GET');
        return res.data;
    },

    // Fetch all establishments with their active status
    getEstablishments: async (): Promise<EstablishmentSummary[]> => {
        const res = await api<{ data: EstablishmentSummary[] }>('/department/establishments', 'GET');
        return res.data;
    },

    // Fetch specific establishment present status (detail view)
    getEstablishmentPresent: async (establishmentId: number) => {
        const res = await api<{ data: any }>(`/department/establishment/${establishmentId}/present`, 'GET');
        return res.data;
    }
};
