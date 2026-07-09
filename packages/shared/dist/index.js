"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCreateSchema = exports.NewsCreateSchema = exports.EventCreateSchema = exports.ComplaintResolveSchema = exports.ComplaintSubmitSchema = exports.ProfileUpdateSchema = exports.MemberRegisterSchema = exports.OtpVerifySchema = exports.OtpRequestSchema = exports.EmailLoginSchema = exports.UserRole = void 0;
const zod_1 = require("zod");
// Roles Enum
exports.UserRole = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    STATE_ADMIN: 'STATE_ADMIN',
    DISTRICT_ADMIN: 'DISTRICT_ADMIN',
    TALUKA_ADMIN: 'TALUKA_ADMIN',
    MEMBER: 'MEMBER'
};
// Authentication Schemas
exports.EmailLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
});
exports.OtpRequestSchema = zod_1.z.object({
    phone: zod_1.z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number (10 digits)')
});
exports.OtpVerifySchema = zod_1.z.object({
    phone: zod_1.z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number (10 digits)'),
    code: zod_1.z.string().length(6, 'OTP must be exactly 6 digits')
});
// Member Profile & Registration Schema
exports.MemberRegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    phone: zod_1.z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    districtId: zod_1.z.string().min(1, 'District is required'),
    talukaId: zod_1.z.string().min(1, 'Taluka is required'),
    booth: zod_1.z.string().optional(),
    bloodGroup: zod_1.z.string().min(1, 'Blood group is required'),
    occupation: zod_1.z.string().min(1, 'Occupation is required'),
    address: zod_1.z.string().min(5, 'Address must be at least 5 characters'),
    profilePhotoUrl: zod_1.z.string().optional(),
    facebookUrl: zod_1.z.string().url('Invalid Facebook URL').optional().or(zod_1.z.literal('')),
    twitterUrl: zod_1.z.string().url('Invalid Twitter URL').optional().or(zod_1.z.literal('')),
    instagramUrl: zod_1.z.string().url('Invalid Instagram URL').optional().or(zod_1.z.literal(''))
});
// Profile Update Schema
exports.ProfileUpdateSchema = exports.MemberRegisterSchema.partial().extend({
    id: zod_1.z.string()
});
// Complaint Schema
exports.ComplaintSubmitSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Title must be at least 5 characters'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    imageUrls: zod_1.z.array(zod_1.z.string()).default([])
});
exports.ComplaintResolveSchema = zod_1.z.object({
    status: zod_1.z.enum(['SUBMITTED', 'ASSIGNED', 'RESOLVED', 'CLOSED']),
    reply: zod_1.z.string().min(2, 'Resolution reply must be at least 2 characters')
});
// Event Schemas
exports.EventCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Title must be at least 5 characters'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
    location: zod_1.z.string().min(3, 'Location is required'),
    latitude: zod_1.z.number().min(-90).max(90).optional(),
    longitude: zod_1.z.number().min(-180).max(180).optional(),
    maxRegistrations: zod_1.z.number().int().positive().optional(),
    bannerUrl: zod_1.z.string().optional()
});
// News Schemas
exports.NewsCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Title must be at least 5 characters'),
    content: zod_1.z.string().min(20, 'Content must be at least 20 characters'),
    category: zod_1.z.string().min(2, 'Category is required'),
    imageUrl: zod_1.z.string().url('Invalid Image URL').optional().or(zod_1.z.literal('')),
    isTrending: zod_1.z.boolean().default(false),
    publishStatus: zod_1.z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
    publishAt: zod_1.z.string().optional()
});
// Notification Schema
exports.NotificationCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title is required'),
    body: zod_1.z.string().min(5, 'Body is required'),
    targetAudience: zod_1.z.enum(['ALL', 'MEMBERS', 'ADMINS', 'DISTRICT_ADMINS']).default('ALL'),
    districtId: zod_1.z.string().optional(),
    scheduleTime: zod_1.z.string().optional()
});
//# sourceMappingURL=index.js.map