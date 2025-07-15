import db from '../drizzle/db';
import { roomsTable } from '../drizzle/schemas';
import { TIroom } from '../../types';
import { sql } from "drizzle-orm";

export const createRoomService = async (room: TIroom) => {
  const newRoom = await db.insert(roomsTable).values(room).returning();
  if (!newRoom || newRoom.length === 0) return null;
  return newRoom[0];
};




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
    return room;
  }        

  export const updateRoomService = async (roomId: number, room: TIroom) => {
    const updatedRoom = await db.update(roomsTable)
        .set(room)
        .where(sql`${roomsTable.room_id} = ${roomId}`)
        .returning();
    return updatedRoom;
}
export const deleteRoomService = async (roomId: number) => {
    const deletedRoom = await db.delete(roomsTable)
        .where(sql`${roomsTable.room_id} = ${roomId}`)
        .returning();
    return deletedRoom;
}