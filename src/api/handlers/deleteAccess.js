export const deleteAccess = (context, req, res) => {
    res.cookie("auth_key", "", { maxAge: 0 });
    res.status(200).end();
};
