/*
 * Created on 22-Dec-2004
 *
 */
package uk.gov.dca.db.util;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.naming.Context;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.CallStack;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * @author Michael Barker
 */
public class DBUtil {
   
    public final static Log log = SUPSLogFactory.getLogger(DBUtil.class);
    public static final String EXECUTE_APP_CONTEXT_PROCEUDRE = "{call set_sups_app_ctx (?,?,?)}";

    /**
     * Method that takes in a <code>ResultSet</code> object and returns a
     * populated <code>List</code> of <code>Map</code> objects.  Each element in
     * a list is a Map object that represents one row in the ResultSet.
     * <p/>
     * The key for the map is the name of the column as returned by the
     * resultset.
     *
     * @param rs The <code>ResultSet</code> object.
     * @return A <code>List</code> of <code>Map</code> objects.
     * @throws SQLException occurs if the column names could not be retrieved.
     */
    public static List getResultMap(ResultSet rs) throws SQLException {
        ResultSetMetaData rsmd = rs.getMetaData();
        int numColumns = rsmd.getColumnCount();

        List list = new ArrayList();

        // Get the column names; column indices start from 1
        while (rs.next()) {
            Map map = new HashMap();

            for (int i = 1; i <= numColumns; i++) {
                String columnName = rsmd.getColumnName(i);
                String value = rs.getString(columnName);
                map.put(columnName, value);
            }

            list.add(map);
        }
        return list;
    }

    /**
     * Gets the default ediary datasource
     *
     * @return
     * @throws SystemException
     */
    /*
    public static DataSource getDataSource() throws SystemException {
        ConfigUtil cu = ConfigUtil.getInstance();
        try {
            return (DataSource) cu.get(Constants.EDIARY_DS, Constants.PROJECT_CONFIG);
        } catch (Exception e) {
            throw new SystemException(e);
        }
    }
    */

    /**
     * Returns a date constraint clause to handle the correct selection of the
     * data.
     *
     * @param date The day in yyyy-MM-dd format.
     * @return A string containing the date with a to_date SQL function
     */
    public static String createDateClause(String date) {
        return "to_date('" + date + "', 'YYYY-MM-DD')";
    }


    /**
     * Quietly closes a database statement.
     *
     * @param s
     */
    public static void quietClose(Statement s) {
        try {
            if (s != null) {
                s.close();
            }
        } catch (Exception e) {
            System.err.println("Failed to close statement");
            e.printStackTrace(System.err);
        }
    }

    /**
     * Quietly closes a database statement.
     *
     * @param s
     */
    public static void quietClose(Connection c) {
        try {
            if (c != null && !c.isClosed()) {
                c.close();
            }
        } catch (Exception e) {
            System.err.println("Failed to close connection");
            e.printStackTrace(System.err);
        }
    }

    /**
     * Quietly closes a database statement.
     *
     * @param s
     */
    public static void quietClose(ResultSet r) {
        try {
            if (r != null) {
                r.close();
            }
        } catch (Exception e) {
            System.err.println("Failed to close result set");
            e.printStackTrace(System.err);
        }
    }

    public static void quietClose(Connection con, Statement statement, ResultSet resultSet){
    	quietClose(resultSet);
    	quietClose(statement);
    	quietClose(con);
    }    
    
    public static void quietClose(Connection con, Statement statement){
    	quietClose(statement);
    	quietClose(con);
    }

    public static void quietClose(Connection con, ResultSet resultSet){
        quietClose(resultSet);
        quietClose(con);
    }
    
    public static void quietClose(Statement statement, ResultSet resultSet){
        quietClose(resultSet);
        quietClose(statement);
    }
    
    public static void quietClose(Context ctx) {
        try {
            if (ctx != null) {
                ctx.close();
            }

        } catch (Exception e) {
            System.err.println("Failed to close context");
            e.printStackTrace(System.err);
        }
    }

    /**
     * Insert database quotes around a String, and escapes any quotes inside the
     * String
     *
     * @param inStr The String to add the quotes to
     * @return The quoted String
     */
    public static String quoteDBString(String inStr) {
        if ((inStr != null) && (inStr.length() > 0)) {
            return "'" + escapeDBString(inStr) + "'";
        } else {
            return "NULL";
        }
    }

    /**
     * Escape the quotes in the string.
     *
     * @param inStr The string to quote.
     * @return The quoted string.
     */
    public static String escapeDBString(String inStr) {
        StringBuffer buf = new StringBuffer(inStr);

        //Escape all quotes
        for (int i = 0; i < buf.length(); i++) {
            if (buf.charAt(i) == '\'') {
                i++;
                buf.insert(i, '\'');
            }
        }

        return buf.toString();
    }
    
    /**
     * Gets the next value from a sequence.
     * 
     * @param cn
     * @param sequence
     * @return
     * @throws SQLException
     */
    public static long getNextSequenceValue(Connection cn, String sequence) throws SQLException
    {
    	return getNextSequenceValue(cn, sequence, null, null);
    }
    
    public static long getNextSequenceValue(Connection cn, String sequence, Log sqlLog, String pivotNode) throws SQLException
    {
        long result;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        StringBuffer sb = new StringBuffer("SELECT ");
        sb.append(sequence);
        sb.append(".NEXTVAL FROM DUAL");
        
        if (sqlLog != null && sqlLog.isInfoEnabled()) 
        {
        	if (pivotNode!=null)
        		logSql(sqlLog, pivotNode, sb.toString());
        	else
        		logSql(sqlLog, sb.toString());
        }
        
        try
        {
            ps = cn.prepareStatement(sb.toString());
            rs = ps.executeQuery();
            
            if (rs.next())
            {
                result = rs.getLong(1);
            }
            else
            {
                throw new SQLException("Unable to get sequence number from sequence = " + sequence);
            }            
        }
        finally
        {
            DBUtil.quietClose(rs);
            DBUtil.quietClose(ps);
        }
        return result;
        
    }
    
    private final static String UNKNOWN = "Unknown";

    public static Object getService() {
        Object result = UNKNOWN;
        ComponentContext cContext = CallStack.getInstance().peek();
        if (cContext != null && cContext.getSystemItem(IComponentContext.SERVICE_NAME_KEY) != null) {
            result = cContext.getSystemItem(IComponentContext.SERVICE_NAME_KEY); 
        }
        return result;
    }
    
    public static Object getMethod() {
        Object result = UNKNOWN;
        ComponentContext cContext = CallStack.getInstance().peek();
        if (cContext != null && cContext.getSystemItem(IComponentContext.METHOD_NAME_KEY) != null) {
            result = cContext.getSystemItem(IComponentContext.METHOD_NAME_KEY); 
        }
        return result;
    }
    
    
    /**
     * Calls the stored procedure to set the application context to be used for auditing.
     * 
     * @param dbConnection
     * @param userId
     * @param courtId
     * @param bpId
     * @throws SystemException
     * @throws BusinessException
     */
    public static void populateApplicationContext(Connection dbConnection, IComponentContext ctx) 
        throws SystemException
    {
    
        String userId = (String) ctx.getSystemItem(IComponentContext.USER_ID_KEY);            
        String courtId = (String) ctx.getSystemItem(IComponentContext.COURT_ID_KEY);
        String businessProcessId = (String) ctx.getSystemItem(IComponentContext.BUSINESS_PROCESS_ID_KEY);
        
        if(userId == null || userId.equalsIgnoreCase("") || courtId == null || courtId.equalsIgnoreCase("") || businessProcessId == null || businessProcessId.equalsIgnoreCase(""))
        {
            throw new SystemException("Invalid userId, courtId or businessProcessId values("+ userId +", "+courtId+", "+businessProcessId+")");
        }
        
        populateApplicationContext(dbConnection, userId, courtId, businessProcessId);
    }
    
    
    /**
     * Calls the stored procedure to set the application context to be used for auditing.
     * 
     * @param dbConnection
     * @param userId
     * @param courtId
     * @param bpId
     * @throws SystemException
     * @throws BusinessException
     */
    public static void populateApplicationContext(Connection dbConnection, String userId, String courtId, String bpId) 
        throws SystemException 
    {
        if (log.isDebugEnabled()) 
        {
            log.debug("Setting app context user: " + userId + ", court: " + courtId + ", process: " + bpId);
        }
        
        CallableStatement appCtxCs = null;
        
        try 
        {
            appCtxCs = dbConnection.prepareCall(EXECUTE_APP_CONTEXT_PROCEUDRE);
            appCtxCs.setString(1, userId);
            appCtxCs.setString(2, courtId);
            appCtxCs.setString(3, bpId);
            
            appCtxCs.execute();
        }
        catch(SQLException e)
        {
            throw new SystemException("Failed to execute procedure that sets the application context for auditing purposes", e);
        }
        finally 
        {
            quietClose(appCtxCs);
        }
    }
    
    
    
    public static void logSql(Log log, String sql) {
        log.info("{" + getService() + "." + getMethod() + "} " + sql);    	
    }
    
    public static void logSql(Log log, String pivot, String sql) {
        log.info("{" + getService() + "." + getMethod() + "} {" + pivot + "} " + sql);    	
    }
    
}
