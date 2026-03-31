/*
 * Created on 05-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.impl.command;

import uk.gov.dca.db.exception.*;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public interface Command {
	public void execute() throws BusinessException, SystemException;
}
