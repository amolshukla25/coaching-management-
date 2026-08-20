'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '@/store/useStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Select } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Table';
import {
  Plus,
  Search,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Edit2,
  Eye
} from 'lucide-react';

export default function StudentsPage() {
  const { users, batches, studentProgress } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBatch, setFilterBatch] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const students = users.filter(u => u.role === 'student');

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = filterBatch === 'all' || 
                        studentProgress.some(p => p.studentId === student.id && p.batchId === filterBatch);
    return matchesSearch && matchesBatch;
  });

  const getStudentProgress = (studentId: string) => {
    return studentProgress.find(p => p.studentId === studentId);
  };

  const getStudentBatch = (studentId: string) => {
    const progress = studentProgress.find(p => p.studentId === studentId);
    return batches.find(b => b.id === progress?.batchId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">Manage all institute students</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Add Student
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length, color: 'bg-purple-500' },
          { label: 'Active', value: students.filter(s => s.isActive).length, color: 'bg-green-500' },
          { label: 'Avg Attendance', value: '91%', color: 'bg-cyan-500' },
          { label: 'Avg Score', value: '82%', color: 'bg-orange-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900 placeholder:text-gray-400 bg-white"
            />
          </div>
          <Select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
            options={[
              { value: 'all', label: 'All Batches' },
              ...batches.map(b => ({ value: b.id, label: b.name }))
            ]}
            className="w-full md:w-48"
          />
        </div>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student, index) => {
          const progress = getStudentProgress(student.id);
          const batch = getStudentBatch(student.id);
          
          return (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full" gradient>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                    {student.name.charAt(0)}
                  </div>
                  <Badge variant={student.isActive ? 'success' : 'default'}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{student.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {student.email}
                  </div>
                  {student.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {student.phone}
                    </div>
                  )}
                  {batch && (
                    <div className="flex items-center text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                      {batch.name}
                    </div>
                  )}
                </div>

                {progress && (
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Attendance</span>
                        <span className="font-medium">{progress.attendancePercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          style={{ width: `${progress.attendancePercentage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Score</span>
                        <span className="font-medium">{progress.overallScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                          style={{ width: `${progress.overallScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Student"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Enter student name" required />
            <Input label="Email" type="email" placeholder="Enter email" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Phone" placeholder="Enter phone number" />
            <Select
              label="Batch"
              options={[
                { value: '', label: 'Select Batch' },
                ...batches.map(b => ({ value: b.id, label: b.name }))
              ]}
              required
            />
          </div>
          <Input label="Join Date" type="date" required />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Student</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
