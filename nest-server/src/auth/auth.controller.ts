import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from './strategies/jwt.strategy';

const COOKIE_MAX_AGE_MS = 8 * 60 * 60 * 1000; // 8 hours

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and receive a JWT access token' })
  @ApiResponse({ status: 200, description: 'Login successful, JWT set in cookie.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or inactive account.' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    // HttpOnly JWT for API authentication
    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
    });

    // Non-HttpOnly cookies read by the Next.js middleware for route protection
    res.cookie('app_session', '1', {
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
    });
    res.cookie('app_role', result.user.role, {
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
    });
    res.cookie('app_status', result.user.status, {
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
    });

    return result;
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'Account created.' })
  @ApiResponse({ status: 409, description: 'Email already exists.' })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset link' })
  @ApiResponse({ status: 200, description: 'Reset link sent.' })
  @ApiResponse({ status: 404, description: 'No account found for that email.' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and clear session cookies' })
  @ApiResponse({ status: 200, description: 'Logged out.' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('app_session');
    res.clearCookie('app_role');
    res.clearCookie('app_status');
    return { message: 'Logged out successfully.' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user profile.' })
  @ApiResponse({ status: 401, description: 'Not authenticated.' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.authService.getMe(user.sub);
  }
}
