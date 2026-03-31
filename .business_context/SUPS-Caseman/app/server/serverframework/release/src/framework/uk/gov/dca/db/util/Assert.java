/*
 * Created on 04-May-2005
 *
 */
package uk.gov.dca.db.util;

import org.apache.commons.logging.Log;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 */
public class Assert
{
    /**
     * Asserts that a condition is true and throws an exception if not.
     * 
     * @param test
     * @param log
     * @param message
     * @throws SystemException
     */
    public static void assertTrue(boolean test, Log log, String message) throws SystemException
    {
        if (!test)
        {
            if (log != null)
            {
                log.warn(message);                
            }
            throw new SystemException(message);
        }
    }
    
    /**
     * Asserts that a condition is true and throws an exception if not.
     * 
     * @param test
     * @param log
     * @param message
     * @throws SystemException
     */
    public static void rtAssertTrue(boolean test, Log log, String message) throws SystemException
    {
        if (!test)
        {
            if (log != null)
            {
                log.warn(message);                
            }
            throw new SystemException(message);
        }
    }
}
