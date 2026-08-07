// TEMP MOCK — replace with real axios calls once Spring Boot is ready.
// Signatures stay the same so pages never need to change when swapped.

const mockLogin = ({ identifier, password, role }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!identifier || !password) {
        reject(new Error('Invalid credentials'));
        return;
      }
      resolve({
        token: 'mock-token',
        role,
        farmerId: role === 'FARMER' ? 'mock-1' : null,
      });
    }, 800);
  });
};

const mockRegister = (formData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (formData.name && formData.phone && formData.email && formData.password) {
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