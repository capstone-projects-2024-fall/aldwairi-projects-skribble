// connection.test.js
const neo4j = require('neo4j-driver');

jest.mock('neo4j-driver');

describe('Neo4j Connection', () => {

  let mockDriver, mockGetServerInfo;

  beforeEach(() => {
    // rest mocks before a new test

    mockGetServerInfo = jest.fn();
    mockDriver = {
    
        getServerInfo: mockGetServerInfo,
      close: jest.fn(),

    };
    neo4j.driver.mockReturnValue(mockDriver);
  });

  // reset
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test if it can access the database
  it('should establish a connection successfully', async () => {
    
    // mock a getServerInfo call
    mockGetServerInfo.mockResolvedValue({ version: 'Neo4j/4.4.0', edition: 'enterprise' });

    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    // import connection
    await require('./connection');

    expect(neo4j.driver).toHaveBeenCalledWith(
        
        // credentials
      'neo4j+s://24f2d4b6.databases.neo4j.io',
      neo4j.auth.basic('neo4j', 'SXrtyxnQgr5WBO8yNwulKKI9B1ulfsiLa8SKvlJk5Hc')

    );
    expect(mockGetServerInfo).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Connection established');
    expect(logSpy).toHaveBeenCalledWith(expect.objectContaining({ version: 'Neo4j/4.4.0' }));

    logSpy.mockRestore();
  });

  // test if user is failing to connect 
  it('should handle connection errors', async () => {

    // Mock a failed getServerInfo call
    const mockError = new Error('Failed to connect');
    mockError.cause = 'Authentication error';
    mockGetServerInfo.mockRejectedValue(mockError);

    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await require('./connection');

    expect(mockGetServerInfo).toHaveBeenCalled();
    
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Connection error/));
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/Authentication error/));

    logSpy.mockRestore();
  });
});
