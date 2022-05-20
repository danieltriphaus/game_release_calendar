import { getIgdbAccessToken, clearLocalAccessToken } from "@/api/igdb/igdbAccessToken";
import axios from "axios";

jest.mock("axios");

it("should return return either local accessToken or get new one from igdb API", async () => {
    const tokenResponseFirst = {
        access_token: "prau3ol6mg5glgek8m89ec2s9q5i3i",
        expires_in: 5587808,
        token_type: "bearer",
    };

    const tokenResponseSecond = {
        access_token: "ol6mg5glgek8m89ec2s9q5i3i48wd6",
        expires_in: 5587808,
        token_type: "bearer",
    };

    axios.post.mockResolvedValueOnce({ data: tokenResponseFirst });

    const accessTokenFromApi = await getIgdbAccessToken();

    expect(accessTokenFromApi).toMatchObject(tokenResponseFirst);
    expect(axios.post).toHaveBeenCalled();

    const accessTokenLocal = await getIgdbAccessToken();
    expect(accessTokenLocal).toMatchObject(tokenResponseFirst);
    expect(axios.post).toBeCalledTimes(1);

    axios.post.mockResolvedValueOnce({ data: tokenResponseSecond });

    clearLocalAccessToken();
    const accessTokenAfterClear = await getIgdbAccessToken();
    expect(accessTokenAfterClear).toMatchObject(tokenResponseSecond);
    expect(axios.post).toHaveBeenCalledTimes(2);
});
