import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Eye, UserCheck, FileText, Mail, Building, Database, Server, Users } from "lucide-react";

const PrivacyPolicy = () => {
  const lastUpdated = "January 15, 2024";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className=" px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Privacy Policy
          </h1>
          <div className="inline-flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Last Updated: {lastUpdated}</span>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            This Privacy Policy describes how Mapvon collects, uses, and protects your information when you use our hospital management platform.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Quick Navigation */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 border-b border-red-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-red-600" />
              Quick Navigation
            </h2>
            <div className="flex flex-wrap gap-2">
              {["Introduction", "Data Collection", "Data Usage", "Security", "Your Rights", "Contact"].map((item, index) => (
                <a
                  key={index}
                  href={`#section-${index + 1}`}
                  className="px-3 py-1.5 bg-white text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 border border-red-200 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Policy Content */}
          <div className="p-6 md:p-8 space-y-10">
            
            {/* Introduction */}
            <section id="section-1" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
                  <p className="text-sm text-gray-500 mt-1">Our commitment to protecting your data</p>
                </div>
              </div>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  At <span className="font-semibold text-red-700">Mapvon</span>, we understand that healthcare data is sensitive and requires the highest level of protection. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of information when you use our hospital management platform. By using our services, you agree to the terms outlined in this policy.
                </p>
              </div>
            </section>

            {/* Information We Collect */}
            <section id="section-2" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
                  <p className="text-sm text-gray-500 mt-1">Types of data collected</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                    Hospital Information
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2"></div>
                      Hospital name and registration details
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2"></div>
                      Doctor and staff contact information
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2"></div>
                      Hospital address and location data
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2"></div>
                      Registration certificates and documents
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Server className="w-4 h-4 mr-2 text-blue-600" />
                    System Data
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></div>
                      Usage logs and access patterns
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></div>
                      Device and browser information
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></div>
                      IP addresses and connection data
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></div>
                      Error reports and performance metrics
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section id="section-3" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">3. How We Use Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Purpose of data processing</p>
                </div>
              </div>

              <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Service Provision</h3>
                    <p className="text-gray-700">
                      To provide and maintain our hospital management platform, including account management, billing, and customer support.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Platform Improvement</h3>
                    <p className="text-gray-700">
                      To analyze usage patterns and improve our services, features, and user experience through anonymized data analysis.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Security & Compliance</h3>
                    <p className="text-gray-700">
                      To monitor and protect against security threats, fraud, and to comply with healthcare regulations and legal obligations.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                    <p className="text-gray-700">
                      To send important updates, service announcements, and respond to inquiries about our platform.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section id="section-4" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">4. Data Security</h2>
                  <p className="text-sm text-gray-500 mt-1">Protecting your information</p>
                </div>
              </div>

              <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Encryption</h3>
                    <p className="text-gray-700 text-sm">
                      All data transmitted between your hospital and our servers is encrypted using TLS 1.2+ protocols. At-rest data is encrypted with AES-256 encryption.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Access Controls</h3>
                    <p className="text-gray-700 text-sm">
                      Strict role-based access controls ensure that only authorized personnel can access sensitive hospital data. Multi-factor authentication is required for administrative access.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-red-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Regular Audits</h3>
                    <p className="text-gray-700 text-sm">
                      We conduct regular security audits, vulnerability assessments, and penetration testing to maintain the highest security standards.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section id="section-5" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">5. Your Rights</h2>
                  <p className="text-sm text-gray-500 mt-1">Control over your data</p>
                </div>
              </div>

              <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Access", desc: "Request access to the personal data we hold about your hospital" },
                    { title: "Correction", desc: "Request corrections to inaccurate or incomplete information" },
                    { title: "Deletion", desc: "Request deletion of data when no longer needed for its purpose" },
                    { title: "Portability", desc: "Receive your data in a structured, commonly used format" },
                    { title: "Objection", desc: "Object to certain types of data processing" },
                    { title: "Restriction", desc: "Request restriction of processing in specific circumstances" },
                  ].map((right, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-indigo-100">
                      <h3 className="font-semibold text-gray-900 mb-2">{right.title}</h3>
                      <p className="text-gray-700 text-sm">{right.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section id="section-6" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">6. Contact Us</h2>
                  <p className="text-sm text-gray-500 mt-1">Get in touch with our privacy team</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200">
                <div className="max-w-md mx-auto text-center">
                  <div className="mb-4">
                    <Mail className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Team</h3>
                    <p className="text-gray-700">
                      For privacy-related inquiries, data subject requests, or concerns about our privacy practices:
                    </p>
                  </div>
                  <div className="space-y-3">
                    <a 
                      href="mailto:privacy@mapvon.com" 
                      className="block text-lg font-medium text-amber-700 hover:text-amber-800"
                    >
                      privacy@mapvon.com
                    </a>
                    <p className="text-gray-600 text-sm">
                      We aim to respond to all privacy inquiries within 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  This Privacy Policy is effective as of {lastUpdated}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Mapvon reserves the right to modify this policy at any time.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link 
                  to="/terms" 
                  className="text-sm text-red-700 hover:text-red-800 font-medium"
                >
                  Terms of Service
                </Link>
                <Link 
                  to="/" 
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm">
            <Shield className="w-4 h-4" />
            <span>HIPAA Compliant • GDPR Ready • ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;