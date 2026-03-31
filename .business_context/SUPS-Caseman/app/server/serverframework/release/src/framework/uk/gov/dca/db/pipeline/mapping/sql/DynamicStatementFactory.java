/*
 * Created on 01-Sep-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.sql;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;

/**
 * Statement Factory for dynamic sql statements.
 * 
 * @author Michael Barker
 *
 */
public class DynamicStatementFactory implements StatementFactory {

    private final Class m_generatorClass;

    public DynamicStatementFactory(Class generatorClass) {
        m_generatorClass = generatorClass;
    }

    public Statement getStatement(Document inputXML, IQueryContextReader context) throws SystemException, BusinessException {
        
        ISQLGenerator gen;
        try {
            gen = (ISQLGenerator) m_generatorClass.newInstance();
            Collection parameters = new ArrayList();
            String sql = gen.generate(inputXML, context);
            String preparedSQL = SQLUtil.prepareSQL(sql, parameters);
            return new SimpleStatement(preparedSQL, new HashMap(), parameters);
        }
        catch (InstantiationException e) {
            throw new SystemException("Unable to create SQL Generator: " + m_generatorClass.getName(), e);
        }
        catch (IllegalAccessException e) {
            throw new SystemException("Unable to create SQL Generator: " + m_generatorClass.getName(), e);
        }
    }
    
    public boolean isPaged() {
        return false;
    }
    
}
