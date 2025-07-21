import { Hono } from "@hono/hono";
import { cors } from "jsr:@hono/hono@4.6.5/cors";
import { connect as connectNats, StringCodec } from "nats";
import { v4 } from "uuid";

const uuid = v4();

const natsUrl = Deno.env.get("NATS_URL");
const natsConnection = await connectNats({ servers: natsUrl });
const sc = StringCodec();
const sub = natsConnection.subscribe("todo", { queue: "todo"});
setTimeout(async () => {
    for await (const msg of sub) {
        const todo = JSON.parse(sc.decode(msg.data));
        console.log(`${uuid} received todo: ${JSON.stringify(todo)}`);
        if (!Deno.env.get("WEBHOOK_URL")) {
            console.log(`${uuid} WEBHOOK_URL is not set, skipping webhook`);
            continue;
        }
        console.log(`${uuid} sending webhook to ${Deno.env.get("WEBHOOK_URL")}`);
        await fetch(Deno.env.get("WEBHOOK_URL"), {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({content: JSON.stringify(todo)})
        }).then(res => {
            console.log(`${uuid} webhook response: ${res.status}, ${res.text()}`);
        }).catch(err => {
            console.error(`${uuid} webhook error: ${err}`);
        });
    }
}, 0);

const app = new Hono();
app.use("*", cors());

app.get("/healthz", async (c) => {
    return c.text("OK");
});

const PORT = Deno.env.get("HEALTHZ_PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`${uuid} Server started in port ${port}`);
    }
}, app.fetch);
