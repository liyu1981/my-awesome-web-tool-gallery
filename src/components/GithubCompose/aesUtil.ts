import * as aesjs from 'aes-js';
import * as pbkdf2 from 'pbkdf2';

const SALT = '6a41ceaf363398c62d65c26b35afe3a5';
const IV = [25, 35, 34, 33, 30, 27, 21, 32, 36, 24, 22, 23, 31, 26, 29, 28];
const segmentSize = 8;

function normalize(value: string, segmentSize: number) {
  const reminder = value.length % segmentSize;
  if (reminder === 0) {
    return value;
  } else {
    const paddingSpaces = Array(reminder).fill(' ').join('');
    return `${value}${paddingSpaces}`;
  }
}

function password2Key(password: string) {
  return pbkdf2.pbkdf2Sync(password, SALT, 1, 128 / 8, 'sha512');
}

export function encrypt(value: string, password: string) {
  const key = password2Key(password);
  const text = normalize(value, segmentSize);
  const textBytes = aesjs.utils.utf8.toBytes(text);
  const aesCfb = new aesjs.ModeOfOperation.cfb(key, IV, segmentSize);
  const encryptedBytes = aesCfb.encrypt(textBytes);
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}

export function decrypt(encrypted: string, password: string) {
  const key = password2Key(password);
  const encryptedBytes = aesjs.utils.hex.toBytes(encrypted);
  const aesCfb = new aesjs.ModeOfOperation.cfb(key, IV, segmentSize);
  const decryptedBytes = aesCfb.decrypt(encryptedBytes);
  const decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText.trim();
}
