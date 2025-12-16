import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Eye, Check, X, Download, Upload, AlertTriangle, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../api/api';

interface Document {
  id: string;
  workerName: string;
  workerId: string;
  documentType: 'aadhar' | 'photo' | 'bank' | 'nres' | 'experience' | 'skill';
  fileName: string;
  fileSize: string;
  uploadDate: Date;
  status: 'pending' | 'verified' | 'rejected' | 'requires_clarification';
  verifiedBy?: string;
  verificationDate?: Date;
  rejectionReason?: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
}

const DocumentVerification: React.FC = () => {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await api('/department/documents', 'GET');
        setDocuments(response.data || []);
        setFilteredDocuments(response.data || []);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        // Document management not yet implemented, show empty state
        setDocuments([]);
        setFilteredDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Filter documents
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    if (documentTypeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.documentType === documentTypeFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(doc => doc.priority === priorityFilter);
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, statusFilter, documentTypeFilter, priorityFilter]);

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'requires_clarification':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Document['priority']) => {
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

  const getDocumentTypeLabel = (type: Document['documentType']) => {
    switch (type) {
      case 'aadhar':
        return 'Aadhar Card';
      case 'photo':
        return 'Passport Photo';
      case 'bank':
        return 'Bank Details';
      case 'nres':
        return 'NRES Certificate';
      case 'experience':
        return 'Experience Certificate';
      case 'skill':
        return 'Skill Certificate';
      default:
        return type;
    }
  };

  const handleVerify = (documentId: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? {
              ...doc,
              status: 'verified' as const,
              verifiedBy: 'Current User',
              verificationDate: new Date()
            }
          : doc
      )
    );
  };

  const handleReject = (documentId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === documentId
            ? {
                ...doc,
                status: 'rejected' as const,
                verifiedBy: 'Current User',
                verificationDate: new Date(),
                rejectionReason: reason
              }
            : doc
        )
      );
    }
  };

  const handleRequestClarification = (documentId: string) => {
    const notes = prompt('What clarification is needed?');
    if (notes) {
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === documentId
            ? {
                ...doc,
                status: 'requires_clarification' as const,
                verifiedBy: 'Current User',
                verificationDate: new Date(),
                notes: notes
              }
            : doc
        )
      );
    }
  };

  const getStats = () => {
    const total = documents.length;
    const pending = documents.filter(d => d.status === 'pending').length;
    const verified = documents.filter(d => d.status === 'verified').length;
    const rejected = documents.filter(d => d.status === 'rejected').length;
    const clarification = documents.filter(d => d.status === 'requires_clarification').length;

    return { total, pending, verified, rejected, clarification };
  };

  const stats = getStats();

  const exportDocuments = () => {
    const csvContent = [
      ['Worker Name', 'Worker ID', 'Document Type', 'File Name', 'Status', 'Upload Date', 'Verified By'],
      ...filteredDocuments.map(doc => [
        doc.workerName,
        doc.workerId,
        getDocumentTypeLabel(doc.documentType),
        doc.fileName,
        doc.status,
        doc.uploadDate.toLocaleDateString(),
        doc.verifiedBy || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document-verification.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Document Verification
          </h1>
          <p className="text-gray-600">
            Review and verify worker documents for registration approval
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
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="card-mobile text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.clarification}</div>
            <div className="text-sm text-gray-600">Clarification</div>
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
                  placeholder="Search documents..."
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
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
              <option value="requires_clarification">Needs Clarification</option>
            </select>
            
            <select
              value={documentTypeFilter}
              onChange={(e) => setDocumentTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="photo">Passport Photo</option>
              <option value="bank">Bank Details</option>
              <option value="nres">NRES Certificate</option>
              <option value="experience">Experience</option>
              <option value="skill">Skill Certificate</option>
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
                {filteredDocuments.length} of {documents.length} documents
              </span>
            </div>
            
            <button
              onClick={exportDocuments}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No documents found matching your criteria.</p>
            </div>
          ) : (
            filteredDocuments.map((document) => (
              <div key={document.id} className="card-mobile">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{document.workerName}</h3>
                      <p className="text-sm text-gray-600">{document.workerId}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                          {document.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(document.priority)}`}>
                          {document.priority.toUpperCase()} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Uploaded: {document.uploadDate.toLocaleDateString()}
                    </p>
                    {document.verificationDate && (
                      <p className="text-sm text-gray-600">
                        Verified: {document.verificationDate.toLocaleDateString()}
                      </p>
                    )}
                    {document.verifiedBy && (
                      <p className="text-xs text-gray-500">
                        By: {document.verifiedBy}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Document Details</h4>
                    <p className="text-sm text-gray-600">Type: {getDocumentTypeLabel(document.documentType)}</p>
                    <p className="text-sm text-gray-600">File: {document.fileName}</p>
                    <p className="text-sm text-gray-600">Size: {document.fileSize}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    {document.rejectionReason && (
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-red-700 mb-1">Rejection Reason:</h4>
                        <p className="text-sm text-red-600">{document.rejectionReason}</p>
                      </div>
                    )}
                    {document.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-orange-700 mb-1">Notes:</h4>
                        <p className="text-sm text-orange-600">{document.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4 mr-2" />
                    View Document
                  </button>
                  
                  {document.status === 'pending' || document.status === 'requires_clarification' ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRequestClarification(document.id)}
                        className="flex items-center px-3 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Request Clarification
                      </button>
                      <button
                        onClick={() => handleReject(document.id)}
                        className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleVerify(document.id)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Verify
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Document {document.status.replace('_', ' ')}
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

export default DocumentVerification;