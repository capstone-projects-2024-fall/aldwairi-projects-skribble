package models;

import java.time.LocalDate;

/**
 * Represents a Skribble journal entry made by a user in the database.
 */
public class Skribble {
    private int entryID;
    private int userID;
    private LocalDate dateCreated;
    private String entry;
    private String mood;
    private String aiPrompt;

    /**
     * Gets entry ID
     * @return entry ID
     */
    public int getEntryID() { return entryID; }

    /**
     * Sets entry ID
     * @param entryID entry ID
     */
    public void setEntryID(int entryID) { this.entryID = entryID; }

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
     * Gets date entry was made
     * @return date created
     */
    public LocalDate getDateCreated() { return dateCreated; }

    /**
     * Sets date entry was made
     * @param dateCreated date created
     */
    public void setDateCreated(LocalDate dateCreated) { this.dateCreated = dateCreated; }

    /**
     * Gets entry
     * @return entry
     */
    public String getentry() { return entry; }

    /**
     * Sets entry
     * @param entry entry
     */
    public void setentry(String entry) { this.entry = entry; }

    /**
     * Gets user mood
     * @return mood
     */
    public String getMood() { return mood; }

    /**
     * Sets user mood
     * @param mood mood
     */
    public void setMood(String mood) { this.mood = mood; }

    /**
     * Gets generated prompt for entry
     * @return generated prompt
     */
    public String getaiPrompt() { return aiPrompt; }

    /**
     * Sets generated prompt for entry
     * @param aiPrompt aiPrompt
     */
    public void setaiPrompt(String aiPrompt) { this.aiPrompt = aiPrompt; } 

}


