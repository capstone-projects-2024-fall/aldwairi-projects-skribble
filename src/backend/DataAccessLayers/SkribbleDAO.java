package backend.DataAccessLayers;

import backend.Models.Skribble;
import backend.Models.User;

import java.util.*;

public class SkribbleDAO {
    /**
     * Implementation of the Data Access Object interface for journal entries.
     * Responsibility: Abstract/encapsulate access to cloud-hosted AWS database, particularly
     * for features regarding Skribble entries. Allows for storage of Skribble entries,
     * update of values, deletion, and gathering of users into a list.
     */
    private DatabaseManager dbManager;
    public SkribbleDAO(DatabaseManager dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Creates/stores a Skribble (journal entry) with account information
     * into the database (see Skribble class for more details on parameters)
     * @param skribble is name of the Skribble object which will be inserted.
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean create(Skribble skribble) {
        return true;
    }

    /**
     * Gets information about a given Skribble from the database by unique ID code.
     * @param skribbleID is the unique Skribble ID code which corresponds to a given journal entry
     * @return a Skribble object containing information about the requested journal entry
     */
    public Skribble get(int skribbleID) {
        return null;
    }

    /**
     * Updates entry for given friend in database based on new information supplied.
     * @param skribbleID is the unique Skribble ID code which corresponds to a given journal entry
     * @param skribble is a Friend object containing updated information about a specific journal entry (specified by skribbleID).
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean update(int skribbleID, User skribble) {
        return true;
    }

    /**
     * Deletes a given user from the database based on friend code.
     * @param skribbleID is the unique Skribble ID code which corresponds to a given journal entry
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean delete(int skribbleID) {
        return true;
    }

    /**
     * Gathers a list of all Skribble entries for a specific user stored within the database.
     * @param skribbleID is the unique user ID which corresponds to a given user (stored as the primary key in the
     *                database)
     * @return List of all Skribble entries for a user within the database (stored as objects of type Skribble).
     */
    public List<Skribble> getAll(int skribbleID) {
        return null;
    }
}
