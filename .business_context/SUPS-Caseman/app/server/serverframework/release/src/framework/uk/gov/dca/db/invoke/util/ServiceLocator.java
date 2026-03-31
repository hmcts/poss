package uk.gov.dca.db.invoke.util;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2003</p>
 * <p>Company: </p>
 * @author not attributable
 * @version 1.0
 */

public class ServiceLocator
{
    private final static Log log = SUPSLogFactory.getLogger(ServiceLocator.class);
    private static ServiceLocator instance = new ServiceLocator();

    private Context initCtx = null;

    private ServiceLocator()
    {
    }

    public static ServiceLocator getInstance()
    {
        return instance;
    }

    public Context getInitialContext()
    {
        if(initCtx == null)
        {
            try
            {                
                    initCtx = new InitialContext();
            }
            catch(NamingException e)
            {
                log.error("Naming Exception Occurred " + e);
                e.printStackTrace();
            }
        }
        return initCtx;
    }
}
