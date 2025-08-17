import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validation.js';
import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
} from '../validators/userValidator.js';

const router = express.Router();
const userController = new UserController();

// router.post('/create', userController.create);
// router.get('/allUsers', userController.getAllUsers);
// Public routes
router.post('/register', validate(createUserSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/profile', userController.getProfile);
router.put(
  '/profile',
  validate(updateUserSchema),
  userController.updateProfile,
);
router.delete('/account', userController.deleteAccount);

export default router;
