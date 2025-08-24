import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, CreateUserDto, LoginDto, AuthResponse } from '../types/auth.types';

@Injectable()
export class AuthService {
  private users: User[] = []; // In-memory storage for now

  constructor(private jwtService: JwtService) {}

  async signup(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const { username, email, password } = createUserDto;

    // Check if user already exists
    const existingUser = this.users.find(user => user.email === email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
    };

    this.users.push(newUser);

    // Generate JWT token
    const payload = { sub: newUser.id, email: newUser.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.users.find(user => user.id === userId) || null;
  }
}
