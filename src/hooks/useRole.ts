import { useState } from 'react';

type Role = 'worker' | 'establishment' | 'department' | null;

export function useRole() {
    // Initialize from localStorage immediately
    const [role, setRole] = useState<Role>(() => {
        return localStorage.getItem('role') as Role;
    });

    // No loading needed for sync localStorage
    const loading = false;

    // Helper to update role and storage atomically
    const updateRole = (newRole: Role) => {
        if (newRole) {
            localStorage.setItem('role', newRole);
        } else {
            localStorage.removeItem('role');
        }
        setRole(newRole);
    };

    return { role, loading, updateRole };
}
