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

import org.jdom.Element;

/**
 * Class: AeEventXMLBuilder.java
 * 
 * @author Chris hutt
 *         Created: 06-July-2005
 *         Description: This class is intended to provided assistance in creating the XML element
 *         structure that needs to be passed to the addAeEvent() service method.
 *         The addAeEvent() method requires the presence of a number of XML
 *         elements (tags), even if they are empty, otherwise it fall over.
 *         The getXMLElement() method will provide an XML Element structure with
 *         the set of Element required by the addAeEvent() method.
 * 
 *         Change History:
 *         v1.1 Chris Hutt 18 aug 05
 *         Casenumber, OwningCourtCode, JudgmentDebtorPartyRoleCode and JudgmentDebtorCasePartyNumber
 *         tags added
 * 
 *         v1.2 Chris Hutt 3 march 2006
 *         Defect 2358: Process_date added
 */
public class AeEventXMLBuilder
{

    /**
     * Ae event seq element name.
     */
    public static final String TAG_AEEVENTSEQ = "AEEventSeq";
    /**
     * Case event seq element name.
     */
    public static final String TAG_CASEEVENTSEQ = "CaseEventSeq";
    /**
     * Ae number element name.
     */
    public static final String TAG_AENUMBER = "AENumber";
    /**
     * Standard event id element name.
     */
    public static final String TAG_STANDARDEVENTID = "StandardEventId";
    /**
     * Event details element name.
     */
    public static final String TAG_EVENTDETAILS = "EventDetails";
    /**
     * Event date element name.
     */
    public static final String TAG_EVENTDATE = "EventDate";
    /**
     * User name element name.
     */
    public static final String TAG_USERNAME = "UserName";
    /**
     * Receipt date element name.
     */
    public static final String TAG_RECEIPTDATE = "ReceiptDate";
    /**
     * Stage element name.
     */
    public static final String TAG_STAGE = "Stage";
    /**
     * Service element name.
     */
    public static final String TAG_SERVICE = "Service";
    /**
     * Bailiff id element name.
     */
    public static final String TAG_BAILIFFID = "BailiffId";
    /**
     * Service date element name.
     */
    public static final String TAG_SERVICEDATE = "ServiceDate";
    /**
     * Error ind element name.
     */
    public static final String TAG_ERRORIND = "ErrorInd";
    /**
     * Case number element name.
     */
    public static final String TAG_CASENUMBER = "CaseNumber";
    /**
     * Owning court code element name.
     */
    public static final String TAG_OWNINGCOURTCODE = "OwningCourtCode";
    /**
     * Judgement debtor party role code element name.
     */
    public static final String TAG_PARTYROLECODE = "JudgmentDebtorPartyRoleCode";
    /**
     * Judgement debtor case party number element name.
     */
    public static final String TAG_CASEPARTYNUMBER = "JudgmentDebtorCasePartyNumber";
    /**
     * Process date element name.
     */
    public static final String TAG_PROCESSDATE = "ProcessDate";

    /** The ae event XML element. */
    private Element aeEventXMLElement = null;

    /** The AE event seq. */
    private String AEEventSeq;
    
    /** The Case event seq. */
    private String CaseEventSeq;
    
    /** The AE number. */
    private String AENumber;
    
    /** The Standard event id. */
    private String StandardEventId;
    
    /** The Event details. */
    private String EventDetails;
    
    /** The Event date. */
    private String EventDate;
    
    /** The User name. */
    private String UserName;
    
    /** The Receipt date. */
    private String ReceiptDate;
    
    /** The Stage. */
    private String Stage;
    
    /** The Service. */
    private String Service;
    
    /** The Bailiff id. */
    private String BailiffId;
    
    /** The Service date. */
    private String ServiceDate;
    
    /** The Error ind. */
    private String ErrorInd;
    
    /** The Case number. */
    private String CaseNumber;
    
    /** The Owning court code. */
    private String OwningCourtCode;
    
    /** The Party role code. */
    private String PartyRoleCode;
    
    /** The Case party number. */
    private String CasePartyNumber;
    
    /** The Process date. */
    private String ProcessDate;

    /**
     * This version of the constructor allows the class to initialised by an existing
     * XML Element. Any additional elements will not be discarded.
     * 
     * @param pElement The ae event element
     */
    public AeEventXMLBuilder (final Element pElement)
    {
        // Take a copy of the input XML Element.
        // It may contain other elements that need to be passed on without manipulation.
        aeEventXMLElement = (Element) pElement.clone ();

        AEEventSeq = mGetElementValue (pElement, TAG_AEEVENTSEQ);
        CaseEventSeq = mGetElementValue (pElement, TAG_CASEEVENTSEQ);
        AENumber = mGetElementValue (pElement, TAG_AENUMBER);
        StandardEventId = mGetElementValue (pElement, TAG_STANDARDEVENTID);
        EventDetails = mGetElementValue (pElement, TAG_EVENTDETAILS);
        EventDate = mGetElementValue (pElement, TAG_EVENTDATE);
        UserName = mGetElementValue (pElement, TAG_USERNAME);
        ReceiptDate = mGetElementValue (pElement, TAG_RECEIPTDATE);
        Stage = mGetElementValue (pElement, TAG_STAGE);
        Service = mGetElementValue (pElement, TAG_SERVICE);
        BailiffId = mGetElementValue (pElement, TAG_BAILIFFID);
        ServiceDate = mGetElementValue (pElement, TAG_SERVICEDATE);
        ErrorInd = mGetElementValue (pElement, TAG_ERRORIND);
        CaseNumber = mGetElementValue (pElement, TAG_CASENUMBER);
        OwningCourtCode = mGetElementValue (pElement, TAG_OWNINGCOURTCODE);
        PartyRoleCode = mGetElementValue (pElement, TAG_PARTYROLECODE);
        CasePartyNumber = mGetElementValue (pElement, TAG_CASEPARTYNUMBER);
        ProcessDate = mGetElementValue (pElement, TAG_PROCESSDATE);

    } // AeEventXMLBuilder()

    /**
     * Constructor which takes the minimal amount of data required to create an event.
     *
     * @param aeNumber The ae number
     * @param standardEventId The standard event id
     * @param eventDate The event date
     * @param receiptDate The receipt date
     * @param userName The user name
     * @param ErrorInd The error ind
     */
    public AeEventXMLBuilder (final String aeNumber, final String standardEventId, final String eventDate,
            final String receiptDate, final String userName, final String ErrorInd)
    {

        setAENumber (aeNumber);
        setStandardEventId (standardEventId);
        setEventDate (eventDate);
        setReceiptDate (receiptDate);
        setUserName (userName);
        setErrorInd (ErrorInd);
    }

    /**
     * This version of the constructor allows the class to be constructed purely with
     * scalar values.
     * 
     * @param aeEventSeq The ae event seq
     * @param caseEventSeq The case event seq
     * @param aeNumber The ae number
     * @param standardEventId The standard event id
     * @param eventDetails The event details
     * @param eventDate The event date
     * @param userName The user name
     * @param receiptDate The receipt date
     * @param stage The stage
     * @param service The service
     * @param bailiffId The bailiff id
     * @param serviceDate The service date
     * @param errorInd The error ind
     * @param caseNumber The case number
     * @param owningCourtCode The owning court code
     * @param partyRoleCode The party role code
     * @param casePartyNumber The case party number
     * @param processDate The process date
     */
    public AeEventXMLBuilder (final String aeEventSeq, final String caseEventSeq, final String aeNumber,
            final String standardEventId, final String eventDetails, final String eventDate, final String userName,
            final String receiptDate, final String stage, final String service, final String bailiffId,
            final String serviceDate, final String errorInd, final String caseNumber, final String owningCourtCode,
            final String partyRoleCode, final String casePartyNumber, final String processDate)

    {
        super ();

        AEEventSeq = aeEventSeq;
        CaseEventSeq = caseEventSeq;
        AENumber = aeNumber;
        StandardEventId = standardEventId;
        EventDetails = eventDetails;
        EventDate = eventDate;
        UserName = userName;
        ReceiptDate = receiptDate;
        Stage = stage;
        Service = service;
        BailiffId = bailiffId;
        ServiceDate = serviceDate;
        ErrorInd = errorInd;
        CaseNumber = caseNumber;
        OwningCourtCode = owningCourtCode;
        PartyRoleCode = partyRoleCode;
        CasePartyNumber = casePartyNumber;
        ProcessDate = processDate;
    }

    /**
     * (non-Javadoc)
     * Returns element text or null.
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
     * (non-Javadoc)
     * Sets element text.
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
     * Translate the content of this class into an XML Element with the given tag name.
     * Sets the specified tag elements to the values held in the class attributes,
     * and copies any additional elements which may have been passed in via the constructor.
     * 
     * @param pElementName The element name
     * @return The xml element
     */
    public Element getXMLElement (final String pElementName)
    {

        Element element = null;

        if (null == aeEventXMLElement)
        {
            element = new Element (pElementName);
        }
        else
        {
            element = (Element) aeEventXMLElement.clone ();
            element = (Element) element.detach ();
            element.setName (pElementName);
        }

        mSetElement (element, TAG_AEEVENTSEQ, AEEventSeq);
        mSetElement (element, TAG_CASEEVENTSEQ, CaseEventSeq);
        mSetElement (element, TAG_AENUMBER, AENumber);
        mSetElement (element, TAG_STANDARDEVENTID, StandardEventId);
        mSetElement (element, TAG_EVENTDETAILS, EventDetails);
        mSetElement (element, TAG_EVENTDATE, EventDate);
        mSetElement (element, TAG_USERNAME, UserName);
        mSetElement (element, TAG_RECEIPTDATE, ReceiptDate);
        mSetElement (element, TAG_STAGE, Stage);
        mSetElement (element, TAG_SERVICE, Service);
        mSetElement (element, TAG_BAILIFFID, BailiffId);
        mSetElement (element, TAG_SERVICEDATE, ServiceDate);
        mSetElement (element, TAG_ERRORIND, ErrorInd);
        mSetElement (element, TAG_CASENUMBER, CaseNumber);
        mSetElement (element, TAG_OWNINGCOURTCODE, OwningCourtCode);
        mSetElement (element, TAG_PARTYROLECODE, PartyRoleCode);
        mSetElement (element, TAG_CASEPARTYNUMBER, CasePartyNumber);
        mSetElement (element, TAG_PROCESSDATE, ProcessDate);

        return element;
    } // getXMLElement()

    /**
     * Gets the AE event seq.
     *
     * @return the AE event seq
     */
    public String getAEEventSeq ()
    {
        return AEEventSeq;
    }

    /**
     * Sets the AE event seq.
     *
     * @param eventSeq the new AE event seq
     */
    public void setAEEventSeq (final String eventSeq)
    {
        AEEventSeq = eventSeq;
    }

    /**
     * Gets the ae event XML element.
     *
     * @return the ae event XML element
     */
    public Element getAeEventXMLElement ()
    {
        return aeEventXMLElement;
    }

    /**
     * Sets the ae event XML element.
     *
     * @param aeEventXMLElement the new ae event XML element
     */
    public void setAeEventXMLElement (final Element aeEventXMLElement)
    {
        this.aeEventXMLElement = aeEventXMLElement;
    }

    /**
     * Gets the AE number.
     *
     * @return the AE number
     */
    public String getAENumber ()
    {
        return AENumber;
    }

    /**
     * Sets the AE number.
     *
     * @param number the new AE number
     */
    public void setAENumber (final String number)
    {
        AENumber = number;
    }

    /**
     * Gets the bailiff id.
     *
     * @return the bailiff id
     */
    public String getBailiffId ()
    {
        return BailiffId;
    }

    /**
     * Sets the bailiff id.
     *
     * @param bailiffId the new bailiff id
     */
    public void setBailiffId (final String bailiffId)
    {
        BailiffId = bailiffId;
    }

    /**
     * Gets the case event seq.
     *
     * @return the case event seq
     */
    public String getCaseEventSeq ()
    {
        return CaseEventSeq;
    }

    /**
     * Sets the case event seq.
     *
     * @param caseEventSeq the new case event seq
     */
    public void setCaseEventSeq (final String caseEventSeq)
    {
        CaseEventSeq = caseEventSeq;
    }

    /**
     * Gets the event date.
     *
     * @return the event date
     */
    public String getEventDate ()
    {
        return EventDate;
    }

    /**
     * Sets the event date.
     *
     * @param eventDate the new event date
     */
    public void setEventDate (final String eventDate)
    {
        EventDate = eventDate;
    }

    /**
     * Gets the event details.
     *
     * @return the event details
     */
    public String getEventDetails ()
    {
        return EventDetails;
    }

    /**
     * Sets the event details.
     *
     * @param eventDetails the new event details
     */
    public void setEventDetails (final String eventDetails)
    {
        EventDetails = eventDetails;
    }

    /**
     * Gets the receipt date.
     *
     * @return the receipt date
     */
    public String getReceiptDate ()
    {
        return ReceiptDate;
    }

    /**
     * Sets the receipt date.
     *
     * @param receiptDate the new receipt date
     */
    public void setReceiptDate (final String receiptDate)
    {
        ReceiptDate = receiptDate;
    }

    /**
     * Gets the service.
     *
     * @return the service
     */
    public String getService ()
    {
        return Service;
    }

    /**
     * Sets the service.
     *
     * @param service the new service
     */
    public void setService (final String service)
    {
        Service = service;
    }

    /**
     * Gets the service date.
     *
     * @return the service date
     */
    public String getServiceDate ()
    {
        return ServiceDate;
    }

    /**
     * Sets the service date.
     *
     * @param serviceDate the new service date
     */
    public void setServiceDate (final String serviceDate)
    {
        ServiceDate = serviceDate;
    }

    /**
     * Gets the stage.
     *
     * @return the stage
     */
    public String getStage ()
    {
        return Stage;
    }

    /**
     * Sets the stage.
     *
     * @param stage the new stage
     */
    public void setStage (final String stage)
    {
        Stage = stage;
    }

    /**
     * Gets the standard event id.
     *
     * @return the standard event id
     */
    public String getStandardEventId ()
    {
        return StandardEventId;
    }

    /**
     * Sets the standard event id.
     *
     * @param standardEventId the new standard event id
     */
    public void setStandardEventId (final String standardEventId)
    {
        StandardEventId = standardEventId;
    }

    /**
     * Gets the user name.
     *
     * @return the user name
     */
    public String getUserName ()
    {
        return UserName;
    }

    /**
     * Sets the user name.
     *
     * @param userName the new user name
     */
    public void setUserName (final String userName)
    {
        UserName = userName;
    }

    /**
     * Gets the error ind.
     *
     * @return the error ind
     */
    public String getErrorInd ()
    {
        return ErrorInd;
    }

    /**
     * Sets the error ind.
     *
     * @param errorInd the new error ind
     */
    public void setErrorInd (final String errorInd)
    {
        ErrorInd = errorInd;
    }

    /**
     * Gets the case number.
     *
     * @return the case number
     */
    public String getCaseNumber ()
    {
        return CaseNumber;
    }

    /**
     * Sets the case number.
     *
     * @param caseNumber the new case number
     */
    public void setCaseNumber (final String caseNumber)
    {
        CaseNumber = caseNumber;
    }

    /**
     * Gets the case party number.
     *
     * @return the case party number
     */
    public String getCasePartyNumber ()
    {
        return CasePartyNumber;
    }

    /**
     * Sets the case party number.
     *
     * @param casePartyNumber the new case party number
     */
    public void setCasePartyNumber (final String casePartyNumber)
    {
        CasePartyNumber = casePartyNumber;
    }

    /**
     * Gets the owning court code.
     *
     * @return the owning court code
     */
    public String getOwningCourtCode ()
    {
        return OwningCourtCode;
    }

    /**
     * Sets the owning court code.
     *
     * @param owningCourtCode the new owning court code
     */
    public void setOwningCourtCode (final String owningCourtCode)
    {
        OwningCourtCode = owningCourtCode;
    }

    /**
     * Gets the party role code.
     *
     * @return the party role code
     */
    public String getPartyRoleCode ()
    {
        return PartyRoleCode;
    }

    /**
     * Sets the party role code.
     *
     * @param partyRoleCode the new party role code
     */
    public void setPartyRoleCode (final String partyRoleCode)
    {
        PartyRoleCode = partyRoleCode;
    }

    /**
     * Gets the process date.
     *
     * @return the process date
     */
    public String getProcessDate ()
    {
        return ProcessDate;
    }

    /**
     * Sets the process date.
     *
     * @param processDate the new process date
     */
    public void setProcessDate (final String processDate)
    {
        ProcessDate = processDate;
    }
} // class AeEventXMLBuilder
