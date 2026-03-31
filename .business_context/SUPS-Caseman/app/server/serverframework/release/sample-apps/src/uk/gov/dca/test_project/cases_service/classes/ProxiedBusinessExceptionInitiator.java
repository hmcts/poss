/*
 * Created on 18-Jan-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.cases_service.classes;

import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;

/**
 * @author GrantM
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class ProxiedBusinessExceptionInitiator extends AbstractCustomProcessor {

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer, org.apache.commons.logging.Log)
	 */
	public void process(Document inputParameters, Writer output, Log log)
			throws BusinessException, SystemException {
		
		SupsLocalServiceProxy proxy = new SupsLocalServiceProxy();
		proxy.getJDOM("ejb/CasesServiceLocal", "throwBusinessExceptionLocal", "<params/>");

	}

}
