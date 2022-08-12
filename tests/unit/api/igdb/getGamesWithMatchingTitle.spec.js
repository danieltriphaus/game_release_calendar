import { getFullQuery } from "@/api/igdb/getGamesWithMatchingTitle.js";

it("should create valid query from given titles", () => {

    const titles = [
        "Romeo and Juliett",
        "The Tempest",
        "MacBeth",
    ];
    const fullQuery = getFullQuery(titles);

    titles.forEach((title) => {
        expect(fullQuery).toStrictEqual(expect.stringContaining(title));
    });

    expect(fullQuery.endsWith(";")).toBeTruthy();
    expect(fullQuery).toContainNTimes("\\|", titles.length - 1);
});