package models;

/**
 * Represents a user in database. User will initially need to enter username, password, email, 
 * firstName, lastName, age, and parentEmail to create account.
 */
public class User {

    private int userID;
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private int age;
    private String parentEmail;
    private String friendCode;
    private int petID;
    private int streak;
    private int xp;
    private int coins;
    private String accountType;
    private String encryptionKey;

    /**
     * Gets user ID
     * @return user ID
     */
    public int getUserID() { return userID; }
    
    /**
     * Sets user ID
     * @param userID user ID
     */
    public void setUserID(int userID) { this.userID = userID; }

    /**
     * Gets username
     * @return username
     */
    public String getUsername() { return username; }

    /**
     * Sets username
     * @param username username
     */
    public void setUsername(String username) { this.username = username; }

    /**
     * Gets password
     * @return password
     */
    public String getPassword() { return password; }

    /**
     * Sets password
     * @param password password
     */
    public void setPassword(String password) { this.password = password; }

    /**
     * Gets email
     * @return email
     */
    public String getEmail() { return email; }

    /**
     * Sets email
     * @param email email
     */
    public void setEmail(String email) { this.email = email; }

    /**
     * Gets first name
     * @return first name
     */
    public String getFirstName() { return firstName; }

    /**
     * Sets first name
     * @param firstName  first name
     */
    public void setFirstName(String firstName) { this.firstName = firstName; }

    /**
     * Gets last name
     * @return last name
     */
    public String getLastName() { return lastName; }

    /**
     * Sets last name
     * @param lastName last name
     */
    public void setLastName(String lastName) { this.lastName = lastName; }

    /**
     * Gets age
     * @return age
     */
    public int getAge() { return age; }

    /**
     * Sets age
     * @param age age
     */
    public void setAge(int age) { this.age = age; }

    /**
     * Gets parent's email
     * @return parent's email
     */
    public String getParentEmail() { return parentEmail; }

    /**
     * Sets parent's email
     * @param parentEmail parent's email
     */
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }

    /**
     * Gets friend code
     * @return friend code
     */
    public String getFriendCode() { return friendCode; }

    /**
     * Sets friend code
     * @param friendCode friend code
     */
    public void setFriendCode(String friendCode) { this.friendCode = friendCode; }

    /**
     * Gets pet ID
     * @return pet ID
     */
    public int getPetID() { return petID; }

    /**
     * Sets pet ID
     * @param petID pet ID
     */
    public void setPetID(int petID) { this.petID = petID; }

    /**
     * Gets streak
     * @return streak
     */
    public int getStreak() { return streak; }

    /**
     * Sets streak
     * @param streak streak
     */
    public void setStreak(int streak) { this.streak = streak; }

    /**
     * Gets XP
     * @return XP
     */
    public int getXp() { return xp; }

    /**
     * Sets XP
     * @param xp XP
     */
    public void setXp(int xp) { this.xp = xp; }

    /**
     * Gets number of coins
     * @return number of coins
     */
    public int getCoins() { return coins; }

    /**
     * Sets number of coins
     * @param coins number of coins
     */
    public void setCoins(int coins) { this.coins = coins; }

    /**
     * Gets account type
     * @return account type
     */
    public String getAccountType() { return accountType; }

    /**
     * Sets account type
     * @param accountType account type
     */
    public void setAccountType(String accountType) { this.accountType = accountType; }

    /**
     * Gets encryption key
     * @return encryption key
     */
    public String getEncryptionKey() { return encryptionKey; }

    /**
     * Sets encryption key
     * @param encryptionKey encryption key
     */
    public void setEncryptionKey(String encryptionKey) { this.encryptionKey = encryptionKey; }
}
