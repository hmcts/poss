package uk.gov.dca.db.pipeline;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import oracle.sql.ROWID;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.query.sql.SQLStatement;
import uk.gov.dca.db.util.SUPSLogFactory;


/**
 * Each query is associated with a context which holds the values of 
 * various parameters which may need to be used in the 'where' clause
 * of a SQL query. These values can come from the results of previous queries.
 * There is a tree of contexts since the pivot nodes form a conceptual tree of queries.
 */
public class ContextVariables implements IQueryContextReader {
    private static final Log log = SUPSLogFactory.getLogger(ContextVariables.class);
    
    private ContextVariables m_parent;

    private String m_context;

    private HashMap m_values = new HashMap();

    public ContextVariables() {
        super();
        m_context = "/";
    }

    public ContextVariables(String context) {
        super();
        m_context = context;
    }
    
    public ContextVariables(ContextVariables contextVariables, String context) {
        super();
        m_parent = contextVariables;
        m_context = context;
    }

    /**
     * Populates the context using results froma database query.
     * 
     * @param contextVariables
     * @param rs
     * @param query
     * @throws SystemException
     */
    public ContextVariables(ContextVariables contextVariables, ResultSet rs, Query query) 
    	throws SystemException 
	{
        m_parent = contextVariables;
        m_context = query.getPivotNode();
        int col = 1;
        
        SQLStatement statement = query.getSelectStatement();
        if(statement != null) {
            statement.extractSelectResults(rs, contextVariables);
        }
        else {
        	Iterator i = query.getSelectParameters();
        	
            while (i.hasNext()) {
            	String param = (String)i.next();
            	String paramValue = "";
            	
            	addFieldValue(param, query.getType(param), rs, col++);
            }
        }
    }

    public Object clone()
    {
    	ContextVariables theClone = new ContextVariables(m_context);
    	theClone.m_parent = m_parent;
    	
    	Iterator it = m_values.entrySet().iterator();
    	while( it.hasNext() ) {
    		Map.Entry entry = (Map.Entry)it.next();
    		theClone.m_values.put( new String((String)entry.getKey()), new String((String)entry.getValue()) );
    	}
    	return theClone;
    }
    
    public void addFieldValue(String name, int type, ResultSet rs, int pos) throws SystemException {
    	String paramValue = "";
    	
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
    	}
    	        	
    	if(log.isDebugEnabled()) {
    		log.debug("ContextVariables.addFieldValue(): Query result - " + name + " = " + paramValue);
    	}
    	
    	m_values.put(name, paramValue);
    }
    
    public String getContext() {
        return m_context;
    }

    public void addVariable(String name, Object value) {
        m_values.put(name, value);
    }

    public boolean hasParent() {
        return m_parent != null;
    }

    public ContextVariables getParent() {
        return (ContextVariables) m_parent;
    }

    public boolean hasDirectVariable(String variable) {
        if (variable.startsWith("../") && hasParent()) {
            return m_parent.hasVariable(variable.substring(3));
        } else {
            return m_values.containsKey(variable);
        }
    }

    public boolean hasVariable(String variable) {
        if (variable.startsWith("../") && hasParent()) {
            return m_parent.hasVariable(variable.substring(3));
        } else {
            if (!m_values.containsKey(variable)) {
                if (hasParent()) {
                    return m_parent.hasVariable(variable);
                } else {
                    return false;
                }
            } else {
                return m_values.containsKey(variable);
            }
        }
    }

    public Object getValue(String variable) throws SystemException {
        if (variable.startsWith("../") && hasParent()) {
            return m_parent.getValue(variable.substring(3));
        } else {
            if (!m_values.containsKey(variable)) {
                if (hasParent()) {
                    return m_parent.getValue(variable);
                } else {
                    throw new SystemException("Variable: " + variable + " not found");
                }
            } else {
                return m_values.get(variable);
            }
        }
    }
    
    public Iterator getVariableNames() {
    	return m_values.keySet().iterator();
    }
}