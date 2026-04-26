/*
 * Created on 22-Mar-2005
 *
 */
package uk.gov.dca.db.check.web;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 * imported by Peter Neil from Ediary
 *
 */
public class Version
{
    // PNTODO: Load the version-info.xml found in the config.jar
    
    private static String version = null;
    
    public static synchronized String getVersion() throws SystemException
    {
            if (version == null)
            {
                version = VersionProperties.getProperty("version");
                if (version == null)
                {
                    version = "Version value is not defined";
                }
            }            
            return version;
    }
    
}
