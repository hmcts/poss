/*
 * Created on 29-Apr-2005
 *
 * TODO To change the template for this generated file go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
package uk.gov.dca.test_project.test_service.classes;

import java.io.IOException;
import java.io.Writer;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jdom.Document;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.impl.command.Command;
import uk.gov.dca.db.impl.command.CommandRouter;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;

/**
 * @author JamesB
 *
 * TODO To change the template for this generated type comment go to
 * Window - Preferences - Java - Code Style - Code Templates
 */
public class SucceedToggle extends AbstractCustomProcessor {

	/**
	 * 
	 */
	public SucceedToggle() {
		super();
		// TODO Auto-generated constructor stub
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer, org.apache.commons.logging.Log)
	 */
	public void process(Document inputParameters, Writer output, Log log) throws BusinessException, SystemException {
		int result = getToggleValue();
		
		if(result == FAIL) {
			throw new UnknownException("Throwing a new Exception on this call.  Repeat the call for success");
		}
		
		try {
			output.write("<sampleData><a>The toggle was set to succeed!  The next call will fail.</a></sampleData>");
		}
		catch( IOException e) {
			throw new SystemException("Unable to write to output: " +e.getMessage(), e);
		}
	}
	
	private int getToggleValue() throws SystemException, BusinessException {
		int result = 0;
		ResultSet rs = null;
		Connection con = null;
		PreparedStatement ps = null;
		CommandRouter router = new CommandRouter();
		
		try {
			DataSource ds = getDataSource();
			con = ds.getConnection();
			
			// If the table does not yet exist in the database then create it now
			DatabaseMetaData metaData = con.getMetaData();
			rs = metaData.getTables(null, null, TABLE_NAME, null);
			
			if(!rs.next()) {
				Command command = new SetUpTestCommand();
				router.route(command);
			}
    		rs.close();
    		
    		// query the flag indicating whether this invocation should succeed or fail
    		ps = con.prepareStatement("SELECT SUCCESS_IND FROM " + TABLE_NAME);
    		rs = ps.executeQuery();
			if(!rs.next()) {
				throw new SystemException("No records exist in table " + TABLE_NAME + ".  Either add a record or delete the table");
			}
			result = rs.getInt(1);
			rs.close();
			ps.close();
			
			
			// toggle the flag so that the next invocation of this service will behave the opposite of this one i.e. if this invocation fails then the next should succeed
			int newResult = (result == FAIL ? SUCCEED : FAIL);
		
			// update the flag in the database.  Note - this is done using a Command that executes within a seperate transaction context so that it will be committed even if
			// an exception is thrown and this transaction is rolled back.
			log.info("Updating flag to new value " + newResult);
			Command toggleCommand = new ToggleFlagCommand(newResult);
			router.route(toggleCommand);
			log.info("Method complete, clearing up");
		}
		catch(SQLException e) {
			log.warn(e);
			throw new SystemException("A Database access error occurred", e);
		}
		finally {
			try {
				if(rs != null) {
					rs.close();
				}
				if(ps != null) {
					ps.close();
				}
				if(con != null) {
					con.close();
				}
			}
			catch(SQLException e) {
				log.error("Error whilst clearing up", e);
				// <gulp!> Swallow exception to prevent it from masking the original exception
			}
		}
		return result;
	}
	
	private DataSource getDataSource() throws SystemException {
		DataSource result = null;
		
		try {
			InitialContext context = new InitialContext();
			result = (DataSource) context.lookup("java:SupsDS");
		}
		catch(NamingException e) {
			throw new SystemException("Could not retrieve DataSource", e);
		}
		
		return result;
	}
	
	// This functionality is implemented as a Command so that it may be executed within a seperate (autonomous) transaction context.
	private class SetUpTestCommand implements Command {
				
		public void execute() throws SystemException {
			Connection con = null;
			Statement createStatement = null;
			
			try {
				DataSource ds = getDataSource();
				con = ds.getConnection();
			
				log.info("Creating table...");
				createStatement = con.createStatement();
				createStatement.execute("CREATE TABLE " + TABLE_NAME + " (SUCCESS_IND NUMBER(1))");
				createStatement.close();
				log.info("Done");
				log.info("Inserting value for flag...");
				createStatement = con.createStatement();
				createStatement.execute("INSERT INTO " + TABLE_NAME + "(SUCCESS_IND) VALUES (0)");
				createStatement.close();
				log.info("Done");
			}
			catch(SQLException e) {
				throw new SystemException("Error preparing test", e);
			}
			finally {
				try {
					if(createStatement != null) {
						createStatement.close();
					}
					if(con != null) {
						con.close();
					}
				}
				catch(SQLException e) {
					// <gulp>! swallow exception so that root cause is not masked
				}
			}
		}
	}
	
	// This functionality is implemented as a Command so that it may be executed within a seperate (autonomous) transaction context
	private class ToggleFlagCommand implements Command {
		
		public ToggleFlagCommand(int newResult) {
			this.newResult = newResult;
		}
		
		public void execute() throws SystemException {
			Connection con = null;
			PreparedStatement ps = null;
			
			try {
				DataSource ds = getDataSource();
				con = ds.getConnection();
			
				log.info("Updating value...");
				ps = con.prepareStatement("UPDATE " + TABLE_NAME + " SET SUCCESS_IND = " + newResult);
				ps.execute();
				ps.close();
				log.info("Done");
			}
			catch(SQLException e) {
				throw new SystemException("Error updating flag", e);
			}
			finally {
				try {
					if(ps != null) {
						ps.close();
					}
					if(con != null) {
						con.close();
					}
				}
				catch(SQLException e) {
					// <gulp>! swallow exception so that root cause is not masked
				}
			}
		}
		
		private int newResult;
	}

	private static final String TABLE_NAME = "TEST_SUCCESS_FLAG";
	private static final int SUCCEED = 1;
	private static final int FAIL = 0;
	private static final Log log = LogFactory.getLog(SucceedToggle.class);
}
