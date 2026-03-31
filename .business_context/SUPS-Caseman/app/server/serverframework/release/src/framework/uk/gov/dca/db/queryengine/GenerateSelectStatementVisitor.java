package uk.gov.dca.db.queryengine;

import java.util.Map;
import java.util.Stack;
import java.util.TreeMap;

import uk.gov.dca.db.queryengine.syntax.Constraint;
import uk.gov.dca.db.queryengine.syntax.ExistenceCheck;
import uk.gov.dca.db.queryengine.syntax.Field;
import uk.gov.dca.db.queryengine.syntax.Join;
import uk.gov.dca.db.queryengine.syntax.OrderBy;
import uk.gov.dca.db.queryengine.syntax.Query;
import uk.gov.dca.db.queryengine.syntax.QueryExtension;
import uk.gov.dca.db.queryengine.syntax.Table;

/**
 * Visitor to generate SQL select statement from the abstract syntax tree.
 * 
 * TODO: The logic to traverse the abstract syntax tree should probably be externalised.
 * 
 * @author Imran Patel
 */
public class GenerateSelectStatementVisitor extends SyntaxElementVisitorImpl {

	/**
	 * default constructor
	 */
	public GenerateSelectStatementVisitor() {
		super();		
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitQuery(uk.gov.dca.db.queryengine.syntax.Query)
	 */
	public void visitQuery(Query query) {
		
		// create a new statement and push it onto the stack so that it is seperate from statements for sub-queries
		SelectStatement context = new SelectStatement(query);
		
		contextStack.push(context);
		
		// build the select statement
		visitChildElements(query);
		
		// Add the completed statement for the current query to a map of statements representing all of the queries in the tree
		statements.put(context.getPivotNode(), context.getStatement());
		// pop the statment for the current query off of the stack as it is no longer needed
		contextStack.pop();
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitTable(uk.gov.dca.db.queryengine.syntax.Table)
	 */
	public void visitTable(Table table) {
		
		SelectStatement context = (SelectStatement) contextStack.peek();
		
		// set the current table alias so that child elements (e.g. fields) in the abstract syntax tree may refer to it
		currentTableAlias = table.getAlias();
		
		visitChildElements(table);
		
		// construct a table declaration of the form: <TABLE NAME><SPACE><TABLE ALIAS>
		StringBuffer tableDeclaration = new StringBuffer(table.getName());
		tableDeclaration.append(SPACE);
		tableDeclaration.append(table.getAlias());
		
		context.addToFromClause(tableDeclaration.toString());
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitJoin(uk.gov.dca.db.queryengine.syntax.Join)
	 */
	public void visitJoin(Join join) {
		SelectStatement context = (SelectStatement) contextStack.peek();
		context.addToWhereClause(join.getJoinClause());
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitJoin(uk.gov.dca.db.queryengine.syntax.Join)
	 */
	public void visitOrderBy(OrderBy orderBy) {
		SelectStatement context = (SelectStatement) contextStack.peek();
		context.setOrderByClause(orderBy.getOrderByClause());
	}
	
	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitField(uk.gov.dca.db.queryengine.syntax.Field)
	 */
	public void visitField(Field field) {
		
		if(field.isSelectable()) {
			SelectStatement context = (SelectStatement) contextStack.peek();
			
			// construct a qualified field reference of the form: <TABLE ALIAS><PERIOD><FIELD NAME>
			StringBuffer fieldDeclaration = new StringBuffer(currentTableAlias);
			fieldDeclaration.append(PERIOD);
			fieldDeclaration.append(field.getName());

			context.addToSelectList(fieldDeclaration.toString());
		}
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
		SelectStatement context = (SelectStatement) contextStack.peek();
		context.addToWhereClause(constraint.getConstraintClause());
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.queryengine.SyntaxElementVisitor#visitQueryExtension(uk.gov.dca.db.queryengine.syntax.QueryExtension)
	 */
	public void visitQueryExtension(QueryExtension extension) {
		this.visitQuery(extension);
	}
	
	/**
	 * Returns a Map of the constructed SQL select statements for all queries in the tree
	 * 
	 * @return the Map of SQL select statements keyed on query pivot node
	 */
	public Map getStatements() {
		return statements;
	}
	
	/**
	 * Returns a String representation of the object 
	 * 
	 * @return string representation of the object
	 */
	public String toString() {
		return statements.toString();
	}
	
	/**
	 * This class can be used to construct SQL select statements.
	 * 
	 * @author JamesB
	 */
	private class SelectStatement {
		
		/**
		 * Constructor
		 * 
		 * @param query - the query that this statement corresponds to 
		 */
		public SelectStatement(Query query) {
			this.pivotNode = query.getPivotNode();
			
			statement.append(SELECT);
			if ( query.isSelectDistinct() ) {
				statement.append(DISTINCT);
			}
			fromClause.append(FROM);
			whereClause.append(WHERE);
		}
		
		/**
		 * Retrieves the pivot node of the query that this statement corresponds to
		 *
		 * @return the pivot node of the query that this statement corresponds to
		 */
		public String getPivotNode() {
			return pivotNode;
		}
		
		/**
		 * Constructs the SQL statement in the target language
		 * 
		 * @return the constructed SQL select statement
		 */
		public String getStatement() {
			// Add the FROM and WHERE clauses to the statement to produce the form: 
			// SELECT<SPACE><FIELD LIST><SPACE><FROM CLAUSE><SPACE><WHERE CLAUSE>
			statement.append(SPACE);
			statement.append(fromClause);
			statement.append(SPACE);
			statement.append(whereClause);
			if (orderByClause != null && orderByClause.length() > 0) {
				statement.append(SPACE);
				statement.append(orderByClause);
			}
			
			return statement.toString();
		}
		
		/**
		 * Adds the specified String to the select list of the SQL statement adding commas if appropriate.  The select list will 
		 * be updated following the form:
		 * 
		 * <COMMA><SPACE><SELECT LIST TERM>
		 * 
		 * @param string the String to be added to the select list of the SQL statement.
		 */
		public void addToSelectList(String string) {
			if(fieldsAdded) {
				statement.append(LIST_SEPERATOR);
			}
			
			statement.append(string);
		
			fieldsAdded = true;
		}
	
		/**
		 * Adds the specified String to the from clause of the SQL statement adding commas if appropriate.  The from clause will 
		 * be updated following the form:
		 * 
		 * <COMMA><SPACE><FROM TERM>
		 * 
		 * @param string the String to be added to the from clause of the SQL statement.
		 */
		public void addToFromClause(String string) {
			// if the current table has not already been added to the From clause of the statement then add it now
			if(fromClause.indexOf(string) != -1) {
				
				if(tablesAdded) {
					fromClause.append(LIST_SEPERATOR);
				}
				
				fromClause.append(string);
			
				tablesAdded = true;
			}
		}
		
		/**
		 * Adds the specified String to the where clause of the SQL statement adding the word AND if appropriate.  The where clause will 
		 * be updated following the form:
		 * 
		 * <code><AND><SPACE><OPEN PARANTHESIS><JOIN TERM><CLOSE PARENTHESIS></code>
		 * 
		 * @param string the String to be added to the where clause of the SQL statement.
		 */
		public void addToWhereClause(String string) {
			if(whereClauseStarted) {
				whereClause.append(AND);
			}
			
			whereClause.append(SPACE);
			whereClause.append(OPEN_PARENTHESIS);
			whereClause.append(string);
			whereClause.append(CLOSE_PARENTHESIS);
			
			whereClauseStarted = true;
		}
		
		/**
		 * Sets the order by clause
		 * @param orderByClause
		 */
		public void setOrderByClause(String orderByClause) {
			this.orderByClause = orderByClause;
		}
		
		// initial buffer sizes
		private static final int INITIAL_STATEMENT_SIZE = 500;
		private static final int INITIAL_CLAUSE_SIZE = 100;
		
		// constants representing literals commonly used to construct the select statement string 
		private static final char OPEN_PARENTHESIS = '(';
		private static final char CLOSE_PARENTHESIS = ')';
		private static final String LIST_SEPERATOR = "," + SPACE;
		private static final String SELECT = "SELECT" + SPACE;
		private static final String DISTINCT = "DISTINCT" + SPACE;
		private static final String FROM = "FROM" + SPACE;
		private static final String WHERE = "WHERE" + SPACE;
		private static final String AND = SPACE + "AND";
		
		// state information used during the construction of the select statement
		private boolean tablesAdded = false;
		private boolean fieldsAdded = false;
		private boolean whereClauseStarted = false;
		
		// the mapping pivot node to which the select statement corresponds to
		private String pivotNode = null;
		
		// the order by clause
		private String orderByClause = null;
		
		// buffers used to build up the various clauses of the SQL statement
		private StringBuffer statement = new StringBuffer(INITIAL_STATEMENT_SIZE);
		private StringBuffer fromClause = new StringBuffer(INITIAL_CLAUSE_SIZE);
		private StringBuffer whereClause = new StringBuffer(INITIAL_CLAUSE_SIZE);
	}
	
	// Contains the constructed SQL statements keyed on corresponding pivot node
	private Map statements = new TreeMap();
	
	// state information used during the traversal of the abstract syntax tree
	private Stack contextStack = new Stack();
	private String currentTableAlias = null;
	
	// constants representing literals commonly used to construct the select statement string 
	private static final char PERIOD = '.';
	private static final char SPACE = ' ';
}