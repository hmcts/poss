package uk.gov.dca.test_project.echo_service.classes;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor2;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * Dumb echo for testing servlet request handling.
 * 
 * @author Nick Lawson
 */
public class Echo extends AbstractCustomProcessor2 {

	public void process(ComponentInput in, ComponentInput out, Log log)
	        throws BusinessException, SystemException {
		
		if (log.isDebugEnabled()) {
			log.debug("process(): input:\"" + in.getData(String.class) + "\"");
		}
		Document doc = (Document)in.getData(Document.class);
		try {
			XPath path = XPath.newInstance("/params/param[@name='echo']/text()");
			String echoText = path.valueOf(doc);
			if (log.isDebugEnabled()) {
				log.debug("process(): echo test:\"" + echoText + "\"");
			}
			if (echoText == null || echoText.length() == 0) {
				throw new BusinessException("echo text is missing or zero length");
			}
			out.setData("<echo>" + echoText.trim() + "</echo>", String.class);
		}
		catch (JDOMException e) {
			//log.error("Error parsing input", e);
			throw new SystemException(e);
		}
	}
}
