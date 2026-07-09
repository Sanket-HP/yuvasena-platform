import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ConflictException } from '@nestjs/common';

// Mock Services
const mockPrismaService: any = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  member: {
    count: jest.fn(),
    create: jest.fn(),
  },
  $transaction: jest.fn((cb: any): any => cb(mockPrismaService)),
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(() => 'mock-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: typeof mockPrismaService;
  let redis: typeof mockRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    redis = module.get(RedisService);
    
    jest.clearAllMocks();
  });

  describe('requestOtp', () => {
    it('should store a 6-digit mock OTP code in Redis and return success', async () => {
      const input = { phone: '9876543210' };
      redis.set.mockResolvedValue(undefined);

      const result = await service.requestOtp(input);

      expect(result).toEqual({
        success: true,
        message: 'OTP sent successfully',
      });
      expect(redis.set).toHaveBeenCalledWith('otp:9876543210', '123456', 300);
    });
  });

  describe('verifyOtp', () => {
    it('should throw BadRequestException if OTP is not in Redis cache', async () => {
      redis.get.mockResolvedValue(null);

      await expect(
        service.verifyOtp({ phone: '9876543210', code: '123456' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if OTP code is incorrect', async () => {
      redis.get.mockResolvedValue('123456');

      await expect(
        service.verifyOtp({ phone: '9876543210', code: '999999' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should delete key and return redirection code if user does not exist', async () => {
      redis.get.mockResolvedValue('123456');
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.verifyOtp({ phone: '9876543210', code: '123456' });

      expect(redis.del).toHaveBeenCalledWith('otp:9876543210');
      expect(result).toEqual({
        isNewUser: true,
        phone: '9876543210',
        message: 'OTP verified. Profile creation required.',
      });
    });
  });

  describe('register', () => {
    it('should throw ConflictException if user already exists', async () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        password: 'password123',
        districtId: 'd1',
        talukaId: 't1',
        bloodGroup: 'O+',
        occupation: 'Student',
        address: '123 Street',
      };

      prisma.user.findFirst.mockResolvedValue({ id: 'existing-id' });

      await expect(service.register(input)).rejects.toThrow(ConflictException);
    });
  });
});
