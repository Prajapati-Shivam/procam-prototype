import React from 'react';
import { Group } from '../types';
import { formatCode } from '../utils/generateCode';
import { Users, Mail, Phone, Calendar, Target } from 'lucide-react';

interface GroupCardProps {
  group: Group;
  onEdit: (groupId: string, currentTask?: string) => void;
  isEditing: boolean;
  taskInput: string;
  onTaskInputChange: (value: string) => void;
  onSave: (groupId: string, task: string) => void;
  onCancel: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onEdit,
  isEditing,
  taskInput,
  onTaskInputChange,
  onSave,
  onCancel
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
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
              <div className="flex flex-col space-y-1 mt-2 text-sm text-gray-600">
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
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {group.members.map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <div className="flex flex-col space-y-1 mt-1 text-xs text-gray-600">
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
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Task Assignment</span>
          </h4>
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={taskInput}
                onChange={(e) => onTaskInputChange(e.target.value)}
                placeholder="Describe the task or assignment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows={4}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => onSave(group.id, taskInput)}
                  className="flex items-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <span>Save Task</span>
                </button>
                <button
                  onClick={onCancel}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
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
                onClick={() => onEdit(group.id, group.task)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm w-full justify-center"
              >
                <span>{group.task ? 'Edit Task' : 'Assign Task'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;