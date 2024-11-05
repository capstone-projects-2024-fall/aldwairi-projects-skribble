package src.frontend.Encryption;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;

import javax.crypto.AEADBadTagException;
import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static src.frontend.Encryption.Encryption.*;

class EncryptionTest {

    private byte[] salt;
    private String password;
    private SecretKey key;

    /**
     * Sets up the test environment before each test.
     */
    @BeforeEach
    public void setUp() throws Exception {
        salt = generateSalt();
        password = "password";
        key = generateKeyFromPassword(password, salt);
    }

    @Nested
    @DisplayName("Encryption and Decryption Tests")
    class EncryptionDecryptionTests {

        static Stream<Arguments> dataProviderForEncryption() {

            return Stream.of(
                    Arguments.of("Short text"),
                    Arguments.of(""),
                    Arguments.of("A longer piece of text to test the encryption and decryption functionality."),
                    Arguments.of(generateRandomString(1024)), // 1 KB
                    Arguments.of(generateRandomString(10 * 1024 * 1024)) // 10 MB
            );
        }

        private static String generateRandomString(int length) {

            SecureRandom random = new SecureRandom();
            StringBuilder sb = new StringBuilder(length);
            for (int i = 0; i < length; i++) {
                int randomAscii = 33 + random.nextInt(94);
                sb.append((char) randomAscii);
            }
            return sb.toString();
        }

        @ParameterizedTest(name = "Data set: \"{0}\"")
        @MethodSource("dataProviderForEncryption")
        @DisplayName("Test encryption and decryption with multiple data sets")
        void testEncryptionAndDecryptionWithMultipleDataSets(String data) throws Exception {

            // setup
            byte[] dataBytes = data.getBytes();

            // act
            Pair<byte[], byte[]> encryptedData = encrypt(dataBytes, key);
            byte[] decryptedData = decrypt(key, encryptedData.first(), encryptedData.second());

            // assert
            assertArrayEquals(dataBytes, decryptedData, "Decrypted data should match the original");
        }

        @Test
        @DisplayName("Encrypting the same data multiple times produces different ciphertexts")
        void testIVRandomness() throws Exception {

            // setup
            String data = "my secret";

            // act
            Pair<byte[], byte[]> encryptedData1 = encrypt(data.getBytes(), key);
            Pair<byte[], byte[]> encryptedData2 = encrypt(data.getBytes(), key);

            // assert
            assertFalse(
                    java.util.Arrays.equals(encryptedData1.first(), encryptedData2.first()),
                    "IVs should be unique for each encryption"
            );
            assertNotEquals(
                    new String(encryptedData1.second()),
                    new String(encryptedData2.second()),
                    "Ciphertexts should differ due to different IVs"
            );
        }
    }

    @Nested
    @DisplayName("Key Generation Tests")
    class KeyGenerationTests {

        @Test
        @DisplayName("Test key generation consistency with same password and salt")
        void testKeyGenerationConsistency() throws Exception {

            // act
            SecretKey newKey = generateKeyFromPassword(password, salt);

            // assert
            assertArrayEquals(
                    key.getEncoded(), newKey.getEncoded(),
                    "Keys generated with the same password and salt should be identical");
        }

        @Test
        @DisplayName("Test key generation with different salts produces different keys")
        void testKeyGenerationDifferentSalts() throws Exception {

            // setup
            byte[] newSalt = generateSalt();

            // act
            SecretKey newKey = generateKeyFromPassword(password, newSalt);

            // assert
            assertFalse(
                    java.util.Arrays.equals(key.getEncoded(), newKey.getEncoded()),
                    "Keys generated with the same password but different salts should differ"
            );
        }

        @Test
        @DisplayName("Test key generation with different passwords produces different keys")
        void testKeyGenerationDifferentPasswords() throws Exception {

            // setup
            String newPassword = "newPassword";

            // act
            SecretKey newKey = generateKeyFromPassword(newPassword, salt);

            // assert
            assertFalse(
                    java.util.Arrays.equals(key.getEncoded(), newKey.getEncoded()),
                    "Keys generated with different passwords should differ"
            );
        }
    }

    @Nested
    @DisplayName("Salt Generation Tests")
    class SaltGenerationTests {

        @Test
        @DisplayName("Test salt is of correct default length")
        void testDefaultSaltLength() {

            // assert
            assertEquals(10, salt.length, "Default salt length should be 10 bytes");
        }

        @ParameterizedTest(name = "Salt length: {0} bytes")
        @ValueSource(ints = {8, 16, 32})
        @DisplayName("Test salt generation with specified lengths")
        void testSaltGenerationWithSpecifiedLengths(int length) {

            // act
            byte[] generatedSalt = generateSalt(length);

            // assert
            assertEquals(length, generatedSalt.length, "Salt length should match the specified length");
        }

        @Test
        @DisplayName("Test salt randomness")
        void testSaltRandomness() {

            // setup
            int numSalts = 1000;
            Set<String> salts = new HashSet<>();

            // act
            for (int i = 0; i < numSalts; i++) {
                byte[] salt = generateSalt();
                salts.add(java.util.Arrays.toString(salt));
            }

            // assert
            assertEquals(numSalts, salts.size(), "All generated salts should be unique");
        }
    }

    @Nested
    @DisplayName("Exception Handling Tests")
    class ExceptionHandlingTests {

        /**
         * Provides null parameters for encryption tests.
         */
        static Stream<Arguments> nullParametersProviderForEncryption() {

            return Stream.of(
                    Arguments.of(null, "validKey"),
                    Arguments.of("validData", null),
                    Arguments.of(null, null)
            ).map(args -> {
                try {
                    SecretKey key = generateKeyFromPassword("password", generateSalt());
                    byte[] data = "validData".equals(args.get()[0]) ? "Short text".getBytes() : null;
                    SecretKey keyParam = "validKey".equals(args.get()[1]) ? key : null;
                    return Arguments.of(data, keyParam);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
        }

        /**
         * Provides null parameters for decryption tests.
         */
        static Stream<Arguments> nullParametersProviderForDecryption() {

            return Stream.of(
                    Arguments.of(null, "validIV", "validEncryptedData"),
                    Arguments.of("validKey", null, "validEncryptedData"),
                    Arguments.of("validKey", "validIV", null),
                    Arguments.of(null, null, null)
            ).map(args -> {
                try {
                    SecretKey key = generateKeyFromPassword("password", generateSalt());
                    Pair<byte[], byte[]> encryptedData = encrypt("Short text".getBytes(), key);
                    SecretKey keyParam = "validKey".equals(args.get()[0]) ? key : null;
                    byte[] iv = "validIV".equals(args.get()[1]) ? encryptedData.first() : null;
                    byte[] cipherText = "validEncryptedData".equals(args.get()[2]) ? encryptedData.second() : null;
                    return Arguments.of(keyParam, iv, cipherText);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            });
        }

        /**
         * Provides null parameters for key generation tests.
         */
        static Stream<Arguments> nullParametersProviderForKeyGeneration() {

            return Stream.of(
                    Arguments.of(null, "validSalt"),
                    Arguments.of("validPassword", null),
                    Arguments.of(null, null)
            ).map(args -> {
                String passwordParam = "validPassword".equals(args.get()[0]) ? "password" : null;
                byte[] saltParam = "validSalt".equals(args.get()[1]) ? generateSalt() : null;
                return Arguments.of(passwordParam, saltParam);
            });
        }

        @Test
        @DisplayName("Test decryption with invalid key throws AEADBadTagException")
        void testDecryptionWithInvalidKey() throws Exception {

            // setup
            SecretKey invalidKey = generateKeyFromPassword("invalidPassword", salt);
            String data = "Short text.";

            // act
            Pair<byte[], byte[]> encryptedData = encrypt(data.getBytes(), key);

            // assert
            AEADBadTagException exception = assertThrows(
                    AEADBadTagException.class,
                    () -> decrypt(invalidKey, encryptedData.first(), encryptedData.second()),
                    "Decryption with an invalid key should throw AEADBadTagException"
            );
            assertEquals("Tag mismatch", exception.getMessage(), "Exception message should indicate tag mismatch");
        }

        @Test
        @DisplayName("Test decryption with invalid IV throws AEADBadTagException")
        void testDecryptionWithInvalidIV() throws Exception {

            // setup
            String data = "Short text";
            Pair<byte[], byte[]> encryptedData = encrypt(data.getBytes(), key);
            encryptedData.first()[0] ^= (byte) 0xFF;

            // assert
            AEADBadTagException exception = assertThrows(
                    AEADBadTagException.class,
                    () -> decrypt(key, encryptedData.first(), encryptedData.second()),
                    "Decryption with an invalid IV should throw AEADBadTagException"
            );
            assertEquals("Tag mismatch", exception.getMessage(), "Exception message should indicate tag mismatch");
        }

        @Test
        @DisplayName("Test decryption with corrupted ciphertext throws AEADBadTagException")
        void testDecryptionWithCorruptedCiphertext() throws Exception {

            // setup
            String data = "Short text";
            Pair<byte[], byte[]> encryptedData = encrypt(data.getBytes(), key);
            encryptedData.second()[0] ^= (byte) 0xFF;

            // assert
            AEADBadTagException exception = assertThrows(
                    AEADBadTagException.class,
                    () -> decrypt(key, encryptedData.first(), encryptedData.second()),
                    "Decryption with corrupted ciphertext should throw AEADBadTagException"
            );
            assertEquals("Tag mismatch", exception.getMessage(), "Exception message should indicate tag mismatch");
        }

        @ParameterizedTest(name = "Null parameter: {0}")
        @MethodSource("nullParametersProviderForEncryption")
        @DisplayName("Test encryption with null parameters throws NullPointerException")
        void testEncryptionWithNullParameters(Object param1, Object param2) {

            // setup
            byte[] data = param1 instanceof byte[] ? (byte[]) param1 : null;
            SecretKey key = param2 instanceof SecretKey ? (SecretKey) param2 : null;

            // assert
            assertThrows(
                    NullPointerException.class,
                    () -> encrypt(data, key),
                    "Encryption with null parameters should throw NullPointerException");
        }

        @ParameterizedTest(name = "Null parameter: {0}")
        @MethodSource("nullParametersProviderForDecryption")
        @DisplayName("Test decryption with null parameters throws NullPointerException")
        void testDecryptionWithNullParameters(Object param1, Object param2, Object param3) {

            // setup
            SecretKey key = param1 instanceof SecretKey ? (SecretKey) param1 : null;
            byte[] iv = param2 instanceof byte[] ? (byte[]) param2 : null;
            byte[] cipherText = param3 instanceof byte[] ? (byte[]) param3 : null;

            // assert
            assertThrows(
                    NullPointerException.class,
                    () -> decrypt(key, iv, cipherText),
                    "Decryption with null parameters should throw NullPointerException"
            );
        }

        @ParameterizedTest(name = "Null parameter: {0}")
        @MethodSource("nullParametersProviderForKeyGeneration")
        @DisplayName("Test key generation with null parameters throws NullPointerException")
        void testKeyGenerationWithNullParameters(Object param1, Object param2) {

            // setup
            String password = param1 instanceof String ? (String) param1 : null;
            byte[] salt = param2 instanceof byte[] ? (byte[]) param2 : null;

            // assert
            assertThrows(
                    NullPointerException.class,
                    () -> generateKeyFromPassword(password, salt),
                    "Encryption with null parameters should throw NullPointerException"
            );
        }
    }
}
