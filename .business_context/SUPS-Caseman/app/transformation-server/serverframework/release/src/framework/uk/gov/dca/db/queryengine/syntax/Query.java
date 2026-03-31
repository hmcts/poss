/*
 * Created on 22-Sep-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.queryengine.syntax;

import uk.gov.dca.db.queryengine.SyntaxElement;
import uk.gov.dca.db.queryengine.SyntaxElementVisitor;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Iterator;

/**
 * Represents a query in the abstract syntax
 * 
 * @author JamesB
 */
public class Query implements SyntaxElement {

	/**
	 * Default constructor
	 */
	public Query() {
		// empty
	}
	
	/**
	 * Copy constructor
	 */
	public Query( Query query ) {
		this.pivotNode = query.pivotNode;
		this.modifiable = query.modifiable;
		this.selectDistinct = query.selectDistinct;
		this.subQueries.putAll(query.subQueries); // shallow copy the subqueries
		this.undefinedFields.addAll(query.undefinedFields);
		this.parameters.addAll(query.parameters);
		this.constraints.addAll(query.constraints);
		if ( query.join != null ) {
			this.join = new Join(query.join);
		}
		if ( query.orderBy != null ) {
			this.orderBy = new OrderBy(query.orderBy);
		}
		if ( query.pageController != null ) {
			this.pageController = new PageController(query.pageController);
		}
		// deep copy the table and constraints. Retain the sharing of field instances between
		// table fields and constraint fields.
		Iterator tablesIterator = query.tables.values().iterator();
		while( tablesIterator.hasNext() ) {
			Table tableCopy = new Table( (Table)tablesIterator.next() );
			this.tables.put(tableCopy.getAlias(), tableCopy);
		}
		
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#accept(uk.gov.dca.db.queryengine.SyntaxElementVisitor)
	 */
	public void accept(SyntaxElementVisitor visitor) {
		visitor.visitQuery(this);
	}
	
	/**
	 * @see uk.gov.dca.db.queryengine.SyntaxElement#getChildElements()
	 */
	public Collection getChildElements() {
		ArrayList list = new ArrayList();
		list.addAll(subQueries.values());
		list.addAll(tables.values());
		list.addAll(constraints);
		if ( join != null) list.add(join);
		if ( orderBy != null) list.add(orderBy);
		return list;
	}
	
	/**
	 * @param newTable adds a table to the query
	 */
	public void addTable(Table newTable) {
		tables.put(newTable.getAlias().toUpperCase(), newTable);
	}
	
	/**
	 * @return a Collection of the tables used by the query
	 */
	public Collection getTables() {
		return tables.values();
	}
	
	/**
	 * Returns the table with the specified alias if it is used by this query.  If the specified alias does not correspond to one of the
	 * tables used by this query then null is returned.
	 * 
	 * @param alias The alias of the table to return
	 * @return The table matching the specified table alias
	 */
	public Table getTable(String alias) {
		return (Table) tables.get(alias.toUpperCase());
	}
	
	/**
	 * Sets the distinct flag 
	 * @param bIsDistinct
	 */
	public void setSelectDistinct(boolean bIsDistinct)
	{
		selectDistinct = bIsDistinct;
	}
	
	/**
	 * Returns the distinct flag
	 * @return
	 */
	public boolean isSelectDistinct()
	{
		return selectDistinct;
	}
	
	/**
	 * @param newJoin Sets the join clause of the query to the join object specified
	 */
	public void setJoin(Join newJoin) {
		if ( newJoin.getJoinClause() != null ) 
		{
			Matcher vars = BIND_VARIABLE.matcher(newJoin.getJoinClause());
	        
			while (vars.find()) {
	            //add var to dependent vars list
	            String var = vars.group(1).toUpperCase();
	            undefinedFields.add(var);    
			}
	        
	        //Replace all parameters with ?
	        newJoin.setJoinClause(vars.replaceAll("?"));	
			join = newJoin;
		}
	}
	
	/**
	 * @return Returns the join clause of the query
	 */
	public Join getJoin() {
		return join;
	}

	/**
	 * @param newOrderBy Sets the 'order by' clause of the query
	 */
	public void setOrderBy(OrderBy newOrderBy) {
		orderBy = newOrderBy;
	}
	
	/**
	 * @return Returns the OrderBy clause of the query
	 */
	public OrderBy getOrderBy() {
		return orderBy;
	}
	
	/**
	 * @return Returns a Collection of the constraints defined for the query
	 */
	public Collection getConstraints() {
		return constraints;
	}
	
	/**
	 * @param constraint The constraint to add to the query.
	 */
	public void addConstraint(Constraint constraint) {
		// Find all parameters
        Matcher vars = BIND_VARIABLE.matcher(constraint.getConstraintClause());
        
        while (vars.find()) {
            //add var to dependent vars list
            String var = vars.group(1);
            if (!getParameters().contains(var)) {
                undefinedFields.add(var);
            }
        }
        //Replace all parameters with ?
        constraint.setConstraintClause(vars.replaceAll("?"));
		constraints.add(constraint);
	}
	
	/**
	 * @return Returns true if the query is modifiable.
	 */
	public boolean isModifiable() {
		return modifiable;
	}
	
	/**
	 * @param modifiable A boolean value of true if the query should be modifiable.
	 */
	public void setModifiable(boolean modifiable) {
		this.modifiable = modifiable;
	}
	
	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		StringBuffer buffer = new StringBuffer();
		buffer.append(this.getClass());
		buffer.append(": ");
		buffer.append(this.isModifiable() ? "modifiable" : "read-only");
		buffer.append(", selectDistinct - ");
		buffer.append(this.selectDistinct ? "[true]" : "[false]");
		buffer.append(", Tables - [");
		buffer.append(this.getTables());
		buffer.append("], Join - [");
		buffer.append(this.getJoin());
		buffer.append("], Constraints - [");
		buffer.append(this.getConstraints());
		buffer.append("], OrderBy - [");
		buffer.append(this.getOrderBy());
		buffer.append("]");
		
		return buffer.toString();
	}
	
	/**
	 * @return Returns the pivotNode of the query.
	 */
	public String getPivotNode() {
		return pivotNode;
	}
	
	/**
	 * @param pivotNode The pivotNode to set.
	 */
	public void setPivotNode(String pivotNode) {
		this.pivotNode = pivotNode;
	}
		
	/**
	 * @return Returns a Collection of any fields referenced by this query that are undefined.
	 */
	public Collection getUndefinedFields() {
		return undefinedFields;
	}
		
	/**
	 * @return Returns the parameters for this query.
	 */
	public Collection getParameters() {
		return parameters;
	}
	
	/**
	 * @param parameterName The name of the parameter to add.
	 */
	public void addParameter(String parameterName) {
		
		parameters.add(parameterName);
		
		// if the parameter corresponds to a currently undefined field then remove the undefined field from the list because it is no 
		// longer undefined
		if(undefinedFields.contains(parameterName)) {
			undefinedFields.remove(parameterName);
		}
	}
	
	/**
	 * @return A Collection of QueryHandles pointing to the queries that are children of this one.
	 */
	public Collection getSubQueries() {
		return subQueries.values();
	}
	
	/**
	 * @param query Adds the query pointed to by the specified QueryHandle as a child of this query
	 */
	public void addSubQuery(QueryHandle query) {
		String key = query.getQuery().getPivotNode();
		subQueries.put(key, query);
	}
	
	public void setPageController(PageController newController) {
		pageController = newController;
	}
	
	 /**
     * Class to hold info about a paged query.
     * @author GrantM
     */
    public class PageController {
    	private String m_pageSizeParameter = null;
		private String m_pageNumberParameter = null;
		
    	private int m_pageSize = 0;
		private int m_pageNumber = 0;
		
		public PageController() {
		}
		
		public PageController(PageController pageController) {
			m_pageSizeParameter = pageController.m_pageSizeParameter;
			m_pageNumberParameter = pageController.m_pageNumberParameter;
			m_pageSize = pageController.m_pageSize;
			m_pageNumber = pageController.m_pageNumber;
		}
		
		public boolean hasSizeParameter() {
			return (m_pageSizeParameter != null);
		}

		public boolean hasPageNumberParameter() {
			return (m_pageNumberParameter != null);
		}
		
		public int getPageSize() {
			return m_pageSize;
		}
		
		public int getPageNumber() {
			return m_pageNumber;
		}
		
		public void setPageSize(int pageSize) {
			m_pageSize = pageSize;
		}
		
		public void setPageNumber(int pageNumber) {
			m_pageNumber = pageNumber;
		}
		
		public String getPageSizeParameter() {
			return m_pageSizeParameter;
		}
		
		public String getPageNumberParameter() {
			return m_pageNumberParameter;
		}
		
		public void setPageSizeParameter(String pageSizeParameter) {
			m_pageSizeParameter = pageSizeParameter;
		}
		
		public void setPageNumberParameter(String pageNumberParameter) {
			m_pageNumberParameter = pageNumberParameter;
		}
    }
	
	private Map subQueries = new TreeMap();
	private Map tables = new TreeMap();
	private Join join = null;
	private OrderBy orderBy = null;
	private List constraints = new ArrayList();
	private Set undefinedFields = new TreeSet();
	private Set parameters = new TreeSet();
	private boolean modifiable;
	private String pivotNode = null;
	private boolean selectDistinct = false;
	private PageController pageController = null;
	private static final Pattern BIND_VARIABLE = Pattern.compile("\\$\\{([^}]+)\\}");
}
