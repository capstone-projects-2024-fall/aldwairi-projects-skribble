import {Encryption} from './Encryption';
import CryptoJS from "crypto-js";

describe('Encryption', () => {

    let salt: string = Encryption.generateSalt();
    let password: string = 'password';
    let key: CryptoJS.lib.WordArray = Encryption.generateKeyFromPassword(password, salt);

    describe('Encryption and Decryption Tests', () => {

        /**
         * Generates a random string of specified length using printable ASCII characters.
         *
         * @param length - The length of the string to generate.
         * @returns A randomly generated string consisting of printable ASCII characters.
         */
        function generateRandomString(length: number): string {
            let result = '';
            for (let i = 0; i < length; i++) {
                // Printable ASCII characters range from 33 ('!') to 126 ('~')
                const randomAscii = 33 + Math.floor(Math.random() * 94); // 94 possible characters
                result += String.fromCharCode(randomAscii);
            }
            return result;
        }

        const encryptionTestData: string[] = ['Short text', 'A longer piece of text to test the encryption and decryption functionality.', generateRandomString(1024),];

        test.each(encryptionTestData)('Encrypt and Decrypt: "%s"', (data) => {

            // act
            const encryptedData = Encryption.encrypt(data, key);
            const decryptedData = Encryption.decrypt(key, encryptedData.iv, encryptedData.ciphertext);

            // assert
            expect(decryptedData).toEqual(data);
        });

        test('Encrypting the same data multiple times produces different ciphertexts', () => {

            // setup
            const data = 'my secret';

            // act
            const encryptedData1 = Encryption.encrypt(data, key);
            const encryptedData2 = Encryption.encrypt(data, key);

            // assert
            expect(encryptedData1.iv).not.toEqual(encryptedData2.iv);
            expect(encryptedData1.ciphertext).not.toEqual(encryptedData2.ciphertext);
        });
    });

    describe('Key Generation Tests', () => {
        test('Key generation consistency with same password and salt', () => {
            const newKey = Encryption.generateKeyFromPassword(password, salt);
            expect(newKey.toString()).toEqual(key.toString());
        });

        test('Key generation with different salts produces different keys', () => {
            const newSalt = Encryption.generateSalt();
            const newKey = Encryption.generateKeyFromPassword(password, newSalt);
            expect(newKey).not.toEqual(key);
        });

        test('Key generation with different passwords produces different keys', () => {
            const newPassword = 'newPassword';
            const newKey = Encryption.generateKeyFromPassword(newPassword, salt);
            expect(newKey).not.toEqual(key);
        });
    });

    describe('Salt Generation Tests', () => {
        test('Salt is of correct default length', () => {
            expect(salt.length).toBe(20);
        });

        const saltLengths = [8, 16, 32];

        test.each(saltLengths)('Salt generation with specified length: %i bytes', (length) => {
            const generatedSalt = Encryption.generateSalt(length);
            expect(generatedSalt.length).toBe(length * 2);
        });

        test('Salt randomness', () => {
            const numSalts = 1000;
            const salts = new Set<string>();

            for (let i = 0; i < numSalts; i++) {
                salts.add(Encryption.generateSalt());
            }

            expect(salts.size).toBe(numSalts);
        });
    });

    describe('Exception Handling Tests', () => {

        /**
         * Provides null parameters for encryption tests.
         *
         * @returns Array of test cases with possible null parameters.
         */
        const nullParametersProviderForEncryption = (): Array<[string | null, CryptoJS.lib.WordArray | null]> => {
            return [[null, key], ['validData', null], [null, null]];
        };

        /**
         * Provides null parameters for decryption tests.
         *
         * @returns Array of test cases with possible null parameters.
         */
        const nullParametersProviderForDecryption = (): Array<[CryptoJS.lib.WordArray | null, CryptoJS.lib.WordArray | null, string | null]> => {
            const encryptedData = Encryption.encrypt('Short text', key);
            return [[null, encryptedData.iv, encryptedData.ciphertext], [key, null, encryptedData.ciphertext], [key, encryptedData.iv, null], [null, null, null]];
        };

        /**
         * Provides null parameters for key generation tests.
         *
         * @returns Array of test cases with possible null parameters.
         */
        const nullParametersProviderForKeyGeneration = (): Array<[string | null, string | null]> => {
            return [[null, Encryption.generateSalt()], ['validPassword', null], [null, null]];
        };

        test.each(nullParametersProviderForEncryption())('Encryption with null parameters throws error', (data: string | null, keyParam: CryptoJS.lib.WordArray | null) => {
            expect(() => {
                Encryption.encrypt(data as string, keyParam as CryptoJS.lib.WordArray);
            }).toThrow('Data and key must not be null or undefined.');
        });

        test.each(nullParametersProviderForDecryption())('Decryption with null parameters throws error', (keyParam: CryptoJS.lib.WordArray | null, iv: CryptoJS.lib.WordArray | null, cipherText: string | null) => {
            expect(() => {
                Encryption.decrypt(keyParam as CryptoJS.lib.WordArray, iv as CryptoJS.lib.WordArray, cipherText as string);
            }).toThrow('Key, IV, and ciphertext must not be null or undefined.');
        });

        test.each(nullParametersProviderForKeyGeneration())('Key generation with null parameters throws error', (passwordParam: string | null, saltParam: string | null) => {
            expect(() => {
                Encryption.generateKeyFromPassword(passwordParam as string, saltParam as string);
            }).toThrow('Password and salt must not be null or undefined.');
        });
    });
});
