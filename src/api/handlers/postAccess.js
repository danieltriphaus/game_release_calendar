export const postAccess = (context, req, res) => {
    if (req.body.apiKey === process.env.API_KEY) {
        res.cookie("api_key", req.body.apiKey);
        res.status(200).json();
    } else {
        res.status(401).json({ error: "invalid_api_key", message: "Invalid API Key" });
    }
};
