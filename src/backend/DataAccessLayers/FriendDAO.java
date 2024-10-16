package backend.DataAccessLayers;

import backend.Models.Friend;

import java.util.*;

public class FriendDAO {
    /**
     * Implementation of the Data Access Object interface for friends
     * Responsibility: Abstract/encapsulate access to cloud-hosted AWS database, particularly
     * for features regarding friend information. Allows for creation/storage of friend relationships,
     * update of values, deletion, and gathering of users into a list.
     */
    private DatabaseManager dbManager;
    public FriendDAO(DatabaseManager dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Creates/stores a friend with account information into the database (see Friend class for more details
     * on parameters)
     * @param friend is name of the Friend object which will be inserted.
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean create(Friend friend) {
        return true;
    }

    /**
     * Gets information about a given friend from the database by friend code.
     * @param friendID is the unique friend code which corresponds to a given user
     * @return a Friend object containing information about the requested user
     */
    public Friend get(int friendID) {
        return null;
    }

    /**
     * Updates entry for given friend in database based on new information supplied.
     * @param friendID is the unique friend code which corresponds to a given user
     * @param friend is a Friend object containing updated information about a specific user (specified by userID).
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean update(int friendID, Friend friend) {
        return true;
    }

    /**
     * Deletes a given user from the database based on friend code.
     * @param friendID is the unique friend code which corresponds to a given user
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean delete(int friendID) {
        return true;
    }

    /**
     * Gathers a list of all friends for a specific user stored within the database.
     * @param friendID is the unique user ID which corresponds to a given user (stored as the primary key in the
     *                database)
     * @return List of all friends for a user within the database (stored as objects of type Friend).
     */
    public List<Friend> getAll(int friendID) {
        return null;
    }
}
