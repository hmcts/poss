/*
 * Created on 22-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Peter Neiil
 *
 */
public class BuildEnvironment
{    
    private static String buildEnvironment = null;
    
    public static synchronized String getBuildEnvironment() throws SystemException
    {
            if (buildEnvironment == null)
            {
            	StringBuffer sb = new StringBuffer("<BuildEnvironment");
            	sb.append(" "+VersionProperties.BUILD_TIME.getLabel()+"=\"" + VersionProperties.getProperty(VersionProperties.BUILD_TIME.getName()) + "\"");
            	sb.append(" "+VersionProperties.BUILD_USERNAME.getLabel()+"=\"" + VersionProperties.getProperty(VersionProperties.BUILD_USERNAME.getName()) + "\"");
            	sb.append(" "+VersionProperties.BUILD_USERDOMAIN.getLabel()+"=\"" + VersionProperties.getProperty(VersionProperties.BUILD_USERDOMAIN.getName()) + "\"");
            	sb.append(" "+VersionProperties.BUILD_USERDNSDOMAIN.getLabel()+"=\"" + VersionProperties.getProperty(VersionProperties.BUILD_USERDNSDOMAIN.getName()) + "\"");            	
            	sb.append("/>");
            	buildEnvironment = sb.toString();                
            }            
            return buildEnvironment;        
    }
    
    
}
