export const postAccess = (context, req, res) => {
    res.status(200).json({ operationId: context.operation.operationId });
};
