package uk.gov.dca.db.pipeline;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.PreparedStatement;
import java.util.HashMap;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.RetryableException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.queryengine.QueryDefParser;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.util.SUPSLogFactory;
import uk.gov.dca.db.util.DBUtil;

/**
 * An abstract class providing common functionality for database based components.
 * 
 * @author Howard Howard
 */
public abstract class DBService extends AbstractComponent2 implements IGenerator {

    protected SAXBuilder m_saxBuilder = new SAXBuilder();
    private static final Log log = SUPSLogFactory.getLogger(DBService.class);
    protected QueryDefinitions m_queryDefinitions;
    protected Document m_parameters;
    protected Connection m_connection;
    protected DataSource m_connectionPool;
    private Map m_properties = new TreeMap();
    private Map m_statements = new HashMap();

    /**
     * Holds the prepared statements applicable for the service run.
     */
   
    protected void finalize() throws Throwable
    {
    	resetStatements();
    	super.finalize();
    }
  
    /**
     * Puts the query definitions object in the cache. 
     */
	public void preloadCache( Element processingInstructions, Map preloadCache ) throws SystemException
	{
		Element eQueryDef = processingInstructions.getChild("QueryDef");
		if ( eQueryDef == null ){
			throw new ConfigurationException("'QueryDef' element required for '"+getName()+"'");
		}
		String sFile = eQueryDef.getAttributeValue("location");
		if ( sFile == null ) {
			throw new ConfigurationException("'location' attribute required for  'QueryDef' element of '"+getName()+"'");
		}
		// only create and add a new querydefinitions object if not already in the cache.
		if ( !preloadCache.containsKey(sFile) )
		{
			QueryDefinitions queryDefinitions = new QueryDefinitions();
			queryDefinitions.initialise(sFile, preloadCache);
			preloadCache.put( sFile, queryDefinitions);
			
			// By preparing the query definitions with DB info here we need
			// only do it once rather than per request. Improves performance
			// significantly.
			DataSource connectionPool = queryDefinitions.getConnectionPool();
			Connection oConnection = null;
			oConnection = startConnection(connectionPool);

	    	try {
	    		queryDefinitions.extract(oConnection);
	    		queryDefinitions.prepare(oConnection);
	    	}
	    	finally {
	        	 stopConnection(oConnection);
	        }
	    	
	    	if(log.isDebugEnabled()){
                log.debug("Preloaded and processed: "+ sFile);
            }

		}
	}
	
	/**
	 * validates the common config between db based services
	 */
    public void validate(String methodId, QueryEngineErrorHandler handler, Element processingInstructions, Map preloadMap) 
		throws SystemException
	{
		Element eQueryDef = processingInstructions.getChild("QueryDef");  	
	    if ( eQueryDef == null ) {
	    	handler.raiseError(methodId +" does not specify QueryDef for '"+getName()+"'");
	    }
	    else {
	    	String sFile = eQueryDef.getAttributeValue("location");
	    	if ( sFile == null || sFile.length() == 0) {
	    		handler.raiseError(methodId +" does not specify QueryDef 'location' attribute for '"+getName()+"'");
	    	}
	    	else {
	    		QueryDefParser parser = new QueryDefParser();
	    		parser.setErrorHandler(handler);
	    		
	    		// avoid revalidating unextended query defintions which have already been validated
	    		uk.gov.dca.db.queryengine.QueryDefinitions queryDefs = 
	    			(uk.gov.dca.db.queryengine.QueryDefinitions)preloadMap.get(sFile);
	    		
	    		if (queryDefs == null ) {
	    			queryDefs = parser.parse(sFile,preloadMap);
	    			preloadMap.put(sFile,queryDefs);
	    		}
	    		
	    		parser.extendQueryDefinitions(processingInstructions.getChildren("QueryExtension"), processingInstructions.getChildren("Table"), queryDefs, preloadMap);
	    		queryDefs.unextend();
	    	}
	    }
	}
    
    /**
     * Configures the component, ready to do the queries.
     */
    public void prepare( Element config, Map preloadCache ) throws SystemException
	{
        Element eQueryDef = config.getChild("QueryDef");
    	String sFile = eQueryDef.getAttributeValue("location");
    	QueryDefinitions queryDefs = (QueryDefinitions)preloadCache.get(sFile);
    	if ( queryDefs == null ) {
    		throw new SystemException("Could not retrieve QueryDefinitions defined in file '"+sFile+"' from preload cache");
    	}
    		
    	m_queryDefinitions = new QueryDefinitions(queryDefs);
    	m_connectionPool = m_queryDefinitions.getConnectionPool();
    }
    
    /**
     * Provides a base implementation for processing the input data and
     * querying the DB. Calls into the subclass in order to provide
     * more specialised processing.
     */
	public void process() throws BusinessException, SystemException
	{	
		long startTime = 0;
		
		if ( log.isDebugEnabled() ) {
			startTime = System.currentTimeMillis();
		}
	
		try {
			m_parameters = (Document)this.m_inputData.getData(Document.class);
			
	    	m_connection = startConnection(m_connectionPool);
	    	//populateApplicationContext(m_connection);

	    	prepareQueries();
	    	processTemplate(m_parameters);
	    	m_parameters = null;	    	
    	}
    	finally {
    		resetStatements();
    		stopConnection(m_connection);
    	}
    	
    	if ( log.isDebugEnabled() ) {
    		long timeElapsed = System.currentTimeMillis() - startTime;
    		log.debug(m_name + ": "+m_context.getSystemItem(IComponentContext.SERVICE_NAME_KEY) + 
				"." + m_context.getSystemItem(IComponentContext.METHOD_NAME_KEY) +
				": " + timeElapsed + " milli secs");
    	}
	
    }

    /**
     * The actual work of executing the queries goes here.
     *  
     */
    protected abstract void processTemplate(Document parameters) throws BusinessException, SystemException;

    /**
     * Empties the cache of stored queries.
     * 
     * @throws SystemException
     */
    protected void resetStatements() throws SystemException {
    	if ( m_statements != null )
    	{
    		Collection statements = (Collection)m_statements.values();
    		Iterator itStatements = statements.iterator();
    		PreparedStatement ps = null;
    		PreparedQuery pq = null;
    		
    		while ( itStatements.hasNext() )
    		{
    			pq = (PreparedQuery)itStatements.next();
    			ps = pq.getPreparedStatement(m_connection);
    			
    			DBUtil.quietClose(ps);
    		}
    	}
        m_statements = new HashMap();
    }

    /**
     * Adds a query to the list of queries.
     * 
     * @param queryId
     * @param statement
     */
    protected void addStatement(String queryId, String statement) 
    	throws SystemException
    {
        PreparedQuery pq = new PreparedQuery(statement);
    	m_statements.put(queryId, pq);
    }

    /**
     * Gets a query from the list of queries
     * 
     * @param queryName
     * @return
     */
    protected PreparedQuery getStatement(String queryName) {
        return (PreparedQuery) m_statements.get(queryName);
    }
    
    /**
     * Prepares the queries for use in processing the request.
     */
    protected abstract void prepareQueries() throws BusinessException, SystemException;


    /**
     * Fetches a new connection from the connection pool
     *  
     */
    protected Connection startConnection(DataSource oPool) throws SystemException {
        //fetch a connection from the connection pool
    	Connection pooledConnection = null;
    	try {
    		pooledConnection = oPool.getConnection();
    	}
		catch ( SQLException e ) {
			throw new RetryableException("Failed to retrieve a database connection: "+e.getMessage(),e);
		}
		
        return pooledConnection;
    }

    protected void stopConnection(Connection oConnection) throws SystemException {
        try {
            //releases connections from the connection pool
            if ( oConnection != null ) {
            	
            	oConnection.close();
            }
        } catch (SQLException e) {
        	throw new SystemException("Failed to close a database connection: "+e.getMessage(),e);
        }
    }

    public void addProperty(String name, String xpath) {
        m_properties.put(name, xpath);
    }

    public Iterator getProperties() {
        return m_properties.keySet().iterator();
    }

    public String getXPathForProperty(String property) {
        return (String) m_properties.get(property);
    }
    
    protected class PreparedQuery {
    	private String sql = null;
    	
        public PreparedQuery(String sql) {
    		this.sql = sql;
    	}
    	
    	public PreparedStatement getPreparedStatement(Connection cn) throws SystemException {
    		try {
                return cn.prepareStatement(sql);
            }
            catch (SQLException e) {
                throw new SystemException("Failed to prepare query: " + sql);
            }
    	}
    	
    	public String getSQLString() {
    		return sql;
    	}
    }
}