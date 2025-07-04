import db from "./db";
import {
    usersTable, hotelsTable, roomsTable, bookingsTable, paymentsTable,
    ticketsTable
} from "./schemas";

async function seed() {

    console.log("Seeding to database started...");

    // insert users
    await db.insert(usersTable).values([
        { firstname: "Mary", lastname: "Jane", email: "maryjane420@gmail.com", password: "jane#420", contact_phone: "0729574820", address: "Nyeri", role: "user" , created_at: new Date(), updated_at: new Date() },
         { firstname: "Alice", lastname: "Njeri", email: "njerialice254@gmail.com", password: "njeripass9@2010", contact_phone: "0730472957", address: "Nairobi", role: "user" , created_at: new Date(), updated_at: new Date() },
          { firstname: "Brian", lastname: "Doe", email: "doebrian123@gmail.com", password: "b234513", contact_phone: "0112737450", address: "Mombasa", role: "admin" , created_at: new Date(), updated_at: new Date() },
    ]);

    // insert hotels
    await db.insert(hotelsTable).values([
        { name: "Grand Hotel", address: "Nairobi", contact_phone: "0700123456", location: "Nairobi", category: "Luxury", rating: "4.5", created_at: new Date(), updated_at: new Date() },
        { name: "Beach Resort", address: "Mombasa", contact_phone: "0712345678", location: "Mombasa", category: "Resort", rating: "4.0", created_at: new Date(), updated_at: new Date() },
    ]);

    // insert rooms
    await db.insert(roomsTable).values([
        { hotel_id: 1, room_type: "Deluxe suite", price_per_night: "150.00", capacity: 2, amenities: "Wi-Fi", is_available: true, created_at: new Date() },
        { hotel_id: 1, room_type: "Standard room", price_per_night: "100.00", capacity: 2, amenities: "TV", is_available: true, created_at: new Date() },
    ]);

    // insert bookings
    await db.insert(bookingsTable).values([
        { user_id: 1, room_id: 1, check_in_date: new Date("2025-08-10").toISOString().split("T")[0], check_out_date: new Date("2025-08-15").toISOString().split("T")[0], totalamount: "600.00", booking_status: "confirmed", created_at: new Date(), updated_at: new Date() },
        { user_id: 2, room_id: 2, check_in_date: new Date("2025-01-06").toISOString().split("T")[0], check_out_date: new Date("2025-01-20").toISOString().split("T")[0], totalamount: "400.00", booking_status: "pending", created_at: new Date(), updated_at: new Date() },
    ]);

    // insert payments
    await db.insert(paymentsTable).values([
        { booking_id: 2, amount: "600.00", payment_status: "confirmed", payment_date: new Date("2025-07-20").toISOString().split("T")[0], payment_method: "mpesa", transaction_id: "TXN987654321", created_at: new Date(), updated_at: new Date() },
        { booking_id: 1, amount: "400.00", payment_status: "pending", payment_date: new Date("2025-07-20").toISOString().split("T")[0], payment_method: "cash", transaction_id: "TXN12345678", created_at: new Date(), updated_at: new Date() },
    ]);

    // insert tickets
    await db.insert(ticketsTable).values([
        { user_id: 1, subject: "Room not cleaned", description: "found dirty bedsheets", status: "open", created_at: new Date(), updated_at: new Date() },
        { user_id: 2, subject: "Air conditioning not working", description: "fan was broken", status: "open", created_at: new Date(), updated_at: new Date() },
    ]);

    console.log("Seeding to database completed successfully.");
    process.exit(0); // 0 means success

}

seed().catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1); // 1 means an error occurred
})