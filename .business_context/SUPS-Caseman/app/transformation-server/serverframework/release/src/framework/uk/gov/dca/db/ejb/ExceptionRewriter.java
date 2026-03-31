/*
 * Created on 20-Jan-2005
 */
package uk.gov.dca.db.ejb;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

/**
 * Class to rewrite exceptions so can propagate desired information to the client.
 * @author GrantM
 */
public class ExceptionRewriter {

	private final static String s_businessExceptionClassname = BusinessException.class.getName();
	private final static String s_systemExceptionClassname = SystemException.class.getName();
	private final static String s_seperator = "|";
	protected final static Class[] s_exceptionConstructorParams = { String.class, Throwable.class };

	/**
	 * Constructor
	 */
	public ExceptionRewriter() {
		super();
	}
	
	/**
	 * Recreates the exception but with a new msg consisting of format:
	 * 
	 * <base classname>|<subclass1 name>|<subclass2 name>|...||<original message>
	 * 
	 * @param exception
	 * @return
	 */
	public Exception rewrite(Exception exception) 
		throws SystemException
	{
		Exception rewrittenException = null;
		
		String errorMsg = exception.getMessage();
		String classHierarchy = "";
		
		Class exceptionClass = exception.getClass();
		Class currentClass = exceptionClass;
		
		while (currentClass!=null) {
			String exceptionClasspath = currentClass.getName();
			String exceptionName = exceptionClasspath.substring( exceptionClasspath.lastIndexOf(".")+1 );
			
			classHierarchy = exceptionName + s_seperator + classHierarchy;
			
			if ( s_businessExceptionClassname.compareTo(exceptionClasspath) == 0 || 
					s_systemExceptionClassname.compareTo(exceptionClasspath) == 0) {
				currentClass = null;
			}
			else {
				currentClass = exceptionClass.getSuperclass();
			}
		}
		
		try
		{
			Constructor exceptionConstructor = exceptionClass.getConstructor( s_exceptionConstructorParams );
			Object[] params = { classHierarchy + s_seperator + exception.getMessage(), exception.getCause() };
			rewrittenException = (Exception)exceptionConstructor.newInstance( params );
		}
		catch(NoSuchMethodException e) {
			throw new SystemException( "SystemException" + s_seperator + s_seperator +
					"Unable to find constructor (String, Throwable) for '"+exceptionClass+"'",e);
		}
	    catch(InstantiationException e) { 
	    	throw new SystemException( "SystemException" + s_seperator + s_seperator +
	    			"Unable to instantiate '"+exceptionClass+"'", e);
	    }
	    catch(IllegalAccessException e) { 
	    	throw new SystemException( "SystemException" + s_seperator + s_seperator +
	    			"Unable to access '"+exceptionClass+"'",e );
	    }
		catch(InvocationTargetException e) {
			throw new SystemException( "SystemException" + s_seperator + s_seperator +
					"Failed to invoke constructor (String, Throwable) for '"+exceptionClass+"'",e);
		}	
	    
		return rewrittenException;
	}

}
