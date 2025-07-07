
import { relations } from "drizzle-orm";
import { text, varchar, serial, pgTable, decimal, integer, timestamp, date, boolean } from "drizzle-orm/pg-core";


// users table
export const usersTable = pgTable("users", {
    user_id: serial("user_id").primaryKey(),
    firstname: varchar("firstname", { length: 100 }).notNull(),
    lastname: varchar("lastname", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    contact_phone: varchar("contact_phone", { length: 20 }),
    address: varchar("address", { length: 255 }),
    role: varchar("role", { length: 50 }).notNull().default("user"), // e.g., 'admin', 'user'
     is_verified: boolean("is_verified").default(false),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// hotels Table
export const hotelsTable = pgTable("hotels", {
    hotel_id: serial("hotel_id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    address: text("address").notNull(),
    contact_phone: varchar("contact_phone", { length: 20 }),
    location: varchar("location", { length: 100 }).notNull(),
    category: varchar("category", { length: 50 }).notNull(),
    rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// rooms table
export const roomsTable = pgTable("rooms", {
    room_id: serial("room_id").primaryKey(),
    hotel_id: integer("hotel_id").references(() => hotelsTable.hotel_id).notNull(),
    room_type: varchar("room_type" , { length: 100 }).notNull(),
    price_per_night: decimal("price_per_night", { precision: 30, scale: 2 }).notNull(),
    capacity: integer("capacity").notNull(),
    amenities: varchar("amenities", { length: 255 }),
    is_available: boolean("is_available").default(true),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
});

//bookings Table
export const bookingsTable = pgTable("bookings", {
    booking_id: serial("booking_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => usersTable.user_id, { onDelete: "cascade" }),
    room_id: integer("room_id").notNull().references(() => roomsTable.room_id, { onDelete: "cascade" }),
    check_in_date: date("check_in_date").notNull(),
    check_out_date: date("check_out_date").notNull(),
    totalamount: decimal("totalamount", { precision: 10, scale: 2 }),
    booking_status: varchar("booking_status", { length: 50 }).notNull().default("pending"), // e.g., 'pending', 'confirmed', 'cancelled'
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// payments Table
export const paymentsTable = pgTable("payments", {
    payment_id: serial("payment_id").primaryKey(),
    booking_id: integer("booking_id").notNull().references(() => bookingsTable.booking_id, { onDelete: "cascade" }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(), // {precision: 10, scale: 2} means 10 digits total, 2 of which are after the decimal point. i.e // 12345678.90
    payment_status: varchar("payment_status", { length: 50 }).notNull().default("pending"), // e.g., 'pending', 'completed', 'failed'
    payment_date: date("payment_date").notNull(),
    payment_method: text("payment_method").notNull(), // e.g., 'credit_card', 'cash', 'bank_transfer'
    transaction_id: varchar("transaction_id", { length: 100 }).notNull().unique(), // Unique identifier for the transaction
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

// customer support tickets Table
//
export const ticketsTable = pgTable("tickets", {
    ticket_id: serial("ticket_id").primaryKey(),
    user_id: integer("user_id").notNull().references(() => usersTable.user_id, { onDelete: "cascade" }),
    subject: varchar("subject", { length: 255 }).notNull(),
    description: varchar("Description", { length: 255 }),
    status: varchar("status", { length: 50 }).notNull().default("open"), // e.g., 'open', 'in_progress', 'closed'
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});


// RELATIONSHIPS

// usersTable Relationships - 1 user can have many bookings
export const usersRelations = relations(usersTable, ({ many }) => ({
    bookings: many(bookingsTable),
    tickets: many(ticketsTable)
}));

// hotelsTable Relationships - 1 hotel can have many rooms
export const hotelsRelations = relations(hotelsTable, ({ many }) => ({
    rooms: many(roomsTable)
}));

// roomsTable Relationships - 1 room belongs to 1 hotel and can have many bookings
export const roomsRelations = relations(roomsTable, ({ one, many }) => ({
    hotel: one(hotelsTable, {
        fields: [roomsTable.hotel_id],
        references: [hotelsTable.hotel_id]
    }),
    bookings: many(bookingsTable)
}));

// bookingsTable Relationships - 1 booking belongs to 1 user and 1 room and can have 1 payment
export const bookingsRelations = relations(bookingsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [bookingsTable.user_id],
        references: [usersTable.user_id]
    }),
    room: one(roomsTable, {
        fields: [bookingsTable.room_id],
        references: [roomsTable.room_id]
    }),
    payment: one(paymentsTable, {
        fields: [bookingsTable.booking_id],
        references: [paymentsTable.booking_id]
    })
}));

// paymentTable Relationships - 1 payment belongs to 1 booking
export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
    booking: one(bookingsTable, {
        fields: [paymentsTable.booking_id],
        references: [bookingsTable.booking_id]
    })
}));

// ticketsTable Relationships - 1 ticket belongs to 1 user
export const ticketsRelations = relations(ticketsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [ticketsTable.user_id],
        references: [usersTable.user_id]
    })
}));
    