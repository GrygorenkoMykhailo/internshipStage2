import bcrypt from "bcrypt"

export const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, +process.env.SALT_ROUNDS!);
}