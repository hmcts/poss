/*
 * Created on 10-May-2005
 *
 */
package uk.gov.dca.db.xslfo;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author Michael Barker
 *
 */
public class XSLFOException extends SystemException
{

    /**
     * 
     */
    public XSLFOException()
    {
        super();
    }
    
    /**
     * @param message
     */
    public XSLFOException(String message)
    {
        super(message);
    }
   
    /**
     * @param message
     * @param cause
     */
    public XSLFOException(String message, Throwable cause)
    {
        super(message, cause);
    }
    
    /**
     * @param cause
     */
    public XSLFOException(Throwable cause)
    {
        super(cause);
    }
}
