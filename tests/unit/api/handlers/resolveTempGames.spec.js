import { getContext } from "../expressMocks";

import { resolveTempGames } from "@/api/handlers/cron/resolveTempGames";

const temporaryGames = [
    { id: "6WjXhK3Iec1C9UwTBqJhH", name: "Temporary Game" },
    { id: "AlmOOzteIjx_Mp-z1Yk-o", name: "The Entropy Center " },
    { id: "I65f84e9zp5TvPq5AazPy", name: "Test" },
    { id: "KuxWksjR89LBvSrj-rTUa", name: "temp game" },
    { id: "RZBPa9fesp_tqmUE4u0cN", name: "Test" },
    { id: "X_CjLH0oTxViFW4gxRKo8", name: "Temporary Game 02" },
    { id: "fVhfoACeiklFJHDR4xHCJ", name: "" },
    { id: "iZTcKHw1OYlhmsAXNSjzu", name: "Routine" },
    { id: "qmMoHXQYP1GCl_dElDesF", name: "The Last of Us Part I" },
    { id: "r9tQTmw2zSbqe526LIJhe", name: "temp game 12" },
    { id: "vnPazkU1wzGTfO8LEhymA", name: "Witchfire" },
];

jest.mock("@/api/datastore/getTemporaryGames.js");

it("should", async () => {
    // const context = getContext();
    expect(true).toBeTruthy();

});