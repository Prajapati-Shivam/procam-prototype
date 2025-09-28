export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  members: Volunteer[];
  createdAt: Date;
  assignedTo?: string;
  task?: string;
}

export interface ManagingMember {
  id: string;
  name: string;
  email: string;
  department: string;
  assignedGroups: string[];
}