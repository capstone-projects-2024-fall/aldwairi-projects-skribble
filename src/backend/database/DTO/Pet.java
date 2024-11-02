package models;


/**
 * Represents a pet owned by a user in the database.
 */
public class Pet {

    private int petID;
    private int userID;
    private String petName;
    private String petType;
    private String petPNG;
    

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
     * Gets pet name
     * @return pet name
     */
    public String getPetName() { return petName; }

    /**
     * Sets pet name
     * @param petName pet name
     */
    public void setPetName(String petName) { this.petName = petName; }

    /**
     * Gets pet type
     * @return pet type
     */
    public String getPetType() { return petType; }

    /**
     * Sets pet type
     * @param petType pet type
     */
    public void setPetType(String petType) { this.petType = petType; }

    /**
     * Gets pet PNG image
     * @return pet PNG
     */
    public String getPetPNG() { return petPNG; }

    /**
     * Sets pet PNG image
     * @param petPNG pet PNG
     */
    public void setPetPNG(String petPNG) { this.petPNG = petPNG; }
    
}
