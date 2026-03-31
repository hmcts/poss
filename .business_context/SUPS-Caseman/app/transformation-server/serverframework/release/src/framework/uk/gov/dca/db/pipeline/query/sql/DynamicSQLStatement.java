/*
 * Created on 09-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline.query.sql;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.LinkedList;

import org.jdom.Element;

import uk.gov.dca.db.pipeline.ISQLGenerator;
import uk.gov.dca.db.pipeline.Query;
import uk.gov.dca.db.pipeline.ContextVariables;


/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class DynamicSQLStatement extends SQLStatement {

	/**
	 * @param type
	 * @param statementText
	 */
	public DynamicSQLStatement(StatementType type, ISQLGenerator generator, Query query) {
		super(type, query);
		this.generator = generator;
	}
	
	public Object clone(Query query) {
		StatementType newType = StatementType.getInstance(type.getName());
		
		SQLStatement product = new DynamicSQLStatement(newType, (ISQLGenerator) generator.clone(), query);
		
		product.statementText = statementText;
		product.parameterList = new LinkedList(parameterList);
		
		return product;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.query.sql.SQLStatement#prepare(java.sql.Connection, uk.gov.dca.db.pipeline.DBService.ContextVariables, org.jdom.Element)
	 */
	public PreparedStatement prepare(Connection con, ContextVariables variables, Element config, String alias) throws SQLStatementException {
		PreparedStatement product = null;
		
		try {
			String statement = generator.generate(config.getDocument(), variables);
			addStatement(statement);
			product = super.prepare(con, variables, config, alias);
		}
		catch(Exception e) {
			if(!(e instanceof SQLStatementException)) {
				throw new SQLStatementException("Error whilst trying to generate SQL statement", e);
			}
		}
		return product;
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.query.sql.SQLStatement#prepare(java.sql.Connection, uk.gov.dca.db.pipeline.DBService.ContextVariables, org.jdom.Element)
	 */
	public PreparedStatement prepare(Connection con, ContextVariables variables, Element config) throws SQLStatementException {
		PreparedStatement product = null;
		
		try {
			String statement = generator.generate(config.getDocument(), variables);
			addStatement(statement);
			product = super.prepare(con, variables);
		}
		catch(Exception e) {
			if(!(e instanceof SQLStatementException)) {
				throw new SQLStatementException("Error whilst trying to generate SQL statement", e);
			}
		}
		return product;
	}
	
	private ISQLGenerator generator = null;
}
