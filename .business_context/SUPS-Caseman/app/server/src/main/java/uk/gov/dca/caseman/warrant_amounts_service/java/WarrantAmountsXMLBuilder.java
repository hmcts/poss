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
package uk.gov.dca.caseman.warrant_amounts_service.java;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.jdom.Element;

/**
 * Class: WarrantAmountsXMLBuilder.java
 * Description: This class is intended to provided assistance in creating the XML element
 * structure that needs to be passed to the updateAmountDetails() service
 * method. The updateAmountDetails() method requires the presence of a
 * number of XML elements (tags), even if they are empty, otherwise it will
 * fall over. The getXMLElement() method will provide an XML Element
 * structure with the set of Element required by the updateAmountDetails()
 * method
 * 
 * Created: 16-May-2005
 * 
 * @author Tim Connor
 */
public class WarrantAmountsXMLBuilder extends Element
{
    
    /** The Constant TAG_DS. */
    private static final String TAG_DS = "ds";

    /** The Constant TAG_WARRANT_AMOUNTS. */
    private static final String TAG_WARRANT_AMOUNTS = "WarrantAmounts";

    /** The Constant TAG_WARRANT. */
    private static final String TAG_WARRANT = "Warrant";

    /** The Constant TAG_SCN. */
    private static final String TAG_SCN = "SCN";

    /** The Constant TAG_FEES_PAID_ID. */
    private static final String TAG_FEES_PAID_ID = "FeesPaidId";

    /** The Constant TAG_PROCESS_NUMBER. */
    private static final String TAG_PROCESS_NUMBER = "ProcessNumber";

    /** The Constant TAG_PROCESS_TYPE. */
    private static final String TAG_PROCESS_TYPE = "ProcessType";

    /** The Constant TAG_DELETED_FLAG. */
    private static final String TAG_DELETED_FLAG = "Deleted";

    /** The Constant TAG_ALLOCATION_DATE. */
    private static final String TAG_ALLOCATION_DATE = "AllocationDate";

    /** The Constant TAG_AMOUNT. */
    private static final String TAG_AMOUNT = "Amount";

    /** The Constant TAG_AMOUNT_CURRENCY. */
    private static final String TAG_AMOUNT_CURRENCY = "AmountCurrency";

    /** The Constant TAG_ISSUING_COURT_CODE. */
    private static final String TAG_ISSUING_COURT_CODE = "IssuingCourtCode";

    /** The Constant TAG_USER_ID. */
    private static final String TAG_USER_ID = "UserId";

    /** The Constant TAG_DATE_CREATED. */
    private static final String TAG_DATE_CREATED = "DateCreated";

    /** The scn. */
    private String scn;

    /** The fees paid ID. */
    private String feesPaidID;

    /** The process number. */
    private String processNumber;

    /** The deleted flag. */
    private String deletedFlag;

    /** The allocation date. */
    private String allocationDate;

    /** The amount. */
    private String amount;

    /** The amount currency. */
    private String amountCurrency;

    /** The issuing court code. */
    private String issuingCourtCode;

    /** The user ID. */
    private String userID;

    /** The date created. */
    private String dateCreated;

    /**
     * Constructor which takes the minimal amount of data required to create an
     * event.
     *
     * @param processNumber The warrant number the fee/refund is being created for
     * @param amount The fee/refund amount
     * @param amountCurrency The fee/refund amount currency
     * @param issuingCourt The issuing court of the warrant
     */
    public WarrantAmountsXMLBuilder (final String processNumber, final String amount, final String amountCurrency,
            final String issuingCourt)
    {
        final String todaysDate = new SimpleDateFormat ("yyyy-MM-dd").format (new Date ());
        setSCN ("");
        setFeesPaidID ("");
        setProcessNumber (processNumber);
        setAllocationDate (todaysDate);
        setAmount (amount);
        setAmountCurrency (amountCurrency);
        setIssuingCourtCode (issuingCourt);
        setDeletedFlag ("N");
        setUserID ("DEFAULT");
        setDateCreated (todaysDate);
    }

    /**
     * Gets the scn.
     *
     * @return the scn
     */
    public String getSCN ()
    {
        return scn;
    }

    /**
     * Sets the scn.
     *
     * @param scn the new scn
     */
    public void setSCN (final String scn)
    {
        this.scn = scn;
    }

    /**
     * Gets the fees paid ID.
     *
     * @return the fees paid ID
     */
    public String getFeesPaidID ()
    {
        return feesPaidID;
    }

    /**
     * Sets the fees paid ID.
     *
     * @param feesPaidID the new fees paid ID
     */
    public void setFeesPaidID (final String feesPaidID)
    {
        this.feesPaidID = feesPaidID;
    }

    /**
     * Gets the process number.
     *
     * @return the process number
     */
    public String getProcessNumber ()
    {
        return processNumber;
    }

    /**
     * Sets the deleted flag.
     *
     * @param deletedFlag the new deleted flag
     */
    public void setDeletedFlag (final String deletedFlag)
    {
        this.deletedFlag = deletedFlag;
    }

    /**
     * Sets the process number.
     *
     * @param warrantNumber the new process number
     */
    public void setProcessNumber (final String warrantNumber)
    {
        this.processNumber = warrantNumber;
    }

    /**
     * Gets the allocation date.
     *
     * @return the allocation date
     */
    public String getAllocationDate ()
    {
        return allocationDate;
    }

    /**
     * Sets the allocation date.
     *
     * @param allocationDate the new allocation date
     */
    public void setAllocationDate (final String allocationDate)
    {
        this.allocationDate = allocationDate;
    }

    /**
     * Gets the amount.
     *
     * @return the amount
     */
    public String getAmount ()
    {
        return amount;
    }

    /**
     * Sets the amount.
     *
     * @param amount the new amount
     */
    public void setAmount (final String amount)
    {
        this.amount = amount;
    }

    /**
     * Gets the amount currency.
     *
     * @return the amount currency
     */
    public String getAmountCurrency ()
    {
        return amountCurrency;
    }

    /**
     * Sets the amount currency.
     *
     * @param amountCurrency the new amount currency
     */
    public void setAmountCurrency (final String amountCurrency)
    {
        this.amountCurrency = amountCurrency;
    }

    /**
     * Gets the issuing court code.
     *
     * @return the issuing court code
     */
    public String getIssuingCourtCode ()
    {
        return issuingCourtCode;
    }

    /**
     * Sets the issuing court code.
     *
     * @param issuingCourt the new issuing court code
     */
    public void setIssuingCourtCode (final String issuingCourt)
    {
        this.issuingCourtCode = issuingCourt;
    }

    /**
     * Gets the user ID.
     *
     * @return the user ID
     */
    public String getUserID ()
    {
        return userID;
    }

    /**
     * Sets the user ID.
     *
     * @param userID the new user ID
     */
    public void setUserID (final String userID)
    {
        this.userID = userID;
    }

    /**
     * Gets the date created.
     *
     * @return the date created
     */
    public String getDateCreated ()
    {
        return dateCreated;
    }

    /**
     * Sets the date created.
     *
     * @param dateCreated the new date created
     */
    public void setDateCreated (final String dateCreated)
    {
        this.dateCreated = dateCreated;
    }

    /**
     * M get element value.
     *
     * @param pElement the element
     * @param pChildTagName the child tag name
     * @return the string
     */
    private String mGetElementValue (final Element pElement, final String pChildTagName)
    {
        String sValue = null;
        Element childElement = null;

        try
        {
            childElement = pElement.getChild (pChildTagName);
            if (null != childElement)
            {
                sValue = childElement.getText ();
            }
        }
        finally
        {
            childElement = null;
        }

        return sValue;
    } // End mGetElementValue()

    /**
     * M set element.
     *
     * @param pParentElement the parent element
     * @param pElementName the element name
     * @param pElementContent the element content
     */
    private void mSetElement (final Element pParentElement, final String pElementName, final String pElementContent)
    {
        Element element = null;

        try
        {
            element = pParentElement.getChild (pElementName);
            if (null == element)
            {
                element = new Element (pElementName);
                pParentElement.addContent (element);
            }
            element.setText (pElementContent);
        }
        finally
        {
            element = null;
        }
    } // End mSetElement()

    /**
     * Gets the XML element.
     *
     * @return the XML element
     */
    public Element getXMLElement ()
    {
        final Element ds = new Element (TAG_DS);
        final Element warrantAmounts = new Element (TAG_WARRANT_AMOUNTS);
        final Element warrant = new Element (TAG_WARRANT);

        ds.addContent (warrantAmounts);
        warrantAmounts.addContent (warrant);

        mSetElement (warrant, TAG_SCN, scn);
        // Set the SCN attribute "table" and value "F"
        warrant.getChild (TAG_SCN);
        warrant.getChild (TAG_SCN).setAttribute ("table", "F");
        mSetElement (warrant, TAG_FEES_PAID_ID, feesPaidID);
        mSetElement (warrant, TAG_PROCESS_NUMBER, processNumber);
        mSetElement (warrant, TAG_PROCESS_TYPE, "W");
        mSetElement (warrant, TAG_DELETED_FLAG, deletedFlag);
        mSetElement (warrant, TAG_AMOUNT, amount);
        mSetElement (warrant, TAG_AMOUNT_CURRENCY, amountCurrency);
        mSetElement (warrant, TAG_ISSUING_COURT_CODE, issuingCourtCode);
        mSetElement (warrant, TAG_USER_ID, userID);
        mSetElement (warrant, TAG_DATE_CREATED, dateCreated);
        mSetElement (warrant, TAG_ALLOCATION_DATE, allocationDate);

        return ds;
    } // End getXMLElement()
} // End class WarrantReturnsXMLBuilder
