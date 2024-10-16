package backend.Controllers;

import backend.Utils.Response;

public class LlamaController {

    public Response getPrompt() {
        return new Response(200, "message", new Object());
    }
}
