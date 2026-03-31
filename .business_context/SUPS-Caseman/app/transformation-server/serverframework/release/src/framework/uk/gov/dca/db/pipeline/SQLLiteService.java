/*
 * Created on 22-Mar-2005
 *
 */
package uk.gov.dca.db.pipeline;

import java.io.IOException;
import java.io.StringReader;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
//import java.util.Set;
import java.util.HashMap;
import java.util.Iterator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.pipeline.query.sql.*;

/**
 * A component used to execute a single parameterised SQL statement. 
 * Can be configured to output XML or to pass on the original input.
 * See design document for further details.
 * 
 * @author GrantM
 *
 */
public class SQLLiteService extends AbstractComponent implements IGenerator {
	// statics for XML elements
	private final static String SQLLITE_ELEMENT = "SQLLite";
	private final static String SQL_ELEMENT = "SQL";
	private final static String DATASOURCE_ELEMENT = "DataSource";
	private final static String PARAM_ELEMENT = "Param";
	private final static String UPDATE_OUTPUT_ELEMENT = "RowsUpdated";
	private final static String COLUMN_OUTPUT_ELEMENT = "column";
	
	// statics for XML attributes
	private final static String OUTPUT_ATTR = "output";
	private final static String RESULTSET_ELEMENT_ATTR = "resultset-element";
	private final static String ROW_ELEMENT_ATTR = "row-element";
	private final static String FIELD_NAME_AS_ATTR = "field-name-as";
	private final static String DATASOURCE_ID_ATTR = "id";
	private final static String PARAM_NAME_ATTR = "name";
	private final static String PARAM_XPATH_ATTR = "xpath";
	private final static String SQL_TYPE_ATTR = "type";
	private final static String OUTPUT_NAME_ATTR = "name";
	private final static String FORMAT_OUTPUT_ATTR = "format-output";
	
	// statics for XML attribute/element values
	private final static String NEW_OUTPUT_VAL = "new";
	private final static String INPUT_OUTPUT_VAL = "input";
	private final static String FIELD_AS_ATTR_VAL = "attribute";
	private final static String FIELD_AS_ELEMENT_VAL = "element";
	private final static String DEFAULT_RESULTSET_ELEMENT_VAL = "resultset";
	private final static String DEFAULT_ROW_ELEMENT_VAL = "row";
	private final static String SELECT_SQL_TYPE_VAL = "select";
	private final static String INSERT_SQL_TYPE_VAL = "insert";
	private final static String UPDATE_SQL_TYPE_VAL = "update";
	private final static String DELETE_SQL_TYPE_VAL = "delete";
	private final static String TRUE_VAL = "true";
	private final static String FALSE_VAL = "false";
	
	// other constants
	private static final Pattern PARAM_NAME_PATTERN = Pattern.compile("\\b(\\w+)\\.(\\w+)\\b");
    private static final Pattern PARAM_REFERENCE_PATTERN = Pattern.compile("\\$\\{([^}]+)\\}");
    private static final String XML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n";
    private static final String OUTPUT_INDENTATION = "  ";
    
	// data members
	private boolean m_newOutput = true;
	private String m_resultsetElement = DEFAULT_RESULTSET_ELEMENT_VAL;
	private String m_rowElement = DEFAULT_ROW_ELEMENT_VAL;
	private boolean m_fieldNameAsAttribute = true;
	private String m_dataSourceId = null;
    private DataSource m_connectionPool = null;
    private Map m_parameterDefinitions = new HashMap();
    private List m_parameterQueryOrder = new ArrayList();
    private String m_sqlQueryRaw = null;
    private SQLStatementFactory m_statementFactory = new SQLStatementFactory(SELECT_SQL_TYPE_VAL);
    private SQLStatement m_sqlStatement = null;
    private boolean m_formatOutput = false;
    
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#validate(java.lang.String, uk.gov.dca.db.queryengine.QueryEngineErrorHandler, org.jdom.Element, java.util.Map)
	 */
	public void validate(String methodId, QueryEngineErrorHandler handler,
			Element processingInstructions, Map preloadCache)
			throws SystemException 
	{
		if ( !initialiseOutputType(processingInstructions) ) {
			handler.raiseError(methodId + " has invalid " + this.getName() + " '" +OUTPUT_ATTR+ 
					"' attribute. Should be one of: " + NEW_OUTPUT_VAL +","+INPUT_OUTPUT_VAL);
		}
		
		if ( !initialiseOutputFormat(processingInstructions) ) {
			handler.raiseError(methodId + " has invalid " + this.getName() + " '" +FORMAT_OUTPUT_ATTR+ 
					"' attribute. Should be one of: " + TRUE_VAL +","+FALSE_VAL);
		}
		
		if ( !initialiseResultsetElement( processingInstructions ) ) {
			handler.raiseError(methodId + " has invalid " + this.getName() + " '" +RESULTSET_ELEMENT_ATTR+ "' attribute.");
		}
		
		if ( !initialiseRowElement( processingInstructions ) ) {
			handler.raiseError(methodId + " has invalid " + this.getName() + " '" +ROW_ELEMENT_ATTR+ "' attribute.");
		}
		
		if ( !initialiseFieldNameAs( processingInstructions ) ) {
			handler.raiseError(methodId + " has invalid " + this.getName() + " '" +FIELD_NAME_AS_ATTR+ 
					"' attribute. Should be one of: " + FIELD_AS_ELEMENT_VAL +","+FIELD_AS_ATTR_VAL);
		}
		
		if ( initialiseDatasourceId( processingInstructions.getChild(DATASOURCE_ELEMENT) ) ) {
			if ( !preloadCache.containsKey(m_dataSourceId) ) {
				handler.raiseError(methodId + " " + this.getName() + " references datasource with id '" +
						m_dataSourceId +	"' that is not defined in 'project_config.xml'");
			}
		}
		else {
			handler.raiseError(methodId + " has no datasource defined for " + this.getName());
		}
		
		// read in parameter definitions
		// done like this (rather than like 'initialiseSQL') so can get multiple errors output
		// concerning the parameters.
		List lParams = processingInstructions.getChildren(PARAM_ELEMENT);
		Iterator itParams = lParams.iterator();
		ParamDef newParamDef = null;
		Element eParam = null;
		String paramName = null;
		String paramXPath = null;
		boolean validParamName = false;
		
		while (itParams.hasNext()){
			eParam = (Element)itParams.next();
			if ( eParam != null ) {
				paramName = eParam.getAttributeValue(PARAM_NAME_ATTR);
				try {
					validParamName = validateParamName(paramName);
				}
				catch( ConfigurationException e) {
					handler.raiseError(e.getMessage());
				}
				
				paramXPath = eParam.getAttributeValue(PARAM_XPATH_ATTR);
				if ( paramXPath == null || paramXPath.length() == 0 ) {
					handler.raiseError(this.m_name + " parameter '"+paramName+"' has no XPath defined");
				}
				else if (validParamName) {
					newParamDef = new ParamDef(paramName, paramXPath);
					m_parameterDefinitions.put(newParamDef.toString(), newParamDef);
					
					validParamName = false;
				}
			}
		}
		
		// validate the SQL
		Element eSQL = processingInstructions.getChild(SQL_ELEMENT);
		try { 
			initialiseSQL( eSQL );
		}
		catch( ConfigurationException e) {
			handler.raiseError(e.getMessage());
		}
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#preloadCache(org.jdom.Element, java.util.Map)
	 */
	public void preloadCache(Element processingInstructions, Map preloadCache)
			throws SystemException {
		// We have nothing to preload
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.IComponent#prepare(org.jdom.Element, java.util.Map)
	 */
	public void prepare(Element processingInstructions, Map preloadCache)
			throws SystemException 
	{
		// extract config from the XML
		initialiseOutputType( processingInstructions );
		
		if ( m_newOutput == true ) {
			// New output XML will be created so handle output element config
			initialiseOutputFormat( processingInstructions );
			initialiseResultsetElement( processingInstructions );
			initialiseRowElement( processingInstructions );
			initialiseFieldNameAs( processingInstructions );
		}
		
		// get the datasource (that provides the db connections)
		if ( initialiseDatasourceId( processingInstructions.getChild(DATASOURCE_ELEMENT) ) ) {
			m_connectionPool = (DataSource)preloadCache.get(m_dataSourceId);
			
			if ( m_connectionPool == null ) {
				throw new ConfigurationException("Failed to find datasource with id '"+m_dataSourceId+"'");
			}
		}
		else {
			throw new ConfigurationException("No datasource configured for "+this.m_name);
		}
		
		// read in parameter definitions
		List lParams = processingInstructions.getChildren(PARAM_ELEMENT);
		Iterator itParams = lParams.iterator();
		ParamDef newParamDef = null;
		Element eParam = null;
		String paramName = null;
		String paramXPath = null;
		boolean validParamName = false;
		
		while (itParams.hasNext()){
			eParam = (Element)itParams.next();
			if ( eParam != null ) {
				paramName = eParam.getAttributeValue(PARAM_NAME_ATTR);
				validParamName = validateParamName(paramName);
				
				paramXPath = eParam.getAttributeValue(PARAM_XPATH_ATTR);
				if ( paramXPath == null || paramXPath.length() == 0 ) {
					throw new ConfigurationException(this.m_name + " parameter '"+paramName+"' has no XPath defined");
				}
				else if (validParamName) {
					newParamDef = new ParamDef(paramName, paramXPath);
					m_parameterDefinitions.put(newParamDef.toString(), newParamDef);
					
					validParamName = false;
				}
			}
		}
		
		// now look at the SQL itself
		Element eSQL = processingInstructions.getChild(SQL_ELEMENT);
		if ( initialiseSQL( eSQL ) ) {
			// finally, create the sql statement
			m_sqlStatement = m_statementFactory.createSQLStatement(eSQL, null);
		}
	}
	

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.AbstractComponent#process()
	 */
	protected void process() throws BusinessException, SystemException {
		String sInput = m_dataSrc.toString();
		
		try {
			//handle case where output=input
			if ( this.m_newOutput == false ) {
				//assume input is correctly formed i.e. includes header etc
				//(won't reach next component if not anyway)
				m_dataSink.write(sInput);
			}
			else {
				//output xml header. The values in the xml header should probably be parameterised
				//throughout the framework...
				m_dataSink.write(XML_HEADER);
			}
		}
		catch(IOException e) {
			throw new SystemException(this.getName() + " failed to write to output: "+e.getMessage(),e);
		}
		
		// create XML from the input
		SAXBuilder builder = new SAXBuilder();
		Document parameters = null;
		try {
			parameters = builder.build( new StringReader(sInput) );
		}
		catch( IOException e ) {
    		throw new SystemException("Failed to read pipeline component input: "+e.getMessage(),e);
		}
		catch( JDOMException e ) {
    		throw new BusinessException("Failed to process pipeline component input: "+e.getMessage(),e);
		}
		
		//initialise the context variables (used to store parameter values extracted from the input)
		ContextVariables contextVariables = createRequestContext(parameters);
		
		//prepare the query
		Connection dbConnection = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		
		try {
			dbConnection = m_connectionPool.getConnection();
			
			if ( m_sqlStatement instanceof DynamicSQLStatement )
				ps = ((DynamicSQLStatement)m_sqlStatement).prepare(dbConnection, contextVariables, parameters.getRootElement());
			else	
				ps = m_sqlStatement.prepare(dbConnection, contextVariables);
			
			//do the query
			if ( m_sqlStatement.getType().equals(StatementType.SELECT) ) {
				rs = ps.executeQuery();
				if ( this.m_newOutput == true ) {
					outputSelectXML(rs);
				}
			}
			else {
				int updates = ps.executeUpdate();
				if ( this.m_newOutput == true ) {
					outputUpdateXML(updates);
				}
			}
		}
		catch(SQLException e) {
			throw new SystemException(this.getName()+" encountered a database error: "+e.getMessage(),e);
		}
		finally {
			if ( rs != null ) {
				try {
					rs.close();
				}
				catch(SQLException e) {}
			}
			if ( ps != null ) {
				try {
					ps.close();
				}
				catch(SQLException e) {}
			}
			if ( dbConnection != null ) {
				try {
					dbConnection.close();
				}
				catch(SQLException e) {}
			}
		}
	}

	/**
	 * Validates an input parameter name.
	 * 
	 * @param paramName
	 * @return
	 * @throws ConfigurationException
	 */
	private boolean validateParamName(String paramName) throws ConfigurationException {
		boolean bValid = false;
		
		if ( paramName == null || paramName.length() == 0 ) {
			throw new ConfigurationException("A parameter with no name has been defined for "+this.m_name);
		}
		else {
			if ( isValidParamNameFormat(paramName) ) {
				if ( m_parameterDefinitions.containsKey(paramName) ) {
					throw new ConfigurationException(this.m_name + " parameter '"+paramName+"' is defined more than once");
				}
				else {
					bValid = true;
				}
			}
			else {
				throw new ConfigurationException(this.m_name + " parameter name '"+paramName+"' should be of the form '<param group>.<param name>'");
			}
		}
		
		return bValid;
	}
	
	/**
	 * Validates and initialises the output type (new xml or equal to the input)
	 * 
	 * @param eParent
	 * @return - true if a valid value was provided, false if not
	 */
	private boolean initialiseOutputType(Element eParent) {
		boolean bValid = true;
		m_newOutput = true; // default value
		
		Attribute outputAttr = eParent.getAttribute(OUTPUT_ATTR);
		if ( outputAttr != null ) {
			String outputType = outputAttr.getValue();
			
			if ( outputType == null || outputType.length() == 0 )
				bValid = false;
			else
			{
				if ( INPUT_OUTPUT_VAL.compareToIgnoreCase(outputType) == 0 ) {
					m_newOutput = false;
				}	
				else if ( NEW_OUTPUT_VAL.compareToIgnoreCase(outputType) != 0	) {
					bValid = false;
				}
			}
		}
		
		return bValid;
	}
	
	/**
	 * Validates and initialises the output format.
	 * 
	 * @param eParent
	 * @return
	 */
	private boolean initialiseOutputFormat(Element eParent) {
		boolean bValid = true;
		m_formatOutput = false; // default value
		
		Attribute formatAttr = eParent.getAttribute(FORMAT_OUTPUT_ATTR);
		if ( formatAttr != null ) {
			String formatOutput = formatAttr.getValue();
			
			if ( formatOutput == null || formatOutput.length() == 0 )
				bValid = false;
			else
			{
				if ( TRUE_VAL.compareToIgnoreCase(formatOutput) == 0 ) {
					m_formatOutput = true;
				}	
				else if ( FALSE_VAL.compareToIgnoreCase(formatOutput) != 0	) {
					bValid = false;
				}
			}
		}
		
		return bValid;
	}
	
	/**
	 * Validates and initialises the output resultset element name
	 * 
	 * @param eParent
	 * @return
	 */
	private boolean initialiseResultsetElement(Element eParent) {
		boolean bValid = true;
		m_resultsetElement = DEFAULT_RESULTSET_ELEMENT_VAL;
		
		Attribute rsAttr = eParent.getAttribute(RESULTSET_ELEMENT_ATTR);
		if ( rsAttr != null ) {
			String rsName = rsAttr.getValue();
			
			if ( rsName == null || rsName.length() == 0 )
				bValid = false;
			else
				m_resultsetElement = rsName;
		}
		
		return bValid;
	}
	
	/**
	 * Validates and initialises the output row element name
	 * 
	 * @param eParent
	 * @return
	 */
	private boolean initialiseRowElement(Element eParent) {
		boolean bValid = true;
		m_rowElement = DEFAULT_ROW_ELEMENT_VAL;
		
		Attribute rowAttr = eParent.getAttribute(ROW_ELEMENT_ATTR);
		if ( rowAttr != null ) {
			String rowName = rowAttr.getValue();
			
			if ( rowName == null || rowName.length() == 0 )
				bValid = false;
			else
				m_rowElement = rowName;
		}
		
		return bValid;
	}
	
	/**
	 * Validates and initialises how the field name is to be output 
	 * 
	 * @param eParent
	 * @return
	 */
	private boolean initialiseFieldNameAs(Element eParent) {
		boolean bValid = true;
		m_fieldNameAsAttribute = true; // default value
		
		Attribute fieldNameAsAttr = eParent.getAttribute(FIELD_NAME_AS_ATTR);
		if ( fieldNameAsAttr != null ) {
			String fieldNameAs = fieldNameAsAttr.getValue();
			
			if ( fieldNameAs == null || fieldNameAs.length() == 0 )
				bValid = false;
			else
			{
				if ( FIELD_AS_ELEMENT_VAL.compareToIgnoreCase(fieldNameAs) == 0 ) {
					m_fieldNameAsAttribute = false;
				}	
				else if ( FIELD_AS_ATTR_VAL.compareToIgnoreCase(fieldNameAs) != 0	) {
					bValid = false;
				}
			}
		}
		
		return bValid;
	}
	
	/**
	 * Validates and initialises the datasource id 
	 * 
	 * @param eParent
	 * @return
	 */
	private boolean initialiseDatasourceId(Element eParent) {
		boolean bValid = false; 
	
		if ( eParent != null ) {
			String sLookupId = eParent.getAttributeValue(DATASOURCE_ID_ATTR);
			if ( sLookupId != null && sLookupId.length() > 0 ) {
				m_dataSourceId = sLookupId;
				bValid = true;
			}
		}
		
		return bValid;
	}
	
	/**
	 * Initialises and validates the SQL.
	 * 
	 * @param eParent
	 * @return
	 * @throws ConfigurationException
	 */
	private boolean initialiseSQL(Element eSQL) throws ConfigurationException {
		boolean bValid = false;
		
		if ( eSQL == null ) {
			throw new ConfigurationException(this.m_name + " has no SQL element defined");
		}
		
		m_sqlQueryRaw = eSQL.getText();
			
		if ( m_sqlQueryRaw == null || m_sqlQueryRaw.length() == 0 ) {
			throw new ConfigurationException(this.m_name + " has no SQL defined");
		}
		
		// get SQL type
		String sqlType = eSQL.getAttributeValue(SQL_TYPE_ATTR);
		if (sqlType != null && sqlType.length() > 0 && 
				sqlType.compareTo(SELECT_SQL_TYPE_VAL) != 0 && 
				sqlType.compareTo(INSERT_SQL_TYPE_VAL) != 0 && 
				sqlType.compareTo(UPDATE_SQL_TYPE_VAL) != 0 && 
				sqlType.compareTo(DELETE_SQL_TYPE_VAL) != 0 )
		{
			throw new ConfigurationException(this.m_name + " has invalid SQL statement type '"+sqlType+"'. Must be one of: "+
					SELECT_SQL_TYPE_VAL +", "+ INSERT_SQL_TYPE_VAL +", "+ UPDATE_SQL_TYPE_VAL +", "+ DELETE_SQL_TYPE_VAL);
		}
		
		//extract any parameters refered to in the SQL
		Matcher vars = PARAM_REFERENCE_PATTERN.matcher(m_sqlQueryRaw);
		String paramRefName = null;
			
        while (vars.find()) {
           	paramRefName = vars.group(1);
           	if ( m_parameterDefinitions.containsKey(paramRefName) ) {
           		m_parameterQueryOrder.add(paramRefName);
           	}
           	else {
           		throw new ConfigurationException(this.m_name + " SQL statement references undefined parameter '"+paramRefName+"'");
           	}
        }

		return true;
	}

	/**
	 * Helper method to create and populate a COntextVariables instance for the current request.
	 * 
	 * @param inputParameters
	 * @return
	 * @throws SystemException
	 */
	private ContextVariables createRequestContext(Document inputParameters) 
		throws SystemException
	{
		ContextVariables contextVariables = new ContextVariables();
		Iterator it = m_parameterDefinitions.values().iterator();
		ParamDef paramDef = null;
		String paramXPath = null;
		
        while(it.hasNext()){
        	paramDef = (ParamDef) it.next();
            paramXPath = paramDef.getXPath();
            Object result = null;
            try {
            	result = XPath.selectSingleNode(inputParameters, paramXPath);
            }
            catch(JDOMException e) {
            	throw new SystemException("Unable to evaluate '"+ paramXPath +"' for '"+this.getName()+"' parameters:"+e.getMessage(),e);
            }
            String value = null;
            //TODO: Handle multiple data types?
            if(result instanceof Attribute){
                value = ((Attribute)result).getValue();
            } else if (result instanceof Element){
                value = ((Element)result).getTextNormalize();
            }
            contextVariables.addVariable(paramDef.getName(), value);
        }
        
        return contextVariables;
	}

	/**
	 * Helper method to output XML when an "executeUpdate" has been performed
	 *  
	 * @param rowsUpdated
	 * @throws SystemException
	 */
	private void outputUpdateXML(int rowsUpdated) throws SystemException {
		try {
			outputDataElement(UPDATE_OUTPUT_ELEMENT, null, Integer.toString(rowsUpdated), false, 0);
		}
		catch(IOException e) {
			throw new SystemException(this.getName() + " failed to write to output: "+e.getMessage(),e);
		}
	}
	
	/**
	 * Helper method to output XML when an "executeQuery" has been performed
	 * 
	 * @param rs
	 * @throws SystemException
	 */
	private void outputSelectXML(ResultSet rs) throws SystemException
	{
		try {
			outputOpenElement(m_resultsetElement, true, 0);
			
			// now output the rows
			if ( rs != null ) {
				try {
					ContextVariables resultVariables = null;
					Iterator it = null;
					String varName = null;
				
					while (rs.next()) {
						// extract results from the resultset
						resultVariables = new ContextVariables();
						m_sqlStatement.extractSelectResults(rs, resultVariables);
	            	
						// output the row
						outputOpenElement(m_rowElement, true, 1);
	            	
						it = resultVariables.getVariableNames();
						while( it.hasNext() ) {
							varName = (String)it.next();
	            		
							if (m_fieldNameAsAttribute == true)
								outputDataElement(COLUMN_OUTPUT_ELEMENT, varName, resultVariables.getValue(varName).toString(), true, 2);
							else
								outputDataElement(varName, null, resultVariables.getValue(varName).toString(), true, 2);
	            		}
	            	
	            		outputCloseElement(m_rowElement, true, 1);
	            	}
				}
				catch(SQLException e) {
					throw new SystemException(this.getName() + " failed to process query results: " + e.getMessage(),e);
				}
			}
			
			outputCloseElement(m_resultsetElement, false, 0);
		}
		catch(IOException e) {
			throw new SystemException(this.getName() + " failed to write to output: "+e.getMessage(),e);
		}
	}
	
	/**
	 * Helper to output an opening element.
	 * 
	 * @param elementName
	 * @param newline
	 * @param level
	 * @throws IOException
	 */
	private void outputOpenElement(String elementName, boolean newline, int level) throws IOException {
		if ( m_formatOutput ) writeIndent(level);
		
		m_dataSink.write("<"+elementName+">");
		
		if ( m_formatOutput && newline ) m_dataSink.write("\r\n");
	}
	
	/**
	 * An inflexible way of including a 'name' attribute. Avoid a more generic attribute mechanism until
	 * needed.
	 * 
	 * @param elementName
	 */
	private void outputDataElement(String elementName, String nameAttrValue, String elementContents, boolean newline, int level) throws IOException {
		if ( m_formatOutput ) writeIndent(level);
		
		if ( nameAttrValue != null ) {
			m_dataSink.write("<" + elementName + " " + OUTPUT_NAME_ATTR + "=\"" + nameAttrValue +"\">" +
					elementContents +
					"</"+elementName+">");
		}
		else {
			m_dataSink.write("<" + elementName + ">" +
					elementContents +
					"</"+elementName+">");
		}
		
		if ( m_formatOutput && newline ) m_dataSink.write("\r\n");
	}
	
	/**
	 * Helper to output a closing tag for a previously opened element.
	 * 
	 * @param elementName
	 * @param newline
	 * @param level
	 * @throws IOException
	 */
	private void outputCloseElement(String elementName, boolean newline, int level) throws IOException {
		if ( m_formatOutput ) writeIndent(level);
		
		m_dataSink.write("</"+elementName+">");
		
		if ( m_formatOutput && newline ) m_dataSink.write("\r\n");
	}
	
	/**
	 * Writes indents into the output
	 * 
	 * @param level
	 * @throws IOException
	 */
	private void writeIndent(int level) throws IOException {
        for (int i = 0; i < level; i++) {
            m_dataSink.write(OUTPUT_INDENTATION);
        }
    }
	
	/**
	 * The name must take the correct format 
	 * @param name
	 * @return
	 */
	public boolean isValidParamNameFormat(String name) {
		boolean isValid = false;
		
		Matcher matcher = PARAM_NAME_PATTERN.matcher(name);
        if (matcher.find()) {
        	isValid = true;
        }
		return isValid;
	}
	
	
	/**
	 * Local helper class for parameter definition.
	 * @author GrantM
	 */
	private class ParamDef {
		private String m_name = null;
		private String m_xpath = null;

		public ParamDef(String name, String xpath) {
			m_name = name;
			m_xpath = xpath;
		}	
		
		public String getName() {
			return m_name;
		}
		
		public String getXPath() {
			return m_xpath;
		}
		
		public int hashCode() {
			return m_name.hashCode();
		}
		
		public boolean equals(Object o) {
			boolean bEquals = false;
			
			if ( o instanceof ParamDef ) {
				String passedName = ((ParamDef)o).toString();
				if ( this.toString().compareTo(passedName) == 0 ) {
					bEquals = true;
				}
			}
			
			return bEquals;
		}
		
		public String toString() {
			return m_name;
		}
	}
}
