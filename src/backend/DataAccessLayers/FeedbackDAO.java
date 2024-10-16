package backend.DataAccessLayers;

import backend.Models.Accessory;
import backend.Models.Feedback;

import java.util.List;

public class FeedbackDAO {
    /**
     * Implementation of the Data Access Object interface for feedback accounts.
     *
     * Responsibility: Abstract/encapsulate access to cloud-hosted AWS database, particularly
     * for features regarding feedback account information. Allows for creation/storage of new accessory
     * information, update of values, deletion, and gathering of feedbacks into a list.
     */
    private DatabaseManager dbManager;
    public FeedbackDAO(DatabaseManager dbManager) {
        this.dbManager = dbManager;
    }

    /**
     * Creates/stores a feedback with account information into the database (see Feedback class for more details
     * on parameters)
     * @param feedback is name of the Feedback object which will be inserted.
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean create(Feedback feedback) {
        return true;
    }

    /**
     * Gets information about a given feedback from the database by feedback ID.
     * @param feedbackID is the unique feedback ID which corresponds to a given feedback (stored as the primary key in the
     *               database)
     * @return a Feedback object containing information about the requested feedback
     */
    public Accessory get(int feedbackID) {
        return null;
    }

    /**
     * Updates entry for given feedback in database based on new information supplied.
     * @param feedbackID is the unique feedback ID which corresponds to a given feedback (stored as the primary key in the
     *                    database)
     * @param feedback is a Feedback object containing updated information about a specific feedback (specified by feedbackID).
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean update(int feedbackID, Feedback feedback) {
        return true;
    }

    /**
     * Deletes a given user from the database based on feedbackID.
     * @param feedbackID is the unique feedback ID which corresponds to a given feedback (stored as the primary key in the
     *                   database)
     * @return boolean indicating whether status was successful (True if successful, False if not)
     */
    public boolean delete(int feedbackID) {
        return true;
    }

    /**
     * Gathers a feedback of all feedbacks stored within the database.
     * @return Feedback of all feedbacks within the database (stored as objects of type Feedback).
     */
    public List<Feedback> getAll() {
        return null;
    }
}
