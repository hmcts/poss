/*
 * Created on 31-May-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.util.pool;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public interface PooledObjectFactory {
	
	/**
	 * @return
	 * @throws PooledObjectInstantiationException
	 */
	public PooledObject create(ObjectPool pool) throws PooledObjectInstantiationException;

}
