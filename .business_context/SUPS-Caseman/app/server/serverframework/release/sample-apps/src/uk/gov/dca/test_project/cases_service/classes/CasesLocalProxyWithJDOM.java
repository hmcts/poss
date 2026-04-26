/*
 * Created on 26-Oct-2004
 *
 */
package uk.gov.dca.test_project.cases_service.classes;

import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.exception.*;
import java.io.IOException;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy2;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * @author GrantM
 *
 */
public class CasesLocalProxyWithJDOM extends AbstractCustomProcessor {
	
	public CasesLocalProxyWithJDOM() {
		super();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer, org.apache.commons.logging.Log)
	 */
	public void process(Document inputParameters, Writer output, Log log)
		throws BusinessException, SystemException
	{
		Element eProxiedMethod = null;
		Element eProxiedInput = null;
		
		try {
			eProxiedMethod = (Element)XPath.selectSingleNode(inputParameters, "/params/param[@name='method']");
			eProxiedInput = (Element)XPath.selectSingleNode(inputParameters, "/params/param[@name='input']");
		}
		catch(JDOMException e){
			throw new BusinessException("Failed to retrieve input parameter: "+e.getMessage(),e);
		}
		
		Document proxiedInputDoc = new Document();
		Element eProxiedParams = eProxiedInput.getChild("params");
		eProxiedParams.detach();
		proxiedInputDoc.setRootElement(eProxiedParams);
		
		XMLOutputter outputter = new XMLOutputter();
		
		log.debug("Input to " + eProxiedMethod.getValue()+"Local2: \r\n"+outputter.outputString(proxiedInputDoc));
		
		SupsLocalServiceProxy2 proxy = new SupsLocalServiceProxy2();
		
		ComponentInput inputHolder = new ComponentInput(this.m_context.getInputConverterFactory());
		inputHolder.setData(proxiedInputDoc, Document.class);
		ComponentInput outputHolder = new ComponentInput(this.m_context.getInputConverterFactory());
		
		proxy.invoke("ejb/CasesServiceLocal", eProxiedMethod.getValue()+"Local2",
				this.m_context, inputHolder, outputHolder );
		
		Document doc = (Document)outputHolder.getData(Document.class);
		
		try {
			if (doc == null)
			{
				output.write("<NoResults/>");
			}
			else
			{
				output.write(outputter.outputString(doc.getRootElement()));
			}
		}
		catch (IOException e){
			throw new SystemException("Unable to write to output: " + e.getMessage(),e);
		}
	}
}
