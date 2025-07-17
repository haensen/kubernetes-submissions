const TODO_POST_URL = Deno.env.get("TODO_POST_URL");
const response = await fetch("https://en.wikipedia.org/wiki/Special:Random");
console.log(response);
await fetch(TODO_POST_URL, {
    method: "POST",
    body: JSON.stringify({
        description: `Read ${response.url}`,
    }),
});
