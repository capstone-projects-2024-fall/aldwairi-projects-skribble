package backend.Controllers;

import backend.DataAccessLayers.SkribbleDAO;
import backend.Models.Skribble;
import backend.Utils.Response;

import java.util.ArrayList;

public class SkribbleController {

    private SkribbleDAO skribbleDAO;

    /**
     * Constructs a SkribbleController with the specified SkribbleDAO.
     *
     * @param skribbleDAO The SkribbleDAO instance used for database interactions related to skribbles.
     */
    public SkribbleController(SkribbleDAO skribbleDAO) {
        this.skribbleDAO = skribbleDAO;
    }

    /**
     * Creates a new skribble.
     *
     * @param skribble The Skribble object containing the details of the skribble to be created.
     * @return Response containing the created skribble and HTTP status.
     */
    public Response createSkribble(Skribble skribble) {
        return new Response(201, "message", skribble);
    }

    /**
     * Retrieves a skribble by its unique ID.
     *
     * @param skribbleID The unique identifier of the skribble to retrieve.
     * @return Response containing the retrieved skribble and HTTP status.
     */
    public Response getSkribble(int skribbleID) {
        return new Response(201, "message", new Skribble());
    }

    /**
     * Updates the details of an existing skribble.
     *
     * @param skribble The Skribble object containing updated skribble details.
     * @return Response containing the updated skribble and HTTP status.
     */
    public Response updateSkribble(Skribble skribble) {
        return new Response(201, "message", skribble);
    }

     /**
     * Deletes a skribble by its unique ID.
     *
     * @param skribbleID The unique identifier of the skribble to delete.
     * @return Response containing the deleted skribble and HTTP status.
     */
    public Response deleteSkribble(int skribbleID) {
        return new Response(201, "message", new Skribble());
    }

    /**
     * Retrieves a list of all skribbles.
     *
     * @param userID The unique identifier of the user that created the skribbles.
     * @return Response containing the list of skribbles and HTTP status.
     */
    public Response getAllSkribbles(int userID) {
        ArrayList<Skribble> skribbles = new ArrayList<Skribble>();
        return new Response(201, "message", skribbles);
    }

}