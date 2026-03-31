/*
 * Created on 26-May-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.security.serversecret;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.cache.ApplicationCache;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * @author Imran Patel
 * @author Michael Barker
 */

public class SecretManager implements SecretServer, SecretChangeObserver {

	private static final String DEFAULT_SECRET = "Shibboleth";
    private static final Log log = SUPSLogFactory.getLogger(SecretManager.class);
    private int expiryInterval;
    private int expiryIntervalType;
    private String datasourceId;
    
    /**
	 * Constructor
	 * 
	 * @param encoder ByteStreamEncoder implementation used to encode the server secret
	 * @param expiryInterval 
	 * @param expiryIntervalType
	 * @param datasourceId 
	 */
	public SecretManager(String datasourceId, int expiryInterval, int expiryIntervalType) throws BusinessException, SystemException {
        this.datasourceId = datasourceId;
        this.expiryInterval = expiryInterval;
        this.expiryIntervalType = expiryIntervalType;
	}
	
	/**
     * Slight misnomer with the naming this not only returns the server
     * secret but also the date concatnated to form part of the session
     * key.  It will set the date to a value that is current date rounded
     * down to a value determined by the expiryInterval and expiryIntervalType.
     * 
     * TODO: Review for moving the date portion out of this code.
	 * 
	 * @return
	 */
	public String getSecret() throws BusinessException, SystemException {
		
		Calendar now = Calendar.getInstance();
		ApplicationCache appCache = ApplicationCache.getInstance();
        
        ServerSecret secret = (ServerSecret) appCache.get(SecretManager.class.getName());
        
		// if the cached secret has expired, then retrieve the latest one
		if(secret == null || now.after(secret.getExpiryDate())) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
            
            String dateValue = sdf.format(roundDownDate(now, expiryInterval, expiryIntervalType).getTime());
            String secretValue = getSecretValue();
            secretValue = secretValue != null ? secretValue : DEFAULT_SECRET;
            String value = dateValue + secretValue;
            
            Calendar expiryDate = roundUpDate(now, expiryInterval, expiryIntervalType);
            
            ServerSecret newSecret = new ServerSecret(value, expiryDate);
            appCache.put(SecretManager.class.getName(), newSecret);
            secret = newSecret;
		}
        else {
            log.debug("Server secret cache hit");
        }
        
        return secret.getValue();
	}
    
    
    private final static String SELECT_STATEMENT = "SELECT EXPIRY_DATE, SECRET FROM SERVER_SECRET WHERE SERVER_SECRET_ID = 1";
    
    private String getSecretValue() throws SystemException
    {
        DataSource ds = null;
        Connection cn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        String secret = null;
        
        try
        {
            ds = (DataSource) ServiceLocator.getInstance().get(datasourceId);
            cn = ds.getConnection();
            ps = cn.prepareStatement(SELECT_STATEMENT);
            rs = ps.executeQuery();
            if (rs.next())
            {
                secret = rs.getString(2);
            }
        }
        catch (SQLException e)
        {
            throw new SystemException("Failed to get server secret", e);
        }
        finally
        {
            DBUtil.quietClose(rs);
            DBUtil.quietClose(ps);
            DBUtil.quietClose(cn);
        }
        
        return secret;
    }
    
    private final static int YEAR_INTERVAL_TYPE = 1;
    private final static int MONTH_INTERVAL_TYPE = 2;
    private final static int DAY_INTERVAL_TYPE = 5;
    private final static int HOUR_OF_DAY_INTERVAL_TYPE = 10;
    private final static int MINUTE_INTERVAL_TYPE = 12;
    private final static int SECOND_INTERVAL_TYPE = 13;
    
    /**
     * Returns a new Calendar object that rounds the nearest value according
     * to the interval and interval type
     * 
     * Year = 1
     * Month = 2
     * Day = 5
     * HOUR_OF_DAY = 10
     * Minute = 12
     * Second = 13
     * 
     * @param currentDate
     * @param expiryInterval
     * @param expiryIntervalType
     * @return
     */
    public static Calendar roundDownDate(Calendar currentDate, int interval, int intervalType)
    {
        Calendar date = Calendar.getInstance();
        
        switch (intervalType)
        {
        case YEAR_INTERVAL_TYPE:
            int year = currentDate.get(Calendar.YEAR);
            date.set(Calendar.YEAR, year - (year % interval));
            date.set(Calendar.MONTH, 0);
            date.set(Calendar.DAY_OF_MONTH, 0);
            date.set(Calendar.HOUR_OF_DAY, 0);
            date.set(Calendar.MINUTE, 0);
            date.set(Calendar.SECOND, 0);
            date.set(Calendar.MILLISECOND, 0);
            break;
        case MONTH_INTERVAL_TYPE:
            int month = currentDate.get(Calendar.MONTH);
            date.set(Calendar.YEAR, currentDate.get(Calendar.YEAR));
            date.set(Calendar.MONTH, month - (month % interval));
            date.set(Calendar.DAY_OF_MONTH, 0);
            date.set(Calendar.HOUR_OF_DAY, 0);
            date.set(Calendar.MINUTE, 0);
            date.set(Calendar.SECOND, 0);
            date.set(Calendar.MILLISECOND, 0);
            break;
        case DAY_INTERVAL_TYPE:
            int day = currentDate.get(Calendar.DAY_OF_MONTH);
            date.set(Calendar.YEAR, currentDate.get(Calendar.YEAR));
            date.set(Calendar.MONTH, currentDate.get(Calendar.MONTH));
            date.set(Calendar.DAY_OF_MONTH, day - (day % interval));
            date.set(Calendar.HOUR_OF_DAY, 0);
            date.set(Calendar.MINUTE, 0);
            date.set(Calendar.SECOND, 0);
            date.set(Calendar.MILLISECOND, 0);
            break;
        case HOUR_OF_DAY_INTERVAL_TYPE:
            int HOUR_OF_DAY = currentDate.get(Calendar.HOUR_OF_DAY);
            date.set(Calendar.YEAR, currentDate.get(Calendar.YEAR));
            date.set(Calendar.MONTH, currentDate.get(Calendar.MONTH));
            date.set(Calendar.DAY_OF_MONTH, currentDate.get(Calendar.DAY_OF_MONTH));
            date.set(Calendar.HOUR_OF_DAY, HOUR_OF_DAY - (HOUR_OF_DAY % interval));
            date.set(Calendar.MINUTE, 0);
            date.set(Calendar.SECOND, 0);
            date.set(Calendar.MILLISECOND, 0);
            break;
        case MINUTE_INTERVAL_TYPE:
            int minute = currentDate.get(Calendar.MINUTE);
            date.set(Calendar.YEAR, currentDate.get(Calendar.YEAR));
            date.set(Calendar.MONTH, currentDate.get(Calendar.MONTH));
            date.set(Calendar.DAY_OF_MONTH, currentDate.get(Calendar.DAY_OF_MONTH));
            date.set(Calendar.HOUR_OF_DAY, currentDate.get(Calendar.HOUR_OF_DAY));
            date.set(Calendar.MINUTE, minute - (minute % interval));
            date.set(Calendar.SECOND, 0);
            date.set(Calendar.MILLISECOND, 0);
            break;
        case SECOND_INTERVAL_TYPE:
            int second = currentDate.get(Calendar.MINUTE);
            date.set(Calendar.YEAR, currentDate.get(Calendar.YEAR));
            date.set(Calendar.MONTH, currentDate.get(Calendar.MONTH));
            date.set(Calendar.DAY_OF_MONTH, currentDate.get(Calendar.DAY_OF_MONTH));
            date.set(Calendar.HOUR_OF_DAY, currentDate.get(Calendar.HOUR_OF_DAY));
            date.set(Calendar.MINUTE, currentDate.get(Calendar.MINUTE));
            date.set(Calendar.SECOND, second - (second % interval));
            date.set(Calendar.MILLISECOND, 0);
            break;
        default:
            throw new RuntimeException("Invalid expiry interval type: " + intervalType + " must be one of (1, 2, 5, 10, 12, 13)");
        }
        
        return date;
    }
    
    /**
     * Returns a new Calendar object that rounds the nearest value according
     * to the interval and interval type
     * 
     * Year = 1
     * Month = 2
     * Day = 5
     * HOUR_OF_DAY = 10
     * Minute = 12
     * Second = 13
     * 
     * @param currentDate
     * @param expiryInterval
     * @param expiryIntervalType
     * @return
     */
    public static Calendar roundUpDate(Calendar currentDate, int interval, int intervalType)
    {
        Calendar date = roundDownDate(currentDate, interval, intervalType);
        
        switch (intervalType)
        {
        case YEAR_INTERVAL_TYPE:
            int year = date.get(Calendar.YEAR);
            date.set(Calendar.YEAR, year + interval);
            break;
        case MONTH_INTERVAL_TYPE:
            int month = date.get(Calendar.MONTH);
            date.set(Calendar.MONTH, month + interval);
            break;
        case DAY_INTERVAL_TYPE:
            int day = date.get(Calendar.DAY_OF_MONTH);
            date.set(Calendar.DAY_OF_MONTH, day + interval);
            break;
        case HOUR_OF_DAY_INTERVAL_TYPE:
            int HOUR_OF_DAY = date.get(Calendar.HOUR_OF_DAY);
            date.set(Calendar.HOUR_OF_DAY, HOUR_OF_DAY + interval);
            break;
        case MINUTE_INTERVAL_TYPE:
            int minute = date.get(Calendar.MINUTE);
            date.set(Calendar.MINUTE, minute + interval);
            break;
        case SECOND_INTERVAL_TYPE:
            int second = date.get(Calendar.MINUTE);
            date.set(Calendar.SECOND, second + interval);
            break;
        default:
            throw new RuntimeException("Invalid expiry interval type: " + intervalType + " must be one of (1, 2, 5, 10, 12, 13)");
        }
        
        return date;
    }
	
	/**
	 * @see uk.gov.dca.db.security.serversecret.SecretChangeObserver#secretChanged(java.lang.String, java.util.Calendar)
	 */
	public void secretChanged(String newSecret, Calendar newExpiryDate) {
	}
    
    private static class ServerSecret
    {
        private String value;
        private Calendar expiryDate;

        public ServerSecret(String value, Calendar expiryDate)
        {
            this.value = value;
            this.expiryDate = expiryDate;
        }
        
        public String getValue()
        {
            return value;
        }
        
        public Calendar getExpiryDate()
        {
            return expiryDate;
        }
    }
}
