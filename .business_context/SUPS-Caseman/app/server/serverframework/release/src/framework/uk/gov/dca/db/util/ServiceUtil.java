/*
 * Created on 07-Jan-2005
 *
 */
package uk.gov.dca.db.util;

import java.util.Iterator;
import java.util.Map;

import org.apache.commons.logging.Log;

/**
 * @author Michael Barker
 *
 */
public class ServiceUtil
{
    /**
     * Creates a params structure from a map.
     *
     * @param m
     * @return
     */
    public static String createSimpleParams(Map m)
    {
        StringBuffer sb = new StringBuffer();
        sb.append("<params>");
        for (Iterator i = m.entrySet().iterator(); i.hasNext();)
        {
            Map.Entry entry = (Map.Entry) i.next();
            sb.append("<param name='");
            sb.append(entry.getKey().toString());
            sb.append("'>");
            sb.append(entry.getValue().toString());
            sb.append("</param>");
        }
        sb.append("</params>");

        return sb.toString();
    }
    
    
    public static void logException(Log log, String message, Throwable t)
    {
        log.error(message + " Exception: " + t.getClass().getName() + ", message: " + t.getMessage());
    }
}