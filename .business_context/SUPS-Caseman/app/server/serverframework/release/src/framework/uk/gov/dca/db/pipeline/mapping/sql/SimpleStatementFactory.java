/*
 * Created on 01-Sep-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.sql;

import java.util.Collection;
import java.util.HashMap;

import org.jdom.Document;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;

public class SimpleStatementFactory implements StatementFactory {

    private final String m_preparedSql;
    private final Collection m_dependentVariables;

    public SimpleStatementFactory(String preparedSql, Collection dependentVariables) {
        m_preparedSql = preparedSql;
        m_dependentVariables = dependentVariables;
    }

    public Statement getStatement(Document inputXML, IQueryContextReader context) throws SystemException {
        return new SimpleStatement(m_preparedSql, new HashMap(), m_dependentVariables);
    }
    
    public String toString() {
        return m_preparedSql;
    }
    
    public boolean isPaged() {
        return false;
    }
    
}
