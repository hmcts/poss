/*
 * Created on 23-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.sql;

import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;

public interface StatementFactory {

    Statement getStatement(Document inputXML, IQueryContextReader context) throws SystemException, BusinessException;
    
    boolean isPaged();
}
