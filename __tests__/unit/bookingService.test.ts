import db from "../../src/drizzle/db";
import { bookingsTable } from '../../src/drizzle/schemas';
import { createBookingService, getAllBookingsService, getBookingService, updateBookingService, deleteBookingService } from '../../src/services/bookingsservice';
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        bookingsTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createBookingService', () => {
    it('should create a new booking', async () => {
        const booking = {
             user_id: 1, 
            room_id: 1, 
            check_in_date:("2025-08-10"),
            check_out_date:("2025-08-15"), 
            totalamount: 600.00, 
            booking_status: "pending", 
            created_at: new Date(), 
            updated_at: new Date(),
    }
    const insertedBooking = { bookingId: 1, ...booking };
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedBooking])
        })
    })
    const result = await createBookingService(booking);
    expect(db.insert).toHaveBeenCalledWith(bookingsTable);
    expect(result).toEqual(insertedBooking);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const booking = {
            user_id: 1, 
            room_id: 1, 
            check_in_date:("2025-08-10"),
            check_out_date:("2025-08-15"), 
            totalamount: 600.00, 
            booking_status: "pending", 
            created_at: new Date(), 
            updated_at: new Date(),
    }
        const result = await createBookingService(booking);
        expect(result).toBeNull();
    })
})

describe("getAllBookingsService", () => {
    it("should return all Bookings", async () => {
        (db.query.bookingsTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAllBookingsService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no bookings found", async () => {
        (db.query.paymentsTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAllBookingsService();
        expect(result).toEqual([]);
    })
})

describe("getBookingService", () => {
    it("should return booking with given id", async () => {
        const booking = {
            user_id: 1, 
            room_id: 1, 
            check_in_date: new Date("2025-08-10"),
            check_out_date: new Date("2025-08-15"), 
            totalamount: 600.00, 
            booking_status: "pending", 
            created_at: new Date(), 
            updated_at: new Date(),
    };
        (db.query.bookingsTable.findFirst as jest.Mock).mockReturnValueOnce(booking);
        const result = await getBookingService(1)
        expect(db.query.bookingsTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(booking);
    })
    it('should return null if booking not found', async () => {
        (db.query.bookingsTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getBookingService(9999);
        expect(result).toBeNull();
    })
})

describe("updateBookingService", () => {
    it("should update a booking and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ bookingId: 1 }])
                })
            })
        })
        const result = await updateBookingService(1, {
           user_id: 1, 
            room_id: 1, 
            check_in_date:("2025-08-10"),
            check_out_date: ("2025-08-15"), 
            totalamount: 600.00, 
            booking_status: "pending", 
            created_at: new Date(), 
            updated_at: new Date(),
    });
        expect(db.update).toHaveBeenCalledWith(bookingsTable);
        expect(result).toEqual([{ bookingId: 1 }]);
    })
})

describe("deleteBookingService", () => {
    it("should delete a booking and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ bookingId: 1 }])
            })
        })
        const result = await deleteBookingService(1);
        expect(db.delete).toHaveBeenCalledWith(bookingsTable);
        expect(result).toEqual([{ bookingId: 1 }]);
    })
})