import { Hono } from "@hono/hono";
import { cors } from "jsr:@hono/hono@4.6.5/cors";
import postgres from "postgres";

const sql = postgres();

let ready = false;
while (!ready) {
    try {
        await sql`CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, description TEXT)`;
        ready = true;
    } catch (e) {
        console.error(e);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

const app = new Hono();
app.use("*", cors());

app.get("/healthz", async (c) => {
    try {
        await sql`SELECT 1`;
    } catch (e) {
        console.error(e);
        return c.text("ERROR", 500);
    }
    return c.text("OK");
});

// To pass gcloud health check
app.get("/", async (c) => {
    return c.text("Hello World");
});

app.get("/todos", async (c) => {
    return c.json(await sql`SELECT description FROM todos`);
});

app.post("/todos", async (c) => {
    const todo = await c.req.json();
    console.log(`POST /todos: ${JSON.stringify(todo)}`);
    if (!todo.description || todo.description.length > 140) {
        console.log("Invalid todo");
        return c.json({ error: "Description is required and must be less than 140 characters" }, 400);
    }
    console.log(`Inserting todo`);
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
