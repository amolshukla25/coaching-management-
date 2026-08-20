'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Card, { StatCard } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Table';
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

export default function AcademicManagerDashboard() {
  const { batches, users, attendance, lessonPlans, studentProgress } = useStore();

  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');

  const stats = [
    { title: 'Total Batches', value: batches.length, icon: <BookOpen className="w-6 h-6" />, color: 'purple' as const, trend: `${batches.filter(b => b.status === 'active').length} active` },
    { title: 'Total Teachers', value: teachers.length, icon: <Users className="w-6 h-6" />, color: 'cyan' as const, trend: 'All available' },
    { title: 'Total Students', value: students.length, icon: <Users className="w-6 h-6" />, color: 'green' as const, trend: '+12 this month' },
    { title: 'Avg Attendance', value: '91%', icon: <Calendar className="w-6 h-6" />, color: 'orange' as const, trend: '+3% improvement' },
  ];

  const teacherSchedule = teachers.map(teacher => {
    const teacherBatches = batches.filter(b => b.teacherId === teacher.id);
    return {
      name: teacher.name.split(' ')[0],
      batches: teacherBatches.length,
      students: teacherBatches.reduce((acc, b) => acc + b.enrolledStudents, 0),
      hours: teacherBatches.length * 3,
    };
  });

  const batchProgressData = batches.map((batch, idx) => ({
    name: batch.name.split(' ')[0],
    progress: Math.round((batch.enrolledStudents / batch.capacity) * 100),
    attendance: 88 + (idx % 8),
  }));

  const weeklyOverview = [
    { day: 'Mon', classes: 8, attendance: 92 },
    { day: 'Tue', classes: 6, attendance: 88 },
    { day: 'Wed', classes: 7, attendance: 94 },
    { day: 'Thu', classes: 5, attendance: 87 },
    { day: 'Fri', classes: 8, attendance: 91 },
    { day: 'Sat', classes: 4, attendance: 85 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Academic Overview 📊</h1>
          <p className="text-white/80">Monitor teacher performance, batch progress, and academic quality across the institute.</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teacher Schedule */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Teacher Workload</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teacherSchedule}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="batches" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="students" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Batch Progress */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Batch Progress</h3>
            <Button variant="ghost" size="sm">Details</Button>
          </div>
          <div className="space-y-4">
            {batchProgressData.map((batch, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{batch.name}</span>
                  <span className="text-sm text-gray-500">{batch.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${batch.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2.5 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Teacher List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Teachers & Their Batches</h3>
          <Button variant="primary" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Manage Teachers
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachers.map((teacher, index) => {
            const teacherBatches = batches.filter(b => b.teacherId === teacher.id);
            return (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {teacher.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
                    <p className="text-sm text-gray-500">{teacher.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Assigned Batches</span>
                    <span className="font-medium">{teacherBatches.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Students</span>
                    <span className="font-medium">
                      {teacherBatches.reduce((acc, b) => acc + b.enrolledStudents, 0)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {teacherBatches.map(batch => (
                      <Badge key={batch.id} variant="info">{batch.name.split(' ')[0]}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Weekly Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Overview</h3>
        <div className="grid grid-cols-6 gap-4">
          {weeklyOverview.map((day, index) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors"
            >
              <p className="text-sm font-semibold text-gray-900 mb-2">{day.day}</p>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mb-2">
                <span className="text-white font-bold">{day.classes}</span>
              </div>
              <p className="text-xs text-gray-500">classes</p>
              <p className="text-sm font-medium text-green-600 mt-2">{day.attendance}%</p>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
