const crypto = require('crypto');

const ivbyte = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function determineAlthorithm(key) {
  let defaultAL = 'aes-128-cbc';
  const keyLength = key.length;

  if (keyLength === 32) {
    defaultAL = 'aes-256-cbc';
  }
  return defaultAL;
}

export function encrypt(text, secretKey) {
  // parse data into base64
  const iv = Buffer.from(ivbyte);
  const algorithm = determineAlthorithm(secretKey);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

export function decrypt(text, secretKey) {
  const iv = Buffer.from(ivbyte);
  const algorithm = determineAlthorithm(secretKey);
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(text, 'base64');
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
