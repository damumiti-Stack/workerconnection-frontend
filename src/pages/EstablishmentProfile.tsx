import React, { useState } from 'react';
import { Building2, Edit, Save, X, Mail, Phone, MapPin, Calendar, Users, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';

const EstablishmentProfile: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    establishmentName: 'ABC Construction Ltd.',
    ownerName: 'Rajesh Kumar',
    emailAddress: 'contact@abcconstruction.com',
    mobileNumber: '9876543210',
    landlineNumber: '040-12345678',
    establishmentType: 'private_commercial',
    registrationNumber: 'REG123456789',
    gstNumber: '36ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    licenseNumber: 'LIC987654321',
    address: {
      doorNumber: '12-34',
      street: 'Construction Street',
      district: 'hyderabad',
      mandal: 'Secunderabad',
      village: 'Begumpet',
      pincode: '500016'
    },
    projectDetails: {
      projectName: 'Residential Complex Phase 1',
      estimatedCost: '50,00,00,000',
      commencementDate: '2024-01-15',
      completionDate: '2025-12-31',
      maleWorkers: '45',
      femaleWorkers: '15'
    }
  });

  const establishmentTypes = [
    { value: 'state_government', label: 'State Government' },
    { value: 'central_government', label: 'Central Government' },
    { value: 'private_residential', label: 'Private Residential' },
    { value: 'private_commercial', label: 'Private Commercial' }
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
        <Icon className="h-5 w-5 text-orange-600" />
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
              options={establishmentTypes}
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

  const AddressRow = ({ label, value, field }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 text-sm font-medium">{label}:</span>
      {isEditing ? (
        <div className="w-48">
          <FormInput
            label=""
            value={value}
            onChange={(newValue) => setFormData({
              ...formData,
              address: { ...formData.address, [field]: newValue }
            })}
            className="text-sm"
          />
        </div>
      ) : (
        <span className="text-gray-900 font-medium text-sm">{value || 'Not provided'}</span>
      )}
    </div>
  );

  const ProjectRow = ({ label, value, field, type = 'text' }: any) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 text-sm font-medium">{label}:</span>
      {isEditing ? (
        <div className="w-48">
          <FormInput
            label=""
            type={type}
            value={value}
            onChange={(newValue) => setFormData({
              ...formData,
              projectDetails: { ...formData.projectDetails, [field]: newValue }
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
            <Building2 className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t('establishment.profile')}
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
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                {t('common.edit')}
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <InfoCard icon={Building2} title={t('establishment.establishmentDetails')}>
            <div className="space-y-1">
              <InfoRow
                label={t('establishment.establishmentName')}
                value={formData.establishmentName}
                field="establishmentName"
              />
              <InfoRow
                label={t('establishment.ownerName')}
                value={formData.ownerName}
                field="ownerName"
              />
              <InfoRow
                label={t('establishment.establishmentType')}
                value={formData.establishmentType}
                field="establishmentType"
                type="select"
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
                label={t('establishment.landlineNumber')}
                value={formData.landlineNumber}
                field="landlineNumber"
                type="tel"
              />
            </div>
          </InfoCard>

          {/* Registration Details */}
          <InfoCard icon={FileText} title="Registration Details">
            <div className="space-y-1">
              <InfoRow
                label={t('establishment.registrationNumber')}
                value={formData.registrationNumber}
                field="registrationNumber"
              />
              <InfoRow
                label={t('establishment.gstNumber')}
                value={formData.gstNumber}
                field="gstNumber"
              />
              <InfoRow
                label={t('establishment.panNumber')}
                value={formData.panNumber}
                field="panNumber"
              />
              <InfoRow
                label={t('establishment.licenseNumber')}
                value={formData.licenseNumber}
                field="licenseNumber"
              />
            </div>
          </InfoCard>

          {/* Address Information */}
          <InfoCard icon={MapPin} title={t('worker.addressDetails')}>
            <div className="space-y-1">
              <AddressRow
                label={t('worker.doorNumber')}
                value={formData.address.doorNumber}
                field="doorNumber"
              />
              <AddressRow
                label={t('worker.street')}
                value={formData.address.street}
                field="street"
              />
              <AddressRow
                label={t('worker.district')}
                value={formData.address.district}
                field="district"
              />
              <AddressRow
                label={t('worker.mandal')}
                value={formData.address.mandal}
                field="mandal"
              />
              <AddressRow
                label={t('worker.village')}
                value={formData.address.village}
                field="village"
              />
              <AddressRow
                label={t('worker.pincode')}
                value={formData.address.pincode}
                field="pincode"
              />
            </div>
          </InfoCard>

          {/* Project Details */}
          <InfoCard icon={Calendar} title={t('establishment.projectDetails')}>
            <div className="space-y-1">
              <ProjectRow
                label={t('establishment.projectName')}
                value={formData.projectDetails.projectName}
                field="projectName"
              />
              <ProjectRow
                label={t('establishment.estimatedCost')}
                value={formData.projectDetails.estimatedCost}
                field="estimatedCost"
              />
              <ProjectRow
                label={t('establishment.commencementDate')}
                value={formData.projectDetails.commencementDate}
                field="commencementDate"
                type="date"
              />
              <ProjectRow
                label={t('establishment.completionDate')}
                value={formData.projectDetails.completionDate}
                field="completionDate"
                type="date"
              />
            </div>
          </InfoCard>

          {/* Worker Statistics */}
          <InfoCard icon={Users} title="Worker Statistics">
            <div className="space-y-1">
              <ProjectRow
                label={t('establishment.maleWorkers')}
                value={formData.projectDetails.maleWorkers}
                field="maleWorkers"
                type="number"
              />
              <ProjectRow
                label={t('establishment.femaleWorkers')}
                value={formData.projectDetails.femaleWorkers}
                field="femaleWorkers"
                type="number"
              />
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 text-sm font-medium">Total Workers:</span>
                <span className="text-gray-900 font-medium text-sm">
                  {parseInt(formData.projectDetails.maleWorkers || '0') + 
                   parseInt(formData.projectDetails.femaleWorkers || '0')}
                </span>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <button className="card-mobile text-center hover:shadow-lg transition-shadow">
            <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Worker Management</h3>
            <p className="text-sm text-gray-600">Manage registered workers</p>
          </button>
          
          <button className="card-mobile text-center hover:shadow-lg transition-shadow">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Documents</h3>
            <p className="text-sm text-gray-600">View and update documents</p>
          </button>
          
          <button className="card-mobile text-center hover:shadow-lg transition-shadow">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 mb-1">Reports</h3>
            <p className="text-sm text-gray-600">Generate compliance reports</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstablishmentProfile;