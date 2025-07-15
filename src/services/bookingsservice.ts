import db from '../drizzle/db';
import { bookingsTable } from '../drizzle/schemas';
import { TIbooking } from '../../types';
import { sql } from 'drizzle-orm';
import { on } from 'nodemailer/lib/xoauth2';

export const createBookingService = async (booking:TIbooking) => {
    const newBooking = await db.insert(bookingsTable).values(booking).returning();
    return newBooking;
    
}



export const getBookingService = async (bookingId: number) => {
    return await db.query.bookingsTable.findFirst({
        columns: {
            booking_id: true,
            user_id: true,
            room_id: true,
            check_in_date: true,
            check_out_date: true,
            totalamount: true,
            booking_status: true,
            created_at: true,
            updated_at: true
        },
        where: sql`${bookingsTable.booking_id}=${bookingId}`
    });
}

export const getAllBookingsService = async () => {
    return await db.query.bookingsTable.findMany({
        columns: {
            booking_id: true,
            user_id: true,
            room_id: true,
            check_in_date: true,
            check_out_date: true,
            totalamount: true,
            booking_status: true,
            created_at: true,
            updated_at: true
        },
        with: {
            user: {
                columns: {
                    user_id: true,
                    firstname: true,
                    lastname: true,
                    email: true
                }
            },
            room: {
                columns: {
                    room_id: true,
                    hotel_id: true,
                    room_type: true,
                    price_per_night: true,
                    capacity: true,
                    amenities: true,
                    is_available: true
                }
            }
        },
    });
}
export const updateBookingService = async (bookingId: number, booking: TIbooking) => {
  const updatedBooking = await db.update(bookingsTable)
    .set(booking)
    .where(sql`${bookingsTable.booking_id} = ${bookingId}`)
    .returning();

  return updatedBooking[0]; // ✅ Return a single updated booking
};

export const deleteBookingService = async (bookingId: number) => {
    const deletedBooking = await db.delete(bookingsTable)
        .where(sql`${bookingsTable.booking_id} = ${bookingId}`)
        .returning();
    return deletedBooking;
}