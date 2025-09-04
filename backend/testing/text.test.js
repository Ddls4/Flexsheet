// npm test
// export { suma };
// import {suma} from "../funciones.js"

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
    expect(process.env.P_IP).toBe("192.168.0.19");
    expect(process.env.P_IP).not.toBe("");
    expect(process.env.P_IP).toBeDefined();
})
test("Testing del DOTENV: S_IP", () => {
    expect(process.env.S_IP).toBe("localhost");
    expect(process.env.S_IP).not.toBe("");
    expect(process.env.S_IP).toBeDefined();
})

// Testing Mongo | Mysql
test("Testing del DOTENV / Mysql ", () => {
    expect(process.env.S_USER).toBe("grupoddfjg");
    expect(process.env.S_CEN).toBe("superMaster7!");
    expect(process.env.S_DB).toBe("ddfjg");
})

// Testingo crons ""rutas"" realmente es "la informacion que pasa por estas" 

// Testingo Fronend