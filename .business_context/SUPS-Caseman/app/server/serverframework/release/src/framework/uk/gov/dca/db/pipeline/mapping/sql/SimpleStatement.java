/*
 * Created on 23-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.sql;

import java.util.Collection;
import java.util.Map;

public class SimpleStatement implements Statement {

    private final String m_sql;
    private final Collection m_dependentVariables;
    private Map m_columnAliases;

    public SimpleStatement(String sql, Map columnAliases, Collection dependentVariables) {
        m_sql = sql;
        m_dependentVariables = dependentVariables;
        m_columnAliases = columnAliases;
    }
    
    public String getSQL() {
        return m_sql;
    }

    public Collection getDependentVariables() {
        return m_dependentVariables;
    }

    public Map getColumnAliases() {
        return m_columnAliases;
    }

}
