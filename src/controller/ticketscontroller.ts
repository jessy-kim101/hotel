import { createTicketService, deleteTicketService, getAllTicketsService, getTicketsByIdService, updateTicketService } from '../services/ticketsservice';
import { Request, Response } from "express";

export const createTicketController = async (req: any, res: any) => {
    try {

        console.log("createTicketController called");
        const ticketData = req.body;
        if (!ticketData.user_id || !ticketData.subject || !ticketData.description) {
            console.log("missing required fields");
            return res.status(400).json({ message: "Missing required fields" });
        }
        const newComplain = await createTicketService(ticketData);
        console.log("ticket created", newComplain);
        res.status(201).json(newComplain);
        
    } catch (error) {
        console.error("Error creating customer ticket:", error);
        res.status(500).json({ message: "Internal server error", error });
        
    }
}

export const getAllTicketController = async (req: any, res: any) => {
    try {
        const allTickets= await getAllTicketsService();
       if (allTickets.length === 0) {
            return res.status(404).json({ message: "No customer complains found" });
        }
        res.status(200).json(allTickets);
        
    } catch (error) {
        console.error("Error fetching customer complains:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}

export const getticketByIdController = async (req:Request,res:Response) => {
    try {
        const ticketId = parseInt(req.params.id)
        const oneTicket = await getTicketsByIdService(ticketId);
        if (!oneTicket) {
            return res.status(404).json({ message: "Customer ticket not found" });
        }
        res.status(200).json(oneTicket);
        
    } catch (error) {
        console.error("Error fetching customer ticket by ID:", error);
        res.status(500).json({ message: "Internal server error" });

        
    }

    
} 

export const updateTicketsController = async (req: any, res: any) => {
    try {
        const ticketId = parseInt(req.params.id);
        const updates = req.body;
        const updatedTicket = await updateTicketService(ticketId, updates);
        if (!updatedTicket) {
            return res.status(404).json({ message: "Customer complain not found" });
        }
        res.status(200).json(updatedTicket);
        
    } catch (error) {
        console.error("Error updating customer ticket:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}
export const deleteTicketsController = async (req: any, res: any) => {
    try {
        const ticketId = parseInt(req.params.id);
        const deletedTicket = await deleteTicketService(ticketId);
        if (!deletedTicket) {
            return res.status(404).json({ message: "Customer ticket not found" });
        }
        res.status(200).json({ message: "Customer ticket deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting customer ticket:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}