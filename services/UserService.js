import { UserRepository } from '../repositories/UserRepository.js';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dto/UserDto.js';
import { AppError } from '../utils/AppError.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    const createUserDto = new CreateUserDto(userData);
    const user = await this.userRepository.create(createUserDto);
    return new UserResponseDto(user);
  }

  async loginUser(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn || '7d' }
    );

    return {
      user: new UserResponseDto(user),
      token
    };
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return new UserResponseDto(user);
  }

  async updateUser(id, updateData) {
    const user = await this.userRepository.update(id, new UpdateUserDto(updateData));
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return new UserResponseDto(user);
  }

  async deleteUser(id) {
    const user = await this.userRepository.delete(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return { message: 'User deleted successfully' };
  }
}