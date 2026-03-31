/*
 * Created on 09-Sep-2004
 *
 */
package uk.gov.dca.db.impl;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import javax.sql.DataSource;
import org.jdom.Element;

import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 */
public class JDBCConfigurationItem implements IConfigurationItem
{
    MyDataSource m_datasource = null;
    /* (non-Javadoc)
     * @see uk.gov.dca.db.impl.IConfigurationtItem#initialise(org.jdom.Element)
     */
    public void initialise(Element eConfig) throws SystemException
    {
        if (eConfig != null)
        {
            Driver driver = getDriver(eConfig);
            String url = getValue(eConfig, "url");
            String user = getValue(eConfig, "user");
            String pass = getValue(eConfig, "pass");
            try {
            	m_datasource = new MyDataSource(driver, url, user, pass);
            }
            catch(SQLException e) {
            	throw new ConfigurationItemException("Failed to create datasource for '"+url+"': "+e.getMessage(), e);
            }
        }
    }
    
    private static Driver getDriver(Element eConfig) throws SystemException
    {
    	Driver driver = null;
    	String driverClassname = getValue(eConfig, "driver");
    	
    	try {
            Class driverClass = Class.forName(driverClassname);
            driver = (Driver) driverClass.newInstance();
    	}
    	catch(ClassNotFoundException e) {
	    	throw new ConfigurationException("Unable to instantiate '"+driverClassname+"': "+e.getMessage(), e);  
	    }
	    catch(InstantiationException e) { 
	    	throw new ConfigurationItemException("Unable to instantiate '"+driverClassname+"': "+e.getMessage(), e); 
	    }
	    catch(IllegalAccessException e) { 
	    	throw new ConfigurationItemException("Unable to instantiate '"+driverClassname+"': "+e.getMessage(), e);  
	    }
	    
	    return driver;
    }
    
    private static String getValue(Element eConfig, String childname)
    {
        String text = eConfig.getChildText(childname);
        if (text != null)
        {
            return text;
        }
        else
        {
            throw new RuntimeException("The field '" + childname + "' has not been specified");
        }
    }

    public Object get() throws ConfigurationItemException
    {
        return m_datasource;
    }
    
    static class MyDataSource implements DataSource
    {
        private int loginTimeout = 300;
        private String user;
        private String url;
        private String pass;
        
        public MyDataSource(Driver driver, String url, String user, String pass) throws SQLException
        {
            DriverManager.registerDriver(driver);
            this.user = user;
            this.url = url;
            this.pass = pass;
        }

        /* (non-Javadoc)
         * @see javax.sql.DataSource#getLoginTimeout()
         */
        public int getLoginTimeout() throws SQLException
        {
            return loginTimeout;
        }

        /* (non-Javadoc)
         * @see javax.sql.DataSource#setLoginTimeout(int)
         */
        public void setLoginTimeout(int seconds) throws SQLException
        {
            // TODO Auto-generated method stub
            this.loginTimeout = seconds;
        }

        /* (non-Javadoc)
         * @see javax.sql.DataSource#getLogWriter()
         */
        public PrintWriter getLogWriter() throws SQLException
        {
            return new PrintWriter(System.out);
        }

        /* (non-Javadoc)
         * @see javax.sql.DataSource#setLogWriter(java.io.PrintWriter)
         */
        public void setLogWriter(PrintWriter out) throws SQLException
        {
            
        }

        /* (non-Javadoc)
         * @see javax.sql.DataSource#getConnection()
         */
        public Connection getConnection() throws SQLException
        {
            return DriverManager.getConnection(url, user, pass);
        }

        /* (non-Javadoc)
         * @see javax.sql.DataSource#getConnection(java.lang.String, java.lang.String)
         */
        public Connection getConnection(String username, String password) throws SQLException
        {
            return DriverManager.getConnection(url, username, password);
        }   
    }
}
