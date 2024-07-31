import * as jwt from "jsonwebtoken";

export function signToken(payload: any) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in ENV");
    }

    return jwt.sign(payload, process.env.JWT_SECRET);
}

export function verifyToken(token: string) {
    if (!token) {
        throw new Error("Bad token");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in ENV");
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw error;
    }
}
