// connection test file for neo4j database
const neo4j = require('neo4j-driver');

// mock db
jest.mock('neo4j-driver', () => ({
  driver: jest.fn(),
  auth: { basic: jest.fn() },
}));

describe('Neo4j Connection', () => {
  let mockDriver, mockGetServerInfo;

  beforeEach(() => {
    // reset mocks before each new test
    mockGetServerInfo = jest.fn();
    mockDriver = {
      getServerInfo: mockGetServerInfo,
      close: jest.fn(),
    };

    // mock the neo4j driver to return mockDriver
    neo4j.driver.mockReturnValue(mockDriver);
  });

  // reset
  afterEach(() => {
    jest.clearAllMocks();
  });

  // tests
  // testing a successful connection to db
  it('should establish a connection successfully', async () => {
    
    // mock getServerInfo to resolve
    mockGetServerInfo.mockResolvedValue({

      version: 'Neo4j/4.4.0',
      edition: 'enterprise',

    });

    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    // import/run connection 
    await import('../backend/graph_database/connection');

    // the assertions
    expect(neo4j.driver).toHaveBeenCalledWith(
      'neo4j+s://24f2d4b6.databases.neo4j.io',
      neo4j.auth.basic('neo4j', 'SXrtyxnQgr5WBO8yNwulKKI9B1ulfsiLa8SKvlJk5Hc')
    );
    expect(mockGetServerInfo).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Connection established');
    expect(logSpy).toHaveBeenCalledWith({
      version: 'Neo4j/4.4.0',
      edition: 'enterprise',
    });

    logSpy.mockRestore();
  });

  // test for bad connection
  it('should handle connection errors', async () => {

    // mock getServerInfo for failure

    const mockError = new Error('Failed to connect');
    mockError.cause = 'Authentication error';

    mockGetServerInfo.mockRejectedValue(mockError);

    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    // import connection logic
    await import('../backend/graph_database/connection');

    // the assertions
    expect(mockGetServerInfo).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith(

      `Connection error\n${mockError}\nCause: ${mockError.cause}`

    );

    logSpy.mockRestore();
  });
});
