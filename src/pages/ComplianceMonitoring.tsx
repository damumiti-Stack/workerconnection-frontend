import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, Eye, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../api/api';

interface ComplianceRecord {
  id: string;
  establishmentName: string;
  establishmentId: string;
  complianceType: 'safety' | 'documentation' | 'worker_welfare' | 'environmental' | 'legal';
  status: 'compliant' | 'non_compliant' | 'partial_compliant' | 'under_review';
  lastInspectionDate: Date;
  nextInspectionDate: Date;
  score: number;
  violations: number;
  inspector: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
}

const ComplianceMonitoring: React.FC = () => {
  const { t } = useLanguage();
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ComplianceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Fetch compliance records from API
  useEffect(() => {
    const fetchComplianceRecords = async () => {
      try {
        setLoading(true);
        const response = await api('/department/compliance', 'GET');
        setComplianceRecords(response.data || []);
        setFilteredRecords(response.data || []);
      } catch (error) {
        console.error('Failed to fetch compliance records:', error);
        // Compliance tracking not yet implemented, show empty state
        setComplianceRecords([]);
        setFilteredRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceRecords();
  }, []);

  // Filter records
  useEffect(() => {
    let filtered = complianceRecords;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.establishmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.establishmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.inspector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(record => record.complianceType === typeFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(record => record.priority === priorityFilter);
    }

    setFilteredRecords(filtered);
  }, [complianceRecords, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const getStatusColor = (status: ComplianceRecord['status']) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'non_compliant':
        return 'bg-red-100 text-red-800';
      case 'partial_compliant':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ComplianceRecord['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'non_compliant':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'partial_compliant':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'under_review':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceTypeLabel = (type: ComplianceRecord['complianceType']) => {
    switch (type) {
      case 'safety':
        return 'Safety Compliance';
      case 'documentation':
        return 'Documentation';
      case 'worker_welfare':
        return 'Worker Welfare';
      case 'environmental':
        return 'Environmental';
      case 'legal':
        return 'Legal Compliance';
      default:
        return type;
    }
  };

  const getStats = () => {
    const total = complianceRecords.length;
    const compliant = complianceRecords.filter(r => r.status === 'compliant').length;
    const nonCompliant = complianceRecords.filter(r => r.status === 'non_compliant').length;
    const partialCompliant = complianceRecords.filter(r => r.status === 'partial_compliant').length;
    const underReview = complianceRecords.filter(r => r.status === 'under_review').length;
    const avgScore = Math.round(complianceRecords.reduce((sum, r) => sum + r.score, 0) / total);
    const totalViolations = complianceRecords.reduce((sum, r) => sum + r.violations, 0);

    return { total, compliant, nonCompliant, partialCompliant, underReview, avgScore, totalViolations };
  };

  const stats = getStats();

  const exportData = () => {
    const csvContent = [
      ['Establishment', 'ID', 'Compliance Type', 'Status', 'Score', 'Violations', 'Last Inspection', 'Inspector'],
      ...filteredRecords.map(record => [
        record.establishmentName,
        record.establishmentId,
        getComplianceTypeLabel(record.complianceType),
        record.status,
        record.score,
        record.violations,
        record.lastInspectionDate.toLocaleDateString(),
        record.inspector
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compliance-monitoring.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Compliance Monitoring
          </h1>
          <p className="text-gray-600">
            Monitor and track compliance status across all establishments
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-green-600">{stats.compliant}</div>
            <div className="text-sm text-gray-600">Compliant</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-red-600">{stats.nonCompliant}</div>
            <div className="text-sm text-gray-600">Non-Compliant</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.partialCompliant}</div>
            <div className="text-sm text-gray-600">Partial</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.underReview}</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="card-mobile text-center">
            <div className={`text-2xl font-bold ${getScoreColor(stats.avgScore)}`}>{stats.avgScore}%</div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalViolations}</div>
            <div className="text-sm text-gray-600">Violations</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-mobile mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search establishments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="non_compliant">Non-Compliant</option>
              <option value="partial_compliant">Partial Compliant</option>
              <option value="under_review">Under Review</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="safety">Safety</option>
              <option value="documentation">Documentation</option>
              <option value="worker_welfare">Worker Welfare</option>
              <option value="environmental">Environmental</option>
              <option value="legal">Legal</option>
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
          
          <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Compliance Records */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading compliance data...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No compliance records found matching your criteria.</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div key={record.id} className="card-mobile">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getStatusIcon(record.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{record.establishmentName}</h3>
                      <p className="text-sm text-gray-600">{record.establishmentId}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="text-sm text-gray-600">
                          {getComplianceTypeLabel(record.complianceType)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(record.score)}`}>
                      {record.score}%
                    </div>
                    <div className="text-sm text-gray-600">Compliance Score</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Inspection Details</h4>
                    <p className="text-sm text-gray-600">Last: {record.lastInspectionDate.toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Next: {record.nextInspectionDate.toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Inspector: {record.inspector}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Violations</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${record.violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {record.violations}
                      </span>
                      <span className="text-sm text-gray-600">
                        {record.violations === 0 ? 'No violations' : 'violations found'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.priority === 'high' ? 'bg-red-100 text-red-800' :
                      record.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {record.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                {record.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Inspector Notes:</p>
                        <p className="text-sm text-yellow-700">{record.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Schedule Inspection
                    </button>
                    <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceMonitoring;