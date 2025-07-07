import db from '../drizzle/db';
import { roomsTable } from '../drizzle/schemas';
import { TIroom } from '../../types';
import { sql } from "drizzle-orm";

export const createRoomService = async (room: TIroom) => {
    const newRoom = await db.insert(roomsTable).values(room).returning();
    return newRoom[0];
}



export const getAllRoomsService = async () => {
    const rooms = await db.query.roomsTable.findMany({
        columns:{
            room_id: true,
            hotel_id: true,
            room_type: true,
          price_per_night: true,
            amenities: true,
            capacity: true,
            is_available: true,
            created_at: true

        },

    })
    return rooms;
    
}

export const getRoomByIdService = async (roomId: number) => {
const room = await db.query.roomsTable.findFirst({
    columns: {
        room_id: true,
        hotel_id: true,
        room_type: true,
        price_per_night: true,
        amenities: true,
        capacity: true,
        is_available: true,
        created_at: true,
    },
     where: sql`${roomsTable.room_id} = ${roomId}`
});
  }        
