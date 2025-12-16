import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

interface AttendanceRecord {
  id: string;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  checkInLocation?: { latitude: number; longitude: number; address: string };
  checkOutLocation?: { latitude: number; longitude: number; address: string };
  status: 'present' | 'absent' | 'partial' | 'holiday' | 'leave';
  workHours?: number;
  overtime?: number;
  notes?: string;
}

const AttendanceHistory: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Fetch attendance records from API
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Calculate date range for current month
        const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
        const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString();
        
        let endpoint = '';
        if (user.type === 'worker') {
          endpoint = `/attendance/worker/${user.id}?startDate=${startDate}&endDate=${endDate}`;
        } else if (user.type === 'establishment') {
          endpoint = `/attendance/establishment/${user.establishmentId}?startDate=${startDate}&endDate=${endDate}`;
        } else {
          // Department - show all attendance
          endpoint = `/attendance/current`;
        }

        const response = await api(endpoint, 'GET');
        
        // Map API response to component interface
        const mapped = (response.data || []).map((record: any) => {
          const checkIn = record.check_in_date_time ? new Date(record.check_in_date_time) : undefined;
          const checkOut = record.check_out_date_time ? new Date(record.check_out_date_time) : undefined;
          const workHours = (checkIn && checkOut) 
            ? (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60) 
            : undefined;

          return {
            id: record.attendance_id?.toString() || '',
            date: checkIn || new Date(),
            checkInTime: checkIn,
            checkOutTime: checkOut,
            checkInLocation: record.work_location ? {
              latitude: 0,
              longitude: 0,
              address: record.work_location
            } : undefined,
            status: checkOut ? 'present' : (checkIn ? 'partial' : 'absent'),
            workHours,
            overtime: workHours && workHours > 8 ? workHours - 8 : 0,
            notes: record.notes
          };
        });

        setAttendanceRecords(mapped);
      } catch (error) {
        console.error('Failed to fetch attendance:', error);
        setAttendanceRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [currentMonth, user]);

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'holiday':
        return 'bg-blue-100 text-blue-800';
      case 'leave':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'Present';
      case 'partial':
        return 'Partial';
      case 'absent':
        return 'Absent';
      case 'holiday':
        return 'Holiday';
      case 'leave':
        return 'Leave';
      default:
        return 'Unknown';
    }
  };

  const filteredRecords = selectedStatus === 'all' 
    ? attendanceRecords 
    : attendanceRecords.filter(record => record.status === selectedStatus);

  const getMonthStats = () => {
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const partial = attendanceRecords.filter(r => r.status === 'partial').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const holidays = attendanceRecords.filter(r => r.status === 'holiday').length;
    const totalWorkingDays = attendanceRecords.length - holidays;
    const totalHours = attendanceRecords.reduce((sum, record) => sum + (record.workHours || 0), 0);
    const totalOvertime = attendanceRecords.reduce((sum, record) => sum + (record.overtime || 0), 0);

    return {
      present,
      partial,
      absent,
      holidays,
      totalWorkingDays,
      totalHours: Math.round(totalHours * 10) / 10,
      totalOvertime: Math.round(totalOvertime * 10) / 10,
      attendancePercentage: totalWorkingDays > 0 ? Math.round(((present + partial) / totalWorkingDays) * 100) : 0
    };
  };

  const stats = getMonthStats();

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportData = () => {
    const csvContent = [
      ['Date', 'Status', 'Check In', 'Check Out', 'Work Hours', 'Overtime', 'Notes'],
      ...filteredRecords.map(record => [
        record.date.toLocaleDateString(),
        getStatusText(record.status),
        record.checkInTime ? formatTime(record.checkInTime) : '',
        record.checkOutTime ? formatTime(record.checkOutTime) : '',
        record.workHours ? record.workHours.toFixed(1) : '',
        record.overtime ? record.overtime.toFixed(1) : '',
        record.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Attendance History
          </h1>
          <p className="text-gray-600">
            Track your daily attendance and work hours
          </p>
        </div>

        {/* Month Navigation */}
        <div className="card-mobile mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-sm text-gray-600">Present</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.partial}</div>
            <div className="text-sm text-gray-600">Partial</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-sm text-gray-600">Absent</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.holidays}</div>
            <div className="text-sm text-gray-600">Holidays</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalHours}h</div>
            <div className="text-sm text-gray-600">Total Hours</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.attendancePercentage}%</div>
            <div className="text-sm text-gray-600">Attendance</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="card-mobile mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="partial">Partial</option>
                <option value="absent">Absent</option>
                <option value="holiday">Holiday</option>
                <option value="leave">Leave</option>
              </select>
            </div>
            
            <button
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="card-mobile">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Daily Records ({filteredRecords.length} entries)
          </h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading attendance data...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No attendance records found for the selected filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(record.date)}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {getStatusText(record.status)}
                        </span>
                      </div>
                    </div>
                    
                    {record.workHours && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {record.workHours.toFixed(1)} hours
                        </p>
                        {record.overtime && record.overtime > 0 && (
                          <p className="text-xs text-orange-600">
                            +{record.overtime.toFixed(1)}h overtime
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {(record.checkInTime || record.checkOutTime) && (
                    <div className="grid md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                      {record.checkInTime && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Check In: {formatTime(record.checkInTime)}
                            </p>
                            {record.checkInLocation && (
                              <p className="text-xs text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {record.checkInLocation.address}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {record.checkOutTime && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-red-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Check Out: {formatTime(record.checkOutTime)}
                            </p>
                            {record.checkOutLocation && (
                              <p className="text-xs text-gray-600 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {record.checkOutLocation.address}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {record.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {record.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;