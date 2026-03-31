/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.async;

import java.io.IOException;
import java.io.StringReader;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.Assert;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Manages AsyncCommand objects, handles persistence for the object.
 * 
 * @author Michael Barker
 *
 */
public class AsyncCommandManager
{
    private final static String LOAD_SQL = "SELECT ID, USER_ID, COURT_ID, NODE, SERVICE, METHOD, DESTINATION, REQUEST_TYPE, REQUEST, RESPONSE, STATE, TIMETAKEN, CREATED_DATE FROM ASYNC_COMMAND WHERE ID = ?";
    private final static String SAVE_SQL = "UPDATE ASYNC_COMMAND SET USER_ID = ?, COURT_ID = ?, NODE = ?, SERVICE = ?, METHOD = ?, DESTINATION = ?, REQUEST_TYPE = ?, REQUEST = ?, RESPONSE = ?, STATE = ?, TIMETAKEN = ? WHERE ID = ?";
    private final static String CREATE_SQL = "INSERT INTO ASYNC_COMMAND (ID, USER_ID, COURT_ID, NODE, SERVICE, METHOD, DESTINATION, REQUEST_TYPE, REQUEST, RESPONSE, STATE, TIMETAKEN) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private final static String ID_SEQUENCE = "ASYNC_COMMAND_SEQUENCE";
    private final static String GET_STATE_SQL = "SELECT STATE FROM ASYNC_COMMAND WHERE ID = ?";
    private final static String CANCEL_SQL = "UPDATE ASYNC_COMMAND SET STATE = ? WHERE ID = ?";
    private final static String FIND_BY_USER_ID_SQL = "SELECT ID, USER_ID, COURT_ID, NODE, SERVICE, METHOD, DESTINATION, REQUEST_TYPE, REQUEST, RESPONSE, STATE, TIMETAKEN, CREATED_DATE FROM ASYNC_COMMAND WHERE USER_ID = ? AND TO_CHAR(SYSDATE, 'YYYY-MM-DD') = TO_CHAR(CREATED_DATE, 'YYYY-MM-DD')";
    private final static String GET_STATS_SQL = 
        "SELECT 'AVERAGE' AS NAME, NVL(AVG(TIMETAKEN), 0) AS VALUE FROM ASYNC_COMMAND WHERE STATE = 0 AND TO_CHAR(CREATED_DATE, 'YYYY-MM-DD') = TO_CHAR(SYSDATE, 'YYYY-MM-DD') AND DESTINATION = ? AND NODE = ?" +
    	"UNION " +
    	"SELECT 'COUNT' AS NAME, NVL(COUNT(ID), 0) AS VALUE FROM ASYNC_COMMAND WHERE (STATE = 1 OR STATE = 2) AND TO_CHAR(CREATED_DATE, 'YYYY-MM-DD') = TO_CHAR(SYSDATE, 'YYYY-MM-DD') AND DESTINATION = ? AND NODE = ? AND ID < ?";
    private final static Log log = SUPSLogFactory.getLogger(AsyncCommandManager.class);
    private final DataSource ds;
    private static final long DEFAULT_TIMETAKEN = 0;
    private static final int DEFAULT_STATE = AsyncCommand.State.QUEUED;
    private static final String DEFAULT_RESPONSE = "";
    
    public AsyncCommandManager(DataSource ds)
    {
        this.ds = ds;
    }
    
    /**
     * Loads a AysncCommand from the database given a specified id.
     * 
     * @param id
     * @return
     * @throws SystemException
     * @throws SQLException
     * @throws IOException
     */
    public AsyncCommand load(long id) throws SystemException, IOException, SQLException
    {
        AsyncCommand result = new AsyncCommand(id);
        Connection cn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try
        {
            cn = getConnection();
            ps = cn.prepareStatement(LOAD_SQL);
            ps.setLong(1, id);
            rs = ps.executeQuery();
            
            if (rs.next())
            {
                result = load(rs);
            }
            else
            {
                throw new SystemException("AsyncCommand with id = " + id + " not found");
            }            
        }
        finally
        {
            DBUtil.quietClose(rs);
            DBUtil.quietClose(ps);
            DBUtil.quietClose(cn);
        }
        
        return result;
    }

    
    public AsyncCommand create(String userId, String courtId, String node, String serviceName, 
            String methodName, String destination, int requestType, String request) throws SystemException
    {
        return create(userId, courtId, node, serviceName, methodName, destination, requestType, 
                request, DEFAULT_RESPONSE, DEFAULT_STATE, DEFAULT_TIMETAKEN);
    }
    
    /**
     * Creates a new AsyncCommand in the database given the service, method and parameters.
     * 
     * @param serviceName
     * @param methodName
     * @param request
     * @return
     * @throws SQLException
     * @throws SystemException
     */
    public AsyncCommand create(String userId, String courtId, String node, String serviceName, 
            String methodName, String destination, int requestType, String request, 
            String response, int state, long timeTaken) throws SystemException
    {
        Assert.assertTrue(userId != null, log, "userId is not sepecified");
        Assert.assertTrue(courtId != null, log, "courtId is not sepecified");
        Assert.assertTrue(serviceName != null, log, "serviceName is not sepecified");
        Assert.assertTrue(methodName != null, log, "methodName is not sepecified");
        Assert.assertTrue(methodName != null, log, "request is not sepecified");
        
        AsyncCommand cmd = null;
        Connection cn = null;

        if (log.isDebugEnabled())
        {
            log.debug("Creating async request. User: " + userId + ", Court: " + courtId + ", Service: " + serviceName + ", Method: " + methodName + " Request: " + request);            
        }
        
        try
        {
            cn = getConnection();
            
            long id = DBUtil.getNextSequenceValue(cn, ID_SEQUENCE);
            
            cmd = new AsyncCommand(id);
            cmd.setUserId(userId);
            cmd.setCourtId(courtId);
            cmd.setNode(node);
            cmd.setServiceName(serviceName);
            cmd.setMethodName(methodName);
            cmd.setDestination(destination);
            cmd.setDestination(destination);
            cmd.setRequestType(requestType);
            cmd.setRequest(request);
            cmd.setResponse(response);
            cmd.setState(AsyncCommand.State.QUEUED);
            cmd.setTimeTaken(timeTaken);
            
            insert(cn, cmd);
            
        }
        catch (SQLException e)
        {
            throw new SystemException("Failed to create AsyncCommand", e);
        }
        finally
        {
            DBUtil.quietClose(cn);            
        }
        
        return cmd;
    }
    
    /**
     * Saves an updated command.  It will only save the response and the
     * state values as the other values are immutable.
     * 
     * @param command
     * @throws SQLException
     */
    public void save(AsyncCommand command) throws SQLException
    {
        Connection cn = null;
        
        try
        {
            cn = getConnection();
            update(cn, command);
        }
        finally
        {
            DBUtil.quietClose(cn);            
        }
        
    }
    
    
    private Connection getConnection() throws SQLException
    {
        return ds.getConnection();
    }
   
    
    /**
     * Gets the current state of the async command.
     * 
     * @param id
     * @return
     * @throws SQLException
     * @throws SystemException
     */
    public int getState(long id) throws SQLException, SystemException
    {
        Connection cn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try
        {
            cn = getConnection();
            ps = cn.prepareStatement(GET_STATE_SQL);
            ps.setLong(1, id);
            
            rs = ps.executeQuery();
            
            if (rs.next())
            {
                return rs.getInt("STATE");
            }
            else
            {
                throw new SystemException("Id: " + id + " was not found");
            }
        }
        finally
        {
            DBUtil.quietClose(cn);
            DBUtil.quietClose(ps);
            DBUtil.quietClose(rs);
        }
    }
    
    /**
     * Cancels an asynchronus request.
     * 
     * @param id
     * @throws SystemException
     */
    public void cancel(long id) throws SystemException
    {
        Connection cn = null;
        PreparedStatement ps = null;
   
        try
        {
            cn = getConnection();
            ps = cn.prepareStatement(CANCEL_SQL);
            ps.setLong(2, id);
            ps.setInt(1, AsyncCommand.State.CANCELLED);
            ps.executeUpdate();
        }
        catch (SQLException e)
        {
            throw new SystemException(e);
        }
        finally
        {
            DBUtil.quietClose(ps);
            DBUtil.quietClose(cn);
        }
    }
    
    /**
     * Finds a list of commands by user id for the current day.
     * 
     * @param userId
     * @return
     * @throws SystemException
     */
    public Collection findByUser(String userId) throws SystemException
    {
        Collection c = new ArrayList();
        Connection cn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try
        {
            cn = getConnection();
            ps = cn.prepareStatement(FIND_BY_USER_ID_SQL);
            ps.setString(1, userId);
            rs = ps.executeQuery();
            
            while (rs.next())
            {
                c.add(load(rs));
            }
        }
        catch (SQLException e)
        {
            throw new SystemException(e);            
        }
        catch (IOException e)
        {
            throw new SystemException(e);
        }
        finally
        {
            DBUtil.quietClose(cn);
            DBUtil.quietClose(ps);
            DBUtil.quietClose(rs);
        }
        
        return c;
    }
    
    /**
     * Gets some statistics regards the processing of messages.
     * 
     * @param cmd
     * @return
     * @throws SystemException
     */
    public AsyncStats getStats(AsyncCommand cmd) throws SystemException
    {
        AsyncStats stats = new AsyncStats();
        Connection cn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try
        {
            cn = getConnection();
            ps = cn.prepareStatement(GET_STATS_SQL);
            ps.setString(1, cmd.getDestination());
            ps.setString(2, cmd.getNode());
            ps.setString(3, cmd.getDestination());
            ps.setString(4, cmd.getNode());
            ps.setLong(5, cmd.getId());
            
            rs = ps.executeQuery();
            
            while (rs.next())
            {
                String name = rs.getString("NAME");
                long value = rs.getLong("VALUE");
                stats.set(name, value);
            }
        }
        catch (SQLException e)
        {
            throw new SystemException(e);
        }
        finally
        {
            DBUtil.quietClose(rs);
            DBUtil.quietClose(ps);
            DBUtil.quietClose(cn);
        }
        
        return stats;
    }
    
    
    /**
     * Inserts a new command into the database.
     * 
     * @param cn
     * @param ac
     * @throws SQLException
     */
    private void insert(Connection cn, AsyncCommand ac) throws SQLException
    {
        PreparedStatement ps = null;
        
        try
        {
            ps = cn.prepareStatement(CREATE_SQL);
            
            ps.setLong(1, ac.getId());
            ps.setString(2, ac.getUserId());
            ps.setString(3, ac.getCourtId());
            ps.setString(4, ac.getNode());
            ps.setString(5, ac.getServiceName());
            ps.setString(6, ac.getMethodName());
            ps.setString(7, ac.getDestination());
            ps.setInt(8, ac.getRequestType());
            ps.setCharacterStream(9, new StringReader(ac.getRequest()), ac.getRequest().length());
            ps.setCharacterStream(10, new StringReader(ac.getResponse()), ac.getResponse().length());
            ps.setInt(11, ac.getState());
            ps.setLong(12, ac.getTimeTaken());
            
            ps.executeUpdate();            
        }
        finally
        {
            DBUtil.quietClose(ps);
        }
    }
    
    /**
     * Updates the supplied command.
     * 
     * @param cn
     * @param ac
     * @throws SQLException
     */
    private void update(Connection cn, AsyncCommand ac) throws SQLException
    {
        PreparedStatement ps = null;
        
        try
        {
            ps = cn.prepareStatement(SAVE_SQL);
            
            ps.setLong(12, ac.getId());
            ps.setString(1, ac.getUserId());
            ps.setString(2, ac.getCourtId());
            ps.setString(3, ac.getNode());
            ps.setString(4, ac.getServiceName());
            ps.setString(5, ac.getMethodName());
            ps.setString(6, ac.getDestination());
            ps.setInt(7, ac.getRequestType());
            ps.setCharacterStream(8, new StringReader(ac.getRequest()), ac.getRequest().length());
            ps.setCharacterStream(9, new StringReader(ac.getResponse()), ac.getResponse().length());
            ps.setInt(10, ac.getState());
            ps.setLong(11, ac.getTimeTaken());
            
            ps.executeUpdate();
        }
        finally
        {
            DBUtil.quietClose(ps);
        }
    }
    
    /**
     * Loads a command from a result set.
     * 
     * @param rs
     * @return
     * @throws IOException
     * @throws SQLException
     */
    private AsyncCommand load(ResultSet rs) throws IOException, SQLException
    {
        long id = rs.getLong("ID");
        AsyncCommand ac = new AsyncCommand(id);
        ac.setUserId(rs.getString("USER_ID"));
        ac.setCourtId(rs.getString("COURT_ID"));
        ac.setNode(rs.getString("NODE"));
        ac.setServiceName(rs.getString("SERVICE"));
        ac.setMethodName(rs.getString("METHOD"));
        ac.setDestination(rs.getString("DESTINATION"));
        ac.setRequestType(rs.getInt("REQUEST_TYPE"));
        ac.setRequest(rs.getCharacterStream("REQUEST"));
        ac.setResponse(rs.getCharacterStream("RESPONSE"));
        ac.setState(rs.getInt("STATE"));
        ac.setTimeTaken(rs.getLong("TIMETAKEN"));
        
        return ac;
    }
    
    /**
     * Simple container for statistics regarding async processing.
     * 
     *
     */
    public static class AsyncStats
    {
        private final static String AVERAGE_KEY = "AVERAGE";
        private final static String COUNT_KEY = "COUNT";
        private long count = 0;
        private long average = 0;
        
        public void setAverage(long l)
        {
            this.average = l;
        }
        
        public long getAverage()
        {
            return average;
        }
        
        public long getCount()
        {
            return count;
        }
        
        public void setCount(long l)
        {
            this.count = l;
        }
        
        public void set(String name, long value)
        {
            if (AVERAGE_KEY.equals(name))
            {
                setAverage(value);
            }
            else if (COUNT_KEY.equals(name))
            {
                setCount(value);
            }
        }
        
        public long getEta(int poolSize)
        {
           return getAverage() + (getCount() * getAverage() / poolSize); 
        }
        
    }
   
}
