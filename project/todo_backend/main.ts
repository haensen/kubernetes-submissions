import { Hono } from "@hono/hono";
import { cors } from "jsr:@hono/hono@4.6.5/cors";
import postgres from "postgres";

const sql = postgres();

await sql`CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, description TEXT)`;

const app = new Hono();
app.use("*", cors());

app.get("/todos", async (c) => {
    return c.json(await sql`SELECT description FROM todos`);
});

app.post("/todos", async (c) => {
    const todo = await c.req.json();
    await sql`INSERT INTO todos (description) VALUES (${todo.description})`;
    return c.json(todo);
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
