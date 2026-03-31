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
package uk.gov.dca.caseman.common.java;

import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Class: CourtHelper.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 02-Aug-2005
 *         Description:
 *         Common methods relating to Courts.
 * 
 *         Change History:
 */
public class CourtHelper
{

    /** The Constant COURT_SERVICE. */
    private static final String COURT_SERVICE = "ejb/CourtServiceLocal";
    
    /** The Constant GET_COURT. */
    private static final String GET_COURT = "getCourtLocal";
    
    /** The Constant GET_COURT_LONG. */
    private static final String GET_COURT_LONG = "getCourtLongLocal";

    /**
     * Returns the court name.
     *
     * @param pCourtCode The court code.
     * @return The court name.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public static String GetCourtName (final String pCourtCode) throws SystemException, BusinessException, JDOMException
    {
        String courtName = null;
        Element courtsElement = null;

        try
        {
            courtsElement = GetCourt (pCourtCode);
            courtName = XMLBuilder.getXPathValue (courtsElement, "/Courts/Court/Name");
        }
        finally
        {
            courtsElement = null;
        }

        return courtName;
    } // GetCourtName()

    /**
     * Gets the court sups centrilised flag.
     *
     * @param pCourtCode The court code.
     * @return The centrilised flag.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public static String GetCourtSupsCentralisedFlag (final String pCourtCode)
        throws SystemException, BusinessException, JDOMException
    {
        String supsCentralisedFlag = null;
        Element courtsElement = null;

        try
        {
            courtsElement = GetCourtLong (pCourtCode);
            supsCentralisedFlag = XMLBuilder.getXPathValue (courtsElement, "/Courts/Court/SUPSCourt");
        }
        finally
        {
            courtsElement = null;
        }

        return supsCentralisedFlag;
    } // GetCourtSupsCentralisedFlag()

    /**
     * Returns the court id.
     *
     * @param pCourtCode The court code.
     * @return The court id.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @throws JDOMException the JDOM exception
     */
    public static String GetCourtId (final String pCourtCode) throws SystemException, BusinessException, JDOMException
    {
        String courtId = null;
        Element courtsElement = null;

        try
        {
            courtsElement = GetCourtLong (pCourtCode);
            courtId = XMLBuilder.getXPathValue (courtsElement, "/Courts/Court/ID");
        }
        finally
        {
            courtsElement = null;
        }

        return courtId;
    } // GetCourtId()

    /**
     * Returns the court element.
     *
     * @param pCourtCode The court code.
     * @return The court element.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static Element GetCourt (final String pCourtCode) throws SystemException, BusinessException
    {
        return mCallCourtService (GET_COURT, pCourtCode);
    } // GetCourt()

    /**
     * Returns the court long local.
     *
     * @param pCourtCode The court code.
     * @return The court long.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static Element GetCourtLong (final String pCourtCode) throws SystemException, BusinessException
    {
        return mCallCourtService (GET_COURT_LONG, pCourtCode);
    } // GetCourtLong()

    /**
     * (non-Javadoc)
     * Call a specified method in the court service.
     *
     * @param pServiceMethod the service method
     * @param pCourtCode the court code
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private static Element mCallCourtService (final String pServiceMethod, final String pCourtCode)
        throws SystemException, BusinessException
    {
        Element courtsElement = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        AbstractSupsServiceProxy localServiceProxy = null;

        try
        {
            paramsElement = XMLBuilder.getNewParamsElement ();
            XMLBuilder.addParam (paramsElement, "courtId", pCourtCode);

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy = new SupsLocalServiceProxy ();
            courtsElement = localServiceProxy.getJDOM (COURT_SERVICE, pServiceMethod, sXmlParams).getRootElement ();
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
        }

        return courtsElement;
    } // GetCourt()

} // class CourtHelper
