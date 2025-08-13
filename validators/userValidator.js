import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'string.empty': 'Password is required'
  }),
  role: Joi.string().valid('user', 'admin').default('user')
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  email: Joi.string().email(),
  role: Joi.string().valid('user', 'admin'),
  isActive: Joi.boolean()
}).min(1);

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});