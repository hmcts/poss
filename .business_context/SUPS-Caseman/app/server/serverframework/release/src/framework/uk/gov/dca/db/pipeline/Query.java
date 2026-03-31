package uk.gov.dca.db.pipeline;

import java.math.BigInteger;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.DataFormatException;

import org.apache.commons.logging.Log;
import org.jdom.Attribute;
import org.jdom.CDATA;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Text;
import org.jdom.filter.ContentFilter;
import org.jdom.filter.Filter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.query.sql.SQLStatement;
import uk.gov.dca.db.pipeline.query.sql.SQLStatementFactory;
import uk.gov.dca.db.pipeline.query.sql.StatementType;
import uk.gov.dca.db.queryengine.QueryEngineException;
import uk.gov.dca.db.util.ClassUtil;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Contains information describing a particular query within a query definition
 * template.
 * 
 * @author Howard Henson
 */
public class Query {

	public static final String SQL_ELEMENT_NAME = "SQL";
    
    private static final Log log = SUPSLogFactory.getLogger(Query.class);
    private static final Pattern s_listPattern = Pattern.compile("\\b(\\w+)\\b");
    public static final Pattern s_variablePattern = Pattern.compile("\\$\\{([^}]+)\\}");
    public static final Pattern s_varContentPattern = Pattern.compile("\\b(\\w+)\\.(\\w+)\\b");
    private static final Filter s_contentFilter = 
    	new ContentFilter(ContentFilter.CDATA | ContentFilter.ELEMENT | ContentFilter.TEXT);
    
    private QueryDefinitions m_queryDefinitions = null;
    private Map m_childQueries = new TreeMap();
	
    private String m_pivotNode = null;
    private String m_join = null;
    private String m_orderBy = null;
    private String m_queryJoin = null;
    private boolean m_selectDistinct = false;
    private Map m_tables = new TreeMap();
    private List m_tableList = new LinkedList();
    private Set m_parameters = new TreeSet();
    private Map m_typeMap = new TreeMap();
    private Set m_selectVariables = new TreeSet();
    private ModifyVariables m_modifyVariables = new ModifyVariables();
    private Set m_childPivotNodes = new HashSet();
    private Set m_dependentVariables = new HashSet();
    private List m_joinOrderDependentVariables = new LinkedList();
    private List m_constraints = new LinkedList();
    private List m_constraintOrderDependentVariables = new LinkedList();
    private Map m_existanceMap = new HashMap();
    private boolean m_notModifiable = false;
    private Map m_aliasPropertyMap = new HashMap();
    private Map m_staticPropertyMap = new TreeMap();
    private Map m_sequencePropertyMap = new HashMap();
    private List m_unboundProperties = new LinkedList();
	private List m_subQueryOrder = new LinkedList();
    private List m_subQueriesOrdered = new LinkedList();
    private Set m_aliases = new HashSet();
    
    private SQLStatement selectStatement = null;
    private Map modifySqlStatements = new HashMap();
    private PageController m_pageController = null;
  
    /*
    private String selectStatement = null;
    private ISQLGenerator selectStatementGenerator = null;
    private Map updateStatements = new TreeMap();
    private Map insertStatements = new TreeMap();
    private Map deleteStatements = new TreeMap();
    private Map existenceChecks = new TreeMap();
    private Map updateVariables = new TreeMap();
    private Map insertVariables = new TreeMap();
    private Map deleteVariables = new TreeMap();
    private Map existenceVariables = new TreeMap();
    */
    
	// the select query is dynamic if:
    // - it has conditional constraints
    // - it has generated constraints
    private boolean m_dynamicSelect = false;

    /**
     * Constructs and initialises a query object.
     * 
     * @param queryElement
     * @param queryDefn
     * @throws SystemException
     */
    public Query(Element queryElement, QueryDefinitions queryDefn)
            throws SystemException
	{
        m_queryDefinitions = queryDefn;
        extractQuery(queryElement);
    }

    /**
     * Copy constructor
     * 
     * @param query
     * @param queryDefn
     */
    public Query( Query query, QueryDefinitions queryDefn)
    {
    	m_queryDefinitions = queryDefn;
    	if (query.m_pivotNode != null ) m_pivotNode = new String( query.m_pivotNode );
    	if (query.m_join != null ) m_join = new String( query.m_join );
    	if (query.m_queryJoin != null ) m_queryJoin = new String( query.m_queryJoin );
    	if (query.m_orderBy != null ) m_orderBy = new String( query.m_orderBy );
    	if (query.m_pageController != null) m_pageController = new PageController(query.m_pageController);
    	m_notModifiable = query.m_notModifiable;
    	m_modifyVariables = new ModifyVariables( query.m_modifyVariables );
    	m_subQueryOrder = query.m_subQueryOrder;
    	m_dynamicSelect = query.m_dynamicSelect;
    	m_selectDistinct = query.m_selectDistinct;
    	
    	// deep copy table lists
    	Iterator tableIterator = query.m_tables.entrySet().iterator();
    	while(tableIterator.hasNext()) {
    		Map.Entry entry = (Map.Entry) tableIterator.next();
    		m_tables.put(entry.getKey(), new Table((Table) entry.getValue()));
    	}
    	Iterator tableList = query.m_tableList.iterator();
    	while(tableList.hasNext()) {
    		Table table = (Table) tableList.next();
    		m_tableList.add(new Table(table));
    	}
    	
    	if(query.selectStatement != null) {
    		selectStatement = (SQLStatement) query.selectStatement.clone(this);
    	}
    		
    	copyMapContents(query.modifySqlStatements, modifySqlStatements);
    	
    	
    	m_parameters = new TreeSet();
    	Iterator it = query.m_parameters.iterator();
    	while( it.hasNext() ) {
    		m_parameters.add( new String((String)it.next() ) );
    	}
    	
    	m_selectVariables = new TreeSet();
    	it = query.m_selectVariables.iterator();
    	while( it.hasNext() ) {
    		m_selectVariables.add( new String((String)it.next() ) );
    	}
    	
    	m_dependentVariables = new HashSet();
    	it = query.m_dependentVariables.iterator();
    	while( it.hasNext() ) {
    		m_dependentVariables.add( new String((String)it.next() ) );
    	}
    	
    	m_childPivotNodes = new HashSet();
    	it = query.m_childPivotNodes.iterator();
    	while( it.hasNext() ) {
    		m_childPivotNodes.add( new String((String)it.next() ) );
    	}

    	m_constraints = new LinkedList();
    	it = query.m_constraints.iterator();
    	while( it.hasNext() ) {
    		m_constraints.add( new Constraint((Constraint)it.next()) );
    	}

    	m_constraintOrderDependentVariables = new LinkedList();
    	it = query.m_constraintOrderDependentVariables.iterator();
    	while( it.hasNext() ) {
    		m_constraintOrderDependentVariables.add( new String((String)it.next() ) );
    	}

    	m_joinOrderDependentVariables = new LinkedList();
    	it = query.m_joinOrderDependentVariables.iterator();
    	while( it.hasNext() ) {
    		m_joinOrderDependentVariables.add( new String((String)it.next() ) );
    	}
    	
    	m_staticPropertyMap = new TreeMap();
    	it = query.m_staticPropertyMap.entrySet().iterator();
    	while( it.hasNext() ) {
    		Map.Entry entry = (Map.Entry)it.next();
    		m_staticPropertyMap.put( new String((String)entry.getKey()), new String((String)entry.getValue()) );
    	}
    	
    	m_aliasPropertyMap = new HashMap();
    	it = query.m_aliasPropertyMap.entrySet().iterator();
    	while( it.hasNext() ) {
    		Map.Entry entry = (Map.Entry)it.next();
    		m_aliasPropertyMap.put( new String((String)entry.getKey()), new String((String)entry.getValue()) );
    	}
    	
    	m_typeMap = new HashMap();
    	it = query.m_typeMap.entrySet().iterator();
    	while( it.hasNext() ) {
    		Map.Entry entry = (Map.Entry)it.next();
    		m_typeMap.put( new String((String)entry.getKey()), new Integer(((Integer)entry.getValue()).intValue()) );
    	}
    	
    	m_sequencePropertyMap = new HashMap();
    	it = query.m_sequencePropertyMap.entrySet().iterator();
    	while( it.hasNext() ) {
    		Map.Entry entry = (Map.Entry)it.next();
    		m_sequencePropertyMap.put( new String((String)entry.getKey()), new String((String)entry.getValue()) );
    	}
    	
    	// in this case can reuse ExistanceCheck objects as they cannot be modified after construction
    	m_existanceMap = new HashMap();
    	it = query.m_existanceMap.entrySet().iterator();
    	while( it.hasNext() ) {
    		Map.Entry entry = (Map.Entry)it.next();
    		m_existanceMap.put( new String((String)entry.getKey()), entry.getValue() );
    	}
    	
    	// get the child queries from query defs
    	it = query.m_childQueries.keySet().iterator();
    	while( it.hasNext() ) {
    		String pivotNode = (String)it.next();
    		m_childQueries.put( pivotNode, null);
    	}
        
        m_aliases.addAll(query.m_aliases);
    	
    	// copy unbound properties
    	m_unboundProperties.addAll(query.m_unboundProperties);
    }
    
    public Object getParameterValue(ContextVariables contextVariables, String alias, Element element, String parameter)
            throws SystemException, BusinessException
	{
        //TODO: Parameter should be checked to ensure it is aliased!
        parameter = parameter.toUpperCase();
        Object value = null;
        
        if (isStatic(parameter)) 
    	{
            if(log.isDebugEnabled()){
                log.debug("Property: " + parameter + " is static");
            }

            value = getStatic(parameter);
            return addContextParameter(contextVariables, parameter, value);
    	}
       if ((!parameter.startsWith(alias + ".") && contextVariables
                    .hasVariable(parameter))
                    || contextVariables.hasDirectVariable(parameter)) {
            return contextVariables.getValue(parameter);
        }
        if (isAliased(parameter)) {
            String aliasParm = getAlias(parameter);
            if(log.isDebugEnabled()){
                log.debug("Property: " + parameter + " is aliased to: "
                        + aliasParm);
            }

            value = getParameterValue(contextVariables, alias, element, aliasParm);
            return value;
        } 

        if (getXPathFor(parameter) != null)
        {
            String xpath = getXPathFor(parameter);
            if (xpath == null) {
                log.error("Variable: " + parameter + " xpath [" + xpath + "]");
            }
            if(log.isDebugEnabled()){
                log.debug("Variable: " + parameter + " xpath [" + xpath + "]");
            }

               
            // the xpath can contain nested references to other properties (db or not db)
            // and these need to be evaluated first
            Matcher matcher = Query.s_variablePattern.matcher(xpath);
            Map referencedProperties = new TreeMap();
            
            while (matcher.find()) {
                String match = matcher.group(1);
                if ( !referencedProperties.containsKey(match) ) {
                	Object oVal = getParameterValue(contextVariables, null, element, match.toUpperCase());
                	String replacementValue = oVal.toString();
                	referencedProperties.put(match, replacementValue);
                }
            }
            
            String sSearchXPath = xpath;
            
            // substitute the values of any properties into the xpath
            if ( referencedProperties.size() > 0 ) {
            	Iterator propertyValues = referencedProperties.entrySet().iterator();
            	while ( propertyValues.hasNext() ) {
            		Map.Entry entry = (Map.Entry)propertyValues.next();
            		String sSearch = "\\$\\{" + (String)entry.getKey() + "\\}";
            		sSearchXPath = sSearchXPath.replaceAll(sSearch, (String)entry.getValue());
            	}
            }
            
            // now evaluate the final xpath
            List lNodes = null;
            try {
            	lNodes = XPath.selectNodes(element, sSearchXPath);
            }
            catch(JDOMException e) {
            	throw new SystemException("Unable to evaluate '"+sSearchXPath+"': "+e.getMessage(),e);
            }
            Iterator iNodes = lNodes.iterator();
                
            Vector vParams = getParamsFor(xpath);
            Iterator iParams = vParams.iterator();
                
            // add all context variables with same xpath in 1 go
            // NOTE: lists of params could be handled in 2 ways:
            // 1) fully specify list item in xpath, something like '/address/line[position()=1]'.
            // 2) check to see if a given parameter is in a list and then process whole list.
            // Number (2) is used as this evaluates the node set only once. Method (1)
            // evaluates the node set as many times as there are items in the list.
            boolean bFirstMatch = true;
            
            while (iNodes.hasNext() && iParams.hasNext())
            {
             	Object elValue = iNodes.next();
               	String sParam = (String)iParams.next();
                	
               	if (elValue != null) {
                    if (elValue instanceof Element) {
                        value = ((Element) elValue).getTextNormalize();
                    } else if (elValue instanceof Attribute) {
                        value = ((Attribute) elValue).getValue();
                    } else {
                        throw new SystemException("XPath result not understood: " + elValue.toString());
                    }
                }
                	
              	if ( bFirstMatch == true ) {
              		bFirstMatch = false;
              		// it is possible to configure so that a field gets it's value from
              		// xpath to another field, so handle this situation:
              		if ( sParam.compareTo(parameter) != 0) {
              			addContextParameter(contextVariables, parameter, value);
              		}
              	}
              	
              	addContextParameter(contextVariables, sParam, value);
            }
                
            return contextVariables.getValue(parameter);
        }
        
        // if references an unevaluated sequence then add as empty string
        if (getUnboundProperties().contains(parameter) && hasSequenceFor(parameter)) {
        	addContextParameter(contextVariables, parameter, "");
        }
        //  try parent context as last resort
        // (we would already have got local value by now)
       return contextVariables.getValue(parameter);
    }
    
    private final static Pattern TIMESTAMP_PATTERN = Pattern.compile("[1-9][0-9]{3}-[0-1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]");
    private final static Pattern DATE_PATTERN = Pattern.compile("[1-9][0-9]{3}-[0-1][0-9]-[0-3][0-9]");
    
    Object addContextParameter( ContextVariables contextVariables, String parameter, Object value) throws BusinessException
	{
        //convert value here
        int type = getType(parameter);
        switch (type) {
        case java.sql.Types.DATE:
        	
        	SimpleDateFormat dateFormat = (SimpleDateFormat) SimpleDateFormat.getInstance();
            
        	String dateValue = (String)value;
        	
        	if(dateValue!=null && dateValue.length()>0)
        	{
          		if(TIMESTAMP_PATTERN.matcher(dateValue).matches())
        		{
        			dateFormat.applyPattern("yyyy-MM-dd HH:mm:ss");
        			try {
						value = new Timestamp(dateFormat.parse(dateValue).getTime());
					} 
        			catch (ParseException e) {
                        log.error("Failed to correctly parse date: " + value.toString());
					}
        		}
            	else if(DATE_PATTERN.matcher(dateValue).matches())
        		{
        			dateFormat.applyPattern("yyyy-MM-dd");
        			try {
						value = new Date(dateFormat.parse(dateValue).getTime());
					} 
        			catch (ParseException e) {
                        log.error("Failed to correctly parse date: " + value.toString());
					}
        		}
        		else
        		{
        			throw new BusinessException("The date value passed in DOM is not of the correct format.  Can either be of format 'yyyy-MM-dd HH:mm:ss' OR 'yyyy-MM-dd'.  The date value received : "+dateValue);
        		}
        	}
            break;
            
        case java.sql.Types.TIMESTAMP:
        	SimpleDateFormat dateFormatT = (SimpleDateFormat) SimpleDateFormat.getInstance();
        	dateFormatT.applyPattern("yyyy-MM-dd HH:mm:ss");
            try {
                if (null != value && !"".equals(value)) {
                    value = dateFormatT.parse((String) value);
                    value = new Timestamp(((java.util.Date) value).getTime());
                } else {
                    value = null;
                }
            } catch (java.text.ParseException e) {
                log.error("Failed to correctly parse date: " + value.toString());
            }
            break;
        case Types.INTEGER:
        case Types.TINYINT:
        case Types.SMALLINT:
            value = Integer.decode((String) value);
            break;
        case Types.BIGINT:
            value = new BigInteger((String) value);
            break;
        case Types.CHAR:
        	value = ((String) value).substring(0,1);
        	//value = new Character((char)((String) value).charAt(0));
            break;
        case Types.DOUBLE:
            value = Double.valueOf((String) value);
            break;
        case Types.FLOAT:
            value = Float.valueOf((String) value);
            break;
        case Types.DECIMAL:
        case Types.REAL:
        case Types.VARCHAR:
        case Types.NUMERIC:
            break;
        default:
            log.error("Missing type for: " + parameter + " type " + type);
        }
        contextVariables.addVariable(parameter, value);
        return value;
    }
    
    protected void copyMapContents(Map source, Map target) {
    	Iterator i = source.entrySet().iterator();
    	while(i.hasNext()) {
    		Map.Entry entry = (Map.Entry) i.next();
    		if(entry.getValue() instanceof Map) {
    			Map map = new HashMap();
    			target.put(entry.getKey(), map);
    			copyMapContents((Map) entry.getValue(), map);
    		}
    		else if(entry.getValue() instanceof SQLStatement){
    			target.put(entry.getKey(), ((SQLStatement) entry.getValue()).clone(this));
    		}
    	}
    }
    
    public QueryDefinitions getQueryDefinitions() {
    	return m_queryDefinitions;
    }
    
    /**
     * Resolves the child (sub) queries of the pivot node from xpath strings to objects
     * (called as part of copy construction of query definitions)
     */
    protected void resolveSubQueries()
    {
    	Iterator it = this.m_childQueries.entrySet().iterator();
    	while( it.hasNext() )
    	{
    		Map.Entry entry = (Map.Entry)it.next();
    		entry.setValue( m_queryDefinitions.m_queries.get( (String)entry.getKey() ) );
    	}
    	
    	// now do the ordered child queries
    	it = m_subQueryOrder.iterator();
    	while( it.hasNext() ) {
    		String pivotNode = (String)it.next();
    		m_subQueriesOrdered.add( m_childQueries.get(pivotNode) );
    	}
    }
    
    /**
     * Initialises Query using properties extracted from XML configuration.
     * 
     * @param queryElement
     * @throws SystemException
     */
    protected void extractQuery(Element queryElement) 
    	throws SystemException
	{
        m_pivotNode = queryElement.getAttributeValue("pivotNode", "/");

        setSelectDistinct( queryElement );
        
        String tables = queryElement.getAttributeValue("tables");
        addTables(tables);
        loadAliases(queryElement, m_aliases);
        
        Element sql = queryElement.getChild(SQL_ELEMENT_NAME);
        if(sql != null) {
        	String statementTypeName = sql.getAttributeValue("type");
        	StatementType statementType = StatementType.getInstance(statementTypeName);
        	
        	if(statementTypeName != null && !statementType.equals(StatementType.SELECT)) {
        		throw new ConfigurationException("Assertion failure whilst processing query: [" + m_pivotNode 
        				+ "].  Only 'select' SQL statments may be specified at this level within a query element");
        	}
        	
        	SQLStatementFactory factory = new SQLStatementFactory();
        	selectStatement = factory.createSQLStatement(sql, this);
        }
        else {
        	setOrderByClause( queryElement.getChildTextNormalize("OrderBy") );
            setJoinString(queryElement.getChildTextNormalize("Join"));
            setPageController(queryElement.getChild("Paged"));
        }
        
        /* Extract modify parameters */
        Element modifyElement = null;
        try {
        	modifyElement = (Element) XPath.selectSingleNode(queryElement, "Modify");
        }
        catch(JDOMException e) {
        	throw new SystemException("Unable to find 'Modify' element: " + e.getMessage(),e);
        }
        
        extractModify(modifyElement);
        if(log.isDebugEnabled()){
            log.debug(this.toString());
        }

    }

    public void addTables(String tables) {
        Matcher tableMatches = s_listPattern.matcher(tables);
        while (tableMatches.find()) {
            String alias = tableMatches.group(1).toUpperCase();
            Table table = m_queryDefinitions.getTableForAlias(alias);
            m_tables.put(table.getAlias(), table);
            m_tableList.add(table);
        }
    }
    
    /**
     * Extracts information used for modifying database content.
     * 
     * @param modifyElement
     * @throws SystemException
     */
    protected void extractModify(Element modifyElement) 
    	throws SystemException
	{
        Object notModifiable = null;
        try {
        	notModifiable = XPath.selectSingleNode(modifyElement, "@notModifiable");
        }
        catch(JDOMException e) {
        	throw new SystemException("Unable to evaluate attribute 'notModifiable': "+e.getMessage(),e);
        }
        
        if (notModifiable != null) {
            m_notModifiable = true;
            return;
        }
        
        Iterator sqlStatements = null;
        try {
        	sqlStatements = XPath.selectNodes(modifyElement, SQL_ELEMENT_NAME).iterator();
        }
        catch(JDOMException e) {
        	throw new SystemException("Unable to evaluate element '"+SQL_ELEMENT_NAME+"': "+e.getMessage(),e);
        }
        
        while(sqlStatements.hasNext()) {
        	Element sql = (Element) sqlStatements.next();
        	extractModifySQL(sql);
        }

        /* 'Property' variables. These are variables which are not bound to the database. */
        Iterator properties = null;
        try {
        	properties = XPath.selectNodes(modifyElement, "Property").iterator();
        }
        catch(JDOMException e) {
        	throw new SystemException("Unable to evaluate element 'Property': "+e.getMessage(),e);
        }
        
        while (properties.hasNext()) {
            Element field = (Element) properties.next();
            createProperty( field,false );
        }
		
        /* Update fields - used by existance check. These are bound to the database */
        Iterator fields = null;
        try {
        	fields = XPath.selectNodes(modifyElement, "Field").iterator();
        }
        catch(JDOMException e) {
        	throw new SystemException("Unable to evaluate element 'Field': "+e.getMessage(),e);
        }
        
        while (fields.hasNext()) {
            Element field = (Element) fields.next();
            createProperty( field,true );
        }
        /* Get existance checks */
        Iterator existanceChecks = null;
        try {
        	existanceChecks = XPath.selectNodes(modifyElement, "CheckExists").iterator();
        }
        catch(JDOMException e) {
        	throw new SystemException("Unable to evaluate element 'CheckExists': "+e.getMessage(),e);
        }
        
        while (existanceChecks.hasNext()) {
            Element existanceCheck = (Element) existanceChecks.next();
            String alias = existanceCheck.getAttributeValue("table").toUpperCase();
            
            String onExistsAction = existanceCheck.getAttributeValue("onExist");
            String onNotExistsAction = existanceCheck.getAttributeValue("onNotExist");
            
            // get the optimistic lock setting
            boolean bUseOptimisticLock = true; // default value
            Attribute attrOptimisticLock = existanceCheck.getAttribute("useOptimisticLock");
            if (attrOptimisticLock != null) {
            	String useLock = attrOptimisticLock.getValue();
            	if ( "false".compareToIgnoreCase(useLock) == 0 ) {
            		bUseOptimisticLock = false;
            	}
            	else if ("true".compareToIgnoreCase(useLock) != 0){
            		throw new ConfigurationException("Invalid value for CheckExists attribute 'useOptimisticLock': "+useLock);
            	}
            }
            
            // now create unique clause for existance check
            String uniqueFields = existanceCheck.getAttributeValue("fields").toUpperCase();
            String sUniqueClause = "";
            List lFields = new LinkedList();
            boolean bFirst = true;
            
            String[] arrFields = uniqueFields.split("\\s");
            for (int f=0; f < arrFields.length; f++)
            {
            	String sAliasedName = alias + "." + arrFields[f];
            	lFields.add(sAliasedName);
            	
            	if ( bFirst == true )
            	{
            		sUniqueClause += sAliasedName + " = ?";
            		bFirst = false;
            	}
            	else 
            		sUniqueClause += " AND " + sAliasedName + " = ?";
            }
            
            // create existance check
            ExistanceCheck check = new ExistanceCheck(alias, onExistsAction, onNotExistsAction, sUniqueClause, lFields, bUseOptimisticLock,
            		existanceCheck.getAttributeValue("condition"), existanceCheck.getAttributeValue("onConditionTrue"), existanceCheck.getAttributeValue("onConditionFalse"));
            
            m_existanceMap.put(check.getAlias(), check);
        }
    }
    
    protected void extractModifySQL(Element sql) throws SystemException {
    	Table table = null;
    	
    	//String statementText = sql.getTextNormalize();
    	String tables = sql.getAttributeValue("tables");
    	
    	Matcher tableMatches = s_listPattern.matcher(tables);
        if(tableMatches.find()) {
            String alias = tableMatches.group(1).toUpperCase();
            table = m_queryDefinitions.getTableForAlias(alias);
            if(table == null) {
            	throw new ConfigurationException("The table for the alias '" + alias + "' has not been defined");
            }
            
            SQLStatementFactory factory = new SQLStatementFactory();
            SQLStatement statement = factory.createSQLStatement(sql, this);
            
            StatementType type = statement.getType();
            
            if(type.equals(StatementType.INVALID)) {
            	throw new ConfigurationException("Unrecognised SQL statement type");
            }
            else if(type.equals(StatementType.SELECT)) {
            	throw new ConfigurationException("Select statement should not be placed inside of modify node");
            }
            
            Map map = (Map) modifySqlStatements.get(alias);
            if(map == null) {
            	map = new HashMap();
            	modifySqlStatements.put(alias, map);
            }
            map.put(type, statement);
        }
    }
    
    /**
     * Creates and adds a new field
     * @param eField
     */
    void createProperty(Element eProperty, boolean bBoundToDB)
    	throws SystemException
    {
	    String name = eProperty.getAttributeValue("name").toUpperCase();
	    
	    if ( !bBoundToDB ) {
	    	// make sure does not use a table alias
	    	Matcher matcher = Query.s_varContentPattern.matcher(name);
	        if (!matcher.find()) {
	                return;
	        }
	        String alias = matcher.group(1);
	            
	    	if ( m_queryDefinitions.m_tables.containsKey(alias) ) {
	    		throw new ConfigurationException("'Property' "+name+" should not use a table alias");
	    	}
	    	m_unboundProperties.add(name);
	    }
	    
	    String str = eProperty.getAttributeValue("sequenceTable");
	    if (str != null) {
	        m_sequencePropertyMap.put(name, str);
	    }
	    str = eProperty.getAttributeValue("property");
	    if (str != null) {
	        addModifyProperty(name, str);
	    }
	    str = eProperty.getAttributeValue("value");
	    if (str != null) {
	        addStaticModifyProperty(name, str);
	    }
	    str = eProperty.getAttributeValue("xpath");
	    if (str != null) {
	    	m_modifyVariables.add(str, name);
	    }
    }
    
    public List getUnboundProperties()
    {
    	return m_unboundProperties;
    }
    
    protected void addModifyProperty(String name, String aliasProperty) {
        m_modifyVariables.add(null, name);
        m_aliasPropertyMap.put(name, aliasProperty);
    }
    
    protected void addStaticModifyProperty(String name, String value) {
        m_modifyVariables.add(null, name);
        m_staticPropertyMap.put(name.toUpperCase(), value);
    }
    
    /**
     * Class representing information used to modify database contents.
     * 
     */
    private class ModifyVariables {
        private Map m_variablesMap = new TreeMap();
        private Map m_variablePath = new TreeMap();
        private Map m_xpathToParameters = new TreeMap();
        
        public ModifyVariables() {}
        
        // copy constructor
        public ModifyVariables(ModifyVariables modifyVariables )
        {
        	Iterator it = modifyVariables.m_variablePath.entrySet().iterator();
        	while( it.hasNext() ) {
        		Map.Entry entry = (Map.Entry)it.next();
        		m_variablePath.put( new String((String)entry.getKey()), new String((String)entry.getValue()) );
        	}
        	
        	it = modifyVariables.m_variablesMap.entrySet().iterator();
        	while( it.hasNext() ) {
        		Map.Entry entry = (Map.Entry)it.next();
        		// The value is a set which needs to be copied
        		Set valueSet = (Set)entry.getValue();
        		Iterator iSet = valueSet.iterator();
        		
        		Set newSet = new TreeSet();
        		while ( iSet.hasNext() ) {
        			newSet.add( new String((String)iSet.next()) );
        		}
        		m_variablesMap.put( new String((String)entry.getKey()), newSet );
        	}
        	
        	it = modifyVariables.m_xpathToParameters.entrySet().iterator();
        	while( it.hasNext() ) {
        		Map.Entry entry = (Map.Entry)it.next();
        		// The value is a vector which needs to be copied
        		Vector valueVect = (Vector)entry.getValue();
        		Iterator iVect = valueVect.iterator();
        		
        		Vector newVector = new Vector();
        		while ( iVect.hasNext() ) {
        			newVector.add( new String((String)iVect.next()) );
        		}
        		m_xpathToParameters.put( new String((String)entry.getKey()), newVector );
        	}
        }
        
        public void add(String path, String match) {
            Matcher matcher = Query.s_varContentPattern.matcher(match);
            //There should be one and only one match for a correctly
            //formatted updateable query
            if (!matcher.find()) {
                return;
            }
            String alias = matcher.group(1);
            String property = matcher.group(2);
            Set set = (Set) m_variablesMap.get(alias);
            if (set == null) {
                set = new TreeSet();
                m_variablesMap.put(alias, set);
            }
            set.add(property);
            if (path != null) {
            	// make sure do not overwrite a field defined in the modify with one 
            	// defined in the map (override should be other way round)
                if ( !m_variablePath.containsKey(match) ) {
                	m_variablePath.put(match, path);
                }
                
                if ( m_xpathToParameters.containsKey(path) )
                {
                	Vector vParams = (Vector)m_xpathToParameters.get(path);
                	vParams.add(match);
                }
                else
                {
                	Vector vParams = new Vector();
                	vParams.add(match);
                	m_xpathToParameters.put(path, vParams);
                }
            }
        }

        public Vector getParamsFor( String xPath )
        {
        	return (Vector)m_xpathToParameters.get(xPath);
        }
        
        public String getXPathFor(String propertyName) {
            return (String) m_variablePath.get(propertyName);
        }

        public Set getVariablesFor(String alias) {
            Set set = (Set) m_variablesMap.get(alias);
            return (set == null ? new TreeSet() : set);
        }
    }

    /**
     * Class used to represent a query which is done discover whether an item
     * already exists in the database. Used before modifying the database.
     */
    protected class ExistanceCheck 
	{
        public static final int INVALID = -1;
        public static final int FAIL = 1;
        public static final int UPDATE = 2;
        public static final int SKIP = 3;
        public static final int DELETE = 4;
        public static final int ADD = 5;
        public static final int CONTINUE = 6;
        
        private String m_alias;
        private ExistenceCheckAction m_onExistsAction;
        private ExistenceCheckAction m_onNotExistsAction;
        private int m_preConditionTrueAction;
        private int m_preConditionFalseAction;
        private String m_uniqueQueryClause; 
        private List m_uniquePropertiesOrder;
        private boolean m_useOptimisticLock;
		
    	// the condition (if any):
    	private ICondition m_condition = null;
 	
        public ExistanceCheck(String alias, String onExistsAction, String onNotExistsAction, 
        		String uniqueClause, List params, boolean useOptimisticLock,
				String xpathPreCondition, String preConditionTrueAction, String preConditionFalseAction ) 
        	throws SystemException
        {
            m_alias = alias;
            setOnExistsAction(onExistsAction);
            setOnNotExistsAction(onNotExistsAction);
            setPreConditionTrueAction(preConditionTrueAction);
            setPreConditionFalseAction(preConditionFalseAction);
            m_uniqueQueryClause = uniqueClause; 
            m_uniquePropertiesOrder = params;
            m_useOptimisticLock = useOptimisticLock;
            
            if (xpathPreCondition != null && xpathPreCondition.length() > 0) {
				m_condition = new XPathCondition();
				m_condition.initialise(xpathPreCondition, null);
			}
        }
       
        public ICondition getPreCondition() {
        	return m_condition;
        }
        
        public int getPreConditionAction(boolean bConditionValue) {
        	int actionId = INVALID;
        	if ( bConditionValue )
        		actionId = m_preConditionTrueAction;
			else
				actionId = m_preConditionFalseAction;
        	
        	return actionId;
        }
        
        protected void setPreConditionTrueAction(String trueAction) {
            // defaults to update
        	int action = validatePreConditionAction(trueAction);
        	if ( action == INVALID )
        		m_preConditionTrueAction = CONTINUE;
        	else
        		m_preConditionTrueAction = action;
        }
        
        protected void setPreConditionFalseAction(String falseAction) {
            // defaults to update
        	int action = validatePreConditionAction(falseAction);
        	if ( action == INVALID )
        		m_preConditionFalseAction = SKIP;
        	else
        		m_preConditionFalseAction = action;
        }
        
        protected void setOnExistsAction(String onExistsAction) throws SystemException{
        	m_onExistsAction = new OnExistsAction( onExistsAction );
        }

        protected void setOnNotExistsAction(String onNotExistsAction) throws SystemException {
        	m_onNotExistsAction = new OnNotExistsAction( onNotExistsAction );
        }

        protected int validatePreConditionAction(String sAction) {
            int action = INVALID;
            
        	if (sAction != null && sAction.length() > 0) 
        	{    
	            if ("fail".equalsIgnoreCase(sAction)) {
	            	action = FAIL;
	            }
	            if ("skip".equalsIgnoreCase(sAction)) {
	            	action = SKIP;
	            }
	            if( "continue".equalsIgnoreCase(sAction)){
	            	action = CONTINUE;
	            }
        	}
        	
            return action;
        }
        
        public ExistenceCheckAction getOnExistsAction() {
            return m_onExistsAction;
        }

        public ExistenceCheckAction getOnNotExistsAction() {
            return m_onNotExistsAction;
        }
     
        public String getAlias() {
            return m_alias;
        }
        
        public String getUniqueQueryClause(){
            return m_uniqueQueryClause;
        }
        
        public Iterator getUniqueCheckParamters(){
            return m_uniquePropertiesOrder.iterator();
        }   
        
        public boolean useOptimisticLock() {
        	return m_useOptimisticLock;
        }
        
        /** 
         * A class that encapsulates the specification of an existence check action.
         * In the simplest case this is 'hardcoded' in the config ie. it always takes the same value.
         * The more complex case - and the one which has lead to this class being introduced - is that the action
         * is dynamic i.e. it depends upon the XML input from the client at runtime. A boolean XPath condition is 
         * evaluated to determine the action.
         * 
         * The syntax for a conditional action ie borrowed from other languages:
         * 
         * <xpath condition> ? <true action> : <false action>
         * 
         * e.g. ./Delete = 'Y' ? delete : skip
         */ 
        public abstract class ExistenceCheckAction {
        	
        	private int m_trueAction = INVALID;
        	private int m_falseAction = INVALID;
        	private XPathCondition m_xpathCondition = null;
        	private boolean m_isDynamic = false;
			
        	
        	public ExistenceCheckAction(String actionSpec) throws SystemException {
        		// parse the string to see whether it specifies a dynamic or static action
        		int conditionLen = -1;
        		
        		if ( actionSpec != null ) {
        			conditionLen = actionSpec.indexOf('?');
        		}
        		
        		if ( conditionLen != -1 )
        		{
        			// it is a dynamic action
        			int actionsDividerPos = actionSpec.indexOf(':', conditionLen+1);
        			if ( actionsDividerPos != -1 ) {
        				String condition = actionSpec.substring(0, conditionLen);
        				condition = condition.trim();
        				
        				String trueActionString = actionSpec.substring(conditionLen+1, actionsDividerPos);
        				trueActionString = trueActionString.trim();

        				String falseActionString = actionSpec.substring(actionsDividerPos+1);
        				falseActionString = falseActionString.trim();
        				
        				m_xpathCondition = new XPathCondition();
        				m_xpathCondition.initialise(condition, null);
        				
        				setTrueAction( trueActionString );
        				setFalseAction( falseActionString );
        				
        				m_isDynamic = true;
        			}
        		}

        		if ( !m_isDynamic ) {
        			setTrueAction(actionSpec);
        		}
        	}
        	
        	private void setTrueAction( String trueActionString ) {
    			int action = validateAction(trueActionString);
            	if ( action == INVALID )
            		m_trueAction = getDefaultAction();
            	else
            		m_trueAction = action;
        	}

        	private void setFalseAction( String falseActionString ) {
    			int action = validateAction(falseActionString);
            	if ( action == INVALID )
            		m_falseAction = getDefaultAction();
            	else
            		m_falseAction = action;
        	}
        	
        	protected abstract int getDefaultAction();
        	
        	protected abstract int validateAction(String sAction);
			
        	public boolean isConditional() {
        		return m_isDynamic;
        	}
        	
        	public int getValue(Element inputXML) throws SystemException, BusinessException {
        		int action = INVALID;
        		
        		if ( m_isDynamic == false)
        			action = m_trueAction;
        		else {
        			if ( m_xpathCondition.evaluate(inputXML) )
        				action = m_trueAction;
        			else
        				action = m_falseAction;
        		}
        		return action;
        	}
        	
        	public int getTrueAction() {
        		return m_trueAction;
        	}
        	
        	public int getFalseAction() {
        		return m_falseAction;
        	}
        }
        
        public class OnExistsAction extends ExistenceCheckAction {
        	
        	public OnExistsAction(String actionSpec) throws SystemException {
        		super(actionSpec);
        	}
        	
        	protected int getDefaultAction() {
        		return UPDATE;
            }
        	
        	protected int validateAction(String sAction) {
        		int action = INVALID;
                  
              	if (sAction != null && sAction.length() > 0) 
              	{    
      	            if ("fail".equalsIgnoreCase(sAction)) {
      	            	action = FAIL;
      	            }
      	            if ("update".equalsIgnoreCase(sAction)) {
      	            	action = UPDATE;
      	            }
      	            if ("skip".equalsIgnoreCase(sAction)) {
      	            	action = SKIP;
      	            }
      	            if( "delete".equalsIgnoreCase(sAction)){
      	            	action = DELETE;
      	            }
              	}
              	
                return action;
        	}
        }
        
        public class OnNotExistsAction extends ExistenceCheckAction {
        	
        	public OnNotExistsAction(String actionSpec) throws SystemException {
        		super(actionSpec);
        	}
        	
        	protected int getDefaultAction() {
        		return ADD;
        	}
        	
        	protected int validateAction(String sAction) {
        		int action = INVALID;
                
            	if (sAction != null && sAction.length() > 0) 
            	{    
    	            if ("fail".equalsIgnoreCase(sAction)) {
    	            	action = FAIL;
    	            }
    	            if ("skip".equalsIgnoreCase(sAction)) {
    	            	action = SKIP;
    	            }
    	            if( "add".equalsIgnoreCase(sAction)){
    	            	action = ADD;
    	            }
            	}
            	
              return action;
        	}
        }
    }
    
    /**
     * Class used to represent a "where" clause constraint
     * @author GrantM
     *
     */
    protected class Constraint {
    	
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
    	 * @throws ComponentException
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
    	            	m_parameters.add(vars.group(1));
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
    	 * Copy constructor
    	 * @param constraint
    	 */
    	public Constraint(Constraint constraint) {
    		this.m_clause = constraint.m_clause;
    		this.m_hasParameter = constraint.m_hasParameter;
    		this.m_preparedClause = constraint.m_preparedClause;
    		// handle copy of condition
    		if (constraint.m_condition == null )
    			this.m_condition = null;
    		else {
    			this.m_condition = (ICondition)constraint.m_condition.clone();
    		}
    		// handle copy of generator
    		if (constraint.m_sqlGenerator == null )
    			this.m_sqlGenerator = null;
    		else {
    			this.m_sqlGenerator = (ISQLGenerator)constraint.m_sqlGenerator.clone();
    		}
    		// handle copy of parameters
    		this.m_parameters = new LinkedList(constraint.m_parameters);
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
    }
	
  
    /**
     * Class to hold info about a paged query.
     * @author GrantM
     */
    protected class PageController {
    	private String m_pageSizeParameter = null;
		private String m_pageNumberParameter = null;
		
    	private int m_pageSize = 0;
		private int m_pageNumber = 0;
		
		public PageController(String pageSize, String pageNumber) {
			//see if parameterised:
			Matcher vars = Query.s_variablePattern.matcher(pageSize);
            if (vars.find()) {
            	m_pageSizeParameter = vars.group(1);
            }
            else {
            	m_pageSize = Integer.parseInt(pageSize);
            }
            
			vars = Query.s_variablePattern.matcher(pageNumber);
            if (vars.find()) {
            	m_pageNumberParameter = vars.group(1);
            }
            else {
            	m_pageNumber = Integer.parseInt(pageNumber);
            }
		}
		
		public PageController(PageController pageController) {
			m_pageSizeParameter = pageController.m_pageSizeParameter;
			m_pageNumberParameter = pageController.m_pageNumberParameter;
			m_pageSize = pageController.m_pageSize;
			m_pageNumber = pageController.m_pageNumber;
		}
		
		public boolean hasSizeParameter() {
			return (m_pageSizeParameter != null);
		}

		public boolean hasPageNumberParameter() {
			return (m_pageNumberParameter != null);
		}
		
		public int getPageSize() {
			return m_pageSize;
		}
		
		public int getPageNumber() {
			return m_pageNumber;
		}
		
		public String getPageSizeParameter() {
			return m_pageSizeParameter;
		}
		
		public String getPageNumberParameter() {
			return m_pageNumberParameter;
		}
    }
    
    /* 
     * End of initialisation methods 
     * 
     */
    
    
    
    protected void prepareParameters() throws SystemException {
        //Extract properties needed by all nodes beneath this query node
        String xpath = getUniqueElementPath();
        //TODO: Make this more generic at some point in time
        Element pivotElement = null;
        try {
        	pivotElement = (Element) XPath.selectSingleNode(m_queryDefinitions.m_templateElement, xpath);
        }
        catch(JDOMException e) {
        	throw new SystemException("Unable to evaluate '"+xpath+"': "+e.getMessage(),e);
        }
                
        extractProperties(".", pivotElement);
    }

    protected String getUniqueElementPath() {
        String xpath = "./DBMapDef/Mapping" + m_pivotNode;
        //now add elimination clauses
        Iterator i = m_queryDefinitions.getQueries();
        while (i.hasNext()) {
            Query query = (Query) i.next();
            if (query != this) {
                if (query.getPivotNode().startsWith(m_pivotNode)) {
                    String childPivotNode = "."
                            + query.getPivotNode().substring(
                                    m_pivotNode.length());
                    log.trace("pivotNode [" + m_pivotNode + "] has child ["
                            + childPivotNode + "]");
                    m_childPivotNodes.add(childPivotNode);
                }
            }
        }
        return xpath;
    }

 
    public void addParameter(String parameterName) {
        m_parameters.add(parameterName);
        if(log.isDebugEnabled()){
            log.debug("addParameter(): Adding parameter: " + parameterName);
        }

        if (m_dependentVariables.contains(parameterName)) {
        	if(log.isDebugEnabled()){
                log.debug("addParameter(): removing dependent variable");
            }
            m_dependentVariables.remove(parameterName);
        }
        else {
            if(log.isDebugEnabled()){
                log.debug("addParameter(): parameter not found");
            }
        }
    }

    /**
     * @param contentList
     */
    private void extractProperties(String path, Object domObject) {
        if (domObject instanceof CDATA) {
            extractParameters(path, ((CDATA) domObject).getText());
        } else if (domObject instanceof Text) {
            extractParameters(path, ((Text) domObject).getText());
        } else if (domObject instanceof Element) {
            Iterator attributes = ((Element) domObject).getAttributes()
                    .iterator();
            while (attributes.hasNext()) {
                Attribute attribute = (Attribute) attributes.next();
                extractParameters(path + "/@" + attribute.getName(), attribute
                        .getValue());
            }
            List tList = ((Element) domObject).getContent(s_contentFilter);
            Iterator i = tList.iterator();
            while (i.hasNext()) {
                String newPath = path;
                Object next = i.next();
                if (next instanceof Element) {
                    newPath += "/" + ((Element) next).getName();
                }
                if (!m_childPivotNodes.contains(newPath)) {
                    extractProperties(newPath, next);
                }
            }
        }
    }


    public Vector getParamsFor( String xPath )
    {
    	return m_modifyVariables.getParamsFor(xPath);
    }
    
   
    private void extractParameters(String path, String text) {
        Matcher matcher = Query.s_variablePattern.matcher(text);
        while (matcher.find()) {
            String match = matcher.group(1).toUpperCase();
            if (shouldAddVariable(match)) {
                m_selectVariables.add(match);
                m_modifyVariables.add(path, match);
            }
        }
    }

    protected void addSelectParameter(String parameter) {
        //we should check to ensure that the parameter
        //is valid
        m_selectVariables.add(parameter);
    }

    private boolean shouldAddVariable(String variable) {
        if (m_parameters.contains(variable) || m_aliases.contains(variable)) {
            return false;
        }
        Matcher var = Query.s_varContentPattern.matcher(variable);
        boolean foundMatch = false;
        while (var.find()) {
            String alias = var.group(1);
            String property = var.group(2);
            if (!m_tables.containsKey(alias)) {
                return false;
            } else {
                foundMatch = true;
            }
        }
        return foundMatch;
    }

    /**
     * Returns an iterator over all the parameters that can need to be selected
     * from the database in order to statisfy the needs of the query.
     * 
     * @return
     */
    public Iterator getSelectParameters() {
        return m_selectVariables.iterator();
    }

    /**
     * Returns the 'order by' string
     * 
     * @return
     */
    public String getOrderByClause() {
        return m_orderBy;
    }
    
    /**
     * Sets the 'order by' string
     * 
     * @return
     */
    public void setOrderByClause(String orderBy ) {
    	m_orderBy = orderBy;
    }
    
    
    /**
     * Returns all the tables that are involved in a selection.
     * 
     * @return
     */
    public Iterator getSelectTables() {
        return m_tables.values().iterator();
    }
    
    public Iterator getModifyTableList(){
        return m_tableList.iterator();
    }

    public boolean hasTable(String alias) {
        return m_tables.containsKey(alias);
    }


    protected void setJoinString(String join) {
    	m_dependentVariables.clear();
        m_joinOrderDependentVariables.clear();
         
        m_join = (join == null ? "" : join);
        if ("".equals(m_join)) {
            return;
        }
        //Find all parameters
        Matcher vars = Query.s_variablePattern.matcher(join);
        while (vars.find()) {
            //add var to dependent vars list
            String var = vars.group(1).toUpperCase();
            m_dependentVariables.add(var);
            m_joinOrderDependentVariables.add(var);
        }
        //Replace all parameters with ?
        m_queryJoin = vars.replaceAll("?");
     }
    
    /**
     * Adds a constraint to the query.
     * @param constraintElement
     * @throws SystemException
     */
    public void addConstraint(Element constraintElement)
    	throws SystemException
    {
    	if ( constraintElement == null ) return;
    	
    	// create new constraint
    	Constraint newConstraint = null;  	
    	newConstraint = new Constraint(constraintElement);  	
    	
    	// add to query
    	m_constraints.add(newConstraint);
    	if ( (newConstraint.getCondition() != null || newConstraint.getSQLGenerator() != null) && 
    			m_dynamicSelect == false) 
		{
    		m_dynamicSelect = true;
    	}
    	if ( newConstraint.hasParameter() ) {
    		Iterator itParams = newConstraint.getParameters().iterator();
            while(itParams.hasNext()) {
        		String parameter = (String)itParams.next();
    		
        		m_constraintOrderDependentVariables.add(parameter);
        		if (!m_parameters.contains(parameter)) {
        			m_dependentVariables.add(parameter);
        		}
            }
    	}
    }
    
    
    
    /**
     * Returns the join string
     */
    public String getJoinString() {
    	return m_queryJoin;
    }
    
    /**
     * Returns the constraints
     * @return
     */
    public List getConstraints() {
    	return m_constraints;
    }
   
    /**
     * Returns the where clause string for this query. The join string should be
     * database ready, i.e. all substitutable parameters should be replaced by ?
     * as per the JDBC spec.
     * @param inputParameters
     * @param context
     * @param activeConstraints
     * @return
     * @throws SystemException
     * @throws BusinessException
     */
    public String getWhereClause(Document inputParameters, IQueryContextReader context, List activeConstraints) 
    	throws SystemException, BusinessException
    {
        if (m_constraints.isEmpty()) {
            return m_queryJoin;
        }
        if ( m_dynamicSelect == true && 
        		(inputParameters == null || activeConstraints == null) ) {
        	throw new SystemException("Cannot create where clause: getWhereClause has invalid parameters");
        }
        
        StringBuffer buff = new StringBuffer((m_queryJoin == null ? 0
                : m_queryJoin.length())
                + 25 * m_constraints.size());
        boolean first = false;
        if (m_queryJoin != null) {
            buff.append("(");
            buff.append(m_queryJoin);
            buff.append(")");
        } else {
            first = true;
        }
        Iterator i = m_constraints.iterator();
        Constraint currentConstraint = null;
        while (i.hasNext()) {
        	currentConstraint = (Constraint)i.next();
        	
        	//constraints are added to the 'where' unless conditional, in which case they
        	//are added if the condition evaluates to true
        	boolean bAddConstraint = true;
        	
        	if ( this.hasDynamicSelect() ) {
        		ICondition condition = currentConstraint.getCondition();
            	
	        	if ( condition != null ) {
	        		bAddConstraint = condition.evaluate(inputParameters.getRootElement());
	        	}
	            
	        	if ( bAddConstraint )
	        		activeConstraints.add(currentConstraint);
	            else
	            	currentConstraint = null;
        	}
        	
        	// add the constraint to the where clause
        	if ( currentConstraint != null ) {
 
	            String constraintClause = currentConstraint.getPreparedClause(inputParameters, context);
	            if ( constraintClause != null && constraintClause.length() > 0 ) {
	            	if (first) {
		                buff.append("(");
		                first = false;
		            } else {
		                buff.append(" AND (");
		            }

		            buff.append( constraintClause );
		            buff.append(")");
	            }
        	}
        }
        return buff.toString();
    }

    /**
     * Returns the pivotNode associated with this query. This is a unique
     * identifier for this query instance.
     * 
     * @return
     */
    public String getPivotNode() {
        return m_pivotNode;
    }

    public Iterator getDependentProperties() {
        return m_dependentVariables.iterator();
    }

    /**
     * returns an ordered list of all parameterised variables appearing in the where.
     * Only works if no conditional constraints
     * @return
     */
    public Iterator getWhereOrderDependentProperties() {
        List list = new LinkedList(m_joinOrderDependentVariables);
        list.addAll(m_constraintOrderDependentVariables);
        return list.iterator();
    }
    
    /**
     * Returns ordered list of join specific parameterised variables
     * @return
     */
    public Iterator getJoinOrderDependentProperties() {
        return m_joinOrderDependentVariables.iterator();
    }

    public String toString() {
        StringBuffer buff = new StringBuffer(256);
        buff.append("Query [");
        buff.append(m_pivotNode);
        buff.append("] Tables:");
        buff.append(m_tables);
        buff.append(" SelectProperties:");
        buff.append(m_selectVariables);
        buff.append(" Join:[");
        buff.append(m_join);
        buff.append("] DependentProperties:");
        buff.append(m_dependentVariables);
        return buff.toString();
    }

    /**
     * Determines if this table has been marked with an existance check.
     * 
     * @param alias
     * @return
     */
    public boolean hasExistanceCheck(String alias) {
        return m_existanceMap.containsKey(alias);
    }

    /**
     * Returns paramters that are required for modification, these would
     * typically be a superset of select values
     * 
     * @return
     */
    public Iterator getModifyParameters(String alias) {
        return m_modifyVariables.getVariablesFor(alias).iterator();
    }

  
    public boolean isModifiable() {
        return !m_notModifiable;
    }



    public boolean isAliased(String property) {
        return m_aliasPropertyMap.containsKey(property);
    }

    public String getAlias(String property) {
        return (String) m_aliasPropertyMap.get(property);
    }

    public boolean hasDynamicSelect() {
    	return m_dynamicSelect;
    }
 
    /**
	 * Sets a query's select distinct property
	 * @param eQuery
	 * @throws QueryEngineException
	 * @throws ConfigurationException
	 */
	public void setSelectDistinct(Element eQuery)
		throws QueryEngineException, ConfigurationException
	{
		Attribute attrSelectDistinct = eQuery.getAttribute("selectDistinct");
		if ( attrSelectDistinct != null ) {
			String sSelectDistinct = attrSelectDistinct.getValue();
	        if ( "true".compareToIgnoreCase(sSelectDistinct) == 0 ) {
	        	m_selectDistinct = true;
	        }
	        else if ("false".compareToIgnoreCase(sSelectDistinct) == 0 ) {
	        	m_selectDistinct = false;
	        }
		}
	}
	
    public boolean isSelectDistinct() {
    	return m_selectDistinct;
    }
    
    public boolean isStatic(String name) {
        return m_staticPropertyMap.containsKey(name);
    }

    public Object getStatic(String property) {
        return m_staticPropertyMap.get(property);
    }

  
    public boolean hasSequenceFor(String property) {
        return m_sequencePropertyMap.containsKey(property.toUpperCase());
    }

    public String getSequenceFor(String property) {
        return (String) m_sequencePropertyMap.get(property.toUpperCase());
    }

    public String getXPathFor(String propertyName) {
        return m_modifyVariables.getXPathFor(propertyName);
    }

    /**
     * Prepares the types needed for the insert operations.
     * 
     * @throws SQLException
     *  
     */
     protected void prepareTypes(Connection connection) throws SystemException {
     	if(log.isDebugEnabled()){
            log.debug("Entered method : prepareTypes()");
        }

    	ResultSet rs = null;
    	Iterator i = m_tables.values().iterator();    	
    	String schemaName = null;   	

    	try {
    		PreparedStatement ps = null;
            ResultSet result = null;
            try {
                ps = connection.prepareStatement("SELECT USER FROM DUAL");
                result = ps.executeQuery();
                result.next();
                schemaName = result.getString(1).toUpperCase();                
            }
            finally {
                DBUtil.quietClose(ps);
                DBUtil.quietClose(result);
            }
    		
    		while (i.hasNext()) {
    			Table table = (Table) i.next();
  
    			try {
    				rs = connection.getMetaData().getColumns(null, schemaName, table.getName(), null);
    			}
                catch(SQLException e) {
                	throw new SystemException("Failed to get database metadata for table '"+table.getName()+"': "+e.getMessage(),e);
                }
                
        		try {
        			while (rs.next()) {
        				String columnName = rs.getString(4).toUpperCase(); 
        				String pName = table.getAlias() + "." + columnName;
        				Integer type = new Integer(rs.getInt(5));
        				m_typeMap.put(pName, type);
        				log.trace("Added type for [" + pName + "] = " + type);
        				table.addColumn(columnName);
        			}
            		rs.close();
        		}
        		catch(SQLException e) {
        			throw new SystemException("Failed to process result set metadata for table '"+table.getName()+"': "+e.getMessage(),e);
        		}
        		
        		rs = null;
        	}
		}
    	catch(SQLException e) {
    		throw new SystemException("Failed to query the db user: " + e.getMessage(), e);
    	}
    	finally {
    		try {
    			if ( rs != null ) {
    				rs.close();
    				rs = null;
    			}
    		}
    		catch(SQLException e) {
    			throw new SystemException("Failed to close metadata result set: "+e.getMessage(),e);
    		}
    	}
    }
    
    public Table getTableFor(String alias){
        return (Table) m_tables.get(alias);
    }

    public int getType(String parameter){
        Integer integer = (Integer) m_typeMap.get(parameter);
        return (integer==null?Types.VARCHAR:integer.intValue());
    }
    

    protected ExistanceCheck getExistanceCheck(String alias) {
        return (ExistanceCheck) m_existanceMap.get(alias);
    }
    
	/**
	 * @return Returns the selectStatement.
	 */
	public SQLStatement getSelectStatement() {
		return selectStatement;
	}
	
	public void setSelectStatement(SQLStatement selectStatement) {
		this.selectStatement = selectStatement;
	}
	
	public SQLStatement getModifySQLStatement(String alias, StatementType type) {
		SQLStatement result = null;
		
		Map map = (Map) modifySqlStatements.get(alias);
		if(map != null) {
			result = (SQLStatement) map.get(type);
		}
		return result;
	}
    /**
     * adds a subquery
     * @param child
     */
    public void addSubQuery(Query child)
    {
    	m_childQueries.put(child.getPivotNode(), child);
    	
    	m_subQueryOrder.add( child.getPivotNode() );
    	m_subQueriesOrdered.add( child );
    }
    
    /**
     * Build up a list of sql aliases to be applied during a select
     * statement.
     *  
     * @param eQuery
     * @return
     * @throws SystemException
     */
    public void loadAliases(Element eQuery, Set aliases) throws SystemException {
        
        List eAliases = eQuery.getChildren("Alias");
        
        for (Iterator i = eAliases.iterator(); i.hasNext();) {
            Element eAlias = (Element) i.next();
            String name = eAlias.getAttributeValue("name");
            aliases.add(name);
        }

    }
    
    
    /**
     * Returns the subqueries in querying order
     * @return
     */
    public Collection getSubQueries()
    {
    	// get the subqueries in querying order    	
    	return m_subQueriesOrdered;
    }
    
    public void setPageController(Element ePaged) {
    	if (ePaged == null) return;
    	
    	String pageSize = ePaged.getAttributeValue("pageSize");
    	String pageNumber = ePaged.getAttributeValue("pageNumber");
    	
    	if ( pageSize != null && pageSize.length() > 0 &&
    			pageNumber != null && pageNumber.length() > 0 ) 
    	{
    		m_pageController = new PageController(pageSize, pageNumber);
    	}	
    }
    
    public PageController getPageController() {
    	return m_pageController;
    }
    
}