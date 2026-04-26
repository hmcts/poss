package uk.gov.dca.db.impl.check;

import java.io.StringWriter;
import java.rmi.RemoteException;
import java.security.Principal;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import javax.ejb.CreateException;
import javax.ejb.EJBException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.ejb.ServiceLocatorException;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.IConfigurationItem;
import uk.gov.dca.db.impl.JDBCConfigurationItem;
import uk.gov.dca.db.impl.JNDIConfigurationItem;
import uk.gov.dca.db.impl.QueueConfigurationItem;
import uk.gov.dca.db.impl.StringConfigurationItem;
import uk.gov.dca.db.impl.TopicConfigurationItem;
import uk.gov.dca.db.pipeline.CallStack;
import uk.gov.dca.db.pipeline.ComponentContext;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.security.ActiveDirectoryAuthenticator;
import uk.gov.dca.db.security.SecurityContext;
import uk.gov.dca.db.security.SecurityFactory;
import uk.gov.dca.db.security.SecurityService;
import uk.gov.dca.db.util.ConfigUtil;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.FrameworkConfigParam;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * 
 * @ejb.bean type="Stateless" name="CheckService" jndi-name="CheckService"
 *           local-jndi-name="ejb/CheckServiceLocal"
 *           view-type="${ejb.interfaces}"
 * 
 * @ejb.interface service-endpoint-class="uk.gov.dca.db.impl.check.CheckServiceService"
 * 
 * @oc4j.bean jndi-name="CheckService"
 * 
 * @ejb.ejb-external-ref view-type="local" type="Session"
 *                       ref-name="ejb/SecurityServiceLocal"
 *                       home="uk.gov.dca.db.security.SecurityServiceLocalHome"
 *                       business="uk.gov.dca.db.security.SecurityService"
 *                       link="SecurityService"
 * 
 * @jboss-net.authentication domain="other"
 *                           validate-unauthenticated-calls="true"
 * @jboss-net.authorization domain="other" roles-allowed="checker"
 * 
 * @author PeterN
 */
public class CheckBean implements SessionBean {

    
    private static final long serialVersionUID = 5498954757064029677L;

    /**
     * 
     * @ejb.create-method
     * @ejb.permission role-name="checker"
     * 
     * @throws CreateException
     */
    public void ejbCreate() throws CreateException {
    }

    /**
     * 
     * @ejb.interface-method view-type="${ejb.interfaces}"
     * @ejb.permission role-name="checker"
     * @ejb.transaction type="NotSupported"
     * 
     * @wlws:exclude
     * 
     * @param user
     *            the user which must be used when trying to use the login
     *            method in SecurityBean
     * @param password
     * @return
     */
    public String check(String user, String password) throws SystemException,
            BusinessException {
        StringBuffer result = new StringBuffer(1024 * 2); // 2k
        result.append("<Configuration>");
        final Principal principal = m_sessionContext.getCallerPrincipal();
        // make sure that the role is checker
        if (principal.getName().indexOf(CHECKER_ROLE) > -1) {

            checkProjectConfig(result);

            checkLogin(user, password, result);

            checkSecurity(user, result);

            checkActiveDirectory(user, result);

        } else {
            result.append("<denied>The ROLE: '"
                            + principal.getName()
                            + "', is not allowed to request deployment/configuration information.</denied>");
        }

        result.append("</Configuration>");

        return result.toString();

    }

    /**
     * @param result
     * @throws SystemException
     */
    private void checkProjectConfig(StringBuffer result) throws SystemException {
        log.info("Attempting to load Project Config: "
                + FrameworkConfigParam.PROJECT_CONFIG.getValue());
        result.append("<ProjectConfig>");
        final ConfigUtil config = ConfigUtil
                .create(FrameworkConfigParam.PROJECT_CONFIG.getValue());
        for (Iterator i = config.getConfig().entrySet().iterator(); i.hasNext();) {
            final Map.Entry entry = (Map.Entry) i.next();
            final String id = (String) entry.getKey();
            final IConfigurationItem ci = (IConfigurationItem) entry.getValue();
            result.append("<item>");
            result.append("<id>" + id + "</id>");
            // inspect, but we need to see what kind of
            // JNDIConfigurationItem this is
            if (ci instanceof JNDIConfigurationItem) {
                result.append("<class>" + JNDIConfigurationItem.class.getName()
                        + "</class>");
                result.append("<object>" + ci.get().getClass().getName()
                        + "</object>");
                checkDataSource(result, (DataSource) ci.get());
            }
            // inspect
            else if (ci instanceof JDBCConfigurationItem) {
                result.append("<class>" + JDBCConfigurationItem.class.getName()
                        + "</class>");
                result.append("Retrieve");
            } else if (ci instanceof StringConfigurationItem) {
                result.append("<class>"
                        + StringConfigurationItem.class.getName() + "</class>");
                result.append("<object>" + ci.get() + "</object>");
            } else if (ci instanceof QueueConfigurationItem) {
                result.append("<class>"
                        + QueueConfigurationItem.class.getName() + "</class>");
            } else if (ci instanceof TopicConfigurationItem) {
                result.append("<class>"
                        + TopicConfigurationItem.class.getName() + "</class>");
            }
            result.append("</item>");

        }
        result.append("</ProjectConfig>");
    }

    /**
     * @param result
     * @throws SystemException
     */
    private void checkActiveDirectory(String user, StringBuffer result)
            throws SystemException {
        // TODO:PN check active directory
        ActiveDirectoryAuthenticator adauthenticator = new ActiveDirectoryAuthenticator();
        result.append("<ActiveDirectory file=\""+  ActiveDirectoryAuthenticator.ACTIVE_DIRECTORY_PROPERTIES_FILE +"\">");
        propertiesToXML(result, adauthenticator.getProperties());
        result.append("</ActiveDirectory>");
    }
    

    /**
     * @param result
     * @throws SystemException
     * @throws ServiceLocatorException
     */
    private void checkSecurity(String user, StringBuffer result) throws SystemException,
            ServiceLocatorException {
        
        String params = "<params><param name=\"getUserId\">" + user + "</param><param name=\"courtId\">2</param><param name=\"businessProcessId\">1</param></params>";
        
        SecurityFactory factory = new SecurityFactory();
        
        result.append("<Security datasoure=\"" + factory.getDatasourceId()
                + "\">");

        // connect to the datasource
        DataSource datasource = (DataSource) ServiceLocator.getInstance().get(
                factory.getDatasourceId());

        if (datasource == null) {
            result.append("<error>Unable to retrieve DatasourceID</error>");
        }

        Connection con = null;
        PreparedStatement selectStatement = null;
        ResultSet results = null;
        try {
            checkDataSource(result, datasource);

            con = datasource.getConnection();

            selectStatement = con.prepareStatement(TEST_SELECT_STATEMENT);
            results = selectStatement.executeQuery();
            if (results.next()) {
                result
                        .append("<result>SQL resultset had 1 or more rows</result>");
            } else {
                result.append("<result>SQL resultset had 0 rows</result>");
            }
            
            
            try {
                
                log.debug("Loading security context");
                SecurityContext context = factory.createSecurityContext();
                log.debug("retrieving Mac");
                String mac = context.getMac(user, "<params/>");
                result.append("<MacWithEmptyParams>"+ mac +"</MacWithEmptyParams>");
                
            } catch (Exception e) {
                log.error("Exception trying to test mac generation");
                result.append("<error>Exception trying to test mac generation</error>");
                result.append("<message>" + e.getMessage() + "</message>");
            }
            
            try{
                

                CallStack cs = CallStack.getInstance();
                cs.push("CheckService","checkSecurity", params);
                
                // add the user id to the context
                ComponentContext context = cs.peek();
                context.putSystemItem(IComponentContext.USER_ID_KEY, user);
                context.putSystemItem(IComponentContext.COURT_ID_KEY, "2");
                
                SecurityService security = (SecurityService)ServiceLocator.getInstance().getService("ejb/SecurityServiceLocal");
                StringWriter sw = new StringWriter();
                security.getADUserDetailsLocal(params, sw);
                String userDetails = sw.toString();
                
                cs.pop();
                
                result.append("<ADUserDetails>");
                result.append(userDetails);
                result.append("</ADUserDetails>");                              

            }
            catch (Exception e) {
                log.error("Exception trying to get ADUserDetailsLocal");
                result.append("<error>Exception trying to get ADUserDetailsLocal</error>");
                result.append("<message>" + e.getMessage() + "</message>");
            }

            
            
        } catch (SQLException e) {
            log.error("SQLException trying to test security");
            result
                    .append("<error>SQLException trying to test security</error>");
            result.append("<message>" + e.getMessage() + "</message>");

        } finally {
            DBUtil.quietClose(con);
            DBUtil.quietClose(results);
            DBUtil.quietClose(selectStatement);
        }
        result.append("</Security>");

    }

    /**
     * @param result
     * @param datasource
     * @return
     * @throws SQLException
     */
    private void checkDataSource(StringBuffer result, DataSource datasource) {
        Connection con = null;
        result.append("<DataSource>");

        try {
            con = datasource.getConnection();
            DatabaseMetaData dbmeta = con.getMetaData();
            result.append("<connection>");
            result.append("<URL>" + dbmeta.getURL() + "</URL>");
            result.append("<UserName>" + dbmeta.getUserName() + "</UserName>");
//            result.append("<DatabaseProductName>"
//                    + dbmeta.getDatabaseProductName()
//                    + "</DatabaseProductName>");
//            result.append("<JDBCMajorVersion>" + dbmeta.getJDBCMajorVersion()
//                    + "</JDBCMajorVersion>");
//            result.append("<JDBCMinorVersion>" + dbmeta.getJDBCMinorVersion()
//                    + "</JDBCMinorVersion>");
//            result.append("<DefaultTransactionIsolation>"
//                    + dbmeta.getDefaultTransactionIsolation()
//                    + "</DefaultTransactionIsolation>");
            result.append("</connection>");

//            result.append("<Driver>");
//            result.append("<DriverMajorVersion>"
//                    + dbmeta.getDriverMajorVersion() + "</DriverMajorVersion>");
//            result.append("<DriverMinorVersion>"
//                    + dbmeta.getDriverMinorVersion() + "</DriverMinorVersion>");
//            result.append("</Driver>");

        } catch (SQLException e) {
            result.append("<error>Unable to check connection information: "
                    + e.getMessage() + "</error>");
        } finally {
            DBUtil.quietClose(con);
            result.append("</DataSource>");
        }
    }

    /**
     * @param user
     * @param password
     * @param result
     * 
     * @return returns the users home court id
     * 
     * @throws SystemException
     * @throws BusinessException
     */
    private void checkLogin(String user, String password, StringBuffer result)
            throws SystemException, BusinessException {
        SecurityService security = null;
        try {
            security = (SecurityService) ServiceLocator.getInstance()
                    .getService(SecurityService.class);
        } catch (Exception e) {
            result.append("<Login>could not retrieve security service</Login>");
        }
        // try login with this user information using the local interface
        try{
            security.login(user, password);
            result.append("<Login>");
            result.append("<status>SUCCESS</status>");
            result.append("<message>Successfully authenticated user</message>");            
            result.append("<user>" + user + "</user>");
            result.append("<Principal><name>" + CHECKER_ROLE
                    + "</name></Principal>");
            result.append("</Login>");
        }
        catch(SystemException e){
            result.append("<Login>");
            result.append("<status>FAILED</status>");
            result.append("<message>Unable to authenticate user</message>");
            result.append("<user>" + user + "</user>");
            result.append("<Principal><name>" + CHECKER_ROLE
                    + "</name></Principal>");
            result.append("</Login>");
            
        }

    }

    /**
     * @param result
     * @param adauthenticator
     */
    public void propertiesToXML(StringBuffer result, Properties properties) {
        result.append("<properties>");
        for (Iterator i = properties.entrySet().iterator(); i.hasNext();) {
            final Map.Entry entry = (Map.Entry) i.next();
            final String key = (String) entry.getKey();
            final String value = (String) entry.getValue();

            result.append("<property key=\"" + key + "\">"
                    + value + "</property>");

        }
        result.append("</properties>");
    }

    /*
     * (non-Javadoc)
     * 
     * @see javax.ejb.SessionBean#setSessionContext(javax.ejb.SessionContext)
     */
    public void setSessionContext(SessionContext sessionContext)
            throws EJBException, RemoteException {
        m_sessionContext = sessionContext;
    }

    /*
     * (non-Javadoc)
     * 
     * @see javax.ejb.SessionBean#ejbRemove()
     */
    public void ejbRemove() throws EJBException, RemoteException {
        m_sessionContext = null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see javax.ejb.SessionBean#ejbActivate()
     */
    public void ejbActivate() throws EJBException, RemoteException {

    }

    /*
     * (non-Javadoc)
     * 
     * @see javax.ejb.SessionBean#ejbPassivate()
     */
    public void ejbPassivate() throws EJBException, RemoteException {

    }

    private SessionContext m_sessionContext = null;

    private static final String CHECKER_ROLE = "checker";

    private static final Log log = SUPSLogFactory.getLogger(CheckBean.class);

    private final static String TEST_SELECT_STATEMENT = "SELECT EXPIRY_DATE FROM SERVER_SECRET WHERE SERVER_SECRET_ID = 1";
}