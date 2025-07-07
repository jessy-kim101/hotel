import {  bookingsTable, usersTable, hotelsTable, roomsTable, ticketsTable, paymentsTable } from './src/drizzle/schemas';

export type TIUser = typeof usersTable.$inferInsert
export type TSUser = typeof usersTable.$inferSelect

// Extended user type for registration that includes bookings fields
export interface TIUserWithbooking extends TIUser {
     booking_id: true;
        check_in_date: true;
        check_out_date: true;
        totalamount: true;
        booking_status: true;
}


export type TIbooking = typeof bookingsTable.$inferInsert
export type TSbooking = typeof bookingsTable.$inferSelect
export type TIuser= typeof usersTable.$inferInsert
export type TSuser = typeof usersTable.$inferSelect
export type TIhotel = typeof hotelsTable.$inferInsert
export type TShotel = typeof hotelsTable.$inferSelect
export type TIroom = typeof roomsTable.$inferInsert
export type TSroom = typeof roomsTable.$inferSelect
export type TIticket = typeof ticketsTable.$inferInsert
export type TSticket = typeof ticketsTable.$inferSelect
export type TIpayment = typeof paymentsTable.$inferInsert
export type TSpayment = typeof paymentsTable.$inferSelect