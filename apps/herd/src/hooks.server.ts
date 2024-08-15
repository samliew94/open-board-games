import { redirect } from "@sveltejs/kit";
import { getUser, isRequireLogin } from "./server/auth/auth.server";
import { initSocketIo } from "./server/socket.server";

export async function handle({ event, resolve }) {
    initSocketIo();

    if (event.url.pathname === "/api/health") {
        return await resolve(event);
    }

    const requireLogin = isRequireLogin(event.cookies);

    const token = event.cookies.get("token");

    if (requireLogin) {

        if (event.url.pathname !== "/login") {
            console.log('redirecting to /login');
            throw redirect(302, "/login");
        } else {
            console.log('user already at /login, continue to', event.url.pathname)
            return await resolve(event);
        }
    } else {

        event.locals.user = getUser(event.cookies);
        event.locals.token = token!;

        console.log("authenticated user", event.locals.user);

        if (event.url.pathname.startsWith("/api")) {
            return await resolve(event);
        }

        if (event.url.pathname !== "/game") {
            console.log("redirecting", event.locals.user, "to /game");

            throw redirect(302, "/game");
        }
    }

    return await resolve(event);
}
