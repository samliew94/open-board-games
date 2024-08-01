import { env } from "$env/dynamic/private";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function signPayload(payload: any) {
    return jwt.sign(payload, env.JWT_SECRET);
}

export function verifyToken(token: string | undefined) {
    try {
        console.log(`verifying token: ${token}. SECRET=${env.JWT_SECRET}`);
        if (!token) {
            throw new Error("Bad token");
        }
        return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        throw error;
    }
}

export function decodeToken(token: string) {
    return jwt.decode(token) as JwtPayload;
}
