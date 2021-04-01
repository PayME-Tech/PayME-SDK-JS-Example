const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // key is 16 length
const ivbyte = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
export const secretKey = 'de7bbe6566b0f1c38898b7751b057a94'

export const encrypt = (text, secretKey) => {
    // parse data into base64
    const iv = Buffer.from(ivbyte);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

export const decrypt = (text, secretKey) => {
    const iv = Buffer.from(ivbyte);
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(text, 'base64');
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}