/*
 * Created on 27-Oct-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline;

import org.apache.commons.logging.Log;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Generates a lock id from the message using an XPath expression. 
 * 
 * @author JamesB
 */
public class ExpressionBasedLockIdGenerator implements LockIdGenerator {

	/**
	 * Default constructor
	 */
	public ExpressionBasedLockIdGenerator(String xpathExpression) {
		super();
		this.expression = xpathExpression;
	}

	/**
	 * Generate a lock id from the message using an XPath expression.
	 * 
	 * @see uk.gov.dca.db.pipeline.LockIdGenerator#generateLockId(null)
	 */
	public String generateLockId(Element message) throws LockingException {
		Object result = null;
		
		log.debug("Evaluating XPath expression for DOM.  expression = " + expression);
		
		try {
			result = XPath.selectSingleNode(message, expression);
		} catch (JDOMException e) {
			throw new LockingException("Could not apply XPath expression to message '" + expression +"': "+e.getMessage(), e);
		}
		
		if(log.isDebugEnabled()) {
			StringBuffer buffer = new StringBuffer("Result of expression (");
			buffer.append(expression);
			buffer.append(") evaluation: [");
			buffer.append(result);
			buffer.append(']');
			log.debug(buffer.toString());
		}
		
		if((result == null) || (!(result instanceof String))) {
			throw new LockingException("No item selected by expression: " + expression);
		}
		
		return (String) result;
	}
	
	private String expression = null;
	private static final Log log = SUPSLogFactory.getLogger(ExpressionBasedLockIdGenerator.class);

}
