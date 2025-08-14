export class CreateUserDto {
  constructor({ name, email, password, role = 'user' }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}

export class UpdateUserDto {
  constructor({ name, email, role, isActive }) {
    if (name !== undefined) this.name = name;
    if (email !== undefined) this.email = email;
    if (role !== undefined) this.role = role;
    if (isActive !== undefined) this.isActive = isActive;
  }
}

export class UserResponseDto {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
