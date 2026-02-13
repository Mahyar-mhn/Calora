import ThemeToggle from "@/components/theme-toggle"
import { API_BASE } from "@/lib/api"
export default async function UsersPage() {
    const res = await fetch(`${API_BASE}/users`, { cache: "no-store" });
    const users = await res.json();

    return (
        <main style={{ padding: 24 }}>
            <div className="mb-4 flex items-center justify-between">
                <h1>Users</h1>
                <ThemeToggle />
            </div>
            <pre>{JSON.stringify(users, null, 2)}</pre>
        </main>
    );
}

