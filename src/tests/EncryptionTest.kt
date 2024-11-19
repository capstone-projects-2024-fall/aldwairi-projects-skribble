import org.junit.jupiter.api.*
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.MethodSource
import org.junit.jupiter.params.provider.ValueSource
import expo.modules.encryption.Encryption.decrypt
import expo.modules.encryption.Encryption.encrypt
import expo.modules.encryption.Encryption.generateKeyFromPassword
import expo.modules.encryption.Encryption.generateSalt
import java.security.SecureRandom
import java.util.stream.Stream
import javax.crypto.AEADBadTagException
import javax.crypto.SecretKey

internal class EncryptionTest {
    private lateinit var salt: ByteArray
    private lateinit var password: String
    private lateinit var key: SecretKey

    /**
     * Sets up the test environment before each test.
     */
    @BeforeEach
    @Throws(Exception::class)
    fun setUp() {
        salt = generateSalt()
        password = "password"
        key = generateKeyFromPassword(password, salt)
    }

    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    @Nested
    @DisplayName("Encryption and Decryption Tests")
    internal inner class EncryptionDecryptionTests {
        @ParameterizedTest(name = "Data set: \"{0}\"")
        @MethodSource("dataProviderForEncryption")
        @DisplayName("Test encryption and decryption with multiple data sets")
        @Throws(
            Exception::class
        )
        fun testEncryptionAndDecryptionWithMultipleDataSets(data: String) {
            // setup

            val dataBytes = data.toByteArray()

            // act
            val encryptedData = encrypt(dataBytes, key)
            val decryptedData = decrypt(key, encryptedData.first, encryptedData.second)

            // assert
            Assertions.assertArrayEquals(dataBytes, decryptedData, "Decrypted data should match the original")
        }

        @Test
        @DisplayName("Encrypting the same data multiple times produces different ciphertexts")
        @Throws(
            Exception::class
        )
        fun testIVRandomness() {
            // setup

            val data = "my secret"

            // act
            val encryptedData1 = encrypt(data.toByteArray(), key)
            val encryptedData2 = encrypt(data.toByteArray(), key)

            // assert
            Assertions.assertFalse(
                encryptedData1.first.contentEquals(encryptedData2.first),
                "IVs should be unique for each encryption"
            )
            Assertions.assertNotEquals(
                String(encryptedData1.second),
                String(encryptedData2.second),
                "Ciphertexts should differ due to different IVs"
            )
        }

        fun dataProviderForEncryption(): Stream<Arguments> {
            return Stream.of(
                Arguments.of("Short text"),
                Arguments.of(""),
                Arguments.of("A longer piece of text to test the encryption and decryption functionality."),
                Arguments.of(generateRandomString(1024)),  // 1 KB
                Arguments.of(generateRandomString(10 * 1024 * 1024)) // 10 MB
            )
        }

        private fun generateRandomString(length: Int): String {
            val random = SecureRandom()
            val sb = StringBuilder(length)
            for (i in 0 until length) {
                val randomAscii = 33 + random.nextInt(94)
                sb.append(randomAscii.toChar())
            }
            return sb.toString()
        }
    }

    @Nested
    @DisplayName("Key Generation Tests")
    internal inner class KeyGenerationTests {
        @Test
        @DisplayName("Test key generation consistency with same password and salt")
        @Throws(
            Exception::class
        )
        fun testKeyGenerationConsistency() {
            // act

            val newKey = generateKeyFromPassword(password, salt)

            // assert
            Assertions.assertArrayEquals(
                key.encoded, newKey.encoded,
                "Keys generated with the same password and salt should be identical"
            )
        }

        @Test
        @DisplayName("Test key generation with different salts produces different keys")
        @Throws(
            Exception::class
        )
        fun testKeyGenerationDifferentSalts() {
            // setup

            val newSalt = generateSalt()

            // act
            val newKey = generateKeyFromPassword(password, newSalt)

            // assert
            Assertions.assertFalse(
                key.encoded.contentEquals(newKey.encoded),
                "Keys generated with the same password but different salts should differ"
            )
        }

        @Test
        @DisplayName("Test key generation with different passwords produces different keys")
        @Throws(
            Exception::class
        )
        fun testKeyGenerationDifferentPasswords() {
            // setup

            val newPassword = "newPassword"

            // act
            val newKey = generateKeyFromPassword(newPassword, salt)

            // assert
            Assertions.assertFalse(
                key.encoded.contentEquals(newKey.encoded),
                "Keys generated with different passwords should differ"
            )
        }
    }

    @Nested
    @DisplayName("Salt Generation Tests")
    internal inner class SaltGenerationTests {
        @Test
        @DisplayName("Test salt is of correct default length")
        fun testDefaultSaltLength() {
            // assert

            Assertions.assertEquals(10, salt.size, "Default salt length should be 10 bytes")
        }

        @ParameterizedTest(name = "Salt length: {0} bytes")
        @ValueSource(ints = [8, 16, 32])
        @DisplayName("Test salt generation with specified lengths")
        fun testSaltGenerationWithSpecifiedLengths(length: Int) {
            // act

            val generatedSalt = generateSalt(length)

            // assert
            Assertions.assertEquals(length, generatedSalt.size, "Salt length should match the specified length")
        }

        @Test
        @DisplayName("Test salt randomness")
        fun testSaltRandomness() {
            // setup

            val numSalts = 1000
            val salts: MutableSet<String> = HashSet()

            // act
            for (i in 0 until numSalts) {
                val salt = generateSalt()
                salts.add(salt.contentToString())
            }

            // assert
            Assertions.assertEquals(numSalts, salts.size, "All generated salts should be unique")
        }
    }

    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    @Nested
    @DisplayName("Exception Handling Tests")
    internal inner class ExceptionHandlingTests {
        @Test
        @DisplayName("Test decryption with invalid key throws AEADBadTagException")
        @Throws(
            Exception::class
        )
        fun testDecryptionWithInvalidKey() {
            // setup

            val invalidKey = generateKeyFromPassword("invalidPassword", salt)
            val data = "Short text."

            // act
            val encryptedData = encrypt(data.toByteArray(), key)

            // assert
            val exception = Assertions.assertThrows(
                AEADBadTagException::class.java,
                { decrypt(invalidKey, encryptedData.first, encryptedData.second) },
                "Decryption with an invalid key should throw AEADBadTagException"
            )
            Assertions.assertEquals("Tag mismatch", exception.message, "Exception message should indicate tag mismatch")
        }

        @Test
        @DisplayName("Test decryption with invalid IV throws AEADBadTagException")
        @Throws(
            Exception::class
        )
        fun testDecryptionWithInvalidIV() {
            // setup

            val data = "Short text"
            val encryptedData = encrypt(data.toByteArray(), key)
            encryptedData.first[0] = (encryptedData.first[0].toInt() xor 0xFF.toByte().toInt()).toByte()

            // assert
            val exception = Assertions.assertThrows(
                AEADBadTagException::class.java,
                { decrypt(key, encryptedData.first, encryptedData.second) },
                "Decryption with an invalid IV should throw AEADBadTagException"
            )
            Assertions.assertEquals("Tag mismatch", exception.message, "Exception message should indicate tag mismatch")
        }

        @Test
        @DisplayName("Test decryption with corrupted ciphertext throws AEADBadTagException")
        @Throws(
            Exception::class
        )
        fun testDecryptionWithCorruptedCiphertext() {
            // setup

            val data = "Short text"
            val encryptedData = encrypt(data.toByteArray(), key)
            encryptedData.second[0] = (encryptedData.second[0].toInt() xor 0xFF.toByte().toInt()).toByte()

            // assert
            val exception = Assertions.assertThrows(
                AEADBadTagException::class.java,
                { decrypt(key, encryptedData.first, encryptedData.second) },
                "Decryption with corrupted ciphertext should throw AEADBadTagException"
            )
            Assertions.assertEquals("Tag mismatch", exception.message, "Exception message should indicate tag mismatch")
        }

        @ParameterizedTest(name = "Null parameter: {0}")
        @MethodSource("nullParametersProviderForEncryption")
        @DisplayName("Test encryption with null parameters throws NullPointerException")
        fun testEncryptionWithNullParameters(param1: Any?, param2: Any?) {
            // setup

            val data = if (param1 is ByteArray) param1 else null
            val key = if (param2 is SecretKey) param2 else null

            // assert
            Assertions.assertThrows(
                NullPointerException::class.java,
                { encrypt(data!!, key!!) },
                "Encryption with null parameters should throw NullPointerException"
            )
        }

        @ParameterizedTest(name = "Null parameter: {0}")
        @MethodSource("nullParametersProviderForDecryption")
        @DisplayName("Test decryption with null parameters throws NullPointerException")
        fun testDecryptionWithNullParameters(param1: Any?, param2: Any?, param3: Any?) {
            // setup

            val key = if (param1 is SecretKey) param1 else null
            val iv = if (param2 is ByteArray) param2 else null
            val cipherText = if (param3 is ByteArray) param3 else null

            // assert
            Assertions.assertThrows(
                NullPointerException::class.java,
                { decrypt(key!!, iv!!, cipherText!!) },
                "Decryption with null parameters should throw NullPointerException"
            )
        }

        @ParameterizedTest(name = "Null parameter: {0}")
        @MethodSource("nullParametersProviderForKeyGeneration")
        @DisplayName("Test key generation with null parameters throws NullPointerException")
        fun testKeyGenerationWithNullParameters(param1: Any?, param2: Any?) {
            // setup

            val password = if (param1 is String) param1 else null
            val salt = if (param2 is ByteArray) param2 else null

            // assert
            Assertions.assertThrows(
                NullPointerException::class.java,
                { generateKeyFromPassword(password!!, salt!!) },
                "Encryption with null parameters should throw NullPointerException"
            )
        }

        /**
         * Provides null parameters for encryption tests.
         */
        fun nullParametersProviderForEncryption(): Stream<Arguments> {
            return Stream.of(
                Arguments.of(null, "validKey"),
                Arguments.of("validData", null),
                Arguments.of(null, null)
            ).map { args: Arguments ->
                try {
                    val key = generateKeyFromPassword("password", generateSalt())
                    val data = if ("validData" == args.get()[0]) "Short text".toByteArray() else null
                    val keyParam = if ("validKey" == args.get()[1]) key else null
                    return@map Arguments.of(data, keyParam)
                } catch (e: Exception) {
                    throw RuntimeException(e)
                }
            }
        }

        /**
         * Provides null parameters for decryption tests.
         */
        fun nullParametersProviderForDecryption(): Stream<Arguments> {
            return Stream.of(
                Arguments.of(null, "validIV", "validEncryptedData"),
                Arguments.of("validKey", null, "validEncryptedData"),
                Arguments.of("validKey", "validIV", null),
                Arguments.of(null, null, null)
            ).map { args: Arguments ->
                try {
                    val key = generateKeyFromPassword("password", generateSalt())
                    val encryptedData = encrypt("Short text".toByteArray(), key)
                    val keyParam = if ("validKey" == args.get()[0]) key else null
                    val iv = if ("validIV" == args.get()[1]) encryptedData.first else null
                    val cipherText = if ("validEncryptedData" == args.get()[2]) encryptedData.second else null
                    return@map Arguments.of(keyParam, iv, cipherText)
                } catch (e: Exception) {
                    throw RuntimeException(e)
                }
            }
        }

        /**
         * Provides null parameters for key generation tests.
         */
        fun nullParametersProviderForKeyGeneration(): Stream<Arguments> {
            return Stream.of(
                Arguments.of(null, "validSalt"),
                Arguments.of("validPassword", null),
                Arguments.of(null, null)
            ).map { args: Arguments ->
                val passwordParam = if ("validPassword" == args.get()[0]) "password" else null
                val saltParam = if ("validSalt" == args.get()[1]) generateSalt() else null
                Arguments.of(passwordParam, saltParam)
            }
        }
    }
}
