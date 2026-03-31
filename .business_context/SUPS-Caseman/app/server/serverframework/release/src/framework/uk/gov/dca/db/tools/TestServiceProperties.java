/*
 * Created on 27-Oct-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.tools;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class TestServiceProperties {

	/**
	 * private constructor to prevent direct instantiation
	 * 
	 * @throws IOException
	 */
	private TestServiceProperties() throws IOException {
		super();
		
		File propertiesFile = new File("TestService.properties");
		FileInputStream stream = new FileInputStream(propertiesFile);
		
		properties.load(stream);
		
		substituteVariables();
	}

	/**
	 * Returns the singleton instance.  This method must be used to obtain an instance of the class.
	 * 
	 * @return a reference to the singleton instance of the TestServiceProperties class
	 * @throws IOException if an error occurred whilst accessing the underlying properties file
	 */
	public static TestServiceProperties getInstance() throws IOException {
		
		// as this particular class will not be used in a multi-threaded environment, we do not need to worry about 
		// synchronisation here
		if(instance == null) {
			instance = new TestServiceProperties();
		}
		
		return instance;
	}
	
	/**
	 * Retrieves the property value associated with the supplied key
	 * 
	 * @param key
	 * @return
	 */
	public String getProperty(String key) {
		return properties.getProperty(key);
	}
	
	/**
	 * Performs variable expansion of the properties, substituting variables in the properties with their values.
	 * Note: This method does not currently support properties containing variables that contain variables themselves i.e. the variable
	 * expansion will only occur to one level deep.
	 */
	private void substituteVariables() {
		Iterator elements = properties.entrySet().iterator();
		while(elements.hasNext()) {
			boolean altered = false;
			Map.Entry element = (Map.Entry) elements.next();
			if(element != null) {
				String value = (String) element.getValue();
				Matcher matcher = VARIABLE_PATTERN.matcher(value);
				while(matcher.find()) {
					String match = matcher.group(1);
					if(properties.containsKey(match)) {
						value = value.substring(0, matcher.start()) + properties.get(match) + value.substring(matcher.end(), value.length());
						altered = true;
					}
				}
				if(altered) {
					properties.put((String) element.getKey(), value);
				}
			}
		}
	}
		
	public static final String GUI_FILE_CHOOSER_DIRECTORY = "testservice.gui.filechooser.initdirectory";
	public static final String LOCAL_PROJECT_PACKAGE = "testservice.local.project.package";
	public static final String REMOTE_SERVICE_ENDPOINT = "testservice.remote.service.endpoint";
	public static final String REMOTE_SERVICE_NAMESPACE = "testservice.remote.service.namespace";
	public static final String REMOTE_SERVICE_USER = "testservice.remote.service.user";
	public static final String REMOTE_SERVICE_PASSWORD = "testservice.remote.service.password";

	private static final Pattern VARIABLE_PATTERN = Pattern.compile("\\$\\{([^}]+)\\}");
	
	private static TestServiceProperties instance = null;
	
	private Properties properties = new Properties();
}
