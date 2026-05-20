import React, { useState, useEffect } from 'react';
import {
  Users, Search, Clock, CheckCircle, ArrowRight,
  User, Calendar, ClipboardList, RefreshCw,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../../Common/context/AuthContext';
import { opdConsultationApi } from '../../API/opdConsultationApi';
import ConsultationWindow from './ConsultationWindow';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('waiting'); // 'waiting' or 'completed'

  const doctorId = user?.doctorId;

  useEffect(() => {
    if (doctorId) {
      fetchQueue();
    }
  }, [doctorId]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await opdConsultationApi.getQueue(doctorId);
      if (res.success) {
        setQueue(res.data);
      }
    } catch (e) {
      console.error("Queue fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredQueue = queue.filter(item => {
    const matchesSearch =
      item.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === 'completed' ? item.isCompleted : !item.isCompleted;

    return matchesSearch && matchesFilter;
  });

  const handleExpire = async (e, billId) => {
    e.stopPropagation();
    if (window.confirm("Mark this patient's billing as expired? This will remove them from the waiting list.")) {
      try {
        const res = await opdConsultationApi.expireBill(billId);
        if (res.success) {
          fetchQueue();
        }
      } catch (e) {
        console.error("Expire error:", e);
        alert("Failed to expire session");
      }
    }
  };

  if (!doctorId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 mt-2">
            This dashboard is only available for accounts linked to a doctor profile.
            Please contact your administrator to link your account.
          </p>
        </div>
      </div>
    );
  }

  if (selectedVisit) {
    return (
      <ConsultationWindow
        visit={selectedVisit}
        onClose={() => {
          setSelectedVisit(null);
          fetchQueue(); // Refresh queue after consultation
        }}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <style>{`
        .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border: 1px solid rgba(229, 231, 235, 0.5); }
        .queue-item { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .queue-item:hover { transform: translateX(4px); background: #FEF2F2; }
        .expire-btn { opacity: 0; transition: opacity 0.2s; }
        .queue-item:hover .expire-btn { opacity: 1; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-red-600" />
            Patient Queue
          </h1>
          <p className="text-gray-500 text-sm">Manage and consult with patients assigned to you. Sorted by newest arrival.</p>
        </div>
        <button
          onClick={fetchQueue}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* Stats & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by Patient Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-shadow text-sm"
          />
        </div>
        <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200 shadow-inner">
          <button
            onClick={() => setFilter('waiting')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'waiting' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Clock className="w-3.5 h-3.5" />
            Waiting ({queue.filter(i => !i.isCompleted).length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'completed' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Completed ({queue.filter(i => i.isCompleted).length})
          </button>
        </div>
      </div>

      {/* Queue List */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm font-medium">Updating clinical queue...</p>
          </div>
        ) : filteredQueue.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <p className="text-gray-900 font-bold">No patients found</p>
            <p className="text-gray-500 text-sm">Maybe try a different search or filter?</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredQueue.map((item) => (
              <div
                key={item.billId}
                className="group queue-item p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                onClick={() => setSelectedVisit(item)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold border ${item.isCompleted ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {item.patient.firstName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {item.patient.firstName} {item.patient.lastName}
                      </h3>
                      <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                        {item.patient.patientId}
                      </span>
                    </div>
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1 font-medium">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {item.patient.gender}, {new Date().getFullYear() - new Date(item.patient.dateOfBirth).getFullYear()}Y
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(item.time).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-red-500/80">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!item.isCompleted && (
                    <button
                      onClick={(e) => handleExpire(e, item.billId)}
                      className="expire-btn flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors mr-2"
                      title="Expire this session"
                    >
                      <Trash2 className="w-3 h-3" />
                      Expire
                    </button>
                  )}
                  <span className={`px-4 py-2 rounded-xl text-xs font-bold ${item.isCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {item.isCompleted ? 'Completed' : 'Arrived / Waiting'}
                  </span>
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-red-600 group-hover:border-red-200 transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
