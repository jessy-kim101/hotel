import express from 'express';
import { roomRoute} from '../../src/routes/roomsroute';
import request from 'supertest';
import * as roomService from '../../src/services/roomsservice';

const app = express();
app.use(express.json());
roomRoute(app);

export default app;

jest.mock('../../src/services/roomsservice');

describe('Room Controller Integration Tests', () => {
  const mockRoom = {
    room_id: 1,
    hotel_id: 2,
    room_type: 'Deluxe',
    price_per_night: 150,
    amenities: ['WiFi', 'TV'],
    capacity: 2,
    is_available: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /rooms', () => {
    it('should create a new room', async () => {
      (roomService.createRoomService as jest.Mock).mockResolvedValue(mockRoom);

      const res = await request(app).post('/rooms').send(mockRoom);

      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/created successfully/i);
      expect(res.body.room).toEqual(mockRoom);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/rooms').send({
        room_type: 'Deluxe'
        // missing hotel_id, price_per_night, amenities, capacity
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Missing required fields');
    });
  });

  describe('GET /rooms', () => {
    it('should return all rooms', async () => {
      (roomService.getAllRoomsService as jest.Mock).mockResolvedValue([mockRoom]);

      const res = await request(app).get('/rooms');

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/retrieved successfully/i);
      expect(res.body.rooms).toEqual([mockRoom]);
    });

    it('should return 404 if no rooms found', async () => {
      (roomService.getAllRoomsService as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get('/rooms');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('No rooms found');
    });
  });

  describe('GET /rooms/:id', () => {
    it('should return room by ID', async () => {
      (roomService.getRoomByIdService as jest.Mock).mockResolvedValue(mockRoom);

      const res = await request(app).get('/rooms/1');

      expect(res.status).toBe(200);
      expect(res.body.room).toEqual(mockRoom);
    });

    it('should return 404 if room not found', async () => {
      (roomService.getRoomByIdService as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/rooms/999');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Room not found');
    });
  });

  describe('PUT /rooms/:id', () => {
    it('should update a room', async () => {
      (roomService.updateRoomService as jest.Mock).mockResolvedValue(mockRoom);

      const res = await request(app)
        .put('/rooms/1')
        .send({ room_type: 'Suite' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockRoom);
    });

    it('should return 404 if room not found', async () => {
      (roomService.updateRoomService as jest.Mock).mockResolvedValue(null);

      const res = await request(app).put('/rooms/999').send({ room_type: 'Suite' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Room not found');
    });
  });

  describe('DELETE /rooms/:id', () => {
    it('should delete a room', async () => {
      (roomService.deleteRoomService as jest.Mock).mockResolvedValue(mockRoom);

      const res = await request(app).delete('/rooms/1');

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);
      expect(res.body.room).toEqual(mockRoom);
    });

    it('should return 404 if room not found', async () => {
      (roomService.deleteRoomService as jest.Mock).mockResolvedValue(null);

      const res = await request(app).delete('/rooms/999');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Room not found');
    });
  });
});

