package backend.DataAccessLayers;

import backend.Models.Accessory;

import java.util.List;

public class AccessoryDAO {
    /**
     * Implementation of the Data Access Object interface for accessory accounts.
     *
     * Responsibility: Abstract/encapsulate access to cloud-hosted AWS database, particularly
     * for features regarding accessory account information. Allows for creation/storage of new accessory
     * information, update of values, deletion, and gathering of accessories into a list.
     */
    private DatabaseManager dbManager;
    public AccessoryDAO(DatabaseManager dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Creates/stores a accessory with account information into the database (see Accessory class for more details
     * on parameters)
     * @param accessory is name of the Accessory object which will be inserted.
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean create(Accessory accessory) {
        return true;
    }

    /**
     * Gets information about a given accessory from the database by accessory ID.
     * @param accessoryID is the unique accessory ID which corresponds to a given accessory (stored as the primary key in the
     *               database)
     * @return a Accessory object containing information about the requested accessory
     */
    public Accessory get(int accessoryID) {
        return null;
    }

    /**
     * Updates entry for given accessory in database based on new information supplied.
     * @param accessoryID is the unique accessory ID which corresponds to a given accessory (stored as the primary key in the
     *                    database)
     * @param accessory is a Accessory object containing updated information about a specific accessory (specified by accessoryID).
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean update(int accessoryID, Accessory accessory) {
        return true;
    }

    /**
     * Deletes a given user from the database based on accessoryID.
     * @param accessoryID is the unique accessory ID which corresponds to a given accessory (stored as the primary key in the
     *                   database)
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean delete(int accessoryID) {
        return true;
    }

    /**
     * Gathers all accessories stored within the database.
     * @param petID
     * @return Accessory of all accessories within the database (stored as objects of type Accessory).
     */
    public List<Accessory> getAll(int petID) {
        return null;
    }
    
}
