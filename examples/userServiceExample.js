// Example of how to use the new database service in your controllers/services

import { dbRead, dbWrite, paginatedFind } from '../utils/dbHelper.js';
import User from '../models/User.js'; // Assuming you have a User model

class UserService {
  // Create new user (uses write connection - Primary)
  async createUser(userData) {
    return await dbWrite.create(User, userData);
  }

  // Update user (uses write connection - Primary)
  static async updateUser(userId, updateData) {
    return await dbWrite.updateById(User, userId, updateData);
  }

  // Delete user (uses write connection - Primary)
  static async deleteUser(userId) {
    return await dbWrite.deleteById(User, userId);
  }

  // Get user by ID (uses read connection - Secondary preferred)
  static async getUserById(userId) {
    return await dbRead.findById(User, userId);
  }

  // Get all users with pagination (uses read connection - Secondary preferred)
  async getAllUsers(query = {}, options = {}) {
    return await paginatedFind(User, query, options);
  }

  // Search users (uses read connection - Secondary preferred)
  static async searchUsers(searchTerm) {
    const query = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ],
    };
    return await dbRead.find(User, query);
  }

  // Get user statistics (uses read connection - Secondary preferred)
  static async getUserStats() {
    const pipeline = [
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ];
    return await dbRead.aggregate(User, pipeline);
  }
}

export default UserService;
