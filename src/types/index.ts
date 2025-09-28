export interface Volunteer {
  id: string;
  uid: string; // Unique volunteer identifier
  name: string;
  email: string;
  phone: string;
  joinedAt: Date;
  verificationStatus: {
    mobile: boolean;
    email: boolean;
    governmentId: boolean;
  };
  governmentId?: {
    type: 'aadhaar' | 'pan' | 'passport' | 'driving_license';
    number: string;
    verified: boolean;
    digilockerData?: any;
  };
}

export interface Group {
  id: string;
  name: string;
  code: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  leaderUid: string;
  members: Volunteer[];
  createdAt: Date;
  assignedTo?: string;
  task?: string;
  maxMembers: number; // 5-10 members
  department?: string;
  spocId?: string;
}

export interface SPOC {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  assignedGroups: string[];
  createdAt: Date;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  spocIds: string[];
  color: string;
  isActive: boolean;
}

export interface Organization {
  name: string;
  logo?: string;
  tagline: string;
  theme: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
}

export interface VerificationStep {
  id: string;
  type: 'mobile' | 'email' | 'government_id';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  data?: any;
}

export interface ManagingMember {
  id: string;
  name: string;
  email: string;
  department: string;
  assignedGroups: string[];
}