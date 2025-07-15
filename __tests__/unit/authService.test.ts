import db from "../../src/drizzle/db";
import { createAuthService,  loginAuthService, updateVerificationStatus } from '../../src/services/authservice';
import { usersTable } from '../../src/drizzle/schemas';

jest.mock('../../src/drizzle/db', () => ({
    insert: jest.fn(),
    transaction: jest.fn(),
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
  const mockUser = {
    firstname: "Mary",
    lastname: "Jane",
    email: "maryjane420@gmail.com",
    password: "Jane#420",
    contact_phone: "0729574820",
    address: "Nyeri",
    role: "user",
    is_verified: true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  it('should create a new user', async () => {
    const insertedUser = { userId: 1, ...mockUser };

    // mock db.transaction to return the insertedUser
    (db.transaction as jest.Mock).mockImplementation(async (callback) => {
      const mockTx = {
        insert: jest.fn().mockReturnValue({
          values: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([insertedUser]),
          }),
        }),
      };
      return await callback(mockTx);
    });

    const result = await createAuthService(mockUser);
    expect(result).toEqual(insertedUser);
  });

  //it('should throw an error if insertion returns empty array', async () => {
    //(db.transaction as jest.Mock).mockImplementation(async (callback) => {
     // const mockTx = {
       // insert: jest.fn().mockReturnValue({
        //  values: jest.fn().mockReturnValue({
         //   returning: jest.fn().mockResolvedValueOnce([]), // simulate failed insert
        //  }),
       // }),
     // };
     // return await callback(mockTx);
  //  });

    //await expect(createAuthService(mockUser)).rejects.toThrow('Database error');
 // });
});



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
  it("should return undefined if no user is updated", async () => {
    (db.update as jest.Mock).mockReturnValue({
      set: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([]), // empty result = no user found
        }),
      }),
    });

    const result = await updateVerificationStatus("maryjane420@gmail.com", true);

    expect(db.update).toHaveBeenCalledWith(usersTable);
    expect(result).toBeUndefined(); // Not null — it's undefined due to destructuring
  });
});


