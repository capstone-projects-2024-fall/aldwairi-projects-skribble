package expo.modules.encryption;

import java.util.Arrays;

//import static expo.modules.encryption.Encryption.generateSalt;

public class Main {
    public static void main(String[] args) throws Exception {
        Encryption.generateSalt();
        Class<Encryption> encryptionClass = Encryption.class;
//        System.out.println("validIV".equals("validIV") ? Arrays.toString(new byte[12]) : null);
//        byte[] salt = generateSalt();
//        byte[] staticSalt = new byte[]{-61, 23, 45, 72, 62, -109, 59, -91, 97, 51};
//        String password = "password";
//        SecretKey key = generateKeyFromPassword(password, salt);
//        String data = "my secret";
//        Pair<byte[], byte[]> encryptedData = encrypt(data.getBytes(), key);
//        SecretKey key2 = generateKeyFromPassword("newpassword", salt);
//
//        // tested decryption with incorrect key (by key from different password and key from different salt)
//
//
//        System.out.println("salt: "+Arrays.toString(salt));
//        System.out.println("key: "+key+key2);
//        System.out.println("encrypted data: "+encryptedData);
//        System.out.println("decrypted data: "+ new String(decrypt(key2, encryptedData.first, encryptedData.second)));
    }
}