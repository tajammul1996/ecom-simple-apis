import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

type User = {
    id: string;
    email: string;
};

export const createJWT = (user: User): string => {
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
    );
    return token;
};