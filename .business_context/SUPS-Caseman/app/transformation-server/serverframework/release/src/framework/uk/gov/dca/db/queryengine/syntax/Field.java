/*
 * Created on 22-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine.syntax;

import java.util.ArrayList;
import java.util.Collection;

import uk.gov.dca.db.queryengine.SyntaxElement;
import uk.gov.dca.db.queryengine.SyntaxElementVisitor;

/**
 * Represents a field definition in the abstract syntax.  Field definitions are used to specify which fields are selected or 
 * updated by the query and how they should be updated.
 * 
 * @author JamesB
 */
public class Field implements SyntaxElement {

	/**
	 * Default constructor
	 */
	public Field() {
		//empty
	}
	
	/**
	 * Copy constructor
	 */
	public Field(Field field) {
		this.name = field.name;
		this.selectable = field.selectable;
		this.modifiable = field.modifiable;
		
		this.property = field.property;
		this.value = field.value;
		this.xpath = field.xpath;
		this.sequence = field.sequence;
		this.metadataType = field.metadataType;
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#accept(uk.gov.dca.db.queryengine.SyntaxElementVisitor)
	 */
	public void accept(SyntaxElementVisitor visitor) {
		visitor.visitField(this);
	}
	
	/**
	 * Sets the database metadata type of this field
	 * @param metadataType
	 */
	public void setMetadataType(int metadataType)
	{
		this.metadataType = metadataType;
	}
	
	/**
	 * Returns the database metadata type of this field
	 * @return
	 */
	public int getMetadataType()
	{
		return metadataType;
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#getChildElements()
	 */
	public Collection getChildElements() {
		return new ArrayList();
	}

	/**
	 * @return Returns true if the value of the field is modifiable
	 */
	public boolean isModifiable() {
		return modifiable;
	}
	
	/**
	 * @param modifiable If true then the field will be included in insertions, updates and deletions
	 */
	public void setModifiable(boolean modifiable) {
		this.modifiable = modifiable;
	}
	
	/**
	 * Returns the name of the field.
	 * 
	 * @return Returns the name of the field.  This is not qualified with the table to which the field belongs.
	 */
	public String getName() {
		return name;
	}
	
	/**
	 * Sets the name of the field.
	 * 
	 * @param name The name of the field.  This must not be qualified with the table to which it belongs.
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * @return Returns true if the field may be read as part of a query.
	 */
	public boolean isSelectable() {
		return selectable;
	}
	
	/**
	 * @param selectable If true then the field will be included in records returned from a select query.
	 */
	public void setSelectable(boolean selectable) {
		this.selectable = selectable;
	}
	
	/**
	 * @return Returns the property.
	 */
	public String getProperty() {
		return property;
	}
	
	/**
	 * @param property The property to set.
	 */
	public void setProperty(String property) {
		this.property = property;
	}
	
	/**
	 * @return Returns the sequence.
	 */
	public String getSequence() {
		return sequence;
	}
	
	/**
	 * @param sequence The sequence to set.
	 */
	public void setSequence(String sequence) {
		this.sequence = sequence;
	}
	
	/**
	 * @return Returns the value.
	 */
	public String getValue() {
		return value;
	}
	
	/**
	 * @param value The value to set.
	 */
	public void setValue(String value) {
		this.value = value;
	}
	
	/**
	 * @return Returns the xpath.
	 */
	public String getXpath() {
		return xpath;
	}
	
	/**
	 * @param xpath The xpath to set.
	 */
	public void setXpath(String xpath) {
		this.xpath = xpath;
	}
	
	public String toString() {
		String sToString = "name=" +name;
		sToString += ", selectable=" +selectable;
		sToString += ", modifiable=" +modifiable;
		sToString += ", xpath=" +xpath;
		sToString += ", property=" +property;
		sToString += ", value=" +value;
		sToString += ", sequence=" +sequence;
		
		return sToString;
	}
	
	public final static int UNKNOWN_TYPE = -1;
	
	private String name = null;
	private boolean selectable;
	private boolean modifiable;
	
	private String property = null;
	private String value = null;
	private String xpath = null;
	private String sequence = null;
	private int metadataType = UNKNOWN_TYPE;
}
