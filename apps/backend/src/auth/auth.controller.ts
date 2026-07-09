import { Controller, Post, Get, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { 
  EmailLoginSchema, 
  OtpRequestSchema, 
  OtpVerifySchema, 
  MemberRegisterSchema,
  EmailLoginInput,
  OtpRequestInput,
  OtpVerifyInput,
  MemberRegisterInput
} from '@yuvasena/shared';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new member' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input schema' })
  @ApiResponse({ status: 409, description: 'Email or Mobile number already in use' })
  async register(@Body(new ZodValidationPipe(MemberRegisterSchema)) body: MemberRegisterInput) {
    return this.authService.register(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful, returns JWT access token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials or suspended account' })
  async login(@Body(new ZodValidationPipe(EmailLoginSchema)) body: EmailLoginInput) {
    return this.authService.loginWithEmail(body);
  }

  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request OTP for mobile authentication' })
  @ApiResponse({ status: 200, description: 'OTP sent' })
  async requestOtp(@Body(new ZodValidationPipe(OtpRequestSchema)) body: OtpRequestInput) {
    return this.authService.requestOtp(body);
  }

  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify mobile OTP and authenticate' })
  @ApiResponse({ status: 200, description: 'Authentication successful or new user redirection code' })
  async verifyOtp(@Body(new ZodValidationPipe(OtpVerifySchema)) body: OtpVerifyInput) {
    return this.authService.verifyOtp(body);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve currently logged-in user profile' })
  @ApiResponse({ status: 200, description: 'Returns authenticated user information' })
  @ApiResponse({ status: 401, description: 'Unauthorized request' })
  async getMe(@Req() req: any) {
    return req.user;
  }
}

