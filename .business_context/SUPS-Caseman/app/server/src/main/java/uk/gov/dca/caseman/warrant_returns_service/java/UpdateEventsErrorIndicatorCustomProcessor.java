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
package uk.gov.dca.caseman.warrant_returns_service.java;

import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.ccbc_service.java.CCBCHelper;
import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Class: UpdateEventsErrorIndicatorCustomProcessor.java
 * Description: Updates the error indicator for case events linked to warrant returns if
 * the warrant returns are marked as an error
 * Service: WarrantReturns
 * Method: updateWarrantReturns
 * 
 * Created: 09-August-2005
 * 
 * @author Tim Connor
 * 
 *         Change History
 *         --------------
 * 
 *         v1.0 09 August 2005 Tim Connor
 * 
 *         v1.1 16 Dec 2005 Chris Hutt
 *         Defect 1941: Did not cope with CO based warrants. These have CO_EVENTS
 *         instead of CASE_EVENTS. Renamed (previously UpdateCaseEventsErrorIndicatorCustomProcessor)
 *         17-May-2006 Dave Wright (EDS):
 *         Refactor of exception handling. Defect 2689.
 * 
 *         16-Oct-2007 Chris Hutt
 *         Defect Prog testing 114 :
 *         Failing to deal with a legacy data bug - this custom processor may be presented
 *         with a number of warrant returns for update , some of which may not have a
 *         caseEventSeq even though they are case related. The solution implemented is to
 *         iterate through the warrant returns, updating one at a time.
 * 
 *         07-jan-08 Chris Hutt
 *         TD Caseman 6479, USD85352:
 *         When a Final Return on a Foreign Warrant is errored off, the equivalent CCBC
 *         Home Warrant Return should also be errored off.
 *         18/10/2013 - Chris Vincent, Trac 4997. Added CCBC MCOL processing for when a final return is errored as
 *         part of CCBC SDT.
 */
public class UpdateEventsErrorIndicatorCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**
     * Constructor.
     */
    public UpdateEventsErrorIndicatorCustomProcessor ()
    {
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param pLog the log
     * @return the document
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     * @see uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor#process(org.jdom.Document,
     *      org.apache.commons.logging.Log)
     */
    public Document process (final Document params, final Log pLog) throws SystemException, BusinessException
    {
        try
        {

            List<Element> warrantEventElementList = null;
            Element nextWarrantEventElement = null;
            Element warrantEventElement = null;
            Element caseEventElement = null;
            Element coEventElement = null;
            Element returnUpdatedElement = null;
            String returnErrored = null;

            warrantEventElementList = XPath.selectNodes (params.getRootElement (), "//WarrantEvent");

            // Iterate through the list of events, erroring off the associated case /co event as appropriate
            for (Iterator<Element> nx = warrantEventElementList.iterator (); nx.hasNext ();)
            {
                nextWarrantEventElement = (Element) nx.next ();
                warrantEventElement = (Element) nextWarrantEventElement.clone ();

                // If the warrant return has been errored off in this transaction, then this flag will be set
                returnUpdatedElement = warrantEventElement.getChild ("ReturnUpdated");
                if (null != returnUpdatedElement && !returnUpdatedElement.getText ().equals (""))
                {
                    returnErrored = returnUpdatedElement.getText ();
                }
                else
                {
                    returnErrored = "N";
                }

                // Need to differentiate between Case and CO based warrant returns.

                caseEventElement = warrantEventElement.getChild ("CaseEventSeq");
                if (null != caseEventElement && !caseEventElement.getText ().equals (""))
                {
                    updateEventMethod ("ejb/WarrantReturnsServiceLocal", "updateErrorIndicatorLocal",
                            warrantEventElement);
                }

                coEventElement = warrantEventElement.getChild ("CoEventSeq");
                if (null != caseEventElement && !coEventElement.getText ().equals (""))
                {
                    // A CO based warrant return.
                    updateEventMethod ("ejb/WarrantReturnsServiceLocal", "updateCoEventsErrorIndicatorLocal",
                            warrantEventElement);
                }

                // This may be a Foreign Warrant associated with a CCBC Home Warrant. Need to call the service
                // That updates the CCBC Home Warrant in such circumstances
                final String errorIndVal = warrantEventElement.getChildText ("Error");
                final String returnId = warrantEventElement.getChildText ("WarrantReturnsID");
                updateCcbcWarrantReturn (returnId, errorIndVal);
                if (null != returnErrored && returnErrored.equals ("Y"))
                {
                    // Only perform the MCOL Updates for the warrant return being errored off.
                    mCCBCMCOLUpdates (warrantEventElement);
                    // Delete any REPORT_MAP rows associated with the warrant return
                    mDeleteReportMapRows (returnId);
                }
            }

        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }

        return params;
    }

    /**
     * (non-Javadoc)
     * Call service method defined in param pService .
     *
     * @param pService the service
     * @param pMethod the method
     * @param pWarrantEventElement the warrant event element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */

    private void updateEventMethod (final String pService, final String pMethod, final Element pWarrantEventElement)
        throws SystemException, BusinessException
    {

        Element paramsElement = null;

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "NewReturn", pWarrantEventElement);
        paramsElement.addContent (((Element) pWarrantEventElement.clone ()).detach ());
        this.invokeLocalServiceProxy (pService, pMethod, paramsElement.getDocument ());

    }

    /**
     * (non-Javadoc)
     * Call service method defined in param pService .
     *
     * @param pForeignWarrantReturnId the foreign warrant return id
     * @param pErrorIndVal the error ind val
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */

    private void updateCcbcWarrantReturn (final String pForeignWarrantReturnId, final String pErrorIndVal)
        throws SystemException, BusinessException
    {

        Element paramsElement = null;

        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "foreignWarrantReturnId", pForeignWarrantReturnId);
        XMLBuilder.addParam (paramsElement, "errorIndValue", pErrorIndVal);
        this.invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "updateCcbcWarrantReturnErrorIndLocal",
                paramsElement.getDocument ());
    }

    /**
     * (non-Javadoc)
     * Create a CCBCHelper and run post update warrant return processing.
     *
     * @param pWarrantEventElement the warrant event element
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mCCBCMCOLUpdates (final Element pWarrantEventElement)
        throws SystemException, JDOMException, BusinessException
    {
        final CCBCHelper ccbcHelper = new CCBCHelper ();
        ccbcHelper.postUpdateWarrantEventProcessing (pWarrantEventElement);
    }

    /**
     * Deletes any REPORT_MAP (bulk printing) rows associated with the Warrant Return.
     *
     * @param pReturnId the return id
     * @throws SystemException the system exception
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     */
    private void mDeleteReportMapRows (final String pReturnId) throws SystemException, JDOMException, BusinessException
    {
        // Build the Parameter XML for passing to the Delete Report Map service.
        Element paramsElement = null;
        paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "returnId", pReturnId);
        this.invokeLocalServiceProxy ("ejb/WpOutputServiceLocal", "deleteReturnReportMapRowLocal",
                paramsElement.getDocument ());
    }
}