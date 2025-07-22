const MailOtpTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>Your OTP Code</h2>
    <p>Use the following OTP to complete your verification:</p>
    <div style="font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">${otp}</div>
    <p>This OTP is valid for 15 minutes.</p>
    <p>If you didn't request this, you can ignore this email.</p>
    <br>
    <small>— Bestport</small>
  </div>
`;

module.exports = MailOtpTemplate