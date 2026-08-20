'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import Card, { StatCard } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Table';
import {
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  FileText,
  ChevronRight,
  Download
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser, attendance, lessonPlans, studentProgress, batches } = useStore();

  const myAttendance = attendance.filter(a => a.studentId === currentUser?.id);
  const myProgress = studentProgress.find(p => p.studentId === currentUser?.id);
  const myBatch = batches.find(b => b.enrolledStudents > 0);
  const myLessonPlans = lessonPlans.filter(lp => lp.batchId === myBatch?.id);

  const stats = [
    { title: 'Attendance', value: `${myProgress?.attendancePercentage || 92}%`, icon: <Calendar className="w-6 h-6" />, color: 'green' as const, trend: 'On track' },
    { title: 'Overall Score', value: `${myProgress?.overallScore || 85}%`, icon: <TrendingUp className="w-6 h-6" />, color: 'purple' as const, trend: '+5% this month' },
    { title: 'Assignments', value: `${myProgress?.assignmentsCompleted || 12}/${myProgress?.totalAssignments || 15}`, icon: <FileText className="w-6 h-6" />, color: 'cyan' as const, trend: '3 pending' },
    { title: 'Rank', value: '#5', icon: <Award className="w-6 h-6" />, color: 'orange' as const, trend: 'Top 10%' },
  ];

  const recentAttendance = myAttendance.slice(0, 5);

  const upcomingLessons = myLessonPlans.filter(lp => lp.status === 'planned').slice(0, 3);

  const assignments = [
    { id: 1, title: 'Character Animation Project', dueDate: '2024-07-20', status: 'pending', subject: 'Animation' },
    { id: 2, title: '3D Modeling Assignment', dueDate: '2024-07-18', status: 'submitted', subject: 'Modeling' },
    { id: 3, title: 'VFX Compositing Exercise', dueDate: '2024-07-22', status: 'pending', subject: 'VFX' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hello, {currentUser?.name?.split(' ')[0]}! 🎓</h1>
            <p className="text-white/80">You have 2 upcoming classes today. Keep learning!</p>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl"
          >
            📚
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance History */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {recentAttendance.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    record.status === 'present' ? 'bg-green-100 text-green-600' :
                    record.status === 'absent' ? 'bg-red-100 text-red-600' :
                    record.status === 'late' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {record.status === 'present' ? <CheckCircle className="w-5 h-5" /> :
                     record.status === 'absent' ? <Clock className="w-5 h-5" /> :
                     <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{record.batchName}</p>
                    <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                <Badge variant={
                  record.status === 'present' ? 'success' :
                  record.status === 'absent' ? 'danger' :
                  record.status === 'late' ? 'warning' :
                  'info'
                }>
                  {record.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Upcoming Lessons */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Upcoming Lessons</h3>
          <div className="space-y-4">
            {upcomingLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-xl border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{lesson.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{lesson.batchName}</p>
                  </div>
                  <Badge variant="info">{lesson.duration}</Badge>
                </div>
                <p className="text-xs text-gray-400 mt-2">{new Date(lesson.date).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Assignments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">My Assignments</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant={assignment.status === 'submitted' ? 'success' : 'warning'}>
                  {assignment.status}
                </Badge>
                <span className="text-xs text-gray-500">{assignment.subject}</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{assignment.title}</h4>
              <p className="text-sm text-gray-500">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
              {assignment.status === 'pending' && (
                <Button variant="primary" size="sm" className="w-full mt-4">
                  Submit Assignment
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
