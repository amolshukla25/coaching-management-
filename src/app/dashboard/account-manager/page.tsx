'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Card, { StatCard } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Table';
import Table from '@/components/ui/Table';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Download,
  Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AccountManagerDashboard() {
  const { feeRecords, students, batches } = useStore();

  const totalCollected = feeRecords.filter(f => f.status === 'paid').reduce((acc, f) => acc + f.amount, 0);
  const totalPending = feeRecords.filter(f => f.status === 'pending' || f.status === 'overdue').reduce((acc, f) => acc + f.amount, 0);
  const overdueCount = feeRecords.filter(f => f.status === 'overdue').length;

  const stats = [
    { title: 'Total Collected', value: `₹${(totalCollected / 1000).toFixed(0)}K`, icon: <IndianRupee className="w-6 h-6" />, color: 'green' as const, trend: '+12% from last month' },
    { title: 'Pending Fees', value: `₹${(totalPending / 1000).toFixed(0)}K`, icon: <Clock className="w-6 h-6" />, color: 'orange' as const, trend: `${overdueCount} overdue` },
    { title: 'Total Students', value: students.length, icon: <CreditCard className="w-6 h-6" />, color: 'purple' as const, trend: 'All active' },
    { title: 'Collection Rate', value: '87%', icon: <TrendingUp className="w-6 h-6" />, color: 'cyan' as const, trend: '+5% improvement' },
  ];

  const monthlyCollection = [
    { month: 'Jan', collected: 350000, pending: 50000 },
    { month: 'Feb', collected: 420000, pending: 30000 },
    { month: 'Mar', collected: 380000, pending: 45000 },
    { month: 'Apr', collected: 520000, pending: 25000 },
    { month: 'May', collected: 480000, pending: 35000 },
    { month: 'Jun', collected: 550000, pending: 20000 },
  ];

  const paymentMethods = [
    { name: 'UPI', value: 45, color: '#8b5cf6' },
    { name: 'Cash', value: 25, color: '#06b6d4' },
    { name: 'Bank Transfer', value: 20, color: '#10b981' },
    { name: 'Card', value: 10, color: '#f59e0b' },
  ];

  const recentPayments = feeRecords.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Financial Overview 💰</h1>
            <p className="text-white/80">Track fees, payments, and financial health of the institute.</p>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 border-white/30">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Collection</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyCollection}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Area type="monotone" dataKey="collected" stroke="#10b981" fillOpacity={1} fill="url(#colorCollected)" />
                <Area type="monotone" dataKey="pending" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPending)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethods}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {paymentMethods.map((method) => (
              <div key={method.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                <span className="text-sm text-gray-600">{method.name} ({method.value}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Payments Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
          <Button variant="primary" size="sm">
            <IndianRupee className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Batch</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentPayments.map((payment, index) => (
                <motion.tr
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                        {payment.studentName.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900">{payment.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{payment.batchName}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">₹{payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      payment.status === 'paid' ? 'success' :
                      payment.status === 'pending' ? 'warning' :
                      'danger'
                    }>
                      {payment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{payment.paymentMethod || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : '-'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Overdue Alerts */}
      {overdueCount > 0 && (
        <Card className="p-6 border-l-4 border-red-500">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Overdue Payments Alert</h4>
              <p className="text-gray-600 mt-1">
                {overdueCount} payment(s) are overdue. Total pending amount: ₹{totalPending.toLocaleString()}
              </p>
              <Button variant="danger" size="sm" className="mt-4">
                Send Reminders
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
