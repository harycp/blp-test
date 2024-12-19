const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const secretKey = crypto
  .createHash("sha256")
  .update(process.env.SECRET)
  .digest();
const iv = crypto.randomBytes(16);

exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

exports.decrypt = (encryptedText) => {
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedTextBuffer = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedTextBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
