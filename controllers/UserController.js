import { UserService } from '../services/UserService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  register = asyncHandler(async (req, res) => {
    const user = await this.userService.createUser(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, user, 'User registered successfully'));
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await this.userService.loginUser(email, password);
    res.status(200).json(new ApiResponse(200, result, 'Login successful'));
  });

  getProfile = asyncHandler(async (req, res) => {
    const user = await this.userService.getUserById(req.user.userId);
    res
      .status(200)
      .json(new ApiResponse(200, user, 'Profile retrieved successfully'));
  });

  updateProfile = asyncHandler(async (req, res) => {
    const user = await this.userService.updateUser(req.user.userId, req.body);
    res
      .status(200)
      .json(new ApiResponse(200, user, 'Profile updated successfully'));
  });

  deleteAccount = asyncHandler(async (req, res) => {
    const result = await this.userService.deleteUser(req.user.userId);
    res
      .status(200)
      .json(new ApiResponse(200, result, 'Account deleted successfully'));
  });
}
