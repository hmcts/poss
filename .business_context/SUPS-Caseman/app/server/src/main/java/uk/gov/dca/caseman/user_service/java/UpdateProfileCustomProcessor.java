/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision: $
 * $Author: $
 * $Date: $
 * $Id: $
 *
 ******************************************************************************/

package uk.gov.dca.caseman.user_service.java;

import java.io.IOException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.util.SUPSLogEvent;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * This custom processor is responsible for updating a user's profile. It deals with two types
 * of profile: active profiles and profiles that are being reactivated. It determines which type
 * of profile it is dealing with by the value in the ActiveUser element. If the profile is active
 * it just calls the updateUser service. However, if the user is being reactivated then it needs to
 * create a new USER_COURT record, create a new USER_ROLE record and finally update the DCA_USER record
 * with the data that is passed to this service.
 * 
 * Created on 08-Mar-2006
 *
 * Change History:
 * 16-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 21-Jun-2006 Phil Haferer (EDS): Addition of Audit Event Logging.
 * 21-Jul-2006 Phil Haferer (EDS): Added change of Role to Audit Event Logging.
 * 
 * @author kznwpr
 */

/**
 * Change History:
 * 21-Sep-2008 Sandeep Mullangi (Logica): RFC 521: Updating seperate admin role in the USER_ROLE table.
 */

public class UpdateProfileCustomProcessor extends AbstractCustomProcessor
{

    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The Constant USER_SERVICE. */
    private static final String USER_SERVICE = "ejb/UserServiceLocal";
    
    /** The Constant UPDATE_USER_METHOD. */
    private static final String UPDATE_USER_METHOD = "updateUserLocal";
    
    /** The Constant UPDATE_DCA_USER_METHOD. */
    private static final String UPDATE_DCA_USER_METHOD = "updateDcaUserLocal";
    
    /** The Constant INSERT_USER_COURT_METHOD. */
    private static final String INSERT_USER_COURT_METHOD = "insertUserCourtLocal";
    
    /** The Constant INSERT_USER_ROLE_METHOD. */
    private static final String INSERT_USER_ROLE_METHOD = "insertUserRoleLocal";
    
    /** The Constant GET_USER_ADMIN_METHOD. */
    private static final String GET_USER_ADMIN_METHOD = "getUserAdminLocal";
    
    /** The Constant DELETE_USER_ROLE_METHOD. */
    private static final String DELETE_USER_ROLE_METHOD = "deleteUserRoleLocal";

    /** The audit log. */
    private final Log auditLog = SUPSLogFactory.getAuditLogger (UpdateProfileCustomProcessor.class);
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (UpdateProfileCustomProcessor.class);

    /**
     * Constructor.
     */
    public UpdateProfileCustomProcessor ()
    {
        proxy = new SupsLocalServiceProxy ();
    }

    /**
     * (non-Javadoc).
     *
     * @param document the document
     * @param writer the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document document, final Writer writer, final Log pLog)
        throws BusinessException, SystemException
    {
        try
        {
            final String MAINTAIN_USER_PARAM = "/params/param[@name='maintainUser']";
            final XPath myUserParam = XPath.newInstance (MAINTAIN_USER_PARAM);
            final Element myElement = (Element) myUserParam.selectSingleNode (document);

            final Element maintainUserElement = myElement.getChild ("ds").getChild ("MaintainUser");
            final String activeUser = maintainUserElement.getChildText ("ActiveUser");

            // Output the xml
            final Element dsElement = myElement.getChild ("ds");
            final XMLOutputter myOutputter = new XMLOutputter ();

            // Extract the UserId's for use by the Audit Event logging.
            final String dataUserId =
                    XMLBuilder.getXPathValue (dsElement, MAINTAIN_USER_PARAM + "/ds/MaintainUser/UserId");
            final String loggedInUserId = (String) this.m_context.getSystemItem (IComponentContext.USER_ID_KEY);

            final StringBuffer roleChangedMsg = new StringBuffer ("");
            final String currentRoleId = maintainUserElement.getChildText ("Role");
            final String originalRoleId = maintainUserElement.getChildText ("OrigRole");

            if ( !currentRoleId.equals (originalRoleId))
            {
                roleChangedMsg.append (" Role changed from ");
                roleChangedMsg.append (originalRoleId);
                roleChangedMsg.append (" to ");
                roleChangedMsg.append (currentRoleId);
                roleChangedMsg.append (".");
            }

            // Test to see if the user profile is active
            if ("Y".equalsIgnoreCase (activeUser))
            {
                // Save changes made to the active profile
                updateUser (myOutputter.outputString (document));

                // Log an Audit Event to record the profile update.
                final SUPSLogEvent auditEvent = new SUPSLogEvent (/* String sourceService */"caseman",
                        /* String sourceDetails */"Save User Profile", /* String auditType */"USER PROFILE",
                        /* String userId */loggedInUserId, /* String eventStatus */"Success",
                        /* String statusDetails */"Active User Profile for user " + dataUserId +
                                " has been successful updated." + roleChangedMsg.toString ());
                auditLog.info (auditEvent);
            }
            else
            {
                // We are dealing with a reactivated profile

                // Reactivate the user in the document
                final Element activeUserElement =
                        myElement.getChild ("ds").getChild ("MaintainUser").getChild ("ActiveUser");
                activeUserElement.setText ("Y");
                // Set the from date to today's date
                final Element dateFromElement =
                        myElement.getChild ("ds").getChild ("MaintainUser").getChild ("DateFrom");

                final SimpleDateFormat sdf = new SimpleDateFormat ("yyyy-MM-dd");
                final String todayStr = sdf.format (new Date ());

                dateFromElement.setText (todayStr);
                // Set the home flag
                final Element homeFlagElement =
                        myElement.getChild ("ds").getChild ("MaintainUser").getChild ("HomeFlag");
                homeFlagElement.setText ("Y");
                // Set the court code to be the same as administrator's court code
                final Element courtCodeElement =
                        myElement.getChild ("ds").getChild ("MaintainUser").getChild ("CourtCode");
                courtCodeElement.setText (getCourtIdFromDocument (document));

                // add roleToAdd element required by the insert_user_role service method
                addRoleToInsert (document, currentRoleId);

                reactivateUser (myOutputter.outputString (document));

                // Log an Audit Event to record the reactivation.
                final SUPSLogEvent auditEvent = new SUPSLogEvent (/* String sourceService */"caseman",
                        /* String sourceDetails */"Save User Profile", /* String auditType */"USER PROFILE",
                        /* String userId */loggedInUserId, /* String eventStatus */"Success",
                        /* String statusDetails */"Deactivated User Profile for user " + dataUserId +
                                " has been successful activated and updated." + roleChangedMsg.toString ());
                auditLog.info (auditEvent);
            }

            // adding Admin role when assigned to this user
            // part of RFC 521 Logica
            final String adminRole =
                    XMLBuilder.getXPathValue (dsElement, MAINTAIN_USER_PARAM + "/ds/MaintainUser/AdminRole");
            final String courtId = getCourtIdFromDocument (document);
            final Element paramElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramElement, "userId", dataUserId);
            XMLBuilder.addParam (paramElement, "courtId", courtId);

            final Document userAdminResultDoc = getUserAdminRole (myOutputter.outputString (paramElement));

            // System admin check box true on the maintain user screen
            if ("Y".equalsIgnoreCase (adminRole))
            {
                // insert admin role if it doesn't exist
                if (userAdminResultDoc == null)
                {
                    addRoleToInsert (document, "admin");
                    insertUserRole (myOutputter.outputString (document));
                    // Log an Audit Event to record the admin role was added to this user
                    final SUPSLogEvent auditEvent = new SUPSLogEvent (/* String sourceService */"caseman",
                            /* String sourceDetails */"Grant Admin role", /* String auditType */"USER PROFILE",
                            /* String userId */loggedInUserId, /* String eventStatus */"Success",
                            /* String statusDetails */"User Profile for user " + dataUserId +
                                    " has been granted admin role");
                    auditLog.info (auditEvent);

                }

            }
            else
            { // system admin check box unchecked on maintain user screen
              // delete admin role
                if (userAdminResultDoc != null)
                {
                    XMLBuilder.addParam (paramElement, "userIdToDelete", dataUserId);
                    XMLBuilder.addParam (paramElement, "roleId", "admin");
                    XMLBuilder.addParam (paramElement, "courtCode", courtId);

                    deleteUserRole (myOutputter.outputString (paramElement));

                    // Log an Audit Event to record the admin role was removed to this user
                    final SUPSLogEvent auditEvent = new SUPSLogEvent (/* String sourceService */"caseman",
                            /* String sourceDetails */"Delete Admin role", /* String auditType */"USER PROFILE",
                            /* String userId */loggedInUserId, /* String eventStatus */"Success",
                            /* String statusDetails */"User Profile for user " + dataUserId +
                                    " has been deleted from admin role");
                    auditLog.info (auditEvent);
                }

            }

            // Write the return document for the client
            writer.write (myOutputter.outputString (document));
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * This method gets the administrator's court id out of the xml document.
     * It is passed as one of the common parameters. When reactivating a profile
     * we set the profile's court to be the same as the administrator who is reactivating the profile
     *
     * @param document the document
     * @return The court id.
     * @throws JDOMException the JDOM exception
     */
    private String getCourtIdFromDocument (final Document document) throws JDOMException
    {
        final String COURT_ID_PARAM = "/params/param[@name='courtId']";
        final XPath myCourtIdXPath = XPath.newInstance (COURT_ID_PARAM);
        final Element courtIdElement = (Element) myCourtIdXPath.selectSingleNode (document);
        final String courtId = courtIdElement.getText ();
        if (log.isDebugEnabled ())
        {
            log.debug ("PROFILE>>> The reactivated profile will belong to court " + courtId);
        }
        return courtId;
    }

    /**
     * Saves changes to an active profile.
     *
     * @param paramString the param string
     * @return The updated user document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document updateUser (final String paramString) throws BusinessException, SystemException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("PROFILE>>> The profile is active now saving changes...");
        }
        return proxy.getJDOM (USER_SERVICE, UPDATE_USER_METHOD, paramString);
    }

    /**
     * Reactivates a deactivated profile.
     *
     * @param paramString the param string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void reactivateUser (final String paramString) throws BusinessException, SystemException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("PROFILE>>> The inactive profile is now being reactivated...");
        }
        insertUserCourt (paramString);
        insertUserRole (paramString);
        updateDcaUser (paramString);
    }

    /**
     * Inserts a record into the USER_COURT table. This is done as part of the reactivation of a profile
     *
     * @param paramString the param string
     * @return The updated user court document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document insertUserCourt (final String paramString) throws BusinessException, SystemException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("PROFILE>>> Inserting a record in the USER_COURT table...");
        }
        return proxy.getJDOM (USER_SERVICE, INSERT_USER_COURT_METHOD, paramString);
    }

    /**
     * Inserts a record into the USER_ROLE table. This is done as part of the reactivation of a profile
     *
     * @param paramString the param string
     * @return The updated user role document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document insertUserRole (final String paramString) throws BusinessException, SystemException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("PROFILE>>> Inserting a record in the USER_ROLE table..." + paramString);
        }
        return proxy.getJDOM (USER_SERVICE, INSERT_USER_ROLE_METHOD, paramString);
    }

    /**
     * Updates the existing DCA_USER record that is still in the database after a profile has been deactivated.
     * This is done as part of the reactivation of a profile
     *
     * @param paramString the param string
     * @return The updated dca user document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document updateDcaUser (final String paramString) throws BusinessException, SystemException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("PROFILE>>> Updating the DCA_USER table...");
        }
        return proxy.getJDOM (USER_SERVICE, UPDATE_DCA_USER_METHOD, paramString);
    }

    /**
     * Returns whether the user is an admin.
     *
     * @param paramString the param string
     * @return The users details.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document getUserAdminRole (final String paramString) throws BusinessException, SystemException
    {
        return proxy.getJDOM (USER_SERVICE, GET_USER_ADMIN_METHOD, paramString);
    }

    /**
     * Adds the role name as a param in the params list.
     *
     * @param document the document
     * @param role the role
     * @throws JDOMException the JDOM exception
     */
    private void addRoleToInsert (final Document document, final String role) throws JDOMException
    {
        // getting the params element and adding the "roleToAdd" element
        final Element paramsElement = (Element) XPath.selectSingleNode (document, "/params");

        XMLBuilder.removeParam (paramsElement, "roleToInsert");
        XMLBuilder.addParam (paramsElement, "roleToInsert", role);

    }

    /**
     * Deletes the user-role row from the USER_ROLE table.
     *
     * @param paramString format as seen in delete_user_role.xml file
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document deleteUserRole (final String paramString) throws BusinessException, SystemException
    {
        return proxy.getJDOM (USER_SERVICE, DELETE_USER_ROLE_METHOD, paramString);
    }
}
