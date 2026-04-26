/*
 * Created on 31-May-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.util.pool;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public interface PooledObject {

	/**
	 * @param obj
	 */
	public void activate();

	/**
	 * @param obj
	 */
	public void passivate();

	/**
	 * @param obj
	 * @return
	 */
	public boolean isValid();
	
	/**
	 * @param obj
	 * @throws SystemException
	 */
	public void destroy() throws SystemException;
}
