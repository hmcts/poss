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
package uk.gov.dca.caseman.ae_event_service.java;

import java.io.IOException;
import java.io.Writer;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.ICustomProcessor;

/**
 * Service: AeEvent Method: updateAeEvents Class:
 * updateAeEventsCustomProcessor.java @author Chris Hutt Created:
 * 04-July-2005 Description:
 * 
 * 
 * Change History
 * 
 * v1.0 Chris Hutt 4/07/05
 * 
 * v1.1 Chris Hutt 29/04/06
 * defect UCT 379 - navigation to Oracle reports may be required if an event has status chnaged to NOT SERVED
 * 
 * v1.2 Chris Hutt 03/05/06
 * defect UCT 379 - v1.1 not working in all circumstances (ie where case event not to be updated)
 * 
 * A note on values of status passed from client
 * ---------------------------------------------
 * status = mumber which indicates combination of updates made on client
 * 
 * status action
 * 1 general update
 * 2 event marked in error
 * * 1 + 2
 * 4 status chnaged to NOT SERVED
 * 5 1 + 4
 * 6 2 + 4
 * 7 1 + 2 + 4
 * 
 * 15-May-2006 Phil Haferer (EDS): Refector of exception handling. Defect 2689.
 * 01-Jun-2006 Phil Haferer (EDS): Refector of exception handling - missed exceptions. Defect 2689.
 * 
 * @author Chris Hutt
 */
public class UpdateAeEventsCustomProcessor implements ICustomProcessor
{
    /**
     * Constructor.
     */
    public UpdateAeEventsCustomProcessor ()
    {
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param log the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log log)
        throws BusinessException, SystemException
    {
        AeEventUpdateHelper aeEventUpdateHelper = null;
        String caseNumber = null;
        String courtCode = null;
        Element jdebtorElement = null;
        String partyRoleCode = null;
        String casePartyNumber = null;
        Element aeEventsElement = null;
        Element aeEventNavigationListElement = null;
        XMLOutputter xmlOutputter = null;
        String sXml = null;

        try
        {

            aeEventUpdateHelper = new AeEventUpdateHelper ();

            // Element aeElement = (Element) XPath.selectSingleNode(params, "/params/param/ManageAEEvents");
            final Element aeElement = (Element) XPath.selectSingleNode (params, "/ManageAEEvents");

            // Retrieve 'header' details
            caseNumber = aeElement.getChildText ("CaseNumber");
            courtCode = aeElement.getChildText ("OwningCourtCode");
            jdebtorElement = aeElement.getChild ("JudgmentDebtor");
            partyRoleCode = jdebtorElement.getChildText ("PartyRoleCode");
            casePartyNumber = jdebtorElement.getChildText ("CasePartyNumber");
            aeEventsElement = aeElement.getChild ("AEEvents");

            boolean updateAeEvent;
            boolean updateCaseEvent;
            boolean insertCaseEvent;
            boolean checkForObligationNavigation;
            boolean checkForReportNavigation;

            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());

            // Loop through each Ae event
            final List<Element> aeEventList = aeEventsElement.getChildren ("AEEvent");
            Element aeEventElement = null;
            int status;

            final Iterator<Element> it = aeEventList.iterator ();
            while (it.hasNext ())
            {

                // Now we have the Ae Event.
                aeEventElement = (Element) it.next ();

                // reset status flags
                updateAeEvent = false;
                updateCaseEvent = false;
                insertCaseEvent = false;
                checkForObligationNavigation = false;
                checkForReportNavigation = false;

                // Extract the status to work out required updates
                status = Integer.parseInt (aeEventElement.getChildText ("Status"));
                switch (status)
                {
                    case 1:
                        updateAeEvent = true;
                        break;
                    case 2:
                        updateAeEvent = true;
                        updateCaseEvent = true;
                        checkForObligationNavigation = true;
                        break;
                    case 3:
                        updateAeEvent = true;
                        updateCaseEvent = true;
                        checkForObligationNavigation = true;
                        break;
                    case 4:
                        updateAeEvent = true;
                        insertCaseEvent = true;
                        checkForReportNavigation = true;
                        break;
                    case 5:
                        updateAeEvent = true;
                        insertCaseEvent = true;
                        break;
                    case 6:
                        updateAeEvent = true;
                        insertCaseEvent = true;
                        checkForObligationNavigation = true;
                        checkForReportNavigation = true;
                        break;
                    case 7:
                        updateAeEvent = true;
                        updateCaseEvent = true;
                        insertCaseEvent = true;
                        checkForObligationNavigation = true;
                        checkForReportNavigation = true;
                }

                // Now perform appropriate updates

                if (insertCaseEvent)
                {

                    // This will be required when the Service Status has been updated
                    aeEventUpdateHelper.InsertCaseEventOnAeEventUpdate (aeEventElement, caseNumber, courtCode,
                            partyRoleCode, casePartyNumber);
                }

                if (updateAeEvent)
                {
                    aeEventUpdateHelper.UpdateAeEvent (aeEventElement);
                }

                if (updateCaseEvent)
                {

                    // This will be required when the corresponding AE event has been marked in error
                    aeEventUpdateHelper.UpdateCaseEvent (aeEventElement);

                    /********** DELETE REPORT MAP ROWS HERE *************/
                    aeEventUpdateHelper.mDeleteReportMapRows (aeEventElement);

                    // Navigation to obligations/oracle reports is associated with some events being marked in
                    // error/updated
                    if (checkForObligationNavigation || checkForReportNavigation)
                    {

                        aeEventNavigationListElement = aeEventUpdateHelper.getUpdateNavigation (aeEventElement);
                        if (aeEventNavigationListElement != null)
                        {

                            sXml = xmlOutputter.outputString (aeEventNavigationListElement);

                        }
                    }
                }
                else
                {
                    // oracle reports is associated with some events being updated
                    if (checkForReportNavigation)
                    {

                        aeEventNavigationListElement = aeEventUpdateHelper.getUpdateNavigation (aeEventElement);
                        if (aeEventNavigationListElement != null)
                        {

                            sXml = xmlOutputter.outputString (aeEventNavigationListElement);

                        }
                    }

                }
            }
            /* Framework dictates that something must be returned to the client */
            if (null == sXml)
            {
                sXml = xmlOutputter.outputString (new Element ("ds"));
            }

            /* Output the resulting XML. */
            writer.write (sXml);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
    }
}