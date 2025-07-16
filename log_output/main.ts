const createRandomString = () => {
    return Math.random().toString(36).substring(2);
}

const randomString = createRandomString();

setInterval(() => {
    console.log(`${new Date().toISOString()}: ${randomString}`);
}, 5000);
