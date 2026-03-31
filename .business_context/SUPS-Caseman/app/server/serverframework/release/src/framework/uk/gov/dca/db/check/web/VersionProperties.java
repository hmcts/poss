package uk.gov.dca.db.check.web;

import java.io.InputStream;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.db.impl.Util;

public class VersionProperties {

	/**
	 *     The version.properties file is created using the server build script
	 *             
	 *     <entry key="version" value="${release.label}"/>
	 *     <entry key="cc.baseline" value="${cc.baseline.full}"/>
	 *     <entry key="release.stream" value="stream: ${release.stream.name} \ view: ${release.view.tag}"/>
	 *     <entry key="release.view" value="stream: ${release.stream.name} \ view: ${release.view.tag}"/>
	 *     <entry key="cc.fw.baseline" value="${fw.component.name}-${fw.baseline.version}"/>
	 *     
	 *     <entry key="build.machine" value="${env.COMPUTERNAME}"/>
	 *     <entry key="build.username" value="${env.USERNAME}"/>
	 *     <entry key="build.userdomain" value="${env.USERDOMAIN}"/>
	 *     <entry key="build.userdnsdomain" value="${env.USERDNSDOMAIN}"/>
	 * 
	 */
	public static ConfigProperty VERSION_PROPERTY = new ConfigProperty("version", "version");
	public static ConfigProperty  CC_BASELINE = new ConfigProperty("baseline", "cc.baseline");
	public static ConfigProperty RELEASE_STREAM = new ConfigProperty("stream","release.stream");
	public static ConfigProperty RELEASE_VIEW = new ConfigProperty("view","release.view");
	public static ConfigProperty CC_FW_BASELINE= new ConfigProperty("frameworkBaseline", "cc.fw.baseline");
	 
	//build environment properties
	public static ConfigProperty BUILD_TIME = new ConfigProperty("buildTime","build.time");
	public static ConfigProperty BUILD_MACHINE = new ConfigProperty("machine","build.machine");
	public static ConfigProperty BUILD_USERNAME = new ConfigProperty("username","build.username");
	public static ConfigProperty BUILD_USERDOMAIN = new ConfigProperty("userdomain","build.userdomain");
	public static ConfigProperty BUILD_USERDNSDOMAIN = new ConfigProperty("userdnsdomain", "build.userdnsdomain");		

	private static final Log log = LogFactory.getLog(VersionProperties.class
			.getName());

	public final static String VERSION_FILE = "version.properties";

	private static Properties p = null;

	public static Properties load() {
		try {
			if (p == null) {
				p = new Properties();
				InputStream in = Util.getInputStream(VERSION_FILE,
						new BaseLine());
				p.load(in);
			}
		} catch (Throwable e) {
			log.error("Unable to load VERSION_FILE: " + VERSION_FILE);
			p = new Properties();
			p.put("version", "Unable to load VERSION_FILE: " + VERSION_FILE);
		}
		return p;
	}

	public static String getProperty(String propertyName) {
		String rtn = null;
		VersionProperties.load();
		if (p != null) {
			rtn = p.getProperty(propertyName);
		}
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
}
