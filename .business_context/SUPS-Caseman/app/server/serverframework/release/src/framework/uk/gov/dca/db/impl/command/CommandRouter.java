/*
 * Created on 05-Nov-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.impl.command;

import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.*;

/**
 * Responsible for the routing of commands to appropriate components to process them.
 * 
 * @author JamesB
 */
public class CommandRouter {

	/**
	 * constructor
	 */
	public CommandRouter() {
		super();
	}
	
	public void route(Command command) throws BusinessException, SystemException {
		CommandProcessor processor = (CommandProcessor) locator.getService(CommandProcessor.class);
		processor.processImmediate(command);
	}
	
	private ServiceLocator locator = ServiceLocator.getInstance();
}
