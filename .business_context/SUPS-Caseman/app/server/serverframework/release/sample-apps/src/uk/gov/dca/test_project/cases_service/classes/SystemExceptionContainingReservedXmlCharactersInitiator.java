package uk.gov.dca.test_project.cases_service.classes;

import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * @author Paul Hardie
 * 
 */
public class SystemExceptionContainingReservedXmlCharactersInitiator extends AbstractCustomProcessor {

	public void process(Document inputParameters, Writer output, Log log)
			throws BusinessException, SystemException {
		throw new SystemException("Reserved xml characters: <>&");
	}
}
