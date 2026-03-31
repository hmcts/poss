package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.StringReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Collection;
import java.util.TreeMap;
import javax.sql.DataSource;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.queryengine.QueryDefParser;
import uk.gov.dca.db.exception.*;

/**
 * An abstract class providing common functionality for database based components.
 * 
 * @author Howard Howard
 */
public abstract class DBService extends AbstractComponent implements IGenerator {

    protected SAXBuilder m_saxBuilder = new SAXBuilder();
    private static final Log log = LogFactory.getLog(DBService.class);
    protected QueryDefinitions m_queryDefinitions;
    protected Document m_parameters;
    protected Connection m_connection;
    protected DataSource m_connectionPool;

    /**
     * Holds the prepared statements applicable for the service run.
     */
    private Map m_statements;

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
	    		queryDefinitions.prepare(oConnection);
	    	}
	    	finally {
	        	 stopConnection(oConnection);
	        }
	    	
	    	log.info("Preloaded and processed: "+ sFile);
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
		String sInput = m_dataSrc.toString();
		SAXBuilder builder = new SAXBuilder();
		Document parameters = null;
		try {
			parameters = builder.build( new StringReader(sInput) );
		}
		catch( IOException e ) {
    		throw new SystemException("Failed to read pipeline component input: "+e.getMessage(),e);
		}
		catch( JDOMException e ) {
    		throw new BusinessException("Failed to process pipeline component input: "+e.getMessage(),e);
		}
		
    	try {
    		m_connection = startConnection(m_connectionPool);
	    	m_parameters = parameters;
	    	prepareQueries();
	    		
	    	processTemplate(parameters);
	    	m_parameters = null;
	    	m_dataSink = null;
    	}
    	finally {
    		resetStatements();
    		stopConnection(m_connection);
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
    		
    		while ( itStatements.hasNext() )
    		{
    			PreparedStatement ps = (PreparedStatement)itStatements.next();
    			try {
    				if ( ps != null ) ps.close();
    			}
    			catch(SQLException e) {
    				throw new SystemException("Fail to close prepared statement: "+e.getMessage(),e);
    			}
    		}
    	}
        m_statements = new HashMap();
    }

    /**
     * Adds a query to the list of prepared queries.
     * 
     * @param queryId
     * @param statement
     */
    protected void addStatement(String queryId, PreparedStatement statement) {
        m_statements.put(queryId, statement);
    }

    /**
     * Gets a query from the list of prepared queries.
     * 
     * @param pivotNode
     * @return
     */
    protected PreparedStatement getStatement(String pivotNode) {
        return (PreparedStatement) m_statements.get(pivotNode);
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
            	
            	/* USEFUL FOR DEBUGGING OPEN CONNECTIONS
            	Statement s = oConnection.createStatement();
    			if ( s != null ) {
    				ResultSet rsOpenCursors = s.executeQuery("select a.value as \"CURSORS\", b.name from v$mystat a, v$statname b where a.statistic# = b.statistic# and a.statistic# = 3");
	    			
	    			if ( rsOpenCursors != null ) {
	    				rsOpenCursors.next();
	    				int numOpenCursors = rsOpenCursors.getInt("CURSORS");
	    				log.debug("OPEN CURSORS AT CLOSE="+numOpenCursors);
	    				rsOpenCursors.close();
	    			}
	    			
	    			s.close();
    			}
    			*/
            	oConnection.close();
            }
        } catch (SQLException e) {
        	throw new SystemException("Failed to close a database connection: "+e.getMessage(),e);
        }
    }

    private Map m_properties = new TreeMap();

    public void addProperty(String name, String xpath) {
        m_properties.put(name, xpath);
    }

    public Iterator getProperties() {
        return m_properties.keySet().iterator();
    }

    public String getXPathForProperty(String property) {
        return (String) m_properties.get(property);
    }
}