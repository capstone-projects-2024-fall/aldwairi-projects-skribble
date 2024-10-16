package backend.DataAccessLayers;

import backend.Models.User;

import java.util.*;

public class UserDAO {
    /**
     * Implementation of the Data Access Object interface for user accounts.
     *
     * Responsibility: Abstract/encapsulate access to cloud-hosted AWS database, particularly
     * for features regarding user account information. Allows for creation/storage of new user
     * information, update of values, deletion, and gathering of users into a list.
     */
    private DatabaseManager dbManager;
    public UserDAO(DatabaseManager dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Creates/stores a user with account information into the database (see User class for more details
     * on parameters)
     * @param user is name of the User object which will be inserted.
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean create(User user) {
        return true;
    }

    /**
     * Gets information about a given user from the database by user ID.
     * @param userID is the unique user ID which corresponds to a given user (stored as the primary key in the
     *               database)
     * @return a User object containing information about the requested user
     */
    public User get(int userID) {
        return null;
    }

    /**
     * Updates entry for given user in database based on new information supplied.
     * @param userID is the unique user ID which corresponds to a given user (stored as the primary key in the
     *                    database)
     * @param user is a User object containing updated information about a specific user (specified by userID).
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean update(int userID, User user) {
        return true;
    }

    /**
     * Deletes a given user from the database based on userID.
     * @param userID is the unique user ID which corresponds to a given user (stored as the primary key in the
     *                   database)
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean delete(int userID) {
        return true;
    }

    /**
     * Gathers a list of all users stored within the database.
     * @return List of all users within the database (stored as objects of type User).
     */
    public List<User> getAll() {
        return null;
    }
}
