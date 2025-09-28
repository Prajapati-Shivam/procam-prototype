import React, { useState } from 'react';
import { Volunteer, VerificationStep } from '../types';
import { generateOTP } from '../utils/generateCode';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';

interface VerificationFlowProps {
  volunteer: Volunteer;
  onVerificationComplete: (volunteer: Volunteer) => void;
  onCancel: () => void;
}

const VerificationFlow: React.FC<VerificationFlowProps> = ({
  volunteer,
  onVerificationComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<'mobile' | 'email' | 'government_id'>('mobile');
  const [verificationData, setVerificationData] = useState({
    mobileOTP: '',
    emailOTP: '',
    governmentId: {
      type: 'aadhaar' as const,
      number: ''
    }
  });
  const [sentOTPs, setSentOTPs] = useState({
    mobile: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const sendMobileOTP = async () => {
    setLoading(true);
    const otp = generateOTP();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSentOTPs(prev => ({ ...prev, mobile: otp }));
    setLoading(false);
    alert(`OTP sent to ${volunteer.phone}: ${otp}`); // In real app, this would be sent via SMS
  };

  const sendEmailOTP = async () => {
    setLoading(true);
    const otp = generateOTP();
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSentOTPs(prev => ({ ...prev, email: otp }));
    setLoading(false);
    alert(`OTP sent to ${volunteer.email}: ${otp}`); // In real app, this would be sent via email
  };

  const verifyMobileOTP = () => {
    if (verificationData.mobileOTP === sentOTPs.mobile) {
      volunteer.verificationStatus.mobile = true;
      setCurrentStep('email');
      setErrors({});
    } else {
      setErrors({ mobile: 'Invalid OTP. Please try again.' });
    }
  };

  const verifyEmailOTP = () => {
    if (verificationData.emailOTP === sentOTPs.email) {
      volunteer.verificationStatus.email = true;
      setCurrentStep('government_id');
      setErrors({});
    } else {
      setErrors({ email: 'Invalid OTP. Please try again.' });
    }
  };

  const verifyGovernmentId = async () => {
    setLoading(true);
    // Simulate Digilocker integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (verificationData.governmentId.number.length >= 10) {
      volunteer.verificationStatus.governmentId = true;
      volunteer.governmentId = {
        ...verificationData.governmentId,
        verified: true,
        digilockerData: { verified: true, name: volunteer.name }
      };
      setLoading(false);
      onVerificationComplete(volunteer);
    } else {
      setErrors({ governmentId: 'Invalid ID number. Please check and try again.' });
      setLoading(false);
    }
  };

  const renderMobileVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Mobile Verification</h3>
        <p className="text-gray-600 dark:text-gray-300">We'll send an OTP to {volunteer.phone}</p>
      </div>

      {!sentOTPs.mobile ? (
        <button
          onClick={sendMobileOTP}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Smartphone className="h-4 w-4" />}
          <span>{loading ? 'Sending...' : 'Send OTP'}</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={verificationData.mobileOTP}
              onChange={(e) => setVerificationData(prev => ({ ...prev, mobileOTP: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
            {errors.mobile && (
              <p className="text-red-600 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>
          <button
            onClick={verifyMobileOTP}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700"
          >
            Verify Mobile
          </button>
        </div>
      )}
    </div>
  );

  const renderEmailVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Email Verification</h3>
        <p className="text-gray-600 dark:text-gray-300">We'll send an OTP to {volunteer.email}</p>
      </div>

      {!sentOTPs.email ? (
        <button
          onClick={sendEmailOTP}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          <span>{loading ? 'Sending...' : 'Send OTP'}</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              value={verificationData.emailOTP}
              onChange={(e) => setVerificationData(prev => ({ ...prev, emailOTP: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <button
            onClick={verifyEmailOTP}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700"
          >
            Verify Email
          </button>
        </div>
      )}
    </div>
  );

  const renderGovernmentIdVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Government ID Verification</h3>
        <p className="text-gray-600 dark:text-gray-300">Verify your identity using Digilocker</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID Type
          </label>
          <select
            value={verificationData.governmentId.type}
            onChange={(e) => setVerificationData(prev => ({
              ...prev,
              governmentId: { ...prev.governmentId, type: e.target.value as any }
            }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="aadhaar">Aadhaar Card</option>
            <option value="pan">PAN Card</option>
            <option value="passport">Passport</option>
            <option value="driving_license">Driving License</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ID Number
          </label>
          <input
            type="text"
            value={verificationData.governmentId.number}
            onChange={(e) => setVerificationData(prev => ({
              ...prev,
              governmentId: { ...prev.governmentId, number: e.target.value }
            }))}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
            placeholder="Enter your ID number"
          />
          {errors.governmentId && (
            <p className="text-red-600 text-sm mt-1">{errors.governmentId}</p>
          )}
        </div>

        <button
          onClick={verifyGovernmentId}
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
          <span>{loading ? 'Verifying...' : 'Verify with Digilocker'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Required</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              volunteer.verificationStatus.mobile ? 'bg-green-100 text-green-600' : 
              currentStep === 'mobile' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {volunteer.verificationStatus.mobile ? <CheckCircle className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
            </div>
            <div className={`w-8 h-0.5 ${volunteer.verificationStatus.mobile ? 'bg-green-300' : 'bg-gray-300'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              volunteer.verificationStatus.email ? 'bg-green-100 text-green-600' : 
              currentStep === 'email' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {volunteer.verificationStatus.email ? <CheckCircle className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            </div>
            <div className={`w-8 h-0.5 ${volunteer.verificationStatus.email ? 'bg-green-300' : 'bg-gray-300'}`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              volunteer.verificationStatus.governmentId ? 'bg-green-100 text-green-600' : 
              currentStep === 'government_id' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {volunteer.verificationStatus.governmentId ? <CheckCircle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            </div>
          </div>
        </div>

        {currentStep === 'mobile' && renderMobileVerification()}
        {currentStep === 'email' && renderEmailVerification()}
        {currentStep === 'government_id' && renderGovernmentIdVerification()}
      </div>
    </div>
  );
};

export default VerificationFlow;