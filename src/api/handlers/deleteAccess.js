export const deleteAccess = (context, req, res) => {
    res.cookie("auth_key", "", { maxAge: 0 });
    req.logout(function (err) {
        if (err) {
            throw err;
        } else {
            res.status(200).end();
        }
    });
};
