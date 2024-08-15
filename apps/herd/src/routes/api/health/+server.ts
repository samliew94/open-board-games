export async function GET() {
    return new Response(JSON.stringify({ message: "ok" }), { status: 200 });
}
