import type { Cookies } from "@sveltejs/kit";
import { signPayload, verifyToken } from "./jwt.server";

import { env } from "$env/dynamic/private";
import type { JwtPayload } from "jsonwebtoken";

const validRooms = env.ROOMS?.split(",") || [];

export function isRequireLogin(cookies: Cookies) {
    try {
        verifyToken(cookies.get("token"));
        return false;
    } catch (error) {
        return true;
    }
}

export function login(username: string, room: string) {
    try {
        // check if room code is valid

        if (!validRooms.includes(room)) {
            throw new Error("Invalid room code");
        }

        return signPayload({ username, room });
    } catch (error) {
        throw error;
    }
}

export function getUser(cookies: Cookies) {
    try {
        const token = cookies.get("token");
        const payload = verifyToken(token) as JwtPayload;
        const username: string = payload.username;

        const user: App.Locals["user"] = {
            username,
        };

        return user;
    } catch (error) {
        throw undefined;
    }
}
