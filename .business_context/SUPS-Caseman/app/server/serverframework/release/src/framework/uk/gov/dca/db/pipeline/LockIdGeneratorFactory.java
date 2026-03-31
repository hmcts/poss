/*
 * Created on 27-Oct-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline;

import uk.gov.dca.db.util.ClassUtil;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class LockIdGeneratorFactory {

	/**
	 * Constructor
	 */
	public LockIdGeneratorFactory() {
		super();
	}
	
	/**
	 * creates the specified custom lock id generator implementation.
	 * 
	 * @param lockIdGenerator the fully qualified class name of a custom generator
	 * @return a LockIdGenerator implementation for generating lockIds using a custom algorithm
	 * @throws LockingException if an exception occurs whilst trying to create the custom generator
	 */
	public LockIdGenerator createCustomGenerator(String lockIdGenerator) throws LockingException {
		Object generator = null;
		try {
			Class generatorClass = ClassUtil.loadClass(lockIdGenerator);
			
			if(generatorClass == null) {
				throw new LockingException("Loaded class is null for custom lock id generator: " + lockIdGenerator);
			}
			
			generator = generatorClass.newInstance();
		}
		catch(ClassNotFoundException e) {
			throw new LockingException("Could not create custom lock id generator '" + lockIdGenerator +"': "+e.getMessage(), e);
		}
		catch(IllegalAccessException e) {
			throw new LockingException("Could not create custom lock id generator '" + lockIdGenerator +"': "+e.getMessage(), e);
		}
		catch(InstantiationException e) {
			throw new LockingException("Could not create custom lock id generator '" + lockIdGenerator +"': "+e.getMessage(), e);
		}
		
		return (LockIdGenerator) generator; 
	}

	/**
	 * creates a new lockId generator object for generating lock ids using an XPath expression
	 * 
	 * @param lockIdExpression the XPath expression to be used to generate the lock id
	 * @return a LockIdGenerator implementation for generating lockIds based upon an XPath expression
	 */
	public LockIdGenerator createExpressionBasedGenerator(String lockIdExpression) {
		return new ExpressionBasedLockIdGenerator(lockIdExpression);
	}

}
