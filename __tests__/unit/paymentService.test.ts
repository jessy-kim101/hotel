// paymentService.test.ts
import db from "../../src/drizzle/db";
import { paymentsTable } from "../../src/drizzle/schemas";
import {
  createPaymentService,
  getAllPaymentsService,
  getPaymentByIdService,
  updatePaymentService,
  deletePaymentService,
} from '../../src/services/paymentsservice';

jest.mock("../../src/drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    paymentsTable: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("createPaymentService", () => {
  it("should create a new payment", async () => {
    const payment = {
      booking_id: 1,
      amount: 600,
      payment_method: "Mpesa",
      payment_status: "Completed",
      transaction_id: "TX123456",
      payment_date: new Date().toISOString(),
    };
    const insertedPayment = { payment_id: 1, ...payment };
    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnValueOnce({
        returning: jest.fn().mockResolvedValueOnce([insertedPayment]),
      }),
    });

    const result = await createPaymentService(payment);
    expect(db.insert).toHaveBeenCalledWith(paymentsTable);
    expect(result).toEqual(insertedPayment);
  });

  it("should return null if insertion fails", async () => {
    (db.insert as jest.Mock).mockReturnValueOnce({
      values: jest.fn().mockReturnValueOnce({
        returning: jest.fn().mockResolvedValueOnce([]),
      }),
    });
    const result = await createPaymentService({
      booking_id: 1,
      amount: 600,
      payment_method: "Mpesa",
      payment_status: "Pending",
      transaction_id: "TX987654",
      payment_date: new Date().toISOString(),
    });
    expect(result).toBeNull();
  });
});

describe("getAllPaymentsService", () => {
  it("should return all payments", async () => {
    const payments: any[] = [];
    (db.query.paymentsTable.findMany as jest.Mock).mockReturnValueOnce(payments);
    const result = await getAllPaymentsService();
    expect(result).toEqual(getAllPaymentsService);
  });
});

describe("getPaymentByIdService", () => {
  it("should return payment by ID", async () => {
    const payment = {
      payment_id: 1,
      booking_id: 1,
      amount: 600,
      payment_method: "Mpesa",
      payment_status: "Completed",
      transaction_id: "TX123456",
      payment_date: new Date(),
    };
    (db.query.paymentsTable.findFirst as jest.Mock).mockReturnValueOnce(payment);
    const result = await getPaymentByIdService(1);
    expect(result).toEqual(payment);
  });

  it("should return null if payment not found", async () => {
    (db.query.paymentsTable.findFirst as jest.Mock).mockReturnValueOnce(null);
    const result = await getPaymentByIdService(99);
    expect(result).toBeNull();
  });
});

describe("updatePaymentService", () => {
  it("should update a payment", async () => {
    const updated = [{ payment_id: 1 }];
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce(updated),
        }),
      }),
    });
    const result = await updatePaymentService(1, {
      booking_id: 1,
      amount: 700,
      payment_method: "Visa",
      payment_status: "Completed",
      transaction_id: "TX111",
      payment_date: new Date().toISOString(),
    });
    expect(result).toEqual(updated);
  });
});

describe("deletePaymentService", () => {
  it("should delete a payment", async () => {
    const deleted = [{ payment_id: 1 }];
    (db.delete as jest.Mock).mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValueOnce(deleted),
      }),
    });
    const result = await deletePaymentService(1);
    expect(result).toEqual(deleted);
  });
});
