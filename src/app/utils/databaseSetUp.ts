import neo4j from 'neo4j-driver';

const createNeo4jDriver = () => {
  return neo4j.driver(
    "neo4j+s://24f2d4b6.databases.neo4j.io", // Replace with your Neo4j instance address
    neo4j.auth.basic("neo4j", "SXrtyxnQgr5WBO8yNwulKKI9B1ulfsiLa8SKvlJk5Hc") // Replace with your credentials
  );
};

export default createNeo4jDriver;