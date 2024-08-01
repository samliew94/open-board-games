import { dev } from "$app/environment";

export async function POST({ cookies }) {
    cookies.delete("token", {
        path: "/",
        secure: !dev,
    });

    return new Response();
}
