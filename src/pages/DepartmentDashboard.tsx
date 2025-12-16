import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, MapPin, Building2, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LocationMap from '../components/LocationMap';
import LastLoggedIn from './LastloggedIn';
import { useAuth } from '../contexts/AuthContext';
import { departmentApi, DepartmentStats, EstablishmentSummary } from '../api/department';
import WorkerAttendanceTable from '../components/WorkerAttendanceTable';
import WorkerPresentCount from '../components/WorkerPresentCount';

const DepartmentDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState<'stats' | 'map'>('stats');

  // Dynamic Data State
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [establishments, setEstablishments] = useState<EstablishmentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch stats and establishments concurrently
        const [statsData, estData] = await Promise.all([
          departmentApi.getStats(),
          departmentApi.getEstablishments()
        ]);
        setStats(statsData);
        setEstablishments(estData);
      } catch (error) {
        console.error("Failed to fetch department dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Optional: Poll for updates every 30s
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="card-mobile">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl md:text-3xl font-bold ${color}`}>{value?.toLocaleString() ?? '...'}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 mobile-nav-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {t('department.dashboard')}
            </h1>
            <p className="text-gray-600">
              Real-time monitoring of all establishments and workers
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
            <WorkerPresentCount />
            <LastLoggedIn time={user?.lastLoggedIn ?? null} />
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-2 bg-white rounded-lg p-1 w-fit shadow-sm">
            <button
              onClick={() => setSelectedView('stats')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedView === 'stats'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('map')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedView === 'map'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              <MapPin className="h-4 w-4 mr-1 inline" />
              Map View
            </button>
          </div>
        </div>

        {selectedView === 'stats' ? (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
              <StatCard
                icon={Building2}
                title="Total Establishments"
                value={stats?.totalEstablishments}
                color="text-indigo-600"
              />
              <StatCard
                icon={Users}
                title={t('department.totalWorkers')}
                value={stats?.totalWorkers}
                color="text-blue-600"
              />
              <StatCard
                icon={UserCheck}
                title="Present Today"
                value={stats?.workersPresent}
                color="text-emerald-600"
              />
              <StatCard
                icon={UserX}
                title="Absent/Inactive"
                value={stats?.workersAbsent}
                color="text-red-600"
              />
            </div>

            {/* Live Activity & Establishment List */}
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column: Live Activity Feed */}
              <div className="lg:col-span-1">
                <WorkerAttendanceTable />
              </div>

              {/* Right Column: Establishment List */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Establishments Status</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Live Updates
                    </span>
                  </div>
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3">Establishment</th>
                          <th className="px-4 py-3 text-center">Assigned</th>
                          <th className="px-4 py-3 text-center">Present</th>
                          <th className="px-4 py-3">Active Workers</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {establishments.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                              {loading ? 'Loading establishments...' : 'No establishments found.'}
                            </td>
                          </tr>
                        ) : (
                          establishments.map((est) => (
                            <tr key={est.establishmentId} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {est.name}
                                <div className="text-xs text-gray-500">{est.location}</div>
                              </td>
                              <td className="px-4 py-3 text-center text-gray-600 font-semibold">{est.totalWorkers}</td>
                              <td className="px-4 py-3 text-center">
                                <span className="text-green-600 font-bold">{est.presentNow}</span>
                              </td>
                              <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                                {est.checkedInList.length > 0
                                  ? est.checkedInList.map(w => w.fullName).join(', ')
                                  : <span className="text-gray-400 italic">None</span>
                                }
                              </td>
                              <td className="px-4 py-3">
                                <button className="text-blue-600 hover:text-blue-800" title="View Details">
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
          </>
        ) : (
          /* Location Map View */
          <div className="mb-8">
            <LocationMap
              locations={[]}
              center={{ latitude: 17.3850, longitude: 78.4867 }}
              zoom={13}
              height="600px"
              showControls={true}
              onLocationClick={(loc) => console.log(loc)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDashboard;
