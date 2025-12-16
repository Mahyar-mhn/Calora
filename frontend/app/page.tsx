export default async function Home() {
  const res = await fetch("http://localhost:8080/users", { cache: "no-store" });
  const users = await res.json();

  return (
      <main style={{ padding: 24 }}>
        <h1>Users</h1>
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </main>
  );
}
