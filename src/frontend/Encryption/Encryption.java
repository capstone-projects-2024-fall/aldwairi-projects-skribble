package src.frontend.Encryption;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;

public class Encryption {

    /**
     * Encrypts data using AES/GCM/NoPadding.
     *
     * @param data Data to encrypt
     * @param key  SecretKey for encryption
     * @return Pair containing IV and encrypted data
     * @throws Exception if encryption fails
     */
    public static Pair<byte[], byte[]> encrypt(byte[] data, SecretKey key) throws Exception {

        if (data == null || key == null) {
            throw new NullPointerException();
        }

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        byte[] iv = new byte[12]; // GCM recommended IV size is 12 bytes
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(iv);
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);
        byte[] cipherText = cipher.doFinal(data);
        return new Pair<>(iv, cipherText);
    }

    /**
     * Decrypts data using AES/GCM/NoPadding.
     *
     * @param key        SecretKey for decryption
     * @param iv         Initialization Vector
     * @param cipherText Data to decrypt
     * @return Decrypted data
     * @throws NullPointerException             if either key, iv, or encryptedData are null
     * @throws javax.crypto.AEADBadTagException when an invalid key or iv is passed
     */
    public static byte[] decrypt(SecretKey key, byte[] iv, byte[] cipherText) throws Exception {

        if (key == null || iv == null || cipherText == null) {
            throw new NullPointerException();
        }

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.DECRYPT_MODE, key, spec);
        return cipher.doFinal(cipherText);
    }

    /**
     * Generates a SecretKey from a password and salt using PBKDF2.
     *
     * @param password Password to derive the key
     * @param salt     Salt for key derivation
     * @return SecretKey derived from the password and salt
     * @throws Exception if key generation fails
     */
    public static SecretKey generateKeyFromPassword(String password, byte[] salt) throws Exception {

        if (password == null || salt == null) {
            throw new NullPointerException();
        }

        int iterations = 600000;  // Adjust based on performance requirements
        int keyLength = 256;      // For AES-256 encryption
        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, iterations, keyLength);
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        byte[] keyBytes = factory.generateSecret(spec).getEncoded();
        return new SecretKeySpec(keyBytes, "AES");
    }

    /**
     * Generates a random salt of specified length.
     *
     * @param length Length of the salt in bytes
     * @return Randomly generated salt
     */
    public static byte[] generateSalt(int length) {
        byte[] salt = new byte[length];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(salt);
        return salt;
    }

    /**
     * Generates a random salt of 10 bytes.
     *
     * @return Randomly generated salt
     */
    public static byte[] generateSalt() {
        return generateSalt(10);
    }
}
