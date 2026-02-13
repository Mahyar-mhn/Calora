import { API_BASE } from "@/lib/api"
export default async function UsersPage() {
    const res = await fetch(`${API_BASE}/users`, { cache: "no-store" });
    const users = await res.json();

    return (
        <main style={{ padding: 24 }}>
            <h1>Users</h1>
            <pre>{JSON.stringify(users, null, 2)}</pre>
        </main>
    );
}

