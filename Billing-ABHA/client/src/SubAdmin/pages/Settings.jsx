import React, { useState } from 'react';
import { Users, Stethoscope, Receipt, Settings as SettingsIcon } from 'lucide-react';
import StaffManagement from '../components/Settings/StaffManagement';
import DoctorManagement from '../components/Settings/DoctorManagement';
import BillingSettings from '../components/Settings/BillingSettings';
import InvestigationSettings from '../components/Settings/InvestigationSettings';
import { Microscope } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('staff');

  const tabs = [
    { id: 'staff', label: 'Staff Logins', icon: Users, component: StaffManagement },
    { id: 'doctor', label: 'Doctor Logins', icon: Stethoscope, component: DoctorManagement },
    { id: 'billing', label: 'Billing Settings', icon: Receipt, component: BillingSettings },
    { id: 'investigation', label: 'Lab/Investigations', icon: Microscope, component: InvestigationSettings },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <SettingsIcon className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hospital Settings</h1>
            <p className="text-gray-500 font-medium">Configure your hospital's operational and clinical modules.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-gray-100/80 backdrop-blur-md rounded-2xl w-fit border border-gray-200 shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                  ? 'bg-white text-red-600 shadow-md ring-1 ring-black/5'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
                {tab.label}
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* key=activeTab forces a clean unmount+remount on every tab switch */}
        <div className="bg-white/40 backdrop-blur-sm rounded-3xl min-h-[600px] transition-all duration-500">
          {ActiveComponent && <ActiveComponent key={activeTab} />}
        </div>

      </div>
    </div>
  );
};


export default Settings;