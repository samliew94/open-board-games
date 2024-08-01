export async function logout(callback?: () => void) {
    const res = await fetch("/api/logout", {
        method: "POST",
    });

    if (res.ok && callback) {
        callback();
    }
}
