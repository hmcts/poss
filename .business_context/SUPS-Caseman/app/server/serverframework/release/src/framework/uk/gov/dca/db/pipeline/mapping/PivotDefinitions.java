/*
 * Created on 12-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.Text;
import org.jdom.filter.ContentFilter;
import org.jdom.filter.Filter;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;
import org.xml.sax.InputSource;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.ConfigurationException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.Util;
import uk.gov.dca.db.pipeline.Query;
import uk.gov.dca.db.pipeline.Table;
import uk.gov.dca.db.pipeline.mapping.select.ConstraintFactory;
import uk.gov.dca.db.pipeline.mapping.select.EmptyJoinSelect;
import uk.gov.dca.db.pipeline.mapping.select.Select;
import uk.gov.dca.db.pipeline.mapping.select.SelectFactory;
import uk.gov.dca.db.pipeline.mapping.visitor.CascadeConstraintsVisitor;
import uk.gov.dca.db.pipeline.mapping.visitor.DependentVariablesVisitor;
import uk.gov.dca.db.pipeline.mapping.visitor.LinkingVisitor;
import uk.gov.dca.db.pipeline.mapping.visitor.PreprocessSQLVisitor;
import uk.gov.dca.db.pipeline.mapping.visitor.VariablesVistor;
import uk.gov.dca.db.pipeline.mapping.visitor.Visitor;
import uk.gov.dca.db.util.SUPSLogFactory;
import uk.gov.dca.db.util.XML;

/**
 * Holds the definitions of all of the pivot nodes.  I holds them in two structures
 * as a flat map and also as a tree.  Is responsable for constructing the 
 * 
 * @author Michael Barker
 *
 */
public class PivotDefinitions {

    private final static XPath MAP_DEF_LOCATION_PATH;
    private final static XPath DATASOURCE_PATH;
    private final static XPath MAP_ROOT_PATH;
    private final static String MAP_DEF_ELEMENT = "DBMapDef";
    private static final Filter S_TEXTFILTER = new ContentFilter(ContentFilter.TEXT);
    private static final Filter S_ELEMENTFILTER = new ContentFilter(ContentFilter.ELEMENT);
    
    private final String m_mapDefName;
    private final String m_queryDefName;
    private final static Log log = SUPSLogFactory.getLogger(PivotDefinitions.class);
    
    private final Map m_pivotNodes;
    private final Map m_rootPivotNodes;
    private final Map m_tables;
    private final Element m_templateElement;
    private final DataSource m_dataSource;
    private String m_service;
    private final MapElement m_mapRoot;
    
    static {
        try {
            MAP_DEF_LOCATION_PATH = XPath.newInstance("./DBMapDef/@location");
            DATASOURCE_PATH = XPath.newInstance("./DBMapDef/DataSource/@id");
            MAP_ROOT_PATH = XPath.newInstance("./DBMapDef/Mapping");
        }
        catch (JDOMException e) {
            throw new RuntimeException("Unable to initialise PivotDefinintions class, THIS IS A BUG.", e);
        }
    }
    
    /**
     * Creates a list of pivot nodes from the specified query_def and map file.
     * 
     * @param sFileLocation
     * @param preloadCache
     * @throws SystemException
     * @throws BusinessException 
     * @throws BusinessException 
     */
    public PivotDefinitions(String service, String sFileLocation, Map preloadCache) throws SystemException, BusinessException {
        
        m_service = service;
        m_queryDefName = sFileLocation;
        
        if (m_queryDefName != null) {
            
            if (log.isDebugEnabled()) {
                log.debug("Loading Query Definition: " + m_queryDefName);                
            }
            
            // Get the name of the the query def and map def.
            m_templateElement = getQueryDef(m_queryDefName);
            m_mapDefName = getMapDefName(m_templateElement);

            if (log.isDebugEnabled()) {
                log.debug("Loading Map Definition: " + m_mapDefName);                
            }
            Element eMapDef = getMapDef(m_mapDefName);
            
            // Add the contents of the specified MapDef file to the QueryDefs JDOM
            Element eMapDefLocation = m_templateElement.getChild(MAP_DEF_ELEMENT);
            if (eMapDefLocation != null) {
                eMapDefLocation.detach();
                m_templateElement.addContent(eMapDef);
            }
            else {
                throw new ConfigurationException("DBMapDef element is not definted");
            }
            
            try {
                Element e = (Element) MAP_ROOT_PATH.selectSingleNode(m_templateElement);
                m_mapRoot = loadMapElement((Element) e.getChildren().get(0));
            }
            catch (JDOMException e1) {
                throw new SystemException("Unable to pre-parse mapping: " + e1);
            }

            
            // Get the datasource.
            String dataSourceId = XML.getValue(DATASOURCE_PATH, m_templateElement, "DataSource");

            if (log.isDebugEnabled()) {
                log.debug("[" + m_mapDefName + "] Using DataSource: " + dataSourceId);                
            }            
            m_dataSource = (DataSource) preloadCache.get(dataSourceId);
            
            if (m_dataSource == null) {
                throw new SystemException("DataSource: " + dataSourceId + " is not defined");
            }
            
            m_tables = new HashMap();

            loadTables(m_templateElement, m_tables);
            if (log.isInfoEnabled()) {
                info("Loaded " + m_tables.size() + " tables");                
            }
            
            m_pivotNodes = new HashMap();
            m_rootPivotNodes = new LinkedHashMap();
            loadQueries(m_pivotNodes, m_rootPivotNodes);
            
            if (log.isInfoEnabled()) {
                info("Loaded " + m_pivotNodes.size() + " pivot nodes");
            }
            
            // Variables vistor is only relavent for the base map/query-def
            VariablesVistor vv = new VariablesVistor(m_templateElement);
            runVisitor(vv);
            
            postProcess(null);
        }
        else {
            throw new SystemException("File location for Pivot Definition is null");
        }
    }
    
    /**
     * Loads all of the pivot nodes in flat hash map structure.  Also constructs the 
     * pivot node tree.
     * 
     * @param pivotNodes
     * @throws SystemException
     */
    private void loadQueries(Map pivotNodes, Map rootPivotNodes) throws SystemException {
        
        try {
            for (Iterator i = XPath.selectNodes(m_templateElement, "Query").iterator(); i.hasNext();) {
                Element eQuery = (Element) i.next();
                
                PivotNode p = new PivotNode(m_service, eQuery, m_tables);
                pivotNodes.put(p.getName(), p);
                
                // determine whether this is a child of an existing Query.
                // This assumes that the pivot will be on an element rather than an attribute.
                String pivotName = p.getName();
                Iterator rootEntries = rootPivotNodes.values().iterator();
                PivotNode parent = findParentQuery(pivotName, rootEntries);
                
                // having found the parent we now need to see whether the new pivot will act as a
                // parent to any existing child queries. If so, adopt them.                
                Iterator possibleChildren = null;
                if ( parent == null )
                    possibleChildren = rootPivotNodes.values().iterator(); 
                else {
                    possibleChildren = parent.getChildNodes().values().iterator();
                }
                
                adoptChildren(p, possibleChildren);
                
                if ( parent == null ) {
                    rootPivotNodes.put(p.getName(), p);
                }
                else {
                    parent.addChildNode(p);
                }
                
                if (log.isDebugEnabled()) {
                    debug("Added pivot node " + p.getName());
                }
            }
        }
        catch(JDOMException e) {
            throw new SystemException("Unable to find element 'Query' in query definition file: "+e.getMessage(),e);
        }   
    }
    
    
    /**
     * Helper method which recursively searches queries to see whether the passed xpath
     * identifies an existing pivot node.
     * 
     * @param searchXPath
     * @param existingQueries
     * @return
     */
    private PivotNode findParentQuery(String searchXPath, Iterator existingQueries )
    {
        PivotNode parent = null;
        
        boolean bFoundParent = false;
        while (existingQueries.hasNext() && bFoundParent != true )
        {
            PivotNode exisitingQuery = (PivotNode)existingQueries.next();
            String existingPivotXPath = exisitingQuery.getName();

            if ( searchXPath.startsWith(existingPivotXPath) )
            {
                // this means there is definitely a parent
                bFoundParent = true;
            
                // but a child query may provide a more specific parent
                Iterator childrenIterator = exisitingQuery.getChildNodes().values().iterator();
                
                PivotNode moreSpecificParent = findParentQuery(searchXPath, childrenIterator);
                
                if ( moreSpecificParent == null )
                    parent = exisitingQuery;
                else
                    parent = moreSpecificParent;
            }
        }
        
        return parent;
    }
    
    /**
     * Helper method to make a new query adopt the children of any pre-existing child queries.
     * 
     * @param newParent
     * @param children
     */
    private void adoptChildren(PivotNode newParent, Iterator possibleChildren)
    {
        String pivotName = newParent.getName();
        while ( possibleChildren.hasNext() )
        {
            Pivot child = (Pivot)possibleChildren.next();
            String childPivotName = child.getName();
            
            if ( childPivotName.startsWith(pivotName) ) 
            {
                newParent.addChildNode(child);
                possibleChildren.remove();
            }
        }
    }
    
    
    /**
     * 
     * @param ds
     * @param element
     * @return
     * @throws SystemException 
     */
    private void loadTables(Element element, Map tables) throws SystemException {
        
        try {
            for(Iterator i = XPath.selectNodes(element, "//Table").iterator(); i.hasNext();) {
                Element table = (Element) i.next();
                
                String name = table.getAttributeValue("name");
                String alias = table.getAttributeValue("alias");
                
                if (log.isDebugEnabled()) {
                    debug("Table: " + name + ", alias: " + alias);
                }

                tables.put(alias, new Table(name.toUpperCase(), alias.toUpperCase()));
            }
        }
        catch(JDOMException e) {
            throw new SystemException("Unable to find any 'Table' elements in querying configuration: "+e.getMessage(),e);
        }
    }

    /**
     * Gets the name of the Map Definition from the QueryDef document.
     * 
     * @param dQueryDef
     * @return
     * @throws SystemException
     */
    public String getMapDefName(Element dQueryDef) throws SystemException {
        String mapDefName;
        try {
            mapDefName = MAP_DEF_LOCATION_PATH.valueOf(dQueryDef);
            if (mapDefName == null) {
                throw new SystemException("Unable to locate MapDef resource");
            }
        }
        catch (JDOMException e) {
            throw new SystemException("Unable to locate MapDef resource", e);
        }
        return mapDefName;
    }
    
    /**
     * Loads the Query Defintions from a resource and returns the root element.
     * 
     * @param queryDefName
     * @return
     * @throws SystemException
     */
    public Element getQueryDef(String queryDefName) throws SystemException {
        
        InputSource in = Util.getInputSource(queryDefName, this);
        Document tDoc = null;
        SAXBuilder saxBuilder = new SAXBuilder();
        
        try {
            tDoc = saxBuilder.build(in);
        }
        catch(IOException e) {
            throw new SystemException("Failed to process query definition file '"+queryDefName+"': "+e.getMessage(),e);
        }
        catch(JDOMException e) {
            throw new ConfigurationException("Failed to build JDOM for query definition file '"+queryDefName+"': "+e.getMessage(),e);
        }
        
        Element eQueryDef = tDoc.getRootElement();
        if (!"QueryDef".equals(eQueryDef.getName())) {
            throw new ConfigurationException("Query Definition file '" + queryDefName + "' does not have root element 'QueryDef'");
        }
        
        return tDoc.getRootElement();
    }
    
    
    /**
     * Loads the mapDef document and returns the detached root element.
     * @param mapDefName
     * @return
     * @throws SystemException 
     */
    public Element getMapDef(String mapDefName) throws SystemException {
        
        InputSource in = Util.getInputSource(mapDefName, this);
        SAXBuilder saxBuilder = new SAXBuilder();
        
        Document doc = null;
        try {
            doc = saxBuilder.build(in);
        }
        catch(IOException e) {
            throw new SystemException("Unable to load map file '"+mapDefName+"': "+e.getMessage(),e);
        }
        catch(JDOMException e) {
            throw new ConfigurationException("Unable to process map file '"+mapDefName+"': "+e.getMessage(),e);
        }
        
        Element eMapDef = doc.detachRootElement();
        if (!"DBMapDef".equals(eMapDef.getName())) {
            throw new ConfigurationException("Unable to find root element 'DBMapDef' in map file '"+mapDefName+"'");
        }
        
        return eMapDef;
    }
    
    
    /**
     * Walk the query definitions tree doing all of the necessary processing.
     * @throws SystemException 
     * @throws BusinessException 
     * @throws BusinessException 
     *
     */
    private void postProcess(String method) throws SystemException, BusinessException {
        
        LinkingVisitor lv = new LinkingVisitor(method);
        runVisitor(lv);
        
        // Get all of the dependendent variables.
        DependentVariablesVisitor dvv = new DependentVariablesVisitor(method); 
        for (Iterator i = m_rootPivotNodes.values().iterator(); i.hasNext();) {
            PivotNode p = (PivotNode) i.next();
            p.accept(dvv);
            if (method != null && dvv.getDependentVariables().size() > 0) {
                throw new SystemException("Outstanding dependent variables: " + dvv.getDependentVariables());
            }
        }
        
        // Cascade linked query constraints to child queries.
        CascadeConstraintsVisitor ccv = new CascadeConstraintsVisitor(method);
        runVisitor(ccv);
        
        // Preprocess any necessary SQL.
        PreprocessSQLVisitor psv = new PreprocessSQLVisitor(method);
        runVisitor(psv);            
    }
    
    
    private final static String PIVOT_NODE_ATTR = "pivotNode";
    private final static String QUERY_EXENTSIONS_ELEMENT = "QueryExtension";
    
    /**
     * Parses the query extensions and adds them to this pivot definitions.
     * 
     * @param processingInstructions
     * @param preloadCache
     * @throws SystemException 
     */
    public void addExtensions(String method, Element processingInstructions, Map preloadCache) throws SystemException, BusinessException {
        
        List eQueryExtensions = processingInstructions.getChildren(QUERY_EXENTSIONS_ELEMENT);
        
        for (Iterator i = eQueryExtensions.iterator(); i.hasNext();) {
            Element eQueryExtension = (Element) i.next();
            
            String name = eQueryExtension.getAttributeValue(PIVOT_NODE_ATTR);
            Pivot pivot = (Pivot) m_pivotNodes.get(name);
            if (pivot != null) {
                Select select = new SelectFactory().create(pivot, eQueryExtension);
                if (select instanceof EmptyJoinSelect) { // TODO This is nasty.
                    select = pivot.getSelect(null); // get the default select.
                }
                List constraints = new ConstraintFactory().create(eQueryExtension);
                // Start with the default tables & variables.
                HashMap allTables = new HashMap();
                loadTables(eQueryExtension, allTables);
                allTables.putAll(m_tables);
                
                Map tables = new HashMap();
                tables.putAll(pivot.getTables(null));
                String tableAliases = eQueryExtension.getAttributeValue("tables");
                if (tableAliases != null) {
                    PivotData.loadTables(tableAliases, allTables, tables);                    
                }
                Set variables = new TreeSet();
                variables.addAll(pivot.getVariables(null));
                Map parameters = getParameters(eQueryExtension);
                
                PivotData pData = PivotData.create(tables, variables, select, 
                        constraints, parameters, pivot.getConfig(null), eQueryExtension);
                
                pivot.addExtension(method, pData);
                
            }
            else {
                throw new SystemException("[" + method + "] Unable to locate pivot node: " + name);
            }
        }
        
        // Now do all of the tree walking for that specific method.
        postProcess(method);
    }
    
    
    
    private final static String NAME_ATTR = "name";
    private final static String XPATH_ATTR = "xpath";
    private final static String PARAMETER_ELEMENT = "Param";
    
    /**
     * Loads all of the 'Param' nodes for a given query extension in to Map.
     * 
     * @param eQueryExtension
     * @return
     * @throws SystemException
     */
    public Map getParameters(Element eQueryExtension) throws SystemException {
        List eParams = eQueryExtension.getChildren(PARAMETER_ELEMENT);
        Map parameters = new HashMap();
        for (Iterator i = eParams.iterator(); i.hasNext();) {
            Element eParam = (Element) i.next();
            String name = eParam.getAttributeValue(NAME_ATTR);
            String xpath = eParam.getAttributeValue(XPATH_ATTR);
            if (name == null || name.trim().length() == 0 || xpath == null || xpath.trim().length() == 0) {
                throw new SystemException("Invalid param node, name = " + name + " xpath = " + xpath);
            }
            parameters.put(name, xpath);
        }
        return parameters;
    }
    
    
    public void runVisitor(Visitor v) throws SystemException, BusinessException {
        for (Iterator i = m_rootPivotNodes.values().iterator(); i.hasNext();) {
            PivotNode p = (PivotNode) i.next();
            p.accept(v);
        }
    }
    
    
    
    /**
     * Gets the name of the map definition file.
     * 
     * @return
     */
    public String getMapDefName() {
        return m_mapDefName;
    }
    
    /**
     * Gets the name of the query definitions file.
     * 
     * @return
     */
    public String getQueryDefName() {
        return m_queryDefName;
    }
    
    public DataSource getDataSource() {
        return m_dataSource;
    }
    
    private void info(String s) {
        log.info("[" + m_queryDefName +"] " + s);                        
    }
    
    private void debug(String s) {
        log.info("[" + m_queryDefName +"] " + s);                        
    }
    
    public String toString() {
        
        StringBuffer sb = new StringBuffer();
        
        for (Iterator i = m_rootPivotNodes.values().iterator(); i.hasNext();) {
            Pivot p = (Pivot) i.next();
            sb.append(p);
        }
        
        return sb.toString();
    }

    /**
     * Gets a pivot node for a named path.
     * 
     * @param currentPath
     * @return
     */
    public Pivot getPivotNode(String currentPath) {
        
        return (Pivot) m_pivotNodes.get(currentPath);
    }
    
    
    
    private MapElement loadMapElement(Element node) {
        
        MapElement me = new MapElement(node.getName());
        Iterator attributes = node.getAttributes().iterator();
        while (attributes.hasNext()) {
            Attribute attribute = (Attribute) attributes.next();
            String name = attribute.getName();
            String[] variables = getVariables(attribute.getValue());
            MapNode mn = new MapNode(name, variables);
            me.addAttribute(mn);
        }
        
        Iterator texts = node.getContent(S_TEXTFILTER).iterator();
        while (texts.hasNext()) {
            String[] variables = getVariables(((Text) texts.next()).getText());
            MapNode mn = new MapNode("", variables);
            me.addText(mn);
        }
        
        Iterator elements = node.getContent(S_ELEMENTFILTER).iterator();
        while (elements.hasNext()) {
            Element e = (Element) elements.next();
            MapElement child = loadMapElement(e);
            me.addElement(child);
        }
        
        return me;
        
    }
    
    
    private String[] getVariables(String text) {

        List l = new ArrayList();
        Matcher vars = Query.s_variablePattern.matcher(text);
        while (vars.find()) {
            String variable = vars.group(1).toUpperCase();
            l.add(variable);
        }
        
        return (String[]) l.toArray(new String[0]);
        
    }
    

    /**
     * Get the root element of the Mapping.
     * 
     * @return
     * @throws JDOMException 
     */
    public Element getMapElement() throws JDOMException {
        
        Element e = (Element) MAP_ROOT_PATH.selectSingleNode(m_templateElement);
        // TODO This is a little dangerous...
        return (Element) e.getChildren().get(0);
        
    }
    
    public MapElement getMapRoot() {
        return m_mapRoot;
    }
    
}
