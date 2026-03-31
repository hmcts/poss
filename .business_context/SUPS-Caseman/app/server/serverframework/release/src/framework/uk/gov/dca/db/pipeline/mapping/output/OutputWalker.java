/*
 * Created on 17-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline.mapping.output;

import java.io.IOException;
import java.io.Writer;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.Table;
import uk.gov.dca.db.pipeline.mapping.MapElement;
import uk.gov.dca.db.pipeline.mapping.MapNode;
import uk.gov.dca.db.pipeline.mapping.Pivot;
import uk.gov.dca.db.pipeline.mapping.PivotDefinitions;
import uk.gov.dca.db.pipeline.mapping.executor.Executor;
import uk.gov.dca.db.pipeline.mapping.select.Select;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.SUPSLogFactory;
import uk.gov.dca.db.util.XMLUtil;

/**
 * Walks the mapping document outputting XML as a string as it processes.
 * 
 * @author Michael Barker
 *
 */
public class OutputWalker {

    private final MapElement m_mapRoot;
    private final PivotDefinitions m_pivotDefinitions;
    private String m_methodName;
    private DataSource m_ds;
    private Connection m_cn;
    private final static Log log = SUPSLogFactory.getLogger(OutputWalker.class);
    private final HashMap executorCache = new HashMap();
    private Document m_parameters;
    private boolean m_firstOutputElement = true;

    public OutputWalker(PivotDefinitions pivotDefinitions) throws JDOMException {
        m_pivotDefinitions = pivotDefinitions;
        m_ds = pivotDefinitions.getDataSource();
        m_mapRoot = pivotDefinitions.getMapRoot();
    }

    public Connection getConnection() throws SystemException {
        if (m_cn == null) {
            throw new SystemException("Connection has not been opened");
        }
        return m_cn;
    }
    
    
    /**
     * Gets the current connection for this Visitor.  If it is
     * already open simply increments the connection count.
     * 
     * @return
     * @throws SQLException
     */
    public void openConnection() throws SystemException {
        
        try {
            if (m_cn == null) {
                log.debug("Opening connection");
                m_cn = m_ds.getConnection();
            }
        }
        catch (SQLException e) {
            throw new SystemException("Unable to open database connection: " + e.getMessage(), e);
        }
    }
    
    /**
     * Releases the current connection.  Decrements the connection
     * count until it goes to 0.
     */
    public void closeConnection() {
        log.debug("Closing connection");
        DBUtil.quietClose(m_cn);
        m_cn = null;
    }
    
    
    /**
     * Output the data to the supplied writer.
     * 
     * @param out
     * @throws SystemException 
     * @throws BusinessException 
     */
    public void output(String methodName, Document parameters, Writer out) throws SystemException, BusinessException {
        Context context = new Context();
        context.push(new HashMap());
        m_methodName = methodName;
        m_parameters = parameters;
        
        try {
            openConnection();
            processNode(context, 0, "/" + m_mapRoot.getName(), m_mapRoot, out);            
        }
        finally {
            closeConnection();
        }
    }
    
    /**
     * Gets the appropriate executor for this pivot node.  Will cache and resuse any executors that
     * can be cached.
     * 
     * @param select
     * @param methodName
     * @param path
     * @return
     * @throws SystemException 
     */
    private Executor getExecutor(Select select, String methodName, String path) throws SystemException {
        
        Executor result;
        if (executorCache.containsKey(path)) {
            result = (Executor) executorCache.get(path);
        }
        else {
            result = select.createExecutor(methodName);
            if (result.isCacheable()) {
                executorCache.put(path, result);
            }
        }
        
        // Get the delegate executor.
        String linkedParent = result.getLinkedParent();
        if (linkedParent != null) {
            result = (Executor) executorCache.get(linkedParent);
            if (result == null) {
                throw new SystemException("[" + select.getName() + "] Unable to find parent executor: " + linkedParent);
            }
            result = result.getDelegateExecutor(select.getName());
        }
        
        return result;
        
    }
    
    /**
     * Loads all of the query extension parameters.
     * 
     * @param parameters
     * @param context
     * @throws JDOMException
     * @throws SystemException 
     */
    public void loadParameters(Map parameters, Context context) throws SystemException {
        
        for (Iterator i = parameters.entrySet().iterator(); i.hasNext();) {
            Map.Entry entry = (Map.Entry) i.next();
            String name = (String) entry.getKey();
            String xpathStr = (String) entry.getValue();
            
            Object result = null;
            try {
            	result = XPath.selectSingleNode(m_parameters, xpathStr);
            	
                String value = null;
                
                if(result instanceof Attribute) {
                    value = ((Attribute)result).getValue();
                } 
                else if (result instanceof Element) {
                    value = ((Element)result).getTextNormalize();
                }
                
                if (value != null) {
                    context.setValue(name, value);
                    context.setValue(name.toUpperCase(), value);
                }
            }
            catch(JDOMException e) {
                throw new SystemException("Unable to evalute XPath: " + xpathStr);
            }
        }            
    }
    
    
    /**
     * Processes the current node, the recurses through the map.
     * 
     * @param context
     * @param level
     * @param currentPath
     * @param element
     * @param out
     * @throws SystemException 
     * @throws BusinessException 
     * @throws BusinessException 
     */
    public void processNode(Context context, int level, String currentPath, MapElement element, Writer out) throws SystemException, BusinessException {
        
        Pivot pivot = m_pivotDefinitions.getPivotNode(currentPath);
        
        if (pivot != null) {
            if (log.isDebugEnabled()) {
                log.debug("Processing node: " + pivot.getName());                
            }
            boolean isModifiable = pivot.isModifiable();
            Map tables = pivot.getTables(m_methodName);
            Select select = pivot.getSelect(m_methodName);
            Map parameters = pivot.getParameters(m_methodName);
            // TODO: This can be precalculated.
            
            // Push a context for this parameters.
            context.push(new HashMap());
            loadParameters(parameters, context);
            Connection cn = null;
            Executor exec = getExecutor(select, m_methodName, currentPath);

            try {
                cn = getConnection();
                exec.open(cn, m_parameters, context);
                Map m = new HashMap();
                context.push(m);
                while (exec.next()) {
                    exec.load(context);
                    writeElement(context, level, currentPath, element, tables, isModifiable, out);
                }
                context.pop();
            }
            finally {
                closeExecutor(exec);
            }
            
            // Pop the context for the parameters.
            context.pop();
           
        }
        else {
            // Only at pivot nodes do we output SCNs.
            writeElement(context, level, currentPath, element, null, false, out);
            //xwriteElement(context, level, currentPath, element, out);            
        }
        
    }
    
    /**
     * Closes an executor without throwing a NPE
     * 
     * @param exec
     */
    private void closeExecutor(Executor exec) {
        if (exec != null) {
            exec.close();
        }
    }
    
    
    /**
     * Writes out the supplied element, will recursively call back the process node call in order
     * to process child elements.
     * 
     * @param context
     * @param level
     * @param currentPath
     * @param element
     * @param out
     * @throws SystemException
     * @throws BusinessException 
     */
    private void writeElement(Context context, int level, String currentPath, MapElement element, Map tables, boolean isModifiable, Writer out) 
        throws SystemException, BusinessException
    {
        try {
        	if ( m_firstOutputElement == true ) 
        	{
        		//only write out XML header when we have a doc to output
                out.write("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n");
                m_firstOutputElement=false;
        	}
        	
            writeIndent(level, out);
            out.write("<");
            out.write(element.getName());
            Iterator attributes = element.getAttributes().iterator();
            while (attributes.hasNext()) {
                MapNode attr = (MapNode) attributes.next();
                out.write(" ");
                out.write(attr.getName());
                out.write("=\"");
                writeParameters(context, attr.getVariables(), true, out);
                out.write("\"");
            }
            out.write(">");
    
            // TODO Implement SCNs
            // output scn numbers but only if we are processing a pivot node and it is modfiable
            if ( isModifiable ) {
                Iterator it = tables.values().iterator();
                while( it.hasNext() ) {
                    Table table = (Table)it.next();
                    Object oSCN = null;
                    oSCN = context.getValue(table.getAlias() + "_ORA_ROWSCN");
                    // we allow null SCNs (i.e. don't throw an exception) because it may be a valid result if 
                    // doing an outer join - however, don't output the SCN tag in this case
                    if ( oSCN != null ) {
                        String sSCN = oSCN.toString();
    
                        out.write("\r\n");
                        writeIndent(level+1, out);
                        out.write("<SCN table=\"" + table.getAlias() + "\">" + sSCN + "</SCN>");
                    }           
                } 
            }
            
            //Write content
            List list = element.getElements();
            boolean hasElements = !list.isEmpty();
            
            if (hasElements) {
                out.write("\r\n");
                Iterator i = list.iterator();
                while (i.hasNext()) {
                    MapElement newElement = (MapElement) i.next();
                    // Recurse onto child elements.
                    processNode(context, level + 1, currentPath + "/" + newElement.getName(), newElement, out);
                }
            } 
            else {
                Iterator text = element.getTexts().iterator();
                while (text.hasNext()) {
                    MapNode mn = (MapNode) text.next();
                    writeParameters(context, mn.getVariables(), false, out);
                }
            }
            if (hasElements) {
                writeIndent(level, out);
            }
            out.write("</");
            out.write(element.getName());
            out.write(">\r\n");
        }
        catch(IOException e) {
            throw new SystemException("Failed to write to pipeline component output: "+e.getMessage(),e);
        }
    }
    
    /**
     * Writes the supplied parameters out to the writer.
     * 
     * @param context
     * @param text
     * @param isAttribute
     * @param out
     * @throws SystemException
     */
    private void writeParameters(Context context, String[] variables, boolean isAttribute, Writer out)
        throws SystemException
    {
        try {
            for (int i = 0; i < variables.length; i++) {
                Object result = context.getValue(variables[i]);
                String sResult = "";
                if (result != null)  {
                    sResult = XMLUtil.encode(result.toString());
                }
              
                out.write( sResult );
            }
        }
        catch(IOException e){
            throw new SystemException("Failed to write to pipeline component output: "+e.getMessage(),e);
        }
    }
    
    
    
    /**
     * Loads the result of into this supplied context.
     * 
     * @param rsmd
     * @param rs
     * @param context
     * @throws SQLException
     */
    public void loadResult(ResultSetMetaData rsmd, ResultSet rs, Context context) throws SQLException {
        
        for (int i = 1; i < rsmd.getColumnCount(); i++) {
            context.setValue(rsmd.getColumnName(i), rs.getObject(i));
        }
    }
    
    /**
     * Write the indent level.
     * 
     * @param level
     * @throws IOException
     */
    private void writeIndent(int level, Writer out) throws IOException {
        //TODO: allow on and off of indent mode
        
        switch (level) {
        case 0:
            out.write("");
            break;
        case 1:
            out.write("  ");
            break;
        case 2:
            out.write("    ");
            break;
        case 3:
            out.write("      ");
            break;
        case 4:
            out.write("        ");
            break;
        case 5:
            out.write("          ");
            break;
        case 6:
            out.write("            ");
            break;
        case 7:
            out.write("              ");
            break;
        case 8:
            out.write("                ");
            break;
        case 9:
            out.write("                  ");
            break;
        case 10:
            out.write("                    ");
            break;
        case 11:
            out.write("                      ");
            break;
        case 12:
            out.write("                        ");
            break;
        case 13:
            out.write("                          ");
            break;
        case 14:
            out.write("                            ");
            break;
        case 15:
            out.write("                              ");
            break;
        case 16:
            out.write("                                ");
            break;
        default:
            for (int i = 0; i < level; i++) {
                out.write("  ");
            }
        }
    }

    
}
