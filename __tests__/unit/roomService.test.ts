import db from "../../src/drizzle/db";
import { roomsTable } from '../../src/drizzle/schemas';
import { createRoomService, getAllRoomsService, getRoomByIdService, updateRoomService, deleteRoomService } from '../../src/services/roomsservice';
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        roomsTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createRoomService', () => {
    it('should create a new room', async () => {
        const room = {
         hotel_id: 1, 
         room_type: "Deluxe suite", 
         price_per_night: "150.00", 
         capacity: 2, 
         amenities: "Wi-Fi", 
         is_available: true, 
         created_at: new Date(),
    }
    const insertedRoom = { roomId: 1, ...room };
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedRoom])
        })
    })
    const result = await createRoomService(room);
    expect(db.insert).toHaveBeenCalledWith(roomsTable);
    expect(result).toEqual(insertedRoom);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const room = {
           hotel_id: 1, 
         room_type: "Deluxe suite", 
         price_per_night: "150.00", 
         capacity: 2, 
         amenities: "Wi-Fi", 
         is_available: true, 
         created_at: new Date(),
    }
        const result = await createRoomService(room);
        expect(result).toBeNull();
    })
})

describe("getAllRoomsService", () => {
    it("should return all rooms", async () => {
        (db.query.roomsTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAllRoomsService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no rooms found", async () => {
        (db.query.roomsTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAllRoomsService();
        expect(result).toEqual([]);
    })
})

describe("getRoomByIdService", () => {
    it("should return room with given id", async () => {
        const room = {
            hotel_id: 1, 
         room_type: "Deluxe suite", 
         price_per_night: "150.00", 
         capacity: 2, 
         amenities: "Wi-Fi", 
         is_available: true, 
         created_at: new Date(),
    };
        (db.query.roomsTable.findFirst as jest.Mock).mockReturnValueOnce(room);
        const result = await getRoomByIdService(1)
        expect(db.query.roomsTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(room);
    })
    it('should return null if room not found', async () => {
        (db.query.roomsTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getRoomByIdService(9999);
        expect(result).toBeNull();
    })
})

describe("updateRoomByIdService", () => {
    it("should update a payment and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ roomId: 1 }])
                })
            })
        })
        const result = await updateRoomService(1, {
              hotel_id: 1, 
         room_type: "Deluxe suite", 
         price_per_night: "150.00", 
         capacity: 2, 
         amenities: "Wi-Fi", 
         is_available: true, 
         created_at: new Date(),
    });
        expect(db.update).toHaveBeenCalledWith(roomsTable);
        expect(result).toEqual([{ roomId: 1 }]);
    })
})

describe("deleteRoomService", () => {
    it("should delete a room and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ roomId: 1 }])
            })
        })
        const result = await deleteRoomService(1);
        expect(db.delete).toHaveBeenCalledWith(roomsTable);
        expect(result).toEqual([{ roomId: 1 }]);
    })
})