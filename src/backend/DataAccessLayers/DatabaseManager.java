package backend.DataAccessLayers;

import java.sql.Connection;
public class DatabaseManager {
    /**
     * Manager class to keep track of Data Access Object (DAO) classes
     * Responsibility: Keep track of network addresses and connections to database systems used by
     * all DAO classes.
     */
    private String ENDPOINT;
    private String PORT;
    private String DB_NAME;
    private String JDBC_URL;
    private Connection connection;

    /**
     * Constructor for database manager, initializes endpoint, port, database name, jdbc url, connection
     * @param endpoint is the name of the device which connects to the database
     * @param port is the name of the port used by the connection endpoint
     * @param db_name is the name of the database
     * @param jdbc_url is the unique database connection url assigned to the database
     * @param connection is a Connection object used to assist in database operations
     */
    public DatabaseManager(String endpoint, String port, String db_name, String jdbc_url, Connection connection) {
        ENDPOINT = endpoint;
        PORT = port;
        DB_NAME = db_name;
        JDBC_URL = jdbc_url;
        this.connection = connection;
    }

    /**
     * Returns a Connection object for the associated class
     * capable of interacting with cloud-hosted AWS database.
     * @return connection object of type Connection
     */
    public Connection getConnection() {
        return connection;
    }

    /**
     * Closes corresponding class's connection with AWS database
     */
    public void close() {

    }
}
