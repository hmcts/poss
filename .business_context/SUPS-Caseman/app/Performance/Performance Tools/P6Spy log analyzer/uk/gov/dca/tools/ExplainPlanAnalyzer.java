package uk.gov.dca.tools;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.InputStream;
import java.util.Properties;
import java.util.List;
import java.util.LinkedList;
import java.util.Iterator;
import java.io.FileWriter;
import java.io.BufferedWriter;
import java.lang.reflect.Array;

public class ExplainPlanAnalyzer {
	private static String[] TABLE_TYPES = null;
	static {
		TABLE_TYPES = new String[1];
		TABLE_TYPES[0] = "TABLE";
	}
	private static String PLAN_TABLE_COLUMNS =
		"(STATEMENT_ID                   VARCHAR2(30),"+
		"TIMESTAMP                       DATE,"+
		"REMARKS                         VARCHAR2(80),"+
		"OPERATION                       VARCHAR2(30),"+
		"OPTIONS                         VARCHAR2(30),"+
		"OBJECT_NODE                     VARCHAR2(128),"+
		"OBJECT_OWNER                    VARCHAR2(30),"+
		"OBJECT_NAME                     VARCHAR2(30),"+
		"OBJECT_INSTANCE                 NUMBER(38),"+
		"OBJECT_TYPE                     VARCHAR2(30),"+
		"OPTIMIZER                       VARCHAR2(255),"+
		"SEARCH_COLUMNS                  NUMBER,"+
		"ID                              NUMBER(38),"+
		"PARENT_ID                       NUMBER(38),"+
		"POSITION                        NUMBER(38),"+
		"COST                            NUMBER(38),"+
		"CARDINALITY                     NUMBER(38),"+
		"BYTES                           NUMBER(38),"+
		"OTHER_TAG                       VARCHAR2(255),"+
		"PARTITION_START                 VARCHAR2(255),"+
		"PARTITION_STOP                  VARCHAR2(255),"+
		"PARTITION_ID                    NUMBER(38),"+
		"OTHER                           LONG,"+
		"DISTRIBUTION                    VARCHAR2(30))";

	private static String PROPERTIES_FILE = "ep_analyzer.properties";
	private static List m_logQueries = new LinkedList(); // the actual queries run - including parameter values
	
	private static String LOG_DELIMITER = ";";
	private static String FULLSCAN_LOG = "full_table_scan.log";
	private static String CARDINALITY_LOG = "cardinality.log";
	private static String COST_LOG = "cost.log";
	private static String ORDER_BY_LOG = "nested_order_by.log";
	private static String NESTED_LOOPS_LOG = "nested_loops.log";
	private static String LIKE_COUNT_LOG = "like_count.log";
	private static String IDENTICAL_QUERY_COUNT_LOG = "execution_count.log";
	private static String CARTESIAN_LOG = "cartesian.log";
	private static String FULLINDEXSCAN_LOG = "full_index_scan.log";
	
	private String SCHEMA = null;
	private String PASSWORD = null;
	private String CONNECTION_URL = null;
	private String DB_DRIVER_CLASS = null;
	private String PLAN_TABLE = null;	
	private String P6SPY_LOG_FILE = null;
	private String OUTPUT_LOG_DIR = null;
	private int CARDINALITY_THRESHOLD = 1000; // default value
	private int COST_THRESHOLD = 100; // default value
	
	public ExplainPlanAnalyzer() {
		Properties properties = new Properties();
		try {
			InputStream propertiesStream = this.getClass().getClassLoader().getResourceAsStream(PROPERTIES_FILE);
			properties.load(propertiesStream);
			SCHEMA = properties.getProperty("tools.ep_analyzer.schema");
			PASSWORD = properties.getProperty("tools.ep_analyzer.password");
			CONNECTION_URL = properties.getProperty("tools.ep_analyzer.connection_url");
			DB_DRIVER_CLASS = properties.getProperty("tools.ep_analyzer.db_driver");
			PLAN_TABLE = properties.getProperty("tools.ep_analyzer.explain_plan_table");	
			P6SPY_LOG_FILE = properties.getProperty("tools.ep_analyzer.p6spy_log");
			OUTPUT_LOG_DIR = properties.getProperty("tools.ep_analyzer.output_log_dir");
			
			// output control properties
			String cardinalityProp = properties.getProperty("tools.ep_analyzer.cardinality_threshold");
			if ( cardinalityProp != null && cardinalityProp.length() > 0 ) {
				CARDINALITY_THRESHOLD = Integer.parseInt(cardinalityProp);
			}
			String costProp = properties.getProperty("tools.ep_analyzer.cost_threshold");
			if ( costProp != null && costProp.length() > 0 ) {
				COST_THRESHOLD = Integer.parseInt(costProp);
			}
		}
		catch(Exception e) {
			throw new RuntimeException("Failed to read properties file '"+PROPERTIES_FILE+"': "+e.getMessage(), e);
		}
	}

	/**
	 * Connects to db
	 */
	public Connection getConnection() {
		Connection conn = null;
		
		try {
			Class.forName(DB_DRIVER_CLASS);
			conn = DriverManager.getConnection(CONNECTION_URL, SCHEMA, PASSWORD);
		}
		catch( Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			if ( conn != null ) {
				System.out.println("Connected to '"+CONNECTION_URL+"'...");
			}
			else {
				System.out.println("Failed to connect to '"+CONNECTION_URL+"'");
			}
		}
		
		return conn;
	}
	
	/**
	 * Closes a DB connection
	 * @param conn
	 */
	public void closeConnection(Connection conn) {
		try {
			if ( conn != null ) conn.close();
		}
		catch(SQLException e) {}
	}

	
	/**
	 * Loads in a P6Spy log file and extracts all queries
	 */
	public void loadP6SpyLogFile()
	{
		BufferedReader p6SpyLogBuff = null;
		
		try {
			System.out.println("Reading "+P6SPY_LOG_FILE);
			
			FileReader p6SpyReader = new FileReader(P6SPY_LOG_FILE);
			if (p6SpyReader == null) {
				throw new RuntimeException("Failed to load file '"+P6SPY_LOG_FILE+"'");
			}
			p6SpyLogBuff = new BufferedReader(p6SpyReader);
			if ( p6SpyLogBuff == null ) {
				throw new RuntimeException("Failed to buffer file '"+P6SPY_LOG_FILE+"'");
			}
			
			String nextLine = addNextStatement(null, p6SpyLogBuff);
			while( nextLine != null) {
				nextLine = addNextStatement(nextLine, p6SpyLogBuff);
			}
			
			p6SpyLogBuff.close();
		}
		catch(Exception e) {
			try {
				if ( p6SpyLogBuff != null ) p6SpyLogBuff.close();
			} catch(Exception e1) {}
			
			throw new RuntimeException(e);
		}
	}
	
	/**
	 * Gets the next statment from the P6SPy log file and adds it to the query list
	 * @param firstLine
	 * @param reader
	 * @return
	 */
	private String addNextStatement( String firstLine, BufferedReader reader )
	{
		String nextLine = null;
		
		try {
			String logLine = firstLine;
			if ( logLine == null ) {
				logLine = reader.readLine();
			}
			
			while ( logLine != null && logLine.indexOf("|statement|") == -1 ) {
				logLine = reader.readLine();
			}
			
			// Process a statement if one has been found. It may stretch over more than 1 line
			if ( logLine != null && logLine.indexOf("|statement|") != -1 ) {
				String logEntry = logLine;
				nextLine = reader.readLine();
				
				while( nextLine != null && nextLine.indexOf("|statement|") ==-1 && nextLine.indexOf("|resultset|") ==-1 && nextLine.indexOf("|info|") ==-1 && 
						nextLine.indexOf("|debug|") ==-1 && nextLine.indexOf("|commit|") ==-1 && nextLine.indexOf("|rollback|") ==-1)
				{
					logEntry += nextLine;
					nextLine = reader.readLine();
				}
				
				P6SpyLogStatement logStmt = new P6SpyLogStatement(logEntry);
				
				if ( logStmt.getStatementType() != P6SpyLogStatement.UNKNOWN_TYPE ) {
					int existingStmtPos = m_logQueries.indexOf(logStmt);
					
					// if the exact query has already been read in then increment its' count, otherwise add the new query.
					if ( existingStmtPos == -1 ) {
						m_logQueries.add(logStmt);
						System.out.println("Added query: " +logStmt.getQuery());
					}
					else {
						P6SpyLogStatement existingStmt = (P6SpyLogStatement)m_logQueries.get(existingStmtPos);
						existingStmt.incrementCount();
						System.out.println("Incremented query: " +logStmt.getQuery());
					}
				}
			}
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
		
		return nextLine;
	}
	
	
	/**
	 * generates an explain plan for every statement in the P6py log file
	 */ 
	public void generateExplainPlan(Connection conn) 
	{
		ResultSet resultSetDatabaseMetaDataTables = null;
		
		try {
			// create the explain plan table if it does not exist
			DatabaseMetaData metadata = conn.getMetaData();
			resultSetDatabaseMetaDataTables = metadata.getTables(null,SCHEMA,PLAN_TABLE,TABLE_TYPES);
			if ( resultSetDatabaseMetaDataTables.next() == false )
			{
				System.out.println("Creating explain plan table '"+PLAN_TABLE+"'");
				// create the table
				Statement createStmt = conn.createStatement();
				createStmt.executeUpdate("CREATE TABLE "+PLAN_TABLE+" "+PLAN_TABLE_COLUMNS);
				createStmt.close();
			}
			else
			{
				System.out.println("Cleaning explain plan table '"+PLAN_TABLE+"'");
				// delete all contents in the explain plan table
				Statement clearStmt = conn.createStatement();
				clearStmt.executeUpdate("DELETE FROM "+PLAN_TABLE);
				clearStmt.close();
			}
			
			System.out.println("Running queries...");
			
			// run queries, generating explain plan
			Statement queryStmt = conn.createStatement();

			Iterator it = m_logQueries.iterator();
			int queryId = 0;
			P6SpyLogStatement query = null;
			
			while (it.hasNext()) {
				query = (P6SpyLogStatement)it.next();
				String queryString = query.getQuery();
				System.out.println("Executing: "+queryString);
				
				queryStmt.execute("EXPLAIN PLAN SET STATEMENT_ID='"+queryId+"' INTO "+PLAN_TABLE+" FOR "+queryString);
				
				queryId += 1;
			}
		
			queryStmt.close();
			
			System.out.println("Executed "+m_logQueries.size()+" queries");
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			try {
				if ( resultSetDatabaseMetaDataTables != null ) resultSetDatabaseMetaDataTables.close();
			}
			catch(SQLException e) {}	
		}
	}
	
	/**
	 *	Outputs a log of queries with cartesian joins 
	 *
	 */
	public void analyseCartesianJoins(Connection conn)
	{
		Statement stmt = null;
		ResultSet rs =null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery("SELECT DISTINCT STATEMENT_ID AS \"STATEMENT_ID\" FROM "+PLAN_TABLE+" WHERE OPTIONS='CARTESIAN'");
			
			FileWriter out = new FileWriter(OUTPUT_LOG_DIR+"/"+CARTESIAN_LOG);
			BufferedWriter outBuff = new BufferedWriter(out);
			
			int numQueries = 0;
			int index = -1;
			P6SpyLogStatement query = null;
			while(rs.next()) {
				numQueries += 1;
				
				index = rs.getInt(1);
				query = (P6SpyLogStatement)m_logQueries.get(index);

				outBuff.write(index+LOG_DELIMITER+query.getQuery()+"\r\n");
			}
			
			outBuff.close();
			
			System.out.println("QUERIES WITH CARTESIAN JOINS = "+numQueries);
			System.out.println("OUTPUT TO '"+OUTPUT_LOG_DIR+"\\"+CARTESIAN_LOG+"'");
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			try {
				if ( rs != null ) rs.close();
			}
			catch(SQLException e) {}	
			try {
				if ( stmt != null ) stmt.close();
			}
			catch(SQLException e) {}	
		}
	}
	
	
	/**
	 *	Outputs a log of queries with full table scans 
	 *
	 */
	public void analyseFullTableScans(Connection conn)
	{
		Statement stmt = null;
		ResultSet rs =null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery("SELECT DISTINCT STATEMENT_ID AS \"STATEMENT_ID\" FROM "+PLAN_TABLE+" WHERE OPERATION='TABLE ACCESS' AND OPTIONS='FULL'");
			
			FileWriter out = new FileWriter(OUTPUT_LOG_DIR+"/"+FULLSCAN_LOG);
			BufferedWriter outBuff = new BufferedWriter(out);
			
			int numQueries = 0;
			int index = -1;
			P6SpyLogStatement query = null;
			while(rs.next()) {
				numQueries += 1;
				
				index = rs.getInt(1);
				query = (P6SpyLogStatement)m_logQueries.get(index);

				outBuff.write(index+LOG_DELIMITER+query.getQuery()+"\r\n");
			}
			
			outBuff.close();
			
			System.out.println("QUERIES WITH FULL TABLE SCANS = "+numQueries);
			System.out.println("OUTPUT TO '"+OUTPUT_LOG_DIR+"\\"+FULLSCAN_LOG+"'");
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			try {
				if ( rs != null ) rs.close();
			}
			catch(SQLException e) {}	
			try {
				if ( stmt != null ) stmt.close();
			}
			catch(SQLException e) {}	
		}
	}
	
	/**
	 *	Outputs a log of queries with full index scans 
	 *
	 */
	public void analyseFullIndexScans(Connection conn)
	{
		Statement stmt = null;
		ResultSet rs =null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery("SELECT DISTINCT STATEMENT_ID AS \"STATEMENT_ID\" FROM "+PLAN_TABLE+" WHERE OPERATION='INDEX' AND (OPTIONS='FULL SCAN' OR OPTIONS='FAST FULL SCAN')");
			
			FileWriter out = new FileWriter(OUTPUT_LOG_DIR+"/"+FULLINDEXSCAN_LOG);
			BufferedWriter outBuff = new BufferedWriter(out);
			
			int numQueries = 0;
			int index = -1;
			P6SpyLogStatement query = null;
			while(rs.next()) {
				numQueries += 1;
				
				index = rs.getInt(1);
				query = (P6SpyLogStatement)m_logQueries.get(index);

				outBuff.write(index+LOG_DELIMITER+query.getQuery()+"\r\n");
			}
			
			outBuff.close();
			
			System.out.println("QUERIES WITH FULL INDEX SCANS = "+numQueries);
			System.out.println("OUTPUT TO '"+OUTPUT_LOG_DIR+"\\"+FULLINDEXSCAN_LOG+"'");
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			try {
				if ( rs != null ) rs.close();
			}
			catch(SQLException e) {}	
			try {
				if ( stmt != null ) stmt.close();
			}
			catch(SQLException e) {}	
		}
	}
	
	/**
	 *	Outputs a log of queries where the cost > COST_THRESHOLD
	 *
	 */
	public void analyseCost(Connection conn)
	{
		Statement stmt = null;
		ResultSet rs =null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery("SELECT STATEMENT_ID AS \"STATEMENT_ID\", SUM(COST) AS \"COST\" FROM "+PLAN_TABLE+" GROUP BY STATEMENT_ID HAVING SUM(COST) > "+COST_THRESHOLD);
			
			FileWriter out = new FileWriter(OUTPUT_LOG_DIR+"/"+COST_LOG);
			BufferedWriter outBuff = new BufferedWriter(out);
			
			int numQueries = 0;
			int index = -1;
			int cost = -1;
			P6SpyLogStatement query = null;
			while(rs.next()) {
				numQueries += 1;
				
				index = rs.getInt(1);
				query = (P6SpyLogStatement)m_logQueries.get(index);

				cost = rs.getInt(2);
				
				outBuff.write(index+LOG_DELIMITER+cost+LOG_DELIMITER+query.getQuery()+"\r\n");
			}
			
			outBuff.close();
			
			System.out.println("QUERIES WITH COST > "+COST_THRESHOLD+" = "+numQueries);
			System.out.println("OUTPUT TO '"+OUTPUT_LOG_DIR+"\\"+COST_LOG+"'");
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			try {
				if ( rs != null ) rs.close();
			}
			catch(SQLException e) {}	
			try {
				if ( stmt != null ) stmt.close();
			}
			catch(SQLException e) {}	
		}
	}
	
	/**
	 *	Outputs a log of queries where the cardinality > CARDINALITY_THRESHOLD
	 *
	 */
	public void analyseCardinality(Connection conn)
	{
		Statement stmt = null;
		ResultSet rs =null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery("SELECT STATEMENT_ID AS \"STATEMENT_ID\", MAX(CARDINALITY) AS \"CARDINALITY\" FROM "+PLAN_TABLE+" WHERE CARDINALITY > "+CARDINALITY_THRESHOLD+" GROUP BY STATEMENT_ID");
			
			FileWriter out = new FileWriter(OUTPUT_LOG_DIR+"/"+CARDINALITY_LOG);
			BufferedWriter outBuff = new BufferedWriter(out);
			
			int numQueries = 0;
			int index = -1;
			int cardinality = -1;
			P6SpyLogStatement query = null;
			while(rs.next()) {
				numQueries += 1;
				
				index = rs.getInt(1);
				query = (P6SpyLogStatement)m_logQueries.get(index);

				cardinality = rs.getInt(2);
				
				outBuff.write(index+LOG_DELIMITER+cardinality+LOG_DELIMITER+query.getQuery()+"\r\n");
			}
			
			outBuff.close();
			
			System.out.println("QUERIES WITH CARDINALITY > "+CARDINALITY_THRESHOLD+" = "+numQueries);
			System.out.println("OUTPUT TO '"+OUTPUT_LOG_DIR+"\\"+CARDINALITY_LOG+"'");
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			try {
				if ( rs != null ) rs.close();
			}
			catch(SQLException e) {}	
			try {
				if ( stmt != null ) stmt.close();
			}
			catch(SQLException e) {}	
		}
	}
	
	/**
	 *	Outputs a log of queries that have nested "order by"s i.e. not at top level
	 *
	 */
	public void analyseNestedOrderBy(Connection conn)
	{
		Statement stmt = null;
		ResultSet rs =null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery("SELECT DISTINCT STATEMENT_ID AS \"STATEMENT_ID\" FROM "+PLAN_TABLE+" WHERE OPTIONS='ORDER BY' AND PARENT_ID > 0");
			
			FileWriter out = new FileWriter(OUTPUT_LOG_DIR+"/"+ORDER_BY_LOG);
			BufferedWriter outBuff = new BufferedWriter(out);
			
			int numQueries = 0;
			int index = -1;
			
			P6SpyLogStatement query = null;
			while(rs.next()) {
				numQueries += 1;
				
				index = rs.getInt(1);
				query = (P6SpyLogStatement)m_logQueries.get(index);

				outBuff.write(index+LOG_DELIMITER+query.getQuery()+"\r\n");
			}
			
			outBuff.close();
			
			System.out.println("QUERIES WITH NESTED 'ORDER BY' = "+numQueries);
			System.out.println("OUTPUT TO '"+OUTPUT_LOG_DIR+"\\"+ORDER_BY_LOG+"'");
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			try {
				if ( rs != null ) rs.close();
			}
			catch(SQLException e) {}	
			try {
				if ( stmt != null ) stmt.close();
			}
			catch(SQLException e) {}	
		}
	}
	
	/**
	 *	Outputs a log of queries that have nested nested loops i.e. nested loops at more than 1 level
	 *
	 */
	public void analyseNestedLoops(Connection conn)
	{
		Statement stmt = null;
		ResultSet rs =null;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery("SELECT STATEMENT_ID AS \"STATEMENT_ID\", COUNT(DISTINCT PARENT_ID) AS \"NUM_LEVELS\" FROM "+PLAN_TABLE+" WHERE OPERATION='NESTED LOOPS' GROUP BY STATEMENT_ID HAVING COUNT(DISTINCT PARENT_ID) > 1");
			
			FileWriter out = new FileWriter(OUTPUT_LOG_DIR+"/"+NESTED_LOOPS_LOG);
			BufferedWriter outBuff = new BufferedWriter(out);
			
			int numQueries = 0;
			int index = -1;
			int nestedLevels = -1;
			
			P6SpyLogStatement query = null;
			while(rs.next()) {
				numQueries += 1;
				
				index = rs.getInt(1);
				query = (P6SpyLogStatement)m_logQueries.get(index);

				nestedLevels = rs.getInt(2);
				
				outBuff.write(index+LOG_DELIMITER+nestedLevels+LOG_DELIMITER+query.getQuery()+"\r\n");
			}
			
			outBuff.close();
			
			System.out.println("QUERIES WITH NESTED NESTED LOOPS = "+numQueries);
			System.out.println("OUTPUT TO '"+OUTPUT_LOG_DIR+"\\"+NESTED_LOOPS_LOG+"'");
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
		finally {
			try {
				if ( rs != null ) rs.close();
			}
			catch(SQLException e) {}	
			try {
				if ( stmt != null ) stmt.close();
			}
			catch(SQLException e) {}	
		}
	}
	
	/**
	 *	Outputs a log of queries that use 'like' and the number of times it is used by each query. 
	 *
	 */
	public void analyseLikeCount() 
	{
		try {
			FileWriter out = new FileWriter(OUTPUT_LOG_DIR+"/"+LIKE_COUNT_LOG);
			BufferedWriter outBuff = new BufferedWriter(out);
		
			int numQueries = 0;
			Iterator it = m_logQueries.iterator();
			int queryId = 0;
			P6SpyLogStatement stmt = null;
			
			while (it.hasNext()) {
				stmt = (P6SpyLogStatement)it.next();
				String queryString = stmt.getParameterisedQuery();
				
				int likeCount = 0;
				String[] splitQuery = queryString.split("LIKE");
				likeCount = Array.getLength(splitQuery)-1;
					
				if ( likeCount > 0 ) {
					outBuff.write(queryId+LOG_DELIMITER+likeCount+LOG_DELIMITER+queryString+"\r\n");
					numQueries++;
				}
				
				queryId += 1;
			}
			
			outBuff.close();

			System.out.println("QUERIES USING 'LIKE' = "+numQueries);
			System.out.println("OUTPUT TO '"+OUTPUT_LOG_DIR+"\\"+LIKE_COUNT_LOG+"'");
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	/**
	 *	Outputs a log of identical queries that are executed > once. 
	 *
	 */
	public void analyseIdenticalQueries() 
	{
		try {
			FileWriter out = new FileWriter(OUTPUT_LOG_DIR+"/"+IDENTICAL_QUERY_COUNT_LOG);
			BufferedWriter outBuff = new BufferedWriter(out);
		
			int numQueries = 0;
			Iterator it = m_logQueries.iterator();
			int queryId = 0;
			int executionCount = 0;
			P6SpyLogStatement stmt = null;
			
			while (it.hasNext()) {
				stmt = (P6SpyLogStatement)it.next();
				executionCount = stmt.getCount();
				
				if ( executionCount > 1 ) {
					outBuff.write(queryId+LOG_DELIMITER+executionCount+LOG_DELIMITER+stmt.getQuery()+"\r\n");
					numQueries++;
				}
				
				queryId += 1;
			}
			
			outBuff.close();

			System.out.println("QUERIES EXECUTED MORE THAN ONCE = "+numQueries);
			System.out.println("OUTPUT TO '"+OUTPUT_LOG_DIR+"\\"+IDENTICAL_QUERY_COUNT_LOG+"'");
		}
		catch(Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		ExplainPlanAnalyzer analyzer = new ExplainPlanAnalyzer();
		analyzer.loadP6SpyLogFile();
		
		Connection conn = analyzer.getConnection();
		if ( conn !=null ) {
			analyzer.generateExplainPlan(conn);
			System.out.println("\r\n*** ANALYSIS SUMMARY ***");
			analyzer.analyseCartesianJoins(conn);
			System.out.println("------------------------");
			analyzer.analyseFullTableScans(conn);
			System.out.println("------------------------");
			analyzer.analyseFullIndexScans(conn);
			System.out.println("------------------------");
			analyzer.analyseCost(conn);
			System.out.println("------------------------");
			analyzer.analyseCardinality(conn);
			System.out.println("------------------------");
			analyzer.analyseNestedOrderBy(conn);
			System.out.println("------------------------");
			analyzer.analyseNestedLoops(conn);
			System.out.println("------------------------");
			analyzer.analyseLikeCount();
			System.out.println("------------------------");
			analyzer.analyseIdenticalQueries();
			System.out.println("------------------------");
			analyzer.closeConnection(conn);
		}
	}

	
	
	private class P6SpyLogStatement {
		private String m_parameterisedQuery = null; // the query with parameterised arguments
		private String m_query = null; // the query with values for the parameters
		private int m_count = 0;
		private int m_statementType = UNKNOWN_TYPE;
		
		public static final int UNKNOWN_TYPE = -1;
		public static final int SELECT_TYPE = 0;
		public static final int UPDATE_TYPE = 1;
		public static final int DELETE_TYPE = 2;
		public static final int INSERT_TYPE = 3;
		
		public P6SpyLogStatement(String logEntry) {
			m_count = 1;
			
			if ( logEntry != null && logEntry.length() > 0 ) {
				int parameterisedStmtPos = logEntry.indexOf("|statement|") + 11;
				int substitutedStmtPos = -1;
				
				if ( logEntry.indexOf("SELECT",parameterisedStmtPos) == parameterisedStmtPos) {
					m_statementType = SELECT_TYPE;
					substitutedStmtPos = logEntry.indexOf("|SELECT",parameterisedStmtPos);
				}
				else if ( logEntry.indexOf("UPDATE",parameterisedStmtPos) == parameterisedStmtPos) {
					m_statementType = UPDATE_TYPE;
					substitutedStmtPos = logEntry.indexOf("|UPDATE",parameterisedStmtPos);
				}
				else if ( logEntry.indexOf("DELETE",parameterisedStmtPos) == parameterisedStmtPos) {
					m_statementType = DELETE_TYPE;
					substitutedStmtPos = logEntry.indexOf("|DELETE",parameterisedStmtPos);
				}
				else if ( logEntry.indexOf("INSERT",parameterisedStmtPos) == parameterisedStmtPos) {
					m_statementType = INSERT_TYPE;
					substitutedStmtPos = logEntry.indexOf("|INSERT",parameterisedStmtPos);
				}
				
				if ( substitutedStmtPos != -1 ) {
					m_parameterisedQuery = logEntry.substring(parameterisedStmtPos, substitutedStmtPos);
					m_parameterisedQuery = m_parameterisedQuery.toUpperCase();
					m_query = logEntry.substring(substitutedStmtPos+1);
				}
			}
		}
		
		public String getParameterisedQuery() {
			return m_parameterisedQuery;
		}
		
		public String getQuery() {
			return m_query;
		}
		
		public int incrementCount() {
			m_count++;
			return m_count;
		}
		
		public int getCount() {
			return m_count;
		}
		
		public int getStatementType() {
			return m_statementType;
		}
		
		/**
		 * A P6SpyLogStatement is equal to another if they have the same query string and parameter values 
		 */
		public boolean equals(Object o) {
			boolean bEqual = false;
			
			if ( m_query.compareTo( ((P6SpyLogStatement)o).getQuery() ) ==0 ){
				bEqual = true;
			}
			
			return bEqual;
		}
	}
	
}
