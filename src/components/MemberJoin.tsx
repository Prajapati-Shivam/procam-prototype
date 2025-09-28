import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Group, Volunteer } from '../types';
import { formatCode } from '../utils/generateCode';
import { UserPlus, Users, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const MemberJoin: React.FC = () => {
  const [groups, setGroups] = useLocalStorage<Group[]>('volunteer-groups', []);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    code: searchParams.get('code') || '',
    name: '',
    email: '',
    phone: '',
  });
  
  const [joinedGroup, setJoinedGroup] = useState<Group | null>(null);
  const [error, setError] = useState<string>('');
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (searchParams.get('code')) {
      setFormData(prev => ({ ...prev, code: searchParams.get('code') || '' }));
    }
  }, [searchParams]);

  const validateCode = (code: string): Group | null => {
    const cleanCode = code.replace(/-/g, '').toUpperCase();
    return groups.find(group => group.code === cleanCode) || null;
  };

  const handleCodeChange = (value: string) => {
    setFormData({ ...formData, code: value });
    setError('');
    
    const foundGroup = validateCode(value);
    setJoinedGroup(foundGroup);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const group = validateCode(formData.code);
    if (!group) {
      setError('Invalid group code. Please check and try again.');
      return;
    }

    if (group.members.length >= 5) {
      setError('This group is full (maximum 5 members). Please contact the group leader.');
      return;
    }

    if (group.members.some(member => member.email === formData.email)) {
      setError('A member with this email is already in the group.');
      return;
    }

    const newMember: Volunteer = {
      id: crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      joinedAt: new Date(),
    };

    const updatedGroups = groups.map(g =>
      g.id === group.id
        ? { ...g, members: [...g.members, newMember] }
        : g
    );

    setGroups(updatedGroups);
    setIsJoined(true);
  };

  if (isJoined && joinedGroup) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Joined!</h2>
            <p className="text-gray-600">Welcome to "{joinedGroup.name}". You're now part of the team!</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Group Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Group Name:</span>
                <p className="font-medium text-gray-900">{joinedGroup.name}</p>
              </div>
              <div>
                <span className="text-gray-500">Group Code:</span>
                <p className="font-mono font-medium text-blue-600">{formatCode(joinedGroup.code)}</p>
              </div>
              <div>
                <span className="text-gray-500">Group Leader:</span>
                <p className="font-medium text-gray-900">{joinedGroup.leaderName}</p>
              </div>
              <div>
                <span className="text-gray-500">Total Members:</span>
                <p className="font-medium text-gray-900">{joinedGroup.members.length + 1}/6</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setIsJoined(false);
                setJoinedGroup(null);
                setFormData({ code: '', name: '', email: '', phone: '' });
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join Another Group
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join a Volunteer Group</h2>
          <p className="text-gray-600">Enter your group code to join an existing volunteer team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Group Code
            </label>
            <input
              type="text"
              id="code"
              required
              value={formData.code}
              onChange={(e) => handleCodeChange(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-lg"
              placeholder="XXXX-XXXX"
              maxLength={9}
            />
            <p className="text-xs text-gray-500 mt-1">Enter the 8-character code provided by your group leader</p>
          </div>

          {joinedGroup && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Group Found!</span>
              </div>
              <div className="text-sm text-green-700">
                <p><span className="font-medium">Group:</span> {joinedGroup.name}</p>
                <p><span className="font-medium">Leader:</span> {joinedGroup.leaderName}</p>
                <p><span className="font-medium">Current Members:</span> {joinedGroup.members.length}/5</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">{error}</span>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Full Name
            </label>
            <input
              type="text"
              id="memberName"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="memberEmail"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label htmlFor="memberPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="memberPhone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your phone number"
            />
          </div>

          <button
            type="submit"
            disabled={!joinedGroup}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Join Group</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-3">Don't have a group code?</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <Users className="h-4 w-4" />
            <span>Register as Group Leader</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberJoin;