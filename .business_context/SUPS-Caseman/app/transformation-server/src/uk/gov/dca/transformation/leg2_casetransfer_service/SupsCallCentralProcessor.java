/*
 * Created on 25-Aug-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.transformation.leg2_casetransfer_service;

import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.transformation.common.web_delegator.IWebServiceDelegator;
import uk.gov.dca.transformation.common.web_delegator.impl.WebServiceFactory;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * @author Amjad Khan
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class SupsCallCentralProcessor implements ICustomProcessor {
    //private static final String START_TAG = "<params><param name=\"warrantDetails\">"; //<Obligations>";
    //private static final String END_TAG = "</param></params>";
    
    public void process(Document params, Writer writer, Log log) throws SystemException
	{
                     
        XMLOutputter out = new XMLOutputter(Format.getCompactFormat());
        StringBuffer strBuf = new StringBuffer();
        //strBuf.append(START_TAG);
        strBuf.append(out.outputString(params.getRootElement()));
       // strBuf.append(END_TAG);     
		try {
		    String xml = WebServiceFactory.createWebServiceDelagator(IWebServiceDelegator.CASE_SERVER_NAME, IWebServiceDelegator.CASE_METHOD_NAME).invokeWebService(strBuf.toString());
			log.info("SupsCallCentralProcessor -- XML = " + xml);

	    } catch(Exception e) {
	        throw new SystemException("Exception caught in SupsCallCentralProcessor = " + e.getMessage());
	    }
	}
    
    /* (non-Javadoc)
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#setContext(uk.gov.dca.db.pipeline.IComponentContext)
     */
    public void setContext(IComponentContext context)
    {
        // TODO Auto-generated method stub

    }

}
