/*
 * Created on 09-Sep-2004
 *
 */
package uk.gov.dca.db.impl;

import java.io.PrintWriter;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.SQLWarning;
import java.sql.Savepoint;
import java.sql.Statement;
import java.util.Map;

import javax.sql.DataSource;
import org.jdom.Element;

import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 */
public class JDBCConfigurationItem extends AbstractConfigurationItem
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
    
    private Driver getDriver(Element eConfig) throws SystemException
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
            return new DelegateConnection(DriverManager.getConnection(url, user, pass));
        }

        /* (non-Javadoc)
         * @see javax.sql.DataSource#getConnection(java.lang.String, java.lang.String)
         */
        public Connection getConnection(String username, String password) throws SQLException
        {
            return new DelegateConnection(DriverManager.getConnection(url, username, password));
        }   
    }
    
    private static class DelegateConnection implements Connection
    {
        private Connection cn;

        public DelegateConnection(Connection cn)
        {
            this.cn = cn;
        }

        public void clearWarnings() throws SQLException
        {
            cn.clearWarnings();
        }

        public void close() throws SQLException
        {
            System.out.println("Closed Connection");
            cn.close();
        }

        public void commit() throws SQLException
        {
            cn.commit();
        }

        public Statement createStatement() throws SQLException
        {
            return cn.createStatement();
        }

        public Statement createStatement(int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException
        {
            return cn.createStatement(resultSetType, resultSetConcurrency, resultSetHoldability);
        }

        public Statement createStatement(int resultSetType, int resultSetConcurrency) throws SQLException
        {
            return cn.createStatement(resultSetType, resultSetConcurrency);
        }

        public boolean getAutoCommit() throws SQLException
        {
            return cn.getAutoCommit();
        }

        public String getCatalog() throws SQLException
        {
            return cn.getCatalog();
        }

        public int getHoldability() throws SQLException
        {
            return cn.getHoldability();
        }

        public DatabaseMetaData getMetaData() throws SQLException
        {
            return cn.getMetaData();
        }

        public int getTransactionIsolation() throws SQLException
        {
            return cn.getTransactionIsolation();
        }

        public Map getTypeMap() throws SQLException
        {
            return cn.getTypeMap();
        }

        public SQLWarning getWarnings() throws SQLException
        {
            return cn.getWarnings();
        }

        public boolean isClosed() throws SQLException
        {
            return cn.isClosed();
        }

        public boolean isReadOnly() throws SQLException
        {
            return cn.isReadOnly();
        }

        public String nativeSQL(String sql) throws SQLException
        {
            return cn.nativeSQL(sql);
        }

        public CallableStatement prepareCall(String sql, int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException
        {
            return cn.prepareCall(sql, resultSetType, resultSetConcurrency, resultSetHoldability);
        }

        public CallableStatement prepareCall(String sql, int resultSetType, int resultSetConcurrency) throws SQLException
        {
            return cn.prepareCall(sql, resultSetType, resultSetConcurrency);
        }

        public CallableStatement prepareCall(String sql) throws SQLException
        {
            return cn.prepareCall(sql);
        }

        public PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency, int resultSetHoldability) throws SQLException
        {
            return cn.prepareStatement(sql, resultSetType, resultSetConcurrency, resultSetHoldability);
        }

        public PreparedStatement prepareStatement(String sql, int resultSetType, int resultSetConcurrency) throws SQLException
        {
            return cn.prepareStatement(sql, resultSetType, resultSetConcurrency);
        }

        public PreparedStatement prepareStatement(String sql, int autoGeneratedKeys) throws SQLException
        {
            return cn.prepareStatement(sql, autoGeneratedKeys);
        }

        public PreparedStatement prepareStatement(String sql, int[] columnIndexes) throws SQLException
        {
            return cn.prepareStatement(sql, columnIndexes);
        }

        public PreparedStatement prepareStatement(String sql, String[] columnNames) throws SQLException
        {
            return cn.prepareStatement(sql, columnNames);
        }

        public PreparedStatement prepareStatement(String sql) throws SQLException
        {
            return cn.prepareStatement(sql);
        }

        public void releaseSavepoint(Savepoint savepoint) throws SQLException
        {
            cn.releaseSavepoint(savepoint);
        }

        public void rollback() throws SQLException
        {
            cn.rollback();
        }

        public void rollback(Savepoint savepoint) throws SQLException
        {
            cn.rollback(savepoint);
        }

        public void setAutoCommit(boolean autoCommit) throws SQLException
        {
            cn.setAutoCommit(autoCommit);
        }

        public void setCatalog(String catalog) throws SQLException
        {
            cn.setCatalog(catalog);
        }

        public void setHoldability(int holdability) throws SQLException
        {
            cn.setHoldability(holdability);
        }

        public void setReadOnly(boolean readOnly) throws SQLException
        {
            cn.setReadOnly(readOnly);
        }

        public Savepoint setSavepoint() throws SQLException
        {
            return cn.setSavepoint();
        }

        public Savepoint setSavepoint(String name) throws SQLException
        {
            return cn.setSavepoint(name);
        }

        public void setTransactionIsolation(int level) throws SQLException
        {
            cn.setTransactionIsolation(level);
        }

        public void setTypeMap(Map map) throws SQLException
        {
            cn.setTypeMap(map);
        }
        
        
    }
}
