/*
 * Created on 06-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.ejb.filter;

import java.io.IOException;
import java.io.StringReader;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.XMLOutputter;
import uk.gov.dca.db.exception.*;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class UserIdInsertionFilter extends DecoratingFilter {

	/**
	 * Default Constructor
	 */
	public UserIdInsertionFilter() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.ejb.Filter#apply(java.lang.String, java.lang.String)
	 */
	public String execute(String userId, String message) throws BusinessException, SystemException {
		String result = null;
		
		SAXBuilder builder = new SAXBuilder();
		Document doc = null;
		
		try {
			doc = builder.build(new StringReader(message));
		}
		catch(IOException e) {
			throw new FiltrationException("Failed to read filter input: "+e.getMessage(),e);
		}
		catch(JDOMException e) {
			throw new BusinessException("Failed to process filter input: "+e.getMessage(),e);
		}
		
	    Element root = doc.getRootElement();

	    if(!root.getName().equals("params")) {
	    	throw new BusinessException("'" + root.getName() + "' found as root node when 'params' expected");
	    }
	    	
	    // construct a new param element for the user id
	    Element param = new Element("param");
	    param.setAttribute("name", userIdName);
	    param.setText(userId);
	    log.debug("apply(): new element =" + outputter.outputString(param));
	    	
	    // add the new element to the message
	    root.addContent(param);
	    result = outputter.outputString(doc);
	    log.debug("apply(): result = " + result);
		
		return result;
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.ejb.Filter#initialise(org.jdom.Element)
	 */
	protected void init(Element config) throws SystemException {
		userIdName = config.getChildTextNormalize(USER_ID_NAME_ELEMENT_NAME);
	}
	
	private static final String USER_ID_NAME_ELEMENT_NAME = "userIdName";
	private static final Log log = LogFactory.getLog(UserIdInsertionFilter.class);
	
	private String userIdName = null;
	private XMLOutputter outputter = new XMLOutputter();
}
