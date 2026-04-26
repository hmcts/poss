/*
 * Created on 22-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import java.util.Properties;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Peter Neiil
 *
 */
public class ClientFrameworkReleaseBuildEnvironment
{    
    private static String releaseEnvironment = null;
    
    public static synchronized String getFrameworkRelease(Properties clientframeworkProperties) throws SystemException
    {
            if (releaseEnvironment == null)
            {
            	FrameworkVersionProperties.setClientFrameworkProperties(clientframeworkProperties);
            	StringBuffer sb = new StringBuffer("<ClientFrameworkReleaseEnvironment");
            	sb.append(" "+FrameworkVersionProperties.BUILD_TIME.getLabel()+"=\"" + FrameworkVersionProperties.getClientFrameworkProperty(FrameworkVersionProperties.BUILD_TIME.getName()) + "\"");
            	sb.append(" "+FrameworkVersionProperties.BUILD_USERNAME.getLabel()+"=\"" + FrameworkVersionProperties.getClientFrameworkProperty(FrameworkVersionProperties.BUILD_USERNAME.getName()) + "\"");
            	sb.append(" "+FrameworkVersionProperties.BUILD_USERDOMAIN.getLabel()+"=\"" + FrameworkVersionProperties.getClientFrameworkProperty(FrameworkVersionProperties.BUILD_USERDOMAIN.getName()) + "\"");
            	sb.append(" "+FrameworkVersionProperties.BUILD_USERDNSDOMAIN.getLabel()+"=\"" + FrameworkVersionProperties.getClientFrameworkProperty(FrameworkVersionProperties.BUILD_USERDNSDOMAIN.getName()) + "\"");
            	
            	sb.append(" "+FrameworkVersionProperties.RELEASE_LABEL.getLabel()+"=\"" + FrameworkVersionProperties.getClientFrameworkProperty(FrameworkVersionProperties.RELEASE_LABEL.getName()) + "\"");            	
            	sb.append(" "+FrameworkVersionProperties.FRAMEWORK_COMPONENT.getLabel()+"=\"" + FrameworkVersionProperties.getClientFrameworkProperty(FrameworkVersionProperties.FRAMEWORK_COMPONENT.getName()) + "\"");            	
            	sb.append(" "+FrameworkVersionProperties.CC_FW_BASELINE.getLabel()+"=\"" + FrameworkVersionProperties.getClientFrameworkProperty(FrameworkVersionProperties.CC_FW_BASELINE.getName()) + "\"");
            	
            	sb.append(" "+FrameworkVersionProperties.BASELINE_SELECTOR.getLabel()+"=\"" + FrameworkVersionProperties.getClientFrameworkProperty(FrameworkVersionProperties.BASELINE_SELECTOR.getName()) + "\"");            	
            	sb.append(" "+FrameworkVersionProperties.STREAM_SELECTOR.getLabel()+"=\"" + FrameworkVersionProperties.getClientFrameworkProperty(FrameworkVersionProperties.STREAM_SELECTOR.getName()) + "\"");            	

            	sb.append("/>");
            	releaseEnvironment = sb.toString();                
            }            
            return releaseEnvironment;        
    }

}
