import db from "../../src/drizzle/db";
import { ticketsTable } from '../../src/drizzle/schemas';
import { createTicketService, getAllTicketsService, getTicketsByIdService, updateTicketService, deleteTicketService } from '../../src/services/ticketsservice';
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        ticketsTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createTicketService', () => {
    it('should create a new ticket', async () => {
        const ticket = {
         user_id: 1,
          subject: "Room not cleaned", 
          description: "found dirty bedsheets", 
          status: "open", 
          created_at: new Date(), 
          updated_at: new Date() ,
    }
    const insertedTicket = { ticketId: 1, ...ticket };
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedTicket])
        })
    })
    const result = await createTicketService(ticket);
    expect(db.insert).toHaveBeenCalledWith(ticketsTable);
    expect(result).toEqual(insertedTicket);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const ticket = {
          user_id: 1,
          subject: "Room not cleaned", 
          description: "found dirty bedsheets", 
          status: "open", 
          created_at: new Date(), 
          updated_at: new Date() ,
    }
        const result = await createTicketService(ticket);
        expect(result).toBeNull();
    })
})

describe("getAllTicketsService", () => {
    it("should return all ticket", async () => {
        (db.query.roomsTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAllTicketsService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no tickets found", async () => {
        (db.query.ticketsTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAllTicketsService();
        expect(result).toEqual([]);
    })
})

describe("getTicketByIdService", () => {
    it("should return ticket with given id", async () => {
        const ticket = {
            user_id: 1,
          subject: "Room not cleaned", 
          description: "found dirty bedsheets", 
          status: "open", 
          created_at: new Date(), 
          updated_at: new Date() ,
    };
        (db.query.ticketsTable.findFirst as jest.Mock).mockReturnValueOnce(ticket);
        const result = await getTicketsByIdService(1)
        expect(db.query.ticketsTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(ticket);
    })
    it('should return null if ticket not found', async () => {
        (db.query.ticketsTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getTicketsByIdService(9999);
        expect(result).toBeNull();
    })
})

describe("updateTicketService", () => {
    it("should update a ticket and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ ticketId: 1 }])
                })
            })
        })
        const result = await updateTicketService(1, {
              user_id: 1,
          subject: "Room not cleaned", 
          description: "found dirty bedsheets", 
          status: "open", 
          created_at: new Date(), 
          updated_at: new Date() ,
    });
        expect(db.update).toHaveBeenCalledWith(ticketsTable);
        expect(result).toEqual([{ ticketId: 1 }]);
    })
})

describe("deleteTicketService", () => {
    it("should delete a ticket and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ ticketId: 1 }])
            })
        })
        const result = await deleteTicketService(1);
        expect(db.delete).toHaveBeenCalledWith(ticketsTable);
        expect(result).toEqual([{ ticketId: 1 }]);
    })
})