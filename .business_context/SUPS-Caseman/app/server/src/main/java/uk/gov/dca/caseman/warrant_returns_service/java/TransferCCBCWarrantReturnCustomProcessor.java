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

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.AbstractCasemanCustomProcessor;
import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;

/**
 * Class: TransferCCBCWarrantReturnCustomProcessor.java
 * Description: This custom processor is used to transfer a new warrant return on a CCBC
 * warrant back to CCBC for tracking purposes. The warrantID of the
 * original CCBC home warrant is calculated, and the warrant return is added
 * to the home warrant
 * 
 * Created: 23-Aug-2005
 * 
 * @author Tim Connor
 *
 *         Change History:
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         01-Dec-2006 Phil Haferer(EDS): Only Final Returns should be marked for transfer.
 *         Added check to ensure this is the case.
 *         (UCT_CASEMAN 854: SUPS attempting to transfer interim warrant returns to CCBC)
 *         16-Jan-2006 Phil Haferer (EDS) - Modified createNewWarrantReturn() to clear the Local Warrant Number
 *         of Warrant Return being added to the original CCBC Warrant.
 *         The Local Warrant Number is used to differentiate a Home Warrant from a Foreign Warrant.
 *         This Warrant Return needs to identified as belonging to a Home Warrant, otherwise
 *         the required Auto Case Event 620 will not be generated.
 *         (TD TEMPat_CASEMAN 3907: Maintain Case Events - MCOL Update for AoS event 38).
 *         16-Oct-2007 Chris Vincent (EDS): Code should no longer add a copy of the warrant return to the
 *         original warrant if is CCBC warrant. UCT_Group2 Defect 1600.
 *         07-Jan-2007 Chris Hutt : USD85352, TD Caseman 6478 - CCBC Home Warrnant should have a copy of any FINAL
 *         Return
 *         added to the Foreign Warrant if it has same CaseNumber and WarrantNumber. To achieve this
 *         getOriginalWarrantLocal had filter criteria extended which means that createNewWarrantReturn
 *         can now be called.
 *         25-Mar-2008 Chris Vincent: TD CaseMan Defect 6505, change to createNewWarrantReturn() function to set
 *         the IgnoreBMSNonEvent node.
 *         11/12/2013 Chris Vincent (Trac 5025). As part of TCE changes, CONTROL warrants are replacing EXECUTION
 *         warrants so
 *         need to include CONTROL warrants in the logic for transferring warrant returns.
 */
public class TransferCCBCWarrantReturnCustomProcessor extends AbstractCasemanCustomProcessor
{

    /**  XPath to retrieve the warrant details from the input DOM. */
    private final XPath warrantReturnPath;

    /**
     * Default Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public TransferCCBCWarrantReturnCustomProcessor () throws JDOMException
    {
        super ();
        warrantReturnPath = XPath.newInstance ("/ds/WarrantReturns/WarrantEvents/WarrantEvent");
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
            final Element warrantReturnElement = (Element) warrantReturnPath.selectSingleNode (params);

            String toTransfer = warrantReturnElement.getChildText ("ToTransfer");

            if (mIsLegacyCCBCTransferWarrant (warrantReturnElement))
            {
                toTransfer = "1";
            }

            if (toTransfer.equals ("1"))
            {
                // If the client side has marked the Warrant Return for transfer, ensure
                // that it is a Final Return, as these are the only ones requiring transfer.
                if ( !mIsFinalReturn (warrantReturnElement))
                {
                    warrantReturnElement.getChild ("ToTransfer").setText ("0");
                }
            }
            else
            {
                // If To Transfer has been set to '1' by the client, no need to check if To Transfer
                // needs to be set to '2'

                // Retrieve the ID of the warrant that the return is for
                final String warrantID = warrantReturnElement.getChildText ("WarrantID");

                // Retrieve a few details of the original warrant, ie if this is a foreign warrant or
                // reissued warrant, look up the associated home warrant.
                final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
                XMLBuilder.addParam (paramsElement, "warrantID", warrantID);

                final Document originalWarrant = this.invokeLocalServiceProxy ("ejb/WarrantServiceLocal",
                        "getOriginalWarrantLocal", paramsElement.getDocument ());

                // Check if the original warrant is a CCBC warrant
                final Element CCBCWarrantElement =
                        (Element) XPath.selectSingleNode (originalWarrant, "/ds/Warrant/CCBC_WARRANT");
                if (CCBCWarrantElement != null && CCBCWarrantElement.getText ().equals ("Y"))
                {
                    final String originalWarrantID =
                            ((Element) XPath.selectSingleNode (originalWarrant, "/ds/Warrant/WARRANT_ID")).getText ();
                    final String warrantType =
                            ((Element) XPath.selectSingleNode (originalWarrant, "/ds/Warrant/WARRANT_TYPE")).getText ();
                    if ((warrantType.equals ("EXECUTION") || warrantType.equals ("CONTROL")) &&
                            !warrantID.equals (originalWarrantID))
                    {
                        // if a final return then add copy of return on the home warrant
                        if (mIsFinalReturn (warrantReturnElement))
                        {
                            final Element ds = (Element) XPath.selectSingleNode (params, "/ds");
                            createNewWarrantReturn ((Element) ds.clone (), originalWarrantID);
                        }
                        // The warrant return has been transferred, so set the TO_TRANSFER flag to 2 (transferred)
                        warrantReturnElement.getChild ("ToTransfer").setText ("2");
                    }

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
     * Is the current Warrant one which requires Final Returns to sent to Legacy CCBC.
     *
     * @param pWarrantReturnElement the warrant return element
     * @return isLegacyCCBCTransferWarrant
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private boolean mIsLegacyCCBCTransferWarrant (final Element pWarrantReturnElement)
        throws SystemException, BusinessException
    {
        boolean isLegacyCCBCTransferWarrant = false;

        final Document inputDoc = new Document ();
        final Element paramsElement = XMLBuilder.getNewParamsElement (inputDoc);
        XMLBuilder.addParam (paramsElement, "warrantId", pWarrantReturnElement.getChildText ("WarrantID"));

        final Document outputDoc = invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal",
                "getLegacyCcbcTransferWarrantLocal", inputDoc);

        final Element dsElement = outputDoc.getRootElement ();
        final Element warrantElement = dsElement.getChild ("Warrant");
        final String transfer = warrantElement.getChildText ("Transfer");

        if (transfer.equals ("true"))
        {
            isLegacyCCBCTransferWarrant = true;
        }

        return isLegacyCCBCTransferWarrant;
    } // mIsLegacyCCBCTransferWarrant()

    /**
     * Determine whether or not the current Warrant Return is a Final Return.
     *
     * @param pWarrantReturnElement the warrant return element
     * @return isFinalReturn
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private boolean mIsFinalReturn (final Element pWarrantReturnElement) throws SystemException, BusinessException
    {
        boolean isFinalReturn = false;

        final Document inputDoc = new Document ();
        final Element paramsElement = XMLBuilder.getNewParamsElement (inputDoc);
        XMLBuilder.addParam (paramsElement, "returnCodeCourtCode", pWarrantReturnElement.getChildText ("CourtCode"));
        XMLBuilder.addParam (paramsElement, "returnCode", pWarrantReturnElement.getChildText ("Code"));

        final Document outputDoc =
                invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "getReturnTypeLocal", inputDoc);

        final Element dsElement = outputDoc.getRootElement ();
        final Element returnCodesElement = dsElement.getChild ("ReturnCodes");
        final String returnType = returnCodesElement.getChildText ("ReturnType");

        if (returnType.equals ("F"))
        {
            isFinalReturn = true;
        }

        return isFinalReturn;
    } // mIsFinalReturn()

    /**
     * Creates a new warrant return which is an exact copy of the passed in element, except
     * it is added to the warrant with the ID of warrantID.
     *
     * @param root The warrant return element
     * @param warrantID The ID of the warrant to add the return to
     * @throws JDOMException the JDOM exception
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void createNewWarrantReturn (final Element root, final String warrantID)
        throws JDOMException, BusinessException, SystemException
    {
        final Element newWarrantReturn =
                (Element) XPath.selectSingleNode (root, "WarrantReturns/WarrantEvents/WarrantEvent");
        newWarrantReturn.getChild ("WarrantID").setText (warrantID);
        newWarrantReturn.getChild ("WarrantReturnsID").setText ("");
        newWarrantReturn.getChild ("LocalNumber").setText ("");
        // Set the forwarded warrant return to NOT generate a BMS Non Event Task
        newWarrantReturn.getChild ("IgnoreBMSNonEvent").setText ("Y");

        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "NewReturn", root);

        this.invokeLocalServiceProxy ("ejb/WarrantReturnsServiceLocal", "insertWarrantReturnsLocal",
                paramsElement.getDocument ());
    }
}