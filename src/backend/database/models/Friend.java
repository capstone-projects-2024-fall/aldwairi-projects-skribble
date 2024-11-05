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
     * Constructor
     * @param friendID
     * @param userID1
     * @param userID2
     * @param friendshipStatus
     */
    public Friend(int friendID, int userID1, int userID2, String friendshipStatus) {
        this.friendID = friendID;
        this.userID1 = userID1;
        this.userID2 = userID2;
        this.friendshipStatus = friendshipStatus;
    }

    /**
     * ToString
     */
    @Override
    public String toString() {
        return "Friend [friendID=" + friendID + ", userID1=" + userID1 + ", userID2=" + userID2 + ", friendshipStatus="
                + friendshipStatus + "]";
    }


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
