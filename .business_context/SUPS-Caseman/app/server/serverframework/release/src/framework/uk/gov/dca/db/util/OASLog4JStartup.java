/*
 * Created on May 3, 2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.util;

import java.io.File;
import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Hashtable;

import javax.naming.Context;
import javax.xml.parsers.FactoryConfigurationError;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.log4j.xml.DOMConfigurator;

import com.evermind.server.OC4JStartup;

/**
 * @author Imran
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class OASLog4JStartup implements OC4JStartup {

	
	private Hashtable props = null;
	/**
	 * Default configuration reload interval (milliseconds)
	 */
	protected static final long DEFAULT_CONFIG_RELOAD_INTERVAL = 10000;
	
	/**
	 * Configuration file name parameter name
	 */
	protected static final String LOGGING_CONFIG_FILE_NAME = "LOGGING_CONFIG_FILE_NAME";
	
	/**
	 * Configuration file reload interval parameter name
	 */
	protected static final String CONFIG_RELOAD_INTERVAL = "CONFIG_RELOAD_INTERVAL";
		
	/**
	 * Default Log4J configuration string
	 */
	private static final String DEFAULT_LOG_CONFIGURATION =
      "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
      "<!DOCTYPE log4j:configuration SYSTEM \"log4j.dtd\">\n" +
      "<log4j:configuration xmlns:log4j=\"http://jakarta.apache.org/log4j/\">\n" +
      " <appender name=\"ConsoleAppender\" class=\"org.apache.log4j.ConsoleAppender\">\n" +
      "  <layout class=\"org.apache.log4j.PatternLayout\">\n" +
      "   <param name=\"ConversionPattern\" value=\"%-4r [%t] %-5p %c %x - %m%n\"/>\n" +
      "  </layout>\n" +
      " </appender>\n" +
      " <appender name=\"FileAppender\" class=\"org.apache.log4j.FileAppender\">\n" +
      "  <param name=\"File\" value=\"default_log4j.log\"/>\n" +
      "  <param name=\"Append\" value=\"true\"/>\n" +
      "   <layout class=\"org.apache.log4j.PatternLayout\">\n" +
      "    <param name=\"ConversionPattern\" value=\"%d{dd HH:mm:ss} %5p [%c{1}] - %m%n\"/>\n" +
      "   </layout>\n" +
      " </appender>\n" +
      " <root>\n" +
      "  <priority value=\"debug\"/>\n" +
      "  <appender-ref ref=\"ConsoleAppender\"/>\n" +
      "  <appender-ref ref=\"FileAppender\"/>\n" +
      " </root>\n" +
      "</log4j:configuration>";

	/**
	 * Returns the configuration file name
	 * @return configuration file name
	 */
	protected String getConfigFileName() {
		
		String fileName = null;
	
		fileName = (String) props.get(LOGGING_CONFIG_FILE_NAME);
	
		return fileName;
	}
	
		  /**
		   * Returns the configuration reload interval in milliseconds
		   * 0 or ommitted CONFIG_RELOAD_INTERVAL will result in the config 
		   * file not being watched for reload events
		   * @return reload interval
		   */
		  protected long getConfigReloadInterval() {
		    String reloadIntervalStr = null;
		    long reloadInterval = 0L;
		    reloadIntervalStr = (String) props.get(CONFIG_RELOAD_INTERVAL);
		    if (reloadIntervalStr != null) {
		    	reloadInterval = Long.parseLong(reloadIntervalStr); 
		    }
		    return reloadInterval; 
		  }
		  /**
		   * Initialise Log4j.
		   * This should <em>only</em> be done by the bootstrap instance.
		   *
		   */
		  public void initLog4j() {
		    System.out.println("LoggerInitialiser - Initialising Log4j ...");
	
		    boolean isConfigured = false;
		    String configFileName = getConfigFileName();
	
		    if (configFileName != null) {
		      // try with default log configuration file instead
		      isConfigured = configureFromFile(configFileName);
		    }
	
		    if (!isConfigured) {
		      System.err.println(
		          "LoggerInitialiser - Problem occured, could not locate " +
		          getConfigFileName());
	
		      System.err.println(
		          "LoggerInitialiser - Configuring with static default configuration...");
		      configure(DEFAULT_LOG_CONFIGURATION);
		    }
	
		    // Create a logger to complete initialisation
		    Logger log = Logger.getLogger(this.getClass());
		    log.info("LoggerInitialiser - Log4J initialized");
		  }
	
		  /**
		   * Configure log4j using a XML string.
		   *
		   * @param config the log4j configuration (as an XML string).
		   * @return true if the configuration was successfull.
		   */
		  public boolean configure(String config) {
		    System.out.println("LoggerInitialiser - Configuring Log4J with: " + config);
		    boolean success = true;
	
		    try {
		      DOMConfigurator domConfig = new DOMConfigurator();
		      domConfig.doConfigure(new StringReader(config),
		                            LogManager.getLoggerRepository());
		    }
		    catch (FactoryConfigurationError e) {
	
		      success = false;
		      System.err.println("LoggerInitialiser - Error configuring Log4j: " + e);
		    }
	
		    return success;
		  }
	
		  /**
		   * Configure log4j using a file name.
		   *
		   * @param fileName the log4j configuration (as a file name).
		   * @return true if the configuration was successfull.
		   */
		  public boolean configureFromFile(String fileName) {
	
		    System.out.println(
		        "LoggerInitialiser - configureFromFile() - received filename: " +
		        fileName);
		    boolean success = false;
	
		    if (fileName != null) {
		      URL configURL = null;
	
		      System.out.println(
		          "LoggerInitialiser - configureFromFile() - Attempting to build URL to resource on the classpath...");
	
		      configURL = Thread.currentThread().getContextClassLoader().
		          getResource(fileName);
		      if (configURL == null) {
		        System.out.println(
		            "LoggerInitialiser - configureFromFile() - Config file not on the classpath.");
		      } else {
		        success = true;
		        System.out.println(
		            "LoggerInitialiser - configureFromFile() - Successfully built URL to resource.");
		      }
	
		      if (!success) {
		        System.out.println(
		            "LoggerInitialiser - configureFromFile() - Attempting to load from file system...");
		        try {
		          File configFile = new File(fileName);
		          configURL = configFile.toURL();
		          success = true;
		        }
		        catch (MalformedURLException mfue) {
		          System.err.print("LoggerInitialiser - Exception raised whilst attempting to build URL to config file: " +
		                           fileName);
		        }
		      }
	
		      if (success) {
		        System.out.println("LoggerInitialiser - Loading config at URL: " + configURL);
		        long reloadInterval = getConfigReloadInterval();
		        // don't configure and Watch if it is 0 ms
		        if(reloadInterval == 0L){
		        	DOMConfigurator.configure(fileName);
		        }
		        else
		        {
		        	DOMConfigurator.configureAndWatch(fileName,reloadInterval);
		        }
	      }
	    }	
	    return success;
	  }
	  
	/* (non-Javadoc)
	 * @see com.evermind.server.OC4JStartup#preDeploy(java.util.Hashtable, javax.naming.Context)
	 */
	public String preDeploy(Hashtable properties, Context context) throws Exception {
		this.props = properties; 
		initLog4j();
		return null;
	}

	/* (non-Javadoc)
	 * @see com.evermind.server.OC4JStartup#postDeploy(java.util.Hashtable, javax.naming.Context)
	 */
	public String postDeploy(Hashtable properties, Context context) throws Exception {
		return null;
	}
}
