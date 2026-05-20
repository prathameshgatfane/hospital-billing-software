import Joi from 'joi';
import mongoose from 'mongoose';

/**
 * Validate patient registration/update data
 * @param {Object} data - Patient data to validate
 * @param {boolean} isUpdate - Whether this is an update (some fields optional)
 * @returns {Array} - Array of validation errors, empty if valid
 */
export const validatePatientData = (data, isUpdate = false) => {
  const errors = [];

  // Define validation schema based on operation type
  const schema = isUpdate ? updateSchema : registrationSchema;
  
  const { error } = schema.validate(data, { 
    abortEarly: false,
    allowUnknown: true // Allow extra fields that aren't in schema
  });

  if (error) {
    errors.push(...error.details.map(detail => detail.message));
  }

  // Additional custom validations
  if (data.dateOfBirth) {
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    
    if (dob > today) {
      errors.push('Date of birth cannot be in the future');
    }
    
    if (age > 150) {
      errors.push('Age cannot be more than 150 years');
    }
  }

  if (data.mobile) {
    const mobileRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
    if (!mobileRegex.test(data.mobile)) {
      errors.push('Mobile number must be 10-15 digits and can include +, -, (, ), and spaces');
    }
  }

  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
  }

  if (data.bloodGroup) {
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodGroups.includes(data.bloodGroup.toUpperCase())) {
      errors.push(`Blood group must be one of: ${validBloodGroups.join(', ')}`);
    }
  }

  if (data.height) {
    const height = parseFloat(data.height);
    if (height < 30 || height > 250) {
      errors.push('Height must be between 30cm and 250cm');
    }
  }

  if (data.weight) {
    const weight = parseFloat(data.weight);
    if (weight < 1 || weight > 300) {
      errors.push('Weight must be between 1kg and 300kg');
    }
  }

  if (data.emergencyContact) {
    if (typeof data.emergencyContact === 'object') {
      if (data.emergencyContact.mobile) {
        const mobileRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
        if (!mobileRegex.test(data.emergencyContact.mobile)) {
          errors.push('Emergency contact mobile must be 10-15 digits');
        }
      }
    }
  }

  return errors;
};

// Joi schemas for validation
const registrationSchema = Joi.object({
  // Required fields
  firstName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-z\s\-']+$/)
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes'
    }),

  lastName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-z\s\-']+$/)
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes'
    }),

  dateOfBirth: Joi.date()
    .required()
    .max('now')
    .messages({
      'date.base': 'Valid date of birth is required',
      'date.max': 'Date of birth cannot be in the future'
    }),

  gender: Joi.string()
    .required()
    .valid('Male', 'Female', 'Other')
    .messages({
      'any.only': 'Gender must be Male, Female, or Other'
    }),

  // Optional but validated if provided
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .max(100)
    .allow('', null)
    .messages({
      'string.email': 'Invalid email format',
      'string.max': 'Email cannot exceed 100 characters'
    }),

  mobile: Joi.string()
    .pattern(/^[+]?[0-9\s\-\(\)]{10,15}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Mobile number must be 10-15 digits and can include +, -, (, ), and spaces'
    }),

  // Address information
  address: Joi.object({
    addressLine1: Joi.string().max(100).allow('', null),
    addressLine2: Joi.string().max(100).allow('', null),
    city: Joi.string().max(50).allow('', null),
    state: Joi.string().max(50).allow('', null),
    pincode: Joi.string().max(20).allow('', null),
    country: Joi.string().max(50).allow('', null)
  }).optional(),

  // Emergency contact
  emergencyContact: Joi.object({
    name: Joi.string().max(100).allow('', null),
    relation: Joi.string().max(50).allow('', null),
    mobile: Joi.string()
      .pattern(/^[+]?[0-9\s\-\(\)]{10,15}$/)
      .allow('', null)
      .messages({
        'string.pattern.base': 'Emergency contact phone must be 10-15 digits'
      }),
    email: Joi.string().email().lowercase().max(100).allow('', null)
  }).optional(),

  // Medical information
  chronicConditions: Joi.string().max(1000).allow('', null),
  knownAllergies: Joi.array().items(Joi.string().max(100)).optional(),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown')
    .uppercase()
    .allow('', null)
    .messages({
      'any.only': 'Invalid blood group'
    }),

  // Physical measurements
  height: Joi.number()
    .min(30)
    .max(250)
    .allow('', null)
    .messages({
      'number.min': 'Height must be at least 30cm',
      'number.max': 'Height cannot exceed 250cm'
    }),

  weight: Joi.number()
    .min(1)
    .max(300)
    .allow('', null)
    .messages({
      'number.min': 'Weight must be at least 1kg',
      'number.max': 'Weight cannot exceed 300kg'
    }),

  // Billing/Insurance information
  billingDetails: Joi.object({
    isInsured: Joi.boolean().default(false),
    insuranceProvider: Joi.string().max(100).allow('', null),
    policyNumber: Joi.string().max(50).allow('', null),
    policyHolder: Joi.string().max(100).allow('', null),
    validTill: Joi.date().allow('', null),
  }).optional(),

  // Additional notes
  notes: Joi.string().max(2000).allow('', null),

  // Status (for updates)
  status: Joi.string()
    .valid('Active', 'Inactive', 'Deceased', 'Transferred')
    .default('Active')
    .messages({
      'any.only': 'Status must be Active, Inactive, Deceased, or Transferred'
    })
});

// Update schema (all fields optional, but validated if provided)
const updateSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-z\s\-']+$/)
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'string.pattern.base': 'First name can only contain letters, spaces, hyphens, and apostrophes'
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[A-Za-z\s\-']+$/)
    .messages({
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name cannot exceed 50 characters',
      'string.pattern.base': 'Last name can only contain letters, spaces, hyphens, and apostrophes'
    }),

  dateOfBirth: Joi.date()
    .max('now')
    .messages({
      'date.base': 'Valid date is required',
      'date.max': 'Date of birth cannot be in the future'
    }),

  gender: Joi.string()
    .valid('Male', 'Female', 'Other')
    .messages({
      'any.only': 'Gender must be Male, Female, or Other'
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .max(100)
    .allow('', null)
    .messages({
      'string.email': 'Invalid email format',
      'string.max': 'Email cannot exceed 100 characters'
    }),

  mobile: Joi.string()
    .pattern(/^[+]?[0-9\s\-\(\)]{10,15}$/)
    .allow('', null)
    .messages({
      'string.pattern.base': 'Mobile number must be 10-15 digits and can include +, -, (, ), and spaces'
    }),

  address: Joi.object({
    addressLine1: Joi.string().max(100).allow('', null),
    addressLine2: Joi.string().max(100).allow('', null),
    city: Joi.string().max(50).allow('', null),
    state: Joi.string().max(50).allow('', null),
    pincode: Joi.string().max(20).allow('', null),
    country: Joi.string().max(50).allow('', null)
  }).optional(),

  emergencyContact: Joi.object({
    name: Joi.string().max(100).allow('', null),
    relation: Joi.string().max(50).allow('', null),
    mobile: Joi.string()
      .pattern(/^[+]?[0-9\s\-\(\)]{10,15}$/)
      .allow('', null)
      .messages({
        'string.pattern.base': 'Emergency contact phone must be 10-15 digits'
      }),
    email: Joi.string().email().lowercase().max(100).allow('', null)
  }).optional(),

  medicalHistory: Joi.string().max(1000).allow('', null),
  allergies: Joi.array().items(Joi.string().max(100)).optional(),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .uppercase()
    .allow('', null)
    .messages({
      'any.only': 'Invalid blood group'
    }),

  height: Joi.number()
    .min(30)
    .max(250)
    .allow('', null)
    .messages({
      'number.min': 'Height must be at least 30cm',
      'number.max': 'Height cannot exceed 250cm'
    }),

  weight: Joi.number()
    .min(1)
    .max(300)
    .allow('', null)
    .messages({
      'number.min': 'Weight must be at least 1kg',
      'number.max': 'Weight cannot exceed 300kg'
    }),

  billingDetails: Joi.object({
    isInsured: Joi.boolean(),
    insuranceProvider: Joi.string().max(100).allow('', null),
    policyNumber: Joi.string().max(50).allow('', null),
    policyHolder: Joi.string().max(100).allow('', null),
    validTill: Joi.date().allow('', null),
  }).optional(),

  notes: Joi.string().max(2000).allow('', null),

  status: Joi.string()
    .valid('Active', 'Inactive', 'Deceased', 'Transferred')
    .messages({
      'any.only': 'Status must be Active, Inactive, Deceased, or Transferred'
    })
});

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} - True if valid
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate mobile number format
 * @param {string} mobile - Mobile number to validate
 * @returns {boolean} - True if valid
 */
export const validateMobile = (mobile) => {
  const mobileRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
  return mobileRegex.test(mobile);
};

/**
 * Validate date format and range
 * @param {string} dateString - Date string to validate
 * @param {Object} options - Validation options
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateDate = (dateString, options = {}) => {
  const { minDate, maxDate = new Date() } = options;
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  if (minDate && date < new Date(minDate)) {
    return { isValid: false, error: `Date cannot be before ${minDate}` };
  }
  
  if (maxDate && date > new Date(maxDate)) {
    return { isValid: false, error: `Date cannot be after ${maxDate}` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate numeric range
 * @param {number} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateNumberRange = (value, options = {}) => {
  const { min, max, fieldName = 'Value' } = options;
  
  if (isNaN(value)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }
  
  if (min !== undefined && value < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && value > max) {
    return { isValid: false, error: `${fieldName} cannot exceed ${max}` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Sanitize patient data (remove extra spaces, trim strings)
 * @param {Object} data - Patient data to sanitize
 * @returns {Object} - Sanitized data
 */
export const sanitizePatientData = (data) => {
  const sanitized = { ...data };
  
  // Trim string fields
  const stringFields = [
    'firstName', 'lastName', 'email', 'mobile', 'chronicConditions',
    'bloodGroup', 'notes'
  ];
  
  stringFields.forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitized[field].trim();
    }
  });
  
  // Sanitize address
  if (sanitized.address && typeof sanitized.address === 'object') {
    Object.keys(sanitized.address).forEach(key => {
      if (typeof sanitized.address[key] === 'string') {
        sanitized.address[key] = sanitized.address[key].trim();
      }
    });
  }
  
  // Sanitize emergency contact
  if (sanitized.emergencyContact && typeof sanitized.emergencyContact === 'object') {
    Object.keys(sanitized.emergencyContact).forEach(key => {
      if (typeof sanitized.emergencyContact[key] === 'string') {
        sanitized.emergencyContact[key] = sanitized.emergencyContact[key].trim();
      }
    });
  }
  
  // Sanitize billing details
  if (sanitized.billingDetails && typeof sanitized.billingDetails === 'object') {
    Object.keys(sanitized.billingDetails).forEach(key => {
      if (typeof sanitized.billingDetails[key] === 'string') {
        sanitized.billingDetails[key] = sanitized.billingDetails[key].trim();
      }
    });
  }
  
  // Sanitize allergies array
  if (Array.isArray(sanitized.allergies)) {
    sanitized.allergies = sanitized.allergies
      .map(allergy => typeof allergy === 'string' ? allergy.trim() : allergy)
      .filter(allergy => allergy && allergy.length > 0);
  }
  
  // Convert email to lowercase
  if (sanitized.email) {
    sanitized.email = sanitized.email.toLowerCase();
  }
  
  return sanitized;
};