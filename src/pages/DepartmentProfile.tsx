import React, { useState } from 'react';
import { Shield, Edit, Save, X, User, Mail, Phone, MapPin, Building2, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';

const DepartmentProfile: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    officerName: 'Sri K. Venkateswara Rao',
    designation: 'Assistant Commissioner of Labour',
    employeeId: 'ACL001234',
    department: 'Labour, Employment, Training & Factories Department',
    division: 'Building and Other Construction Workers Division',
    emailAddress: 'acl.guntur@labour.ap.gov.in',
    mobileNumber: '9876543210',
    officeNumber: '0863-2234567',
    joiningDate: '2018-07-15',
    experience: '18',
    qualification: 'M.A. Labour Studies, LL.B',
    office: {
      name: 'District Labour Office, Guntur',
      address: 'Labour Bhavan, Collectorate Complex, Guntur',
      district: 'guntur',
      pincode: '522001'
    },
    jurisdiction: {
      districts: ['guntur', 'prakasam', 'bapatla'],
      establishments: '2,850',
      workers: '78,500'
    }
  });

  const designations = [
    { value: 'acl', label: 'Assistant Commissioner of Labour' },
    { value: 'dcl', label: 'Deputy Commissioner of Labour' },
    { value: 'addl_commissioner', label: 'Additional Commissioner of Labour' },
    { value: 'commissioner', label: 'Commissioner of Labour' },
    { value: 'inspector', label: 'Labour Inspector' },
    { value: 'officer', label: 'Labour Officer' },
    { value: 'enforcement_officer', label: 'Labour Enforcement Officer' }
  ];

  const handleSave = () => {
    // In real app, save to API
    console.log('Saving profile:', formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const InfoCard = ({ icon: Icon, title, children }: any) => (
    <div className="card-mobile">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, field, type = 'text' }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 text-sm font-medium">{label}:</span>
      {isEditing ? (
        <div className="w-48">
          {type === 'select' ? (
            <FormSelect
              label=""
              value={value}
              onChange={(newValue) => setFormData({ ...formData, [field]: newValue })}
              options={designations}
              className="text-sm"
            />
          ) : (
            <FormInput
              label=""
              type={type}
              value={value}
              onChange={(newValue) => setFormData({ ...formData, [field]: newValue })}
              className="text-sm"
            />
          )}
        </div>
      ) : (
        <span className="text-gray-900 font-medium text-sm">{value || 'Not provided'}</span>
      )}
    </div>
  );

  const OfficeRow = ({ label, value, field }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 text-sm font-medium">{label}:</span>
      {isEditing ? (
        <div className="w-48">
          <FormInput
            label=""
            value={value}
            onChange={(newValue) => setFormData({
              ...formData,
              office: { ...formData.office, [field]: newValue }
            })}
            className="text-sm"
          />
        </div>
      ) : (
        <span className="text-gray-900 font-medium text-sm">{value || 'Not provided'}</span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t('department.profile')}
              </h1>
              <p className="text-gray-600">
                {t('common.welcome')}, {user?.name}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t('common.save')}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('common.cancel')}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('common.edit')}
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <InfoCard icon={User} title="Personal Information">
            <div className="space-y-1">
              <InfoRow
                label="Officer Name"
                value={formData.officerName}
                field="officerName"
              />
              <InfoRow
                label="Employee ID"
                value={formData.employeeId}
                field="employeeId"
              />
              <InfoRow
                label="Qualification"
                value={formData.qualification}
                field="qualification"
              />
              <InfoRow
                label="Experience (Years)"
                value={formData.experience}
                field="experience"
                type="number"
              />
            </div>
          </InfoCard>

          {/* Contact Information */}
          <InfoCard icon={Phone} title={t('worker.contactDetails')}>
            <div className="space-y-1">
              <InfoRow
                label={t('establishment.emailAddress')}
                value={formData.emailAddress}
                field="emailAddress"
                type="email"
              />
              <InfoRow
                label={t('establishment.mobileNumber')}
                value={formData.mobileNumber}
                field="mobileNumber"
                type="tel"
              />
              <InfoRow
                label="Office Number"
                value={formData.officeNumber}
                field="officeNumber"
                type="tel"
              />
            </div>
          </InfoCard>

          {/* Official Details */}
          <InfoCard icon={Shield} title="Official Details">
            <div className="space-y-1">
              <InfoRow
                label="Designation"
                value={formData.designation}
                field="designation"
                type="select"
              />
              <InfoRow
                label="Department"
                value={formData.department}
                field="department"
              />
              <InfoRow
                label="Division"
                value={formData.division}
                field="division"
              />
              <InfoRow
                label="Joining Date"
                value={formData.joiningDate}
                field="joiningDate"
                type="date"
              />
            </div>
          </InfoCard>

          {/* Office Information */}
          <InfoCard icon={Building2} title="Office Information">
            <div className="space-y-1">
              <OfficeRow
                label="Office Name"
                value={formData.office.name}
                field="name"
              />
              <OfficeRow
                label="Address"
                value={formData.office.address}
                field="address"
              />
              <OfficeRow
                label={t('worker.district')}
                value={formData.office.district}
                field="district"
              />
              <OfficeRow
                label={t('worker.pincode')}
                value={formData.office.pincode}
                field="pincode"
              />
            </div>
          </InfoCard>

          {/* Jurisdiction */}
          <InfoCard icon={MapPin} title="Jurisdiction">
            <div className="space-y-1">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm font-medium">Districts:</span>
                <span className="text-gray-900 font-medium text-sm">
                  Guntur, Prakasam, Bapatla
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm font-medium">Establishments:</span>
                <span className="text-gray-900 font-medium text-sm">
                  {formData.jurisdiction.establishments}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 text-sm font-medium">Registered Workers:</span>
                <span className="text-gray-900 font-medium text-sm">
                  {formData.jurisdiction.workers}
                </span>
              </div>
            </div>
          </InfoCard>

          {/* Performance Metrics */}
          <InfoCard icon={Calendar} title="Performance Metrics">
            <div className="space-y-1">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm font-medium">Applications Processed:</span>
                <span className="text-gray-900 font-medium text-sm">2,847</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm font-medium">Inspections Conducted:</span>
                <span className="text-gray-900 font-medium text-sm">156</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm font-medium">Compliance Rate:</span>
                <span className="text-green-600 font-medium text-sm">96.2%</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 text-sm font-medium">Average Response Time:</span>
                <span className="text-gray-900 font-medium text-sm">1.8 days</span>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <button className="card-mobile text-center hover:shadow-lg transition-shadow">
            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Dashboard</h3>
            <p className="text-sm text-gray-600">View statistics</p>
          </button>
          
          <button className="card-mobile text-center hover:shadow-lg transition-shadow">
            <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Establishments</h3>
            <p className="text-sm text-gray-600">Manage establishments</p>
          </button>
          
          <button className="card-mobile text-center hover:shadow-lg transition-shadow">
            <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Workers</h3>
            <p className="text-sm text-gray-600">Worker management</p>
          </button>
          
          <button className="card-mobile text-center hover:shadow-lg transition-shadow">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Reports</h3>
            <p className="text-sm text-gray-600">Generate reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentProfile;