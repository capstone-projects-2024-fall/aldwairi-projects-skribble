package backend.Tests;

import backend.Controllers.UserController;
import backend.DataAccessLayers.UserDAO;
import backend.Models.User;
import backend.Utils.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsProvider;
import org.junit.jupiter.params.provider.ArgumentsSource;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserControllerTest {

    private UserDAO userDAO;
    private UserController userController;

    /**
     * Sets up the test environment before each test.
     * Initializes the mocked UserDAO and the UserController instance.
     */
    @BeforeEach
    public void setUp() {
        userDAO = mock(UserDAO.class);
        userController = new UserController(userDAO);
    }

    @ParameterizedTest
    @UserSource("valid")
    void testCreateUser(User user) {
        // mock
        when(userDAO.create(user)).thenReturn(true);

        // action
        Response response = userController.createUser(user);

        // assertion
        assertNotNull(response, "Response should not be null");
        assertEquals(201, response.getStatus(), "Status code should be 201");
        assertEquals("message", response.getMessage(), "Message should be 'message'");
        assertEquals(user, response.getData(), "Response data should be the created user");
    }

    @Test
    void testGetUser() {
    }

    @Test
    void testUpdateUser() {
    }

    @Test
    void testDeleteUser() {
    }

    @Test
    void testGetAllUsers() {
    }

    @Target({ElementType.METHOD})
    @Retention(RetentionPolicy.RUNTIME)
    @ArgumentsSource(UserArgumentsProvider.class)
    public @interface UserSource {
        String value();
    }
}

class UserArgumentsProvider implements ArgumentsProvider {

    @Override
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) {

        // Retrieve the test method
        String dataSetType = context.getRequiredTestMethod()
                .getAnnotation(UserControllerTest.UserSource.class)
                .value();

        switch (dataSetType) {
            case "valid":
                return Stream.of(
                        Arguments.of(new User()),
                        Arguments.of(new User()),
                        Arguments.of(new User())
                );
            case "invalid":
                return Stream.of(
                        Arguments.of(new User()),
                        Arguments.of(new User())
                );
            case "boundary":
                return Stream.of(
                        Arguments.of(new User())
                );
            default:
                throw new IllegalArgumentException("Unknown data set type: " + dataSetType);
        }
    }
}
