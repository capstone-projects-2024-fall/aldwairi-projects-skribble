//package src.Encryption;
//
//import com.facebook.react.bridge.Arguments;
//import com.facebook.react.bridge.Promise;
//import com.facebook.react.bridge.ReactApplicationContext;
//import com.facebook.react.bridge.ReactContextBaseJavaModule;
//import com.facebook.react.bridge.ReactMethod;
//import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
//
//import javax.crypto.SecretKey;
//import javax.crypto.spec.SecretKeySpec;
//
//public class EncryptionModule extends ReactContextBaseJavaModule {
//
//    public EncryptionModule(ReactApplicationContext reactContext) {
//        super(reactContext);
//    }
//
//    @Override
//    public String getName() {
//        return "EncryptionModule";
//    }
//
//    /**
//     * Encrypts data using AES-GCM.
//     *
//     * @param dataBase64 Base64-encoded data to encrypt
//     * @param keyBase64  Base64-encoded secret key
//     * @param promise    Promise to handle the result
//     */
//    @ReactMethod
//    public void encrypt(String dataBase64, String keyBase64, Promise promise) {
//        try {
//            byte[] data = Base64.decode(dataBase64);
//            byte[] keyBytes = Base64.decode(keyBase64);
//            SecretKey key = new SecretKeySpec(keyBytes, "AES");
//
//            // Perform encryption
//            Pair<byte[], byte[]> encryptedPair = Encryption.encrypt(data, key);
//            byte[] iv = encryptedPair.first();
//            byte[] encryptedData = encryptedPair.second();
//
//            // Encode results to Base64
//            String ivBase64 = Base64.encode(iv);
//            String encryptedDataBase64 = Base64.encode(encryptedData);
//
//            // Return as a JSON object
//            com.facebook.react.bridge.WritableMap result = Arguments.createMap();
//            result.putString("iv", ivBase64);
//            result.putString("encryptedData", encryptedDataBase64);
//
//            promise.resolve(result);
//        } catch (Exception e) {
//            promise.reject("ENCRYPTION_ERROR", "Failed to encrypt data", e);
//        }
//    }
//
//    /**
//     * Decrypts data using AES-GCM.
//     *
//     * @param keyBase64       Base64-encoded secret key
//     * @param ivBase64        Base64-encoded initialization vector
//     * @param encryptedDataBase64 Base64-encoded encrypted data
//     * @param promise         Promise to handle the result
//     */
//    @ReactMethod
//    public void decrypt(String keyBase64, String ivBase64, String encryptedDataBase64, Promise promise) {
//        try {
//            byte[] keyBytes = Base64.decode(keyBase64);
//            SecretKey key = new SecretKeySpec(keyBytes, "AES");
//            byte[] iv = Base64.decode(ivBase64);
//            byte[] encryptedData = Base64.decode(encryptedDataBase64);
//
//            // Perform decryption
//            byte[] decryptedData = Encryption.decrypt(key, iv, encryptedData);
//
//            // Encode result to Base64
//            String decryptedDataBase64 = Base64.encode(decryptedData);
//
//            promise.resolve(decryptedDataBase64);
//        } catch (Exception e) {
//            promise.reject("DECRYPTION_ERROR", "Failed to decrypt data", e);
//        }
//    }
//
//    /**
//     * Generates a secret key from a password and salt using PBKDF2.
//     *
//     * @param password  The password to derive the key from
//     * @param saltBase64 Base64-encoded salt
//     * @param promise    Promise to handle the result
//     */
//    @ReactMethod
//    public void generateKeyFromPassword(String password, String saltBase64, Promise promise) {
//        try {
//            byte[] salt = Base64.decode(saltBase64);
//            SecretKey key = Encryption.generateKeyFromPassword(password, salt);
//            byte[] keyBytes = key.getEncoded();
//            String keyBase64 = Base64.encode(keyBytes);
//            promise.resolve(keyBase64);
//        } catch (Exception e) {
//            promise.reject("KEY_GENERATION_ERROR", "Failed to generate key from password", e);
//        }
//    }
//
//    /**
//     * Generates a random salt.
//     *
//     * @param promise Promise to handle the result
//     */
//    @ReactMethod
//    public void generateSalt(Promise promise) {
//        try {
//            byte[] salt = Encryption.generateSalt();
//            String saltBase64 = Base64.encode(salt);
//            promise.resolve(saltBase64);
//        } catch (Exception e) {
//            promise.reject("SALT_GENERATION_ERROR", "Failed to generate salt", e);
//        }
//    }
//}
