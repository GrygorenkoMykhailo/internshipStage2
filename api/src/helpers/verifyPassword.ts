import bcrypt from "bcrypt";

export const verifyPassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
};