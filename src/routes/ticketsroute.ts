import { createTicketController, deleteTicketsController, getAllTicketController, getticketByIdController, updateTicketsController } from '../controller/ticketscontroller';
import { Express } from 'express';





export const ticketRoute = (app:Express)=>{
    app.route('/ticket').get(
        async (req,res,next) => {
            try {
                await getAllTicketController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/ticket/:id').get(
        async (req,res,next) => {
            try {
                await getticketByIdController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/ticket').post(
        async (req,res,next) => {
            try {
                await createTicketController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/ticket/:id').put(
        async (req, res, next) => {
            try {
                await updateTicketsController(req, res);
                
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
    app.route('/ticket/:id').delete(
        async (req, res, next) => {
            try {
             await deleteTicketsController(req, res);
                
            } catch (error) {
                next(error);
                
            }
            
        }
    )
}