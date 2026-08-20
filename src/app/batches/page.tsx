'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  Filter,
  BookOpen,
  Users,
  Clock,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  MapPin
} from 'lucide-react';
import { courseOptions, weekDays } from '@/lib/mockData';
import { Batch } from '@/types';

export default function BatchesPage() {
  const { batches, addBatch, updateBatch, deleteBatch, users } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [viewingBatch, setViewingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    course: '',
    teacherId: '',
    startTime: '09:00',
    endTime: '12:00',
    days: [] as string[],
    capacity: 30,
    startDate: '',
    endDate: '',
    room: ''
  });

  const teachers = users.filter(u => u.role === 'teacher');

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || batch.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.id === formData.teacherId);
    if (editingBatch) {
      updateBatch(editingBatch.id, {
        ...formData,
        teacherName: teacher?.name || ''
      });
    } else {
      addBatch({
        id: Date.now().toString(),
        ...formData,
        teacherName: teacher?.name || '',
        enrolledStudents: 0,
        studentIds: [],
        status: 'upcoming'
      });
    }
    setIsModalOpen(false);
    setEditingBatch(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      course: '',
      teacherId: '',
      startTime: '09:00',
      endTime: '12:00',
      days: [],
      capacity: 30,
      startDate: '',
      endDate: '',
      room: ''
    });
  };

  const openEditModal = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData({
      name: batch.name,
      course: batch.course,
      teacherId: batch.teacherId,
      startTime: batch.startTime,
      endTime: batch.endTime,
      days: batch.days,
      capacity: batch.capacity,
      startDate: batch.startDate,
      endDate: batch.endDate,
      room: batch.room
    });
    setIsModalOpen(true);
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
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
          <h1 className="text-3xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-500 mt-1">Manage all institute batches</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="w-5 h-5 mr-2" />
          Create Batch
        </Button>
      </motion.div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900 placeholder:text-gray-400 bg-white"
            />
          </div>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'completed', label: 'Completed' }
            ]}
            className="w-full md:w-48"
          />
        </div>
      </Card>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredBatches.map((batch, index) => (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <Card className="p-6 h-full" gradient>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <Badge variant={batch.status === 'active' ? 'success' : batch.status === 'upcoming' ? 'info' : 'default'}>
                    {batch.status}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">{batch.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{batch.course}</p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-3 text-purple-500" />
                    {batch.startTime} - {batch.endTime}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-3 text-cyan-500" />
                    {batch.enrolledStudents}/{batch.capacity} students
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-3 text-green-500" />
                    {batch.room}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-3 text-orange-500" />
                    {batch.days.join(', ')}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-500">Capacity</span>
                    <span className="font-medium">{Math.round((batch.enrolledStudents / batch.capacity) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(batch.enrolledStudents / batch.capacity) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => openEditModal(batch)}>
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => setViewingBatch(batch)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteBatch(batch.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View Students Modal */}
      <Modal
        isOpen={!!viewingBatch}
        onClose={() => setViewingBatch(null)}
        title={viewingBatch ? `Students in ${viewingBatch.name}` : 'Students'}
        size="lg"
      >
        {viewingBatch && (() => {
          const batchStudents = users.filter(u => u.role === 'student' && viewingBatch.studentIds.includes(u.id));
          return (
            <div className="space-y-4">
              {batchStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No students enrolled in this batch yet.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">
                      Showing {batchStudents.length} of {viewingBatch.capacity} students
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Capacity:</span>
                      <span className="text-sm text-gray-500">
                        {Math.round((batchStudents.length / viewingBatch.capacity) * 100)}% filled
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {batchStudents.map((student, idx) => (
                          <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-500">{idx + 1}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                                  {student.name.charAt(0)}
                                </div>
                                <span className="font-medium text-gray-900">{student.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500">{student.email}</td>
                            <td className="py-3 px-4 text-sm text-gray-500">{student.phone || '-'}</td>
                            <td className="py-3 px-4">
                              <Badge variant={student.isActive ? 'success' : 'default'}>
                                {student.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </Modal>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingBatch(null); }}
        title={editingBatch ? 'Edit Batch' : 'Create New Batch'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Batch Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Animation Premium"
              required
            />
            <Select
              label="Course"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              options={[
                { value: '', label: 'Select Course' },
                ...courseOptions.map(c => ({ value: c, label: c }))
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Teacher"
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              options={[
                { value: '', label: 'Select Teacher' },
                ...teachers.map(t => ({ value: t.id, label: t.name }))
              ]}
              required
            />
            <Input
              label="Room"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              placeholder="e.g., Lab 1"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Days</label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.days.includes(day)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              min="1"
              required
            />
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="ghost" type="button" onClick={() => { setIsModalOpen(false); setEditingBatch(null); }}>
              Cancel
            </Button>
            <Button type="submit">
              {editingBatch ? 'Update Batch' : 'Create Batch'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
