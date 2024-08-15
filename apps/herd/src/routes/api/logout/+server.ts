import { env } from '$env/dynamic/private';
import type { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../../../server/auth/jwt.server.js';
import { disconnectSocketByUsername } from '../../../server/game/game.server.js';

export async function POST({ cookies }) {

    const token = cookies.get('token');

    try {
        const payload = verifyToken(token) as JwtPayload;
        const { room, username } = payload;
        disconnectSocketByUsername(room, username);
    } catch (error) {
        console.error(error);
    }

    cookies.delete("token", {
        path: "/",
        secure: env.SECURE === "true",
    });

    return new Response();
}
