import express from "express";
import request from "supertest";
import * as authService from '../../src/services/authservice';
import * as emailService from '../../src/services/emailservice';
import bcrypt from 'bcryptjs';
import {authRoute} from '../../src/routes/authroute';

const app = express();
app.use(express.json());
app.use('/auth', authRoute)

export default app;

jest.mock('../../src/services/authservice');
jest.mock('../../src/services/emailservice');

describe('Auth Controller Integration Tests', () => {
  const mockUser = {
    user_id: 1,
    firstname: 'jess',
    lastname: 'maina',
    email: 'mainajess23@gmail.com',
    password: bcrypt.hashSync('jest@254', 10),
    role: 'user',
    is_verified: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register user and send verification code', async () => {
      (authService.createAuthService as jest.Mock).mockResolvedValueOnce(mockUser);
      (emailService.emailService.sendVerificationCode as jest.Mock).mockResolvedValueOnce(true);

      const res = await request(app).post('/auth/register').send({
        firstname: 'jess',
        lastname:'maina',
        email: 'mainajess23@gmail.com',
        password: 'jest@254',
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toContain('Registration successful');
      expect(res.body.user).toHaveProperty('email', mockUser.email);
    });

    it('should return 400 if user creation fails', async () => {
      (authService.createAuthService as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app).post('/auth/register').send({
        firstname: 'jess',
        lastname:'maina',
        email: 'fail@example.com',
        password: 'Test@1234',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/User creation failed/);
    });
  });

  describe('POST /auth/login', () => {
    it('should return JWT token if user is verified and credentials are valid', async () => {
      const verifiedUser = { ...mockUser, is_verified: true };

      (authService.loginAuthService as jest.Mock).mockResolvedValueOnce(verifiedUser);

      const res = await request(app).post('/auth/login').send({
       email: 'mainajess23@gmail.com',
        password: 'jest@254',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(verifiedUser.email);
    });

    it('should return 403 if user is not verified and send new code', async () => {
      (authService.loginAuthService as jest.Mock).mockResolvedValueOnce(mockUser);
      (emailService.emailService.sendVerificationCode as jest.Mock).mockResolvedValueOnce(true);

      const res = await request(app).post('/auth/login').send({
        email: 'mainajess23@gmail.com',
        password: 'jest@254',
      });

      expect(res.status).toBe(403);
      expect(res.body.isVerified).toBe(false);
    });

    it('should return 401 for wrong password', async () => {
      const userWithWrongPass = { ...mockUser, password: bcrypt.hashSync('Wrong@123', 10) };
      (authService.loginAuthService as jest.Mock).mockResolvedValueOnce(userWithWrongPass);

      const res = await request(app).post('/auth/login').send({
        email: 'mainajess23@gmail.com',
        password: 'WrongPassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('should return 404 if user not found', async () => {
      (authService.loginAuthService as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app).post('/auth/login').send({
        email: 'notfound@example.com',
        password: 'Test@1234',
      });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/User not found/);
    });
  });

  describe('POST /auth/verify-email', () => {
    it('should verify user if code is correct', async () => {
      // Simulate code generation and storage
      const email = 'janedoe@example.com';
      const code = '123456';

      const { verificationCodes } = jest.requireActual('../../src/controllers/authcontroller');
      verificationCodes.set(email, { code, expires: new Date(Date.now() + 1000 * 60 * 10) });

      (authService.updateVerificationStatus as jest.Mock).mockResolvedValueOnce(true);

      const res = await request(app).post('/auth/verify-email').send({ email, code });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Email verified');
    });

    it('should return 400 for invalid code', async () => {
      const email = 'janedoe@example.com';
      const wrongCode = '999999';

      const { verificationCodes } = jest.requireActual('../../src/controllers/authcontroller');
      verificationCodes.set(email, { code: '123456', expires: new Date(Date.now() + 1000 * 60 * 10) });

      const res = await request(app).post('/auth/verify-email').send({ email, code: wrongCode });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Invalid or expired verification code');
    });
  });
});
