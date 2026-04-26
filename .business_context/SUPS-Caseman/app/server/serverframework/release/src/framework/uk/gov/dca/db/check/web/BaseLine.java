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
public class BaseLine
{
    // PNTODO: Load the version-info.xml found in the config.jar
    
    public final static String VERSION_FILE = "version.properties";
    private static String baseline = null;
    
    public static synchronized String getBaseLine() throws SystemException
    {
            if (baseline == null)
            {
                baseline = VersionProperties.getProperty("cc.baseline");
                if (baseline == null)
                {
                    baseline = "BaseLine value is not defined";
                }
            }            
            return baseline;        
    }
    
    
}
