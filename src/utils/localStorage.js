// LocalStorage utility functions for RadiusF CRM

const STORAGE_KEYS = {
  USERS: 'radiusf_users',
  STUDENTS: 'radiusf_students',
  UNIVERSITIES: 'radiusf_universities',
  APPLICATIONS: 'radiusf_applications',
  EMPLOYEES: 'radiusf_employees',
  CURRENT_USER: 'radiusf_current_user',
  APP_INITIALIZED: 'radiusf_initialized'
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
