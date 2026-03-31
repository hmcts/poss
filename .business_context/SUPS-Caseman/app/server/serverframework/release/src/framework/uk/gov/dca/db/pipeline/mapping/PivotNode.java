/*
 * Created on 10-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.logging.Log;
import org.jdom.Attribute;
import org.jdom.CDATA;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Text;
import org.jdom.filter.ContentFilter;
import org.jdom.filter.Filter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.Query;
import uk.gov.dca.db.pipeline.mapping.modify.Modify;
import uk.gov.dca.db.pipeline.mapping.select.Select;
import uk.gov.dca.db.pipeline.mapping.select.SelectFactory;
import uk.gov.dca.db.pipeline.mapping.visitor.Visitor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Represents a pivot node in the query defintion file.
 * 
 * @author Michael Barker
 *
 */
public class PivotNode implements Pivot {

    
    protected static final Pattern S_LIST_PATTERN = Pattern.compile("\\b(\\w+)\\b");
    public static final Pattern S_VARIABLE_PATTERN = Pattern.compile("\\$\\{([^}]+)\\}");
    protected static final Pattern S_VAR_CONTENT_PATTERN = Pattern.compile("\\b(\\w+)\\.(\\w+)\\b");
    protected final static String PIVOT_NODE_ATTR = "pivotNode";
    private static final Filter S_CONTENTFILTER = 
        new ContentFilter(ContentFilter.CDATA | ContentFilter.ELEMENT | ContentFilter.TEXT);
    private static final String ALIAS_ELEMENT = "Alias";
    private static final String NAME_ATTR = "name";
    private static final String SELECT_ATTR = "select";
    private static final XPath NOT_MODIFIABLE_PATH;
    
    private final static Log log = SUPSLogFactory.getLogger(PivotNode.class);
    
    private final String m_name;
    private Map m_childNodes;
    //private final InternalSelect m_select;
    private final Modify m_modify = null;
    private Set m_relativeChildPaths;
    private final Map m_extensions;
    private final boolean m_isModifiable;
    //private final Map m_tables;
    private final Map m_allTables;
    private final Set m_aliases;
    private String m_service;
    private final PivotData pivotData;
    
    static {
        try {
            NOT_MODIFIABLE_PATH = XPath.newInstance("./Modify/@notModifiable");
        }
        catch (JDOMException e) {
            throw new RuntimeException("Unable to initialise PivotDefinintions class, THIS IS A BUG.", e);
        }
    }
    
    
    public PivotNode(String service, Element eQuery, Map allTables) throws SystemException {
        
        m_service = service;
        m_name = eQuery.getAttributeValue(PIVOT_NODE_ATTR, "/");
        String tableAliases = eQuery.getAttributeValue("tables");
        m_allTables = allTables;
        Map tables = PivotData.loadTables(tableAliases, allTables);
        //Map tables = getTables(tableAliases, allTables);
        Select select = new SelectFactory().create(this, eQuery);
        pivotData = PivotData.create(tables, new TreeSet(), select, new ArrayList(), new HashMap(), null, eQuery);
        
        m_aliases = loadAliases(eQuery);
        m_extensions = new HashMap();
        m_childNodes = new LinkedHashMap();
        m_isModifiable = getModifiable(eQuery);
    }
    
    public Query getQuery() {
        return null;
    }
    
    /* (non-Javadoc)
     * @see uk.gov.dca.db.pipeline.pivot.Pivot#getName()
     */
    public String getName() {
        return this.m_name;
    }
    
    public Map getChildNodes() {
        return m_childNodes;
    }
    
    public void addChildNode(Pivot child) {
        this.m_childNodes.put(child.getName(), child);
    }
    
    public void accept(Visitor vistor) throws SystemException, BusinessException {
        vistor.visitPivotNode(this);
    }

    
    public boolean isModifiable() {
        return m_isModifiable;
    }
    
    
    /**
     * @see uk.gov.dca.db.pipeline.mapping.Pivot#getSelect()
     */
    public Select getSelect(String method) {
        PivotData pData = getPivotData(method, false);
        return pData.getSelect();
    }
    
    /**
     * @see uk.gov.dca.db.pipeline.mapping.Pivot#getTables()
     */
    public Map getTables(String method) {
        PivotData pData = getPivotData(method, false);
        return pData.getTables();
    }
    
    /**
     * 
     */
    public Set getVariables(String method) {
        PivotData pData = getPivotData(method, false);
        return pData.getVariables();
    }
    
    /**
     * @see uk.gov.dca.db.pipeline.mapping.Pivot#getConstraints(java.lang.String)
     */
    public List getConstraints(String method) {
        PivotData pData = getPivotData(method, false);
        return pData.getConstraints();
    }

    public Map getParameters(String method) {
        PivotData pData = getPivotData(method, false);
        return pData.getParameters();        
    }
    
    public PivotConfig getConfig(String method) {
        return getPivotData(method, false).getConfig();
    }    
    
    /**
     * Adds all of the supplied constraints to this pivot node.  This
     * is used mainly when cascading constraints from the root node.
     * 
     * @param method
     * @param constraints
     */
    public void addConstraints(String method, List constraints) {
        PivotData pData = getPivotData(method, true);
        pData.getConstraints().addAll(constraints);
    }
    
    
    public boolean hasParameter(String method, String parameter) {
        return getParameters(method).containsKey(parameter);
    }
    
    
    /* (non-Javadoc)
     * @see uk.gov.dca.db.pipeline.pivot.Pivot#addExtension(uk.gov.dca.db.pipeline.pivot.PivotData)
     */
    public void addExtension(String method, PivotData pData) {
        m_extensions.put(method, pData);
    }

    /* (non-Javadoc)
     * @see uk.gov.dca.db.pipeline.pivot.Pivot#getAllTables()
     */
    public Map getAllTables() {
        return m_allTables;
    }
    
    public boolean getModifiable(Element eQuery) throws SystemException {
        try {
            String value = NOT_MODIFIABLE_PATH.valueOf(eQuery);
            if (value == null) {
                return true;
            }
            else {
                return !Boolean.valueOf(value).booleanValue();
            }            
        }
        catch (JDOMException e) {
            throw new SystemException("[" + getName() + "] Unable to get notModifiable setting");
        }
    }
    
    /**
     * Build up a list of sql aliases to be applied during a select
     * statement.
     *  
     * @param eQuery
     * @return
     * @throws SystemException
     */
    public Set loadAliases(Element eQuery) throws SystemException {
        Set aliases = new HashSet();
        
        List eAliases = eQuery.getChildren(ALIAS_ELEMENT);
        
        for (Iterator i = eAliases.iterator(); i.hasNext();) {
            Element eAlias = (Element) i.next();
            String name = eAlias.getAttributeValue(NAME_ATTR);
            String select = eAlias.getAttributeValue(SELECT_ATTR);
            if (name != null && select != null) {
                Variable v = new Variable(name, select);
                aliases.add(v);
            }
            else {
                throw new SystemException("[" + m_name + "] Invalid alias name: " + name + " select: " + select);
            }
        }
        
        return aliases;
    }
    
    public Set getAliases() {
        return m_aliases;
    }

    /**
     * Generates a list of xpaths for the child pivot nodes using
     * xpaths relative this this node;
     * 
     * @return
     */
    public Set getRelativeChildPaths() {
        Iterator i = m_childNodes.values().iterator();
        Set paths = new HashSet();
        while (i.hasNext()) {
            Pivot pivotNode = (Pivot) i.next();
            if (pivotNode != this) {
                if (pivotNode.getName().startsWith(m_name)) {
                    String childPivotNode = "." + pivotNode.getName().substring(m_name.length());
                    log.trace("pivotNode [" + m_name + "] has child ["
                            + childPivotNode + "]");
                    paths.add(childPivotNode);
                }
            }
        }
        return paths;
    }
    
    
    /**
     * Gets the pivot data for the specified method.
     * 
     * @param method
     * @param create
     * @return
     */
    public PivotData getPivotData(String method, boolean create) {
        
        PivotData pData = null;
        if (method == null) {
            pData = pivotData;
        }
        else {
            pData = (PivotData) m_extensions.get(method);
            if (pData == null && create) {
                Map tables = new HashMap();
                tables.putAll(pivotData.getTables());
                Set variables = new TreeSet();
                variables.addAll(pivotData.getVariables());
                List constraints = new ArrayList();
                constraints.addAll(pivotData.getConstraints());
                Map parameters = new HashMap();
                parameters.putAll(pivotData.getParameters());
                
                pData = new PivotData(tables, variables, pivotData.getSelect(), constraints, 
                        parameters, pivotData.getConfig());
                m_extensions.put(method, pData);
            }
            else if (pData == null && !create) {
                pData = pivotData;
            }
            else {
                // pData remains the same.
            }
        }
        return pData;
    }
    


    
    
    /**
     * Adds a variable to this select node.
     */
    public boolean addVariable(String method, String variable) {
        
        PivotData pData = getPivotData(method, true);
        boolean isAdded = false;
        Variable v = new Variable(variable, variable);
        
        Matcher var = Query.s_varContentPattern.matcher(variable);
        while (var.find()) {
            String alias = var.group(1);
            // If the variable specified exists in a table
            // listed for this pivot node.
            if (m_aliases.contains(v)) {
                log.debug("[" + getName() + "] Contains an alias for: " + v.getName());
            }
            else if (pData.getTables().containsKey(alias)) {
                pData.getVariables().add(v);
                isAdded = true;
            }
            // In case we all ready have this variable as a parameter.
            else if (pData.getParameters().containsKey(alias)) {
                isAdded = true;
            }
            else if (log.isDebugEnabled()) {
                log.debug("[" + getName() + "] Unresolved map variable: " + variable);                
            }
        }
        return isAdded;
    }
    
    
    /**
     * Gets a list of the 
     * @return
     */
    public String getUniqueElementPath() {
        String xpath = "./DBMapDef/Mapping" + m_name;
        //now add elimination clauses
        return xpath;
    }

    
    public void loadParameters(Element e) throws SystemException {
        m_relativeChildPaths = getRelativeChildPaths();
        //Extract properties needed by all nodes beneath this query node
        extractProperties(".", e);
    }
    
    /**
     * Determines if the supplied alias is defined for this
     * pivot node.
     * 
     * @param alias
     * @return
     */
    public boolean hasTable(String method, String alias) {
        
        return getTables(method).containsKey(alias);
    }
    
    
    /**
     * Extracts all of the parameters relative to this node recursivly.
     * 
     * @param path
     * @param domObject
     */
    private void extractProperties(String path, Object domObject) {
        if (domObject instanceof CDATA) {
            extractParameter(path, ((CDATA) domObject).getText());
        } 
        else if (domObject instanceof Text) {
            extractParameter(path, ((Text) domObject).getText());
        } 
        else if (domObject instanceof Element) {
            Iterator attributes = ((Element) domObject).getAttributes().iterator();
            while (attributes.hasNext()) {
                Attribute attribute = (Attribute) attributes.next();
                extractParameter(path + "/@" + attribute.getName(), attribute.getValue());
            }
            List tList = ((Element) domObject).getContent(S_CONTENTFILTER);
            Iterator i = tList.iterator();
            while (i.hasNext()) {
                String newPath = path;
                Object next = i.next();
                if (next instanceof Element) {
                    newPath += "/" + ((Element) next).getName();
                }
                if (!m_relativeChildPaths.contains(newPath)) {
                    extractProperties(newPath, next);
                }
            }
        }
    }
    
    
    private void extractParameter(String path, String value) {
        Matcher matcher = Query.s_variablePattern.matcher(value);
        while (matcher.find()) {
            String match = matcher.group(1).toUpperCase();
            if (log.isDebugEnabled()) {
                log.debug("[" + getName() + "] Loading variable: " + path + " = " + match);                
            }
            addVariable(null, match);
            //m_modifyVariables.add(path, match);
        }
    }
    

    /**
     * Recursive to String method.
     * 
     * @param level
     * @return
     */
    public String toString(int level) {
        StringBuffer sb = new StringBuffer();        
        
        for (int i = 0; i < level; i++) {
            sb.append(" ");
        }
        sb.append("Name: " + m_name);
        sb.append(", Select: " + getSelect(null));
        sb.append(", Modify: " + m_modify);
        sb.append(", isModifiable: " + m_isModifiable);
        sb.append(System.getProperty("line.separator"));
        
        for (Iterator i = m_childNodes.values().iterator(); i.hasNext();) {
            PivotNode p = (PivotNode) i.next();
            sb.append(p.toString(level + 2));
        }
        
        return sb.toString();
    }
    
    public String toString() {
        
        return toString(0);
    }

    public String getService() {
        return m_service;
    }

    
}
