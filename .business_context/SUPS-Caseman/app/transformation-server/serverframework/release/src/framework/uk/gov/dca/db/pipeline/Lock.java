/*
 * Created on 27-Oct-2004
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.db.pipeline;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.command.Command;
import uk.gov.dca.db.impl.command.CommandRouter;

/**
 * Implementation of the lock functionality used to synchronise requests within the pipeline.
 * 
 * @author JamesB
 */
public class Lock {

	/**
	 * Constructor
	 */
	public Lock(DataSource dataSource, String lockingTable, boolean wait) throws LockingException {
		super();
		
		this.dataSource = dataSource;
		this.lockingTable = lockingTable;
		this.wait = wait;
		
		// initialise object
		initialise();
	}
	
	/**
	 * Aquires the lock specified by the lockId parameter.  If the lock is already acquired by another thread and wait was specified
	 * as false then a LockUnavailableException is thrown.
	 * 
	 * @param lockId the Id of the lock to acquire
	 * @throws LockUnavailableException if another thread already has the lock and wait was specified as false
	 * @throws LockingException if an exception occurs whilst dealing with the locking mechanism
	 */
	public void obtain(String lockId) throws LockUnavailableException, SystemException, BusinessException {
		
		if(!initialised) {
			initialise();
		}
		
		try {			
			logDebug("obtain()", "Attempting to obtain lock", lockId);
			if(!findAndObtainLock(lockId)) {
				log.debug("obtain(): Lock does not exist, creating it now");
				Command command = new CreateLockCommand(lockId);
				// pass command to command router for immediate execution and commital
				router.route(command);
				
				// attempt to find and obtain the lock for a second time.  This time the lock should exist as we just created it.
				if(!findAndObtainLock(lockId)) {
					log.warn("obtain(): Assertion failed! Lock could not be found after creation: " + lockId);
					throw new LockingException("Lock could not be found after creation: " + lockId);
				}
			}
		}
		finally {
			tidyUp();
		}
	}
	
	/**
	 * 
	 * @param lockId
	 * @return
	 * @throws LockUnavailableException
	 * @throws LockingException
	 */
	private boolean findAndObtainLock(String lockId) throws LockUnavailableException, LockingException, SystemException {
		boolean result = false;
		ResultSet rs = null;
				
		try {
			selectStatement.setString(1, lockId);
   
			logDebug("findAndObtainLock()", "Executing query for lock", lockId);
			rs = selectStatement.executeQuery();
			
			if(rs.next()) {
				log.debug("findAndObtainLock(): found lock");
				result = true;
			}
		}
		catch(SQLException e) {
			log.warn("findAndObtainLock(): SQLException occurred whilst trying to obtain lock", e);
			if(e.getErrorCode() == ALREADY_IN_USE_ERROR) {
				// the lock is already held by another thread
				throw new LockUnavailableException("Lock already aquired by another thread and nowait specified for lock: " + lockId);
			}
			else {
				throw new LockingException("Failed to find Lock with Id '" + lockId +"': "+e.getMessage(), e);
			}
		}
		finally {
			try { 
				if(rs != null) {
					rs.close();
				}
			}
			catch(SQLException e) {
				log.error("findAndObtainLock(): An error occurred whilst attempting to tidy up", e);
				throw new SystemException("Failed to clean up after querying: "+e.getMessage(),e);
				// gulp...
			}
		}
		
		return result;
	}
		
	/**
	 * 
	 * @param lockingTable
	 * @param wait
	 * @return
	 */
	private String createSelectStatement(String lockingTable, boolean wait) {
		StringBuffer buffer = new StringBuffer(SELECT_STATEMENT);
		buffer.append(lockingTable);
		buffer.append(QUERY_WHERE_CLAUSE);
		buffer.append(SELECT_STATEMENT_LOCK_CLAUSE);
		if(wait == false) {
			buffer.append(SELECT_STATEMENT_NOWAIT_CLAUSE);
		}
		
		logDebug("createSelectStatement()", "Constructing SQL statement", buffer.toString());
		
		return buffer.toString();
	}
	
	private void initialise() throws LockingException {
		try {
			con = dataSource.getConnection();
			
			String selectString = createSelectStatement(lockingTable, wait);
			selectStatement = con.prepareStatement(selectString);
			
			initialised = true;
		}
		catch(SQLException e) {
			throw new LockingException("Failed to initialise Lock: "+e.getMessage(), e);
		}
	}
	
	private void tidyUp() throws SystemException {
		try {
			selectStatement.close();
			con.close();
			selectStatement = null;
			con = null;
		}
		catch(SQLException e) {
			log.error("tidyUp(): An error occured whilst tidying up", e);
			throw new SystemException("Failed to clean up after querying: "+e.getMessage(),e);
			// gulp...
		}
		finally {
			initialised = false;
		}
	}
	
	/**
	 * 
	 * @param methodName
	 * @param msg
	 * @param data
	 */
	private static void logDebug(String methodName, String msg, String data) {
		if(log.isDebugEnabled()) {
			StringBuffer buffer = new StringBuffer(100);
			buffer.append(methodName);
			buffer.append(": ");
			buffer.append(msg);
			buffer.append(" - [");
			buffer.append(data);
			buffer.append(']');
			log.debug(buffer.toString());
		}
	}

	private class CreateLockCommand implements Command {
		
		public CreateLockCommand(String lockId) {
			this.lockId = lockId;
		}

		/* (non-Javadoc)
		 * @see uk.gov.dca.db.impl.Command#execute()
		 */
		public void execute() throws SystemException {
			Connection connection = null;
			PreparedStatement insertStatement = null;
			
			try {
				connection = dataSource.getConnection();
				
				String insertString = createInsertStatement();
				insertStatement = connection.prepareStatement(insertString);
				
				insertStatement.setString(1, lockId);
				
				logDebug("CreateLockCommand.execute()", "Executing query for lock", lockId);
				int rowCount = insertStatement.executeUpdate();
				
				if(rowCount != 1) {
					//throw new LockingException("Failed to create lock for Id: " + lockId);
				}
			}
			catch(SQLException e) {
				if(e.getErrorCode() == ALREADY_CREATED_ERROR) {
					log.warn("CreateLockCommand.execute(): Row already created by another thread for lock: " + lockId);
					// ... gulp!
				}
				else {
					throw new LockingException("Failed to create lock for Id: " + lockId, e);
				}
			}
			finally {
				try {
					if(insertStatement != null) {
						insertStatement.close();
					}
					if(connection != null) {
						connection.close();
					}
				}
				catch(SQLException e) {
					log.error("CreateLockCommand.execute(): An error occured whilst tidying up", e);
					// gulp...
				}
			}
		}
		
		/**
		 * 
		 * @param lockingTable
		 * @return
		 */
		private String createInsertStatement() {
			StringBuffer buffer = new StringBuffer(INSERT_STATEMENT);
			buffer.append(lockingTable);
			buffer.append(INSERT_STATEMENT_FIELD_CLAUSE);
			
			logDebug("createInsertStatement()", "Constructing SQL statement", buffer.toString());
			
			return buffer.toString();
		}
		
		private static final String INSERT_STATEMENT = "INSERT INTO ";
		private static final String INSERT_STATEMENT_FIELD_CLAUSE = " (" + LOCK_ID_FIELD_NAME + ") VALUES (?)";
		
		private static final int ALREADY_CREATED_ERROR = 1;
		
		private String lockId = null;
	}
	
	private static final String LOCK_ID_FIELD_NAME = "lock_id";
	
	private static final String QUERY_FROM_CLAUSE = " FROM ";
	private static final String QUERY_WHERE_CLAUSE = " WHERE " + LOCK_ID_FIELD_NAME + " = ?";
	private static final String SELECT_STATEMENT_LOCK_CLAUSE = " FOR UPDATE";
	private static final String SELECT_STATEMENT_NOWAIT_CLAUSE = " NOWAIT";
	private static final String SELECT_STATEMENT = "SELECT " + LOCK_ID_FIELD_NAME + QUERY_FROM_CLAUSE;
	
	private static final int ALREADY_IN_USE_ERROR = 54;
	
	private DataSource dataSource = null;
	private Connection con = null;
	private PreparedStatement selectStatement = null;
	private CommandRouter router = new CommandRouter();
	
	private boolean wait;
	private String lockingTable;
	
	private boolean initialised = false;
	
	private static final Log log = LogFactory.getLog(Lock.class);
}
