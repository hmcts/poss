/*
 * Created on 19-Apr-2005
 *
 */
package uk.gov.dca.db.util;

import org.apache.commons.logging.Log;

/**
 * @author Michael Barker
 *
 */
public class LogUtil
{
    public static void logException(Log log, String message, Exception e)
    {
        String errMsg = e.getMessage();
        if (errMsg == null)
        {
            errMsg = e.toString();
        }
        log.error(message + " " + e.getClass().getName() + ": " + errMsg);
    }
}
