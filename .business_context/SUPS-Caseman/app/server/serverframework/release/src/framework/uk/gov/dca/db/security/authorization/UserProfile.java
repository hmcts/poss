package uk.gov.dca.db.security.authorization;

import java.util.List;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.security.user.ADUserPersonalDetails;
import uk.gov.dca.db.security.user.UpdateUserCourtDetails;
import uk.gov.dca.db.security.user.UpdateUserDetails;
import uk.gov.dca.db.security.user.UserPersonalDetails;

/**
 * @author Imran Patel
 *
 */
public interface UserProfile {

	/**
	 * Validates whether the user is active
	 * @param userId
	 */
	public boolean isUserActive(String userId) throws SystemException, BusinessException;
	
	/**
	 * Gets user personal details from Active Directory and returns them.
	 * 
	 * @param userId
	 */
	public ADUserPersonalDetails getADUserDetails(String userId) throws SystemException;
	
	/**
	 * Copies user personal details from Active Directory and inserts into the database.
	 * This differs from the 'updatePersonalDetails' method in that it is creating a new record
	 * in the database rather than updating an existing one.
	 * 
	 * @param userId
	 * @param updateDetails - holds details for DCA_USER that do not come from AD
	 */
	public void createUser(String userId, String courtCode, UpdateUserDetails updateDetails, UpdateUserCourtDetails updateCourtDetails) throws SystemException;
	

	/**
	 * Updates selected user details.
	 * @param userId
	 * @param updateDetails
	 */
	public void updateUser(String userId, UpdateUserDetails updateDetails) throws SystemException;
	
	/**
	 * Adds a user court record.
	 * 
	 * @param userId
	 * @param courtCode
	 * @param updateCourtDetails
	 * @throws SystemException
	 */
	public void insertUserCourt(String userId, String courtCode, UpdateUserCourtDetails updateCourtDetails) throws SystemException;
	
	/**
	 * Updates an existing user court record.
	 * 
	 * @param userId
	 * @param courtCode
	 * @param updateCourtDetails
	 * @throws SystemException
	 */
	public void updateUserCourt(String userId, String courtCode, UpdateUserCourtDetails updateCourtDetails) throws SystemException;
	
	/**
	 * Returns a list of user court info for a given user.
	 * 
	 * @param userId
	 * @return
	 * @throws SystemException
	 */
	public List getUserCourts(String userId) throws SystemException;
	
	/**
	 * Retrieves the roles currently assigned to the user for the court specified
	 * 
	 * @param userId
	 * @param courtCode
	 * @return List of all of the roles currently assigned to the user/court combination
	 * @throws SystemException
	 */
	public List getRoles(String userId, String courtCode) throws SystemException;
	
	/**
	 * Retrieves the court marked as the home court for the specified user
	 * 
	 * @param userId
	 * @return
	 * @throws SystemException
	 */
	public String getHomeCourt(String userId) throws SystemException;
	
	/**
	 * Copies the personal details of the specified user from active directory
	 * 
	 * @param userId
	 * @throws BusinessException
	 * @throws SystemException
	 */
	public void updatePersonalDetails(String userId) throws BusinessException, SystemException;
	
	/**
	 * Retrieves a list of all of the roles defined for the current application
	 * 
	 * @return List containing all of the currently defined roles for the application
	 * @throws SystemException
	 */
	public List getAllRoles() throws SystemException;
	
	/**
	 * Updates the roles currently assigned to the specified user.  This is achieved by first
	 * removing all roles from the user and then only adding the new roles specified to the method.
	 * 
	 * @param userId the id of the user whose roles should be updated
	 * @param court the court for the user specified (see above)
	 * @param roles a list containing the new role assignments
	 * @throws SystemException
	 */
	public void updateRoles(String userId, String court, List roles) throws SystemException;
	
	/**
	 * Gets the users' default printer.
	 * 
	 * @param userId
	 * @return
	 * @throws SystemException
	 */
	public String getUserDefaultPrinter(String userId) throws SystemException;
	
	/**
	 * Returns the users' default printer
	 * @param userId
	 * @param defaultPrinter
	 * @throws SystemException
	 */
	public void setUserDefaultPrinter(String userId, String defaultPrinter) throws SystemException;
	
	/**
	 * Returns the users details.
	 * 
	 * @param userId
	 * @return
	 * @throws SystemException
	 */
	public UserPersonalDetails getUserDetails(String userId) throws SystemException;
    
    /**
     * Sets the context for the user executing changes to the user profile.
     * 
     * @param ctx
     */
    public void setContext(IComponentContext ctx);

}
