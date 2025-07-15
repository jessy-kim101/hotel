import { Column, sql } from "drizzle-orm";
import db from "../drizzle/db";
import { usersTable } from "../drizzle/schemas";
import { TIUser } from '../../types';
export const createAuthService = async (userData: TIUser) => {
    try {
        const userFields: TIUser = {
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email,
            password: userData.password,
         
           
        };

        // Basic field validation
        if (!userFields.firstname || !userFields.lastname || !userFields.email || !userFields.password) {
            throw new Error('Missing required user fields');
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(userFields.password)) {
            throw new Error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character');
        }

      

        // Create user first
        const newUser = await db.transaction(async (tx) => {
            const [createdUser] = await tx.insert(usersTable).values(userFields).returning();
            // If user role is admin, create admin record
        

            return createdUser;
        });

        return newUser;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Missing required user fields' ||
                error.message === 'Missing required customer fields') {
                throw error;
            }
        }
        // Re-throw any other errors
        throw new Error('Database error');
    }
}

export const loginAuthService = async (user: TIUser) => {
    const { email } = user;
    const result = await db.query.usersTable.findFirst({
        columns: {
            user_id: true,
            firstname: true,
            lastname: true,
            email: true,
            password: true,
            role: true,
            is_verified: true,
        
        },
        where: sql`${usersTable.email}=${email}`
    });

    return result;
}

export const updateVerificationStatus = async (email: string, isVerified: boolean) => {
    const [updatedUser] = await db.update(usersTable)
        .set({ is_verified: isVerified })
        .where(sql`${usersTable.email}=${email}`)
        .returning();
    return updatedUser;
}