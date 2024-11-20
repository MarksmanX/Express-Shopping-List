process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let ITEMS = require("../fakeDb");
const Test = require("supertest/lib/test");

let newItem = { name: "golfball", price: 1.45 };

beforeEach(function() {
    ITEMS.push(newItem);
});

afterEach(function() {
    ITEMS.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({items: [{ name: "golfball", price: 1.45}]});
    })
})

describe("GET /items/:name", () => {
    test("Gets a single item by name", async () => {
        const res = await request(app).get(`/items/${newItem.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"item": { name: "golfball", price: 1.45}});
    })
    test("Responds with 404 if item is not found", async () => {
        const res = await request(app).get('/items/nonexistent');
        expect(res.statusCode).toBe(404);
    })
})

describe("POST /items", () => {
    test("Creating a user", async () => {
        const newItem = { name: "popsicle", price: 4.35}; 
        const res = await request(app)
            .post("/items")
            .send(newItem);

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: newItem });
        expect(ITEMS).toContainEqual(newItem);
    });
})

// Where I need to fix.
describe("/PATCH /items/:name", () => {
    test("Updating an item's name", async () => {
        const res = (await request(app)
            .patch(`/items/golfball`)
            .send({name: "popsicle", price: 5.00})
            .expect(200));
        expect(res.body).toEqual({
            updated: {
                name: "popsicle",
                price: 5.00
            }
        });
    });
    test("Responds with 404 for invalid item name", async () => {
        const res = (await request(app)
            .patch(`/items/electricity`)
            .send({ name: "new name" })
            .expect(404));     
    });
})

describe("/DELETE /items/:name", () => {
    test("Deletes a single item", async function () {
        const res = await request(app).delete(`/items/${newItem.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: `Deleted ${newItem.name}` })
    });
    test("Responds with 404 for an invalid item name", async () => {
        const res = await request(app).delete('/items/nonexistent');
        expect(res.statusCode).toBe(404);
    });
})