package uk.gov.dca.test_project.cases_service.classes;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;
import uk.gov.dca.db.exception.BusinessException;

/**
 * See framework defect D1102 - BusinessException thrown by ISQLGenerator
 * is wrapped in a SystemException.
 * 
 * @author Nick Lawson
 */
public class D1102SQLGenerator implements ISQLGenerator {

	public D1102SQLGenerator() {
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ISQLGenerator#initialise(org.jdom.Element)
	 */
	public void initialise(Element generateConfig) {
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ISQLGenerator#generate(org.jdom.Document, uk.gov.dca.db.pipeline.IQueryContextReader)
	 */
	public String generate(Document inputXML, IQueryContextReader context)
			throws BusinessException {
		throw new BusinessException("D1102SQLGenerator");
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#clone()
	 */
	public Object clone() {
		return this;
	}
}
