/*
 * Created on 18-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.executor;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;

import uk.gov.dca.db.SupsConstants;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextWriter;
import uk.gov.dca.db.pipeline.mapping.Key;
import uk.gov.dca.db.pipeline.mapping.KeyDef;
import uk.gov.dca.db.pipeline.mapping.output.Context;
import uk.gov.dca.db.pipeline.mapping.sql.Statement;
import uk.gov.dca.db.pipeline.mapping.sql.StatementFactory;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * An executor for linked join nodes.  Will handled and sub-query nodes that
 * have been absorbed into the creating select.  It will be passed a map of results
 * objects that will hold the results for each node.  It will use the ResultsExecutor
 * to handle interation through the results even for its own values.
 * 
 * @author Michael Barker
 *
 */
public class LinkedSQLExecutor extends AbstractExecutor {

    private final static Log sqllog = SUPSLogFactory.getLogger(SupsConstants.SQL_LOG);
    private final static Log log = SUPSLogFactory.getLogger(LinkedSQLExecutor.class);
    private final StatementFactory m_statementFactory;
    private final Map m_resultsMap;
    private Map executors = new HashMap();
    private final String m_name;
    private KeyDef m_cacheKeyDef;
    private Key cachedKey;
    private Map columnAliases;
    
    public LinkedSQLExecutor(StatementFactory statementFactory, String name, Map resultsMap, KeyDef cacheKeyDef, Map customHandlers) {
    	super(customHandlers);
        m_statementFactory = statementFactory;
        m_resultsMap = resultsMap;
        m_name = name;
        m_cacheKeyDef = cacheKeyDef;
    }
    
    /**
     * Determines if the cache key for this executor has changed.
     * 
     * @param context
     * @return
     */
    public boolean isCached(Context context) {
        
        Key newKey = m_cacheKeyDef.create(context);
        boolean result = newKey.equals(cachedKey);
        cachedKey = newKey;
        return result;
        
    }
    

    /**
     * Opens the linked join connection to the database.  This will load all of the
     * data in the result set into memory.
     * @throws BusinessException 
     * 
     */
    public void open(Connection cn, Document inputXML, Context context) throws SystemException, BusinessException {
        
        if (!isCached(context)) {
            PreparedStatement ps = null;
            ResultSet rs = null;
            
            try {
                Statement st = m_statementFactory.getStatement(inputXML, context);
                ps = cn.prepareStatement(st.getSQL());
                columnAliases = st.getColumnAliases();
                int idx = 1;
                for (Iterator i = st.getDependentVariables().iterator(); i.hasNext();) {
                    String variable = (String) i.next();
                    Object value = context.getValue(variable);
                    if (value != null) {
                        ps.setObject(idx, value);
                    }
                    else {
                        ps.setNull(idx, Types.VARCHAR);
                    }
                    idx++;
                }
                if (sqllog.isInfoEnabled()) {
                	DBUtil.logSql(sqllog, m_name, st.getSQL());
                }
                rs = ps.executeQuery();
                ResultSetMetaData rsmd = rs.getMetaData();
                loadResults(rs, rsmd);
                
                for (Iterator i = m_resultsMap.entrySet().iterator(); i.hasNext();) {
                    Map.Entry entry = (Map.Entry) i.next();
                    String name = (String) entry.getKey();
                    Results results = (Results) entry.getValue();
                    ResultsExecutor rex = new ResultsExecutor(results);
                    // Makes sure the delegated executor is open.
                    rex.open(cn, inputXML, context);
                    executors.put(name, rex);
                }
            }
            catch (SQLException e) {
                throw new SystemException("Failed load data into linked join: " + e.getMessage(), e);
            }
            finally {
                DBUtil.quietClose(ps);
                DBUtil.quietClose(rs);
            }
        }
        getThisExecutor().open(cn, inputXML, context);
    }
    
    /**
     * Gets the executor that represents this node.
     * 
     * @return
     */
    private Executor getThisExecutor() {
        return (Executor) executors.get(m_name);
    }
    
    /**
     * Loads all of the results of the query into memory for extraction later.
     * 
     * @param rs
     * @param rsmd
     * @throws SQLException
     * @throws SystemException 
     */
    private void loadResults(ResultSet rs, ResultSetMetaData rsmd) throws SQLException, SystemException {
        
        clearResults();
        
        while (rs.next()) {
        	Map row = createMap();
            MapWriter rowWriter = new MapWriter(row);
            
            loadRow(rs, rsmd, columnAliases, rowWriter);
            /*
            Handler[] handlers = new Handler[rsmd.getColumnCount()];
            String[] columns = new String[rsmd.getColumnCount()];
            for (int i = 1; i <= rsmd.getColumnCount(); i++) {
            	int idx = i-1;
            	
            	// Load the names of the columns.
            	if (columns[idx] == null) {
                    String column = rsmd.getColumnName(i);            		
                    if (columnAliases.containsKey(column)) {
                        column = (String) columnAliases.get(column);
                    }
                    columns[idx] = column;
            	}
            	// Load the handlers.
            	if (handlers[idx] != null) {
            		Handler handler = (Handler) m_customHandlers.get(columns[idx]);
            		if (handler == null) {
            			handler = DefaultHandler.getDefault();
            		}
            		handlers[idx] = handler;
            	}
            	
                int type = rsmd.getColumnType(i);
                String value = handlers[idx].getValue(type, rs, i);
                //String value = getValue(column, type, rs, i);
                row.put(columns[idx], value);
            }
            */
            
            for (Iterator i = m_resultsMap.values().iterator(); i.hasNext();) {
                Results results = (Results) i.next();
                results.addRow(row);
            }            
        }
    }

    /**
     * Clears all of the current results.
     *
     */
    private void clearResults() {
        for (Iterator i = m_resultsMap.values().iterator(); i.hasNext();) {
            Results results = (Results) i.next();
            results.clear();
        }            
    }

    /**
     * Uses the iterator on the map to mimic 
     */
    public boolean next() throws SystemException {
        return getThisExecutor().next();
   }

    /**
     * No-op all resources used during the open.
     */
    public void close() {
        Executor e = getThisExecutor();
        if (e != null) {
            e.close();
        }
        else {
            log.warn("[" + m_name + "] Executor is currently null");
        }
    }

    /**
     * Simply sets the current head context values to be this result.
     */
    public void load(Context context) throws SystemException {
        getThisExecutor().load(context);
    }
    
    /**
     * Gets the child executor for this linked sql node.
     */
    public Executor getDelegateExecutor(String name) {
        return (Executor) executors.get(name);
    }
    
    /**
     * Use this to create all of the necessary map structures.  Allows
     * easy changing of the map implementation.
     * 
     * @return
     */
    public static Map createMap() {
        return new HashMap();
    }

    public boolean isCacheable() {
        // TODO Auto-generated method stub
        return true;
    }
    
    private static class MapWriter implements IQueryContextWriter {
    	
    	private Map m;

		public MapWriter(Map m) {
    		this.m = m;
    	}
    	
    	public void setValue(String variable, Object value) {
    		m.put(variable, value);
    	}
    }
    
}
