/* eslint-disable sonarjs/no-duplicate-string */
import { gameTitleMatcher } from "@/api/library/gameTitleMatcher.js";

it("should return empty array given nothing", () => {
    const gtm = gameTitleMatcher([]);
    gtm.matchAgainst([]);
    expect(gtm.getMatches()).toStrictEqual([]);
});

it("should not have the same match twice", () => {
    const { temporaryGames, igdbGames, matches } = getTestDataEqualNames();

    const gtm = gameTitleMatcher(temporaryGames);
    gtm.matchAgainst(igdbGames);

    expect(gtm.getMatches()).toMatchObject(matches);

    gtm.matchAgainst(igdbGames);

    expect(gtm.getMatches()).toMatchObject(matches);
});

it("should try to match games whose names are equal", () => {
    const { temporaryGames, igdbGames, matches } = getTestDataEqualNames();

    const gtm = gameTitleMatcher(temporaryGames);
    gtm.matchAgainst(igdbGames);

    expect(gtm.getMatches()).toMatchObject(matches);
});

function getTestDataEqualNames() {
    const matches = [
        { temporaryGameId: "tr413adwa", igdbGameId: 123 },
        { temporaryGameId: "dwa4543", igdbGameId: 456 },
    ];
    const temporaryGames = [
        { id: "dwajdaint", name: "Super Mario" },
        { id: matches[0].temporaryGameId, name: "Spelunky" },
        { id: matches[1].temporaryGameId, name: "Sailor Moon" },
    ];
    const igdbGames = [
        { id: 8435, name: "Horizon: Zero Dawn" },
        { id: matches[1].igdbGameId, name: "Sailor Moon" },
        { id: matches[0].igdbGameId, name: "Spelunky" },
    ];
    return { temporaryGames, igdbGames, matches };
}

it("should match ignoring case", () => {
    const { temporaryGames, igdbGames, matches } = getTestDataIgnoringCase();

    const gtm = gameTitleMatcher(temporaryGames);
    gtm.matchAgainst(igdbGames);

    expect(gtm.getMatches()).toMatchObject(matches);
});

function getTestDataIgnoringCase() {
    const matches = [
        { temporaryGameId: "tr413adwa", igdbGameId: 123 },
        { temporaryGameId: "dwa4543", igdbGameId: 456 },
    ];
    const temporaryGames = [
        { id: "dwajdaint", name: "Super Mario" },
        { id: matches[0].temporaryGameId, name: "spelunky" },
        { id: matches[1].temporaryGameId, name: "Sailor Moon" },
    ];
    const igdbGames = [
        { id: 8435, name: "Horizon: Zero Dawn" },
        { id: matches[1].igdbGameId, name: "sailor moon" },
        { id: matches[0].igdbGameId, name: "Spelunky" },
    ];
    return { temporaryGames, igdbGames, matches };
}

it("should match ignoring special characters", () => {
    const { temporaryGames, igdbGames, matches } = getTestDataIgnoringSpecialCharacters();

    const gtm = gameTitleMatcher(temporaryGames);
    gtm.matchAgainst(igdbGames);

    expect(gtm.getMatches()).toMatchObject(matches);
});

function getTestDataIgnoringSpecialCharacters() {
    const matches = [
        { temporaryGameId: "vnPazkU1wzGTfO8LEhymA", igdbGameId: 8435 },
        { temporaryGameId: "X_CjLH0oTxViFW4gxRKo8", igdbGameId: 84789 },
        { temporaryGameId: "iwifqiingeapina", igdbGameId: 4568 },
    ];
    const temporaryGames = [
        { id: "dwajdaint", name: "Super Mario" },
        { id: matches[0].temporaryGameId, name: "Horizon Zero Dawn" },
        { id: matches[1].temporaryGameId, name: "Metal Gear Rising: Revengeance" },
        { id: matches[2].temporaryGameId, name: "Where the Winds meet" },
        { id: "8923hngsnaint", name: "You shall not pass" },
    ];
    const unmatchedTemporaryGames = [temporaryGames[0], temporaryGames[4]];
    const igdbGames = [
        { id: matches[0].igdbGameId, name: "Horizon: Zero Dawn" },
        { id: 7894, name: "Sailor Moon" },
        { id: 6584, name: "Spelunky" },
        { id: matches[1].igdbGameId, name: "Metal Gear Rising Revengeance" },
        { id: matches[2].igdbGameId, name: "Where Winds Meet" },
    ];

    return { temporaryGames, igdbGames, matches, unmatchedTemporaryGames };
}

it("should replace temporaryGameIds with corresponding igdbGameIds in an Array", () => {
    const { temporaryGames, igdbGames, matches } = getTestDataIgnoringSpecialCharacters();

    const gtm = gameTitleMatcher(temporaryGames);
    gtm.matchAgainst(igdbGames);

    const gameIdArray = [
        456, 7897, "vnPazkU1wzGTfO8LEhymA", 789, "X_CjLH0oTxViFW4gxRKo8", 9, "iwifqiingeapina", "dwasdwa",
    ];

    const temporaryGameIds = matches.map((match) => match.temporaryGameId);
    const igdbGameIds = matches.map((match) => match.igdbGameId);

    const resultArray = gtm.replaceTemporaryGameIds(gameIdArray);

    expect(resultArray).not.toStrictEqual(expect.arrayContaining(temporaryGameIds));
    expect(resultArray).toStrictEqual(expect.arrayContaining(igdbGameIds));
});

it("should return unmatched gameIds", () => {
    const { temporaryGames, igdbGames, unmatchedTemporaryGames } = getTestDataIgnoringSpecialCharacters();

    const gtm = gameTitleMatcher(temporaryGames);
    gtm.matchAgainst(igdbGames);

    expect(gtm.getUnmatchedTemporaryGames()).toStrictEqual(unmatchedTemporaryGames);
});


