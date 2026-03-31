/*
 * Created on 26-Oct-2004
 *
 */
package uk.gov.dca.test_project.cases_service.classes;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor2;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;
import uk.gov.dca.db.exception.*;

import uk.gov.dca.db.ejb.SupsLocalServiceProxy2;

/**
 * @author GrantM
 *
 */
public class GetCaseLocalProxy extends AbstractCustomProcessor2 {

	public GetCaseLocalProxy() {
		super();
	}

	/**
	 * New style call example
	 */
	public void process(ComponentInput inputHolder, ComponentInput outputHolder, Log log)
		throws BusinessException, SystemException
	{
		Document inputParameters = (Document)inputHolder.getData(Document.class);
		
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
		
		// do the call
		SupsLocalServiceProxy2 proxy = new SupsLocalServiceProxy2();
		ComponentInput proxiedInputHolder = new ComponentInput(this.m_context.getInputConverterFactory());
		proxiedInputHolder.setData(proxiedInputDoc, Document.class);
		
		// NOTE: output goes direct to the calling components' output
		proxy.invoke("ejb/CasesServiceLocal", eProxiedMethod.getValue()+"Local2",
				this.m_context, proxiedInputHolder, outputHolder );
	}
}
