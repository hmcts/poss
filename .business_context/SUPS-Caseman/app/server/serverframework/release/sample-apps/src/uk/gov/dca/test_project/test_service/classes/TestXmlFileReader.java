/*
 * Created on 18-Jan-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.test_service.classes;

import java.io.IOException;
import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class TestXmlFileReader extends AbstractCustomProcessor {

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer, org.apache.commons.logging.Log)
	 */
	public void process(Document inputParameters, Writer output, Log log)
			throws BusinessException, SystemException {
		try {
			output.write("<sampleData><a>HelloTestWebServiceFromAlan</a></sampleData>");
		}
		catch( IOException e) {
			throw new SystemException("Unable to write to output: " +e.getMessage(), e);
		}
	}

}
