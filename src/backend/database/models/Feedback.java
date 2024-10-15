package models;

import java.time.LocalDate;

/**
 * Represents feedback submitted by a user in the database.
 */
public class Feedback {
    private int feedbackID;
    private int userID;
    private String feedbackText;
    private LocalDate dateSubmitted;

    /**
     * Gets feedback ID
     * @return feedback ID
     */
    public int getFeedbackID() { return feedbackID; }

    /**
     * Sets feedback ID
     * @param feedbackID feedback ID
     */
    public void setFeedbackID(int feedbackID) { this.feedbackID = feedbackID; }

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
     * Gets feedback text
     * @return feedback text
     */
    public String getFeedbackText() { return feedbackText; }

    /**
     * Sets feedback text
     * @param feedbackText feedback text
     */
    public void setFeedbackText(String feedbackText) { this.feedbackText = feedbackText; }

    /**
     * Gets date feedback was submitted
     * @return date submitted
     */
    public LocalDate getDateSubmitted() { return dateSubmitted; }

    /**
     * Sets date feedback was submitted
     * @param dateSubmitted date submitted
     */
    public void setDateSubmitted(LocalDate dateSubmitted) { this.dateSubmitted = dateSubmitted; }
}
