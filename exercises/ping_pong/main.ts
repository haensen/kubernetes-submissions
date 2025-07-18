import { Hono } from "@hono/hono";
import postgres from "postgres";

const sql = postgres();

while (true) {
    try {
        await sql`CREATE TABLE IF NOT EXISTS ping_pong (count INTEGER)`;
        break;
    } catch (e) {
        console.error(e);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
}

const result = await sql`SELECT count FROM ping_pong`;
if (result.length === 0) {
    await sql`INSERT INTO ping_pong (count) VALUES (0)`;
}

const app = new Hono();

app.get("/", async (c) => {
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

app.get("/healthz", (c) => {
    return c.text("OK");
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
