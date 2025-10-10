// npm test
// export { suma };
// import {suma} from "../funciones.js"
import mongoose from "mongoose";
import { config } from "dotenv";

config();

// Testing DOTENV
test("Testing del DOTENV: PORT", () => {
    expect(process.env.PORT).toBe("80");
    expect(process.env.PORT).not.toBe("");
    expect(process.env.PORT).toBeDefined();
})
test("Testing del DOTENV: PORT_W", () => {
    expect(process.env.PORT_W).toBe("9000");
    expect(process.env.PORT_W).not.toBe("");
    expect(process.env.PORT_W).toBeDefined();
})
test("Testing del DOTENV: P_IP", () => {
    expect(process.env.P_IP).toBe(process.env.P_IP);
    expect(process.env.P_IP).not.toBe("");
    expect(process.env.P_IP).toBeDefined();
})

// Testingo crons ""rutas"" realmente es "la informacion que pasa por estas" 
// db.js o en tu index.js

describe("Testing conexión con MongoDB usando Mongoose", () => {
    beforeAll(async () => {
        await mongoose.connect("mongodb+srv://DDFJG:culo123@cluster0.lwg6hol.mongodb.net/ddfjg?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    test("La base de datos debería estar conectada", () => {
        const state = mongoose.connection.readyState;
        expect(state).toBe(1); // 1 = connected
    });
});
