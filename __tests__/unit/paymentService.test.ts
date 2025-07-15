import db from "../../src/drizzle/db";
import { paymentsTable } from '../../src/drizzle/schemas';
import { createPaymentService, getAllPaymentsService, getPaymentByIdService, updatePaymentService, deletePaymentService } from '../../src/services/paymentsservice';
jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        paymentsTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createPaymentService', () => {
    it('should create a new payment', async () => {
        const payment = {
            booking_id: 1,
            amount: 400.00,
            payment_status: "confirmed",
            transaction_id: "TXN12345678",
            payment_method: "cash",
            payment_date: ("2025-07-20"),
            created_at: new Date(), 
            updated_at: new Date(),
    }
    const insertedPayment = { paymentId: 1, ...payment };
    (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedPayment])
        })
    })
    const result = await createPaymentService(payment);
    expect(db.insert).toHaveBeenCalledWith(paymentsTable);
    expect(result).toEqual(insertedPayment);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const payment = {
           booking_id: 1,
            amount: 400.00,
            payment_status: "confirmed",
            transaction_id: "TXN12345678",
            payment_method: "cash",
            payment_date: ("2025-07-20"),
            created_at: new Date(), 
            updated_at: new Date(),
    }
        const result = await createPaymentService(payment);
        expect(result).toBeNull();
    })
})

describe("getAllPaymentsService", () => {
    it("should return all Payments", async () => {
        (db.query.paymentsTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAllPaymentsService();
        expect(result).toEqual([]);
    })
    it("should return an empty array if no Payments found", async () => {
        (db.query.paymentsTable.findMany as jest.Mock).mockReturnValueOnce([]);
        const result = await getAllPaymentsService();
        expect(result).toEqual([]);
    })
})

describe("getPaymentByIdService", () => {
    it("should return payment with given id", async () => {
        const payment = {
            booking_id: 1,
            amount: 400.00,
            payment_status: "confirmed",
            transaction_id: "TXN12345678",
            payment_method: "cash",
            payment_date: ("2025-07-20"),
            created_at: new Date(), 
            updated_at: new Date(),
    };
        (db.query.paymentsTable.findFirst as jest.Mock).mockReturnValueOnce(payment);
        const result = await getPaymentByIdService(1)
        expect(db.query.paymentsTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(payment);
    })
    it('should return null if payment not found', async () => {
        (db.query.paymentsTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const result = await getPaymentByIdService(9999);
        expect(result).toBeNull();
    })
})

describe("updatePaymentByIdService", () => {
    it("should update a payment and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([{ paymentId: 1 }])
                })
            })
        })
        const result = await updatePaymentService(1, {
            booking_id: 1,
            amount: 400.00,
            payment_status: "confirmed",
            transaction_id: "TXN12345678",
            payment_method: "cash",
            payment_date: ("2025-07-20"),
            created_at: new Date(), 
            updated_at: new Date(),
    });
        expect(db.update).toHaveBeenCalledWith(paymentsTable);
        expect(result).toEqual([{ paymentId: 1 }]);
    })
})

describe("deletePaymentByIdService", () => {
    it("should delete a payment and return success message", async () => {
        (db.delete as jest.Mock).mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([{ paymentId: 1 }])
            })
        })
        const result = await deletePaymentService(1);
        expect(db.delete).toHaveBeenCalledWith(paymentsTable);
        expect(result).toEqual([{ paymentId: 1 }]);
    })
})