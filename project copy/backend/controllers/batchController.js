exports.logTransfer = async (req, res) => {
    const { batchId, from, to, timestamp } = req.body;

    // Since smart contracts handle the real transfer, this is just optional logging
    res.json({
        batchId,
        from,
        to,
        timestamp,
        message: "Transfer logged (for monitoring / optional)"
    });
};
