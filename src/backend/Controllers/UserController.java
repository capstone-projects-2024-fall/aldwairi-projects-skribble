package backend.Controllers;

import backend.DataAccessLayers.UserDAO;
import backend.Models.User;
import backend.Utils.Response;

import java.util.ArrayList;

public class UserController {

    private final UserDAO userDAO;

    /**
     * Constructs a UserController with the specified UserDAO.
     *
     * @param userDAO The DataAccessLayers.UserDAO instance used for database interactions related to users.
     */
    public UserController(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    /**
     * Creates a new user.
     *
     * @param user The User object containing the details of the user to be created.
     * @return A ResponseEntity containing the created user and HTTP status.
     */
    public Response createUser(User user) {
        return new Response(201, "message", user);
    }

    /**
     * Retrieves a user by their unique ID.
     *
     * @param userID The unique identifier of the user to retrieve.
     * @return A ResponseEntity containing the retrieved user and HTTP status.
     */
    public Response getUser(int userID) {
        return new Response(200, "message", new User());
    }

    /**
     * Updates the details of an existing user.
     *
     * @param user The User object containing updated user details.
     * @return A ResponseEntity containing the updated user and HTTP status.
     */
    public Response updateUser(User user) {
        return new Response(200, "message", user);
    }

    /**
     * Deletes a user by their unique ID.
     *
     * @param userID The unique identifier of the user to delete.
     * @return A ResponseEntity containing the deleted user and HTTP status.
     */
    public Response deleteUser(int userID) {
        return new Response(204, "message", null);
    }

    /**
     * Retrieves a list of all users.
     *
     * @return A ResponseEntity containing the list of users and HTTP status.
     */
    public Response getAllUsers() {
        ArrayList<User> users = new ArrayList<User>();
        return new Response(201, "message", users);
    }

}
