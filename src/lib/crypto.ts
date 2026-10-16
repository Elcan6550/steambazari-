import crypto from 'crypto';

// Secret key must be 32 bytes (256 bits). If from hex, convert from hex, otherwise sha256 of string.
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET_KEY || 'default-super-secret-key-32-chars-long!';
  if (secret.length === 64 && /^[0-9a-fA-F]+$/.test(secret)) {
    return Buffer.from(secret, 'hex');
  }
  return crypto.createHash('sha256').update(secret).digest();
}

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

/**
 * Encrypt sensitive text (passwords, tokens, backup codes) using AES-256-GCM
 */
export function encryptText(plainText: string): string {
  if (!plainText) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  // Format: iv:tag:encrypted
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt sensitive text encrypted with AES-256-GCM
 */
export function decryptText(encryptedPayload: string): string {
  if (!encryptedPayload) return '';
  try {
    const parts = encryptedPayload.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted format');
    }

    const [ivHex, tagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '[Şifrə açılması mümkün olmadı]';
  }
}

/**
 * Mask sensitive string for safe UI display (e.g. j***@gmail.com or Pa****word)
 */
export function maskSensitive(str: string, isEmail = false): string {
  if (!str) return '***';
  if (isEmail) {
    const [user, domain] = str.split('@');
    if (!domain) return str.slice(0, 2) + '***';
    const maskedUser = user.length > 2 ? user[0] + '***' + user[user.length - 1] : user[0] + '***';
    return `${maskedUser}@${domain}`;
  }
  if (str.length <= 4) return '****';
  return str.slice(0, 2) + '****' + str.slice(-2);
}
