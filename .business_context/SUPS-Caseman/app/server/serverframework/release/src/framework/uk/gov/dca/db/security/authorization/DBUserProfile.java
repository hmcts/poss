package uk.gov.dca.db.security.authorization;

import org.apache.commons.logging.Log;
import uk.gov.dca.db.ejb.ServiceLocator;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.security.user.ADUserPersonalDetails;
import uk.gov.dca.db.security.user.CrestUserCourtDetails;
import uk.gov.dca.db.security.user.FamilyManUserPersonalDetails;
import uk.gov.dca.db.security.user.SupsUserPersonalDetails;
import uk.gov.dca.db.security.user.UpdateUserCourtDetails;
import uk.gov.dca.db.security.user.UpdateUserDetails;
import uk.gov.dca.db.security.user.UserCourtDetails;
import uk.gov.dca.db.security.user.UserDirectoryDAO;
import uk.gov.dca.db.security.user.UserPersonalDetails;
import uk.gov.dca.db.util.DBUtil;
import uk.gov.dca.db.util.SUPSLogFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * @author Imran Patel
 *
 */
public class DBUserProfile implements UserProfile {
	
	private Map rolesMap = new HashMap();
	
	private static final Log log = SUPSLogFactory.getLogger(DBUserProfile.class);
	
	// DCA_USER queries
	private static final String UPDATE_USER_DETAILS = "UPDATE DCA_USER SET user_id = ?, forenames = ?, surname = ? WHERE user_id = ?";
	private static final String UPDATE_USER_DEFAULT_PRINTER = "UPDATE DCA_USER set user_default_printer = ? WHERE user_id = ?";
	private static final String SELECT_USER_DEFAULT_PRINTER = "SELECT user_default_printer FROM DCA_USER WHERE user_id = ?";
	private static final String GET_USER_DETAILS = "SELECT * FROM DCA_USER WHERE USER_ID = ?";
	private static final String SELECT_ACTIVE_USER_FLAG = "SELECT ACTIVE_USER_FLAG FROM DCA_USER WHERE USER_ID = ?";
	
	// USER_COURT queries
	private static final String SELECT_HOME_COURT = "SELECT COURT_CODE FROM USER_COURT WHERE USER_ID = ? AND HOME_FLAG = 'Y'";
	private static final String GET_USER_COURTS = "SELECT * FROM USER_COURT WHERE USER_ID = ?";
	
	// USER_ROLE queries
	private static final String SELECT_ROLE_ID = "SELECT ROLE_ID FROM USER_ROLE WHERE USER_ID = ? AND COURT_CODE = ?";
	private static final String DELETE_USER_ROLES = "DELETE FROM user_role WHERE user_id = ? AND court_code = ?";
	private static final String INSERT_USER_ROLES = "INSERT INTO user_role (role_id, court_code, user_id) VALUES (?, ?, ?)";
		
	
	private String datasourceId = null;
	private UserDirectoryDAO userDAO = null;

    private IComponentContext m_context;
		
	public DBUserProfile(Map rolesMap, String datasourceId, UserDirectoryDAO userDAO) throws SystemException{
		
		this.userDAO = userDAO;
		this.rolesMap = rolesMap;
		this.datasourceId = datasourceId;
		
		if(rolesMap ==  null)
			throw new SystemException();
	}
	
	public ADUserPersonalDetails getADUserDetails(String userId) throws SystemException
	{
		return userDAO.getPersonalDetailsForUser(userId);
	}
	
	public void createUser(String userId, String courtCode, UpdateUserDetails updateDetails, UpdateUserCourtDetails updateCourtDetails) 
		throws SystemException 
	{
		DataSource datasource = null;
		Connection con = null;
		PreparedStatement ps = null;
		
		// Use a dynamic SQL statement because there are several different possible permutations of this query.
		// However, there is a small enough number for there to be some benefit from a PreparedStatement
		// (also prevents SQL insertion).
		StringBuffer fieldsBuff = new StringBuffer();
		StringBuffer valuesBuff = new StringBuffer();
		fieldsBuff.append("user_id, forenames, surname, active_user_flag");
		valuesBuff.append("?, ?, ?, ?");
		
		if ( updateDetails.getSetAccessLevel() ) {
			fieldsBuff.append(", access_security_level"); 
			valuesBuff.append(", ?");
		}
		if ( updateDetails.getSetExtension() ) {
			fieldsBuff.append(", extension"); 
			valuesBuff.append(", ?");
		}
		if ( updateDetails.getSetJobTitle() ) {
			fieldsBuff.append(", job_title"); 
			valuesBuff.append(", ?");
		}
		if ( updateDetails.getSetStyleProfile()) {
			fieldsBuff.append(", user_style_profile"); 
			valuesBuff.append(", ?");
		}
		if ( updateDetails.getSetTitle()) {
			fieldsBuff.append(", title"); 
			valuesBuff.append(", ?");
		}
		if ( updateDetails.getSetUserShortName()) {
			fieldsBuff.append(", user_short_name"); 
			valuesBuff.append(", ?");
		}
		
		String queryString = "INSERT INTO DCA_USER ("+fieldsBuff.toString()+") VALUES ("+valuesBuff.toString()+")";
		log.debug("Inserting into dca_user: "+queryString);
		
		try {
			ADUserPersonalDetails details = userDAO.getPersonalDetailsForUser(userId);
			
			if(details == null) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null UserPersonalDetails record from Active Directory");
			}
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if ( datasource == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null DataSource");
			}
			
			con = datasource.getConnection();
            DBUtil.populateApplicationContext(con, m_context);
			
			if ( con == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null Connection");
			}
			
			ps = con.prepareStatement(queryString);
			ps.setString(1, details.getUserId().toLowerCase());
			ps.setString(2, details.getForenames());
			ps.setString(3, details.getSurname());
			ps.setString(4, updateDetails.getActiveUser());
			
			int fieldCounter = 4;
			
			if ( updateDetails.getSetAccessLevel() ) {
				ps.setInt( ++fieldCounter, updateDetails.getAccessLevel());
			}
			if ( updateDetails.getSetExtension() ) {
				ps.setString(++fieldCounter, updateDetails.getExtension());
			}
			if ( updateDetails.getSetJobTitle() ) {
				ps.setString(++fieldCounter, updateDetails.getJobTitle());
			}
			if ( updateDetails.getSetStyleProfile()) {
				ps.setString(++fieldCounter, updateDetails.getStyleProfile());
			}
			if ( updateDetails.getSetTitle()) {
				ps.setString(++fieldCounter, updateDetails.getTitle());
			}
			if ( updateDetails.getSetUserShortName()) {
				ps.setString(++fieldCounter, updateDetails.getUserShortName());
			}
			
			int updates = 0;
			updates = ps.executeUpdate();
			
			if(updates == 0) {
				throw new SystemException("Failed to create user = " + details.getUserId());
			}	
			
			//create USER_COURT entry
			insertUserCourt(userId, courtCode, updateCourtDetails);
		}
		catch(SQLException e) {
			throw new SystemException("Failed to create user = "+ userId +": "+e.getMessage(), e);
		}
		finally {
            DBUtil.quietClose(ps);
		    DBUtil.quietClose(con);
		} 
	}
	

	public void updateUser(String userId, UpdateUserDetails updateDetails) throws SystemException
	{
		// Use a dynamic SQL statement because there are several different possible permutations of this query.
		// However, there is a small enough number for there to be some benefit from a PreparedStatement
		// (also prevents SQL insertion).
		StringBuffer updateBuff = new StringBuffer();
		updateBuff.append("UPDATE DCA_USER SET");
		int numFields = 0;
		
		if ( updateDetails.getSetAccessLevel() ) {
			updateBuff.append(" ACCESS_SECURITY_LEVEL = ?");
			numFields++;
		}
		if ( updateDetails.getSetActiveUser() ) {
			if (numFields>0) {
				updateBuff.append(", ");
			}
			updateBuff.append(" ACTIVE_USER_FLAG = ?");
			numFields++;
		}
		if ( updateDetails.getSetExtension() ) {
			if (numFields>0) {
				updateBuff.append(", ");
			}
			updateBuff.append(" EXTENSION = ?");
			numFields++;
		}
		if ( updateDetails.getSetJobTitle() ) {
			if (numFields>0) {
				updateBuff.append(", ");
			}
			updateBuff.append(" JOB_TITLE = ?"); 
			numFields++;
		}
		if ( updateDetails.getSetStyleProfile() ) {
			if (numFields>0) {
				updateBuff.append(", ");
			}
			updateBuff.append(" USER_STYLE_PROFILE = ?"); 
			numFields++;
		}
		if ( updateDetails.getSetTitle() ) {
			if (numFields>0) {
				updateBuff.append(", ");
			}
			updateBuff.append(" TITLE = ?"); 
			numFields++;
		}
		if ( updateDetails.getSetUserShortName() ) {
			if (numFields>0) {
				updateBuff.append(", ");
			}
			updateBuff.append(" USER_SHORT_NAME = ?"); 
			numFields++;
		}
		
		updateBuff.append(" WHERE USER_ID = ?");
		if ( numFields==0 )
		{
			log.info("Failed to update user '"+userId+"'. Nothing to update.");
			return;
		}
		
		String queryString = updateBuff.toString();
		log.debug("Updating user: "+queryString);
		
		// each update maps to a separate prepared statement.
		// this is because it may give better performance than setting all at once via
		// dynamic SQL. It is also probably true that these fields will be set individually
		// by the UI.
		DataSource datasource = null;
		Connection con = null;
		PreparedStatement ps = null;
		
		try {
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if ( datasource == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null DataSource");
			}
			
			con = datasource.getConnection();
            DBUtil.populateApplicationContext(con, m_context);
			
			if ( con == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null Connection");
			}
			
			ps = con.prepareStatement(queryString);
			int fieldCounter = 0;
			if ( updateDetails.getSetAccessLevel() ) {
				ps.setInt(++fieldCounter, updateDetails.getAccessLevel());
			}
			if ( updateDetails.getSetActiveUser() ) {
				ps.setString(++fieldCounter, updateDetails.getActiveUser());
			}
			if ( updateDetails.getSetExtension() ) {
				ps.setString(++fieldCounter, updateDetails.getExtension());
			}
			if ( updateDetails.getSetJobTitle() ) {
				ps.setString(++fieldCounter, updateDetails.getJobTitle());
			}
			if ( updateDetails.getSetStyleProfile() ) {
				ps.setString(++fieldCounter, updateDetails.getStyleProfile());
			}
			if ( updateDetails.getSetTitle() ) {
				ps.setString(++fieldCounter, updateDetails.getTitle());
			}
			if ( updateDetails.getSetUserShortName() ) {
				ps.setString(++fieldCounter, updateDetails.getUserShortName());
			}
			
			ps.setString(++fieldCounter, userId.toLowerCase());
		
			int updates = ps.executeUpdate();
			if ( updates == 0 ) {
				throw new SystemException("Failed to update user '"+userId+"'");
			}
			
			ps.close();
			con.close();
		}
		catch(SQLException e) {
			throw new SystemException("Failed to update user details for '"+userId+"': "+e.getMessage(), e);
		}
		finally {
            DBUtil.quietClose(ps);
		    DBUtil.quietClose(con);
		} 
		
	}
	
	
	public List getRoles(String userId, String courtCode) throws SystemException{
		
		if(userId == null || courtCode == null || userId.equals("") || courtCode.equals("")){
			throw new SystemException("No userId or courtId");
		}
		
	    log.debug("Getting roles for user: " + userId + " court: " + courtCode);
		DataSource datasource = null;
		Connection con = null;
		List rolesList = new ArrayList();
		ResultSet results = null;
		PreparedStatement selectStatement = null;
		
		try {
			// select record for update
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			con = datasource.getConnection();
			
			selectStatement = con.prepareStatement(SELECT_ROLE_ID);
			selectStatement.setString(1, userId.toLowerCase());
			selectStatement.setString(2, courtCode);
			results = selectStatement.executeQuery();
			
			while(results.next()){
				String roleId = results.getString(1);
				Role role = (Role) rolesMap.get(roleId);
				rolesList.add(role);
			}
		}
		catch(SQLException e) {
			throw new SystemException("Could not retrieve roles for the specified user");
		}
		finally {
            DBUtil.quietClose(results);
            DBUtil.quietClose(selectStatement);
		    DBUtil.quietClose(con);
		} 
		
		return rolesList;
	}

	public String getHomeCourt(String userId) throws SystemException {
		DataSource datasource = null;
		Connection con = null;
		ResultSet results = null;
		PreparedStatement selectStatement = null;
		String courtCode = null;
		
		try {
			// select record for update
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if(datasource == null)
				throw new SystemException("Datasource retrieved using ServiceLocator was null; datasourceId is "+datasourceId);
			
			con = datasource.getConnection();
			
			selectStatement = con.prepareStatement(SELECT_HOME_COURT);
			selectStatement.setString(1, userId.toLowerCase());
			results = selectStatement.executeQuery();
			
			if(results.next())
				courtCode = results.getString(1);
		}
		catch(SQLException e) {
			throw new SystemException("Could not retrieve the home court for user - " + userId, e);
		}
		finally {
            DBUtil.quietClose(results);
            DBUtil.quietClose(selectStatement);
		    DBUtil.quietClose(con);
		} 
		
		return courtCode;
	}

	/**
	 * Copies user personal details from Active Directory to the application database
	 */
	public void updatePersonalDetails(String userId) throws BusinessException, SystemException {
		DataSource datasource = null;
		Connection con = null;
		PreparedStatement ps = null;
		
		try {
			ADUserPersonalDetails details = userDAO.getPersonalDetailsForUser(userId);
			String userHomeCourt = getHomeCourt(details.getUserId());
			
			if(details == null) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null UserPersonalDetails record from Active Directory");
			}
			
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if ( datasource == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null DataSource");
			}
			
			con = datasource.getConnection();
			DBUtil.populateApplicationContext(con, details.getUserId(), userHomeCourt, "login");
			
			if ( con == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null Connection");
			}
			
			ps = con.prepareStatement(UPDATE_USER_DETAILS);
			
			ps.setString(1, details.getUserId().toLowerCase());
			ps.setString(2, details.getForenames());
			ps.setString(3, details.getSurname());
			ps.setString(4, details.getUserId().toLowerCase());
			
			int updates = 0;
			updates = ps.executeUpdate();
			
			if(updates == 0) {
				throw new SystemException("Record not copied from Active Directory for user = " + details.getUserId());
			}
		}
		catch(SQLException e) {
			throw new SystemException("Failed to update user details from Active Directory: "+e.getMessage(), e);
		}
		finally {
            DBUtil.quietClose(ps);
		    DBUtil.quietClose(con);
		} 
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.authorization.UserProfile#getAllRoles()
	 */
	public List getAllRoles() throws SystemException {
		return new LinkedList(rolesMap.values());
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.authorization.UserProfile#updateRoles(java.lang.String, java.lang.String, java.util.List)
	 */
	public void updateRoles(String userId, String court, List roles) throws SystemException {
		DataSource datasource = null;
		Connection con = null;
		PreparedStatement ps = null;
		
		try {
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			con = datasource.getConnection();
            DBUtil.populateApplicationContext(con, m_context);
			
			// first delete from user_role table where userId and court match
			ps = con.prepareStatement(DELETE_USER_ROLES);
			
			ps.setString(1, userId.toLowerCase());
			ps.setString(2, court);
			
			ps.executeUpdate();
			
			ps.close();
			
			// insert into user_role table a new record for each role
			ps = con.prepareStatement(INSERT_USER_ROLES);
			
			Iterator i = roles.iterator();
			// create a batch of insert statements for user_role table
			while(i.hasNext()) {
				String roleName = (String) i.next();
				// translate the supplied role name from the client into a role id
				Iterator j = rolesMap.values().iterator();
				boolean roleFound = false;
				String roleId = null;
				while(j.hasNext() && !roleFound) {
					Role role = (Role) j.next();
					if(role.getName().equals(roleName)) {
						roleId = role.getId();
						roleFound = true;
					}
				}
				
				if(!roleFound) {
					throw new SystemException("The specified Role, '" + roleName + "' is undefined");
				}
				
				ps.setString(1, roleId);
				ps.setString(2, court);
				ps.setString(3, userId.toLowerCase());
				ps.addBatch();
			}
			
			// execute all insert statements as a single batch to improve performance
			ps.executeBatch();
			ps.close();
			con.close();
		}
		catch(SQLException e) {
			throw new SystemException("Failed to update user roles", e);
		}
		finally {
		    DBUtil.quietClose(con,ps);
		} 
	}
	
	public String getUserDefaultPrinter(String userId) throws SystemException
	{
		String userDefaultPrinter = "";
		DataSource datasource = null;
		Connection con = null;
		PreparedStatement ps = null;
		
		try {
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if ( datasource == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null DataSource");
			}
			
			con = datasource.getConnection();
			
			if ( con == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null Connection");
			}
			
			ps = con.prepareStatement(SELECT_USER_DEFAULT_PRINTER);
			ps.setString(1, userId.toLowerCase());
			
			ResultSet rs = ps.executeQuery();
			if ( rs != null ) {
				rs.next();
				userDefaultPrinter = rs.getString(1);
				if ( rs.wasNull() ) {
					userDefaultPrinter="";
				}
			}
			else {
				throw new SystemException("Failed to fetch default printer for user '"+userId+"'");
			}
			ps.close();
			con.close();
		}
		catch(SQLException e) {
			throw new SystemException("Failed to get user default printer from database", e);
		}
		finally {
		    DBUtil.quietClose(con,ps);
		} 
		
		return userDefaultPrinter;
	}
	
	public void setUserDefaultPrinter(String userId, String defaultPrinter) throws SystemException
	{
		DataSource datasource = null;
		Connection con = null;
		PreparedStatement ps = null;
		
		try {
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if ( datasource == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null DataSource");
			}
			
			con = datasource.getConnection();
            DBUtil.populateApplicationContext(con, m_context);
			
			if ( con == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null Connection");
			}
			
			ps = con.prepareStatement(UPDATE_USER_DEFAULT_PRINTER);
			ps.setString(1, defaultPrinter);
			ps.setString(2, userId.toLowerCase());
			
			int updates = ps.executeUpdate();
			if ( updates == 0 ) {
				throw new SystemException("Failed to update default printer for user '"+userId+"'");
			}
			
			ps.close();
			con.close();
		}
		catch(SQLException e) {
			throw new SystemException("Failed to update default printer for user '"+userId+"': "+e.getMessage(), e);
		}
		finally {
		    DBUtil.quietClose(con,ps);
		} 
	}

	public void insertUserCourt(String userId, String courtCode, UpdateUserCourtDetails updateCourtDetails) 
		throws SystemException
	{
		// Use a dynamic SQL statement because there are several different possible permutations of this query.
		// However, there is a small enough number for there to be some benefit from a PreparedStatement
		// (also prevents SQL insertion).
		StringBuffer fieldsBuff = new StringBuffer();
		StringBuffer valuesBuff = new StringBuffer();
		fieldsBuff.append("user_id, court_code, home_flag");
		valuesBuff.append("?, ?, 'N'");
		
		if ( updateCourtDetails.getSetDateFrom() ) {
			fieldsBuff.append(", date_from"); 
			valuesBuff.append(", ?");
		}
		if ( updateCourtDetails.getSetDateTo() ) {
			fieldsBuff.append(", date_to"); 
			valuesBuff.append(", ?");
		}
		if ( updateCourtDetails.getSetCrestStaffId() ) {
			fieldsBuff.append(", staff_id"); 
			valuesBuff.append(", ?");
		}
		if ( updateCourtDetails.getSetCrestUserId() ) {
			fieldsBuff.append(", crest_user_id"); 
			valuesBuff.append(", ?");
		}
		
		String queryString = "INSERT INTO USER_COURT ("+fieldsBuff.toString()+") VALUES ("+valuesBuff.toString()+")";
		log.debug("Inserting into user court: "+queryString);
		
		// now do the insert
		DataSource datasource = null;
		Connection con = null;
		PreparedStatement ps = null;
		
		try {
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if ( datasource == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null DataSource");
			}
			
			con = datasource.getConnection();
            DBUtil.populateApplicationContext(con, m_context);
			
			if ( con == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null Connection");
			}
			
			ps = con.prepareStatement(queryString);
			ps.setString(1, userId.toLowerCase());
			ps.setString(2, courtCode);
		
			int fieldCounter = 2;
			
			if ( updateCourtDetails.getSetDateFrom() ) {
				java.sql.Date sqlDate = new java.sql.Date(updateCourtDetails.getDateFrom().getTime());
				ps.setDate(++fieldCounter, sqlDate);
			}
			if ( updateCourtDetails.getSetDateTo() ) {
				java.sql.Date sqlDate = new java.sql.Date(updateCourtDetails.getDateTo().getTime());
				ps.setDate(++fieldCounter, sqlDate);
			}
			if ( updateCourtDetails.getSetCrestStaffId() ) {
				ps.setLong(++fieldCounter, updateCourtDetails.getCrestStaffId());
			}
			if ( updateCourtDetails.getSetCrestUserId() ) {
				ps.setString(++fieldCounter, updateCourtDetails.getCrestUserId());
			}
			
			int updates = ps.executeUpdate();
			if ( updates == 0 ) {
				throw new SystemException("Failed to insert user court for user '"+userId+"'");
			}
			else {
				log.debug("Inserted user court for user '"+userId+"' and court '"+courtCode+"'");
			}
			ps.close();
			con.close();
		}
		catch(SQLException e) {
			throw new SystemException("Failed to insert user court for user '"+userId+"': "+e.getMessage(), e);
		}
		finally {
			DBUtil.quietClose(con,ps);
		} 	
	}
	
	public void updateUserCourt(String userId, String courtCode, UpdateUserCourtDetails updateCourtDetails) 
		throws SystemException
	{
		// Use a dynamic SQL statement because there are several different possible permutations of this query.
		// However, there is a small enough number for there to be some benefit from a PreparedStatement
		// (also prevents SQL insertion).
		StringBuffer updateBuff = new StringBuffer();
		updateBuff.append("UPDATE USER_COURT SET");
		int numFields = 0;
		
		if ( updateCourtDetails.getSetDateFrom() ) {
			updateBuff.append(" DATE_FROM = ?");
			numFields++;
		}
		if ( updateCourtDetails.getSetDateTo() ) {
			if (numFields>0) {
				updateBuff.append(", ");
			}
			updateBuff.append(" DATE_TO = ?");
			numFields++;
		}
		if ( updateCourtDetails.getSetCrestStaffId() ) {
			if (numFields>0) {
				updateBuff.append(", ");
			}
			updateBuff.append(" STAFF_ID = ?");
			numFields++;
		}
		if ( updateCourtDetails.getSetCrestUserId() ) {
			if (numFields>0) {
				updateBuff.append(", ");
			}
			updateBuff.append(" CREST_USER_ID = ?"); 
			numFields++;
		}
		
		updateBuff.append(" WHERE USER_ID = ? AND COURT_CODE = ?");
		if ( numFields==0 )
		{
			log.info("Failed to update user court for user '"+userId+"', court '"+courtCode+"'. Nothing to update.");
			return;
		}
		
		String queryString = updateBuff.toString();
		log.debug("Updating user court: "+queryString);
		
		// now do the insert
		DataSource datasource = null;
		Connection con = null;
		PreparedStatement ps = null;
		
		try {
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if ( datasource == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null DataSource");
			}
			
			con = datasource.getConnection();
			DBUtil.populateApplicationContext(con, m_context);
            
			if ( con == null ) {
				throw new SystemException(userDAO.getClass().getName() + " returned a null Connection");
			}
			
			ps = con.prepareStatement(queryString);
			int fieldCounter = 0;
			
			if ( updateCourtDetails.getSetDateFrom() ) {
				java.sql.Date sqlDate = new java.sql.Date(updateCourtDetails.getDateFrom().getTime());
				ps.setDate(++fieldCounter, sqlDate);
			}
			if ( updateCourtDetails.getSetDateTo() ) {
				java.sql.Date sqlDate = new java.sql.Date(updateCourtDetails.getDateTo().getTime());
				ps.setDate(++fieldCounter, sqlDate);
			}
			if ( updateCourtDetails.getSetCrestStaffId() ) {
				ps.setLong(++fieldCounter, updateCourtDetails.getCrestStaffId());
			}
			if ( updateCourtDetails.getSetCrestUserId() ) {
				ps.setString(++fieldCounter, updateCourtDetails.getCrestUserId());
			}
			
			ps.setString(++fieldCounter, userId.toLowerCase());
			ps.setString(++fieldCounter, courtCode);
		
			int updates = ps.executeUpdate();
			if ( updates == 0 ) {
				throw new SystemException("Failed to update user court for user '"+userId+"', court '"+courtCode+"'");
			}
			
			ps.close();
			con.close();
		}
		catch(SQLException e) {
			throw new SystemException("Failed to update user court for user '"+userId+"': "+e.getMessage(), e);
		}
		finally {
			DBUtil.quietClose(con,ps);
		} 
	}

	public UserPersonalDetails getUserDetails(String userId) 
		throws SystemException
	{
		SupsUserPersonalDetails details = null;
		
		DataSource datasource = null;
		Connection con = null;
		ResultSet results = null;
		PreparedStatement selectStatement = null;
		
		try {
			// select record for update
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if(datasource == null)
				throw new SystemException("Datasource retrieved using ServiceLocator was null; datasourceId is "+datasourceId);
			
			con = datasource.getConnection();
			
			selectStatement = con.prepareStatement(GET_USER_DETAILS);
			selectStatement.setString(1, userId.toLowerCase());
			results = selectStatement.executeQuery();
			
			if(results.next()) 
			{
				// look at the resultset columns to determine the type of UserPersonalDetails to return
				try {
					results.findColumn("ACCESS_SECURITY_LEVEL");
					FamilyManUserPersonalDetails fmDetails = new FamilyManUserPersonalDetails();
	            	fmDetails.setAccessSecurityLevel(results.getInt("ACCESS_SECURITY_LEVEL"));
	            	details = fmDetails;
				}
	            catch(SQLException e) {
	            	details = new SupsUserPersonalDetails();
	            }

	            details.setUserId(userId);
	            String fieldValue = results.getString("TITLE");
	            if (!results.wasNull()) {
	            	details.setTitle(fieldValue);
		        }
	            fieldValue = results.getString("FORENAMES");
	            if (!results.wasNull()) {
	            	details.setForenames(fieldValue);
		        }
	            fieldValue = results.getString("SURNAME");
	            if (!results.wasNull()) {
	            	details.setSurname(fieldValue);
		        }
	            fieldValue = results.getString("USER_SHORT_NAME");
	            if (!results.wasNull()) {
	            	details.setUserShortName(fieldValue);
		        }
	            fieldValue = results.getString("JOB_TITLE");
	            if (!results.wasNull()) {
	            	details.setJobTitle(fieldValue);
		        }
	            fieldValue = results.getString("EXTENSION");
	            if (!results.wasNull()) {
	            	details.setExtension(fieldValue);
		        }
	            fieldValue = results.getString("ACTIVE_USER_FLAG");
	            if (!results.wasNull()) {
	            	details.setActiveUserFlag(fieldValue);
		        }
	            fieldValue = results.getString("USER_STYLE_PROFILE");
	            if (!results.wasNull()) {
	            	details.setUserStyleProfile(fieldValue);
		        }
	            fieldValue = results.getString("USER_DEFAULT_PRINTER");
	            if (!results.wasNull()) {
	            	details.setUserDefaultPrinter(fieldValue);
		        }
			}
		}
		catch(SQLException e) {
			throw new SystemException("Could not retrieve the user details for user '"+userId+"': "+e.getMessage(), e);
		}
		finally {
		    DBUtil.quietClose(con,selectStatement, results);
		} 
		
		return details;
	}
	
	public List getUserCourts(String userId) 
		throws SystemException
	{
		List userCourts = new ArrayList();
		
		DataSource datasource = null;
		Connection con = null;
		ResultSet results = null;
		PreparedStatement selectStatement = null;
		
		try {
			// select record for update
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if(datasource == null)
				throw new SystemException("Datasource retrieved using ServiceLocator was null; datasourceId is "+datasourceId);
			
			con = datasource.getConnection();
			
			selectStatement = con.prepareStatement(GET_USER_COURTS);
			selectStatement.setString(1, userId.toLowerCase());
			results = selectStatement.executeQuery();
			
			UserCourtDetails details = null; 
			boolean isCrest = false;
			boolean lookedForCrest = false;
			
			while(results.next()) 
			{
				// look at the resultset columns to determine the type of user court to return
				if ( !lookedForCrest )
				{
					lookedForCrest = true;
					try {
						results.findColumn("CREST_USER_ID");
						isCrest = true;
					}
		            catch(SQLException e) {
		            	// not crest, so do nothing
		            }
				}

				if (isCrest)
				{
					CrestUserCourtDetails crestDetails = new CrestUserCourtDetails();
					crestDetails.setStaffId(results.getInt("STAFF_ID"));
					String crestUserId = results.getString("CREST_USER_ID");
					if (!results.wasNull()) {
						crestDetails.setCrestUserId(crestUserId);
					}
	            	details = crestDetails;
				}
				else 
				{
	            	details = new UserCourtDetails();
	            }
	
	            details.setCourtCode(results.getString("COURT_CODE"));
	            details.setHomeFlag(results.getString("HOME_FLAG"));
	            java.sql.Date fromDate = results.getDate("DATE_FROM");
	            details.setFromDate( new Date(fromDate.getTime()));
	            java.sql.Date toDate = results.getDate("DATE_TO");
	            details.setToDate( new Date(toDate.getTime()));
	            
	            userCourts.add(details);
			}
		}
		catch(SQLException e) {
			throw new SystemException("Could not retrieve the user courts for user '"+userId+"': "+e.getMessage(), e);
		}
		finally {
		    DBUtil.quietClose(con,selectStatement, results);
		} 
		
		return userCourts;
	}

	/* (non-Javadoc)
	 * @see uk.gov.dca.db.security.authorization.UserProfile#isUserActive(java.lang.String)
	 */
	public boolean isUserActive(String userId) throws SystemException {
		
		boolean active = false;
		DataSource datasource = null;
		Connection con = null;
		ResultSet results = null;
		PreparedStatement selectStatement = null;
		
		try {
			// select record for update
			datasource = (DataSource) ServiceLocator.getInstance().get(datasourceId);
			
			if(datasource == null)
				throw new SystemException("Datasource retrieved using ServiceLocator was null; datasourceId is "+datasourceId);
			
			con = datasource.getConnection();
			
			selectStatement = con.prepareStatement(SELECT_ACTIVE_USER_FLAG);
			selectStatement.setString(1, userId.toLowerCase());
			results = selectStatement.executeQuery();
			
			if(results.next()) 
			{
	            String fieldValue = results.getString("ACTIVE_USER_FLAG");
	            if (!results.wasNull() && fieldValue.equalsIgnoreCase("Y")) {
	            	active = true;
		        }
			}
		}
		catch(SQLException e) {
			throw new SystemException("Could not retrieve the ACTIVE_USER_FLAG for user '"+userId+"': "+e.getMessage(), e);
		}
		finally {
		    DBUtil.quietClose(con,selectStatement, results);
		} 
		
		return active;
	}
    
    public void setContext(IComponentContext ctx) {
        this.m_context = ctx;
    }
    
 }
