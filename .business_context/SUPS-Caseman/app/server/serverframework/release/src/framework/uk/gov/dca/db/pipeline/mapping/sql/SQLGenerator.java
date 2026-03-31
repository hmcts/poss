/*
 * Created on 19-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.sql;

import java.text.FieldPosition;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ICondition;
import uk.gov.dca.db.pipeline.IQueryContextReader;
import uk.gov.dca.db.pipeline.ISQLGenerator;
import uk.gov.dca.db.pipeline.Table;
import uk.gov.dca.db.pipeline.mapping.Constraint;
import uk.gov.dca.db.pipeline.mapping.PivotConfig;
import uk.gov.dca.db.pipeline.mapping.Variable;
import uk.gov.dca.db.pipeline.mapping.output.Context;
import uk.gov.dca.db.pipeline.mapping.select.PageController;

/**
 * Reusable SQL Generation class.
 * 
 * @author Michael Barker
 *
 */
public class SQLGenerator implements StatementFactory, Paged {

    private final Collection m_variables;
    private final Map m_tables;
    private final Set m_aliases;
    private final Collection m_joins;
    private final Collection m_constraints;
    private final String m_sql;
    private final Collection m_dependentVariables;
    private final boolean m_requireSCNs;
    private final Collection m_dynamicJoins;
    private final Map m_columnAliases = new HashMap();
    private final PivotConfig m_config;
    
    private final static String PAGED_SQL = "SELECT {0} FROM ( SELECT {7} {1} ROW_NUMBER() OVER ( ORDER BY {2} ) AS R, {3} FROM {4} {5} {6} ) WHERE R<? AND R>?";
    private final static String STANDARD_SQL = "SELECT {5} {0} {1} FROM {2} {3} {4}";
    private static final int MAX_IDENTIFIER_LENGTH = 30;
    
    public SQLGenerator(Set variables, Set aliases, Map tables, 
            Collection joins, Collection dynamicJoins, 
            Collection dependentVariables, Collection constraints, 
            boolean requireSCNs, PivotConfig config) throws SystemException, BusinessException {
        
        m_variables = variables;
        m_aliases = aliases;
        m_tables = tables;
        m_joins = joins;
        m_dynamicJoins = dynamicJoins;
        m_constraints = constraints;
        // We need to copy the dependent variables at this point.
        m_dependentVariables = new ArrayList();
        m_dependentVariables.addAll(dependentVariables);
        m_requireSCNs = requireSCNs;
        m_config = config;
        
        if (isStatic()) {
            m_sql = generateSQL(new Document(), new Context(), m_dependentVariables, m_columnAliases);
        }
        else {
            m_sql = null;
        }
    }
    
    /**
     * Determines whether the supplied constraints are all static or not.  If 
     * they are it will preprocess all of the sql.
     * 
     * @return
     */
    private boolean isStatic() {
        
        if (m_dynamicJoins.size() == 0) {
            for (Iterator i = m_constraints.iterator(); i.hasNext();) {
                Constraint c = (Constraint) i.next();
                if (c.getSQLGenerator() != null || c.getCondition() != null) {
                    return false;
                }
            }
            return true;            
        }
        else {
            return false;
        }
    }
    
    /**
     * Creates the statement object for this
     * 
     * @throws BusinessException 
     */
    public Statement getStatement(Document inputXML, IQueryContextReader context) throws SystemException, BusinessException {
        if (m_sql != null) {
            return new SimpleStatement(m_sql, m_columnAliases, m_dependentVariables);
        }
        else {
            List dependentVariables = new ArrayList();
            dependentVariables.addAll(m_dependentVariables);
            Map columnAliases = new HashMap();
            String sql = generateSQL(inputXML, context, dependentVariables, columnAliases);
            return new SimpleStatement(sql, columnAliases, dependentVariables);
        }
    }
    
    public boolean isPaged() {
        return m_config.getPageController() != null;
    }
    
    public int getPageNumber(IQueryContextReader context) throws NumberFormatException, SystemException {
        if (isPaged()) {
            return m_config.getPageController().getPageNumber(context);
        }
        else {
            throw new SystemException("Generator does not handle paging");
        }
    }

    public int getPageSize(IQueryContextReader context) throws NumberFormatException, SystemException {
        if (isPaged()) {
            return m_config.getPageController().getPageSize(context);
        }
        else {
            throw new SystemException("Generator does not handle paging");
        }
    }
    
    /**
     * Gets the select clause for standard queries.
     * 
     * @param variables
     * @param aliases
     * @param tables
     * @return
     */
    public StringBuffer getSelect(Collection variables, Collection aliases, Map tables, boolean requireSCNs, Map columnAliases) {
        
        StringBuffer selectB = new StringBuffer();
        
        for (Iterator i = variables.iterator(); i.hasNext();) {
            Variable variable = (Variable) i.next();
            String select = variable.getSelect();
            String name = variable.getName();
            selectB.append(select);
            selectB.append(" AS \"");
            
            if (useColumnAlias(name)) {
                String aliasedName = getColumnAlias(name, columnAliases.size());
                selectB.append(aliasedName);
                columnAliases.put(aliasedName, name);
            }
            else {
                selectB.append(name);
            }
            
            selectB.append("\"");
            if (i.hasNext()) {
                selectB.append(", ");
            }
        }
        
        for (Iterator i = aliases.iterator(); i.hasNext();) {
            Variable variable = (Variable) i.next();
            selectB.append(", ");
            selectB.append(variable.toSQL());
        }
        
        for (Iterator i = tables.values().iterator(); i.hasNext();) {
            Table t = (Table) i.next();
            String alias = t.getAlias();
            
            if (requireSCNs) {
                selectB.append(", ");
                selectB.append(alias);
                selectB.append(".");
                selectB.append("ORA_ROWSCN");
                selectB.append(" AS \"");
                selectB.append(alias);
                selectB.append("_ORA_ROWSCN\"");
            }
        }            
        
        return selectB;
    }
    
    
    public boolean useColumnAlias(String name) {
        return name.length() > MAX_IDENTIFIER_LENGTH;
    }
    
    public String getColumnAlias(String name, int num) {
        
        String val = String.valueOf(num);
        
        switch (val.length()) {
        case 4:
            throw new RuntimeException("Limited to 999 aliased columns");
        case 2:
            val = "$0" + val;
            break;
        case 1:
            val = "$00" + val;
            break;
        default:
            val = "$" + val;
        }
        
        return name.substring(0, MAX_IDENTIFIER_LENGTH - val.length()) + val;

    }
    
    
    /**
     * Gets the outer select for a paged query.
     * 
     * @param variables
     * @param aliases
     * @param tables
     * @param requireSCNs
     * @return
     */
    public StringBuffer getPagedOuterSelect(Collection variables, Collection aliases, Map tables, boolean requireSCNs, Map columnAliases, Map reverseMap) {
        
        StringBuffer selectB = new StringBuffer();
        
        for (Iterator i = variables.iterator(); i.hasNext();) {
            Variable variable = (Variable) i.next();
            String name = variable.getName();
            if (useColumnAlias(name)) {
                String aliasedName = getColumnAlias(name, columnAliases.size());
                selectB.append(aliasedName.replace('.', '_'));
                selectB.append(" AS \"");
                selectB.append(aliasedName);
                selectB.append("\"");
                columnAliases.put(aliasedName, name);
                reverseMap.put(name, aliasedName);
            }
            else {
                selectB.append(name.replace('.', '_'));
                selectB.append(" AS \"");
                selectB.append(name);
                selectB.append("\"");
            }
            if (i.hasNext()) {
                selectB.append(", ");
            }
        }
        
        for (Iterator i = aliases.iterator(); i.hasNext();) {
            Variable variable = (Variable) i.next();
            selectB.append(", ");
            String name = variable.getName();
            selectB.append(name.replace('.', '_'));
            selectB.append(" AS \"");
            selectB.append(name);                
            selectB.append("\"");
        }
        
        for (Iterator i = tables.values().iterator(); i.hasNext();) {
            Table t = (Table) i.next();
            String alias = t.getAlias();
            
            if (requireSCNs) {
                selectB.append(", ");
                selectB.append(alias);
                selectB.append("_");
                selectB.append("ORA_ROWSCN");
            }
        }            
        
        return selectB;
    }
    
    /**
     * Gets the inner select for a paged query.
     * 
     * @param variables
     * @param aliases
     * @param tables
     * @param requireSCNs
     * @return
     */
    public StringBuffer getPagedInnerSelect(Collection variables, Collection aliases, Map tables, boolean requireSCNs, Map reverseMap) {
        
        StringBuffer selectB = new StringBuffer();
        
        for (Iterator i = variables.iterator(); i.hasNext();) {
            
            Variable variable = (Variable) i.next();
            String select = variable.getSelect();
            String name = variable.getName();
            selectB.append(select);
            selectB.append(" AS \"");
            
            if (reverseMap.containsKey(name)) {
                String aliasedName = (String) reverseMap.get(name);
                selectB.append(aliasedName.replace('.', '_'));
            }
            else {
                selectB.append(name.replace('.', '_'));
            }
            
            //selectB.append(name.replace('.', '_'));
            selectB.append("\"");
            
            if (i.hasNext()) {
                selectB.append(", ");
            }
        }
        
        for (Iterator i = aliases.iterator(); i.hasNext();) {
            selectB.append(", ");
            
            Variable variable = (Variable) i.next();
            String select = variable.getSelect();
            String name = variable.getName();
            selectB.append(select);
            selectB.append(" AS \"");
            selectB.append(name.replace('.', '_'));
            selectB.append("\"");
        }
        
        if (requireSCNs) {
            for (Iterator i = tables.values().iterator(); i.hasNext();) {
                Table t = (Table) i.next();
                String alias = t.getAlias();
                
                selectB.append(", ");
                selectB.append(alias);
                selectB.append(".");
                selectB.append("ORA_ROWSCN");
                selectB.append(" AS \"");
                selectB.append(alias);
                selectB.append("_ORA_ROWSCN\"");
            }            
        }
        
        return selectB;
    }
    
    
    /**
     * Gets the from clause from the supplied tables.
     * 
     * @param tables
     * @return
     */
    public StringBuffer getFrom(Map tables) {
        
        StringBuffer fromB = new StringBuffer();
        
        for (Iterator i = m_tables.values().iterator(); i.hasNext();) {
            Table t = (Table) i.next();
            String alias = t.getAlias();
            
            fromB.append(t.getName());
            fromB.append(" ");
            fromB.append(alias);
            if (i.hasNext()) {
                fromB.append(", ");
            }
        }         
        
        return fromB;
    }
    
    
    /**
     * Generates the all important where clause.
     * 
     * @param joins
     * @param dynamicJoins
     * @param constraints
     * @param inputXML
     * @param context
     * @param dependentVariables
     * @return
     * @throws BusinessException
     * @throws SystemException
     */
    public StringBuffer getWhere(Collection joins, Collection dynamicJoins, Collection constraints, 
            Document inputXML, IQueryContextReader context, Collection dependentVariables) throws BusinessException, SystemException {
        
        StringBuffer whereB = new StringBuffer();

        // Get all of the non null joins into a list.
        Collection clauses = new ArrayList();
        
        for (Iterator i = joins.iterator(); i.hasNext();) {
            String join = (String) i.next();
            if (join != null && join.trim().length() > 0) {
                clauses.add(join);                            
            }
        }
        
        for (Iterator i = dynamicJoins.iterator(); i.hasNext();) {
            Class generatorClass = (Class) i.next();
            ISQLGenerator gen;
            try {
                gen = (ISQLGenerator) generatorClass.newInstance();
            }
            catch (InstantiationException e) {
                throw new SystemException(e);
            }
            catch (IllegalAccessException e) {
                throw new SystemException(e);
            }
            
            String sql = gen.generate(inputXML, context);
            if (sql != null && sql.trim().length() > 0) {
                clauses.add(sql);
            }
        }
                
        for (Iterator i = constraints.iterator(); i.hasNext();) {
            Constraint constraint = (Constraint) i.next();
            ICondition condition = constraint.getCondition();
            if (condition == null || condition.evaluate(inputXML.getRootElement())) {
                Statement st = constraint.getStatement(inputXML, context);
                dependentVariables.addAll(st.getDependentVariables());
                String sql = st.getSQL();
                if (sql != null && sql.trim().length() > 0) {
                    clauses.add(sql);
                }            	
            }
        }
        
        if (clauses.size() > 0) {
            whereB.append("WHERE ");
        }
        
        for (Iterator i = clauses.iterator(); i.hasNext();) {
            String clause = (String) i.next();
            whereB.append("(");
            whereB.append(clause);
            whereB.append(")");
            if (i.hasNext()) {
                whereB.append(" AND ");
            }
        }
        
        return whereB;
        
    }
    
    public String getHint() {
    	if (m_config.getHint() == null) {
    		return "";
    	}
    	else {
    		return "/*+ " + m_config.getHint() + "*/";
    	}
    }
    
    
    /**
     * Does the actual SQL generation.
     * 
     * @param inputXML
     * @param context
     * @param dependentVariables
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String generateSQL(Document inputXML, IQueryContextReader context, Collection dependentVariables, Map columnAliases) throws SystemException, BusinessException {
        
        String distinct = m_config.isSelectDistinct() ? "DISTINCT" : "";
        StringBuffer fromB = getFrom(m_tables);
        StringBuffer whereB = getWhere(m_joins, m_dynamicJoins, m_constraints, inputXML, context, dependentVariables);
        
        StringBuffer orderByB = new StringBuffer();
        if (!isEmpty(m_config.getOrderBy())) {
            orderByB.append(" ORDER BY ");
            orderByB.append(m_config.getOrderBy());
        }

        StringBuffer sqlB = new StringBuffer();
        
        if (!isPaged()) {
            MessageFormat format = new MessageFormat(STANDARD_SQL);
            StringBuffer selectB = getSelect(m_variables, m_aliases, m_tables, m_requireSCNs, columnAliases);
            Object[] params = {
                    distinct,
                    selectB,
                    fromB,
                    whereB,
                    orderByB,
                    getHint()
            };
            format.format(params, sqlB, new FieldPosition(0));
        }
        else {
            String pagedOrder = isEmpty(m_config.getOrderBy()) ? "ROWNUM" : m_config.getOrderBy();
            MessageFormat format = new MessageFormat(PAGED_SQL);
            HashMap reverseMap = new HashMap();
            StringBuffer outerSelectB = getPagedOuterSelect(m_variables, m_aliases, m_tables, m_requireSCNs, columnAliases, reverseMap);
            StringBuffer innerSelectB = getPagedInnerSelect(m_variables, m_aliases, m_tables, m_requireSCNs, reverseMap);
            Object[] params = {
                    outerSelectB,
                    distinct,
                    pagedOrder,
                    innerSelectB,
                    fromB,
                    whereB,
                    orderByB,
                    getHint()
            };
            format.format(params, sqlB, new FieldPosition(0));
        }
        
        return sqlB.toString();
    }
    
    public static boolean isEmpty(String s) {
        return s == null || s.trim().length() == 0;
    }
    
    /**
     * Creates an SQL Generator with a single string join.
     * 
     * @param variables
     * @param aliases
     * @param tables
     * @param join
     * @param dependentVariables
     * @param constraints
     * @param orderBy
     * @param requireSCNs
     * @return
     * @throws SystemException
     * @throws BusinessException 
     */
    public static SQLGenerator create(Set variables, Set aliases, Map tables, 
            String join, Collection dependentVariables, 
            Collection constraints, boolean requireSCNs, PivotConfig config) throws SystemException, BusinessException {
        
        List joins = new ArrayList();
        if (!isEmpty(join)) {
            joins.add(join);
        }
        
        return new SQLGenerator(variables, aliases, 
                tables, joins, new ArrayList(0), 
                dependentVariables, constraints,
                requireSCNs, config);
    }

    /**
     * 
     * @param variables
     * @param aliases
     * @param tables
     * @param joins
     * @param dependentVariables
     * @param constraints
     * @param orderBy
     * @param requireSCNs
     * @return
     * @throws SystemException
     * @throws BusinessException 
     */
    public static SQLGenerator create(Set variables, Set aliases, Map tables, 
            Collection joins, Collection dependentVariables, 
            Collection constraints, boolean requireSCNs, PivotConfig config) throws SystemException, BusinessException {
                
        return new SQLGenerator(variables, aliases, 
                tables, joins, new ArrayList(0), 
                dependentVariables, constraints, 
                requireSCNs, config);
    }
    
    public static SQLGenerator create(Set variables, Set aliases, Map tables, 
            Class generatorClass, Collection dependentVariables, 
            Collection constraints, boolean requireSCNs, PivotConfig config) throws SystemException, BusinessException {
        
        List dynamicJoins = new ArrayList(1);
        dynamicJoins.add(generatorClass);
        
        return new SQLGenerator(variables, aliases, 
                tables, new ArrayList(0), dynamicJoins,
                dependentVariables, constraints, 
                requireSCNs, config);
    }
    
    public static SQLGenerator create(Set variables, Set aliases, Map tables, 
            Collection joins, Collection dynamicJoins, Collection dependentVariables, 
            Collection constraints, boolean requireSCNs, PivotConfig config) throws SystemException, BusinessException {
        
        return new SQLGenerator(variables, aliases, 
                tables, joins, dynamicJoins,
                dependentVariables, constraints, 
                requireSCNs, config);
    }

}
