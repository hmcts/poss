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
package uk.gov.dca.caseman.system_data_service.java;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy2;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;

/**
 * Class: SequenceNumberHelper.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 04-Nov-2005
 *         Description:
 *         Helper which calls service methods in order to retrieve and update the
 *         next number from a sequence.
 * 
 *         Change History:
 *         07-Apr-2006 Phil Haferer: Introduced the method getCurrentValue(), and re-modelled getNextValue().
 *         19-Jun-2006 Phil Haferer: Modified mGetNextValue() to optionally commit the change to the sequence number.
 *         Provided 2 public interface methods to access this getNextValueCommitted() and getNextValueUncomitted().
 *         15-Aug-2006 Phil Haferer: Updated method getCurrentValue() to substract 1 from the value retrieved.
 *         (TD CASEMAN 4184: Complete payout - incorrect CADU report id).
 */
public class SequenceNumberHelper
{

    /** The Constant SYSTEM_DATA_SERVICE. */
    private static final String SYSTEM_DATA_SERVICE = "ejb/SystemDataServiceLocal";
    
    /** The Constant GET_SEQUENCE_AND_INCREMENT_WITH_COMMIT. */
    private static final String GET_SEQUENCE_AND_INCREMENT_WITH_COMMIT = "getSequenceAndIncrementWithCommitLocal2";
    
    /** The Constant GET_SEQUENCE_AND_INCREMENT_WITHOUT_COMMIT. */
    private static final String GET_SEQUENCE_AND_INCREMENT_WITHOUT_COMMIT =
            "getSequenceAndIncrementWithoutCommitLocal2";
    
    /** The Constant GET_SEQUENCE_NUMBER. */
    private static final String GET_SEQUENCE_NUMBER = "getSequenceNumberLocal2";

    /**
     * Returns current sequence value.
     *
     * @param pAdminCourtCode Admin court code.
     * @param pItem The item.
     * @param pContext The component context.
     * @return The current sequence value.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static String getCurrentValue (final String pAdminCourtCode, final String pItem,
                                          final IComponentContext pContext)
        throws SystemException, BusinessException
    {
        String sSequenceNumber = null;
        int iSequenceNumber = 0;

        sSequenceNumber = mGetNextValue (/* String pAdminCourtCode */pAdminCourtCode, /* String pItem */pItem,
                /* IComponentContext pContext */pContext, /* boolean pIncrement */false, /* boolean pCommit */false);

        /* Note that the SYSTEM_DATA holds the next sequence number to be used.
         * Therefore, the current value is actually this value minus 1. */
        if (sSequenceNumber.equals (""))
        {
            sSequenceNumber = "0";
        }
        else
        {
            iSequenceNumber = Integer.parseInt (sSequenceNumber);
            iSequenceNumber -= 1;
            sSequenceNumber = Integer.toString (iSequenceNumber);
        }

        return sSequenceNumber;
    } // getCurrentValue()

    /**
     * Returns the next committed sequence value.
     *
     * @param pAdminCourtCode The admin court code.
     * @param pItem The item.
     * @param pContext The component context.
     * @return The next value committed.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static String getNextValueCommitted (final String pAdminCourtCode, final String pItem,
                                                final IComponentContext pContext)
        throws SystemException, BusinessException
    {
        String sSequenceNumber = null;

        sSequenceNumber = mGetNextValue (/* String pAdminCourtCode */pAdminCourtCode, /* String pItem */pItem,
                /* IComponentContext pContext */pContext, /* boolean pIncrement */true, /* boolean pCommit */true);

        return sSequenceNumber;
    } // getNextValueCommitted()

    /**
     * Returns the next uncommitted sequence value.
     *
     * @param pAdminCourtCode The admin court code.
     * @param pItem The item.
     * @param pContext The component context.
     * @return The next value uncommitted.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    public static String getNextValueUncommitted (final String pAdminCourtCode, final String pItem,
                                                  final IComponentContext pContext)
        throws SystemException, BusinessException
    {
        String sSequenceNumber = null;

        sSequenceNumber = mGetNextValue (/* String pAdminCourtCode */pAdminCourtCode, /* String pItem */pItem,
                /* IComponentContext pContext */pContext, /* boolean pIncrement */true, /* boolean pCommit */false);

        return sSequenceNumber;
    } // getNextValueUncommitted()

    /**
     * (non-Javadoc)
     * Return the next sequence number.
     *
     * @param pAdminCourtCode the admin court code
     * @param pItem the item
     * @param pContext the context
     * @param pIncrement the increment
     * @param pCommit the commit
     * @return The next sequence number.
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private static String mGetNextValue (final String pAdminCourtCode, final String pItem,
                                         final IComponentContext pContext, final boolean pIncrement,
                                         final boolean pCommit)
        throws SystemException, BusinessException
    {
        Document inputDoc = null;
        Document outputDoc = null;
        Element paramsElement = null;
        ComponentInput inputHolder = null;
        ComponentInput outputHolder = null;
        SupsLocalServiceProxy2 localServiceProxy = null;
        Element dsElement = null;
        Element systemDataElement = null;
        String sSequenceNumber = null;

        // Create the 'input' to be used used by retrieve and update service methods.
        inputDoc = new Document ();
        paramsElement = XMLBuilder.getNewParamsElement ();
        inputDoc.setRootElement (paramsElement);
        XMLBuilder.addParam (paramsElement, "adminCourtCode", pAdminCourtCode);
        XMLBuilder.addParam (paramsElement, "item", pItem);
        inputHolder = new ComponentInput (pContext.getInputConverterFactory ());
        inputHolder.setData (inputDoc, Document.class);

        // Create the other object used by the service methods.
        outputHolder = new ComponentInput (pContext.getInputConverterFactory ());
        localServiceProxy = new SupsLocalServiceProxy2 ();

        // Call the Sequence Number retrieval service.
        if (pIncrement)
        {
            if (pCommit)
            {
                localServiceProxy.invoke (SYSTEM_DATA_SERVICE, GET_SEQUENCE_AND_INCREMENT_WITH_COMMIT, pContext,
                        inputHolder, outputHolder);
            }
            else
            {
                localServiceProxy.invoke (SYSTEM_DATA_SERVICE, GET_SEQUENCE_AND_INCREMENT_WITHOUT_COMMIT, pContext,
                        inputHolder, outputHolder);
            }
        }
        else
        {
            localServiceProxy.invoke (SYSTEM_DATA_SERVICE, GET_SEQUENCE_NUMBER, pContext, inputHolder, outputHolder);
        }

        // Extract the Sequence number.
        outputDoc = (Document) outputHolder.getData (Document.class);
        dsElement = outputDoc.getRootElement ();
        systemDataElement = dsElement.getChild ("SystemData");
        if (systemDataElement == null)
        {
            throw new SystemException (
                    "The SYSTEM_DATA table is missing a '" + pItem + "' row for Court: " + pAdminCourtCode + " !");
        }
        sSequenceNumber = systemDataElement.getChild ("ItemValue").getValue ();
        if (sSequenceNumber.equals (""))
        {
            sSequenceNumber = "0";
        }

        return sSequenceNumber;
    } // mGetNextValue()

} // class SequenceNumberHelper
