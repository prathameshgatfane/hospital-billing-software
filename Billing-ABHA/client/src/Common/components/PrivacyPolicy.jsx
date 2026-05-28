import React from 'react';
import { Shield, Lock, Database, UserCheck, Eye } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Privacy & Security
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-3 text-red-600" />
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                Mapvon Technologies Pvt Ltd ("Mapvon", "we", "us", or "our") operates the Mapvon Hospital Billing Software. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our software.
              </p>
              <p className="text-gray-700">
                We are committed to protecting the privacy and confidentiality of all patient data and hospital information in compliance with applicable laws and regulations, including the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-3 text-red-600" />
                2. Information We Collect
              </h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Patient Information</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Patient demographics (name, age, gender, contact details)</li>
                  <li>Medical records and treatment history</li>
                  <li>Insurance and billing information</li>
                  <li>Diagnosis and treatment codes (ICD-10, CPT)</li>
                  <li>Payment details and transaction history</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Hospital Information</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Hospital registration details and credentials</li>
                  <li>Staff information and access credentials</li>
                  <li>Billing and inventory management data</li>
                  <li>Operational and financial reports</li>
                  <li>System usage logs and analytics</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Technical Information</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>IP addresses and device information</li>
                  <li>Browser type and version</li>
                  <li>Operating system details</li>
                  <li>Usage patterns and system logs</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the collected information for the following purposes:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Billing Processing</h4>
                  <p className="text-gray-700 text-sm">Generate accurate bills, process insurance claims, and manage payments</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Patient Care</h4>
                  <p className="text-gray-700 text-sm">Maintain medical records and facilitate treatment continuity</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Compliance</h4>
                  <p className="text-gray-700 text-sm">Meet regulatory requirements and audit obligations</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">System Improvement</h4>
                  <p className="text-gray-700 text-sm">Enhance software functionality and user experience</p>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security Measures</h2>
              <div className="bg-gray-900 text-white p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Enterprise-grade Security Implementation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <h4 className="font-semibold">End-to-End Encryption</h4>
                    <p className="text-gray-300 text-sm">AES-256 encryption for all data at rest and in transit</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🛡️</div>
                    <h4 className="font-semibold">Access Controls</h4>
                    <p className="text-gray-300 text-sm">Role-based access control with multi-factor authentication</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <h4 className="font-semibold">Audit Logs</h4>
                    <p className="text-gray-300 text-sm">Comprehensive audit trails for all data access and modifications</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-900 border-b">Data Type</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-900 border-b">Retention Period</th>
                      <th className="py-3 px-4 text-left font-semibold text-gray-900 border-b">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">Patient Medical Records</td>
                      <td className="py-3 px-4 border-b">10 years after last visit</td>
                      <td className="py-3 px-4 border-b">Medical and legal requirements</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">Billing Transactions</td>
                      <td className="py-3 px-4 border-b">7 years</td>
                      <td className="py-3 px-4 border-b">Financial audit requirements</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b">System Logs</td>
                      <td className="py-3 px-4 border-b">2 years</td>
                      <td className="py-3 px-4 border-b">Security monitoring</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* User Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-3 text-red-600" />
                6. Your Rights
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-lg mr-4">
                    <Eye className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Right to Access</h4>
                    <p className="text-gray-700">Request access to your personal information stored in our system.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-lg mr-4">
                    <span className="text-red-600 font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Right to Correction</h4>
                    <p className="text-gray-700">Request correction of inaccurate or incomplete personal data.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-lg mr-4">
                    <span className="text-red-600 font-bold">🗑️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Right to Deletion</h4>
                    <p className="text-gray-700">Request deletion of personal data, subject to legal requirements.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-red-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                For any privacy-related questions, concerns, or to exercise your rights, please contact our Data Protection Officer:
              </p>
              <div className="space-y-2">
                <p className="text-gray-900">
                  <strong>Email:</strong> privacy@mapvon.com
                </p>
                <p className="text-gray-900">
                  <strong>Phone:</strong> 9021199661
                </p>
                <p className="text-gray-900">
                  <strong>Address:</strong> Tech Park, Amravati, Maharashtra 444601, India
                </p>
              </div>
            </section>

            {/* Policy Updates */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> We may update this Privacy Policy periodically. We will notify users of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;