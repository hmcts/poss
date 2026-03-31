/*
 * Created on Jan 12, 2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.util.ldap;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Hashtable;
import java.util.Properties;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.util.SUPSLogFactory;
import uk.gov.dca.db.util.ServiceUtil;

/**
 * @author fzzjsd
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class LdapUtil {
	private static Log log = SUPSLogFactory.getLogger(LdapUtil.class);


	private static final String LDAP_PROPERTIES_FILE = "ldap.properties";


	//private static String query = null;
	private static final String AD_UNAVAILABLE = "The server cannot connect to Active Directory at the moment. Please try again later.";


	public final static String QUERY_KEY = "query";

	public final static String SEARCHBASE_KEY = "searchbase";

	public final static String FACTORY_KEY = "factory";

	public final static String HOST_KEY = "hostname";

	public final static String USER_KEY = "username";

	public final static String PASS_KEY = "password";

	public final static String[] KEYS = { QUERY_KEY, SEARCHBASE_KEY,
			FACTORY_KEY, HOST_KEY, USER_KEY, PASS_KEY };

	private static LdapUtil instance = null;

	private final Hashtable env;

	private final String searchBase;

	private final String query;

	private LdapUtil() throws SystemException {
		Properties p = loadProperties();
		env = initEnv(p);
		searchBase = initSearchBase(p);
		query = initQuery(p);
	}

	public final synchronized static LdapUtil getInstance()
			throws SystemException {
		if (instance == null) {
			instance = new LdapUtil();
		}
		return instance;
	}

	public Properties loadProperties() throws SystemException {
		Properties refData = new Properties();

		try {
			InputStream in = Util.getInputStream(LDAP_PROPERTIES_FILE,
					new Dummy());
			refData.load(in);
		} catch (FileNotFoundException e) {
			log.fatal("Unable to locate ldap.propeties resource");
			throw new SystemException("Cannot connect to LDAP server", e);
		} catch (IOException e) {
			log.fatal("Unable to load ldap.propeties resource");
			throw new SystemException("Cannot connect to LDAP server", e);
		}

		return refData;
	}

	public void validateProperties(Properties p) throws SystemException {
		Collection errors = new ArrayList();

		for (int i = 0; i < KEYS.length; i++) {
			if (!p.containsKey(KEYS[i])) {
				errors.add(KEYS[i] + " is not defined.");
			}
		}

		if (errors.size() > 0) {
			log.error("The ldap.properies configuration is incomplete: "
					+ errors.toString());
			throw new SystemException(
					"The ldap.properies configuration is incomplete: "
							+ errors.toString());
		}
	}

	public String initSearchBase(Properties p) {
		return p.getProperty(SEARCHBASE_KEY);
	}

	public String initQuery(Properties p) {
		return p.getProperty(QUERY_KEY);
	}

	private Hashtable initEnv(Properties p) {
		Hashtable env = new Hashtable();

		//set LDAP context factory
		env.put(Context.INITIAL_CONTEXT_FACTORY, p.getProperty(FACTORY_KEY));
		log.debug("Property: " + Context.INITIAL_CONTEXT_FACTORY + ", Value: "
				+ p.getProperty(FACTORY_KEY));

		//set host
		env.put(Context.PROVIDER_URL, p.getProperty(HOST_KEY));
		log.debug("Property: " + Context.PROVIDER_URL + ", Value: "
				+ p.getProperty(HOST_KEY));

		//set up authentication variables
		env.put(Context.SECURITY_AUTHENTICATION, "simple");
		env.put(Context.SECURITY_PRINCIPAL, p.getProperty(USER_KEY));
		log.debug("Property: " + Context.SECURITY_PRINCIPAL + ", Value: "
				+ p.getProperty(USER_KEY));

		env.put(Context.SECURITY_CREDENTIALS, p.getProperty(PASS_KEY));
		log.debug("Property: " + Context.SECURITY_CREDENTIALS
				+ ", Value: <hidden>");

		//set up referral and dereferencing policies
		env.put(Context.REFERRAL, "ignore");
		env.put("java.naming.ldap.derefAliases", "never");

		return env;
	}

	public LdapContext getContext() throws LdapException, SystemException {

		LdapContext ctx = null;

		try {
			ctx = new InitialLdapContext(env, null);
		} catch (NamingException e) {
			ServiceUtil.logException(log, "Failed to create ldap connection.",
					e);
			throw new LdapException(AD_UNAVAILABLE, e);
		}

		return ctx;
	}

	public static void releaseContext(LdapContext con) {
		try {
			con.close();
		} catch (NamingException ne) {
			log.warn("Unable to close Ldap connection");
		}
	}

	public static class Dummy {
	}

	/**
	 * @return
	 */
	public String getSearchBase() {
		return searchBase;
	}

	public String getQuery() {
		return query;
	}

	public String getUser() {
		return (String) env.get(Context.SECURITY_PRINCIPAL);
	}
}
