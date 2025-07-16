import express from 'express';
import{ bookingRoute} from '../../src/routes/bookingsroute';
import request from 'supertest';
import * as bookingService from '../../src/services/bookingsservice';

const app = express();
app.use(express.json());
bookingRoute(app);

export default app;

jest.mock('../../src/services/bookingsservice');

describe('Booking Controller Integration Tests', () => {
  const mockBooking = {
    booking_id: 1,
    user_id: 1,
    room_id: 2,
    check_in_date: '2025-07-20',
    check_out_date: '2025-07-22',
    totalamount: 300,
    booking_status: 'Confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /bookings', () => {
    it('should create a booking', async () => {
      (bookingService.createBookingService as jest.Mock).mockResolvedValue([mockBooking]);

      const res = await request(app).post('/bookings').send(mockBooking);

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/created successfully/i);
      expect(res.body.booking).toEqual(mockBooking);
    }, 10000);

    it('should return 400 if creation fails', async () => {
      (bookingService.createBookingService as jest.Mock).mockResolvedValue([]);

      const res = await request(app).post('/bookings').send(mockBooking);

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/creation failed/i);
    });
  });

  describe('GET /bookings', () => {
    it('should return all bookings', async () => {
      (bookingService.getAllBookingsService as jest.Mock).mockResolvedValue([mockBooking]);

      const res = await request(app).get('/bookings');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockBooking]);
    });

    it('should return 404 if no bookings found', async () => {
      (bookingService.getAllBookingsService as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get('/bookings');

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/no bookings found/i);
    });
  });

  describe('GET /bookings/:id', () => {
    it('should return booking by ID', async () => {
      (bookingService.getBookingService as jest.Mock).mockResolvedValue(mockBooking);

      const res = await request(app).get('/bookings/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockBooking);
    });

    it('should return 404 if booking not found', async () => {
      (bookingService.getBookingService as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/bookings/999');

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });

    it('should return 400 for invalid ID', async () => {
      const res = await request(app).get('/bookings/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/invalid booking ID/i);
    });
  });

  describe('PUT /bookings/:id', () => {
    it('should update a booking', async () => {
      (bookingService.updateBookingService as jest.Mock).mockResolvedValue(mockBooking);

      const res = await request(app).put('/bookings/1').send({ booking_status: 'Cancelled' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockBooking);
    });

    it('should return 404 if update fails', async () => {
      (bookingService.updateBookingService as jest.Mock).mockResolvedValue(null);

      const res = await request(app).put('/bookings/1').send({ booking_status: 'Cancelled' });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found or update failed/i);
    });
  });

  describe('DELETE /bookings/:id', () => {
    it('should delete a booking', async () => {
      (bookingService.deleteBookingService as jest.Mock).mockResolvedValue([mockBooking]);

      const res = await request(app).delete('/bookings/1');

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);
      expect(res.body.booking).toEqual(mockBooking);
    });

    it('should return 404 if delete fails', async () => {
      (bookingService.deleteBookingService as jest.Mock).mockResolvedValue([]);

      const res = await request(app).delete('/bookings/999');

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found or deletion failed/i);
    });
  });
});

