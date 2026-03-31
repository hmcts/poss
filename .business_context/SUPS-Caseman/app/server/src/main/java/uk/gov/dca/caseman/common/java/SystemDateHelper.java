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
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Class: SystemDateHelper.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 26-Jul-2005
 *         Description:
 *         Wrapper for calling the System Date Service.
 * 
 *         Change History:
 */
public class SystemDateHelper
{

    /** The Constant SYSTEM_DATE_SERVICE. */
    private static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    
    /** The Constant GET_SYSTEM_DATE. */
    private static final String GET_SYSTEM_DATE = "getSystemDateLocal";

    /**
     * Gets the system date.
     *
     * @return the system date
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static String getSystemDate () throws SystemException, BusinessException
    {
        String systemDateString = null;
        Element paramsElement = null;
        XMLOutputter xmlOutputter = null;
        String sXmlParams = null;
        AbstractSupsServiceProxy localServiceProxy = null;
        Element systemDateElement = null;

        try
        {
            // Create the 'params/param' structure.
            paramsElement = XMLBuilder.getNewParamsElement ();

            // Translate to string.
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXmlParams = xmlOutputter.outputString (paramsElement);

            // Call the service.
            localServiceProxy = new SupsLocalServiceProxy ();
            systemDateElement =
                    localServiceProxy.getJDOM (SYSTEM_DATE_SERVICE, GET_SYSTEM_DATE, sXmlParams).getRootElement ();
            systemDateString = systemDateElement.getText ();
        }
        finally
        {
            paramsElement = null;
            xmlOutputter = null;
            sXmlParams = null;
            localServiceProxy = null;
            systemDateElement = null;
        }

        return systemDateString;
    } // getSystemDate()

} // class SystemDateHelper
