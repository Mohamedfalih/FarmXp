// TEMP MOCK — replace with real axios calls once Spring Boot is ready.

const mockLogin = (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.identifier && credentials.password) {
        resolve({ token: 'mock-token', role: 'FARMER', farmerId: 'mock-1' });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
};

const mockRegister = (formData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (formData.name && formData.phone && formData.password) {
        resolve({ token: 'mock-token', role: 'FARMER', farmerId: 'mock-1' });
      } else {
        reject(new Error('Registration failed'));
      }
    }, 800);
  });
};

const authService = {
  login: mockLogin,
  register: mockRegister,
};

export default authService;