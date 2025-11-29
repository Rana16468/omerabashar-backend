import speakeasy from "speakeasy";
import QRCode from "qrcode";
import crypto from "crypto";
import users from "./users.model";
import AppError from "../../errors/AppError";
import status from "http-status";

class TwoFactorService {
  /**
   * Generate 2FA secret and QR code for user
   */
  async generateTwoFactorSecret(userId: string, email: string) {
    const user = await users.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `YourApp (${email})`,
      issuer: "YourApp",
      length: 32,
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url as string);

    // Save secret to user (but don't enable 2FA yet)
    await users.findByIdAndUpdate(userId, {
      twoFactorSecret: secret.base32,
    });
    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntryKey: secret.base32,
    };
  }

  /**
   * Verify 2FA token and enable 2FA for user
   */
  async enableTwoFactor(userId: string) {
    const user = await users.findById(userId);
    if (!user || !user.twoFactorSecret) {
      throw new AppError(
        status.NOT_EXTENDED,
        "2FA secret not found. Generate secret first.",
      );
    }

    // Verify the token
    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      //token : send the 6 digit code
      // that is altranative
      token: speakeasy.totp({
        secret: user.twoFactorSecret,
        encoding: "base32",
      }),
      window: 2, // Allow 2 time steps before and after
    });

    if (!isValid) {
      throw new AppError(status.NOT_EXTENDED, "Invalid verification code");
    }

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(10);
    const hashedBackupCodes = backupCodes.map((code) =>
      crypto.createHash("sha256").update(code).digest("hex"),
    );

    // Enable 2FA
    await users.findByIdAndUpdate(userId, {
      twoFactorEnabled: true,
      twoFactorBackupCodes: hashedBackupCodes,
    });

    return {
      success: true,
      backupCodes, // Return plain codes only once for user to save
    };
  }

  /**
   * Verify 2FA token during login
   */
  async verifyTwoFactorToken(userId: string) {
    const user = await users.findById(userId).select("+twoFactorSecret");
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new AppError(
        status.NOT_EXTENDED,
        "2FA is not enabled for this user",
      );
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: speakeasy.totp({
        secret: user?.twoFactorSecret,
        encoding: "base32",
      }),
      window: 2,
    });

    return isValid;
  }

  /**
   * Verify backup code
   */
  async verifyBackupCode(userId: string) {
    const user = await users.findById(userId).select("+twoFactorBackupCodes");

    if (!user || !user.twoFactorEnabled || !user.twoFactorBackupCodes) {
      throw new AppError(
        status.NOT_IMPLEMENTED,
        "2FA is not enabled for this user",
      );
    }
    const codeIndex = user.twoFactorBackupCodes.indexOf(
      user.twoFactorBackupCodes[user.twoFactorBackupCodes.length - 1],
    );

    if (codeIndex === -1) {
      return false;
    }
    user.twoFactorBackupCodes.splice(codeIndex, 1);
    await user.save();

    return true;
  }

  /**
   * Disable 2FA for user
   */
  async disableTwoFactor(userId: string) {
    const isValid = await this.verifyTwoFactorToken(userId);

    if (!isValid) {
      throw new Error("Invalid verification code");
    }

    await users.findByIdAndUpdate(userId, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: [],
    });

    return { success: true };
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(count: number): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString("hex").toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(userId: string) {
    const isValid = await this.verifyTwoFactorToken(userId);

    if (!isValid) {
      throw new AppError(status.NOT_FOUND, "Invalid verification code");
    }

    const backupCodes = this.generateBackupCodes(10);
    const hashedBackupCodes = backupCodes.map((code) =>
      crypto.createHash("sha256").update(code).digest("hex"),
    );

    await users.findByIdAndUpdate(userId, {
      twoFactorBackupCodes: hashedBackupCodes,
    });

    return { backupCodes };
  }
}

export default new TwoFactorService();
