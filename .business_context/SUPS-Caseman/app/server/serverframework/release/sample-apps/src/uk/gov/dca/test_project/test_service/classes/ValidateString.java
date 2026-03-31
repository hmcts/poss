/*
 * Created on 29-Apr-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.test_service.classes;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class ValidateString extends AbstractCustomProcessor
{
	public ValidateString() { super(); }
	
	public void process(Document inputParameters, Writer output, Log log) throws BusinessException, SystemException
	{
		try
		{
			Element param1 = null;
			Element param2 = null;			
			String field = "";
			String valid = "";
			
			param1 = (Element)XPath.selectSingleNode(inputParameters, "/params/param[@name='field']");
			param2 = (Element)XPath.selectSingleNode(inputParameters, "/params/param[@name='valid']");
			
			if(param1 != null && param2 != null)
			{
				field = param1.getValue();
				valid = param2.getValue();
				
			 	if(field.equals(valid))
			 	{
			 		output.write("<NoError/>");
			 	}
			 	else
			 	{
					output.write("<ErrorCode>");					
					output.write("SampleApps_InvalidServerSideString");
					output.write("<Parameters><Parameter>" + valid + "</Parameter></Parameters>");					
					output.write("</ErrorCode>");
				}
			}
		}
		catch(JDOMException e)
		{
			throw new BusinessException("Failed to retrieve input parameter 'code': "+ e.getMessage(), e);
		}
		catch(IOException e)
		{
			throw new SystemException(e);
		}
	}
}
