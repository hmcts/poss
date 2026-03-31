/*
 * Created on 27-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine;

import java.util.Collection;
import java.util.Stack;
import java.util.TreeMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import uk.gov.dca.db.queryengine.syntax.Constraint;
import uk.gov.dca.db.queryengine.syntax.ExistenceCheck;
import uk.gov.dca.db.queryengine.syntax.Field;
import uk.gov.dca.db.queryengine.syntax.Join;
import uk.gov.dca.db.queryengine.syntax.OrderBy;
import uk.gov.dca.db.queryengine.syntax.Query;
import uk.gov.dca.db.queryengine.syntax.QueryExtension;
import uk.gov.dca.db.queryengine.syntax.Table;

/**
 * This visitor traverses the abstract syntax tree, finding undefined fields in queries and attempts to satisfy these queries by 
 * adding the fields to the select list of parent queries that already query the table in the database to which the fields belong.
 * 
 * @author JamesB
 */
public class SatisfyDependentQueriesVisitor extends SyntaxElementVisitorImpl {

	/**
	 * Default constructor
	 */
	public SatisfyDependentQueriesVisitor(QueryDefinitions queryDefinitions) {
		super();

		this.queryDefinitions = queryDefinitions;
		
		// add a new map to write all of the undefined fields that cannot be satisfied by the root query to.
		undefinedFieldsForTreeLevel.push(new TreeMap());
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitQuery(uk.gov.dca.db.queryengine.syntax.Query)
	 */
	public void visitQuery(Query query) {		

		// it is assumed that on entry to this method, a map will already exist on the stack to capture any undefined fields from this query
		// and any undefined fields from child queries that could not be satisfied by this query.

		currentQueryForTreeLevel.push(query);
		
		// push a new map onto the stack for child queries to write their undefined fields to.
		undefinedFieldsForTreeLevel.push(new TreeMap());
		
		// visit the child elements of the tree
		visitChildElements(query);
		
		// pop the map of undefined fields for child queries off of the stack
		Map childUndefinedFields = (Map) undefinedFieldsForTreeLevel.pop();
		
		// add any fields from child queries that are still undefined to the undefinedFields map for this query so that they may 
		// be satisfied by parent queries
		Iterator tableFieldMappings = ((Set) childUndefinedFields.entrySet()).iterator();
		while(tableFieldMappings.hasNext()) {
			Map.Entry entry = (Map.Entry) tableFieldMappings.next();
			String tableAlias = (String) entry.getKey();
			
			Map currentUndefinedFields = (Map) undefinedFieldsForTreeLevel.peek();
			if(currentUndefinedFields.containsKey(tableAlias.toUpperCase())) {
				Iterator fields = ((Set) entry.getValue()).iterator();
				while(fields.hasNext()) {
					addUndefinedField(tableAlias, (UndefinedField) fields.next());
				}
			}
			else {
				currentUndefinedFields.put(tableAlias.toUpperCase(), entry.getValue());
			}
		}
		
		// add any undefined fields in the current query to the undefinedFields map so that they may be satisfied by parent queries
		Collection undefinedFields = query.getUndefinedFields();
		Iterator fieldIterator = undefinedFields.iterator();
		
		while(fieldIterator.hasNext()) {
			Matcher match = FIELD_DECLARATION.matcher((String) fieldIterator.next());
	        while(match.find()) {
	        	addUndefinedField(match.group(1), match.group(2), query);
	        }
		}
		
		currentQueryForTreeLevel.pop();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitTable(uk.gov.dca.db.queryengine.syntax.Table)
	 */
	public void visitTable(Table table) {
		Query currentQuery = (Query)currentQueryForTreeLevel.peek();
		
		// if the current table appears in the undefinedFields list for the child queries, then add the corresponding fields to the current table.
		Map undefinedFields = (Map) undefinedFieldsForTreeLevel.peek();
		Set fields = (Set) undefinedFields.remove(table.getAlias().toUpperCase());
		if(fields != null) {
			Iterator i = fields.iterator();
		
			while(i.hasNext()) {
				UndefinedField undefinedField = (UndefinedField)i.next();
				String fieldName = undefinedField.getName();
				
				// if the field has not yet been defined for the table, then add it as a new, selectable field
				Field existingField = table.getField(fieldName);
				
				if(existingField == null) {
					Field newField = new Field();
					newField.setName(fieldName);
					newField.setSelectable(true);
					
					// if the field comes from a query extension then the current query needs to be
					// extended to hold the the new field.
					// This is so that the new field can be removed when the query extension for
					// which it is undefined is itself removed.
					if ( undefinedField.isFromExtension() == false || currentQuery instanceof QueryExtension  ) {
						table.addField(newField);
					}
					else {
						QueryExtension newExtension = new QueryExtension(currentQuery);
						Table tableExtension = newExtension.getTable(table.getAlias());
						tableExtension.addField(newField);
						
						queryDefinitions.extend( newExtension );
					}
				}
				else {
					// May have to update existing field to a selectable field.
					// If so, and the field comes from a query extension, extend the query.
					// If the query is already extended then just update it.
					if ( existingField.isSelectable() == false ) {
						if ( undefinedField.isFromExtension() == false || currentQuery instanceof QueryExtension) {
							existingField.setSelectable(true);
						}
						else {
							//create the extension
							QueryExtension newExtension = new QueryExtension(currentQuery);
							Table tableExtension = newExtension.getTable(table.getAlias());
							Field fieldExtension = tableExtension.getField(fieldName);
							fieldExtension.setSelectable(true);
							
							//TODO add extension to query def
						}
					}
				}
			}
		}
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitJoin(uk.gov.dca.db.queryengine.syntax.Join)
	 */
	public void visitJoin(Join join) {
		// empty
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitOrderBy(uk.gov.dca.db.queryengine.syntax.OrderBy)
	 */
	public void visitOrderBy(OrderBy orderBy) {
		// empty
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitField(uk.gov.dca.db.queryengine.syntax.Field)
	 */
	public void visitField(Field field) {
		// empty
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitExistenceCheck(uk.gov.dca.db.queryengine.syntax.ExistenceCheck)
	 */
	public void visitExistenceCheck(ExistenceCheck check) {
		// empty
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitConstraint(uk.gov.dca.db.queryengine.syntax.Constraint)
	 */
	public void visitConstraint(Constraint constraint) {
		// empty
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitQueryExtension(uk.gov.dca.db.queryengine.syntax.QueryExtension)
	 */
	public void visitQueryExtension(QueryExtension extension) {
		visitQuery(extension);
	}
	
	/**
	 * This method indicates whether all queries were successfully satisfied by the visitor.  The method should be called by the 
	 * client after the visitor has visited all of the elements in the abstract syntax tree.
	 *  
	 * @return a boolean set to true if the there are any remaining undefined fields.  This would indicate that the visitor could NOT
	 * satisfy all of the queries. 
	 */
	public boolean hasUndefinedFields() {
		return !(((Map) undefinedFieldsForTreeLevel.peek()).isEmpty());
	}
	
	/**
	 * Returns the map of unsatisfied fields.
	 * 
	 * @return
	 */
	public Map getUndefinedFields()
	{
		return (Map) undefinedFieldsForTreeLevel.peek();
	}
	
	/**
	 * Adds the field to an internal list of undefined fields.
	 * It also notes whether the undefined field comes from a query extension. If it does 
	 * and the field is satisfied by a parent query, then that parent query must be extended so
	 * that the satisfied field is not also fetched by subsequent query extensions (or when an
	 * unextended query is to be performed). i.e. previously satisfied fields are not persisted
	 * between queries.
	 * 
	 * @param tableAlias the alias of the table in the database to which the field belongs
	 * @param fieldName the name of the field
	 * @param query the source of the field. 
	 */
	private void addUndefinedField(String tableAlias, String fieldName, Query query) {
		if ( query != null) 
		{
			UndefinedField undefinedField = new UndefinedField(fieldName, query);
			addUndefinedField(tableAlias, undefinedField);
		}
	}
	
	/**
	 * Adds the field to an internal list of undefined fields.
	 * @param tableAlias
	 * @param undefinedField
	 */
	private void addUndefinedField(String tableAlias, UndefinedField undefinedField) {
		// add any undefined fields for the current query to the list
		Map undefinedFields = (Map) undefinedFieldsForTreeLevel.peek();
		
		Set fields = (Set) undefinedFields.get(tableAlias.toUpperCase());
		
		if(fields == null) {
			fields = new TreeSet();
			undefinedFields.put(tableAlias.toUpperCase(), fields);
		}
	
		fields.add(undefinedField);
	}
	
	private Stack undefinedFieldsForTreeLevel = new Stack();
	
	// this member is used to extend queries when an unextended query satisfies undefined fields
	// from a query extension. Extension is done through the QueryDefinitions class so that all 
	// extensions can be easily undone (i.e extension is managed at a single point):
	private QueryDefinitions queryDefinitions = null;
	
	// the following stack is used so that a query can be extended when one of it's tables can
	// satisfy an undefined field from a query extension:
	private Stack currentQueryForTreeLevel = new Stack();
	
	private static final Pattern FIELD_DECLARATION = Pattern.compile("\\b(\\w+)\\.(\\w+)\\b");
	
	/**
	 * A local class used for storing info about undefined fields.
	 * @author GrantM
	 */
	public class UndefinedField implements Comparable
	{
		private String fieldName = null;
		private boolean fromExtension = false;
		private Query fieldSource = null;
		
		public UndefinedField( String fieldName, Query fieldSource )
		{
			this.fieldName = fieldName;
			this.fieldSource = fieldSource;
			this.fromExtension = fieldSource instanceof QueryExtension;
		}
		
		public String getName()
		{
			return this.fieldName;
		}
		
		public boolean isFromExtension()
		{
			return this.fromExtension;
		}
		
		public Query getSource()
		{
			return fieldSource;
		}
		
		/*
		 * Methods so can be used in a Set:
		 */

	    public int compareTo(Object obj) {
	        return fieldName.compareTo(obj.toString());
	    }

	    public int hashCode() {
	        return fieldName.hashCode();
	    }
	    
	    public boolean equals(Object obj) {
	        return fieldName.equals(obj.toString());
	    }
	    
	    public String toString() {
	    	return fieldName;
	    }
	}
}
