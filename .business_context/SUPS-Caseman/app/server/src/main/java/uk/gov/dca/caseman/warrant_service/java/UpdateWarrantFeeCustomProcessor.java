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
package uk.gov.dca.caseman.warrant_service.java;

import java.io.IOException;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.warrant_amounts_service.java.WarrantAmountsXMLBuilder;
import uk.gov.dca.db.ejb.AbstractSupsServiceProxy;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;

/**
 * Class: UpdateWarrantFeeCustomProcessor.java
 * Description: Checks the existence of a fee in the FEES_PAID table using the warrant's
 * issue date. This is the initial fee and if it exists, set the fee amount
 * to the same and update the record, otherwise delete this record
 * Service: Warrant
 * Method: updateWarrant
 * 
 * Created: 07-July-2005
 * 
 * @author Tun Shwe
 *
 *         Change History:
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         19-Mar-2007 Chris Vincent (EDS): Prevented creation of FEES_PAID record for reissued warranrts. Defect 5993.
 *         28-Sep-2009 Chris Vincent (Logica): Wrapped warrant fee processing round an if statement so is only performed
 *         if the warrant fee is updated on the Maintain/Query Warrants screen. TRAC 1676.
 *         04-May-2011 Chris Vincent: change to allow fees_paid records with a value of 0 to be updated. Trac 3077.
 */
public class UpdateWarrantFeeCustomProcessor extends AbstractCustomProcessor
{
    
    /** The local service proxy. */
    private AbstractSupsServiceProxy localServiceProxy;
    
    /** The todays date. */
    final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());

    /**
     * Constructor.
     */
    public UpdateWarrantFeeCustomProcessor ()
    {
        localServiceProxy = new SupsLocalServiceProxy ();
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
        XMLOutputter xmlOutputter = null;
        String sXml = null;

        try
        {
            final Element warrantElement =
                    (Element) XPath.selectSingleNode (params, "/params/param[@name='warrantDetails']/ds/Warrant");

            // TRAC 1676 - Only perform processing if warrant fee has been updated
            final String warrantFeeUpdated = warrantElement.getChildText ("WarrantFeeUpdated");
            if (warrantFeeUpdated != null && warrantFeeUpdated.equals ("Y"))
            {
                final String warrantNumber = warrantElement.getChildText ("WarrantNumber");
                String initialFee = warrantElement.getChildText ("Fee");
                final String initialFeeCurrency = warrantElement.getChildText ("FeeCurrency");
                final String processType = "W";
                final String issuedBy = warrantElement.getChildText ("IssuedBy");
                final String issueDate = warrantElement.getChildText ("IssueDate");
                final String userName = (String) m_context.getSystemItem (IComponentContext.USER_ID_KEY);

                final Document targetFees = getFees (warrantNumber, processType, issuedBy);

                // Flag for whether initial fee exists in FEES_PAID table
                boolean initialFeeExistsInFeesPaid = false;

                final Element feesElement = (Element) XPath.selectSingleNode (targetFees, "/ds/WarrantAmounts");
                final List<Object> l = feesElement.getContent ();
                final Iterator<Object> iter = l.iterator ();
                while (iter.hasNext ())
                {
                    final Object i = iter.next ();
                    if (i instanceof Element)
                    { // i.e. check for <Warrant> Element not spacer Text
                        final String allocationDate = ((Element) i).getChildText ("AllocationDate");
                        if (allocationDate.equals (issueDate))
                        {
                            initialFeeExistsInFeesPaid = true;
                            // If there is no initial fee, delete this record from FEES_PAID
                            // Else update FEES_PAID with the updated initial fee amount

                            final boolean feeRemoved = WarrantUtils.isEmpty (initialFee);
                            if (feeRemoved)
                            {
                                // User has cleared the Fee on the screen, set fee on FEES_PAID table to 0
                                initialFee = "0";
                            }
                            final float amount = Float.parseFloat (((Element) i).getChildText ("Amount"));

                            if (feeRemoved || amount >= 0 && amount != Float.parseFloat (initialFee))
                            {
                                final WarrantAmountsXMLBuilder updateFee = new WarrantAmountsXMLBuilder (warrantNumber,
                                        initialFee, initialFeeCurrency, issuedBy);

                                final String scn = ((Element) i).getChildText ("SCN");
                                updateFee.setSCN (scn);
                                final String feesPaidId = ((Element) i).getChildText ("FeesPaidId");
                                updateFee.setFeesPaidID (feesPaidId);
                                updateFee.setAllocationDate (issueDate);
                                updateFee.setUserID (userName);
                                updateFee.setDateCreated (todaysDate);

                                /**
                                 * Remove logical deletion for Trac 3077.
                                 * if (feeRemoved)
                                 * {
                                 * // If the fee has been removed, set the deleted flag to 'Y'
                                 * updateFee.setDeletedFlag("Y");
                                 * }
                                 */

                                final Element warrantAmountsElement = updateFee.getXMLElement ();

                                // Wrap the XML in the 'params/param' structure
                                final Element paramsElement = XMLBuilder.getNewParamsElement ();
                                XMLBuilder.addParam (paramsElement, "WarrantAmounts", warrantAmountsElement);

                                // Translate to string
                                xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
                                final String sXmlParams = xmlOutputter.outputString (paramsElement);

                                // Call the service
                                localServiceProxy.getJDOM ("ejb/WarrantAmountsServiceLocal", "updateAmountDetailsLocal",
                                        sXmlParams);
                            }
                        }
                    }
                }
                // If an initial fee has been entered and this fee doesn't yet exist in FEES_PAID, need to insert
                // it unless it is a Reissued Warrant (has '/' in warrant number) which don't have FEES_PAID records.
                if ( !WarrantUtils.isEmpty (initialFee) && !initialFeeExistsInFeesPaid &&
                        warrantNumber.indexOf ("/") == -1)
                {
                    final float amount = Float.parseFloat (initialFee);

                    final WarrantAmountsXMLBuilder updateFee =
                            new WarrantAmountsXMLBuilder (warrantNumber, initialFee, initialFeeCurrency, issuedBy);
                    updateFee.setUserID (userName);
                    updateFee.setDateCreated (todaysDate);
                    final Element warrantAmountsElement = updateFee.getXMLElement ();

                    // Wrap the XML in the 'params/param' structure
                    final Element paramsElement = XMLBuilder.getNewParamsElement ();
                    XMLBuilder.addParam (paramsElement, "WarrantAmounts", warrantAmountsElement);

                    // Translate to string
                    xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
                    final String sXmlParams = xmlOutputter.outputString (paramsElement);

                    // Call the service
                    localServiceProxy.getJDOM ("ejb/WarrantAmountsServiceLocal", "updateAmountDetailsLocal",
                            sXmlParams);
                }
            }

            /* Output the original XML. */
            xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
            sXml = xmlOutputter.outputString (params.getRootElement ());
            writer.write (sXml);

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
     * Retrieve the fees.
     *
     * @param warrantNumber The warrant number.
     * @param processType The process type.
     * @param issuedBy Issued by.
     * @return The fees document.
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private Document getFees (final String warrantNumber, final String processType, final String issuedBy)
        throws BusinessException, SystemException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement ();
        XMLBuilder.addParam (paramsElement, "ProcessNumber", warrantNumber);
        XMLBuilder.addParam (paramsElement, "ProcessType", processType);
        XMLBuilder.addParam (paramsElement, "IssuingCourtCode", issuedBy);
        final XMLOutputter xmlOutputter = new XMLOutputter (Format.getCompactFormat ());
        final String sXmlParams = xmlOutputter.outputString (paramsElement);
        return localServiceProxy.getJDOM ("ejb/WarrantAmountsServiceLocal", "getAmountDetailsLocal", sXmlParams);
    }
}