import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { z } from "zod";
import { login } from "../../server/auth/auth.server.js";

// Define outside the load function so the adapter can be cached
const schema = z.object({
    username: z
        .string()
        .min(2, { message: "Username is required" })
        .max(10, { message: "Username is too long" })
        .default("SAM")
        .transform((val) => val.toUpperCase()),
    room: z
        .string()
        .min(1, { message: "room is required" })
        .max(6, { message: "room is too long" })
        .default("123")
        .transform((val) => val.toUpperCase()),
});

export const load = async () => {
    const form = await superValidate(zod(schema));

    // Always return { form } in load functions
    return { form };
};

export const actions = {
    default: async ({ request, cookies }) => {
        await new Promise((r) => setTimeout(r, 1000));

        const form = await superValidate(request, zod(schema));

        if (!form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { form });
        }

        // check against in-memory database...
        const { username, room } = form.data;

        try {
            const token = await login(username, room);

            console.log("valid credentials. Generating access token", token);

            cookies.set("token", token, {
                path: "/",
                maxAge: 3153600000,
            });
        } catch (error: any) {
            return message(form, { error: error?.message }, { status: 400 });
        }

        // Display a success status message
        return message(form, { status: 200 });
    },
};
