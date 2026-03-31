/* Copyrights and Licenses
 * 
 * Copyright (c) 2016 by the Ministry of Justice. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, this list of conditions
 * and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * - All advertising materials mentioning features or use of this software must display the
 * following acknowledgment: "This product includes CaseMan (County Court management system)."
 * - Products derived from this software may not be called "CaseMan" nor may
 * "CaseMan" appear in their names without prior written permission of the
 * Ministry of Justice.
 * - Redistributions of any form whatsoever must retain the following acknowledgment: "This
 * product includes CaseMan."
 * This software is provided "as is" and any expressed or implied warranties, including, but
 * not limited to, the implied warranties of merchantability and fitness for a particular purpose are
 * disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
 * direct, indirect, incidental, special, exemplary, or consequential damages (including, but
 * not limited to, procurement of substitute goods or services; loss of use, data, or profits;
 * or business interruption). However caused any on any theory of liability, whether in contract,
 * strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
 * software, even if advised of the possibility of such damage.
 * 
 * TODO Id: $
 * TODO LastChangedRevision: $
 * TODO LastChangedDate: $
 * TODO LastChangedBy: $ 
 */
package uk.gov.dca.caseman.user_service.java;

import java.io.IOException;
import java.io.Writer;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 16-Aug-2005.
 *
 * @author fzzjsd
 * 
 *         This custom processor performs the following functionality:
 *         Checks to see if the user already exists in the database. The user is identified by the 'getUserId' param.
 *         The administrator
 *         is identified by the common parameter of 'userId' (although not used in the code) and the administrator's
 *         home court is
 *         identified by the 'courtId' param (used in the code).
 *         If the user doesn't already exist in the database the status is set to 'New'. If the user does exist in the
 *         database then its
 *         status is either 'Active' or 'Inactive' depending on the value in its DCA_USER.ACTIVE_USER_FLAG column.
 *         The user's details are retrieved from Active Directory and a check is made to verify that the administrator's
 *         home court
 *         matches the user's home court.
 *         The status information is added to the information returned from AD and it's all sent back to the client.
 */
public class ValidateUserCustomProcessor implements ICustomProcessor
{

    /** The Constant COURTID_PARAM. */
    private static final String COURTID_PARAM = "/params/param[@name='courtId']";
    
    /** The Constant PARAM. */
    private static final String PARAM = "param";
    
    /** The Constant PARAM_NAME. */
    private static final String PARAM_NAME = "name";
    
    /** The Constant COURT. */
    private static final String COURT = "Court";
    
    /** The Constant USER. */
    private static final String USER = "User";
    
    /** The Constant DEEDPACK. */
    private static final String DEEDPACK = "DeedPak";
    
    /** The Constant HOME_COURT. */
    private static final String HOME_COURT = "HomeCourt";
    
    /** The Constant HOME_COURT_MSG. */
    private static final String HOME_COURT_MSG = "You cannot maintain a user in a different home court";
    
    /** The Constant USER_NOT_FOUND. */
    private static final String USER_NOT_FOUND = "User does not exist in Active Directory";
    
    /** The Constant USER_HOME_COURT_NOT_SET_MSG. */
    private static final String USER_HOME_COURT_NOT_SET_MSG =
            "The user's home court has not been set - please check the database";

    /** The Constant USER_STATUS. */
    // private static final String INVALID_DEEDPACK_NUMBER = "Cannot obtain the home court for the user from LINK";
    private static final String USER_STATUS = "Status";
    
    /** The Constant ACTIVE_FLAG. */
    private static final String ACTIVE_FLAG = "Active";
    
    /** The Constant NEW_USER. */
    private static final String NEW_USER = "New";
    
    /** The Constant INACTIVE_USER. */
    private static final String INACTIVE_USER = "Inactive";
    
    /** The Constant ACTIVE_USER. */
    private static final String ACTIVE_USER = "Active";

    /** The Constant USER_SERVICE. */
    private static final String USER_SERVICE = "ejb/UserServiceLocal";
    
    /** The Constant COURT_SERVICE. */
    private static final String COURT_SERVICE = "ejb/CourtServiceLocal";
    
    /** The Constant SECURITY_SERVICE. */
    private static final String SECURITY_SERVICE = "ejb/SecurityServiceLocal";
    
    /** The Constant GET_USER_STATUS_METHOD. */
    private static final String GET_USER_STATUS_METHOD = "getUserStatusLocal";
    
    /** The Constant GET_COURT_FOR_DEEDPACK_METHOD. */
    private static final String GET_COURT_FOR_DEEDPACK_METHOD = "getCourtForDeedPackLocal";
    
    /** The Constant GET_AD_USER_METHOD. */
    private static final String GET_AD_USER_METHOD = "getADUserDetailsLocal";

    /** The mgr court path. */
    private XPath mgrCourtPath = null;
    
    /** The proxy. */
    private final AbstractSupsServiceProxy proxy;
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (ValidateUserCustomProcessor.class);

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public ValidateUserCustomProcessor () throws JDOMException
    {
        mgrCourtPath = XPath.newInstance (COURTID_PARAM);
        proxy = new SupsLocalServiceProxy ();
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }

    /**
     * (non-Javadoc).
     *
     * @param inputParameters the input parameters
     * @param output the output
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document inputParameters, final Writer output, final Log pLog)
        throws BusinessException, SystemException
    {
        try
        {
            log.debug (this.getClass () + " process Started");

            String userHomeCourt = null;

            // get the manager's court from the courtId parameter
            final String managerHomeCourt = mgrCourtPath.valueOf (inputParameters.getRootElement ()).trim ();

            // retrieve the user's profile from the database
            final XMLOutputter out = new XMLOutputter (Format.getCompactFormat ());
            final String paramString = out.outputString (inputParameters.getRootElement ());

            // Get back whether or not the user is active and the user's home court
            final Document statusDoc = getUserStatus (paramString);

            // check that the user exists and set status accordingly
            final Element status = new Element (USER_STATUS);
            final Element statusRoot = statusDoc.getRootElement ();
            final Element userEl = statusRoot.getChild (USER);

            if (userEl == null)
            {
                // user does not exist on the database
                status.setText (NEW_USER);
            }
            else
            {
                // see whether the user is active
                final Element activeElement = userEl.getChild (ACTIVE_FLAG);
                if (activeElement.getText ().equalsIgnoreCase ("N"))
                {
                    status.setText (INACTIVE_USER);
                }
                else
                {
                    // user is active; set home court of user
                    status.setText (ACTIVE_USER);

                    userHomeCourt = userEl.getChild (HOME_COURT).getText ();

                    if (userHomeCourt == null || userHomeCourt.equals (""))
                    {
                        throw new BusinessException (USER_HOME_COURT_NOT_SET_MSG);
                    }

                    // throw an exception if the manager is not in the same home court as the user
                    if ( !managerHomeCourt.equals (userHomeCourt))
                    {
                        log.debug ("Manager home court = " + managerHomeCourt);
                        log.debug ("User home court = " + userHomeCourt);
                        throw new BusinessException (HOME_COURT_MSG);
                    }
                }
            }

            // now get the active directory details of the user
            final Document adUserDoc = getADUserDetails (paramString);
            final Element adUserRoot = adUserDoc.getRootElement ();
            adUserRoot.addContent (status);

            // if user is inactive or new, need to use the home court from the Ad User details
            // to check that the manager's home court matches
            if (userHomeCourt == null)
            {
                final String deedpackNumber = adUserRoot.getChildText (DEEDPACK);
                validateCourt (inputParameters, managerHomeCourt, deedpackNumber);
            }

            // Output the xml
            final XMLOutputter outputter = new XMLOutputter ();
            outputter.output (adUserRoot, output);

            log.debug (this.getClass () + " process() is finished");
        }
        catch (final SystemException se)
        {
            // Defect #273 - throw business exception if user not in AD
            if (se.getMessage ().equals (USER_NOT_FOUND))
            {
                throw new BusinessException (USER_NOT_FOUND);
            }
            throw se;
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final IOException ex)
        {
            throw new SystemException (ex);
        }
    }

    /**
     * (non-Javadoc)
     * Call service to get user AD details.
     *
     * @param paramString the param string
     * @return the AD user details
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document getADUserDetails (final String paramString) throws BusinessException, SystemException
    {
        return proxy.getJDOM (SECURITY_SERVICE, GET_AD_USER_METHOD, paramString);
    }

    /**
     * (non-Javadoc)
     * Call service to get user status.
     *
     * @param paramString the param string
     * @return the user status
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Document getUserStatus (final String paramString) throws SystemException, BusinessException
    {
        return proxy.getJDOM (USER_SERVICE, GET_USER_STATUS_METHOD, paramString);
    }

    /**
     * (non-Javadoc)
     * Validate court / deed pack.
     *
     * @param inputParameters the input parameters
     * @param mgrCourt the mgr court
     * @param deedpack the deedpack
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void validateCourt (final Document inputParameters, final String mgrCourt, final String deedpack)
        throws SystemException, BusinessException
    {
        // Add deedpack number to parameters
        final Element paramRoot = inputParameters.getRootElement ();
        final Element deedpackElement = new Element (PARAM);
        deedpackElement.setAttribute (PARAM_NAME, "deedPack");
        deedpackElement.setText (deedpack);
        paramRoot.addContent (deedpackElement);

        // Call service to get the court code(s) for the deedpack number
        final XMLOutputter out = new XMLOutputter (Format.getCompactFormat ());
        final String paramString = out.outputString (paramRoot);

        final Document courtDoc = proxy.getJDOM (COURT_SERVICE, GET_COURT_FOR_DEEDPACK_METHOD, paramString);

        final String courtsDocString = out.outputString (courtDoc.getRootElement ());

        // get the codes from the document - there should only be one
        final Element courtsRoot = courtDoc.getRootElement ();
        final List<Element> codesList = courtsRoot.getChildren ();
        // For Stubbed AD
        if ( !deedpack.equals ("STUBBED"))
        {
            if (codesList.size () == 0)
            {
                throw new BusinessException ("There is no court associated with the Link deed pack number " + deedpack);
            }
            else if (codesList.size () > 1)
            {
                throw new BusinessException (
                        "There are multiple courts associated with the Link deed pack number " + deedpack);
            }
            else
            {
                // check that the court code for the deedpack number is the same as the manager's home court
                final Element courtElement = (Element) codesList.get (0);
                final Element codeElement = courtElement.getChild ("Code");
                final String userHomeCourt = codeElement.getText ();
                if (userHomeCourt == null || !mgrCourt.equals (userHomeCourt))
                {
                    log.debug ("Manager home court = " + mgrCourt);
                    log.debug ("User home court = " + userHomeCourt);
                    throw new BusinessException (HOME_COURT_MSG);
                }
            }
        }
    }
}