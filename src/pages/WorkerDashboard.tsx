import React, { useState, useEffect } from 'react';
import { User, Clock, MapPin, Calendar, Bell, Settings, Loader, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth, WorkerUser } from '../contexts/AuthContext';
import LocationCheckIn from '../components/LocationCheckIn';
import LastLoggedIn from './LastloggedIn';
import { checkInOrOut, CheckInOutPayload } from '../api/api';
import { toast, Toaster } from "react-hot-toast";

interface AttendanceRecord {
  id: string;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  checkInLocation?: { latitude: number; longitude: number };
  checkOutLocation?: { latitude: number; longitude: number };
  status: 'present' | 'absent' | 'partial';
}

const WorkerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  // const [lastCheckInTime, setLastCheckInTime] = useState<Date | null>(null);
  const [lastCheckInTime, setLastCheckInTime] = useState<Date | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const worker = user as WorkerUser | undefined;
  const canCheckInOut = !!(worker?.establishmentId && worker?.estmtWorkerId);

  // Mock work location - in real app, this would come from API
  const workLocation = {
    latitude: 17.3850,
    longitude: 78.4867,
    name: 'Construction Site - Hitech City',
    allowedRadius: 100 // meters
  };

  // Mock attendance data
  useEffect(() => {
    const mockRecords: AttendanceRecord[] = [
      {
        id: '1',
        date: new Date(2024, 0, 15),
        checkInTime: new Date(2024, 0, 15, 9, 0),
        checkOutTime: new Date(2024, 0, 15, 17, 30),
        status: 'present'
      },
      {
        id: '2',
        date: new Date(2024, 0, 16),
        checkInTime: new Date(2024, 0, 16, 9, 15),
        checkOutTime: new Date(2024, 0, 16, 16, 45),
        status: 'present'
      },
      {
        id: '3',
        date: new Date(2024, 0, 17),
        status: 'absent'
      }
    ];
    setAttendanceRecords(mockRecords);
  }, []);

  // const handleCheckIn = async (coordinates: { latitude: number; longitude: number; timestamp: Date }) => {
  //   try {
  //     // In real app, send to API
  //     console.log('Check-in:', coordinates);

  //     setIsCheckedIn(true);
  //     setLastCheckInTime(coordinates.timestamp);

  //     // Add to attendance records
  //     const newRecord: AttendanceRecord = {
  //       id: Date.now().toString(),
  //       date: new Date(),
  //       checkInTime: coordinates.timestamp,
  //       checkInLocation: coordinates,
  //       status: 'partial'
  //     };

  //     setAttendanceRecords(prev => [newRecord, ...prev]);

  //     // Show success notification
  //     alert(t('worker.checkInSuccess'));
  //   } catch (error) {
  //     console.error('Check-in failed:', error);
  //     alert(t('worker.checkInError'));
  //   }
  // };

  // const handleCheckOut = async (coordinates: { latitude: number; longitude: number; timestamp: Date }) => {
  //   try {
  //     // In real app, send to API
  //     console.log('Check-out:', coordinates);

  //     setIsCheckedIn(false);

  //     // Update today's record
  //     setAttendanceRecords(prev =>
  //       prev.map(record => {
  //         if (record.checkInTime &&
  //           record.checkInTime.toDateString() === new Date().toDateString()) {
  //           return {
  //             ...record,
  //             checkOutTime: coordinates.timestamp,
  //             checkOutLocation: coordinates,
  //             status: 'present'
  //           };
  //         }
  //         return record;
  //       })
  //     );

  //     // Show success notification
  //     alert(t('worker.checkOutSuccess'));
  //   } catch (error) {
  //     console.error('Check-out failed:', error);
  //     alert(t('worker.checkOutError'));
  //   }
  // };



  const handleCheckIn = async () => {
    if (user?.type !== "worker") return;

    try {
      const payload: CheckInOutPayload = {
        attendanceId: 0, // backend will generate
        establishmentId: user.establishmentId, // TODO: replace with actual establishmentId
        workerId: user.id,
        estmtWorkerId: user.estmtWorkerId, // TODO: replace with actual estmtWorkerId if available
        workLocation: user.workLocation, // just a string
        checkInDateTime: new Date().toISOString(),
        checkOutDateTime: null,
        status: "i", // ✅ literal
      };

      const response = await checkInOrOut(payload);

      console.log("Check-in API response:", response.data);

      setIsCheckedIn(true);
      setLastCheckInTime(new Date());

      // Update local attendance records
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        date: new Date(),
        checkInTime: new Date(),
        status: "partial",
      };
      setAttendanceRecords((prev) => [newRecord, ...prev]);

      toast.success("worker.checkInSuccess", {
        duration: 4000,
        position: "top-center",
      });
      // alert(t("worker.checkInSuccess"));
    } catch (error) {
      console.error("Check-in failed:", error);
      toast.error("worker.checkInError", {
        duration: 4000,
        position: "top-center",
      });
    }
  };

  const handleCheckOut = async () => {
    if (user?.type !== "worker") return;

    try {
      const payload: CheckInOutPayload = {
        attendanceId: 0,
        establishmentId: 123, // TODO: replace
        workerId: user.id,
        estmtWorkerId: 0, // TODO: replace
        workLocation: "Vijayawada",
        checkOutDateTime: new Date().toISOString(),
        status: "o", // ✅ literal
      };

      const response = await checkInOrOut(payload);

      console.log("Check-out API response:", response.data);

      setIsCheckedIn(false);

      // Update today's record
      setAttendanceRecords((prev) =>
        prev.map((record) =>
          record.checkInTime &&
            record.checkInTime.toDateString() === new Date().toDateString()
            ? {
              ...record,
              checkOutTime: new Date(),
              status: "present",
            }
            : record
        )
      );

      toast.success("worker.checkOutSuccess", {
        duration: 4000,
        position: "top-center",
      });
    } catch (error) {
      console.error("Check-out failed:", error);
      toast.error("worker.checkOutError", {
        duration: 4000,
        position: "top-center",
      });
    }
  };




  const getAttendanceStats = () => {
    const thisMonth = attendanceRecords.filter(record =>
      record.date.getMonth() === currentMonth.getMonth() &&
      record.date.getFullYear() === currentMonth.getFullYear()
    );

    const present = thisMonth.filter(r => r.status === 'present').length;
    const absent = thisMonth.filter(r => r.status === 'absent').length;
    const partial = thisMonth.filter(r => r.status === 'partial').length;

    return { present, absent, partial, total: thisMonth.length };
  };

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center space-x-3 mb-2">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t('worker.dashboard')}
              </h1>
              <p className="text-gray-600">
                {/* {t('common.welcome')}, {user?.fullName} */}
                {t('common.welcome')},{" "}
                {user?.type === "worker" && user.fullName}
              </p>
            </div>
          </div>
          <LastLoggedIn time={user?.lastLoggedIn} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-sm text-gray-600">{t('department.present')}</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-sm text-gray-600">{t('department.absent')}</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.partial}</div>
            <div className="text-sm text-gray-600">{t('worker.partial')}</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">{t('worker.totalDays')}</div>
          </div>
        </div>

        {/* Location Check-in */}
        {canCheckInOut ? (

          <div className="mb-8">
            {/* <LocationCheckIn
            workLocation={workLocation}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            isCheckedIn={isCheckedIn}
            lastCheckInTime={lastCheckInTime}
          /> */}


            <div className="space-y-3">
              {!isCheckedIn ? (
                <button
                  onClick={handleCheckIn}
                  //     disabled={
                  //       isProcessing 
                  // }
                  // className={`w-full btn-mobile font-semibold ${workLocation
                  //     ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  //     : 'bg-green-600 text-white hover:bg-green-700'
                  //   }`}
                  className='w-full btn-mobile font-semibold bg-green-600 text-white hover:bg-green-700'
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      {t('worker.checkingIn')}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t('worker.checkIn')}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleCheckOut}
                  // disabled={isProcessing}
                  className="w-full btn-mobile bg-red-600 text-white hover:bg-red-700 font-semibold"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      {t('worker.checkingOut')}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('worker.checkOut')}
                    </div>
                  )}
                </button>
              )}


            </div>
          </div>
        ) : null}


        {/* Recent Attendance */}
        <div className="card-mobile">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('worker.recentAttendance')}
            </h3>
            <Calendar className="h-5 w-5 text-gray-500" />
          </div>

          <div className="space-y-3">
            {attendanceRecords.slice(0, 5).map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${record.status === 'present' ? 'bg-green-500' :
                    record.status === 'partial' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {record.date.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      {record.status === 'present' ? t('department.present') :
                        record.status === 'partial' ? t('worker.partial') :
                          t('department.absent')}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  {record.checkInTime && (
                    <div>In: {record.checkInTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</div>
                  )}
                  {record.checkOutTime && (
                    <div>Out: {record.checkOutTime.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {/* <div className="card-mobile">
            <div className="flex items-center space-x-3 mb-3">
              <Bell className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">{t('worker.notifications')}</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Monthly attendance report available</p>
              <p>• Safety training scheduled for next week</p>
              <p>• Wage payment processed</p>
            </div>
          </div> */}

          <div className="card-mobile">
            <div className="flex items-center space-x-3 mb-3">
              <Settings className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">{t('worker.quickActions')}</h3>
            </div>
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
                {t('worker.viewProfile')}
              </button>
              <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
                {t('worker.attendanceHistory')}
              </button>
              {/* <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700">
                {t('worker.updateDocuments')}
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;