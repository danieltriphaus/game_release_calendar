import { convertFromDatastoreResult } from "@/api/datastore/convertFromDatastoreResult";
import { Datastore } from "@google-cloud/datastore";
import { getKeyFromDatastoreEntity } from "@/api/datastore/convertFromDatastoreResult";

it("should add id to a datastore result", () => {
    const result = [
        { [Datastore.KEY]: { name: "test" }, test: "test" },
        { [Datastore.KEY]: { id: "test" }, test: "test" },
    ];

    const convertedResult = convertFromDatastoreResult(result);

    expect(convertedResult[0].id).toBe("test");
    expect(convertedResult[1].id).toBe("test");
});

it("should return an empty array if no result is given", () => {
    const convertedResult = convertFromDatastoreResult(undefined);

    expect(convertedResult).toEqual([]);
});

it("should get the key from a datastore entity", () => {
    const entity = { [Datastore.KEY]: { name: "test" } };
    const entity2 = { [Datastore.KEY]: { id: "test" } };

    const key = getKeyFromDatastoreEntity(entity);
    const key2 = getKeyFromDatastoreEntity(entity2);

    expect(key.id).toBe("test");
    expect(key2.id).toBe("test");
});

it("should get the key from a datastore entity with a parent", () => {
    const entity = { [Datastore.KEY]: { name: "test", parent: { name: "parent" } } };
    const entity2 = { [Datastore.KEY]: { id: "test", parent: { id: "parent" } } };

    const key = getKeyFromDatastoreEntity(entity);
    const key2 = getKeyFromDatastoreEntity(entity2);

    expect(key.id).toBe("test");
    expect(key.parent).toBe("parent");
    expect(key2.id).toBe("test");
    expect(key2.parent).toBe("parent");
});

