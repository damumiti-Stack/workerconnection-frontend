import React, { useState, useEffect, useRef } from 'react';
import { Users, Search, Filter, Plus, Edit, Eye, Trash2, Download, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AddWorkerModal from './AddWorker';
import { fetchWorkerDetailsByEstablishment } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import { exportToExcel } from '../utils/download-excel';
import { useNavigate } from 'react-router-dom';
interface Worker {
  id: string;
  name: string;
  registrationId: string;
  mobileNumber: string;
  trade: string;
  category: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: Date;
  firstName: string;
  lastName?: string;
  aadhaarCardNumber: string;
  workingFromDate?: string; // yyyy-MM-dd
  workingToDate?: string; // yyyy-MM-dd
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  attendanceStatus: 'checked-in' | 'checked-out' | 'absent';
  employer: string;
  joinDate: Date;
  documents: {
    aadhar: boolean;
    photo: boolean;
    bankDetails: boolean;
  };
  stateName?: string; // optional, if available
}

interface WorkerOption {
  id: number;
  name: string;
  aadhaar: string;
}


const WorkerManagement: React.FC = () => {
  const { t } = useLanguage();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tradeFilter, setTradeFilter] = useState<string>('all');
  const [attendanceFilter, setAttendanceFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const hasFetchedRef = useRef(false);
  const navigate = useNavigate();

  // Mock data
  useEffect(() => {
    // const mockWorkers: Worker[] = [
    //   {
    //     id: '1',
    //     name: 'Ravi Kumar Sharma',
    //     registrationId: 'WK2024001234',
    //     mobileNumber: '9876543210',
    //     trade: 'Mason',
    //     category: 'Skilled',
    //     status: 'active',
    //     lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    //     location: {
    //       latitude: 17.3850,
    //       longitude: 78.4867,
    //       address: 'Construction Site - Hitech City'
    //     },
    //     attendanceStatus: 'checked-in',
    //     employer: 'ABC Construction Ltd',
    //     joinDate: new Date('2024-01-15'),
    //     documents: {
    //       aadhar: true,
    //       photo: true,
    //       bankDetails: true
    //     }
    //   },
    //   {
    //     id: '2',
    //     name: 'Priya Devi',
    //     registrationId: 'WK2024001235',
    //     mobileNumber: '9876543211',
    //     trade: 'Electrician',
    //     category: 'Skilled',
    //     status: 'active',
    //     lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000),
    //     attendanceStatus: 'checked-out',
    //     employer: 'XYZ Builders',
    //     joinDate: new Date('2024-02-01'),
    //     documents: {
    //       aadhar: true,
    //       photo: true,
    //       bankDetails: false
    //     }
    //   },
    //   {
    //     id: '3',
    //     name: 'Suresh Reddy',
    //     registrationId: 'WK2024001236',
    //     mobileNumber: '9876543212',
    //     trade: 'Carpenter',
    //     category: 'Semi-Skilled',
    //     status: 'inactive',
    //     lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    //     attendanceStatus: 'absent',
    //     employer: 'PQR Construction',
    //     joinDate: new Date('2023-12-10'),
    //     documents: {
    //       aadhar: true,
    //       photo: false,
    //       bankDetails: true
    //     }
    //   },
    //   {
    //     id: '4',
    //     name: 'Anjali Singh',
    //     registrationId: 'WK2024001237',
    //     mobileNumber: '9876543213',
    //     trade: 'Painter',
    //     category: 'Semi-Skilled',
    //     status: 'active',
    //     lastActive: new Date(Date.now() - 30 * 60 * 1000),
    //     location: {
    //       latitude: 17.3900,
    //       longitude: 78.4900,
    //       address: 'Residential Complex - Gachibowli'
    //     },
    //     attendanceStatus: 'checked-in',
    //     employer: 'DEF Developers',
    //     joinDate: new Date('2024-03-01'),
    //     documents: {
    //       aadhar: true,
    //       photo: true,
    //       bankDetails: true
    //     }
    //   },
    //   {
    //     id: '5',
    //     name: 'Ramesh Yadav',
    //     registrationId: 'WK2024001238',
    //     mobileNumber: '9876543214',
    //     trade: 'Helper',
    //     category: 'Unskilled',
    //     status: 'suspended',
    //     lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    //     attendanceStatus: 'absent',
    //     employer: 'GHI Construction',
    //     joinDate: new Date('2024-01-20'),
    //     documents: {
    //       aadhar: false,
    //       photo: true,
    //       bankDetails: false
    //     }
    //   }
    // ];

    setTimeout(() => {
      // setWorkers(mockWorkers);
      // setFilteredWorkers(mockWorkers);
      setLoading(false);
    }, 1000);
  }, []);

  console.log("Workers:", workers);
  console.log("Filtered Workers:", filteredWorkers);
  const loadWorkerDetails = async () => {
    const workerId = user?.type === "establishment" ? user?.establishmentId : null;
    if (!workerId) return;
    try {
      const data = await fetchWorkerDetailsByEstablishment(Number(workerId));
      setWorkers(Array.isArray(data) ? data : [data]); // handle if single object
    } catch (error) {
      console.error("Failed to fetch worker details:", error);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      loadWorkerDetails();
      hasFetchedRef.current = true;
    }
  }, []);

  // Filter workers based on search and filters
  useEffect(() => {
    let filtered = workers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(worker =>
        worker.firstName.toLowerCase().includes(searchTerm.toLowerCase()) //||
        // worker.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // worker.mobileNumber.includes(searchTerm) ||
        // worker.employer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(worker => worker.status === statusFilter);
    }

    // Trade filter
    if (tradeFilter !== 'all') {
      filtered = filtered.filter(worker => worker.trade.toLowerCase() === tradeFilter);
    }

    // Attendance filter
    if (attendanceFilter !== 'all') {
      filtered = filtered.filter(worker => worker.attendanceStatus === attendanceFilter);
    }

    setFilteredWorkers(filtered);
  }, [workers, searchTerm, statusFilter, tradeFilter, attendanceFilter]);

  const getStatusColor = (status: Worker['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceColor = (status: Worker['attendanceStatus']) => {
    switch (status) {
      case 'checked-in':
        return 'bg-green-100 text-green-800';
      case 'checked-out':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatLastActive = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleSelectWorker = (workerId: string) => {
    setSelectedWorkers(prev =>
      prev.includes(workerId)
        ? prev.filter(id => id !== workerId)
        : [...prev, workerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedWorkers.length === filteredWorkers.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(filteredWorkers.map(worker => worker.id));
    }
  };

  const exportWorkers = () => {
    // const csvContent = [
    //   ['Name', 'Registration ID', 'Mobile', 'Trade', 'Category', 'Status', 'Attendance', 'Employer', 'Join Date'],
    //   ...filteredWorkers.map(worker => [
    //     worker.name,
    //     worker.registrationId,
    //     worker.mobileNumber,
    //     worker.trade,
    //     worker.category,
    //     worker.status,
    //     worker.attendanceStatus,
    //     worker.employer,
    //     // worker.joinDate.toLocaleDateString()
    //   ])
    // ].map(row => row.join(',')).join('\n');

    // const blob = new Blob([csvContent], { type: 'text/csv' });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'workers-list.csv';
    // a.click();
    // window.URL.revokeObjectURL(url);
    const exportData = filteredWorkers.map(w => ({
      Aadhaar: w.aadhaarCardNumber,
      Mobile: w.mobileNumber,
      State: w.stateName,
      FirstName: w.firstName,
      FromDate: w.workingFromDate,
      ToDate: w.workingToDate,
    }));

    exportToExcel(exportData, "worker_management");

  };

  const getStats = () => {
    if (workers.length === 0) return { total: 0, active: 0, checkedIn: 0, pendingDocs: 0 };
    const total = workers.length;
    const active = workers.filter(w => w.status === 'active').length;
    const checkedIn = workers.filter(w => w.attendanceStatus === 'checked-in').length;
    // const pendingDocs = workers.filter(w => !w.documents.aadhar || !w.documents.photo || !w.documents.bankDetails).length;

    return { total, active, checkedIn /*, pendingDocs */ };
  };

  const stats = getStats();

  const handleAddWorker = async (worker: WorkerOption) => {
    console.log("Starting registration for:", worker);
    await loadWorkerDetails(); // Refresh list after adding worker
    setIsModalOpen(false);
    // navigate to worker registration form or call API
  };

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className='flex items-center space-x-3 mb-6'>
              <button onClick={() => navigate(-1)} className="p-2 rounded-full:bg-gray-100"><ArrowLeft className='h-6 w-6 text-gray-700' /></button>
              <div >
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Worker Management
                </h1>
                <p className="text-gray-600">
                  Manage and monitor all registered workers
                </p>
              </div>
            </div>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Worker
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Workers</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.checkedIn}</div>
            <div className="text-sm text-gray-600">Checked In</div>
          </div>
          {/* <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pendingDocs}</div>
            <div className="text-sm text-gray-600">Pending Docs</div>
          </div> */}
        </div>

        {/* Filters */}
        <div className="card-mobile mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* <select
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Trades</option>
              <option value="mason">Mason</option>
              <option value="electrician">Electrician</option>
              <option value="carpenter">Carpenter</option>
              <option value="painter">Painter</option>
              <option value="helper">Helper</option>
            </select>

            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Attendance</option>
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
              <option value="absent">Absent</option>
            </select> */}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedWorkers.length === filteredWorkers.length && filteredWorkers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Select All ({selectedWorkers.length} selected)
                </span>
              </label>
            </div>

            <button
              onClick={exportWorkers}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Workers List */}
        <div className="card-mobile">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Workers ({filteredWorkers.length})
            </h3>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredWorkers.length} of {workers.length} workers
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading workers...</p>
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No workers found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedWorkers.length === filteredWorkers.length && filteredWorkers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Worker</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">working From Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">working To Date</th>
                    {/* <th className="text-left py-3 px-4 font-medium text-gray-900">Attendance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((worker) => (
                    <tr key={worker.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedWorkers.includes(worker.id)}
                          onChange={() => handleSelectWorker(worker.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{worker.firstName}</p>
                          <p className="text-sm text-gray-600">{worker.aadhaarCardNumber}</p>
                          <p className="text-sm text-gray-600">{worker.mobileNumber}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{worker.workingFromDate}</p>
                          {/* <p className="text-sm text-gray-600">{worker.category}</p> */}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900">{worker.workingToDate}</p>
                      </td>
                      {/* <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(worker.attendanceStatus)}`}>
                          {worker.attendanceStatus.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {worker.location ? (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate max-w-32">{worker.location.address}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Unknown</span>
                        )}
                      </td> */}
                      {/* <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatLastActive(worker.lastActive)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-green-600 hover:text-green-700 hover:bg-green-100 rounded"
                            title="Edit Worker"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded"
                            title="Delete Worker"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <AddWorkerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddWorker}
      />

    </div>
  );
};

export default WorkerManagement;