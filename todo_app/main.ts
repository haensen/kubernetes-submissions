import { Hono } from "@hono/hono";
import { exists } from "jsr:@std/fs/exists";

const app = new Hono();

const IMAGE_PATH = Deno.env.get("IMAGE_PATH");
const IMAGE_FILE = `${IMAGE_PATH}/image.png`;
const FETCH_TIME_FILE = `${IMAGE_PATH}/fetch_time.txt`;
const FETCH_TIME_INTERVAL = 1000 * 60 * 10;
const getImage = async () => {
    const fetchFileExists = await exists(FETCH_TIME_FILE);
    if (!fetchFileExists) {
        await Deno.writeTextFile(FETCH_TIME_FILE, "0");
    }
    const fetchTime = await Deno.readTextFile(FETCH_TIME_FILE);
    const lastFetchTime = parseInt(fetchTime);

    const imageExists = await exists(IMAGE_FILE);
    if (!imageExists || lastFetchTime + FETCH_TIME_INTERVAL < Date.now()) {
        await Deno.writeTextFile(FETCH_TIME_FILE, Date.now().toString());
        const image = await fetch("https://picsum.photos/600");
        await Deno.writeFile(IMAGE_FILE, image.body);
    }
    return await Deno.readFile(IMAGE_FILE);
}
app.get("/random-image", async (c) => {
    const image = await getImage();
    return c.body(image);
});

app.get("/", (c) => c.html(Deno.readTextFileSync("frontend.html")));

const PORT = Deno.env.get("PORT") || 8000;
Deno.serve({
    port: PORT,
    onListen: ({ port }) => {
        console.log(`Server started in port ${port}`);
    }
}, app.fetch);
