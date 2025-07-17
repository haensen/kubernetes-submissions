import { Hono } from "@hono/hono";
import { cors } from "jsr:@hono/hono@4.6.5/cors";

const app = new Hono();
app.use("*", cors());

let todos = [];

app.get("/todos", async (c) => {
    return c.json(todos);
});

app.post("/todos", async (c) => {
    const todo = await c.req.json();
    todos.push(todo);
    return c.json(todo);
});

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
