/*
 * Created on 27-Jul-2004
 *
 */
package uk.gov.dca.db.impl;

/**
 * @author Michael Barker
 *
 */
public class GeneratorException extends Exception
{
    public GeneratorException(Throwable t)
    {
        super(t);
    }
    
    /**
     * 
     */
    public GeneratorException()
    {
        super();
        // TODO Auto-generated constructor stub
    }
    /**
     * @param message
     */
    public GeneratorException(String message)
    {
        super(message);
        // TODO Auto-generated constructor stub
    }
    /**
     * @param message
     * @param cause
     */
    public GeneratorException(String message, Throwable cause)
    {
        super(message, cause);
        // TODO Auto-generated constructor stub
    }
}
