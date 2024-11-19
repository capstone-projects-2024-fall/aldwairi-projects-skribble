package expo.modules.encryption

import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec

object Encryption {
    /**
     * Encrypts data using AES/GCM/NoPadding.
     *
     * @param data data to encrypt
     * @param key  secret key for encryption
     * @return Pair&lt;byte[], byte[]&gt; - pair containing IV and ciphertext
     * @throws NullPointerException             if either data or key are null
     * @throws javax.crypto.AEADBadTagException when an invalid key is passed
     */
    @JvmStatic
    @Throws(Exception::class)
    fun encrypt(data: ByteArray?, key: SecretKey?): Pair<ByteArray, ByteArray> {
        if (data == null || key == null) {
            throw NullPointerException()
        }

        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val iv = ByteArray(12) // GCM recommended IV size is 12 bytes
        val secureRandom = SecureRandom()
        secureRandom.nextBytes(iv)
        val spec = GCMParameterSpec(128, iv)
        cipher.init(Cipher.ENCRYPT_MODE, key, spec)
        val cipherText = cipher.doFinal(data)
        return Pair(iv, cipherText)
    }

    /**
     * Decrypts data using AES/GCM/NoPadding.
     *
     * @param key        secret key for decryption
     * @param iv         initialization Vector
     * @param cipherText data to decrypt
     * @return byte[] - decrypted data
     * @throws NullPointerException             if either key, iv, or encryptedData are null
     * @throws javax.crypto.AEADBadTagException when an invalid key or iv is passed
     */
    @JvmStatic
    @Throws(Exception::class)
    fun decrypt(key: SecretKey?, iv: ByteArray?, cipherText: ByteArray?): ByteArray {
        if (key == null || iv == null || cipherText == null) {
            throw NullPointerException()
        }

        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val spec = GCMParameterSpec(128, iv)
        cipher.init(Cipher.DECRYPT_MODE, key, spec)
        return cipher.doFinal(cipherText)
    }

    /**
     * Generates a SecretKey from a password and salt using PBKDF2.
     *
     * @param password password for key derivation
     * @param salt     salt for key derivation
     * @return SecretKey - key derived from the password and salt
     * @throws NullPointerException if either password or salt are null
     */
    @JvmStatic
    @Throws(Exception::class)
    fun generateKeyFromPassword(password: String?, salt: ByteArray?): SecretKey {
        if (password == null || salt == null) {
            throw NullPointerException()
        }

        val iterations = 600000 // Adjust based on performance requirements
        val keyLength = 256 // For AES-256 encryption
        val spec = PBEKeySpec(password.toCharArray(), salt, iterations, keyLength)
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
        val keyBytes = factory.generateSecret(spec).encoded
        return SecretKeySpec(keyBytes, "AES")
    }

    /**
     * Generates a random salt of specified length.
     *
     * @param length length of the salt in bytes
     * @return byte[] - randomly generated salt
     */
    /**
     * Generates a random salt of 10 bytes.
     *
     * @return byte[] - randomly generated salt
     */
    @JvmStatic
    @JvmOverloads
    fun generateSalt(length: Int = 10): ByteArray {
        val salt = ByteArray(length)
        val secureRandom = SecureRandom()
        secureRandom.nextBytes(salt)
        return salt
    }
}
