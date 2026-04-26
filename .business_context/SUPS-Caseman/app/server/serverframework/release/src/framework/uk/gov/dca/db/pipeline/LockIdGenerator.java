/*
 * Created on 27-Oct-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline;

import org.jdom.Element;

/**
 * Implementations of this interface will encapsulate different algorithms for generating Ids from the message.
 * 
 * @author JamesB
 */
public interface LockIdGenerator {

	/**
	 * Generates a lock Id from the supplied message.  
	 * 
	 * @param message the message passed into this component
	 * @return the generated lock Id
	 */
	public String generateLockId(Element message) throws LockingException;
}
