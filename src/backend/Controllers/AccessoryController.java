package backend.Controllers;

import backend.DataAccessLayers.AccessoryDAO;
import backend.Models.Accessory;
import backend.Utils.Response;

import java.util.ArrayList;

public class AccessoryController {

    private AccessoryDAO accessoryDAO;

    /**
     * Constructs a AccessoryController with the specified AccessoryDAO.
     *
     * @param accessoryDAO The AccessoryDAO instance used for database interactions related to accessories.
     */
    public AccessoryController(AccessoryDAO accessoryDAO) {
        this.accessoryDAO = accessoryDAO;
    }

    /**
     * Creates a new accessory.
     *
     * @param accessory The Accessory object containing the details of the accessory to be created.
     * @return Response containing the created accessory and HTTP status.
     */
    public Response createAccessory(Accessory accessory) {
        return new Response(201, "message", accessory);
    }

    /**
     * Retrieves a accessory by its unique ID.
     *
     * @param accessoryID The unique identifier of the accessory to retrieve.
     * @return Response containing the retrieved accessory and HTTP status.
     */
    public Response getAccessory(int accessoryID) {
        return new Response(201, "message", new Accessory());
    }

    /**
     * Updates the details of an existing accessory.
     *
     * @param accessory The Accessory object containing updated accessory details.
     * @return Response containing the updated accessory and HTTP status.
     */
    public Response updateAccessory(Accessory accessory) {
        return new Response(201, "message", accessory);
    }

    /**
     * Deletes a accessory by its unique ID.
     *
     * @param  accessoryID The unique identifier of the accessory to delete.
     * @return Response containing the deleted accessory and HTTP status.
     */
    public Response deleteAccessory(int accessoryID) {
        return new Response(201, "message", new Accessory());
    }

    /**
     * Retrieves a list of all accessories.
     *
     * @param petID The unique identifier of the pet that possesses the accessories.
     * @return Response containing the list of accessories and HTTP status.
     */
    public Response getAllAccessories(int petID) {
        ArrayList<Accessory> accessories = new ArrayList<Accessory>();
        return new Response(201, "message", accessories);
    }

}