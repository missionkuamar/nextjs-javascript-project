// Email validation
export const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password.length >= 6;
};

// Phone validation
export const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

// URL validation
export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate product data
export const validateProduct = (data) => {
  const errors = {};
  
  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  
  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  
  if (!data.category) {
    errors.category = 'Category is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};