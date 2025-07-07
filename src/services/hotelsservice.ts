import db from '../drizzle/db';
import { hotelsTable } from '../drizzle/schemas';
import { TIhotel } from '../../types';
import { sql } from "drizzle-orm";



export const createHotelService = async (hotel:TIhotel) => {
   const newHotel = await db.insert(hotelsTable).values(hotel).returning();
   return newHotel;
    
}

export const getAllHotelService = async () => {
    const getAllHotels = await db.query.hotelsTable.findMany({
        columns:{
            hotel_id: true,
            name: true,
            address: true,
            location: true,
            contact_phone: true,
            category: true,
            rating: true,
            created_at: true,
            updated_at: true,
        }


    })
    return getAllHotels;
}

export const getHotelByIdService = async (hotelId: number) => {
    const hotel = await db.query.hotelsTable.findFirst({
        
        columns: {
            hotel_id: true,
            name: true,
            address: true,
            location: true,
            contact_phone: true,
            category: true,
            rating: true,
            created_at: true,
            updated_at: true,
        },
        with: {
            rooms: {
                columns: {
                    room_id: true,
                    hotel_id: true,
                    room_type: true,
                    price_per_night: true,
                    capacity: true,
                    amenities: true,
                    is_available: true,
                    created_at: true,
                }
            }
        },

        where: sql`${hotelsTable.hotel_id} = ${hotelId}`
    });
}