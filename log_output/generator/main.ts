const FILE = Deno.env.get("FILE");

const createRandomString = () => {
    return Math.random().toString(36).substring(2);
}

const randomString = createRandomString();

setInterval(() => {
    Deno.writeTextFileSync(FILE, `${new Date().toISOString()}: ${randomString}`);
}, 5000);
