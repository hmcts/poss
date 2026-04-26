/*
 * Created on 09-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline.query.sql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Element;

import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.pipeline.Query;
import uk.gov.dca.db.pipeline.ContextVariables;


/**
 * @author JamesB
 *
 * NOTE: (GrantM) I have made some updates so that this class can be used without any coupling 
 * to the 'Query' class. This is so that it can be used from the SQLLite component - which
 * reuses the "SQL" element but is independent of the RDBMS-to-XML mapping framework.
 * It isn't very elegant but since this class is about to be deprecated then it doesn't matter.   
 */
public class SQLStatement implements Cloneable {

	/**
	 * Constructor
	 */
	public SQLStatement(StatementType type, Query query) {
		super();
		setType(type);
		this.query = query;
	}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#clone()
	 */
	public Object clone(Query query) {
		StatementType newType = StatementType.getInstance(type.getName());
		
		SQLStatement product = new SQLStatement(newType, query);
		
		product.statementText = statementText;
		product.parameterList = new LinkedList(parameterList);
		
		return product;
	}
	
	protected void setType(StatementType type) {
		this.type = type;
	}
	
	public StatementType getType() {
		return type;
	}
	
	/**
	 * Package visibility
	 * @param statementText
	 */
	void addStatement(String statementText) {
		// Find all parameters
        Matcher vars = Query.s_variablePattern.matcher(statementText);
        while (vars.find()) {
            //add var to dependent vars list
            parameterList.add(vars.group(1));
        }
        //Replace all parameters with ?
        this.statementText = vars.replaceAll("?");
        
        if(log.isInfoEnabled()) {
        	StringBuffer buffer = new StringBuffer("addStatement(): ");
        	buffer.append(type);
        	
        	if ( query != null ) {
        		buffer.append(" statement for [");
        		buffer.append(query.getPivotNode());
        		buffer.append("] =");
        	}
        	buffer.append(" "+this.statementText);
        	log.info(buffer.toString());
        }
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.query.sql.SQLStatement#prepare(java.sql.Connection, uk.gov.dca.db.pipeline.DBService.ContextVariables, org.jdom.Element)
	 */
	public PreparedStatement prepare(Connection con, ContextVariables variables, Element config, String alias) 
		throws SystemException
	{
		PreparedStatement ps = null;
		
		try {
			ps = con.prepareStatement(statementText);
			
			int count = 1;
			Iterator parameters = parameterList.iterator();
	        while (parameters.hasNext()) {
	            String parameter = (String) parameters.next();
	            Object value = null;
	            if(type.equals(StatementType.SELECT)) {
	            	value = variables.getValue(parameter);
	            }
	            else {
	            	value = query.getParameterValue(variables, alias, config, parameter);
	            }
	            log.info("Variable: " + parameter + " value: [" + value + "]");
	            if (value == null) {
	                ps.setString(count++, null);
	            } else {
	                ps.setObject(count++, value);
	            }
	        }
		}
		catch(SQLException e) {
			throw new SQLStatementException("Could not create Prepared Statement: "+e.getMessage(), e);
		}
        
		return ps;
	}
	
	/**
	 * A version of 'prepare' that assumes the context variables are already populated
	 * (other version calls "query.getParameterValue" that addtionally populates context variables)
	 * 
	 * @param con
	 * @param variables
	 * @return
	 * @throws SystemException
	 */
	public PreparedStatement prepare(Connection con, ContextVariables variables)
		throws SystemException
	{
		PreparedStatement ps = null;
		
		try {
			ps = con.prepareStatement(statementText);
			
			int count = 1;
			Iterator parameters = parameterList.iterator();
	        while (parameters.hasNext()) {
	            String parameter = (String) parameters.next();
	            Object value = variables.getValue(parameter);
	           
	            log.info("Variable: " + parameter + " value: [" + value + "]");
	            if (value == null) {
	                ps.setString(count++, null);
	            } else {
	                ps.setObject(count++, value);
	            }
	        }
		}
		catch(SQLException e) {
			throw new SQLStatementException("Could not create Prepared Statement: "+e.getMessage(), e);
		}
        
		return ps;
	}
	
	//public abstract PreparedStatement prepare(Connection con, ContextVariables variables, Element config);
	
	public void extractSelectResults(ResultSet rs, ContextVariables variables) 
		throws SystemException
	{
		if(type != StatementType.SELECT) {
			throw new SQLStatementException("Assertion failure: Attempted to extract results for statement that is not a Select statement");
		}
		String columnName = null;
		try {
			ResultSetMetaData metaData = rs.getMetaData();
	        int numColumns = metaData.getColumnCount();
	        
	        try {
	        	for(int j = 1; j <= numColumns; j++) {
	        		columnName = metaData.getColumnName(j);
	        	
	        		Integer typeIndicator = new Integer(metaData.getColumnType(j));
	        		int typeCode = (typeIndicator == null ? Types.VARCHAR : typeIndicator.intValue());
	        		variables.addFieldValue(columnName, typeCode, rs, j);
	        	}
	        }
			catch(SQLException e) {
				throw new SQLStatementException("Error whilst retrieving column "+columnName, e);
			}
		}
		catch(SQLException e) {
			throw new SQLStatementException("Error retrieving metadata: "+e.getMessage(), e);
		}
	}
	
	protected StatementType type = null;
	protected Query query = null;
	
	protected String statementText = null;
	protected List parameterList = new LinkedList();
	
	private static final Log log = LogFactory.getLog(SQLStatement.class);
}
