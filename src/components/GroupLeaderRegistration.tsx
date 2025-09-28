import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Group, Volunteer } from '../types';
import { generateUniqueCode, generateVolunteerUID, formatCode } from '../utils/generateCode';
import { Users, Download, Copy, Check } from 'lucide-react';
import VerificationFlow from './VerificationFlow';

const GroupLeaderRegistration: React.FC = () => {
  const [groups, setGroups] = useLocalStorage<Group[]>('volunteer-groups', []);
  const [formData, setFormData] = useState({
    groupName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    maxMembers: 5,
  });
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [groupCode, setGroupCode] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [leaderVolunteer, setLeaderVolunteer] = useState<Volunteer | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create leader as volunteer for verification
    const leader: Volunteer = {
      id: crypto.randomUUID(),
      uid: generateVolunteerUID(),
      name: formData.leaderName,
      email: formData.leaderEmail,
      phone: formData.leaderPhone,
      joinedAt: new Date(),
      verificationStatus: {
        mobile: false,
        email: false,
        governmentId: false
      }
    };
    
    setLeaderVolunteer(leader);
    setShowVerification(true);
  };

  const handleVerificationComplete = async (verifiedLeader: Volunteer) => {
    const code = generateUniqueCode();
    const joinUrl = `${window.location.origin}/join?code=${code}`;
    
    try {
      const qrCode = await QRCode.toDataURL(joinUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff',
        },
      });
      
      const newGroup: Group = {
        id: crypto.randomUUID(),
        name: formData.groupName,
        code,
        leaderName: formData.leaderName,
        leaderUid: verifiedLeader.uid,
        leaderEmail: formData.leaderEmail,
        leaderPhone: formData.leaderPhone,
        members: [],
        createdAt: new Date(),
        maxMembers: formData.maxMembers,
      };
      
      setGroups([...groups, newGroup]);
      setQrDataUrl(qrCode);
      setGroupCode(code);
      setShowVerification(false);
      setIsRegistered(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleVerificationCancel = () => {
    setShowVerification(false);
    setLeaderVolunteer(null);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(formatCode(groupCode));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `group-${formatCode(groupCode)}-qr.png`;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setFormData({ groupName: '', leaderName: '', leaderEmail: '', leaderPhone: '', maxMembers: 5 });
    setIsRegistered(false);
    setShowVerification(false);
    setLeaderVolunteer(null);
    setQrDataUrl('');
    setGroupCode('');
    setCopied(false);
  };

  if (showVerification && leaderVolunteer) {
    return (
      <VerificationFlow
        volunteer={leaderVolunteer}
        onVerificationComplete={handleVerificationComplete}
        onCancel={handleVerificationCancel}
      />
    );
  }

  if (isRegistered) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Group Registered Successfully!</h2>
            <p className="text-gray-600 dark:text-gray-300">Your group "{formData.groupName}" has been created. Share the code or QR code with your team members.</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Group Code</h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-3xl font-mono font-bold text-blue-600">{formatCode(groupCode)}</p>
              </div>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">QR Code</h3>
              <div className="inline-block bg-white p-4 rounded-lg shadow-sm">
                <img src={qrDataUrl} alt="Group QR Code" className="w-64 h-64 mx-auto" />
              </div>
              <div className="mt-4">
                <button
                  onClick={downloadQR}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download QR Code</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center space-x-4">
              <button
                onClick={resetForm}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Register Another Group
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Register as Group Leader</h2>
          <p className="text-gray-600 dark:text-gray-300">Create a new volunteer group and get your unique joining code</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group Name
            </label>
            <input
              type="text"
              id="groupName"
              required
              value={formData.groupName}
              onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Enter your group name"
            />
          </div>

          <div>
            <label htmlFor="leaderName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Full Name
            </label>
            <input
              type="text"
              id="leaderName"
              required
              value={formData.leaderName}
              onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="leaderEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="leaderEmail"
              required
              value={formData.leaderEmail}
              onChange={(e) => setFormData({ ...formData, leaderEmail: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label htmlFor="leaderPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="leaderPhone"
              required
              value={formData.leaderPhone}
              onChange={(e) => setFormData({ ...formData, leaderPhone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Group Size
            </label>
            <select
              id="maxMembers"
              value={formData.maxMembers}
              onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
            >
              {[5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} members (+ 1 leader)</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Choose the maximum number of members for your group (excluding yourself as leader)
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Continue to Verification
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupLeaderRegistration;