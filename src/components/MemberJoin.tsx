import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Group, Volunteer } from '../types';
import { formatCode, generateVolunteerUID } from '../utils/generateCode';
import { UserPlus, Users, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import VerificationFlow from './VerificationFlow';

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
  const [memberVolunteer, setMemberVolunteer] = useState<Volunteer | null>(null);
  const [showVerification, setShowVerification] = useState(false);
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

    if (group.members.length >= group.maxMembers) {
      setError(`This group is full (maximum ${group.maxMembers} members). Please contact the group leader.`);
      return;
    }

    if (group.members.some(member => member.email === formData.email)) {
      setError('A member with this email is already in the group.');
      return;
    }

    // Create member volunteer for verification
    const member: Volunteer = {
      id: crypto.randomUUID(),
      uid: generateVolunteerUID(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      joinedAt: new Date(),
      verificationStatus: {
        mobile: false,
        email: false,
        governmentId: false
      }
    };

    setMemberVolunteer(member);
    setShowVerification(true);
  };

  const handleVerificationComplete = (verifiedMember: Volunteer) => {
    const group = validateCode(formData.code);
    if (!group) return;

    const updatedGroups = groups.map(g =>
      g.id === group.id
        ? { ...g, members: [...g.members, verifiedMember] }
        : g
    );

    setGroups(updatedGroups);
    setShowVerification(false);
    setIsJoined(true);
  };

  const handleVerificationCancel = () => {
    setShowVerification(false);
    setMemberVolunteer(null);
  };

  if (showVerification && memberVolunteer) {
    return (
      <VerificationFlow
        volunteer={memberVolunteer}
        onVerificationComplete={handleVerificationComplete}
        onCancel={handleVerificationCancel}
      />
    );
  }

  if (isJoined && joinedGroup) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Successfully Joined!</h2>
            <p className="text-gray-600 dark:text-gray-300">Welcome to "{joinedGroup.name}". You're now part of the team!</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Group Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Group Name:</span>
                <p className="font-medium text-gray-900 dark:text-white">{joinedGroup.name}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Group Code:</span>
                <p className="font-mono font-medium text-blue-600">{formatCode(joinedGroup.code)}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Group Leader:</span>
                <p className="font-medium text-gray-900 dark:text-white">{joinedGroup.leaderName}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Total Members:</span>
                <p className="font-medium text-gray-900 dark:text-white">{joinedGroup.members.length + 1}/{joinedGroup.maxMembers + 1}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setIsJoined(false);
                setJoinedGroup(null);
                setMemberVolunteer(null);
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Join a Volunteer Group</h2>
          <p className="text-gray-600 dark:text-gray-300">Enter your group code to join an existing volunteer team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group Code
            </label>
            <input
              type="text"
              id="code"
              required
              value={formData.code}
              onChange={(e) => handleCodeChange(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors font-mono text-lg"
              placeholder="XXXX-XXXX"
              maxLength={9}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter the 8-character code provided by your group leader</p>
          </div>

          {joinedGroup && (
            <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Group Found!</span>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                <p><span className="font-medium">Group:</span> {joinedGroup.name}</p>
                <p><span className="font-medium">Leader:</span> {joinedGroup.leaderName}</p>
                <p><span className="font-medium">Current Members:</span> {joinedGroup.members.length}/{joinedGroup.maxMembers}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-200">{error}</span>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Full Name
            </label>
            <input
              type="text"
              id="memberName"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="memberEmail"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label htmlFor="memberPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="memberPhone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Enter your phone number"
            />
          </div>

          <button
            type="submit"
            disabled={!joinedGroup}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Continue to Verification</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Don't have a group code?</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
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