import React, { useState } from 'react';
import { HelpCircle, Search, Book, MessageCircle, Phone, Mail, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Help: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'registration', label: 'Registration' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'documents', label: 'Documents' },
    { id: 'profile', label: 'Profile Management' },
    { id: 'technical', label: 'Technical Issues' }
  ];

  const faqs = [
    {
      id: '1',
      category: 'registration',
      question: 'How do I register as a construction worker?',
      answer: 'To register as a construction worker, click on "Register as Worker" on the homepage, fill out the multi-step registration form with your personal details, workplace information, address, bank details, and upload required documents. After submission, your application will be reviewed by the department.'
    },
    {
      id: '2',
      category: 'registration',
      question: 'What documents are required for worker registration?',
      answer: 'Required documents include: Passport size photo, Aadhar card, Bank passbook or cancelled cheque, and NRES document (if applicable). All documents should be clear, readable, and in PDF or JPG format with maximum size of 5MB each.'
    },
    {
      id: '3',
      category: 'attendance',
      question: 'How does the location-based attendance system work?',
      answer: 'The attendance system uses your device\'s GPS to verify you are at the designated work location before allowing check-in. You must be within the specified radius (usually 100 meters) of the work site to successfully check in or out.'
    },
    {
      id: '4',
      category: 'attendance',
      question: 'What if I can\'t check in due to location issues?',
      answer: 'If you\'re having location issues, ensure GPS is enabled on your device, you have a stable internet connection, and you\'re within the allowed radius of your work site. If problems persist, contact your supervisor or the help desk.'
    },
    {
      id: '5',
      category: 'documents',
      question: 'How long does document verification take?',
      answer: 'Document verification typically takes 3-5 business days. You will receive notifications about the status of your documents. If any document is rejected, you\'ll be notified with the reason and can resubmit corrected documents.'
    },
    {
      id: '6',
      category: 'profile',
      question: 'How can I update my profile information?',
      answer: 'Go to your profile page and click the "Edit Profile" button. You can update most information except critical details like Aadhar number. Some changes may require document verification.'
    },
    {
      id: '7',
      category: 'technical',
      question: 'The app is not working properly on my phone. What should I do?',
      answer: 'Try clearing your browser cache, ensure you have a stable internet connection, and update your browser to the latest version. If issues persist, try accessing the app from a different device or contact technical support.'
    },
    {
      id: '8',
      category: 'registration',
      question: 'Can I register multiple workers under one account?',
      answer: 'No, each worker must have their own individual account with unique mobile number and Aadhar card. This ensures proper tracking and compliance with regulations.'
    }
  ];

  const guides = [
    {
      title: 'Worker Registration Guide',
      description: 'Step-by-step guide to register as a construction worker',
      steps: 8,
      duration: '10 minutes'
    },
    {
      title: 'Establishment Registration Guide',
      description: 'Complete guide for establishment registration process',
      steps: 6,
      duration: '15 minutes'
    },
    {
      title: 'Using the Attendance System',
      description: 'How to use location-based check-in and check-out',
      steps: 4,
      duration: '5 minutes'
    },
    {
      title: 'Document Upload Guidelines',
      description: 'Best practices for uploading and managing documents',
      steps: 5,
      duration: '7 minutes'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions, browse our guides, or contact our support team
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="card-mobile mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center px-4 py-3 text-left bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Start Live Chat
                </button>
                <button className="w-full flex items-center px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Phone className="h-5 w-5 mr-3" />
                  Call Support
                </button>
                <button className="w-full flex items-center px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="h-5 w-5 mr-3" />
                  Email Support
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="card-mobile">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Guides */}
            <div className="card-mobile">
              <div className="flex items-center mb-6">
                <Book className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">User Guides</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {guides.map((guide, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{guide.steps} steps</span>
                      <span>{guide.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="card-mobile">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No FAQs found matching your search.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === faq.id ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Support */}
            <div className="card-mobile bg-blue-50 border-blue-200">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Still need help?
              </h2>
              <p className="text-blue-800 mb-6">
                Can't find what you're looking for? Our support team is here to help you.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-900 mb-1">Phone Support</h3>
                  <p className="text-sm text-blue-700">1800-123-4567</p>
                  <p className="text-xs text-blue-600">Mon-Fri, 9 AM - 6 PM</p>
                </div>
                <div className="text-center">
                  <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-900 mb-1">Email Support</h3>
                  <p className="text-sm text-blue-700">support@workerconnect.gov.in</p>
                  <p className="text-xs text-blue-600">Response within 24 hours</p>
                </div>
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-900 mb-1">Live Chat</h3>
                  <p className="text-sm text-blue-700">Available now</p>
                  <p className="text-xs text-blue-600">Average response: 2 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;