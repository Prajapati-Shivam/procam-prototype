import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Group, ManagingMember } from '../types';
import { formatCode } from '../utils/generateCode';
import { 
  Shield, 
  Users, 
  UserCheck, 
  Calendar,
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  Edit3,
  Save,
  X
} from 'lucide-react';
import StatisticsDashboard from './StatisticsDashboard';

const ManagingDashboard: React.FC = () => {
  const [groups, setGroups] = useLocalStorage<Group[]>('volunteer-groups', []);
  const [managers, setManagers] = useLocalStorage<ManagingMember[]>('managing-members', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [taskInput, setTaskInput] = useState('');

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.leaderName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'assigned') return matchesSearch && group.assignedTo;
    if (filterStatus === 'unassigned') return matchesSearch && !group.assignedTo;
    return matchesSearch;
  });

  const handleAssignTask = (groupId: string, task: string, managerId?: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, task, assignedTo: managerId || 'self' }
        : group
    ));
    setEditingGroup(null);
    setTaskInput('');
  };

  const startEditing = (groupId: string, currentTask?: string) => {
    setEditingGroup(groupId);
    setTaskInput(currentTask || '');
  };

  const cancelEditing = () => {
    setEditingGroup(null);
    setTaskInput('');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Managing Dashboard</h1>
              <p className="text-gray-600">Oversee volunteer groups and assign tasks</p>
            </div>
          </div>
        </div>

        <StatisticsDashboard groups={groups} />

        <div className="mt-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search groups or leaders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'assigned' | 'unassigned')}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">All Groups</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
              <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid gap-6">
            {filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No groups found matching your criteria.</p>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{group.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          group.assignedTo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {group.assignedTo ? 'Assigned' : 'Unassigned'}
                        </span>
                      </div>
                      <p className="text-gray-600 font-mono text-sm">Code: {formatCode(group.code)}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                        <Users className="h-4 w-4" />
                        <span>{group.members.length + 1}/6 members</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Group Leader</h4>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="font-medium text-gray-900">{group.leaderName}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{group.leaderEmail}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{group.leaderPhone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {group.members.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Members ({group.members.length})</h4>
                          <div className="space-y-2">
                            {group.members.map((member) => (
                              <div key={member.id} className="bg-gray-50 rounded-lg p-3">
                                <p className="font-medium text-gray-900">{member.name}</p>
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                                  <span>{member.email}</span>
                                  <span>{member.phone}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Task Assignment</h4>
                      {editingGroup === group.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            placeholder="Describe the task or assignment..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                            rows={4}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAssignTask(group.id, taskInput)}
                              className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                            >
                              <Save className="h-3 w-3" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                              <X className="h-3 w-3" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {group.task ? (
                            <div className="bg-purple-50 rounded-lg p-4">
                              <p className="text-gray-900 mb-2">{group.task}</p>
                              <p className="text-xs text-gray-500">
                                Assigned by: {group.assignedTo === 'self' ? 'You' : group.assignedTo}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                              <p className="text-gray-500 text-sm">No task assigned</p>
                            </div>
                          )}
                          <button
                            onClick={() => startEditing(group.id, group.task)}
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm w-full justify-center"
                          >
                            <Edit3 className="h-4 w-4" />
                            <span>{group.task ? 'Edit Task' : 'Assign Task'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagingDashboard;