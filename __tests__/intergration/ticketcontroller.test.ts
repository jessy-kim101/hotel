import express from 'express';
import {ticketRoute} from '../../src/routes/ticketsroute'
import request from 'supertest';
import * as ticketService from '../../src/services/ticketsservice';

const app = express();
app.use(express.json());
ticketRoute(app);

export default app;

jest.mock('../../src/services/ticketsservice');

describe('Ticket Controller Integration Tests', () => {
  const mockTicket = {
    ticket_id: 1,
    user_id: 5,
    subject: 'WiFi Not Working',
    description: 'Internet has been down for 2 days',
    status: 'Pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /ticket', () => {
    it('should create a ticket', async () => {
      (ticketService.createTicketService as jest.Mock).mockResolvedValue(mockTicket);

      const res = await request(app).post('/ticket').send(mockTicket);

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockTicket);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/ticket').send({ subject: 'No user_id' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/missing required fields/i);
    });
  });

  describe('GET /ticket', () => {
    it('should return all tickets', async () => {
      (ticketService.getAllTicketsService as jest.Mock).mockResolvedValue([mockTicket]);

      const res = await request(app).get('/ticket');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockTicket]);
    });

    it('should return 404 if no tickets found', async () => {
      (ticketService.getAllTicketsService as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get('/ticket');

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/no customer complains found/i);
    });
  });

  describe('GET /ticket/:id', () => {
    it('should return ticket by ID', async () => {
      (ticketService.getTicketsByIdService as jest.Mock).mockResolvedValue(mockTicket);

      const res = await request(app).get('/ticket/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTicket);
    });

    it('should return 404 if ticket not found', async () => {
      (ticketService.getTicketsByIdService as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/ticket/99');

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/ticket not found/i);
    });
  });

  describe('PUT /ticket/:id', () => {
    it('should update a ticket', async () => {
      (ticketService.updateTicketService as jest.Mock).mockResolvedValue(mockTicket);

      const res = await request(app).put('/ticket/1').send({ status: 'Resolved' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTicket);
    });

    it('should return 404 if ticket not found for update', async () => {
      (ticketService.updateTicketService as jest.Mock).mockResolvedValue(null);

      const res = await request(app).put('/ticket/999').send({ status: 'Resolved' });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/complain not found/i);
    });
  });

  describe('DELETE /ticket/:id', () => {
    it('should delete a ticket', async () => {
      (ticketService.deleteTicketService as jest.Mock).mockResolvedValue(mockTicket);

      const res = await request(app).delete('/ticket/1');

      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/deleted successfully/i);
    });

    it('should return 404 if ticket not found to delete', async () => {
      (ticketService.deleteTicketService as jest.Mock).mockResolvedValue(null);

      const res = await request(app).delete('/ticket/999');

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });
});
