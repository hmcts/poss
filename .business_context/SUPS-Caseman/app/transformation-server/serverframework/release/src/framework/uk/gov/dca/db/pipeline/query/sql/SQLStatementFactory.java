/*
 * Created on 09-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline.query.sql;

import org.jdom.Element;

import uk.gov.dca.db.exception.*;
import uk.gov.dca.db.pipeline.ISQLGenerator;
import uk.gov.dca.db.pipeline.Query;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class SQLStatementFactory {

	/**
	 * Default constructor
	 */
	public SQLStatementFactory() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	/**
	 * Default constructor
	 */
	public SQLStatementFactory(String defaultTypeName) {
		super();
		this.defaultTypeName = defaultTypeName;
	}
		 
	public SQLStatement createSQLStatement(Element sqlElement, Query query) 
			throws SystemException
	{
		SQLStatement product = null;
		
		String typeName = sqlElement.getAttributeValue(TYPE);
		if ( (typeName == null  || typeName.length() == 0) &&
				defaultTypeName != null ) 
		{
			typeName = defaultTypeName;
		}
		
		StatementType type = StatementType.getInstance(typeName);
		if(sqlElement.getAttributeValue(GENERATOR_NAME) != null) {
			ISQLGenerator generator = createGenerator(sqlElement);
			product = new DynamicSQLStatement(type, generator, query);
		}
		else {
			product = new SQLStatement(type, query);
			product.addStatement(sqlElement.getTextNormalize());
		}
		
		return product;
	}
	
	private ISQLGenerator createGenerator(Element sqlElement) 
		throws SystemException
    {
		String generatorName = sqlElement.getAttributeValue(GENERATOR_NAME);
		
		ISQLGenerator statementGenerator = null;

		Class generatorClass = null;
		try {
			generatorClass = Class.forName(generatorName);
		}
    	catch(ClassNotFoundException e) {
    		throw new ConfigurationException("Unable to find class '"+generatorName+"': "+e.getMessage(), e);  
    	}
    	
		if(generatorClass != null) {
			try	{
				statementGenerator = (ISQLGenerator) generatorClass.newInstance();
			}
			catch(InstantiationException e) { 
	    		throw new SystemException("Unable to instantiate SQL generator '"+generatorName+"': "+e.getMessage(), e); 
	    	}
	    	catch(IllegalAccessException e) { 
	    		throw new SystemException("Unable to instantiate filter '"+generatorName+"': "+e.getMessage(), e);  
	    	}
			statementGenerator.initialise(sqlElement);
		}
		else {
			throw new SystemException("Could not create SQL Generator - Class not found");
		}
			
		return statementGenerator;
	}

	private String defaultTypeName = null;
	private static final String TYPE = "type";
	private static final String GENERATOR_NAME = "generator";
}
