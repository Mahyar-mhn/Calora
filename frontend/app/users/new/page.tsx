"use client";
import { API_BASE } from "@/lib/api"
import { useState } from "react";

export default function NewUserPage() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string>("");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setResult(null);

        const res = await fetch(`${API_BASE}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name }),
        });

        if (!res.ok) {
            setError(`Request failed: ${res.status}`);
            return;
        }

        setResult(await res.json());
        setEmail("");
        setName("");
    }

    return (
        <main style={{ padding: 24 }}>
            <h1>Create User</h1>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, maxWidth: 360 }}>
                <label>
                    Email
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: 8, display: "block" }}
                        required
                    />
                </label>

                <label>
                    Name
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: "100%", padding: 8, display: "block" }}
                        required
                    />
                </label>

                <button type="submit" style={{ padding: 10 }}>
                    Create
                </button>
            </form>

            {error && <p style={{ color: "crimson" }}>{error}</p>}
            {result && (
                <>
                    <h2>Created</h2>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </>
            )}
        </main>
    );
}

