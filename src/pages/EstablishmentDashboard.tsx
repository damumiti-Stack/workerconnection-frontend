import React, { useState, useEffect } from 'react';
import { Building2, Users, UserCheck, UserX, Calendar, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import LastLoggedIn from './LastloggedIn';
import { establishmentApi, WorkerSummary, EstablishmentDashboardData } from '../api/establishment';
import WorkerAttendanceTable from '../components/WorkerAttendanceTable';
import WorkerPresentCount from '../components/WorkerPresentCount';

const EstablishmentDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState<EstablishmentDashboardData | null>(null);
  const [workers, setWorkers] = useState<WorkerSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard data (workers + stats)
        const data = await establishmentApi.getDashboardData();
        setDashboardData(data);
        setWorkers(data.workers);
      } catch (error) {
        console.error("Failed to fetch establishment dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.type === "establishment") {
      fetchData();

      // Poll mostly for status updates if not using websockets
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const StatCard = ({ icon: Icon, title, value, color, link }: any) => (
    <Link to={link || '#'} className="card-mobile hover:shadow-xl transition-shadow group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl md:text-3xl font-bold ${color}`}>{value ?? '...'}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')} group-hover:scale-110 transition-transform`}>
          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color}`} />
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t('establishment.dashboard')}
              </h1>
              <p className="text-gray-600">
                {t('common.welcome')},{" "}
                {user?.type === "establishment" && user?.establishmentName}
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
            <WorkerPresentCount />
            <LastLoggedIn time={user?.lastLoggedIn || undefined} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            icon={Users}
            title={t('establishment.totalWorkers')}
            value={dashboardData?.totalWorkers}
            color="text-blue-600"
            link="/workers/management"
          />
          <StatCard
            icon={UserCheck}
            title="Present Today"
            value={dashboardData?.presentCount}
            color="text-green-600"
          />
          <StatCard
            icon={UserX}
            title="Absent Today"
            value={dashboardData?.absentCount}
            color="text-red-600"
          />
          {/* Example additional stat */}
          <StatCard
            icon={Calendar}
            title="Avg Attendance"
            value="92%"
            color="text-purple-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/workers/management" className="card-mobile hover:shadow-xl transition-shadow group">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-gray-900">{t('establishment.workerManagement')}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {t('establishment.manageWorkers')}
            </p>
            <div className="text-blue-600 group-hover:text-blue-700 text-sm font-medium">
              {t('common.view')} →
            </div>
          </Link>

          <Link to="/attendance/reports" className="card-mobile hover:shadow-xl transition-shadow group">
            <div className="flex items-center space-x-3 mb-3">
              <Calendar className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-gray-900">{t('establishment.attendanceReport')}</h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {t('establishment.viewAttendanceReports')}
            </p>
            <div className="text-green-600 group-hover:text-green-700 text-sm font-medium">
              {t('common.view')} →
            </div>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column: Live Activity Feed */}
          <div className="lg:col-span-1">
            <WorkerAttendanceTable />
          </div>

          {/* Right Column: Worker List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Assigned Workers Overview
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="px-3 py-1 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Worker Name</th>
                      <th className="px-4 py-3">Check-In</th>
                      <th className="px-4 py-3">Check-Out</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Loading workers...</td></tr>
                    ) : workers.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No workers assigned to this establishment.</td></tr>
                    ) : (
                      workers.map((worker) => (
                        <tr key={worker.workerId} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{worker.fullName}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {worker.checkInTime ? new Date(worker.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {worker.checkOutTime ? new Date(worker.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${worker.status === 'Present'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                              }`}>
                              {worker.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentDashboard;
