import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, AreaChart, Area, ResponsiveContainer, RadialBarChart, RadialBar 
} from 'recharts';
import { 
  DollarSign, Users, Activity, Shield, Settings, TrendingUp, 
  AlertCircle, CheckCircle, Building, UserPlus, Database, Lock,
  Bell, Search, Filter, Download, MoreVertical 
} from 'lucide-react';

const AdminDashboard = () => {
  // Sample data for admin charts
  const revenueData = [
    { month: 'Jan', revenue: 125000, claims: 45, denials: 5 },
    { month: 'Feb', revenue: 138000, claims: 52, denials: 7 },
    { month: 'Mar', revenue: 145000, claims: 58, denials: 6 },
    { month: 'Apr', revenue: 162000, claims: 64, denials: 8 },
    { month: 'May', revenue: 178000, claims: 72, denials: 9 },
    { month: 'Jun', revenue: 192000, claims: 85, denials: 12 },
  ];

  const userActivity = [
    { name: 'Dr. Smith', role: 'Physician', logins: 142, lastActive: '2 hours ago' },
    { name: 'Nurse Johnson', role: 'Nurse', logins: 89, lastActive: '1 hour ago' },
    { name: 'Billing Dept', role: 'Billing Staff', logins: 156, lastActive: '30 mins ago' },
    { name: 'Admin User', role: 'Administrator', logins: 45, lastActive: '5 mins ago' },
    { name: 'Dr. Garcia', role: 'Physician', logins: 78, lastActive: '4 hours ago' },
  ];

  const systemMetrics = [
    { metric: 'Server Uptime', value: 99.9, status: 'good', threshold: 99 },
    { metric: 'Response Time', value: 120, status: 'warning', threshold: 100 },
    { metric: 'Database Size', value: 45.2, status: 'good', threshold: 80 },
    { metric: 'Active Sessions', value: 245, status: 'good', threshold: 300 },
    { metric: 'Backup Status', value: 100, status: 'good', threshold: 95 },
  ];

  const insuranceProviders = [
    { name: 'Blue Cross', claims: 245, processed: 230, pending: 15, rate: 93.9 },
    { name: 'Aetna', claims: 189, processed: 175, pending: 14, rate: 92.6 },
    { name: 'UnitedHealth', claims: 312, processed: 290, pending: 22, rate: 92.9 },
    { name: 'Cigna', claims: 167, processed: 155, pending: 12, rate: 92.8 },
    { name: 'Medicare', claims: 423, processed: 410, pending: 13, rate: 96.9 },
  ];

  const adminStats = [
    { title: 'Total System Users', value: '156', icon: <Users className="h-6 w-6" />, color: 'bg-blue-500', change: '+8' },
    { title: 'Monthly Revenue', value: '$1.92M', icon: <DollarSign className="h-6 w-6" />, color: 'bg-green-500', change: '+12.5%' },
    { title: 'System Health', value: '98.7%', icon: <Activity className="h-6 w-6" />, color: 'bg-purple-500', change: '+0.3%' },
    { title: 'Security Score', value: '9.8/10', icon: <Shield className="h-6 w-6" />, color: 'bg-red-500', change: 'Stable' },
  ];

  const recentAlerts = [
    { id: 1, type: 'security', message: 'Unusual login attempt detected', time: '10 mins ago', severity: 'high' },
    { id: 2, type: 'system', message: 'Database backup completed', time: '2 hours ago', severity: 'low' },
    { id: 3, type: 'billing', message: 'High denial rate detected', time: '5 hours ago', severity: 'medium' },
    { id: 4, type: 'user', message: 'New admin user created', time: '1 day ago', severity: 'low' },
  ];

  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">System overview and administration</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search reports, users..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="relative p-2">
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-sm text-gray-600">System Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`} style={{ color: stat.color }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue and Claims Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Revenue & Claims Overview</h2>
            <div className="flex space-x-2">
              {['weekly', 'monthly', 'quarterly'].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    selectedPeriod === period 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
              <Line type="monotone" dataKey="claims" name="Claims Processed" stroke="#10b981" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* System Metrics */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">System Health Metrics</h2>
            <button className="text-blue-600 text-sm font-medium">View Details →</button>
          </div>
          <div className="space-y-4">
            {systemMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{metric.metric}</span>
                  <span className={`font-bold ${
                    metric.status === 'good' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {typeof metric.value === 'number' 
                      ? metric.metric.includes('Time') 
                        ? `${metric.value}ms`
                        : metric.metric.includes('Size')
                        ? `${metric.value}GB`
                        : metric.value.toFixed(1) + (metric.metric === 'Server Uptime' ? '%' : '')
                      : metric.value}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      metric.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ 
                      width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Threshold: {metric.threshold}{metric.metric === 'Server Uptime' ? '%' : ''}</span>
                  <span>{metric.status === 'good' ? '✓ Normal' : '⚠️ Attention Needed'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Activity and Insurance Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent User Activity</h2>
            <button className="text-blue-600 text-sm font-medium">View All →</button>
          </div>
          <div className="space-y-4">
            {userActivity.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.role} • {user.logins} logins</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last active</p>
                  <p className="font-medium">{user.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance Providers */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Insurance Provider Performance</h2>
          <div className="space-y-4">
            {insuranceProviders.map((provider, index) => (
              <div key={index} className="space-y-2 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{provider.name}</span>
                  <span className="text-green-600 font-bold">{provider.rate}%</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Claims: {provider.claims}</span>
                  <span>Processed: {provider.processed}</span>
                  <span>Pending: {provider.pending}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${provider.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts and Quick Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">System Alerts</h2>
            <button className="text-blue-600 text-sm font-medium">Manage Alerts →</button>
          </div>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-gray-600 mt-1">{alert.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Quick Admin Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
              <UserPlus className="h-8 w-8 text-blue-600 mb-2" />
              <span className="font-medium">Add User</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
              <Database className="h-8 w-8 text-green-600 mb-2" />
              <span className="font-medium">Backup DB</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
              <Settings className="h-8 w-8 text-purple-600 mb-2" />
              <span className="font-medium">Settings</span>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center">
              <Lock className="h-8 w-8 text-red-600 mb-2" />
              <span className="font-medium">Security</span>
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium mb-3">System Tasks</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Optimization</span>
                <span className="text-green-600 text-sm font-medium">Complete</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Security Audit</span>
                <span className="text-yellow-600 text-sm font-medium">In Progress</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">User Permission Review</span>
                <span className="text-blue-600 text-sm font-medium">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;