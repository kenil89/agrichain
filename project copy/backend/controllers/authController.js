const { generateOTP } = require('../utils/otpGenerator');

exports.login = async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) return res.status(400).json({ message: "Wallet address required" });

    // Mock OTP for example
    const otp = generateOTP();
    
    res.json({ walletAddress, otp, message: "Login OTP generated (mock)" });
};
    