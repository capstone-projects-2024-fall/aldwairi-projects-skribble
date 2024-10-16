package backend.Controllers;

import backend.DataAccessLayers.FriendDAO;
import backend.Models.Friend;
import backend.Utils.Response;

import java.util.ArrayList;

public class FriendController {

    private FriendDAO friendDAO;

    /**
     * Constructs a FriendController with the specified FriendDAO.
     *
     * @param friendDAO The FriendDAO instance used for database interactions related to friends.
     */
    public FriendController(FriendDAO friendDAO) {
        this.friendDAO = friendDAO;
    }

    /**
     * Creates a new friend.
     *
     * @param friend The Friend object containing the details of the friend to be created.
     * @return Response containing the created friend and HTTP status.
     */
    public Response createFriend(Friend friend) {
        return new Response(201, "message", friend);
    }

    /**
     * Retrieves a friend by their unique ID.
     *
     * @param friendID The unique identifier of the friend to retrieve.
     * @return Response containing the retrieved friend and HTTP status.
     */
    public Response getFriend(int friendID) {
        return new Response(201, "message", new Friend());
    }

    /**
     * Updates the details of an existing friend.
     *
     * @param friend The Friend object containing updated friend details.
     * @return Response containing the updated friend and HTTP status.
     */
    public Response updateFriend(Friend friend) {
        return new Response(201, "message", friend);
    }

     /**
     * Deletes a friend by their unique ID.
     *
     * @param friendID The unique identifier of the friend to delete.
     * @return Response containing the deleted friend and HTTP status.
     */
    public Response deleteFriend(int friendID) {
        return new Response(201, "message", new Friend());
    }

    /**
     * Retrieves a list of all friends.
     *
     * @return Response containing the list of friends and HTTP status.
     */
    public Response getAllFriends(int userID) {
        ArrayList<Friend> friends = new ArrayList<Friend>();
        return new Response(201, "message", friends);
    }

}