/*
 * Created on 31-May-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.util.pool;

import java.util.LinkedList;
import java.util.List;

import uk.gov.dca.db.exception.SystemException;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class BasicObjectPool implements ObjectPool {

	/**
	 * 
	 */
	public BasicObjectPool(PooledObjectFactory factory, int minSize, int maxSize) throws SystemException {
		super();
		
		this.factory = factory;
		
		while(poolSize < minSize) {
			enlargePool();
		}
		
		this.maxSize = maxSize;
	}

	/**
	 * @throws InterruptedException
	 * @throws PooledObjectInstantiationException
	 * @see uk.gov.dca.db.util.pool.ObjectPool#borrowObject()
	 */
	public PooledObject borrowObjectOld() throws InterruptedException, PooledObjectInstantiationException {
		PooledObject obj = (PooledObject) objectInUse.get();
	
		if(obj == null) {
			// check out a poolable object from the pool
			synchronized(pool) {
				if(pool.isEmpty()) {
					if(poolSize < maxSize || maxSize == 0) {
						enlargePool();
					}
					else {
						while(pool.isEmpty()) {
							pool.wait();
						}
					}
				}
				obj = (PooledObject) pool.remove(0);
				obj.activate();
				
				objectInUse.set(obj);
			}
		}
		return obj;
	}
	
	public PooledObject borrowObject() throws ObjectPoolException, SystemException {
		PooledObject obj = (PooledObject) objectInUse.get();
	
		if(obj == null) {
			// check out a poolable object from the pool
			synchronized(pool) {
				// get next ticket
				int ticket = ticketServer.takeTicket();
				
				obj = getValidObjectFromPool(ticket);
				
				obj.activate();
				
				objectInUse.set(obj);
				ticketServer.finishServing();
			}
		}
		return obj;
	}

	/**
	 * @see uk.gov.dca.db.util.pool.ObjectPool#returnObject(uk.gov.dca.db.util.pool.PooledObject)
	 */
	public void returnObjectOld(PooledObject obj) {
		synchronized(pool) {
			if(pool.isEmpty()) {
				pool.notify();
			}
			// passivate the object
			obj.passivate();
			pool.add(obj);
			objectInUse.set(null);
		}
	}
	
	/**
	 * 
	 * @param obj
	 */
	public void returnObject(PooledObject obj) {
		Object inUse = objectInUse.get();
	
		if(inUse != null && obj == inUse) {			
			synchronized(pool) {
				if(pool.isEmpty()) {
					pool.notifyAll();
				}
				// passivate the object
				obj.passivate();
				pool.add(obj);
				objectInUse.set(null);
			}
		}
	}
	
	/**
	 * 
	 * @param ticket
	 * @return
	 * @throws InterruptedException
	 */
	private PooledObject getValidObjectFromPool(int ticket) throws ObjectPoolException, SystemException {
		if(pool.isEmpty()) {
			if(poolSize < maxSize || maxSize == 0) {
				enlargePool();
			}
			else {
				while(ticket != ticketServer.getCurrentlyServing()) {
					try {
						pool.wait();
					}
					catch(InterruptedException e) {
						throw new ObjectPoolException("Interrupted whilst waiting for object to become available", e);
					}
				}
			}
		}

		PooledObject obj = (PooledObject) pool.remove(0);
			
		if(!obj.isValid()) {
			obj.destroy();
			obj = factory.create(this);
		}
		
		return obj;
	}
	
	/**
	 * @throws PooledObjectInstantiationException
	 * 
	 *
	 */
	private void enlargePool() throws PooledObjectInstantiationException {
		pool.add(factory.create(this));
		poolSize++;
	}
	
	/**
	 * Internal class mimicking the service at a supermarket delicatessan counter.  Clients/customers
	 * take a ticket and wait for the number on the ticket to be displayed on the "now serving" sign.  
	 * As a new assistant becomes available (finishes dealing with a previous customer) the number on 
	 * the "now serving" sign is incremented.
	 * 
	 * @author JamesB
	 *
	 * TODO To change the template for this generated type comment go to
	 * Window - Preferences - Java - Code Style - Code Templates
	 */
	private class DeliCounter {
		public int takeTicket() {
			if(ticket == MAX_TICKET_SIZE) {
				ticket = 0;
			}
			else {
				ticket ++;
			}
			
			return ticket;
		}
		
		public void finishServing() {
			if(currentlyServing == MAX_TICKET_SIZE) {
				currentlyServing = 0;
			}
			else {
				currentlyServing++;
			}
		}
		
		public int getCurrentlyServing() {
			return currentlyServing;
		}
		
		private int ticket = 0;
		private int currentlyServing = 0;
		private int MAX_TICKET_SIZE = 10000;
	}
	
	private List pool = new LinkedList();
	private ThreadLocal objectInUse = new ThreadLocal();
	
	private PooledObjectFactory factory = null;
	private DeliCounter ticketServer = new DeliCounter();
	
	private int poolSize = 0;
	private int maxSize = 0;
}
