import { Hono } from "@hono/hono";
import { cors } from "jsr:@hono/hono@4.6.5/cors";
import postgres from "postgres";
import { connect as connectNats, StringCodec } from "nats";

const sql = postgres();

let ready = false;
while (!ready) {
    try {
        await sql`CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, description TEXT, completed BOOLEAN)`;
        ready = true;
    } catch (e) {
        console.error(e);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

const natsUrl = Deno.env.get("NATS_URL");
const natsConnection = await connectNats({ servers: natsUrl });
const sc = StringCodec();

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
    return c.json(await sql`SELECT * FROM todos`);
});

app.post("/todos", async (c) => {
    const todo = await c.req.json();
    console.log(`POST /todos: ${JSON.stringify(todo)}`);
    if (!todo.description || todo.description.length > 140) {
        console.log("Invalid todo");
        return c.json({ error: "Description is required and must be less than 140 characters" }, 400);
    }
    console.log(`Inserting todo`);
    const result = (await sql`INSERT INTO todos (description, completed) VALUES (${todo.description}, FALSE) RETURNING *`)[0];
    await natsConnection.publish("todo", sc.encode(JSON.stringify({
        event: "created",
        ...result
    })));
    return c.json(result);
});

app.put("/todos/:id", async (c) => {
    const id = c.req.param("id");
    const todo = await c.req.json();
    const result = (await sql`UPDATE todos SET description = ${todo.description}, completed = ${todo.completed} WHERE id = ${id} RETURNING *`)[0];
    await natsConnection.publish("todo", sc.encode(JSON.stringify({
        event: "updated",
        ...result
    })));
    return c.json(result);
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
