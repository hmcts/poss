/*
 * Created on 10-May-2005
 *
 */
package uk.gov.dca.db;

/**
 * @author Michael Barker
 *
 */
public final class SupsConstants
{
    public final static String SUPS_CONFIG_PARAM = "uk.gov.dca.db.SupsConfig";
    public final static String CONTENT_STORE_ID = "ContentStore";
    public static final String DOCUMENT_MANAGER_ID = "DocumentManager";
    public static final String XSLFO_FACTORY_ID = "XSLFOFactory";
    public final static String SECURITY_STATUS_ID = "security:status";
    public final static String FORCE_USE_SSL_ID = "security:forceSSL";
    public final static String USER_ID_PATH = "/params/param[@name='SUPS.userID']";
    public final static String COURT_ID_PATH = "/params/param[@name='SUPS.courtID']";
    public final static boolean IS_LINUX_OS = isLinuxOS();
    public final static boolean IS_WINDOWS_OS = isWindowsOS();
    public final static String DEFAULT_ENCODING = "UTF-8";
    
    // the following strings are private because the user should use the public 
    // properties IS_LINUX_OS and IS_WINDOWS_OS to get the OS
    private final static String OS_SYSTEM_PROPERTY = "os.name";
    private final static String WINDOWS_OS = "WINDOWS";
    private final static String LINUX_OS = "LINUX";
    private final static String DEFAULT_OS = LINUX_OS;
    
    /**
     * static method to determine if this is a windows based OS. The various strings
     * Java uses for windows OS are:
     * Windows 2000
     * Windows 95
     * Windows 98
     * Windows NT
     * Windows XP
     * 
     * @return
     */
    private static boolean isWindowsOS() {
    	boolean isWindows = false;
    	
    	String OS = System.getProperty(OS_SYSTEM_PROPERTY, DEFAULT_OS);
    	OS = OS.toUpperCase();
    	
    	if ( OS.indexOf(WINDOWS_OS) != -1) {
    		isWindows = true;
    	}
    	
    	return isWindows;
    }
    
    /**
     * static method to determine if this is a Linux OS.
     * 
     * @return
     */
    private static boolean isLinuxOS() {
    	boolean isLinux = false;
    	
    	String OS = System.getProperty(OS_SYSTEM_PROPERTY, DEFAULT_OS);
    	if ( OS.compareToIgnoreCase(LINUX_OS) == 0) {
    		isLinux = true;
    	}
    	
    	return isLinux;
    }
    public final static String SQL_LOG = "SQL";
}
