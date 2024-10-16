package backend.Controllers;

import backend.DataAccessLayers.FeedbackDAO;
import backend.Models.Feedback;
import backend.Utils.Response;

import java.util.ArrayList;

public class FeedbackController {

    private FeedbackDAO feedbackDAO;

    /**
     * Constructs a FeedbackController with the specified FeedbackDAO.
     *
     * @param feedbackDAO The FeedbackDAO instance used for database interactions related to feedback.
     */
    public FeedbackController(FeedbackDAO feedbackDAO) {
        this.feedbackDAO = feedbackDAO;
    }

    /**
     * Creates a new feedback.
     *
     * @param feedback The Feedback object containing the details of the feedback to be created.
     * @return Response containing the created feedback and HTTP status.
     */
    public Response createFeedback(Feedback feedback) {
        return new Response(201, "message", feedback);
    }

    /**
     * Retrieves a feedback by its unique ID.
     *
     * @param feedbackID The unique identifier of the feedback to retrieve.
     * @return Response containing the retrieved feedback and HTTP status.
     */
    public Response getFeedback(int feedbackID) {
        return new Response(201, "message", new Feedback());
    }

    /**
     * Updates the details of an existing feedback.
     *
     * @param feedback The Feedback object containing updated feedback details.
     * @return Response containing the updated feedback and HTTP status.
     */
    public Response updateFeedback(Feedback feedback) {
        return new Response(201, "message", feedback);
    }

    /**
     * Deletes a feedback by its unique ID.
     *
     * @param feedbackID The unique identifier of the feedback to delete.
     * @return Response containing the deleted feedback and HTTP status.
     */
    public Response deleteFeedback(int feedbackID) {
        return new Response(201, "message", new Feedback());
    }

    /**
     * Retrieves a list of all feedback.
     *
     * @return Response containing the list of feedback and HTTP status.
     */
    public Response getAllFeedback() {
        ArrayList<Feedback> feedback = new ArrayList<Feedback>();
        return new Response(201, "message", feedback);
    }

}
