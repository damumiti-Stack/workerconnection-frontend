import React, { useState, useEffect } from 'react';
import { Building2, Search, Filter, Plus, Edit, Eye, Trash2, Download, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../api/api';
import toast from 'react-hot-toast';

interface Establishment {
  id: string;
  name: string;
  registrationId: string;
  ownerName: string;
  contactNumber: string;
  email: string;
  category: string;
  natureOfWork: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  registrationDate: Date;
  expiryDate: Date;
  address: {
    district: string;
    mandal: string;
    village: string;
    pincode: string;
  };
  projectDetails: {
    estimatedCost: number;
    workersCount: number;
    commencementDate: Date;
    completionDate?: Date;
  };
  compliance: {
    licenseValid: boolean;
    safetyCompliant: boolean;
    documentsComplete: boolean;
  };
}

const EstablishmentManagement: React.FC = () => {
  const { t } = useLanguage();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedEstablishments, setSelectedEstablishments] = useState<string[]>([]);

  // Fetch establishments from API
  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        setLoading(true);
        const response = await api('/department/establishments', 'GET');
        
        // Map API response to component interface
        const mapped = (response.data || []).map((est: any) => ({
          id: est.establishment_id?.toString() || '',
          name: est.establishment_name || '',
          registrationId: `EST${est.establishment_id}`,
          ownerName: est.contact_person || '',
          contactNumber: est.mobile_number?.toString() || '',
          email: est.email_id || '',
          category: est.establishment_category?.category_name || '',
          natureOfWork: est.establishment_work_nature?.work_nature_name || '',
          status: est.status || 'pending',
          registrationDate: est.registration_date ? new Date(est.registration_date) : new Date(),
          expiryDate: est.completion_date ? new Date(est.completion_date) : new Date(),
          address: {
            district: est.district_name || '',
            mandal: est.city_name || '',
            village: est.village_or_area_name || '',
            pincode: est.pincode?.toString() || ''
          },
          projectDetails: {
            estimatedCost: est.construction_estimated_cost || 0,
            workersCount: (est.no_of_male_workers || 0) + (est.no_of_female_workers || 0),
            commencementDate: est.commencement_date ? new Date(est.commencement_date) : new Date(),
            completionDate: est.completion_date ? new Date(est.completion_date) : undefined
          },
          compliance: {
            licenseValid: est.status === 'active',
            safetyCompliant: est.status === 'active',
            documentsComplete: est.is_accepted_terms_and_conditions === 'Y'
          }
        }));

        setEstablishments(mapped);
        setFilteredEstablishments(mapped);
      } catch (error) {
        console.error('Failed to fetch establishments:', error);
        toast.error('Failed to load establishments');
        setEstablishments([]);
        setFilteredEstablishments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishments();
  }, []);

  // Filter establishments based on search and filters
  useEffect(() => {
    let filtered = establishments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(establishment =>
        establishment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        establishment.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(establishment => establishment.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(establishment => establishment.category.toLowerCase().replace(/\s+/g, '_') === categoryFilter);
    }

    // District filter
    if (districtFilter !== 'all') {
      filtered = filtered.filter(establishment => establishment.address.district.toLowerCase() === districtFilter);
    }

    setFilteredEstablishments(filtered);
  }, [establishments, searchTerm, statusFilter, categoryFilter, districtFilter]);

  const getStatusColor = (status: Establishment['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceScore = (compliance: Establishment['compliance']) => {
    const total = Object.keys(compliance).length;
    const compliant = Object.values(compliance).filter(Boolean).length;
    return Math.round((compliant / total) * 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSelectEstablishment = (establishmentId: string) => {
    setSelectedEstablishments(prev =>
      prev.includes(establishmentId)
        ? prev.filter(id => id !== establishmentId)
        : [...prev, establishmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEstablishments.length === filteredEstablishments.length) {
      setSelectedEstablishments([]);
    } else {
      setSelectedEstablishments(filteredEstablishments.map(establishment => establishment.id));
    }
  };

  const exportEstablishments = () => {
    const csvContent = [
      ['Name', 'Registration ID', 'Owner', 'Contact', 'Category', 'Status', 'District', 'Workers', 'Estimated Cost'],
      ...filteredEstablishments.map(establishment => [
        establishment.name,
        establishment.registrationId,
        establishment.ownerName,
        establishment.contactNumber,
        establishment.category,
        establishment.status,
        establishment.address.district,
        establishment.projectDetails.workersCount,
        establishment.projectDetails.estimatedCost
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'establishments-list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const total = establishments.length;
    const active = establishments.filter(e => e.status === 'active').length;
    const pending = establishments.filter(e => e.status === 'pending').length;
    const totalWorkers = establishments.reduce((sum, e) => sum + e.projectDetails.workersCount, 0);
    const totalValue = establishments.reduce((sum, e) => sum + e.projectDetails.estimatedCost, 0);

    return { total, active, pending, totalWorkers, totalValue };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Establishment Management
              </h1>
              <p className="text-gray-600">
                Manage and monitor all registered establishments
              </p>
            </div>
            <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add Establishment
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalWorkers}</div>
            <div className="text-sm text-gray-600">Total Workers</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-lg font-bold text-purple-600">{formatCurrency(stats.totalValue / 10000000)}Cr</div>
            <div className="text-sm text-gray-600">Project Value</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-mobile mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search establishments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="private_commercial">Private Commercial</option>
              <option value="private_residential">Private Residential</option>
              <option value="state_government">State Government</option>
              <option value="central_government">Central Government</option>
            </select>
            
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Districts</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="visakhapatnam">Visakhapatnam</option>
              <option value="guntur">Guntur</option>
              <option value="krishna">Krishna</option>
              <option value="chittoor">Chittoor</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedEstablishments.length === filteredEstablishments.length && filteredEstablishments.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Select All ({selectedEstablishments.length} selected)
                </span>
              </label>
            </div>
            
            <button
              onClick={exportEstablishments}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Establishments List */}
        <div className="card-mobile">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Establishments ({filteredEstablishments.length})
            </h3>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredEstablishments.length} of {establishments.length} establishments
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading establishments...</p>
            </div>
          ) : filteredEstablishments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No establishments found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      <input
                        type="checkbox"
                        checked={selectedEstablishments.length === filteredEstablishments.length && filteredEstablishments.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Establishment</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Category & Work</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Project Details</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Compliance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEstablishments.map((establishment) => (
                    <tr key={establishment.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedEstablishments.includes(establishment.id)}
                          onChange={() => handleSelectEstablishment(establishment.id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{establishment.name}</p>
                          <p className="text-sm text-gray-600">{establishment.registrationId}</p>
                          <p className="text-sm text-gray-600">{establishment.ownerName}</p>
                          <p className="text-sm text-gray-600">{establishment.contactNumber}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{establishment.category}</p>
                          <p className="text-sm text-gray-600">{establishment.natureOfWork}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(establishment.status)}`}>
                          {establishment.status.charAt(0).toUpperCase() + establishment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          <div>
                            <p>{establishment.address.district}</p>
                            <p className="text-xs">{establishment.address.mandal}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{formatCurrency(establishment.projectDetails.estimatedCost)}</p>
                          <p className="text-gray-600">{establishment.projectDetails.workersCount} workers</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {establishment.projectDetails.commencementDate.toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-center">
                          <div className={`text-sm font-medium ${
                            getComplianceScore(establishment.compliance) >= 80 ? 'text-green-600' :
                            getComplianceScore(establishment.compliance) >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {getComplianceScore(establishment.compliance)}%
                          </div>
                          <div className="text-xs text-gray-500">Compliant</div>
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
                            title="Edit Establishment"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-100 rounded"
                            title="Delete Establishment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EstablishmentManagement;