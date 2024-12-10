import neo4j from 'neo4j-driver';

/**
 * createNeo4jDriver initializes and returns a Neo4j driver instance that can be used
 * to connect to a Neo4j database. This driver is configured with the necessary connection
 * credentials and the database URL.
 * 
 * - This function uses the Neo4j driver package to create a connection to the database.
 * - It requires the database URL and authentication credentials for the connection.
 * 
 * @returns {neo4j.Driver} A Neo4j driver instance that allows interaction with the Neo4j database.
 */
const createNeo4jDriver = () => {
  return neo4j.driver(
    "neo4j+s://24f2d4b6.databases.neo4j.io", // Replace with your Neo4j instance address
    neo4j.auth.basic("neo4j", "SXrtyxnQgr5WBO8yNwulKKI9B1ulfsiLa8SKvlJk5Hc") // Replace with your credentials
  );
};

export default createNeo4jDriver;