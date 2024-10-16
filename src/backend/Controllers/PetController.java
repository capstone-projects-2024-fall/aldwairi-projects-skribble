package backend.Controllers;

import backend.DataAccessLayers.PetDAO;
import backend.Models.Pet;
import backend.Utils.Response;

public class PetController {

    private PetDAO petDAO;

    /**
     * Constructs a PetController with the specified PetDAO.
     *
     * @param petDAO The PetDAO instance used for database interactions related to pets.
     */
    public PetController(PetDAO petDAO) {
        this.petDAO = petDAO;
    }

    /**
     * Creates a new pet.
     *
     * @param pet The Pet object containing the details of the pet to be created.
     * @return Response containing the created pet and HTTP status.
     */
    public Response createPet(Pet pet) {
        return new Response(201, "message", pet);
    }

    /**
     * Retrieves a pet by their unique ID.
     *
     * @param petID The unique identifier of the pet to retrieve.
     * @return Response containing the retrieved pet and HTTP status.
     */
    public Response getPet(int petID) {
        return new Response(201, "message", new Pet());
    }

    /**
     * Updates the details of an existing pet.
     *
     * @param pet The Pet object containing updated pet details.
     * @return Response containing the updated pet and HTTP status.
     */
    public Response updatePet(Pet pet) {
        return new Response(201, "message", pet);
    }

     /**
     * Deletes a pet by their unique ID.
     *
     * @param petID The unique identifier of the pet to delete.
     * @return Response containing the deleted pet and HTTP status.
     */
    public Response deletePet(int petID) {
        return new Response(201, "message", new Pet());
    }

}
