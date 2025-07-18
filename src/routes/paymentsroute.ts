import { getAllPaymentsController, getPaymentByIdController, createPaymentController } from '../controller/paymentscontroller';
import { Express } from "express";



export const paymentRoute = (app: Express) => {
    app.route("/payments").get(
        async (req, res, next) => {
            try {
                await getAllPaymentsController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );

    app.route("/payments").post(
            async (req, res, next) => {
                try {
                    await createPaymentController(req, res);
                } catch (error) {
                    next(error);
                }
            }
        )

    app.route("/payments/:id").get(
        async (req, res, next) => {
            try {
                await getPaymentByIdController(req, res);
            } catch (error) {
                next(error);
            }
        }
    );
}