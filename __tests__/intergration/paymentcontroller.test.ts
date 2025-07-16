import express from 'express';
import {paymentRoute } from '../../src/routes/paymentsroute';
import request from 'supertest';
import * as paymentService from '../../src/services/paymentsservice';

const app = express();
app.use(express.json());
paymentRoute(app);
export default app;

jest.mock('../../src/services/paymentsservice');

describe('Payment Controller Integration Tests', () => {
  const mockPayment = {
    payment_id: 1,
    booking_id:2,
    amount: 600.00,
    payment_method: 'mpesa',
    payment_status: 'Confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /payments', () => {
    it('should create a payment', async () => {
      (paymentService.createPaymentService as jest.Mock).mockResolvedValue(mockPayment);

      const res = await request(app)
        .post('/payments')
        .send(mockPayment);

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/created successfully/i);
      expect(res.body.payment).toEqual(mockPayment);
    });

    it('should return 400 if creation fails', async () => {
      (paymentService.createPaymentService as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post('/payments')
        .send(mockPayment);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Payment creation failed');
    });
  });

  describe('GET /payments', () => {
    it('should return all payments', async () => {
      (paymentService.getAllPaymentsService as jest.Mock).mockResolvedValue([mockPayment]);

      const res = await request(app).get('/payments');

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/retrieved successfully/i);
      expect(res.body.payments).toEqual([mockPayment]);
    });

    it('should return 404 if no payments found', async () => {
      (paymentService.getAllPaymentsService as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get('/payments');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('No payments found');
    });
  });

  describe('GET /payments/:id', () => {
    it('should return payment by ID', async () => {
      (paymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(mockPayment);

      const res = await request(app).get('/payments/1');

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/found successfully/i);
      expect(res.body.payment).toEqual(mockPayment);
    });

    it('should return 404 if payment not found', async () => {
      (paymentService.getPaymentByIdService as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/payments/999');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Payment not found');
    });
  });
});
