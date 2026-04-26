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
package uk.gov.dca.caseman.co_event_service.java;

import org.jdom.Element;

/**
 * Class: CoEventXMLBuilder.java
 * 
 * @author Chris hutt
 *         Created: 12-July-2005
 *         Description: This class is intended to provided assistance in creating the XML element
 *         structure that needs to be passed to the addCoEvent() service method.
 *         The addCoEvent() method requires the presence of a number of XML
 *         elements (tags), even if they are empty, otherwise it fall over.
 *         The getXMLElement() method will provide an XML Element structure with
 *         the set of Element required by the addCoEvent() method.
 * 
 *         Change History
 *         V1.0 12/7/05 Chris Hutt
 *         DEFECT 1723 - could not save hearingCO
 *         DebtSeqNumber - wrong tag name
 * 
 *         V1.1 20/12/05 Chris Hutt
 *         add CreatingCourt and CreatingSection (BMS enhancement)
 * 
 */
public class CoEventXMLBuilder
{

    /**
     * co event sequence element name.
     */
    public static final String TAG_COEVENTSEQ = "COEventSeq";
    /**
     * co number element name.
     */
    public static final String TAG_CONUMBER = "CONumber";
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
     * Issue stage element name.
     */
    public static final String TAG_STAGE = "IssueStage";
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
     * bms task element name.
     */
    public static final String TAG_BMSTASK = "BMSTask";
    /**
     * Stats module element name.
     */
    public static final String TAG_STATSMODULE = "StatsModule";
    /**
     * Age category element name.
     */
    public static final String TAG_AGECATEGORY = "AgeCategory";
    /**
     * Warrant id element name.
     */
    public static final String TAG_WARRANTID = "WarrantId";
    /**
     * Process date element name.
     */
    public static final String TAG_PROCESSDATE = "ProcessDate";
    /**
     * Error ind element name.
     */
    public static final String TAG_ERRORIND = "ErrorInd";
    /**
     * Hearing sequence element name.
     */
    public static final String TAG_HRGSEQ = "HrgSeq";
    /**
     * Process stage element name.
     */
    public static final String TAG_PROCESSSTAGE = "ProcessStage";
    /**
     * All debt sequence element name.
     */
    public static final String TAG_ALDDEBTSEQ = "DebtSeqNumber";
    /**
     * Creating court element name.
     */
    public static final String TAG_CREATINGCOURT = "CreatingCourt";
    /**
     * Creating section element name.
     */
    public static final String TAG_CREATINGSECTION = "CreatingSection";

    /** The co event XML element. */
    private Element coEventXMLElement = null;

    /** The Co event seq. */
    private String CoEventSeq;
    
    /** The Co number. */
    private String CoNumber;
    
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
    
    /** The BMS task. */
    private String BMSTask;
    
    /** The Stats module. */
    private String StatsModule;
    
    /** The Age category. */
    private String AgeCategory;
    
    /** The Warrant id. */
    private String WarrantId;
    
    /** The Process date. */
    private String ProcessDate;
    
    /** The Process stage. */
    private String ProcessStage;
    
    /** The Hrg seq. */
    private String HrgSeq;
    
    /** The Ald debt seq. */
    private String AldDebtSeq;
    
    /** The Creating court. */
    private String CreatingCourt;
    
    /** The Creating section. */
    private String CreatingSection;

    /**
     * This version of the constructor allows the class to initialised by an existing
     * XML Element. Any additional elements will not be discarded.
     * 
     * @param pElement The parameters element.
     */
    public CoEventXMLBuilder (final Element pElement)
    {
        // Take a copy of the input XML Element.
        // It may contain other elements that need to be passed on without manipulation.
        coEventXMLElement = (Element) pElement.clone ();

        CoEventSeq = mGetElementValue (pElement, TAG_COEVENTSEQ);
        CoNumber = mGetElementValue (pElement, TAG_CONUMBER);
        StandardEventId = mGetElementValue (pElement, TAG_STANDARDEVENTID);
        EventDetails = mGetElementValue (pElement, TAG_EVENTDETAILS);
        EventDate = mGetElementValue (pElement, TAG_EVENTDATE);
        UserName = mGetElementValue (pElement, TAG_USERNAME);
        ReceiptDate = mGetElementValue (pElement, TAG_RECEIPTDATE);
        Stage = mGetElementValue (pElement, TAG_STAGE);
        Service = mGetElementValue (pElement, TAG_SERVICE);
        BailiffId = mGetElementValue (pElement, TAG_BAILIFFID);
        ServiceDate = mGetElementValue (pElement, TAG_SERVICEDATE);
        BMSTask = mGetElementValue (pElement, TAG_BMSTASK);
        StatsModule = mGetElementValue (pElement, TAG_STATSMODULE);
        AgeCategory = mGetElementValue (pElement, TAG_AGECATEGORY);
        WarrantId = mGetElementValue (pElement, TAG_WARRANTID);
        ProcessDate = mGetElementValue (pElement, TAG_PROCESSDATE);
        ErrorInd = mGetElementValue (pElement, TAG_ERRORIND);
        ProcessStage = mGetElementValue (pElement, TAG_PROCESSSTAGE);
        HrgSeq = mGetElementValue (pElement, TAG_HRGSEQ);
        AldDebtSeq = mGetElementValue (pElement, TAG_ALDDEBTSEQ);
        CreatingCourt = mGetElementValue (pElement, TAG_CREATINGCOURT);
        CreatingSection = mGetElementValue (pElement, TAG_CREATINGSECTION);
    } // CoEventXMLBuilder()

    /**
     * Constructor which takes the minimal amount of data required to create an event.
     *
     * @param CONumber The co number.
     * @param standardEventId The standard event id.
     * @param eventDate The event date.
     * @param receiptDate The receipt date.
     * @param userName The user name.
     * @param ErrorInd The error indicator.
     */
    public CoEventXMLBuilder (final String CONumber, final String standardEventId, final String eventDate,
            final String receiptDate, final String userName, final String ErrorInd)
    {

        setCONumber (CONumber);
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
     * @param coEventSeq The co event sequence.
     * @param coNumber The co number.
     * @param standardEventId The standard event id.
     * @param eventDetails The event details.
     * @param eventDate The event date.
     * @param userName The user name.
     * @param receiptDate The receipt date.
     * @param stage The stage.
     * @param service The service.
     * @param bailiffId The bailiff id.
     * @param serviceDate The service date.
     * @param errorInd The error indicator.
     * @param bmsTask The bms task.
     * @param statsModule The stats module.
     * @param ageCategory The age category.
     * @param warrantId The warrant id.
     * @param processDate The process date.
     * @param hrgSeq The hearing sequence.
     * @param aldDebtSeq The debt sequence number.
     */
    public CoEventXMLBuilder (final String coEventSeq, final String coNumber, final String standardEventId,
            final String eventDetails, final String eventDate, final String userName, final String receiptDate,
            final String stage, final String service, final String bailiffId, final String serviceDate,
            final String errorInd, final String bmsTask, final String statsModule, final String ageCategory,
            final String warrantId, final String processDate, final String hrgSeq, final String aldDebtSeq)
    {
        super ();

        CoEventSeq = coEventSeq;
        CoNumber = coNumber;
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
        BMSTask = bmsTask;
        StatsModule = statsModule;
        AgeCategory = ageCategory;
        WarrantId = warrantId;
        ProcessDate = processDate;
        HrgSeq = hrgSeq;
        AldDebtSeq = aldDebtSeq;
    }

    /**
     * (non-Javadoc)
     * Get text value of an element if it exists, else return null.
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
     * Set text value of an existing element or create it and set it's value.
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

        if (null == coEventXMLElement)
        {
            element = new Element (pElementName);
        }
        else
        {
            element = (Element) coEventXMLElement.clone ();
            element = (Element) element.detach ();
            element.setName (pElementName);
        }

        mSetElement (element, TAG_COEVENTSEQ, CoEventSeq);
        mSetElement (element, TAG_CONUMBER, CoNumber);
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
        mSetElement (element, TAG_BMSTASK, BMSTask);
        mSetElement (element, TAG_STATSMODULE, StatsModule);
        mSetElement (element, TAG_AGECATEGORY, AgeCategory);
        mSetElement (element, TAG_WARRANTID, WarrantId);
        mSetElement (element, TAG_PROCESSDATE, ProcessDate);
        mSetElement (element, TAG_PROCESSSTAGE, ProcessStage);
        mSetElement (element, TAG_HRGSEQ, HrgSeq);
        mSetElement (element, TAG_ALDDEBTSEQ, AldDebtSeq);
        mSetElement (element, TAG_CREATINGCOURT, CreatingCourt);
        mSetElement (element, TAG_CREATINGSECTION, CreatingSection);

        return element;
    } // getXMLElement()

    /**
     * Gets the CO event seq.
     *
     * @return the CO event seq
     */
    public String getCOEventSeq ()
    {
        return CoEventSeq;
    }

    /**
     * Sets the CO event seq.
     *
     * @param eventSeq the new CO event seq
     */
    public void setCOEventSeq (final String eventSeq)
    {
        CoEventSeq = eventSeq;
    }

    /**
     * Gets the co event XML element.
     *
     * @return the co event XML element
     */
    public Element getCoEventXMLElement ()
    {
        return coEventXMLElement;
    }

    /**
     * Sets the co event XML element.
     *
     * @param coEventXMLElement the new co event XML element
     */
    public void setCoEventXMLElement (final Element coEventXMLElement)
    {
        this.coEventXMLElement = coEventXMLElement;
    }

    /**
     * Gets the CO number.
     *
     * @return the CO number
     */
    public String getCONumber ()
    {
        return CoNumber;
    }

    /**
     * Sets the CO number.
     *
     * @param number the new CO number
     */
    public void setCONumber (final String number)
    {
        CoNumber = number;
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
     * Gets the age category.
     *
     * @return the age category
     */
    public String getAgeCategory ()
    {
        return AgeCategory;
    }

    /**
     * Sets the age category.
     *
     * @param ageCategory the new age category
     */
    public void setAgeCategory (final String ageCategory)
    {
        AgeCategory = ageCategory;
    }

    /**
     * Gets the BMS task.
     *
     * @return the BMS task
     */
    public String getBMSTask ()
    {
        return BMSTask;
    }

    /**
     * Sets the BMS task.
     *
     * @param task the new BMS task
     */
    public void setBMSTask (final String task)
    {
        BMSTask = task;
    }

    /**
     * Gets the co event seq.
     *
     * @return the co event seq
     */
    public String getCoEventSeq ()
    {
        return CoEventSeq;
    }

    /**
     * Sets the co event seq.
     *
     * @param coEventSeq the new co event seq
     */
    public void setCoEventSeq (final String coEventSeq)
    {
        CoEventSeq = coEventSeq;
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

    /**
     * Gets the stats module.
     *
     * @return the stats module
     */
    public String getStatsModule ()
    {
        return StatsModule;
    }

    /**
     * Sets the stats module.
     *
     * @param statsModule the new stats module
     */
    public void setStatsModule (final String statsModule)
    {
        StatsModule = statsModule;
    }

    /**
     * Gets the warrant id.
     *
     * @return the warrant id
     */
    public String getWarrantId ()
    {
        return WarrantId;
    }

    /**
     * Sets the warrant id.
     *
     * @param warrantId the new warrant id
     */
    public void setWarrantId (final String warrantId)
    {
        WarrantId = warrantId;
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
     * Gets the hrg seq.
     *
     * @return the hrg seq
     */
    public String getHrgSeq ()
    {
        return HrgSeq;
    }

    /**
     * Sets the hrg seq.
     *
     * @param hrgSeq the new hrg seq
     */
    public void setHrgSeq (final String hrgSeq)
    {
        HrgSeq = hrgSeq;
    }

    /**
     * Gets the process stage.
     *
     * @return the process stage
     */
    public String getProcessStage ()
    {
        return ProcessStage;
    }

    /**
     * Sets the process stage.
     *
     * @param processStage the new process stage
     */
    public void setProcessStage (final String processStage)
    {
        ProcessStage = processStage;
    }

    /**
     * Gets the creating court.
     *
     * @return the creating court
     */
    public String getCreatingCourt ()
    {
        return CreatingCourt;
    }

    /**
     * Sets the creating court.
     *
     * @param creatingCourt the new creating court
     */
    public void setCreatingCourt (final String creatingCourt)
    {
        CreatingCourt = creatingCourt;
    }

    /**
     * Gets the creating section.
     *
     * @return the creating section
     */
    public String getCreatingSection ()
    {
        return CreatingSection;
    }

    /**
     * Sets the creating section.
     *
     * @param creatingSection the new creating section
     */
    public void setCreatingSection (final String creatingSection)
    {
        CreatingSection = creatingSection;
    }
} // class CoEventXMLBuilder
