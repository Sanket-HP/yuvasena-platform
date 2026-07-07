import { z } from 'zod';

// Roles Enum
export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  STATE_ADMIN: 'STATE_ADMIN',
  DISTRICT_ADMIN: 'DISTRICT_ADMIN',
  TALUKA_ADMIN: 'TALUKA_ADMIN',
  MEMBER: 'MEMBER'
} as const;

export type UserRoleType = keyof typeof UserRole;

// Authentication Schemas
export const EmailLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type EmailLoginInput = z.infer<typeof EmailLoginSchema>;

export const OtpRequestSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number (10 digits)')
});

export type OtpRequestInput = z.infer<typeof OtpRequestSchema>;

export const OtpVerifySchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number (10 digits)'),
  code: z.string().length(6, 'OTP must be exactly 6 digits')
});

export type OtpVerifyInput = z.infer<typeof OtpVerifySchema>;

// Member Profile & Registration Schema
export const MemberRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  districtId: z.string().min(1, 'District is required'),
  talukaId: z.string().min(1, 'Taluka is required'),
  booth: z.string().optional(),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  profilePhotoUrl: z.string().optional(),
  facebookUrl: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  twitterUrl: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  instagramUrl: z.string().url('Invalid Instagram URL').optional().or(z.literal(''))
});

export type MemberRegisterInput = z.infer<typeof MemberRegisterSchema>;

// Profile Update Schema
export const ProfileUpdateSchema = MemberRegisterSchema.partial().extend({
  id: z.string()
});

export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;

// Complaint Schema
export const ComplaintSubmitSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrls: z.array(z.string()).default([])
});

export type ComplaintSubmitInput = z.infer<typeof ComplaintSubmitSchema>;

export const ComplaintResolveSchema = z.object({
  status: z.enum(['SUBMITTED', 'ASSIGNED', 'RESOLVED', 'CLOSED']),
  reply: z.string().min(2, 'Resolution reply must be at least 2 characters')
});

export type ComplaintResolveInput = z.infer<typeof ComplaintResolveSchema>;

// Event Schemas
export const EventCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  location: z.string().min(3, 'Location is required'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  maxRegistrations: z.number().int().positive().optional(),
  bannerUrl: z.string().optional()
});

export type EventCreateInput = z.infer<typeof EventCreateSchema>;

// News Schemas
export const NewsCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.string().min(2, 'Category is required'),
  imageUrl: z.string().url('Invalid Image URL').optional().or(z.literal('')),
  isTrending: z.boolean().default(false),
  publishStatus: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  publishAt: z.string().optional()
});

export type NewsCreateInput = z.infer<typeof NewsCreateSchema>;

// Notification Schema
export const NotificationCreateSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  body: z.string().min(5, 'Body is required'),
  targetAudience: z.enum(['ALL', 'MEMBERS', 'ADMINS', 'DISTRICT_ADMINS']).default('ALL'),
  districtId: z.string().optional(),
  scheduleTime: z.string().optional()
});

export type NotificationCreateInput = z.infer<typeof NotificationCreateSchema>;

// Shared Interfaces for Responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
