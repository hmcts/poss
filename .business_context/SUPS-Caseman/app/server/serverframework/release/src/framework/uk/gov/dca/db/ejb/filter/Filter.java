/*
 * Created on 06-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.ejb.filter;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.exception.BusinessException;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public interface Filter {
	public void initialise(Element config) throws SystemException;
	
	public Document apply(String userId, Document message) throws BusinessException, SystemException;
}
