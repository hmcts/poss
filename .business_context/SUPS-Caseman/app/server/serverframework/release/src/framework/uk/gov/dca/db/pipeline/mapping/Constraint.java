/*
 * Created on 22-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.regex.Matcher;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ICondition;
import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;
import uk.gov.dca.db.pipeline.Query;
import uk.gov.dca.db.pipeline.XPathCondition;
import uk.gov.dca.db.pipeline.mapping.sql.SimpleStatement;
import uk.gov.dca.db.pipeline.mapping.sql.Statement;
import uk.gov.dca.db.pipeline.mapping.sql.StatementFactory;
import uk.gov.dca.db.util.ClassUtil;

/**
 * Class used to represent a "where" clause constraint
 * @author GrantM
 *
 */
public class Constraint implements StatementFactory {
    
    // the raw constraint clause:
    private String m_clause = null;
    // the clause with parameterised variables removed:
    private String m_preparedClause = null;
    // there may be zero or 1 parameterised variables associated with the constraint:
    private List m_parameters = new LinkedList();
    //private String m_parameterName = null; 
    // parameter flag:
    private boolean m_hasParameter = false;
    // the condition (if any):
    private ICondition m_condition = null;
    // the dynamic sql generator (optional):
    private ISQLGenerator m_sqlGenerator = null;
    
    /**
     * Initialises the constraint
     * @param constraintSpec
     * @throws SystemException
     */
    public Constraint(Element constraintSpec) 
        throws SystemException
    {
        if ( constraintSpec != null ) 
        {
            // first see if a dynaimc sql generator is specified
            String generatorClass = constraintSpec.getAttributeValue("generator");
            if (generatorClass != null && generatorClass.length() > 0) {
                try {
                    Class generatorClazz = ClassUtil.loadClass( generatorClass );
                    m_sqlGenerator = (ISQLGenerator)generatorClazz.newInstance();
                }
                catch(ClassNotFoundException e){
                    throw new ConfigurationException("Unable to instantiate SQL Generator '"+generatorClass+"': "+e.getMessage(),e);
                }
                catch(IllegalAccessException e){
                    throw new SystemException("Unable to instantiate SQL Generator '"+generatorClass+"': "+e.getMessage(),e);
                }
                catch(InstantiationException e){
                    throw new SystemException("Unable to instantiate SQL Generator '"+generatorClass+"': "+e.getMessage(),e);
                }
                
                if (m_sqlGenerator == null) {
                    throw new ConfigurationException("Invalid SQL Generator specified for constraint: "+generatorClass);
                }
                m_sqlGenerator.initialise(constraintSpec);
            }
            
            // if not, then look for a clause
            if ( m_sqlGenerator == null ) {
                m_clause = constraintSpec.getText();
                if ( m_clause == null || m_clause.length() == 0 ) {
                    throw new ConfigurationException("Zero length constraint clause");
                }
                
                // extract a parameter from the clause
                Matcher vars = Query.s_variablePattern.matcher(m_clause);
                while (vars.find()) {
                    m_parameters.add(vars.group(1).toUpperCase());
                }
                
                if ( m_parameters.size() > 0 ) {
                    m_hasParameter = true;
                }
                
                // parameterise the parameter for SQL querying
                m_preparedClause = vars.replaceAll("?");
            }
            
            // see if there is a condition
            String conditionClause = constraintSpec.getAttributeValue("condition");
            if (conditionClause != null && conditionClause.length() > 0) {
                m_condition = new XPathCondition();
                m_condition.initialise(conditionClause, constraintSpec);
            }
        }

    }
    
    /**
     * Returns the condition, or null if none
     * @return
     */
    public ICondition getCondition() {
        return m_condition;
    }
    
    /**
     * Returns the generator, or null if none
     * @return
     */
    public ISQLGenerator getSQLGenerator() {
        return m_sqlGenerator;
    }
    
    /**
     * Returns the constraint clause, ready for using in a sql prepared statement
     * @return
     */
    public String getPreparedClause(Document inputXML, IQueryContextReader context) 
        throws BusinessException, SystemException
    {
        String preparedClause = null;
        if ( m_sqlGenerator != null )
            preparedClause = m_sqlGenerator.generate(inputXML, context);
        else
            preparedClause = m_preparedClause;
        
        return preparedClause;
    }
    
    public Statement getStatement(Document inputXML, IQueryContextReader context)
            throws BusinessException, SystemException {
        
        String preparedClause = null;
        if ( m_sqlGenerator != null ) {
                preparedClause = m_sqlGenerator.generate(inputXML, context);
        }
        else {
            preparedClause = m_preparedClause;
        }
        return new SimpleStatement(preparedClause, new HashMap(), m_parameters);
    }
    
    
    /**
     * Returns whether or not there is a parameter
     * @return
     */
    public boolean hasParameter() {
        return m_hasParameter;
    }
    
    /**
     * Returns the constraint's parameters
     * @return
     */
    public List getParameters() {
        return m_parameters;
    }
    
    public String toString() {
        return m_clause;
    }

    public boolean isPaged() {
        // TODO Auto-generated method stub
        return false;
    }
}