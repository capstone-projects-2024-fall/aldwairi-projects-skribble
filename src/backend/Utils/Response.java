package backend.Utils;

public class Response {

    private final int status;
    private final String message;
    private final Object data;

    /**
     * Constructs a new Response with the specified status, message, and data.
     *
     * @param status  the HTTP status code of the response
     * @param message the descriptive message for the response
     * @param data    the payload data of the response
     */
    public Response(int status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public Object getData() {
        return data;
    }
}
