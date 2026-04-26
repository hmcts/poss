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
package uk.gov.dca.caseman.ae_service.java;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Service: AE Method: insertCoEventsAuto Class:
 * InsertAutoCoEventsCustomProcessor.java @author Chris Hutt
 * 
 * Created:
 * 11 Jan 2006
 * 
 * Description:
 * This Wrapper clasee contains logic which decides whether to call the
 * InsertAutoCoEventsCustomProcessor.java class.
 * A pipeline process document will be checked for a //New node.
 * 
 * Change History
 * v0.1 Paul Robinson 11/01/06
 * 15-May-2006 Phil Haferer (EDS): Refector of exception handling. Defect 2689.
 * 25-Jul-2006 Paul Roberts (EDS): Change logging.
 * 15-Nov-2006 Phil Haferer: When an AE already exists in CAPS, and is entered here there
 * is no need to print the documentation normally associated with AE creation.
 * This change therefore inhibits the call to Oracle Reporting when a CAPS Sequence
 * has been entered.
 * (UCT_CASEMAN 668: Creation of Existing AE producing N55).
 * 
 * @author Chris Hutt
 */
public class CreateAeInsertAeEventsCustomProcessor extends AbstractCasemanCustomProcessor
{

    // Services.
    /** The Constant AE_SERVICE. */
    // AE Service
    private static final String AE_SERVICE = "ejb/AeServiceLocal";
    
    /** The Constant UPDATE_CASE. */
    private static final String UPDATE_CASE = "updateCaseAeLocal";
    
    /** The Constant AE_EVENT_SERVICE. */
    // AE Event Service
    private static final String AE_EVENT_SERVICE = "ejb/AeEventServiceLocal";
    
    /** The Constant INSERT_EVENT. */
    private static final String INSERT_EVENT = "insertAeEventsAutoLocal";
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (CreateAeInsertAeEventsCustomProcessor.class);

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param pLog the log
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log pLog) throws BusinessException, SystemException
    {
        Element dsElement = null;
        Element aeParamElement = null;
        String aeParamText = "N";
        final Document params1 = (Document) params.clone ();
        Document navigationDoc = null;

        try
        {

            // update AEs
            // carried out in method file

            if (log.isDebugEnabled ())
            {
                final XMLOutputter outputter = new XMLOutputter (Format.getPrettyFormat ());
                log.debug ("Update AE XML : " + outputter.outputString (params));
            }
            navigationDoc = mUpDateAe (params);

            // check to see if AE is new then call updateAEEvent
            dsElement = params.getRootElement ();
            aeParamElement = (Element) XPath.selectSingleNode (dsElement, "//param[@name='AEEventNew']");
            aeParamText = aeParamElement.getText ();
            if (aeParamText.equals ("Y"))
            {
                navigationDoc = mUpDateAeEvent (params1);

                // If the AE is for an 'Existing Case', no outputs should be generated.
                // These AE's will have a value for the CAPS Sequence.
                // Therefore, cancel any Oracle Reports Call specified in the Navigation document
                // when a CAPS Sequence exists.
                final String capsSequence = XMLBuilder.getXPathValue (params1.getRootElement (),
                        "/params/param[@name = 'AEDetails']/ds/Case/AEApplications/AEApplication/CAPSSequence");
                if ( !capsSequence.equals (""))
                {
                    XMLBuilder.setXPathValue (navigationDoc.getRootElement (),
                            "/AeEventNavigationList/NavigateTo/OracleReport", "false");
                }
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        /* Framework dictates that something must be returned to the client */
        return navigationDoc;
    }

    /**
     * (non-Javadoc)
     * Call service to update AE.
     *
     * @param params the params
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Document mUpDateAe (final Document params) throws SystemException, BusinessException
    {
        Document navigationDoc = null;
        try
        {

            navigationDoc = invokeLocalServiceProxy (AE_SERVICE, UPDATE_CASE, params);

        }
        finally
        {
        }
        return navigationDoc;
    }

    /**
     * (non-Javadoc)
     * Call service to update AE event.
     *
     * @param params the params
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Document mUpDateAeEvent (final Document params) throws SystemException, BusinessException
    {
        Document navigationDoc = null;
        try
        {

            navigationDoc = invokeLocalServiceProxy (AE_EVENT_SERVICE, INSERT_EVENT, params);

        }
        finally
        {

        }
        return navigationDoc;

    }

}