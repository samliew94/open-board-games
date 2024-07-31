import { env } from "$env/dynamic/private";
import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = env.JWT_SECRET!;

export function signPayload(payload: any) {
    return jwt.sign(payload, JWT_SECRET);
}

export function verifyToken(token: string | undefined) {
    try {
        if (!token) {
            throw new Error("Bad token");
        }
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw error;
    }
}

export function decodeToken(token: string) {
    return jwt.decode(token) as JwtPayload;
}
