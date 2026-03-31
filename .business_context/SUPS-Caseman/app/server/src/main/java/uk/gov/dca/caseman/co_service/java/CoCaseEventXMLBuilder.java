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
package uk.gov.dca.caseman.co_service.java;

import org.jdom.Element;

/**
 * Class: CoCaseEventXMLBuilder.java
 * 
 * @author Phil Haferer (EDS)
 *         Created: 23 September 2005
 *         Description: This class is intended to provided assistance in creating the XML element
 *         structure that needs to be passed to the updateCoCaseEvent() service method.
 *         The updateCoCaseEvent() method requires the presence of a number of XML
 *         elements (tags), even if they are empty, otherwise it fall over.
 *         The getXMLElement() method will provide an XML Element structure with
 *         the set of Element required by the insertCaseEventRow() method.
 */
public class CoCaseEventXMLBuilder
{
    /**
     * Ald debt sequence element name.
     */
    public static final String TAG_ALDDEBTSEQ = "AldDebtSeq";
    /**
     * Admin crown court element name.
     */
    public static final String TAG_ADMINCOURTCODE = "AdminCourtCode";
    /**
     * co number element name.
     */
    public static final String TAG_CONUMBER = "CoNumber";
    /**
     * Standard event id element name.
     */
    public static final String TAG_STDEVENTID = "StdEventId";
    /**
     * Event date element name.
     */
    public static final String TAG_EVENTDATE = "EventDate";
    /**
     * Event details element name.
     */
    public static final String TAG_EVENTDETAILS = "EventDetails";
    /**
     * Transfer status element name.
     */
    public static final String TAG_TRANSFERSTATUS = "TransferStatus";
    /**
     * Transfer date element name.
     */
    public static final String TAG_TRANSFERDATE = "TransferDate";
    /**
     * Case number element name.
     */
    public static final String TAG_CASENUMBER = "CaseNumber";
    /**
     * Created date element name.
     */
    public static final String TAG_CREATEDDATE = "CreatedDate";

    /** The co case event XML element. */
    private Element coCaseEventXMLElement = null;

    /** The Ald debt seq. */
    private String AldDebtSeq;
    
    /** The Admin court code. */
    private String AdminCourtCode;
    
    /** The Co number. */
    private String CoNumber;
    
    /** The Std event id. */
    private String StdEventId;
    
    /** The Event date. */
    private String EventDate;
    
    /** The Event details. */
    private String EventDetails;
    
    /** The Transfer status. */
    private String TransferStatus;
    
    /** The Transfer date. */
    private String TransferDate;
    
    /** The Case number. */
    private String CaseNumber;
    
    /** The Created date. */
    private String CreatedDate;

    /**
     * This version of the constructor allows the class to initialised by an existing
     * XML Element. Any additional elements will not be discarded.
     * 
     * @param pElement The parameters element.
     */
    public CoCaseEventXMLBuilder (final Element pElement)
    {
        // Take a copy of the input XML Element.
        // It may contain other elements that need to be passed on without manipulation.
        coCaseEventXMLElement = (Element) pElement.clone ();

        AldDebtSeq = mGetElementValue (pElement, TAG_ALDDEBTSEQ);
        AdminCourtCode = mGetElementValue (pElement, TAG_ADMINCOURTCODE);
        CoNumber = mGetElementValue (pElement, TAG_CONUMBER);
        StdEventId = mGetElementValue (pElement, TAG_STDEVENTID);
        EventDate = mGetElementValue (pElement, TAG_EVENTDATE);
        EventDetails = mGetElementValue (pElement, TAG_EVENTDETAILS);
        TransferStatus = mGetElementValue (pElement, TAG_TRANSFERSTATUS);
        TransferDate = mGetElementValue (pElement, TAG_TRANSFERDATE);
        CaseNumber = mGetElementValue (pElement, TAG_CASENUMBER);
        CreatedDate = mGetElementValue (pElement, TAG_CREATEDDATE);
    } // CoCaseEventXMLBuilder()

    /**
     * This version of the constructor allows the class to be constructed purely with
     * scalar values.
     * 
     * @param aldDebtSeq The ald debt sequence.
     * @param adminCourtCode The admin court code.
     * @param coNumber The co number.
     * @param stdEventId The standard event id.
     * @param eventDate The event date.
     * @param eventDetails The event details.
     * @param transferStatus The transfer status.
     * @param transferDate The transfer date.
     * @param caseNumber The case number.
     * @param createdDate The created date.
     */
    public CoCaseEventXMLBuilder (final String aldDebtSeq, final String adminCourtCode, final String coNumber,
            final String stdEventId, final String eventDate, final String eventDetails, final String transferStatus,
            final String transferDate, final String caseNumber, final String createdDate)
    {
        super ();
        AldDebtSeq = aldDebtSeq;
        AdminCourtCode = adminCourtCode;
        CoNumber = coNumber;
        StdEventId = stdEventId;
        EventDate = eventDate;
        EventDetails = eventDetails;
        TransferStatus = transferStatus;
        TransferDate = transferDate;
        CaseNumber = caseNumber;
        CreatedDate = createdDate;
    }

    /**
     * (non-Javadoc)
     * Get the elements text value or return null if element does not exist.
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
     * Set the elements text value and create element if it does not exist.
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
     * @param pElementName The element name.
     * @return The xml element.
     */
    public Element getXMLElement (final String pElementName)
    {

        Element element = null;

        if (null == coCaseEventXMLElement)
        {
            element = new Element (pElementName);
        }
        else
        {
            element = (Element) coCaseEventXMLElement.clone ();
            element = (Element) element.detach ();
            element.setName (pElementName);
        }

        mSetElement (element, TAG_ALDDEBTSEQ, AldDebtSeq);
        mSetElement (element, TAG_ADMINCOURTCODE, AdminCourtCode);
        mSetElement (element, TAG_CONUMBER, CoNumber);
        mSetElement (element, TAG_STDEVENTID, StdEventId);
        mSetElement (element, TAG_EVENTDATE, EventDate);
        mSetElement (element, TAG_EVENTDETAILS, EventDetails);
        mSetElement (element, TAG_TRANSFERSTATUS, TransferStatus);
        mSetElement (element, TAG_TRANSFERDATE, TransferDate);
        mSetElement (element, TAG_CASENUMBER, CaseNumber);
        mSetElement (element, TAG_CREATEDDATE, CreatedDate);

        return element;
    } // getXMLElement()

    /**
     * Gets the admin court code.
     *
     * @return the admin court code
     */
    public String getAdminCourtCode ()
    {
        return AdminCourtCode;
    }

    /**
     * Sets the admin court code.
     *
     * @param adminCourtCode the new admin court code
     */
    public void setAdminCourtCode (final String adminCourtCode)
    {
        AdminCourtCode = adminCourtCode;
    }

    /**
     * Gets the ald debt seq.
     *
     * @return the ald debt seq
     */
    public String getAldDebtSeq ()
    {
        return AldDebtSeq;
    }

    /**
     * Sets the ald debt seq.
     *
     * @param aldDebtSeq the new ald debt seq
     */
    public void setAldDebtSeq (final String aldDebtSeq)
    {
        AldDebtSeq = aldDebtSeq;
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
     * Gets the co case event XML element.
     *
     * @return the co case event XML element
     */
    public Element getCoCaseEventXMLElement ()
    {
        return coCaseEventXMLElement;
    }

    /**
     * Sets the co case event XML element.
     *
     * @param coCaseEventXMLElement the new co case event XML element
     */
    public void setCoCaseEventXMLElement (final Element coCaseEventXMLElement)
    {
        this.coCaseEventXMLElement = coCaseEventXMLElement;
    }

    /**
     * Gets the co number.
     *
     * @return the co number
     */
    public String getCoNumber ()
    {
        return CoNumber;
    }

    /**
     * Sets the co number.
     *
     * @param coNumber the new co number
     */
    public void setCoNumber (final String coNumber)
    {
        CoNumber = coNumber;
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
     * Gets the created date.
     *
     * @return the created date
     */
    public String getCreatedDate ()
    {
        return CreatedDate;
    }

    /**
     * Sets the created date.
     *
     * @param createdDate the new created date
     */
    public void setCreatedDate (final String createdDate)
    {
        CreatedDate = createdDate;
    }

    /**
     * Gets the std event id.
     *
     * @return the std event id
     */
    public String getStdEventId ()
    {
        return StdEventId;
    }

    /**
     * Sets the std event id.
     *
     * @param stdEventId the new std event id
     */
    public void setStdEventId (final String stdEventId)
    {
        StdEventId = stdEventId;
    }

    /**
     * Gets the transfer date.
     *
     * @return the transfer date
     */
    public String getTransferDate ()
    {
        return TransferDate;
    }

    /**
     * Sets the transfer date.
     *
     * @param transferDate the new transfer date
     */
    public void setTransferDate (final String transferDate)
    {
        TransferDate = transferDate;
    }

    /**
     * Gets the transfer status.
     *
     * @return the transfer status
     */
    public String getTransferStatus ()
    {
        return TransferStatus;
    }

    /**
     * Sets the transfer status.
     *
     * @param transferStatus the new transfer status
     */
    public void setTransferStatus (final String transferStatus)
    {
        TransferStatus = transferStatus;
    }
} // class CoCaseEventXMLBuilder
