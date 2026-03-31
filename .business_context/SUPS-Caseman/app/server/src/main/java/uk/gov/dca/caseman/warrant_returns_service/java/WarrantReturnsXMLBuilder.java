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

import org.jdom.Element;

/**
 * Class: WarrantReturnsXMLBuilder.java
 * Description: This class is intended to provided assistance in creating the XML
 * element structure that needs to be passed to the insertWarrantReturns()
 * service method. The insertWarrantReturns() method requires the presence
 * of a number of XML elements (tags), even if they are empty, otherwise it
 * falls over. The getXMLElement() method will provide an XML Element
 * structure with the set of Element required by the insertWarrantReturns()
 * method.
 * 
 * Change History:
 * 07-May-2008 - Chris Vincent, added the IgnoreBMSNonEvent tag along with getter and setter
 * CaseMan Defect 6544.
 * 
 * Created: 16-May-2005
 * 
 * @author Tim Connor (Valtech)
 */
public class WarrantReturnsXMLBuilder
{

    /** The Constant TAG_DS. */
    private static final String TAG_DS = "ds";

    /** The Constant TAG_WARRANT_RETURNS. */
    private static final String TAG_WARRANT_RETURNS = "WarrantReturns";

    /** The Constant TAG_WARRANT_EVENTS. */
    private static final String TAG_WARRANT_EVENTS = "WarrantEvents";

    /** The Constant TAG_WARRANT_EVENT. */
    private static final String TAG_WARRANT_EVENT = "WarrantEvent";

    /** The Constant TAG_WARRANT_ID. */
    private static final String TAG_WARRANT_ID = "WarrantID";

    /** The Constant TAG_WARRANT_RETURNS_ID. */
    private static final String TAG_WARRANT_RETURNS_ID = "WarrantReturnsID";

    /** The Constant TAG_RETURN_DATE. */
    private static final String TAG_RETURN_DATE = "ReturnDate";

    /** The Constant TAG_RETURN_CODE. */
    private static final String TAG_RETURN_CODE = "Code";

    /** The Constant TAG_COURT_CODE. */
    private static final String TAG_COURT_CODE = "CourtCode";

    /** The Constant TAG_RETURN_TEXT. */
    private static final String TAG_RETURN_TEXT = "ReturnText";

    /** The Constant TAG_ADDITIONAL_DETAILS. */
    private static final String TAG_ADDITIONAL_DETAILS = "AdditionalDetails";

    /** The Constant TAG_NOTICE_REQUIRED. */
    private static final String TAG_NOTICE_REQUIRED = "Notice";

    /** The Constant TAG_DEFENDANT_ID. */
    private static final String TAG_DEFENDANT_ID = "Defendant";

    /** The Constant TAG_VERIFIED. */
    private static final String TAG_VERIFIED = "Verified";

    /** The Constant TAG_ERROR_INDICATOR. */
    private static final String TAG_ERROR_INDICATOR = "Error";

    /** The Constant TAG_APPOINTMENT_DATE. */
    private static final String TAG_APPOINTMENT_DATE = "AppointmentDate";

    /** The Constant TAG_APPOINTMENT_TIME. */
    private static final String TAG_APPOINTMENT_TIME = "AppointmentTime";

    /** The Constant TAG_CREATED_BY. */
    private static final String TAG_CREATED_BY = "CreatedBy";

    /** The Constant TAG_EXECUTED_BY. */
    private static final String TAG_EXECUTED_BY = "ExecutedBy";

    /** The Constant TAG_RECEIPT_DATE. */
    private static final String TAG_RECEIPT_DATE = "ReceiptDate";

    /** The Constant TAG_TO_TRANSFER. */
    private static final String TAG_TO_TRANSFER = "ToTransfer";

    /** The Constant TAG_CASE_NUMBER. */
    private static final String TAG_CASE_NUMBER = "CaseNumber";

    /** The Constant TAG_LOCAL_NUMBER. */
    private static final String TAG_LOCAL_NUMBER = "LocalNumber";

    /** The Constant TAG_IGNORE_BMS_NON_EVENT. */
    private static final String TAG_IGNORE_BMS_NON_EVENT = "IgnoreBMSNonEvent";

    /** The warrant ID. */
    private String warrantID;

    /** The warrant returns ID. */
    private String warrantReturnsID;

    /** The return date. */
    private String returnDate;

    /** The return code. */
    private String returnCode;

    /** The court code. */
    private String courtCode;

    /** The return text. */
    private String returnText;

    /** The additional details. */
    private String additionalDetails;

    /** The notice required. */
    private String noticeRequired;

    /** The defendant ID. */
    private String defendantID;

    /** The verified. */
    private String verified;

    /** The error indicator. */
    private String errorIndicator;

    /** The appointment date. */
    private String appointmentDate;

    /** The appointment time. */
    private String appointmentTime;

    /** The created by. */
    private String createdBy;

    /** The executed by. */
    private String executedBy;

    /** The receipt date. */
    private String receiptDate;

    /** The to transfer. */
    private String toTransfer;

    /** The case number. */
    private String caseNumber;

    /** The local number. */
    private String localNumber;

    /** The ignore BMS non event. */
    private String ignoreBMSNonEvent;

    /**
     * Constructor which takes the minimal amount of data required to create an event.
     *
     * @param warrantID The warrant id.
     * @param returnCode The return code.
     * @param returnDate The return date.
     */
    public WarrantReturnsXMLBuilder (final String warrantID, final String returnCode, final String returnDate)
    {
        setWarrantID (warrantID);
        setwarrantReturnsID ("");
        setReturnDate (returnDate);
        setReturnCode (returnCode);
        setCourtCode ("0"); // Set default as a National return code (court '0' for All Courts)
        setReturnText ("");
        setAdditionalDetails ("");
        setNoticeRequired ("N");
        setDefendantID ("");
        setVerified ("");
        setErrorIndicator ("N");
        setAppointmentDate ("");
        setAppointmentTime ("");
        setCreatedBy ("");
        setExecutedBy ("");
        setReceiptDate ("");
        setToTransfer ("0");
        setCaseNumber ("");
        setLocalNumber ("");
        setIgnoreBMSNonEvent ("N");
    }

    /**
     * Gets the warrant ID.
     *
     * @return the warrant ID
     */
    public String getWarrantID ()
    {
        return warrantID;
    }

    /**
     * Sets the warrant ID.
     *
     * @param warrantID the new warrant ID
     */
    public void setWarrantID (final String warrantID)
    {
        this.warrantID = warrantID;
    }

    /**
     * Gets the warrant returns ID.
     *
     * @return Returns the warrantReturnsID.
     */
    public String getwarrantReturnsID ()
    {
        return warrantReturnsID;
    }

    /**
     * Sets the warrant returns ID.
     *
     * @param warrantReturnsID The warrantReturnsID to set.
     */
    public void setwarrantReturnsID (final String warrantReturnsID)
    {
        this.warrantReturnsID = warrantReturnsID;
    }

    /**
     * Gets the return date.
     *
     * @return the return date
     */
    public String getReturnDate ()
    {
        return returnDate;
    }

    /**
     * Sets the return date.
     *
     * @param returnDate the new return date
     */
    public void setReturnDate (final String returnDate)
    {
        this.returnDate = returnDate;
    }

    /**
     * Gets the return code.
     *
     * @return the return code
     */
    public String getReturnCode ()
    {
        return returnCode;
    }

    /**
     * Sets the return code.
     *
     * @param returnCode the new return code
     */
    public void setReturnCode (final String returnCode)
    {
        this.returnCode = returnCode;
    }

    /**
     * Gets the court code.
     *
     * @return the court code
     */
    public String getCourtCode ()
    {
        return courtCode;
    }

    /**
     * Sets the court code.
     *
     * @param courtCode the new court code
     */
    public void setCourtCode (final String courtCode)
    {
        this.courtCode = courtCode;
    }

    /**
     * Gets the return text.
     *
     * @return the return text
     */
    public String getReturnText ()
    {
        return returnText;
    }

    /**
     * Sets the return text.
     *
     * @param returnText the new return text
     */
    public void setReturnText (final String returnText)
    {
        this.returnText = returnText;
    }

    /**
     * Gets the additional details.
     *
     * @return the additional details
     */
    public String getAdditionalDetails ()
    {
        return additionalDetails;
    }

    /**
     * Sets the additional details.
     *
     * @param additionalDetails the new additional details
     */
    public void setAdditionalDetails (final String additionalDetails)
    {
        this.additionalDetails = additionalDetails;
    }

    /**
     * Gets the notice required.
     *
     * @return the notice required
     */
    public String getNoticeRequired ()
    {
        return noticeRequired;
    }

    /**
     * Sets the notice required.
     *
     * @param noticeRequired the new notice required
     */
    public void setNoticeRequired (final String noticeRequired)
    {
        this.noticeRequired = noticeRequired;
    }

    /**
     * Gets the defendant ID.
     *
     * @return the defendant ID
     */
    public String getDefendantID ()
    {
        return defendantID;
    }

    /**
     * Sets the defendant ID.
     *
     * @param defendantID the new defendant ID
     */
    public void setDefendantID (final String defendantID)
    {
        this.defendantID = defendantID;
    }

    /**
     * Gets the verified.
     *
     * @return the verified
     */
    public String getVerified ()
    {
        return verified;
    }

    /**
     * Sets the verified.
     *
     * @param verified the new verified
     */
    public void setVerified (final String verified)
    {
        this.verified = verified;
    }

    /**
     * Gets the error indicator.
     *
     * @return the error indicator
     */
    public String getErrorIndicator ()
    {
        return errorIndicator;
    }

    /**
     * Sets the error indicator.
     *
     * @param errorIndicator the new error indicator
     */
    public void setErrorIndicator (final String errorIndicator)
    {
        this.errorIndicator = errorIndicator;
    }

    /**
     * Gets the appointment date.
     *
     * @return the appointment date
     */
    public String getAppointmentDate ()
    {
        return appointmentDate;
    }

    /**
     * Sets the appointment date.
     *
     * @param appointmentDate the new appointment date
     */
    public void setAppointmentDate (final String appointmentDate)
    {
        this.appointmentDate = appointmentDate;
    }

    /**
     * Gets the appointment time.
     *
     * @return the appointment time
     */
    public String getAppointmentTime ()
    {
        return appointmentTime;
    }

    /**
     * Sets the appointment time.
     *
     * @param appointmentTime the new appointment time
     */
    public void setAppointmentTime (final String appointmentTime)
    {
        this.appointmentTime = appointmentTime;
    }

    /**
     * Gets the created by.
     *
     * @return the created by
     */
    public String getCreatedBy ()
    {
        return createdBy;
    }

    /**
     * Sets the created by.
     *
     * @param createdBy the new created by
     */
    public void setCreatedBy (final String createdBy)
    {
        this.createdBy = createdBy;
    }

    /**
     * Gets the executed by.
     *
     * @return the executed by
     */
    public String getExecutedBy ()
    {
        return executedBy;
    }

    /**
     * Sets the executed by.
     *
     * @param executedBy the new executed by
     */
    public void setExecutedBy (final String executedBy)
    {
        this.executedBy = executedBy;
    }

    /**
     * Gets the receipt date.
     *
     * @return the receipt date
     */
    public String getReceiptDate ()
    {
        return receiptDate;
    }

    /**
     * Sets the receipt date.
     *
     * @param receiptDate the new receipt date
     */
    public void setReceiptDate (final String receiptDate)
    {
        this.receiptDate = receiptDate;
    }

    /**
     * Gets the to transfer.
     *
     * @return the to transfer
     */
    public String getToTransfer ()
    {
        return toTransfer;
    }

    /**
     * Sets the to transfer.
     *
     * @param toTransfer the new to transfer
     */
    public void setToTransfer (final String toTransfer)
    {
        this.toTransfer = toTransfer;
    }

    /**
     * Gets the case number.
     *
     * @return the case number
     */
    public String getCaseNumber ()
    {
        return toTransfer;
    }

    /**
     * Sets the case number.
     *
     * @param caseNumber the new case number
     */
    public void setCaseNumber (final String caseNumber)
    {
        this.caseNumber = caseNumber;
    }

    /**
     * Gets the local number.
     *
     * @return the local number
     */
    public String getLocalNumber ()
    {
        return localNumber;
    }

    /**
     * Sets the local number.
     *
     * @param localNumber the new local number
     */
    public void setLocalNumber (final String localNumber)
    {
        this.localNumber = localNumber;
    }

    /**
     * Gets the ignore BMS non event.
     *
     * @return the ignore BMS non event
     */
    public String getIgnoreBMSNonEvent ()
    {
        return ignoreBMSNonEvent;
    }

    /**
     * Sets the ignore BMS non event.
     *
     * @param ignoreBMSNonEvent the new ignore BMS non event
     */
    public void setIgnoreBMSNonEvent (final String ignoreBMSNonEvent)
    {
        this.ignoreBMSNonEvent = ignoreBMSNonEvent;
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
    } // mGetElementValue()

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
    } // mSetElement()

    /**
     * Gets the XML element.
     *
     * @return the XML element
     */
    public Element getXMLElement ()
    {
        final Element ds = new Element (TAG_DS);
        final Element warrantReturns = new Element (TAG_WARRANT_RETURNS);
        final Element warrantEvents = new Element (TAG_WARRANT_EVENTS);
        final Element warrantEvent = new Element (TAG_WARRANT_EVENT);

        ds.addContent (warrantReturns);
        warrantReturns.addContent (warrantEvents);
        warrantEvents.addContent (warrantEvent);

        mSetElement (warrantEvent, TAG_WARRANT_ID, warrantID);
        mSetElement (warrantEvent, TAG_WARRANT_RETURNS_ID, warrantReturnsID);
        mSetElement (warrantEvent, TAG_RETURN_DATE, returnDate);
        mSetElement (warrantEvent, TAG_RETURN_CODE, returnCode);
        mSetElement (warrantEvent, TAG_COURT_CODE, courtCode);
        mSetElement (warrantEvent, TAG_RETURN_TEXT, returnText);
        mSetElement (warrantEvent, TAG_ADDITIONAL_DETAILS, additionalDetails);
        mSetElement (warrantEvent, TAG_NOTICE_REQUIRED, noticeRequired);
        mSetElement (warrantEvent, TAG_DEFENDANT_ID, defendantID);
        mSetElement (warrantEvent, TAG_VERIFIED, verified);
        mSetElement (warrantEvent, TAG_ERROR_INDICATOR, errorIndicator);
        mSetElement (warrantEvent, TAG_APPOINTMENT_DATE, appointmentDate);
        mSetElement (warrantEvent, TAG_APPOINTMENT_TIME, appointmentTime);
        mSetElement (warrantEvent, TAG_CREATED_BY, createdBy);
        mSetElement (warrantEvent, TAG_EXECUTED_BY, executedBy);
        mSetElement (warrantEvent, TAG_RECEIPT_DATE, receiptDate);
        mSetElement (warrantEvent, TAG_TO_TRANSFER, toTransfer);
        mSetElement (warrantEvent, TAG_CASE_NUMBER, caseNumber);
        mSetElement (warrantEvent, TAG_LOCAL_NUMBER, localNumber);
        mSetElement (warrantEvent, TAG_IGNORE_BMS_NON_EVENT, ignoreBMSNonEvent);

        return ds;
    } // getXMLElement()
} // class WarrantReturnsXMLBuilder
