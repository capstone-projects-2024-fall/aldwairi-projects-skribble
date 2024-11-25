import CryptoJS from 'crypto-js';

export interface EncryptionResult {
    iv: CryptoJS.lib.WordArray;
    ciphertext: string;
}

export class Encryption {
    /**
     * Encrypts data using AES/CBC/PKCS7Padding.
     *
     * @param data - data to encrypt
     * @param key - key used during encryption
     * @returns EncryptionResult - object containing IV and ciphertext
     * @throws Error if either data or key are null
     */
    static encrypt(data: string, key: CryptoJS.lib.WordArray): EncryptionResult {
        
        if (!data || !key) {
            throw new Error('Data and key must not be null or undefined.');
        }

        const iv: CryptoJS.lib.WordArray = CryptoJS.lib.WordArray.random(16);

        const encrypted: CryptoJS.lib.CipherParams = CryptoJS.AES.encrypt(
            data,
            key,
            {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );

        return {
            iv,
            ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64),
        };
    }

    /**
     * Decrypts data using AES/CBC/PKCS7Padding.
     *
     * @param key - key used during encryption
     * @param iv - iv used during encryption
     * @param ciphertext - ciphertext to decrypt
     * @returns decrypted data
     * @throws Error if either key, iv, or ciphertext are null
     */
    static decrypt(key: CryptoJS.lib.WordArray, iv: CryptoJS.lib.WordArray, ciphertext: string): string {

        if (!key || !iv || !ciphertext) {
            throw new Error('Key, IV, and ciphertext must not be null or undefined.');
        }

        const decrypted = CryptoJS.AES.decrypt(
            ciphertext,
            key,
            {
                iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
            }
        );

        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    /**
     * Generates a SecretKey from a password and salt using PBKDF2.
     *
     * @param password - password for key derivation
     * @param salt - salt for key derivation
     * @returns key - used during decryption
     * @throws Error if password or salt are null/undefined
     */
    static generateKeyFromPassword(password: string, salt: string): CryptoJS.lib.WordArray {

        if (!password || !salt) {
            throw new Error('Password and salt must not be null or undefined.');
        }

        return CryptoJS.PBKDF2(
            password,
            CryptoJS.enc.Base64.parse(salt),
            {
                keySize: 256 / 32, // 256 bits
                iterations: 600000,
                hasher: CryptoJS.algo.SHA256,
            }
        );
    }

    /**
     * Generates a random salt of specified length. Note the result is a string of double length.
     *
     * @param length - length of the salt in bytes
     * @returns salt - randomly generated word array as a string
     */
    static generateSalt(length: number = 10) {
        const saltWordArray = CryptoJS.lib.WordArray.random(length);
        return saltWordArray.toString();
    }
}
