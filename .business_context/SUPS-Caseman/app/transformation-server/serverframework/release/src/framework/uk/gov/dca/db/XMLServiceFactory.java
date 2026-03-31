package uk.gov.dca.db;

import uk.gov.dca.db.impl.SUPSService;
import uk.gov.dca.db.exception.*;

/**
 * The factory provides an instance of the service that can
 * be used to perform queries against.
 * @author Howard Henson
 */
public class XMLServiceFactory {
    private static XMLService s_instance;
    
    /**
     * Returns a XMLService instance.
     * @return
     */
    public static XMLService geInstance()
    {
        if(s_instance == null){
            try {
                s_instance = new SUPSService("./test/templates");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return s_instance;
    }
  
    
    public static XMLService getInstance(String serviceName, String[] methods, String sFrameworkConfig, String sProjectConfig) 
    	throws SystemException
    {
        return new SUPSService(serviceName,methods,sFrameworkConfig,sProjectConfig);
    }
    
}
