/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.util;

import javax.jms.Connection;
import javax.jms.MessageProducer;
import javax.jms.Session;

/**
 * @author Michael Barker
 *
 */
public class JMSUtil
{
    public static void quietClose(Session session)
    {
        if (session != null)
        {
            try
            {
                session.close();
            }
            catch (Throwable t)
            {
                // Do nothing.
            }
        }
    }
    
    public static void quietClose(MessageProducer producer)
    {
        if (producer != null)
        {
            try
            {
                producer.close();
            }
            catch (Throwable t)
            {
                // Do nothing.
            }            
        }
    }
    
    public static void quietClose(Connection cn)
    {
        if (cn != null)
        {
            try
            {
                cn.close();
            }
            catch (Throwable t)
            {
                // Do nothing.
            }
        }
    }

    /**
     * @param cn
     */
    public static void quietStop(Connection cn)
    {
        if (cn != null)
        {
            try
            {
                cn.stop();
            }
            catch (Throwable t)
            {
                // Do nothing.
            }
        }
    }
}
