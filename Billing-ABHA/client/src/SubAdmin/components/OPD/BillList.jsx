import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Receipt, Search, Filter, Printer, 
  Eye, Calendar, User as UserIcon,
  CreditCard, Banknote, Smartphone,
  ArrowLeft, Plus
} from 'lucide-react';
import opdBillingApi from '../../API/opdBillingApi';
import DataTable from '../Common/DataTable';

const BillList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchBills();
  }, [pagination.page, filters]);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const response = await opdBillingApi.getBills({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      if (response.success) {
        setBills(response.data);
        setPagination({
          ...pagination,
          total: response.total
        });
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Bill #',
      accessor: 'billNumber',
      render: (row) => (
        <span className="font-bold text-gray-900">{row.billNumber}</span>
      )
    },
    {
      header: 'Date',
      accessor: 'billDate',
      render: (row) => (
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(row.billDate).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Patient',
      accessor: 'patient',
      render: (row) => (
        <div className="flex items-center">
          <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center mr-2">
            <UserIcon className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {row.patient?.firstName} {row.patient?.lastName}
            </p>
            <p className="text-xs text-gray-500">{row.patient?.patientId}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Doctor',
      accessor: 'doctor',
      render: (row) => (
        <span className="text-sm font-medium text-gray-700">
          {row.doctor?.fullName ? `Dr. ${row.doctor.fullName}` : 'N/A'}
        </span>
      )
    },
    {
      header: 'Amount',
      accessor: 'totalAmount',
      render: (row) => (
        <span className="font-bold text-gray-900">₹{row.totalAmount}</span>
      )
    },
    {
      header: 'Payment',
      accessor: 'paymentMode',
      render: (row) => (
        <div className="flex items-center">
          {row.paymentMode === 'Cash' && <Banknote className="w-3 h-3 mr-1 text-green-600" />}
          {row.paymentMode === 'UPI' && <Smartphone className="w-3 h-3 mr-1 text-blue-600" />}
          <span className="text-xs font-medium">{row.paymentMode}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'paymentStatus',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
          row.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {row.paymentStatus}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(`/subadmin/reception/opd/billing/view/${row._id}`)}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="View & Print"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/subadmin/reception/opd')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing History</h1>
            <p className="text-gray-600 mt-1">View and manage all OPD bills</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/subadmin/reception/opd/billing/create')}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Bill
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={bills}
          loading={loading}
          pagination={pagination}
          onPageChange={(p) => setPagination({...pagination, page: p})}
        />
      </div>
    </div>
  );
};

export default BillList;
