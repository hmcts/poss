/*
 * Created on 22-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine.syntax;

import java.util.Map;
import java.util.TreeMap;
import java.util.Collection;
import java.util.Iterator;

import uk.gov.dca.db.queryengine.SyntaxElement;
import uk.gov.dca.db.queryengine.SyntaxElementVisitor;

/**
 * Represents a Table definition in the abstract syntax.
 *
 * @author Imran Patel
 */
public class Table implements SyntaxElement {

	/**
	 * Default constructor
	 */
	public Table() {
		// empty
	}

	/**
	 * Copy constructor
	 */
	public Table(Table table) {
		this.alias = table.alias;
		this.name = table.name;
		
		// copy fields
		Iterator fieldsIterator = table.fields.values().iterator();
		while( fieldsIterator.hasNext() ) {
			Field copyField = new Field( (Field)fieldsIterator.next() );
			fields.put( copyField.getName(), copyField );
		}
		
		// copy ExistenceCheck
		if ( table.existenceCheck != null ) {
			ExistenceCheck original = table.existenceCheck;
			this.existenceCheck = new ExistenceCheck();
			this.existenceCheck.setExistsAction(original.getExistsAction());
			this.existenceCheck.setNotExistsAction(original.getNotExistsAction());
			Iterator checkFields = original.getFields().iterator();
			while ( checkFields.hasNext() ) {
				Field oldField = (Field)checkFields.next();
				Field newField = (Field)fields.get(oldField.getName());
				if ( newField != null) {
					this.existenceCheck.addField(newField);
				}
			}
		}
	}

	/**
	 * Constructor for the table specifying the table name and alias
	 * 
	 * @param name The name of the table.  This must correspond to a defined table in the Oracle database
	 * @param alias A short name the table is often referenced by
	 */
	public Table(String name, String alias) {
		this.name = name;
		this.alias = alias;
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#accept(uk.gov.dca.db.queryengine.SyntaxElementVisitor)
	 */
	public void accept(SyntaxElementVisitor visitor) {
		visitor.visitTable(this);
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#getChildElements()
	 */
	public Collection getChildElements() {
		return fields.values();
	}
	
	/**
	 * @return Returns the alias of the table.
	 */
	public String getAlias() {
		return alias;
	}
	/**
	 * @param alias The alias to set for the table.
	 */
	public void setAlias(String alias) {
		this.alias = alias;
	}
	/**
	 * @return Returns the name of the table.
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name The name to set for the table.
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * @return Returns the existenceCheck for the table.
	 */
	public ExistenceCheck getExistenceCheck() {
		return existenceCheck;
	}
	/**
	 * @param existenceCheck The existenceCheck to set for the table.
	 */
	public void setExistenceCheck(ExistenceCheck existenceCheck) {
		this.existenceCheck = existenceCheck;
	}
	/**
	 * @return Returns the fields defined for the table.
	 */
	public Map getFields() {
		return fields;
	}
	/**
	 * @param field The field to be defined for the table in the query.
	 */
	public void addField(Field field) {
		fields.put(field.getName().toUpperCase(), field);
	}
	/**
	 * @return Returns the field matching the specified field name
	 */
	public Field getField( String fieldName ) {
		return (Field)fields.get(fieldName.toUpperCase());
	}	
	
	private String name = null;
	private String alias = null;
	
	private ExistenceCheck existenceCheck = null;
	private Map fields = new TreeMap();
}
