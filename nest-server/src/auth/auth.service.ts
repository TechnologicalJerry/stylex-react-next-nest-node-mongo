import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Status } from '../common/enums/status.enum';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    dto: LoginDto,
  ): Promise<{
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
    };
  }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.status !== Status.ACTIVE) {
      throw new UnauthorizedException('Account is inactive. Contact admin.');
    }

    const payload: JwtPayload = {
      sub: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    };
  }

  async signup(dto: SignupDto): Promise<{ message: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists.');
    }

    await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
    });

    return { message: 'Signup successful. You can now login.' };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('No account found for that email.');
    }

    // TODO: generate a reset token, persist it, and send the reset email
    return { message: 'Reset link sent. Please check your email.' };
  }

  async getMe(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
  }> {
    const user = await this.usersService.findById(userId);
    return {
      id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }
}
