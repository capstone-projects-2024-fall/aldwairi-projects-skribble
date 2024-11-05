package models;


/**
 * Represents a friendship between two users in the database.
 */
public class Friend {
    private int friendID;
    private int userID1;
    private int userID2;
    private String friendshipStatus;

    /**
     * Gets friend ID
     * @return friend ID
     */
    public int getFriendID() { return friendID; }

    /**
     * Sets friend ID
     * @param friendID friend ID
     */
    public void setFriendID(int friendID) { this.friendID = friendID; }

    /**
     * Gets first user ID
     * @return first user ID
     */
    public int getUserID1() { return userID1; }

    /**
     * Sets first user ID
     * @param userID1 first user ID
     */
    public void setUserID1(int userID1) { this.userID1 = userID1; }

    /**
     * Gets second user ID
     * @return second user ID
     */
    public int getUserID2() { return userID2; }

    /**
     * Sets second user ID
     * @param userID2 second user ID
     */
    public void setUserID2(int userID2) { this.userID2 = userID2; }

    /**
     * Gets friendship status
     * @return friendship status
     */
    public String getFriendshipStatus() { return friendshipStatus; }

    /**
     * Sets friendship status
     * @param friendshipStatus friendship status
     */
    public void setFriendshipStatus(String friendshipStatus) { this.friendshipStatus = friendshipStatus; }
}
