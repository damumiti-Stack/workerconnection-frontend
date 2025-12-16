import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Globe, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      details: '1800-123-4567',
      description: 'Mon-Fri, 9:00 AM - 6:00 PM',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Mail,
      title: 'Email Support',
      details: 'support@workerconnect.gov.in',
      description: 'Response within 24 hours',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      details: 'Available Now',
      description: 'Average response: 2 minutes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: MapPin,
      title: 'Office Address',
      details: 'Labour Bhavan, Secretariat Road',
      description: 'Hyderabad, Telangana - 500022',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const offices = [
    {
      city: 'Hyderabad',
      address: 'Labour Bhavan, Secretariat Road, Hyderabad - 500022',
      phone: '040-2345-6789',
      email: 'hyderabad@workerconnect.gov.in'
    },
    {
      city: 'Visakhapatnam',
      address: 'District Labour Office, Administrative Building, Visakhapatnam - 530001',
      phone: '0891-234-5678',
      email: 'visakhapatnam@workerconnect.gov.in'
    },
    {
      city: 'Guntur',
      address: 'Labour Department, Collectorate Complex, Guntur - 522001',
      phone: '0863-234-5678',
      email: 'guntur@workerconnect.gov.in'
    },
    {
      city: 'Tirupati',
      address: 'District Labour Office, Government Complex, Tirupati - 517501',
      phone: '0877-234-5678',
      email: 'tirupati@workerconnect.gov.in'
    }
  ];

  const categories = [
    { value: 'technical', label: 'Technical Support' },
    { value: 'registration', label: 'Registration Issues' },
    { value: 'documents', label: 'Document Verification' },
    { value: 'attendance', label: 'Attendance Problems' },
    { value: 'benefits', label: 'Benefits & Schemes' },
    { value: 'general', label: 'General Inquiry' }
  ];

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div key={index} className="card-mobile text-center hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`h-6 w-6 ${method.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="font-medium text-gray-900 mb-1">{method.details}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="card-mobile">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Please provide detailed information about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Office Locations */}
          <div>
            <div className="card-mobile mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Office Locations</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <Building2 className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{office.city}</h3>
                        <p className="text-gray-600 text-sm mb-2">{office.address}</p>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {office.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            {office.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="card-mobile">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium text-gray-900">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Public Holidays</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-red-900 mb-4">Emergency Contact</h2>
          <p className="text-red-800 mb-4">
            For urgent matters related to worker safety or emergency situations at construction sites:
          </p>
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-red-600 mr-2" />
              <span className="font-bold text-red-900">Emergency Helpline: 1800-HELP-NOW</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800">24/7 Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;