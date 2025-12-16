import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Eye, Check, X, Clock, AlertTriangle, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../api/api';

interface Application {
  id: string;
  type: 'worker' | 'establishment';
  applicantName: string;
  registrationId: string;
  submissionDate: Date;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_clarification';
  priority: 'high' | 'medium' | 'low';
  reviewedBy?: string;
  reviewDate?: Date;
  documents: {
    total: number;
    verified: number;
    pending: number;
    rejected: number;
  };
  contactInfo: {
    mobile: string;
    email?: string;
  };
  location: {
    district: string;
    mandal: string;
  };
  notes?: string;
}

const ApplicationReview: React.FC = () => {
  const { t } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await api('/department/applications', 'GET');
        
        // Map API response to component interface
        const mapped = (response.data || []).map((app: any) => ({
          id: app.id || '',
          type: app.type || 'worker',
          applicantName: app.applicantName || '',
          registrationId: app.registrationId || '',
          submissionDate: app.submissionDate ? new Date(app.submissionDate) : new Date(),
          status: app.status || 'pending',
          priority: app.priority || 'medium',
          reviewedBy: app.reviewedBy,
          reviewDate: app.reviewDate ? new Date(app.reviewDate) : undefined,
          documents: app.documents || { total: 0, verified: 0, pending: 0, rejected: 0 },
          contactInfo: app.contactInfo || { mobile: '' },
          location: app.location || { district: '', mandal: '' },
          notes: app.notes
        }));

        setApplications(mapped);
        setFilteredApplications(mapped);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setApplications([]);
        setFilteredApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.contactInfo.mobile.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(app => app.type === typeFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(app => app.priority === priorityFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'requires_clarification':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Application['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'requires_clarification':
        return 'Needs Clarification';
      default:
        return 'Unknown';
    }
  };

  const handleApprove = (applicationId: string) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? {
              ...app,
              status: 'approved' as const,
              reviewedBy: 'Current User',
              reviewDate: new Date()
            }
          : app
      )
    );
  };

  const handleReject = (applicationId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? {
                ...app,
                status: 'rejected' as const,
                reviewedBy: 'Current User',
                reviewDate: new Date(),
                notes: reason
              }
            : app
        )
      );
    }
  };

  const handleRequestClarification = (applicationId: string) => {
    const clarification = prompt('What clarification is needed?');
    if (clarification) {
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? {
                ...app,
                status: 'requires_clarification' as const,
                reviewedBy: 'Current User',
                reviewDate: new Date(),
                notes: clarification
              }
            : app
        )
      );
    }
  };

  const getStats = () => {
    const total = applications.length;
    const pending = applications.filter(a => a.status === 'pending').length;
    const underReview = applications.filter(a => a.status === 'under_review').length;
    const approved = applications.filter(a => a.status === 'approved').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;

    return { total, pending, underReview, approved, rejected };
  };

  const stats = getStats();

  const exportApplications = () => {
    const csvContent = [
      ['Type', 'Applicant Name', 'Registration ID', 'Status', 'Priority', 'Submission Date', 'District', 'Mobile'],
      ...filteredApplications.map(app => [
        app.type,
        app.applicantName,
        app.registrationId,
        app.status,
        app.priority,
        app.submissionDate.toLocaleDateString(),
        app.location.district,
        app.contactInfo.mobile
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications-review.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Application Review
          </h1>
          <p className="text-gray-600">
            Review and process worker and establishment applications
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.underReview}</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
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
                  placeholder="Search applications..."
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
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="requires_clarification">Needs Clarification</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="worker">Worker</option>
              <option value="establishment">Establishment</option>
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredApplications.length} of {applications.length} applications
              </span>
            </div>
            
            <button
              onClick={exportApplications}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications found matching your criteria.</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div key={application.id} className="card-mobile">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      application.type === 'worker' ? 'bg-green-100' : 'bg-orange-100'
                    }`}>
                      {application.type === 'worker' ? (
                        <FileText className={`h-6 w-6 ${application.type === 'worker' ? 'text-green-600' : 'text-orange-600'}`} />
                      ) : (
                        <FileText className="h-6 w-6 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{application.applicantName}</h3>
                      <p className="text-sm text-gray-600">{application.registrationId}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {getStatusText(application.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(application.priority)}`}>
                          {application.priority.toUpperCase()} Priority
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {application.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Submitted: {application.submissionDate.toLocaleDateString()}
                    </p>
                    {application.reviewDate && (
                      <p className="text-sm text-gray-600">
                        Reviewed: {application.reviewDate.toLocaleDateString()}
                      </p>
                    )}
                    {application.reviewedBy && (
                      <p className="text-xs text-gray-500">
                        By: {application.reviewedBy}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                    <p className="text-sm text-gray-600">Mobile: {application.contactInfo.mobile}</p>
                    {application.contactInfo.email && (
                      <p className="text-sm text-gray-600">Email: {application.contactInfo.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
                    <p className="text-sm text-gray-600">District: {application.location.district}</p>
                    <p className="text-sm text-gray-600">Mandal: {application.location.mandal}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Documents Status</h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600">✓ {application.documents.verified}</span>
                      <span className="text-yellow-600">⏳ {application.documents.pending}</span>
                      <span className="text-red-600">✗ {application.documents.rejected}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(application.documents.verified / application.documents.total) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {application.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Notes:</p>
                        <p className="text-sm text-yellow-700">{application.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  {application.status === 'pending' || application.status === 'under_review' ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRequestClarification(application.id)}
                        className="flex items-center px-3 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Request Clarification
                      </button>
                      <button
                        onClick={() => handleReject(application.id)}
                        className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(application.id)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Application {application.status.replace('_', ' ')}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationReview;