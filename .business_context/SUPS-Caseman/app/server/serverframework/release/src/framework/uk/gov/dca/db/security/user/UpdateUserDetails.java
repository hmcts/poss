/*
 * Created on Aug 24, 2005
 *
 */
package uk.gov.dca.db.security.user;

import uk.gov.dca.db.exception.BusinessException;

/**
 * A placeholder for info about the user details to be updated. 
 * Only for data stored in SUPS db. i.e. DCA_USER table, not Active Directory.
 * 
 * @author GrantM
 *
 **/
public class UpdateUserDetails {

	private boolean setStyleProfile = false;
	private boolean setAccessLevel = false;
	private boolean setActiveUser = false;
	private boolean setTitle = false;
	private boolean setExtension = false;
	private boolean setUserShortName = false;
	private boolean setJobTitle = false;
	
	private String styleProfile = null;
	private int accessLevel = 0;
	private String activeUser = null;
	private String title = null;
	private String extension = null;
	private String userShortName = null;
	private String jobTitle = null;
	
	public UpdateUserDetails(boolean setStyleProfile, boolean setAccessLevel, boolean setActiveUser,
				boolean setExtension, boolean setUserShortName, boolean setJobTitle, boolean setTitle,
				String styleProfile, String accessLevel, String activeUser,
				String title, String extension, String userShortName, String jobTitle)
		throws BusinessException
	{
		this.setStyleProfile=setStyleProfile;
		this.setAccessLevel=setAccessLevel;
		this.setActiveUser=setActiveUser;
		this.setExtension = setExtension;
		this.setUserShortName = setUserShortName;
		this.setJobTitle = setJobTitle;
		this.setTitle = setTitle;
		
		this.styleProfile=styleProfile;
		this.title = title;
		this.extension = extension;
		this.userShortName = userShortName;
		this.jobTitle = jobTitle;
		
		if (setActiveUser)
		{	
			this.activeUser=activeUser;
			if( !isActiveUserFlagValid() ) {
				throw new BusinessException("Invalid active user flag value '"+activeUser+"'. Must be 'Y' or 'N'");
			}
		}
		
		if (setAccessLevel) 
		{
			try {
				this.accessLevel = Integer.parseInt(accessLevel);
			}
			catch(Exception e) {
				throw new BusinessException("Invalid access level '"+accessLevel+"'. Must be a number.");
			}
		}
		
	}
	
	public boolean getSetStyleProfile() {
		return setStyleProfile;
	}

	public boolean getSetAccessLevel() {
		return setAccessLevel;
	}
	
	public boolean getSetActiveUser() {
		return setActiveUser;
	}

	public boolean getSetUserShortName() {
		return setUserShortName;
	}
	
	public boolean getSetExtension() {
		return setExtension;
	}

	public boolean getSetJobTitle() {
		return setJobTitle;
	}
	
	public boolean getSetTitle() {
		return setTitle;
	}

	public String getStyleProfile() {
		return styleProfile;
	}

	public int getAccessLevel() {
		return accessLevel;
	}
	
	public String getActiveUser() {
		return activeUser;
	}
	
	public String getExtension() {
		return extension;
	}
	
	public String getTitle() {
		return title;
	}
	
	public String getJobTitle() {
		return jobTitle;
	}
	
	public String getUserShortName() {
		return userShortName;
	}

	private boolean isActiveUserFlagValid() {
		boolean valid = false;
		
		if ( "Y".compareToIgnoreCase(activeUser)==0 ||
				"N".compareToIgnoreCase(activeUser)==0 )
		{
			valid = true;
		}
		
		return valid;
	}
}
