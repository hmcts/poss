/*
 * Created on 13-Dec-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline.query.sql;


public class StatementType {
	private StatementType(String typeName) {
		this.typeName = typeName;
	}
	
	public String getName() {
		return typeName;
	}
	
	public static StatementType getInstance(String typeName) {
		StatementType result = INVALID;
		
		if(typeName != null) {
    		if(typeName.equals(SELECT.getName())) {
    			result = SELECT;
    		}
    		else if(typeName.equals(INSERT.getName())) {
    			result = INSERT;
    		}
    		else if(typeName.equals(UPDATE.getName())) {
    			result = UPDATE;
    		}
    		else if(typeName.equals(DELETE.getName())) {
    			result = DELETE;
    		}
    		else if(typeName.equals(EXISTENCE_CHECK.getName())) {
    			result = EXISTENCE_CHECK;
    		}
		}
		
		return result;
	}
	
	public boolean equals(Object obj) {
		boolean result = false;
		
		if(obj != null && obj instanceof StatementType) {
			result = typeName.equals(((StatementType) obj).typeName);
		}
		return result;
	}
	
	public String toString() {
		return typeName;
	}
	public static final StatementType SELECT = new StatementType("select");
	public static final StatementType INSERT = new StatementType("insert");
	public static final StatementType UPDATE = new StatementType("update");
	public static final StatementType DELETE = new StatementType("delete");
	public static final StatementType EXISTENCE_CHECK = new StatementType("existenceCheck");
	public static final StatementType INVALID = new StatementType("invalid");
	
	private String typeName = null;
}