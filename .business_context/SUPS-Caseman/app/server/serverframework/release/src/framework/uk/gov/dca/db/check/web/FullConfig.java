/*
 * Created on 22-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.ejb.ServiceLocatorException;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.BooleanConfigurationItem;
import uk.gov.dca.db.impl.IConfigurationItem;
import uk.gov.dca.db.impl.JDBCConfigurationItem;
import uk.gov.dca.db.impl.JNDIConfigurationItem;
import uk.gov.dca.db.impl.PropertyConfigurationItem;
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

/**
 * @author Peter Neiil
 * 
 * This class is a work in progress and will move into the Framework to be used
 * by the CheckServiceBean
 */
public class FullConfig {

	public static String getFullConfig(String user, String password)
			throws SystemException, BusinessException {
		StringBuffer result = new StringBuffer(1024 * 2); // 2k
		result.append("<Configuration>");

		checkProjectConfig(result);

		checkLogin(user, password, result);

		checkSecurity(user, result);

		checkActiveDirectory(result);

		result.append("</Configuration>");

		return result.toString();

	}

	/**
	 * @param result
	 * @throws SystemException
	 */
	private static void checkProjectConfig(StringBuffer result) {
		result.append("<ProjectConfig>");

		try {
			final ConfigUtil config = ConfigUtil
					.create(FrameworkConfigParam.PROJECT_CONFIG.getValue());
			for (Iterator i = config.getConfig().entrySet().iterator(); i
					.hasNext();) {
				final Map.Entry entry = (Map.Entry) i.next();
				final String id = (String) entry.getKey();
				final IConfigurationItem ci = (IConfigurationItem) entry
						.getValue();
				result.append("<item>");
				result.append("<id>" + id + "</id>");
				// inspect, but we need to see what kind of
				// JNDIConfigurationItem this is
				if (ci instanceof JNDIConfigurationItem) {
					result.append("<class>"
							+ JNDIConfigurationItem.class.getName()
							+ "</class>");
					result.append("<object>" + ci.get().getClass().getName()
							+ "</object>");
					checkDataSource(result, (DataSource) ci.get());
				}
				// inspect
				else if (ci instanceof JDBCConfigurationItem) {
					result.append("<class>"
							+ JDBCConfigurationItem.class.getName()
							+ "</class>");
					result.append("Retrieve");
				} else if (ci instanceof StringConfigurationItem) {
					result.append("<class>"
							+ StringConfigurationItem.class.getName()
							+ "</class>");
					result.append("<object>" + ci.get() + "</object>");
				} else if (ci instanceof PropertyConfigurationItem) {
				result.append("<class>"
						+ PropertyConfigurationItem.class.getName()
						+ "</class>");
				result.append("<object>" + ci.get() + "</object>");
				} else if (ci instanceof BooleanConfigurationItem) {
					result.append("<class>"
							+ BooleanConfigurationItem.class.getName()
							+ "</class>");
					result.append("<object>" + String.valueOf((Boolean)ci.get()) + "</object>");
				} else if (ci instanceof QueueConfigurationItem) {
					result.append("<class>"
							+ QueueConfigurationItem.class.getName()
							+ "</class>");
				} else if (ci instanceof TopicConfigurationItem) {
					result.append("<class>"
							+ TopicConfigurationItem.class.getName()
							+ "</class>");
				}
				result.append("</item>");

			}
		} catch (SystemException e) {
			result
					.append("<Fail>Unable to create Process Project Config</Fail>");
		}

		result.append("</ProjectConfig>");
	}

	/**
	 * @param result
	 * @throws SystemException
	 */
	private static void checkActiveDirectory(StringBuffer result) {
		result.append("<ActiveDirectory file=\""
				+ ActiveDirectoryAuthenticator.ACTIVE_DIRECTORY_PROPERTIES_FILE
				+ "\">");
		try {
			ActiveDirectoryAuthenticator adauthenticator = new ActiveDirectoryAuthenticator();
			propertiesToXML(result, adauthenticator.getProperties());
		} catch (SystemException e) {
			result.append("<Fail>Unable to create AD Authenticator</Fail>");
		}
		result.append("</ActiveDirectory>");
	}

	/**
	 * @param result
	 * @throws SystemException
	 * @throws ServiceLocatorException
	 */
	private static void checkSecurity(String user, StringBuffer result)
			throws SystemException, ServiceLocatorException {

		String params = "<params><param name=\"getUserId\">"
				+ user
				+ "</param><param name=\"courtId\">2</param><param name=\"businessProcessId\">1</param></params>";

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
				result.append("<MacWithEmptyParams>" + mac
						+ "</MacWithEmptyParams>");

			} catch (Exception e) {
				log.error("Exception trying to test mac generation");
				result
						.append("<error>Exception trying to test mac generation</error>");
				result.append("<message>" + e.getMessage() + "</message>");
			}

			try {

				CallStack cs = CallStack.getInstance();
				cs.push("CheckService", "checkSecurity", params);

				// add the user id to the context
				ComponentContext context = cs.peek();
				context.putSystemItem(IComponentContext.USER_ID_KEY, user);
				context.putSystemItem(IComponentContext.COURT_ID_KEY, "2");

				AbstractSupsServiceProxy proxy = new SupsLocalServiceProxy();
				String userDetailsFromProxy = proxy.getString(
						"ejb/SecurityServiceLocal", "getADUserDetailsLocal",
						params, false);

				cs.pop();

				result.append("<ADUserDetails>");
				result.append(userDetailsFromProxy);
				result.append("</ADUserDetails>");

			} catch (Exception e) {
				log.error("Exception trying to get ADUserDetailsLocal");
				result
						.append("<error>Exception trying to get ADUserDetailsLocal</error>");
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
	private static void checkDataSource(StringBuffer result,
			DataSource datasource) {
		Connection con = null;
		result.append("<DataSource>");

		try {
			con = datasource.getConnection();
			DatabaseMetaData dbmeta = con.getMetaData();
			result.append("<connection>");
			result.append("<URL>" + dbmeta.getURL() + "</URL>");
			result.append("<UserName>" + dbmeta.getUserName() + "</UserName>");
			result.append("</connection>");
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
	private static void checkLogin(String user, String password,
			StringBuffer result) {
		SecurityService security = null;
		try {
			if ((user != null && password != null)
					&& (user.trim().length() != 0 && password.trim().length() != 0)) {
				security = (SecurityService) ServiceLocator.getInstance()
						.getService(SecurityService.class);
			} else {
				loginFailed(user, result,
						"No username or password provided to test login with");
			}
		} catch (Exception e) {
			log.error(e);
			loginFailed(user, result, "Unable to connect to Security Service");
		}

		if (security != null) {
			// try login with this user information using the local interface
			try {
				security.login(user, password);
				result.append("<Login>");
				result.append("<status>SUCCESS</status>");
				result
						.append("<message>Successfully authenticated user</message>");
				result.append("<user>" + user + "</user>");
				result.append("<Principal><name>" + CHECKER_ROLE
						+ "</name></Principal>");
				result.append("</Login>");
			} catch (Exception e) {
				log.error(e);
				loginFailed(user, result, e.getMessage());
			}
		}

	}

	/**
	 * @param user
	 * @param result
	 */
	private static void loginFailed(String user, StringBuffer result,
			String message) {
		result.append("<Login>");
		result.append("<status>FAILED</status>");
		result.append("<message>" + message + "</message>");
		result.append("<user>" + user + "</user>");
		result.append("<Principal><name>" + CHECKER_ROLE
				+ "</name></Principal>");
		result.append("</Login>");
	}

	/**
	 * @param result
	 * @param adauthenticator
	 */
	public static void propertiesToXML(StringBuffer result,
			Properties properties) {
		result.append("<properties>");
		for (Iterator i = properties.entrySet().iterator(); i.hasNext();) {
			final Map.Entry entry = (Map.Entry) i.next();
			final String key = (String) entry.getKey();
			final String value = (String) entry.getValue();

			result.append("<property key=\"" + key + "\">" + value
					+ "</property>");

		}
		result.append("</properties>");
	}

	private static final String CHECKER_ROLE = "checker";

	private static final Log log = LogFactory.getLog(FullConfig.class);

	private final static String TEST_SELECT_STATEMENT = "SELECT EXPIRY_DATE FROM SERVER_SECRET WHERE SERVER_SECRET_ID = 1";

}
