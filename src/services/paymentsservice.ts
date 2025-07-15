import db from '../drizzle/db';
import { paymentsTable } from '../drizzle/schemas';
import { TIpayment } from '../../types';
import { sql } from "drizzle-orm";



export const createPaymentService = async (payment:TIpayment) => {
    const newPayment = await db.insert(paymentsTable).values(payment).returning();
    return newPayment[0] ?? null;

}

export const getAllPaymentsService = async () => {
    const payments = await db.query.paymentsTable.findMany({
        columns:{
            payment_id: true,
            booking_id: true,
            amount: true,
            payment_method: true,
            payment_status: true,
            transaction_id: true,
            payment_date: true,
           
        },
        with: {
            booking: {
                columns: {
                    booking_id: true,
                    user_id: true,
                    room_id: true,
                    check_in_date: true,
                    check_out_date: true,
                    totalamount: true,
                    booking_status: true,
                },
                with: {
                    user: {
                        columns: {
                            user_id: true,
                            firstname: true,
                            lastname: true,
                            email: true
                        }
                    }
                }
            }
 } });
    return getAllPaymentsService;
}

export const getPaymentByIdService = async (paymentId: number) => {
    const payment = await db.query.paymentsTable.findFirst({
        columns: {
            payment_id: true,
            booking_id: true,
            amount: true,
            payment_method: true,
            payment_status: true,
            transaction_id: true,
            payment_date: true,
        },
        with: {
            booking: {
                columns: {
                    booking_id: true,
                    user_id: true,
                    room_id: true,
                    check_in_date: true,
                    check_out_date: true,
                    totalamount: true,
                    booking_status: true,
                },
                with: {
                    user: {
                        columns: {
                            user_id: true,
                            firstname: true,
                            lastname: true,
                            email: true
                        }
                    }
                }
            }
        },
        where: sql`${paymentsTable.payment_id} = ${paymentId}`
        
    });
    return payment;
}

export const updatePaymentService = async (paymentId: number, payment: TIpayment) => {
    const updatedPayment = await db.update(paymentsTable)
        .set(payment)
        .where(sql`${paymentsTable.payment_id} = ${paymentId}`)
        .returning();
    return updatedPayment;
}
export const deletePaymentService = async (paymentId: number) => {
    const deletedPayment = await db.delete(paymentsTable)
        .where(sql`${paymentsTable.payment_id} = ${paymentId}`)
        .returning();
    return deletedPayment;
}