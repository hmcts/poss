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
import java.util.Properties;

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
	
	public String getProperty(String key) {
		return properties.getProperty(key);
	}
	
	public static final String GUI_FILE_CHOOSER_DIRECTORY = "testservice.gui.filechooser.initdirectory";
	public static final String REMOTE_SERVICE_ENDPOINT = "testservice.remote.service.endpoint";
	public static final String REMOTE_SERVICE_USER = "testservice.remote.service.user";
	public static final String REMOTE_SERVICE_PASSWORD = "testservice.remote.service.password";
	
	private static TestServiceProperties instance = null;
	
	private Properties properties = new Properties();
}
