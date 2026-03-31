/*
 * Created on 19-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.executor;

import java.lang.reflect.Array;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.Map;

import oracle.sql.ROWID;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextWriter;
import uk.gov.dca.db.pipeline.mapping.jdbc.DefaultHandler;
import uk.gov.dca.db.pipeline.mapping.jdbc.Handler;
import uk.gov.dca.db.util.SUPSLogFactory;

public abstract class AbstractExecutor implements Executor {

    private final static Log log = SUPSLogFactory.getLogger(AbstractExecutor.class);
    
    private Map m_customHandlers;
    
    public AbstractExecutor(Map customHandlers) {
    	m_customHandlers = customHandlers;
    }
    
    public String getLinkedParent() {
        return null;
    }
    
    public Executor getDelegateExecutor(String name) throws SystemException {
        throw new SystemException(this.getClass() + " does not support delegate executors");
    }
    
    protected void loadRow(ResultSet rs, ResultSetMetaData rsmd, Map columnAliases, IQueryContextWriter values) throws SQLException {
    	
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
        	if (handlers[idx] == null) {
        		Handler handler = (Handler) m_customHandlers.get(columns[idx]);
        		if (handler == null) {
        			handler = DefaultHandler.getDefault();
        		}
        		handlers[idx] = handler;
        	}
        	
            int type = rsmd.getColumnType(i);
            String value = handlers[idx].getValue(type, rs, i);
            values.setValue(columns[idx], value);
        }    	
    }
    
    
    
    /**
     * Adds a field value to the map that contains this row.  Converts to a string as required.
     * 
     * @param name
     * @param type
     * @param rs
     * @param pos
     * @param row
     * @throws SystemException
     */
    public String getValue(String name, int type, ResultSet rs, int pos) throws SystemException {
        String paramValue;
        
        switch(type) {
            case Types.DATE:
                java.sql.Date aDate = null;
                try {
                    aDate = rs.getDate(pos);
                }
                catch(SQLException e){
                    throw new SystemException("Unable to retrieve date from result set: "+e.getMessage(),e);
                }
                
                if ( aDate != null ) {
                    SimpleDateFormat dateFormat = (SimpleDateFormat) SimpleDateFormat.getInstance();
                    dateFormat.applyPattern("yyyy-MM-dd");
                    paramValue = dateFormat.format(aDate);
                }
                else {
                    paramValue = "";
                }
                break;
                
            case Types.TIMESTAMP:
                Timestamp atime = null;
                try {
                    atime = rs.getTimestamp(pos);
                }
                catch(SQLException e){
                    throw new SystemException("Unable to retrieve date from result set: "+e.getMessage(),e);
                }
                
                if ( atime != null ) {
                    SimpleDateFormat dateFormat = (SimpleDateFormat) SimpleDateFormat.getInstance();
                    dateFormat.applyPattern("yyyy-MM-dd HH:mm:ss");
                    paramValue = dateFormat.format(atime);
                }
                else {
                    paramValue = "";
                }
                break;
                
            case Types.ARRAY:
                try {
                    Object o = rs.getArray(pos).getArray();
                    StringBuffer sb = new StringBuffer();
                    for (int i = 0; i < Array.getLength(o); i++) {
                        String val = Array.get(o, i).toString();
                        sb.append(val);
                        if (i < Array.getLength(o) - 1) {
                            sb.append(",");
                        }
                    }
                    paramValue = sb.toString();
                }
                catch (SQLException e) {
                    throw new SystemException("Unable to retrieve item from result set: "+e.getMessage(),e);
                }
                break;
                
            default:
                Object resultItem = null;
                try {
                    resultItem = rs.getObject(pos);
                }
                catch(SQLException e){
                    throw new SystemException("Unable to retrieve item from result set: "+e.getMessage(),e);
                }
                
                if ( resultItem != null && (resultItem instanceof ROWID)){ 
                    paramValue = ((ROWID) resultItem).stringValue();
                }
                else if(resultItem != null){
                    paramValue = resultItem.toString();
                }
                else {
                    paramValue = "";
                }
        }
                    
        if(log.isTraceEnabled()) {
            log.trace("Query result - " + name + " = " + paramValue);
        }
        
        return paramValue;
    }    
}
