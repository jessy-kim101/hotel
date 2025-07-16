
import express from 'express';
import { hotelRoute } from '../../src/routes/hotelsroute';
import request from 'supertest';
import * as hotelService from '../../src/services/hotelsservice'; 

const app = express();
app.use(express.json());
hotelRoute(app);

export default app;

jest.mock('../../src/services/hotelsservice');

describe('Hotel Controller Integration Tests', () => {
  const mockHotel = {
    hotel_id: 1,
    name: "Grand Hotel",
    location: "Nairobi",
    address: "123 Nairobi St",
    contact_phone: "0700123456",
    category: "Luxury",
    rating: "4.5",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /hotels', () => {
    it('should create a new hotel', async () => {
      (hotelService.createHotelService as jest.Mock).mockResolvedValue(mockHotel);

      const res = await request(app)
        .post('/hotels')
        .send(mockHotel);

      expect(res.status).toBe(201);
      expect(res.body.hotel.name).toBe(mockHotel.name);
       expect(res.body.message).toMatch(/created successfully/i);

    });

    it('should return 400 if creation fails', async () => {
      (hotelService.createHotelService as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post('/hotels')
        .send(mockHotel);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /hotels', () => {
    it('should return all hotels', async () => {
      (hotelService.getAllHotelService as jest.Mock).mockResolvedValue([mockHotel]);

      const res = await request(app).get('/hotels');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return 404 if no hotels found', async () => {
      (hotelService.getAllHotelService as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get('/hotels');

      expect(res.status).toBe(404);
    });
  });

  describe('GET /hotels/:id', () => {
    it('should return a hotel by ID', async () => {
      (hotelService.getHotelByIdService as jest.Mock).mockResolvedValue(mockHotel);

      const res = await request(app).get('/hotels/1');

      expect(res.status).toBe(200);
      expect(res.body.hotel.name).toBe(mockHotel.name);
    });

    it('should return 404 if hotel not found', async () => {
      (hotelService.getHotelByIdService as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/hotels/999');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /hotels/:id', () => {
    it('should update a hotel', async () => {
      const updatedHotel = { ...mockHotel, name: 'Updated Hotel' };
      (hotelService.updateHotelService as jest.Mock).mockResolvedValue([updatedHotel]);

      const res = await request(app)
        .put('/hotels/1')
        .send({ name: 'Updated Hotel' });

      expect(res.status).toBe(200);
      expect(res.body.hotel.name).toBe('Updated Hotel');
    });

    it('should return 404 if update fails', async () => {
      (hotelService.updateHotelService as jest.Mock).mockResolvedValue([]);

      const res = await request(app).put('/hotels/1').send({ name: 'New Name' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /hotels/:id', () => {
    it('should delete a hotel', async () => {
      (hotelService.deleteHotelService as jest.Mock).mockResolvedValue([mockHotel]);

      const res = await request(app).delete('/hotels/1');

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);
    });

    it('should return 404 if hotel not found', async () => {
      (hotelService.deleteHotelService as jest.Mock).mockResolvedValue([]);

      const res = await request(app).delete('/hotels/999');

      expect(res.status).toBe(404);
    });
  });
});

