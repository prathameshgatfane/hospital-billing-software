import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  LineChart, Line, ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, Users, FileText, Clock, Calendar, CreditCard, 
  TrendingUp, AlertCircle, CheckCircle, Activity, Printer, Download 
} from 'lucide-react';

const Dashboard = () => {
  // Sample data for charts
  const billingData = [
    { month: 'Jan', billed: 45000, collected: 42000, pending: 3000 },
    { month: 'Feb', billed: 52000, collected: 48000, pending: 4000 },
    { month: 'Mar', billed: 61000, collected: 57000, pending: 4000 },
    { month: 'Apr', billed: 58000, collected: 54000, pending: 4000 },
    { month: 'May', billed: 67000, collected: 62000, pending: 5000 },
    { month: 'Jun', billed: 72000, collected: 68000, pending: 4000 },
  ];

  const paymentMethodData = [
    { name: 'Insurance', value: 45, color: '#0088FE' },
    { name: 'Cash', value: 25, color: '#00C49F' },
    { name: 'Credit Card', value: 20, color: '#FFBB28' },
    { name: 'Online Payment', value: 10, color: '#FF8042' },
  ];

  const departmentRevenue = [
    { department: 'Cardiology', revenue: 25000, patients: 120 },
    { department: 'Orthopedics', revenue: 18000, patients: 95 },
    { department: 'Neurology', revenue: 22000, patients: 110 },
    { department: 'Pediatrics', revenue: 15000, patients: 130 },
    { department: 'Emergency', revenue: 20000, patients: 200 },
  ];

  const recentTransactions = [
    { id: 'INV-001', patient: 'John Smith', amount: 1200, status: 'Paid', date: '2024-01-15' },
    { id: 'INV-002', patient: 'Sarah Johnson', amount: 850, status: 'Pending', date: '2024-01-14' },
    { id: 'INV-003', patient: 'Michael Chen', amount: 3200, status: 'Paid', date: '2024-01-13' },
    { id: 'INV-004', patient: 'Emily Davis', amount: 950, status: 'Overdue', date: '2024-01-12' },
    { id: 'INV-005', patient: 'Robert Wilson', amount: 1800, status: 'Paid', date: '2024-01-11' },
  ];

  const statsCards = [
    { title: 'Total Revenue', value: '$156,800', change: '+12.5%', icon: <DollarSign className="h-6 w-6" />, color: 'bg-green-50 text-green-600' },
    { title: 'Active Patients', value: '1,245', change: '+5.2%', icon: <Users className="h-6 w-6" />, color: 'bg-blue-50 text-blue-600' },
    { title: 'Pending Invoices', value: '47', change: '-8.3%', icon: <FileText className="h-6 w-6" />, color: 'bg-yellow-50 text-yellow-600' },
    { title: 'Avg Collection Days', value: '32', change: '-3.1%', icon: <Clock className="h-6 w-6" />, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hospital Billing Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your billing overview</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billing Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Billing Trends</h2>
            <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
              <option>Last 6 months</option>
              <option>Last year</option>
              <option>Last quarter</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={billingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="billed" name="Amount Billed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collected" name="Amount Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Payment Methods</h2>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 ml-8">
              {paymentMethodData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }} />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600 text-sm">{item.value}% of total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Department Revenue & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Department Revenue</h2>
          <div className="space-y-4">
            {departmentRevenue.map((dept, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{dept.department}</p>
                  <p className="text-sm text-gray-600">{dept.patients} patients</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${dept.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
            <button className="text-blue-600 text-sm font-medium">View All →</button>
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.status === 'Paid' ? 'bg-green-50 text-green-600' :
                    transaction.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{transaction.patient}</p>
                    <p className="text-sm text-gray-600">{transaction.id} • {transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${transaction.amount.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <FileText className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">Create Invoice</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <Users className="h-8 w-8 text-green-600 mb-2" />
            <span className="font-medium">Add Patient</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <CreditCard className="h-8 w-8 text-purple-600 mb-2" />
            <span className="font-medium">Process Payment</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
            <Activity className="h-8 w-8 text-orange-600 mb-2" />
            <span className="font-medium">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;