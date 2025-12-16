import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../api/attendance';
import { Users } from 'lucide-react';

const WorkerPresentCount: React.FC = () => {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const val = await attendanceApi.getCurrentPresentCount();
                setCount(val);
            } catch (e) {
                console.error("Failed to fetch present count", e);
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 10000); // Update every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium">Present Now</p>
                <p className="text-xl font-bold text-gray-900">
                    {count === null ? '...' : count}
                </p>
            </div>
        </div>
    );
};

export default WorkerPresentCount;
