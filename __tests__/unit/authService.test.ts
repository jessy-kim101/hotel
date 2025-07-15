import db from "../../src/drizzle/db";
import { createAuthService,  loginAuthService, updateVerificationStatus } from '../../src/services/authservice';
import { usersTable } from '../../src/drizzle/schemas';

jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    query: {
        usersTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createAuthService', () => {
    it('should create a new user', async () => {
        const user = {
            firstname: "Mary",
             lastname: "Jane", 
             email: "maryjane420@gmail.com",
              password: "jane#420", 
              contact_phone: "0729574820", 
              address: "Nyeri", 
              role: "user" ,
              is_verified: true , 
              created_at: new Date(), 
              updated_at: new Date(),
        }
        const insertedUser = { userId: 1, ...user};
        (db.insert as jest.Mock).mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValueOnce([insertedUser])
                })
            });  
            const result = await createAuthService(user)
            expect(db.insert).toHaveBeenCalledWith(usersTable);
            expect(result).toEqual(insertedUser);
    })
})

describe("return null if insert fails",() => {
    it("should return null if insertion fails", async () => {
        (db.insert as jest.Mock).mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValueOnce([])
            })
        });
        const user = {
            firstname: "Mary",
             lastname: "Jane", 
             email: "maryjane420@gmail.com",
              password: "jane#420", 
              contact_phone: "0729574820", 
              address: "Nyeri", 
              role: "user" ,
              is_verified: true , 
              created_at: new Date(), 
              updated_at: new Date(),
        }
        const result = await createAuthService(user);
        expect(result).toBeNull();
    })
})



describe("loginAuthService", () => {
    it("should return user with given id", async () => {
        const user = {
            firstname: "Mary",
             lastname: "Jane", 
             email: "maryjane420@gmail.com",
              password: "jane#420",
              contact_phone: "0729574820", 
              address: "Nyeri", 
              role: "user" ,
              is_verified: true , 
              created_at: new Date(), 
              updated_at: new Date(),

        };
        (db.query.usersTable.findFirst as jest.Mock).mockReturnValueOnce(user);
        const result = await loginAuthService(user);
        expect(db.query.usersTable.findFirst).toHaveBeenCalled();
        expect(result).toEqual(user);
    })
    it('should return null if user not found', async () => {
        (db.query.usersTable.findFirst as jest.Mock).mockReturnValueOnce(null);
        const user = {
             firstname: "Mary",
             lastname: "Jane", 
             email: "maryjane420@gmail.com",
              password: "jane#420",
        };
        const result = await loginAuthService(user);
        expect(result).toBeNull();
    })
})

describe("updateVerificationStatus", () => {
    it("should update a user and return success message", async () => {
        (db.update as jest.Mock).mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValueOnce(null)
            })
        })
        const user = {
            
            firstname: "Mary",
             lastname: "Jane", 
             email: "maryjane420@gmail.com",
              password: "jane#420",
              is_verified: true ,
        };
        const result = await updateVerificationStatus("maryjane420@gmail.com", true)
        expect(db.update).toHaveBeenCalledWith(usersTable);
        expect(result).toBeNull();
    })
})


