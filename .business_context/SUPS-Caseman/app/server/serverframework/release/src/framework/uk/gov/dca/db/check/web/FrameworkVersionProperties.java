package uk.gov.dca.db.check.web;

import java.io.InputStream;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.util.ConfigUtil;

public class FrameworkVersionProperties {

	/**
	 *     The framework.version.properties file is created using the serverframework distribution build script
	 *             
	 *     cc.project.component.name=cs-frwk-dev\\cs-frwk-dev
	 *     cc.baseline.full=frwk-dev-9-0013
	 *     selector.application.baseline=baseline\:frwk-dev-9-0013@\\cs_pvob
	 *     selector.release.stream=stream\:Framework_Release_9_06_DIST@\\cs_pvob
	 *     release.label=Framework_Release_9_06
	 *     cc.baseline.version=0013
	 *     
	 *     <entry key="build.machine" value="${env.COMPUTERNAME}"/>
	 *     <entry key="build.username" value="${env.USERNAME}"/>
	 *     <entry key="build.userdomain" value="${env.USERDOMAIN}"/>
	 *     <entry key="build.userdnsdomain" value="${env.USERDNSDOMAIN}"/>
	 * 
	 */
	
private static final Log log = LogFactory.getLog(FrameworkVersionProperties.class.getName());
	
	private static Properties clientFrameworkProperties = new Properties();
	private static Properties serverframeworkProperties = new Properties();
	
	public final static String VERSION_FILE_NAME = "framework.version.properties";
	/**
	 * Initialize the Configuration for this application
	 */
	private static ConfigUtil config = null;	
	static{
		try{
			config = new ConfigUtil();
		}
		catch(Exception e){
			e.printStackTrace(System.err);
			System.err.print("Unable to load ConfigUtil");
		}
	}
		
	public static ConfigProperty FRAMEWORK_COMPONENT = new ConfigProperty("projectComponent", "cc.project.component.name");
	public static ConfigProperty RELEASE_LABEL = new ConfigProperty("version", "release.label");
	public static ConfigProperty BASELINE_SELECTOR = new ConfigProperty("baseline", "selector.application.baseline");
	public static ConfigProperty STREAM_SELECTOR = new ConfigProperty("stream","selector.release.stream");	
	public static ConfigProperty CC_FW_BASELINE = new ConfigProperty("frameworkBaseline", "cc.baseline.version");
	 
	//build environment properties
	public static ConfigProperty BUILD_TIME = new ConfigProperty("buildTime","build.time");
	public static ConfigProperty BUILD_MACHINE = new ConfigProperty("machine","build.machine");
	public static ConfigProperty BUILD_USERNAME = new ConfigProperty("username","build.username");
	public static ConfigProperty BUILD_USERDOMAIN = new ConfigProperty("userdomain","build.userdomain");
	public static ConfigProperty BUILD_USERDNSDOMAIN = new ConfigProperty("userdnsdomain", "build.userdnsdomain");		

	public static String getApplicationDeployedName(){
		return config.getApplicationDeployedName();
	}
	public static String getApplicationServicePrefix(){
		return config.getApplicationServicePrefix();
	}
	public static String getApplicationWebPrefix(){
		return config.getApplicationWebPrefix();
	}

	public static String getServerFrameworkProperty(String propertyName) {
		String rtn = null;
		rtn = serverframeworkProperties.getProperty(propertyName);
		return rtn;
	}
	public static String getClientFrameworkProperty(String propertyName) {
		String rtn = null;
		rtn = clientFrameworkProperties.getProperty(propertyName);
		return rtn;
	}
	
	public static class ConfigProperty {

		private static int counter = 0;

		private final int id;
		private final String name;
		private final String label;
		
		public ConfigProperty(String label, String propertyName) {
			this.id = counter++;
			this.label = label;
			this.name = propertyName;
		}

		public static int getCounter() {
			return counter;
		}

		public int getId() {
			return id;
		}

		public String getName() {
			return name;
		}

		public String getLabel() {
			return label;
		}

	}

	public static void setClientFrameworkProperties(Properties theClientFrameworkProperties){
		FrameworkVersionProperties.clientFrameworkProperties = theClientFrameworkProperties;
	}
	public static void setServerFrameworkProperties(Properties theServerFrameworkProperties){
		FrameworkVersionProperties.serverframeworkProperties = theServerFrameworkProperties;
	}
	
}
