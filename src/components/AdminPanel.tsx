import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SPOC, Department, Group, Organization } from '../types';
import { Settings, Users, Building2, UserCog, Plus, CreditCard as Edit3, Trash2, Save, X, Upload, Download, Palette } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [spocs, setSPOCs] = useLocalStorage<SPOC[]>('spocs', []);
  const [departments, setDepartments] = useLocalStorage<Department[]>('departments', []);
  const [groups] = useLocalStorage<Group[]>('volunteer-groups', []);
  const [organization, setOrganization] = useLocalStorage<Organization>('organization', {
    name: 'ProCam',
    tagline: 'Volunteer Management System',
    theme: 'light',
    primaryColor: '#3B82F6',
    secondaryColor: '#6B7280'
  });

  const [activeTab, setActiveTab] = useState<'organization' | 'departments' | 'spocs' | 'export'>('organization');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '', color: '#3B82F6' });
  const [newSPOC, setNewSPOC] = useState({ name: '', email: '', phone: '', department: '' });

  const addDepartment = () => {
    if (newDepartment.name.trim()) {
      const department: Department = {
        id: crypto.randomUUID(),
        name: newDepartment.name,
        description: newDepartment.description,
        color: newDepartment.color,
        spocIds: [],
        isActive: true
      };
      setDepartments([...departments, department]);
      setNewDepartment({ name: '', description: '', color: '#3B82F6' });
    }
  };

  const addSPOC = () => {
    if (newSPOC.name.trim() && newSPOC.email.trim() && newSPOC.department) {
      const spoc: SPOC = {
        id: crypto.randomUUID(),
        name: newSPOC.name,
        email: newSPOC.email,
        phone: newSPOC.phone,
        department: newSPOC.department,
        assignedGroups: [],
        createdAt: new Date(),
        isActive: true
      };
      setSPOCs([...spocs, spoc]);
      setNewSPOC({ name: '', email: '', phone: '', department: '' });
    }
  };

  const exportData = () => {
    const data = {
      groups,
      spocs,
      departments,
      organization,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `volunteer-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderOrganizationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Organization Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Organization Name
          </label>
          <input
            type="text"
            value={organization.name}
            onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={organization.tagline}
            onChange={(e) => setOrganization({ ...organization, tagline: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={organization.primaryColor}
              onChange={(e) => setOrganization({ ...organization, primaryColor: e.target.value })}
              className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={organization.primaryColor}
              onChange={(e) => setOrganization({ ...organization, primaryColor: e.target.value })}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Secondary Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={organization.secondaryColor}
              onChange={(e) => setOrganization({ ...organization, secondaryColor: e.target.value })}
              className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={organization.secondaryColor}
              onChange={(e) => setOrganization({ ...organization, secondaryColor: e.target.value })}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Logo URL (Optional)
        </label>
        <input
          type="url"
          value={organization.logo || ''}
          onChange={(e) => setOrganization({ ...organization, logo: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="https://example.com/logo.png"
        />
      </div>
    </div>
  );

  const renderDepartments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Departments</h3>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Add New Department</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Department name"
            value={newDepartment.name}
            onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="text"
            placeholder="Description"
            value={newDepartment.description}
            onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={newDepartment.color}
              onChange={(e) => setNewDepartment({ ...newDepartment, color: e.target.value })}
              className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer"
            />
            <button
              onClick={addDepartment}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: dept.color }}
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{dept.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{dept.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {dept.spocIds.length} SPOCs
                </span>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSPOCs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SPOCs (Single Point of Contact)</h3>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">Add New SPOC</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Full name"
            value={newSPOC.name}
            onChange={(e) => setNewSPOC({ ...newSPOC, name: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="email"
            placeholder="Email address"
            value={newSPOC.email}
            onChange={(e) => setNewSPOC({ ...newSPOC, email: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={newSPOC.phone}
            onChange={(e) => setNewSPOC({ ...newSPOC, phone: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <div className="flex items-center space-x-2">
            <select
              value={newSPOC.department}
              onChange={(e) => setNewSPOC({ ...newSPOC, department: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            <button
              onClick={addSPOC}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {spocs.map((spoc) => (
          <div key={spoc.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{spoc.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{spoc.email} • {spoc.phone}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">{spoc.department}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {spoc.assignedGroups.length} groups assigned
                </span>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExport = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Export & Import</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Export Data</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Download all volunteer, group, and organization data as JSON
          </p>
          <button
            onClick={exportData}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export All Data</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">System Statistics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Groups:</span>
              <span className="font-medium text-gray-900 dark:text-white">{groups.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Volunteers:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {groups.reduce((sum, group) => sum + group.members.length + 1, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Departments:</span>
              <span className="font-medium text-gray-900 dark:text-white">{departments.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">SPOCs:</span>
              <span className="font-medium text-gray-900 dark:text-white">{spocs.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Settings className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage organization settings and data</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'organization', label: 'Organization', icon: Building2 },
              { id: 'departments', label: 'Departments', icon: Users },
              { id: 'spocs', label: 'SPOCs', icon: UserCog },
              { id: 'export', label: 'Data Export', icon: Download },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'organization' && renderOrganizationSettings()}
        {activeTab === 'departments' && renderDepartments()}
        {activeTab === 'spocs' && renderSPOCs()}
        {activeTab === 'export' && renderExport()}
      </div>
    </div>
  );
};

export default AdminPanel;