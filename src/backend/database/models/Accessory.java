package models;

/**
 * Represents an accessory that a user can purchase for their pet.
 */
public class Accessory {
    private int accessoryID;
    private String accessoryName;
    private String accessoryType;
    private int userID;
    private int petID;
    private int accessoryPrice;
    private String accessoryPNG;

    /**
     * Gets accessory ID
     * @return accessory ID
     */
    public int getAccessoryID() { return accessoryID; }

    /**
     * Sets accessory ID
     * @param accessoryID accessory ID
     */
    public void setAccessoryID(int accessoryID) { this.accessoryID = accessoryID; }

    /**
     * Gets accessory name
     * @return accessory name
     */
    public String getAccessoryName() { return accessoryName; }

    /**
     * Sets accessory name
     * @param accessoryName accessory name
     */
    public void setAccessoryName(String accessoryName) { this.accessoryName = accessoryName; }

    /**
     * Gets accessory type
     * @return accessory type
     */
    public String getAccessoryType() { return accessoryType; }

    /**
     * Sets accessory type
     * @param accessoryType accessory type
     */
    public void setAccessoryType(String accessoryType) { this.accessoryType = accessoryType; }

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
     * Gets accessory price
     * @return accessory price
     */
    public int getAccessoryPrice() { return accessoryPrice; }

    /**
     * Sets accessory price
     * @param accessoryPrice accessory price
     */
    public void setAccessoryPrice(int accessoryPrice) { this.accessoryPrice = accessoryPrice; }

    /**
     * Gets accessory PNG 
     * @return accessory PNG
     */
    public String getAccessoryPNG() { return accessoryPNG; }

    /**
     * Sets accessory PNG
     * @param accessoryPNG accessoryPNG
     */
    public void setAccessoryPNG(String accessoryPNG) { this.accessoryPNG = accessoryPNG; }

}
