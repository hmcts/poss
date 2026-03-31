/*
 * Created on Mar 18, 2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.test_service.classes;

import java.io.Writer;
import java.io.IOException;
import java.util.Iterator;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

import uk.gov.dca.test_project.common.Reminder;


/**
 * @author PaulR
 */
public class TimedReturn extends AbstractCustomProcessor
{
	public void process(Document inputParameters, Writer output, Log log) throws BusinessException, SystemException
	{
		try {
			// Default to 10 if "seconds" parameter not specified
			int secondsVal = 10;
			Element rootElem = inputParameters.getRootElement();
			
			Iterator itr = (rootElem.getChildren()).iterator();
			while(itr.hasNext())
			{
				Element paramElem = (Element)itr.next();
				String elemAttName = paramElem.getAttributeValue("name");
				if(elemAttName.equals("seconds"))
				{
					String elemText = paramElem.getText();
					secondsVal = Integer.parseInt(elemText);
				}
			}
			
			System.out.println("Waiting for " + secondsVal + " seconds");
			Reminder rem = new Reminder(secondsVal);
			
			while(!rem.getCompleted().equalsIgnoreCase("completed"))
			{
				//do nothing
			}
			
			output.write("<sampleData></sampleData>");
		}
		catch(NumberFormatException nx)
		{
			throw new SystemException("NumberFormatException: " + nx.getMessage(), nx);
	    }
		catch(IOException e)
		{
			throw new SystemException("Unable to write to output: " + e.getMessage(), e);
		}
	}
}
