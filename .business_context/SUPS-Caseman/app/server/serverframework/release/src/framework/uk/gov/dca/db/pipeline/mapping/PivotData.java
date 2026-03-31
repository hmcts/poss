/*
 * Created on 22-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jdom.Element;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.Table;
import uk.gov.dca.db.pipeline.mapping.select.Select;

public class PivotData {

    protected static final Pattern S_LIST_PATTERN = Pattern.compile("\\b(\\w+)\\b");
    
    private final Map tables;
    private final Set variables;
    private final Select select;
    private final List constraints;
    private final Map parameters;
    private final PivotConfig config;
    
    
    public PivotData(Map tables, Set variables, Select select, List constraints, 
            Map parameters, PivotConfig config) {
        this.tables = tables;
        this.variables = variables;
        this.select = select;
        this.constraints = constraints;
        this.parameters = parameters;
        this.config = config;
    }
    
    /**
     * Ugh, copy constructor.  Find a way to get rid of this!!
     * @param pData
     */
    public PivotData(PivotData pData) {
        tables = new HashMap();
        tables.putAll(pData.getTables());
        variables = new TreeSet();
        variables.addAll(pData.getVariables());
        select = pData.getSelect();
        constraints = new ArrayList();
        constraints.addAll(pData.getConstraints());
        parameters = new HashMap();
        parameters.putAll(pData.getParameters());
        config = new PivotConfig(pData.getConfig());
    }

//    public PivotData(Map tables, Set variables, Select select, boolean isSelectDistinct) {
//        this(tables, variables, select, new ArrayList(0), new HashMap(), isSelectDistinct);
//    }
    
    public Map getParameters() {
        return parameters;
    }

    public List getConstraints() {
        return constraints;
    }
    
    /**
     * @return Returns the select.
     */
    public Select getSelect() {
        return select;
    }

    /**
     * @return Returns the tables.
     */
    public Map getTables() {
        return tables;
    }

    /**
     * @return Returns the variables.
     */
    public Set getVariables() {
        return variables;
    }
    
    public PivotConfig getConfig() {
        return config;
    }
    

    public static PivotData create(Map tables, Set variables, Select select, 
    		List constraints, Map parameters, PivotConfig config, Element eQuery) throws SystemException {
        
        PivotConfig pc = PivotConfig.create(config, eQuery);
        
        return new PivotData(tables, variables, select, constraints, parameters, pc);
    }
    
    
    /**
     * Extract the tables that are required for this pivot node.
     * 
     * @param tableAliases A space seperated list of table aliases.
     * @param tables The map of all of the tables used in mapping.
     * @throws SystemException 
     */
    public static Map loadTables(String tableAliases, Map tables) throws SystemException {
        Map localTables = new LinkedHashMap();
        loadTables(tableAliases, tables, localTables);
        return localTables;
    }

    /**
     * Extract the tables that are required for this pivot node.
     * 
     * @param tableAliases
     * @param allTables
     * @param tables
     * @throws SystemException
     */
    public static void loadTables(String tableAliases, Map allTables, Map tables) throws SystemException {
        
        Matcher tableMatches = S_LIST_PATTERN.matcher(tableAliases);
        while (tableMatches.find()) {
            String alias = tableMatches.group(1).toUpperCase();
            Table table = (Table) allTables.get(alias);
            if (table != null) {
                tables.put(table.getAlias(), table);                
            }
            else {
                throw new SystemException("Table for alias: " + alias + " is not defined");
            }
        }
        
    }
    
    
    
    
    
}
