// Mock users for testing without a database
const mockUsers = [
  {
    _id: '1',
    name: 'HR Manager',
    email: 'hr@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // 'password123'
    role: 'hr',
    department: 'HR',
    position: 'HR Manager'
  },
  {
    _id: '2',
    name: 'Test Employee',
    email: 'employee@example.com',
    password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // 'password123'
    role: 'employee',
    department: 'IT',
    position: 'Developer'
  }
];

// Mock user methods
const mockUserMethods = {
  findOne: (query) => {
    if (query.email) {
      return mockUsers.find(user => user.email === query.email);
    }
    if (query._id) {
      return mockUsers.find(user => user._id === query._id);
    }
    return null;
  },
  
  create: (userData) => {
    const newUser = {
      _id: String(mockUsers.length + 1),
      ...userData,
      getSignedJwtToken: () => 'mock-jwt-token',
      matchPassword: async (password) => password === 'password123'
    };
    mockUsers.push(newUser);
    return newUser;
  },
  
  findById: (id) => {
    return mockUsers.find(user => user._id === id);
  }
};

// Mock JWT methods
const mockJwt = {
  sign: (payload, secret, options) => {
    return 'mock-jwt-token';
  },
  verify: (token, secret) => {
    return { id: '1', role: 'hr' }; // Default to HR user
  }
};

// Mock bcrypt methods
const mockBcrypt = {
  genSalt: async () => 'mock-salt',
  hash: async (password, salt) => '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC',
  compare: async (password, hash) => password === 'password123'
};

module.exports = {
  mockUsers,
  mockUserMethods,
  mockJwt,
  mockBcrypt
};
