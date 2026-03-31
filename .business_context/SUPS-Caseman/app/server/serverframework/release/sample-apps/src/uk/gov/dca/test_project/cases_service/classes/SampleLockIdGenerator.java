/*
 * Created on 04-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.cases_service.classes;

import org.jdom.Element;

import uk.gov.dca.db.pipeline.LockIdGenerator;
import uk.gov.dca.db.pipeline.LockingException;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class SampleLockIdGenerator implements LockIdGenerator {

	/**
	 * 
	 */
	public SampleLockIdGenerator() {
		super();
		// TODO Auto-generated constructor stub
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.LockIdGenerator#generateLockId(org.jdom.Element)
	 */
	public String generateLockId(Element message) throws LockingException {
		return "TestLock";
	}

}
