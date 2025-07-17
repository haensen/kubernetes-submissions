import { Hono } from "@hono/hono";
import postgres from "postgres";

const sql = postgres();

await sql`CREATE TABLE IF NOT EXISTS ping_pong (count INTEGER)`;

const result = await sql`SELECT count FROM ping_pong`;
if (result.length === 0) {
    await sql`INSERT INTO ping_pong (count) VALUES (0)`;
}

const app = new Hono();

app.get("/pingpong", async (c) => {
    const result = await sql`SELECT count FROM ping_pong`;
    const count = result[0]?.count + 1;
    await sql`UPDATE ping_pong SET count = ${count}`;
    return c.text(`pong ${count}`);
});

app.get("/pings", async (c) => {
    const result = await sql`SELECT count FROM ping_pong`;
    const count = result[0]?.count ?? 0;
    return c.text(`Ping / Pongs: ${count}`);
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
