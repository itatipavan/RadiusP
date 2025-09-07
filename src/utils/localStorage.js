// LocalStorage utility functions for OverSeas CRM

const STORAGE_KEYS = {
  USERS: 'overseas_users',
  STUDENTS: 'overseas_students',
  UNIVERSITIES: 'overseas_universities',
  APPLICATIONS: 'overseas_applications',
  EMPLOYEES: 'overseas_employees',
  CURRENT_USER: 'overseas_current_user',
  APP_INITIALIZED: 'overseas_initialized',
  SCHEMA_VERSION: 'overseas_schema_version',
  PAY_DETAILS: 'overseas_pay_details',
  PAY_SHEETS: 'overseas_pay_sheets',
  PAYMENTS: 'overseas_payments',
  AUDIT_LOGS: 'overseas_audit_logs'
};

// Generic localStorage functions
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} to localStorage:`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

// User management
export const userStorage = {
  getUsers: () => storage.get(STORAGE_KEYS.USERS) || [],
  setUsers: (users) => storage.set(STORAGE_KEYS.USERS, users),
  addUser: (user) => {
    const users = userStorage.getUsers();
    users.push(user);
    return userStorage.setUsers(users);
  },
  updateUser: (userId, updatedUser) => {
    const users = userStorage.getUsers();
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      return userStorage.setUsers(users);
    }
    return false;
  },
  deleteUser: (userId) => {
    const users = userStorage.getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    return userStorage.setUsers(filteredUsers);
  },
  getCurrentUser: () => storage.get(STORAGE_KEYS.CURRENT_USER),
  setCurrentUser: (user) => storage.set(STORAGE_KEYS.CURRENT_USER, user),
  clearCurrentUser: () => storage.remove(STORAGE_KEYS.CURRENT_USER)
};

// Student management
export const studentStorage = {
  getStudents: () => storage.get(STORAGE_KEYS.STUDENTS) || [],
  setStudents: (students) => storage.set(STORAGE_KEYS.STUDENTS, students),
  addStudent: (student) => {
    const students = studentStorage.getStudents();
    student.id = Date.now().toString();
    student.createdAt = new Date().toISOString();
    student.updatedAt = new Date().toISOString();
    students.push(student);
    return studentStorage.setStudents(students);
  },
  updateStudent: (studentId, updatedStudent) => {
    const students = studentStorage.getStudents();
    const index = students.findIndex(student => student.id === studentId);
    if (index !== -1) {
      students[index] = { 
        ...students[index], 
        ...updatedStudent, 
        updatedAt: new Date().toISOString() 
      };
      return studentStorage.setStudents(students);
    }
    return false;
  },
  deleteStudent: (studentId) => {
    const students = studentStorage.getStudents();
    const filteredStudents = students.filter(student => student.id !== studentId);
    return studentStorage.setStudents(filteredStudents);
  },
  getStudentById: (studentId) => {
    const students = studentStorage.getStudents();
    return students.find(student => student.id === studentId);
  }
};

// University management
export const universityStorage = {
  getUniversities: () => storage.get(STORAGE_KEYS.UNIVERSITIES) || [],
  setUniversities: (universities) => storage.set(STORAGE_KEYS.UNIVERSITIES, universities),
  addUniversity: (university) => {
    const universities = universityStorage.getUniversities();
    university.id = Date.now().toString();
    university.createdAt = new Date().toISOString();
    university.updatedAt = new Date().toISOString();
    universities.push(university);
    return universityStorage.setUniversities(universities);
  },
  updateUniversity: (universityId, updatedUniversity) => {
    const universities = universityStorage.getUniversities();
    const index = universities.findIndex(university => university.id === universityId);
    if (index !== -1) {
      universities[index] = { 
        ...universities[index], 
        ...updatedUniversity, 
        updatedAt: new Date().toISOString() 
      };
      return universityStorage.setUniversities(universities);
    }
    return false;
  },
  deleteUniversity: (universityId) => {
    const universities = universityStorage.getUniversities();
    const filteredUniversities = universities.filter(university => university.id !== universityId);
    return universityStorage.setUniversities(filteredUniversities);
  }
};

// Application management
export const applicationStorage = {
  getApplications: () => storage.get(STORAGE_KEYS.APPLICATIONS) || [],
  setApplications: (applications) => storage.set(STORAGE_KEYS.APPLICATIONS, applications),
  addApplication: (application) => {
    const applications = applicationStorage.getApplications();
    application.id = Date.now().toString();
    application.createdAt = new Date().toISOString();
    application.updatedAt = new Date().toISOString();
    applications.push(application);
    return applicationStorage.setApplications(applications);
  },
  updateApplication: (applicationId, updatedApplication) => {
    const applications = applicationStorage.getApplications();
    const index = applications.findIndex(app => app.id === applicationId);
    if (index !== -1) {
      applications[index] = { 
        ...applications[index], 
        ...updatedApplication, 
        updatedAt: new Date().toISOString() 
      };
      return applicationStorage.setApplications(applications);
    }
    return false;
  },
  deleteApplication: (applicationId) => {
    const applications = applicationStorage.getApplications();
    const filteredApplications = applications.filter(app => app.id !== applicationId);
    return applicationStorage.setApplications(filteredApplications);
  }
};

// Employee management
export const employeeStorage = {
  getEmployees: () => storage.get(STORAGE_KEYS.EMPLOYEES) || [],
  setEmployees: (employees) => storage.set(STORAGE_KEYS.EMPLOYEES, employees),
  addEmployee: (employee) => {
    const employees = employeeStorage.getEmployees();
    employee.id = Date.now().toString();
    employee.createdAt = new Date().toISOString();
    employee.updatedAt = new Date().toISOString();
    employees.push(employee);
    return employeeStorage.setEmployees(employees);
  },
  updateEmployee: (employeeId, updatedEmployee) => {
    const employees = employeeStorage.getEmployees();
    const index = employees.findIndex(emp => emp.id === employeeId);
    if (index !== -1) {
      employees[index] = { 
        ...employees[index], 
        ...updatedEmployee, 
        updatedAt: new Date().toISOString() 
      };
      return employeeStorage.setEmployees(employees);
    }
    return false;
  },
  deleteEmployee: (employeeId) => {
    const employees = employeeStorage.getEmployees();
    const filteredEmployees = employees.filter(emp => emp.id !== employeeId);
    return employeeStorage.setEmployees(filteredEmployees);
  }
};

// Finance: student payments
export const paymentStorage = {
  getPayments: () => storage.get(STORAGE_KEYS.PAYMENTS) || {},
  setPayments: (map) => storage.set(STORAGE_KEYS.PAYMENTS, map),
  getByStudentId: (studentId) => {
    const map = paymentStorage.getPayments();
    return map[studentId] || [];
  },
  addPayment: (studentId, payment) => {
    const map = paymentStorage.getPayments();
    const list = map[studentId] || [];
    const item = {
      id: Date.now().toString(),
      status: 'due',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payment
    };
    map[studentId] = [...list, item];
    return paymentStorage.setPayments(map);
  },
  updatePayment: (studentId, paymentId, patch) => {
    const map = paymentStorage.getPayments();
    const list = map[studentId] || [];
    const idx = list.findIndex(p => p.id === paymentId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
      map[studentId] = list;
      return paymentStorage.setPayments(map);
    }
    return false;
  }
};

// HRM: pay details
export const payDetailsStorage = {
  getAll: () => storage.get(STORAGE_KEYS.PAY_DETAILS) || [],
  setAll: (list) => storage.set(STORAGE_KEYS.PAY_DETAILS, list),
  upsert: (employeeKey, details) => {
    const list = payDetailsStorage.getAll();
    const idx = list.findIndex(x => x.employeeKey === employeeKey);
    const item = {
      employeeKey,
      base: 0,
      allowances: 0,
      deductions: 0,
      effectiveFrom: new Date().toISOString(),
      ...details
    };
    if (idx === -1) list.push(item); else list[idx] = item;
    return payDetailsStorage.setAll(list);
  },
  getByEmployeeKey: (employeeKey) => {
    return payDetailsStorage.getAll().find(x => x.employeeKey === employeeKey) || null;
  }
};

// HRM: pay sheets
export const paySheetStorage = {
  getAll: () => storage.get(STORAGE_KEYS.PAY_SHEETS) || [],
  setAll: (list) => storage.set(STORAGE_KEYS.PAY_SHEETS, list),
  add: (sheet) => {
    const list = paySheetStorage.getAll();
    const item = { id: Date.now().toString(), createdAt: new Date().toISOString(), status: 'draft', ...sheet };
    list.push(item);
    return paySheetStorage.setAll(list);
  },
  update: (id, patch) => {
    const list = paySheetStorage.getAll();
    const idx = list.findIndex(x => x.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
      return paySheetStorage.setAll(list);
    }
    return false;
  }
};

// Audit trail
export const auditStorage = {
  getAll: () => storage.get(STORAGE_KEYS.AUDIT_LOGS) || [],
  setAll: (list) => storage.set(STORAGE_KEYS.AUDIT_LOGS, list),
  add: (entry) => {
    const list = auditStorage.getAll();
    list.push({ id: Date.now().toString(), timestamp: new Date().toISOString(), ...entry });
    return auditStorage.setAll(list);
  }
};

// App initialization
export const appStorage = {
  isInitialized: () => storage.get(STORAGE_KEYS.APP_INITIALIZED) || false,
  setInitialized: () => storage.set(STORAGE_KEYS.APP_INITIALIZED, true),
  reset: () => {
    storage.clear();
    return true;
  }
};

// Export storage keys for reference
export { STORAGE_KEYS };
