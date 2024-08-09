
export async function POST({ cookies }) {
    cookies.delete("token", {
        path: "/",
        // secure: false,
    });

    return new Response();
}
