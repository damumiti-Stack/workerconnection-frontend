import React from 'react';
import { useAttendanceRefresh } from '../hooks/useAttendanceRefresh';
import { Clock, UserCheck, UserX } from 'lucide-react';

const WorkerAttendanceTable: React.FC = () => {
    const { attendanceData, loading, error, lastUpdated } = useAttendanceRefresh(10);

    if (loading && attendanceData.length === 0) {
        return <div className="p-4 text-center text-gray-500">Loading live attendance...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Today's Live Activity
                </h3>
                <span className="text-xs text-gray-500">
                    Updated: {lastUpdated.toLocaleTimeString()}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">Worker Name</th>
                            <th className="px-4 py-3">Check-In</th>
                            <th className="px-4 py-3">Check-Out</th>
                            <th className="px-4 py-3">Duration</th>
                            <th className="px-4 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                                    No activity recorded today yet.
                                </td>
                            </tr>
                        ) : (
                            attendanceData.map((record, idx) => (
                                <tr key={`${record.workerId}-${idx}`} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {record.workerName}
                                        {record.establishmentName && (
                                            <span className="block text-xs text-gray-500 font-normal">
                                                {record.establishmentName}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{record.duration || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${record.status === 'Present'
                                                ? 'bg-green-100 text-green-800'
                                                : record.status === 'Checked Out'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {record.status === 'Present' && <UserCheck className="h-3 w-3 mr-1" />}
                                            {record.status === 'Absent' && <UserX className="h-3 w-3 mr-1" />}
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WorkerAttendanceTable;
