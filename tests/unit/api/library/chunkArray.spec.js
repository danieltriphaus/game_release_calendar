import { chunkArray } from "@/api/library/chunkArray";

it("should return a new array with the elements of the given size", () => {
    expect(chunkArray([1, 2, 3, 4], 2)).toMatchObject([[1, 2], [3, 4]]);
    expect(chunkArray([1, 2, 3], 2)).toMatchObject([[1, 2], [3]]);
    expect(chunkArray([1, 2, 3], 0)).toMatchObject([1, 2, 3]);
});