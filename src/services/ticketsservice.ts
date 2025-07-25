import db from '../drizzle/db';
import { ticketsTable } from '../drizzle/schemas';
import { TIticket } from '../../types';
import { sql } from "drizzle-orm";


export const createTicketService = async (ticket: TIticket) => {
  const [newTicket] = await db.insert(ticketsTable).values(ticket).returning();
  return newTicket ?? null;
};


export const getAllTicketsService = async () => {
    const allTickets = await db.query.ticketsTable.findMany({
        columns:{
            ticket_id: true,
            user_id: true,
            subject: true,
            description: true,
            status: true,
            created_at: true,
            updated_at: true,

        }
    })
    return allTickets;
}

export const getTicketsByIdService = async (ticketId: number) => {
    const ticket = await db.query.ticketsTable.findFirst({
        columns: {
            ticket_id: true,
            user_id: true,
            subject: true,
            description: true,
            status: true,
            created_at: true,
            updated_at: true,
        },
         where: sql`${ticketsTable.ticket_id} = ${ticketId}`
    });
    return ticket;
}

export const updateTicketService = async (ticketId: number, ticket: TIticket) => {
    const updatedTicket = await db.update(ticketsTable)
        .set(ticket)
        .where(sql`${ticketsTable.ticket_id} = ${ticketId}`)
        .returning();
    return updatedTicket;
}
export const deleteTicketService = async (ticketId: number) => {
    const deletedTicket = await db.delete(ticketsTable)
        .where(sql`${ticketsTable.ticket_id} = ${ticketId}`)
        .returning();
    return deletedTicket;
}