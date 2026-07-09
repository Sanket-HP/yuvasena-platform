"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcrypt");
var client_1 = require("@prisma/client");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(prisma, jwtService) {
            this.prisma = prisma;
            this.jwtService = jwtService;
            // Temporary in-memory OTP cache (phone -> { otpCode, expiresAt })
            this.otpCache = new Map();
        }
        AuthService_1.prototype.register = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser, hashedPassword, user;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findFirst({
                                where: {
                                    OR: [
                                        { email: input.email },
                                        { phone: input.phone }
                                    ]
                                }
                            })];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser) {
                                throw new common_1.ConflictException('User with this email or mobile number already exists');
                            }
                            return [4 /*yield*/, bcrypt.hash(input.password, 10)];
                        case 2:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var newUser, count, paddedCount, membershipNo;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.user.create({
                                                    data: {
                                                        email: input.email,
                                                        phone: input.phone,
                                                        password: hashedPassword,
                                                        name: input.name,
                                                        role: client_1.Role.MEMBER
                                                    }
                                                })];
                                            case 1:
                                                newUser = _a.sent();
                                                return [4 /*yield*/, tx.member.count()];
                                            case 2:
                                                count = _a.sent();
                                                paddedCount = String(count + 1).padStart(4, '0');
                                                membershipNo = "YS-".concat(new Date().getFullYear(), "-").concat(paddedCount);
                                                return [4 /*yield*/, tx.member.create({
                                                        data: {
                                                            userId: newUser.id,
                                                            membershipNo: membershipNo,
                                                            status: 'PENDING',
                                                            bloodGroup: input.bloodGroup,
                                                            occupation: input.occupation,
                                                            address: input.address,
                                                            profilePhotoUrl: input.profilePhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=150&h=150&q=80',
                                                            facebookUrl: input.facebookUrl,
                                                            twitterUrl: input.twitterUrl,
                                                            instagramUrl: input.instagramUrl,
                                                            districtId: input.districtId,
                                                            talukaId: input.talukaId,
                                                            boothId: input.booth ? input.booth : undefined,
                                                            qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=".concat(membershipNo)
                                                        }
                                                    })];
                                            case 3:
                                                _a.sent();
                                                return [2 /*return*/, newUser];
                                        }
                                    });
                                }); })];
                        case 3:
                            user = _a.sent();
                            return [2 /*return*/, {
                                    userId: user.id,
                                    email: user.email,
                                    name: user.name,
                                    status: 'PENDING',
                                    message: 'Registration successful. Profile pending admin approval.'
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.loginWithEmail = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var user, isPasswordValid;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.user.findUnique({
                                where: { email: input.email },
                                include: { memberProfile: true }
                            })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                throw new common_1.UnauthorizedException('Invalid email or password');
                            }
                            // Check membership status if it is a standard member
                            if (user.role === client_1.Role.MEMBER && user.memberProfile && user.memberProfile.status === 'SUSPENDED') {
                                throw new common_1.UnauthorizedException('Your membership has been suspended. Please contact admin.');
                            }
                            return [4 /*yield*/, bcrypt.compare(input.password, user.password)];
                        case 2:
                            isPasswordValid = _a.sent();
                            if (!isPasswordValid) {
                                throw new common_1.UnauthorizedException('Invalid email or password');
                            }
                            return [2 /*return*/, this.generateTokenResponse(user)];
                    }
                });
            });
        };
        AuthService_1.prototype.requestOtp = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var phone, otpCode, expiresAt;
                return __generator(this, function (_a) {
                    phone = input.phone;
                    otpCode = '123456';
                    expiresAt = Date.now() + 5 * 60 * 1000;
                    this.otpCache.set(phone, { code: otpCode, expires: expiresAt });
                    console.log("[SMS OTP MOCK] Sent OTP ".concat(otpCode, " to ").concat(phone));
                    return [2 /*return*/, {
                            success: true,
                            message: 'OTP sent successfully',
                            debugOtp: otpCode // Returned in response for testing
                        }];
                });
            });
        };
        AuthService_1.prototype.verifyOtp = function (input) {
            return __awaiter(this, void 0, void 0, function () {
                var cached, user, tokens;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cached = this.otpCache.get(input.phone);
                            if (!cached) {
                                throw new common_1.BadRequestException('No OTP request found for this mobile number');
                            }
                            if (Date.now() > cached.expires) {
                                this.otpCache.delete(input.phone);
                                throw new common_1.BadRequestException('OTP has expired');
                            }
                            if (cached.code !== input.code) {
                                throw new common_1.BadRequestException('Incorrect OTP code');
                            }
                            // Clear OTP after successful verify
                            this.otpCache.delete(input.phone);
                            return [4 /*yield*/, this.prisma.user.findUnique({
                                    where: { phone: input.phone },
                                    include: { memberProfile: true }
                                })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                // If user does not exist, return a response signaling profile creation is required
                                return [2 /*return*/, {
                                        isNewUser: true,
                                        phone: input.phone,
                                        message: 'OTP verified. Profile creation required.'
                                    }];
                            }
                            if (user.role === client_1.Role.MEMBER && user.memberProfile && user.memberProfile.status === 'SUSPENDED') {
                                throw new common_1.UnauthorizedException('Your membership has been suspended. Please contact admin.');
                            }
                            return [4 /*yield*/, this.generateTokenResponse(user)];
                        case 2:
                            tokens = _a.sent();
                            return [2 /*return*/, __assign({ isNewUser: false }, tokens)];
                    }
                });
            });
        };
        AuthService_1.prototype.generateTokenResponse = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var payload;
                return __generator(this, function (_a) {
                    payload = {
                        sub: user.id,
                        email: user.email,
                        phone: user.phone,
                        role: user.role
                    };
                    return [2 /*return*/, {
                            accessToken: this.jwtService.sign(payload),
                            user: {
                                id: user.id,
                                email: user.email,
                                phone: user.phone,
                                name: user.name,
                                role: user.role,
                                memberProfile: user.memberProfile ? {
                                    id: user.memberProfile.id,
                                    membershipNo: user.memberProfile.membershipNo,
                                    status: user.memberProfile.status
                                } : null
                            }
                        }];
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
