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
    
    private static final long serialVersionUID = -2931632985565169986L;
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
    }
    /**
     * @param message
     */
    public GeneratorException(String message)
    {
        super(message);
    }
    /**
     * @param message
     * @param cause
     */
    public GeneratorException(String message, Throwable cause)
    {
        super(message, cause);
    }
}
