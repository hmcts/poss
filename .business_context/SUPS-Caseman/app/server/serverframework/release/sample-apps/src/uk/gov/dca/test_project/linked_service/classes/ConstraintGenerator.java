package uk.gov.dca.test_project.linked_service.classes;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;

public class ConstraintGenerator implements ISQLGenerator {

	public void initialise(Element generateConfig) throws SystemException {
		// TODO Auto-generated method stub

	}

	public String generate(Document inputXML, IQueryContextReader context)
			throws BusinessException, SystemException {
		
		String caseNumber = (String) context.getValue("param.caseNumber");
		if (caseNumber == null) {
			throw new BusinessException("param.caseNumber is not defined");
		}
		return "c.case_number = '" + caseNumber + "'";
		
	}

	public Object clone() {
        return new JoinGenerator();
    }

}
