package uk.gov.dca.test_project.cases_service.classes;

import java.io.Writer;

import org.apache.commons.logging.Log;
import org.jdom.Document;

import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

public class TestProxyExceptionProcessor extends AbstractCustomProcessor {

    public void process(Document inputParameters, Writer output, Log log) throws BusinessException, SystemException {
        
        SupsLocalServiceProxy proxy = new SupsLocalServiceProxy();
        proxy.getString("ejb/CasesServiceLocal", "throwUpdateLockedLocal", "<params></params>", false);
        
    }
    
    
}
