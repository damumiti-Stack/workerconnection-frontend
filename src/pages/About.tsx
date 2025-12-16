import React from 'react';
import { Users, Target, Award, Shield, Globe, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: 'Worker Empowerment',
      description: 'Providing construction workers with digital identity, benefits access, and career development opportunities.'
    },
    {
      icon: Shield,
      title: 'Compliance & Safety',
      description: 'Ensuring workplace safety standards and regulatory compliance across all construction sites.'
    },
    {
      icon: Globe,
      title: 'Digital Transformation',
      description: 'Modernizing the construction industry through technology and digital solutions.'
    },
    {
      icon: Heart,
      title: 'Social Welfare',
      description: 'Connecting workers to government schemes, healthcare, and social security benefits.'
    }
  ];

  const stats = [
    { number: '15,000+', label: 'Registered Workers' },
    { number: '1,200+', label: 'Establishments' },
    { number: '26', label: 'Districts Covered' },
    { number: '95%', label: 'User Satisfaction' }
  ];

  const team = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Commissioner of Labour',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Priya Sharma',
      role: 'Deputy Commissioner',
      image: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Suresh Reddy',
      role: 'Technical Director',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Anjali Singh',
      role: 'Operations Manager',
      image: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen py-8 mobile-nav-spacing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About WorkerConnect
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            WorkerConnect is a comprehensive digital platform designed to revolutionize the construction industry 
            by connecting workers, establishments, and government departments through technology. Our mission is to 
            ensure transparency, compliance, and welfare for all stakeholders in the construction ecosystem.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="card-mobile">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To create a transparent, efficient, and inclusive digital ecosystem that empowers construction 
              workers, streamlines establishment operations, and enables effective government oversight while 
              ensuring compliance with labor laws and safety standards.
            </p>
          </div>
          
          <div className="card-mobile">
            <div className="flex items-center mb-4">
              <Award className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To be the leading digital platform that transforms the construction industry by providing 
              seamless access to opportunities, benefits, and services while maintaining the highest 
              standards of safety, compliance, and worker welfare.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card-mobile text-center hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 mb-16 text-white">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Our Leadership Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="card-mobile text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-gray-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="card-mobile mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology & Innovation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Modern Web Technologies</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• React & TypeScript</li>
                <li>• Progressive Web App (PWA)</li>
                <li>• Responsive Design</li>
                <li>• Real-time Updates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Security & Compliance</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• End-to-end Encryption</li>
                <li>• Secure Authentication</li>
                <li>• Data Privacy Protection</li>
                <li>• Government Standards</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Mobile Features</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• GPS-based Attendance</li>
                <li>• Offline Capability</li>
                <li>• Push Notifications</li>
                <li>• Multi-language Support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Government Partnership */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 md:p-12 text-center">
          <Shield className="h-16 w-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-green-900 mb-4">
            Government of Andhra Pradesh Initiative
          </h2>
          <p className="text-green-800 max-w-3xl mx-auto leading-relaxed">
            WorkerConnect is an official initiative by the Labour Department, Government of Andhra Pradesh, 
            designed to digitize and modernize the construction worker registration and management process. 
            This platform ensures compliance with the Building and Other Construction Workers Act and 
            provides seamless access to government schemes and benefits.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;