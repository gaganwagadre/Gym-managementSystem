import { ROUTES } from './routes';

type MemberRecord = {
  _id: string;
  name: string;
  gender: string;
  dob: string | null;
  anniversary: string | null;
  contact: string;
  address: string;
  group: string;
  photo: string;
  membershipExpiresOn: string | null;
};

type CollectionRecord = {
  _id: string;
  memberName: string;
  amount: number;
  mode: string;
  date: string;
};

type ExpenseRecord = {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
};

type UserRecord = {
  id: string;
  username: string;
  password: string;
  role: string;
};

type MenuItemRecord = {
  id: string;
  title: string;
  icon: string;
  route?: string; // Optional: if has children, route is optional
  roles?: string[]; // Optional: restrict to certain roles
  children?: MenuItemRecord[]; // Optional: submenu items
};

const generateId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const createError = (message: string, status = 400) => {
  const error: any = new Error(message);
  error.response = { status, data: { detail: message } };
  return error;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const withinDays = (date: Date, days: number) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
};

const mockDb: {
  users: UserRecord[];
  members: MemberRecord[];
  collections: CollectionRecord[];
  expenses: ExpenseRecord[];
  menuItems: MenuItemRecord[];
} = {
  users: [
    { id: 'u_1', username: 'admin', password: 'password', role: 'admin' },
    { id: 'u_2', username: 'trainer', password: 'trainer', role: 'staff' },
  ],
  members: [
    {
      _id: 'm_1',
      name: 'Rohan Mehta',
      gender: 'male',
      dob: '1991-04-04T00:00:00.000Z',
      anniversary: null,
      contact: '9876543210',
      address: 'Bandra West, Mumbai',
      group: 'strength',
      photo:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=60',
      membershipExpiresOn: new Date().toISOString(),
    },
    {
      _id: 'm_2',
      name: 'Ananya Rao',
      gender: 'female',
      dob: '1994-09-18T00:00:00.000Z',
      anniversary: null,
      contact: '9123456780',
      address: 'HSR Layout, Bengaluru',
      group: 'yoga',
      photo:
        'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=60',
      membershipExpiresOn: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      _id: 'm_3',
      name: 'Vikram Singh',
      gender: 'male',
      dob: '1988-12-02T00:00:00.000Z',
      anniversary: '2016-02-14T00:00:00.000Z',
      contact: '9000001122',
      address: 'Banjara Hills, Hyderabad',
      group: 'cardio',
      photo: '',
      membershipExpiresOn: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ],
  collections: [
    {
      _id: 'c_1',
      memberName: 'Rohan Mehta',
      amount: 2500,
      mode: 'upi',
      date: new Date().toISOString(),
    },
    {
      _id: 'c_2',
      memberName: 'Ananya Rao',
      amount: 2200,
      mode: 'cash',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'c_3',
      memberName: 'Vikram Singh',
      amount: 1800,
      mode: 'card',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  expenses: [
    {
      _id: 'e_1',
      description: 'New kettlebells',
      amount: 1200,
      category: 'equipment',
      date: new Date().toISOString(),
    },
    {
      _id: 'e_2',
      description: 'Studio rent',
      amount: 8000,
      category: 'rent',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'e_3',
      description: 'Trainer payout',
      amount: 3500,
      category: 'salary',
      date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  menuItems: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'home-outline',
      route: ROUTES.DASHBOARD,
    },
    {
      id: 'members',
      title: 'Members',
      icon: 'people-outline',
      route: ROUTES.MEMBERS,
    },
    {
      id: 'collections',
      title: 'Collections',
      icon: 'wallet-outline',
      route: ROUTES.COLLECTIONS,
    },
    {
      id: 'expenses',
      title: 'Expenses',
      icon: 'receipt-outline',
      route: ROUTES.EXPENSES,
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: 'person-outline',
      route: ROUTES.PROFILE,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      route: ROUTES.SETTINGS,
      roles: ['admin'], // Only show to admin users
      children: [
        {
          id: 'settings-general',
          title: 'General Settings',
          icon: 'options-outline',
          route: ROUTES.SETTINGS,
        },
        {
          id: 'settings-account',
          title: 'Account Settings',
          icon: 'person-circle-outline',
          route: ROUTES.PROFILE,
        },
      ],
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: 'bar-chart-outline',
      route: ROUTES.REPORTS,
      children: [
        {
          id: 'reports-financial',
          title: 'Financial Reports',
          icon: 'cash-outline',
          route: ROUTES.REPORTS,
        },
        {
          id: 'reports-members',
          title: 'Member Reports',
          icon: 'people-outline',
          route: ROUTES.REPORTS,
        },
      ],
    },
  ],
};

const getDashboardStats = () => {
  const now = new Date();
  const sumCollections = (filter: (c: CollectionRecord) => boolean) =>
    mockDb.collections
      .filter(filter)
      .reduce((total, record) => total + record.amount, 0);
  const sumExpenses = (filter: (e: ExpenseRecord) => boolean) =>
    mockDb.expenses
      .filter(filter)
      .reduce((total, record) => total + record.amount, 0);

  const todayCollection = sumCollections((c) => isSameDay(new Date(c.date), now));
  const weekCollection = sumCollections((c) => withinDays(new Date(c.date), 7));
  const monthCollection = sumCollections((c) => isSameMonth(new Date(c.date), now));
  const monthExpenses = sumExpenses((e) => isSameMonth(new Date(e.date), now));
  const pendingCollection = Math.max(
    0,
    mockDb.members.length * 2500 - monthCollection
  );
  const todayExpiry = mockDb.members.filter(
    (member) =>
      member.membershipExpiresOn &&
      isSameDay(new Date(member.membershipExpiresOn), now)
  ).length;

  return {
    activeMemberships: mockDb.members.length,
    activeMembers: mockDb.members.length,
    todayExpiry,
    todayCollection,
    weekCollection,
    pendingCollection,
    monthCollection,
    monthExpenses,
  };
};

const normalizeMemberPayload = (payload: Partial<MemberRecord>) => ({
  name: payload.name?.trim() || '',
  gender: payload.gender || '',
  dob: payload.dob || null,
  anniversary: payload.anniversary || null,
  contact: payload.contact?.trim() || '',
  address: payload.address?.trim() || '',
  group: payload.group || '',
  photo: payload.photo || '',
});

export const staticData = {
  login: async (username: string, password: string) => {
    await delay();
    const user = mockDb.users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (!user || user.password !== password) {
      throw createError('Invalid username or password', 401);
    }
    return {
      staff: { id: user.id, username: user.username, role: user.role },
      token: 'static-demo-token',
    };
  },

  signup: async (username: string, password: string, role = 'staff') => {
    await delay();
    const normalized = username.trim();
    if (!normalized) {
      throw createError('Username is required');
    }
    const existing = mockDb.users.find(
      (u) => u.username.toLowerCase() === normalized.toLowerCase()
    );
    if (existing) {
      throw createError('Username already exists', 409);
    }
    const newUser: UserRecord = {
      id: generateId('u'),
      username: normalized,
      password,
      role,
    };
    mockDb.users.push(newUser);
    return { success: true };
  },

  getDashboardStats: async () => {
    await delay();
    return getDashboardStats();
  },

  getMembers: async () => {
    await delay();
    return mockDb.members.map((member) => ({ ...member }));
  },

  getMemberById: async (id: string) => {
    await delay();
    const member = mockDb.members.find((item) => item._id === id);
    if (!member) {
      throw createError('Member not found', 404);
    }
    return { ...member };
  },

  addMember: async (payload: Partial<MemberRecord>) => {
    await delay();
    const normalized = normalizeMemberPayload(payload);
    const missingFields = ['name', 'gender', 'contact', 'group'].filter(
      (field) => !(normalized as any)[field]
    );
    if (missingFields.length) {
      throw createError('Missing required member fields');
    }
    const newMember: MemberRecord = {
      _id: generateId('m'),
      ...normalized,
      membershipExpiresOn: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
    mockDb.members.unshift(newMember);
    return { ...newMember };
  },

  updateMember: async (id: string, payload: Partial<MemberRecord>) => {
    await delay();
    const memberIndex = mockDb.members.findIndex((item) => item._id === id);
    if (memberIndex === -1) {
      throw createError('Member not found', 404);
    }
    const updatedMember = {
      ...mockDb.members[memberIndex],
      ...normalizeMemberPayload(payload),
    };
    mockDb.members[memberIndex] = updatedMember;
    return { ...updatedMember };
  },

  deleteMember: async (id: string) => {
    await delay();
    const memberIndex = mockDb.members.findIndex((item) => item._id === id);
    if (memberIndex === -1) {
      throw createError('Member not found', 404);
    }
    mockDb.members.splice(memberIndex, 1);
    return { success: true };
  },

  getCollections: async () => {
    await delay();
    return mockDb.collections.map((record) => ({ ...record }));
  },

  addCollection: async (payload: Partial<CollectionRecord>) => {
    await delay();
    if (!payload.memberName?.trim() || typeof payload.amount !== 'number') {
      throw createError('Invalid collection payload');
    }
    const newCollection: CollectionRecord = {
      _id: generateId('c'),
      memberName: payload.memberName.trim(),
      amount: payload.amount,
      mode: payload.mode || 'cash',
      date: new Date().toISOString(),
    };
    mockDb.collections.unshift(newCollection);
    return { ...newCollection };
  },

  getExpenses: async () => {
    await delay();
    return mockDb.expenses.map((record) => ({ ...record }));
  },

  addExpense: async (payload: Partial<ExpenseRecord>) => {
    await delay();
    if (!payload.description?.trim() || typeof payload.amount !== 'number') {
      throw createError('Invalid expense payload');
    }
    const newExpense: ExpenseRecord = {
      _id: generateId('e'),
      description: payload.description.trim(),
      amount: payload.amount,
      category: payload.category || 'other',
      date: new Date().toISOString(),
    };
    mockDb.expenses.unshift(newExpense);
    return { ...newExpense };
  },

  getMenuItems: async (userRole?: string) => {
    await delay(100);
    return mockDb.menuItems
      .filter(item => !item.roles || !userRole || item.roles.includes(userRole))
      .map(item => ({ ...item }));
  },
};

