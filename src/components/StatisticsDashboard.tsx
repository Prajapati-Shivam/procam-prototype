import React from 'react';
import { Group } from '../types';
import { Users, UserCheck, Target, Calendar } from 'lucide-react';

interface StatisticsDashboardProps {
  groups: Group[];
}

const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({ groups }) => {
  const totalGroups = groups.length;
  const totalVolunteers = groups.reduce((sum, group) => sum + group.members.length + 1, 0);
  const assignedGroups = groups.filter(group => group.assignedTo).length;
  const averageGroupSize = totalGroups > 0 ? (totalVolunteers / totalGroups).toFixed(1) : '0';

  const stats = [
    {
      label: 'Total Groups',
      value: totalGroups,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Volunteers',
      value: totalVolunteers,
      icon: UserCheck,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Assigned Groups',
      value: assignedGroups,
      icon: Target,
      color: 'bg-purple-100 text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Avg Group Size',
      value: averageGroupSize,
      icon: Calendar,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <IconComponent className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatisticsDashboard;