package backend.DataAccessLayers;

import backend.Models.Pet;

public class PetDAO {
    /**
     * Implementation of the Data Access Object interface for pet accounts.
     *
     * Responsibility: Abstract/encapsulate access to cloud-hosted AWS database, particularly
     * for features regarding pet account information. Allows for creation/storage of new pet
     * information, update of values, deletion, and gathering of pets into a list.
     */
    private DatabaseManager dbManager;
    public PetDAO(DatabaseManager dbManager) {
        this.dbManager = dbManager;
    }

/**
     * Creates/stores a pet with account information into the database (see Pet class for more details
     * on parameters)
     * @param pet is name of the Pet object which will be inserted.
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean create(Pet pet) {
        return true;
    }

    /**
     * Gets information about a given pet from the database by pet ID.
     * @param petID is the unique pet ID which corresponds to a given pet (stored as the primary key in the
     *               database)
     * @return a Pet object containing information about the requested pet
     */
    public Pet get(int petID) {
        return null;
    }
    
    /**
     * Updates entry for given pet in database based on new information supplied.
     * @param petID is the unique pet ID which corresponds to a given pet (stored as the primary key in the
     *                    database)
     * @param pet is a Pet object containing updated information about a specific pet (specified by petID).
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean update(int petID, Pet pet) {
        return true;
    }

    /**
     * Deletes a given pet from the database based on petID.
     * @param petID is the unique pet ID which corresponds to a given pet (stored as the primary key in the
     *                   database)
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean delete(int petID) {
        return true;
    }
}
