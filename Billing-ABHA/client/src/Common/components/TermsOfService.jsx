import React from "react";
import { Link } from "react-router-dom";
import { FileText, Scale, Shield, AlertCircle, CheckCircle, BookOpen, UserCheck, Clock, Mail } from "lucide-react";

const TermsOfService = () => {
  const effectiveDate = "May 21, 2026";
  
  const importantPoints = [
    "By using Mapvon, you agree to these Terms of Service",
    "You retain ownership of your hospital and patient data",
    "We process data in compliance with ABDM, DPDP, and healthcare regulations",
    "Account security and patient consent management is your responsibility"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className=" px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Terms of Service
          </h1>
          <div className="inline-flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Effective: {effectiveDate}</span>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            These Terms of Service govern your use of Mapvon's hospital management platform. Please read them carefully.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Important Points to Note</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {importantPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Quick Navigation */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
              Table of Contents
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Acceptance", "Services", "Account", "Data", "Prohibited", 
                "Termination", "Liability", "ABDM Compliance", "Contact"
              ].map((item, index) => (
                <a
                  key={index}
                  href={`#section-${index + 1}`}
                  className="px-3 py-1.5 bg-white text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 border border-blue-200 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Terms Content */}
          <div className="p-6 md:p-8 space-y-10">
            
            {/* Acceptance of Terms */}
            <section id="section-1" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                  <p className="text-sm text-gray-500 mt-1">Your agreement to these terms</p>
                </div>
              </div>
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <p className="text-gray-700 leading-relaxed mb-4">
                  By accessing or using <span className="font-semibold text-blue-700">Mapvon's</span> hospital billing and financial management platform ("Services"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
                <div className="bg-white p-4 rounded-lg border border-blue-100">
                  <p className="text-gray-700 text-sm">
                    If you are using our Services on behalf of a hospital or healthcare organization, you represent that you have the authority to bind that entity to these Terms. If you do not agree to these Terms, you may not access or use the Services.
                  </p>
                </div>
              </div>
            </section>

            {/* Description of Services */}
            <section id="section-2" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">2. Description of Services</h2>
                  <p className="text-sm text-gray-500 mt-1">What we provide</p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Core Platform Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-purple-100">
                        <p className="text-gray-700 text-sm">Hospital billing and invoicing</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-purple-100">
                        <p className="text-gray-700 text-sm">Financial reporting and analytics</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-purple-100">
                        <p className="text-gray-700 text-sm">Patient data management & ABHA Integration</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-purple-100">
                        <p className="text-gray-700 text-sm">ABDM Compliance tracking</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Service Evolution</h3>
                    <p className="text-gray-700 text-sm">
                      We continuously improve our Services to enhance usability, security, and compliance. Features may be added, modified, or removed as part of our ongoing development. We will provide reasonable notice for significant changes that affect your use of the platform.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Account Registration */}
            <section id="section-3" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">3. Account Registration & Security</h2>
                  <p className="text-sm text-gray-500 mt-1">Your responsibilities</p>
                </div>
              </div>

              <div className="bg-green-50 p-5 rounded-lg border border-green-200">
                <div className="space-y-4">
                  {[
                    {
                      title: "Accurate Information",
                      content: "You must provide accurate, current, and complete information during registration and keep it updated."
                    },
                    {
                      title: "Account Security",
                      content: "You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account."
                    },
                    {
                      title: "Unauthorized Access",
                      content: "You must immediately notify Mapvon of any unauthorized use of your account or any other security breach."
                    },
                    {
                      title: "Single Organization",
                      content: "Each account is intended for use by a single hospital or healthcare organization. Sharing accounts between organizations is prohibited."
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-green-100">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-700 text-sm">{item.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Data & Compliance */}
            <section id="section-4" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">4. Data Ownership & Compliance</h2>
                  <p className="text-sm text-gray-500 mt-1">Your data, our responsibility</p>
                </div>
              </div>

              <div className="bg-red-50 p-5 rounded-lg border border-red-200">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Data Ownership</h3>
                    <div className="bg-white p-4 rounded-lg border border-red-100">
                      <p className="text-gray-700">
                        You retain all ownership rights to your hospital data, including patient information, billing records, and operational data. Mapvon acts as a data processor and only processes your data to provide the Services in accordance with these Terms and our Privacy Policy.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Healthcare Compliance</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-red-100">
                        <h4 className="font-medium text-gray-900 mb-2">ABDM & DPDP Compliance</h4>
                        <p className="text-gray-700 text-sm">
                          We implement administrative, physical, and technical safeguards to maintain ABDM and Digital Personal Data Protection (DPDP) Act, 2023 compliance for healthcare entities.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-red-100">
                        <h4 className="font-medium text-gray-900 mb-2">Data Security</h4>
                        <p className="text-gray-700 text-sm">
                          Industry-standard encryption (AES-256), access controls, and regular security audits protect your sensitive healthcare data.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Prohibited Use */}
            <section id="section-5" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">5. Prohibited Activities</h2>
                  <p className="text-sm text-gray-500 mt-1">What you cannot do</p>
                </div>
              </div>

              <div className="bg-amber-50 p-5 rounded-lg border border-amber-200">
                <div className="space-y-3">
                  {[
                    "Misusing the platform for illegal activities or unauthorized access",
                    "Attempting to reverse engineer, decompile, or disassemble any part of the Services",
                    "Using automated systems to access the Services in a manner that sends more request messages than a human could reasonably produce",
                    "Interfering with or disrupting the integrity or performance of the Services",
                    "Collecting or harvesting any information from the Services",
                    "Uploading viruses, worms, or any other malicious code",
                    "Violating any applicable laws, regulations, or third-party rights"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-amber-100">
                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Termination */}
            <section id="section-6" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">6. Termination</h2>
                  <p className="text-sm text-gray-500 mt-1">Ending the agreement</p>
                </div>
              </div>

              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">By Mapvon</h3>
                    <p className="text-gray-700 text-sm">
                      We may suspend or terminate your access to the Services immediately, without prior notice, if we believe you have violated these Terms, pose a security risk, or if required by law. In most cases, we will provide you with notice and an opportunity to remedy the violation.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">By You</h3>
                    <p className="text-gray-700 text-sm">
                      You may terminate your account at any time by contacting our support team. Upon termination, we will retain your data for a reasonable period as required by law or for legitimate business purposes, after which it will be securely deleted.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section id="section-7" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Scale className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">7. Limitation of Liability</h2>
                  <p className="text-sm text-gray-500 mt-1">Legal limitations</p>
                </div>
              </div>

              <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-200">
                <div className="bg-white p-5 rounded-lg border border-indigo-100">
                  <p className="text-gray-700 mb-4">
                    To the maximum extent permitted by law, Mapvon shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of the Services.
                  </p>
                  <div className="text-sm text-gray-600 bg-indigo-50 p-3 rounded border border-indigo-100">
                    <p className="font-medium mb-1">Important Note:</p>
                    <p>
                      This limitation applies even if Mapvon has been advised of the possibility of such damages. Some jurisdictions do not allow the exclusion or limitation of certain damages, so this limitation may not apply to you.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ABDM Integration Compliance */}
            <section id="section-8" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">8. ABDM Ecosystem Integration & Patient Consent</h2>
                  <p className="text-sm text-gray-500 mt-1">NHA & ABDM guidelines for healthcare entities</p>
                </div>
              </div>

              <div className="bg-emerald-50 p-5 rounded-lg border border-emerald-200">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-emerald-100">
                    <h3 className="font-semibold text-gray-900 mb-2">8.1 HIP & HIU Compliance</h3>
                    <p className="text-gray-700 text-sm">
                      Mapvon is integrated with the Ayushman Bharat Digital Mission (ABDM) as a Health Information Provider (HIP) and Health Information User (HIU). The hospital/clinic agrees to abide by all National Health Authority (NHA) policies and standards when interacting with the National Digital Health Ecosystem (NDHE).
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-emerald-100">
                    <h3 className="font-semibold text-gray-900 mb-2">8.2 Informed Patient Consent</h3>
                    <p className="text-gray-700 text-sm">
                      Hospitals/clinics using Mapvon are solely responsible for obtaining explicit, informed, and documented consent from patients before:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700 text-sm">
                      <li>Generating or linking an Ayushman Bharat Health Account (ABHA) ID.</li>
                      <li>Uploading or digitizing patient diagnostic records, lab reports, or discharge summaries to the ABDM gateway.</li>
                      <li>Accessing or pulling patient health records from other healthcare facilities through the ABDM gateway.</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-emerald-100">
                    <h3 className="font-semibold text-gray-900 mb-2">8.3 Consent Records and Audits</h3>
                    <p className="text-gray-700 text-sm">
                      The hospital/clinic must maintain audit logs of all patient consents. Mapvon reserves the right to review consent artifacts and system logs to verify compliance with National NHA guidelines and Indian laws, including the Digital Personal Data Protection Act, 2023.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-emerald-100">
                    <h3 className="font-semibold text-gray-900 mb-2">8.4 Consent Revocation</h3>
                    <p className="text-gray-700 text-sm">
                      Patients have the right to revoke consent for data sharing at any time. Upon revocation, the hospital must immediately stop sharing patient health data via the ABDM network, although local physical and electronic records may be retained as required by clinical establishment laws.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section id="section-9" className="scroll-mt-20">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">9. Contact Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Get in touch</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-6 rounded-lg border border-cyan-200">
                <div className="max-w-md mx-auto text-center">
                  <div className="mb-4">
                    <Mail className="w-12 h-12 text-cyan-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal & Support Team</h3>
                    <p className="text-gray-700">
                      For questions about these Terms or legal inquiries:
                    </p>
                  </div>
                  <div className="space-y-3">
                    <a 
                      href="mailto:legal@mapvon.com" 
                      className="block text-lg font-medium text-cyan-700 hover:text-cyan-800"
                    >
                      legal@mapvon.com
                    </a>
                    <a 
                      href="mailto:support@mapvon.com" 
                      className="block text-lg font-medium text-cyan-700 hover:text-cyan-800"
                    >
                      support@mapvon.com
                    </a>
                    <p className="text-gray-600 text-sm">
                      We typically respond to legal inquiries within 3-5 business days.
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
                  These Terms of Service are effective as of {effectiveDate}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  By using Mapvon, you acknowledge that you have read and agree to these Terms.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link 
                  to="/privacy" 
                  className="text-sm text-blue-700 hover:text-blue-800 font-medium"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/" 
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              ABDM Certified
            </span>
            <span>•</span>
            <span>DPDP Act Compliant</span>
            <span>•</span>
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;