/*
 * Created on 22-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import java.io.InputStream;
import java.util.Properties;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;

/**
 * @author Peter Neiil
 *
 */
public class ServerFrameworkReleaseBuildEnvironment
{    
    private static String releaseEnvironment = null;
    
	
    public static synchronized String getFrameworkRelease() throws SystemException
    {
            if (releaseEnvironment == null)
            {
            	Properties serverframeworkProperties = new Properties();
        		try {
        			InputStream in = Util.getInputStream(FrameworkVersionProperties.VERSION_FILE_NAME,null);
        			serverframeworkProperties.load(in);
        		} catch (Throwable e) {
        			serverframeworkProperties = new Properties();
        			serverframeworkProperties.put("version", "Unable to load VERSION_FILE: " + FrameworkVersionProperties.VERSION_FILE_NAME);
        		}
            	FrameworkVersionProperties.setServerFrameworkProperties(serverframeworkProperties);
            	StringBuffer sb = new StringBuffer("<ServerFrameworkReleaseEnvironment");            	
            	sb.append(" "+FrameworkVersionProperties.BUILD_TIME.getLabel()+"=\"" + FrameworkVersionProperties.getServerFrameworkProperty(FrameworkVersionProperties.BUILD_TIME.getName()) + "\"");
            	sb.append(" "+FrameworkVersionProperties.BUILD_USERNAME.getLabel()+"=\"" + FrameworkVersionProperties.getServerFrameworkProperty(FrameworkVersionProperties.BUILD_USERNAME.getName()) + "\"");
            	sb.append(" "+FrameworkVersionProperties.BUILD_USERDOMAIN.getLabel()+"=\"" + FrameworkVersionProperties.getServerFrameworkProperty(FrameworkVersionProperties.BUILD_USERDOMAIN.getName()) + "\"");
            	sb.append(" "+FrameworkVersionProperties.BUILD_USERDNSDOMAIN.getLabel()+"=\"" + FrameworkVersionProperties.getServerFrameworkProperty(FrameworkVersionProperties.BUILD_USERDNSDOMAIN.getName()) + "\"");
            	
            	
            	sb.append(" "+FrameworkVersionProperties.RELEASE_LABEL.getLabel()+"=\"" + FrameworkVersionProperties.getServerFrameworkProperty(FrameworkVersionProperties.RELEASE_LABEL.getName()) + "\"");            	
            	sb.append(" "+FrameworkVersionProperties.FRAMEWORK_COMPONENT.getLabel()+"=\"" + FrameworkVersionProperties.getServerFrameworkProperty(FrameworkVersionProperties.FRAMEWORK_COMPONENT.getName()) + "\"");            	
            	sb.append(" "+FrameworkVersionProperties.CC_FW_BASELINE.getLabel()+"=\"" + FrameworkVersionProperties.getServerFrameworkProperty(FrameworkVersionProperties.CC_FW_BASELINE.getName()) + "\"");
            	
            	sb.append(" "+FrameworkVersionProperties.BASELINE_SELECTOR.getLabel()+"=\"" + FrameworkVersionProperties.getServerFrameworkProperty(FrameworkVersionProperties.BASELINE_SELECTOR.getName()) + "\"");            	
            	sb.append(" "+FrameworkVersionProperties.STREAM_SELECTOR.getLabel()+"=\"" + FrameworkVersionProperties.getServerFrameworkProperty(FrameworkVersionProperties.STREAM_SELECTOR.getName()) + "\"");            	

            	sb.append("/>");
            	releaseEnvironment = sb.toString();                
            }            
            return releaseEnvironment;        
    }

}
