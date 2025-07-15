import db from "../../src/drizzle/db";
import { hotelsTable } from '../../src/drizzle/schemas';
import { createHotelService, getAllHotelService, getHotelByIdService, updateHotelService, deleteHotelService } from '../../src/services/hotelsservice';
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        hotelsTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createHotelService', () => {
    it('should create a new hotel', async () => {
        const hotel = {
              name: "Grand Hotel", 
              address: "Nairobi", 
              contact_phone: "0700123456", 
              location: "Nairobi", 
              category: "Luxury", 
              rating: "4.5", 
              created_at: new Date(), 
              updated_at: new Date(),
    }
    const insertedHotel = { hotelId: 1, ...hotel };
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedHotel])
        })
    })
    const result = await createHotelService(hotel);
    expect(db.insert).toHaveBeenCalledWith(hotelsTable);
    expect(result).toEqual(insertedHotel);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const hotel = {
            name: "Grand Hotel", 
              address: "Nairobi", 
              contact_phone: "0700123456", 
              location: "Nairobi", 
              category: "Luxury", 
              rating: "4.5", 
              created_at: new Date(), 
              updated_at: new Date(),
    }
        const result = await createHotelService(hotel);
        expect(result).toBeNull();
    })
})

describe("getAllHotelService", () => {
    it("should return all Hotels", async () => {
        (db.query.hotelsTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAllHotelService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no bookings found", async () => {
        (db.query.paymentsTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAllHotelService();
        expect(result).toEqual([]);
    })
})

describe("getHotelByIdService", () => {
    it("should return hotel with given id", async () => {
        const hotel = {
           name: "Grand Hotel", 
              address: "Nairobi", 
              contact_phone: "0700123456", 
              location: "Nairobi", 
              category: "Luxury", 
              rating: "4.5", 
              created_at: new Date(), 
              updated_at: new Date(),
    };
        (db.query.hotelsTable.findFirst as jest.Mock).mockReturnValueOnce(hotel);
        const result = await getHotelByIdService(1)
        expect(db.query.bookingsTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(hotel);
    })
    it('should return null if hotel not found', async () => {
        (db.query.bookingsTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getHotelByIdService(9999);
        expect(result).toBeNull();
    })
})

describe("updateHotelService", () => {
    it("should update a hotel and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ hotelId: 1 }])
                })
            })
        })
        const result = await updateHotelService(1, {
           name: "Grand Hotel", 
              address: "Nairobi", 
              contact_phone: "0700123456", 
              location: "Nairobi", 
              category: "Luxury", 
              rating: "4.5", 
              created_at: new Date(), 
              updated_at: new Date(),
    });
        expect(db.update).toHaveBeenCalledWith(hotelsTable);
        expect(result).toEqual([{ hotelId: 1 }]);
    })
})

describe("deleteHotelService", () => {
    it("should delete a hotel and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ hotelId: 1 }])
            })
        })
        const result = await deleteHotelService(1);
        expect(db.delete).toHaveBeenCalledWith(hotelsTable);
        expect(result).toEqual([{ hotelId: 1 }]);
    })
})