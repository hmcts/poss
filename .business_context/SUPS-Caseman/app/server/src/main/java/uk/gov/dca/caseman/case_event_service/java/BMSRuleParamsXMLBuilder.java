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
package uk.gov.dca.caseman.case_event_service.java;

import org.jdom.Document;
import org.jdom.Element;

import uk.gov.dca.caseman.common.java.XMLBuilder;

/**
 * Created on 08-Mar-2005
 *
 * Change History:
 * 1. Chris Hutt 27 july 2005 - added eventTypeFlag (mandatory for consolidated order events)
 * 
 * @author nzwq68
 */
public class BMSRuleParamsXMLBuilder
{
    
    /** The Case number. */
    private String CaseNumber = "";
    
    /** The Event id. */
    private String EventId = "";
    
    /** The Case type. */
    private String CaseType = "";
    
    /** The Applicant type. */
    private String ApplicantType = "";
    
    /** The Hearing type. */
    private String HearingType = "";
    
    /** The Hearing flag. */
    private String HearingFlag = "";
    
    /** The Issue. */
    private String Issue = "";
    
    /** The Applicant response. */
    private String ApplicantResponse = "";
    
    /** The AE event id. */
    private String AEEventId = "";
    
    /** The Event type. */
    private String EventType = "";
    
    /** The Event type flag. */
    private String EventTypeFlag = "";
    
    /** The Listing type. */
    private String ListingType = "";
    
    /** The Coded party. */
    private String CodedParty = "";
    
    /** The Task type. */
    private String TaskType = "";
    
    /** The Case type category. */
    private String CaseTypeCategory = "";

    /**
     * Constructor.
     */
    public BMSRuleParamsXMLBuilder ()
    {
    }

    /**
     * Sets the case number.
     *
     * @param CaseNumber the new case number
     */
    public void setCaseNumber (final String CaseNumber)
    {
        this.CaseNumber = CaseNumber;
    }

    /**
     * Sets the event id.
     *
     * @param EventId the new event id
     */
    public void setEventId (final String EventId)
    {
        this.EventId = EventId;
    }

    /**
     * Sets the case type.
     *
     * @param CaseType the new case type
     */
    public void setCaseType (final String CaseType)
    {
        this.CaseType = CaseType;
    }

    /**
     * Sets the applicant type.
     *
     * @param ApplicantType the new applicant type
     */
    public void setApplicantType (final String ApplicantType)
    {
        this.ApplicantType = ApplicantType;
    }

    /**
     * Sets the hearing type.
     *
     * @param HearingType the new hearing type
     */
    public void setHearingType (final String HearingType)
    {
        this.HearingType = HearingType;
    }

    /**
     * Sets the hearing flag.
     *
     * @param HearingFlag the new hearing flag
     */
    public void setHearingFlag (final String HearingFlag)
    {
        this.HearingFlag = HearingFlag;
    }

    /**
     * Sets the issue.
     *
     * @param Issue the new issue
     */
    public void setIssue (final String Issue)
    {
        this.Issue = Issue;
    }

    /**
     * Sets the applicant response.
     *
     * @param ApplicantResponse the new applicant response
     */
    public void setApplicantResponse (final String ApplicantResponse)
    {
        this.ApplicantResponse = ApplicantResponse;
    }

    /**
     * Sets the AE event id.
     *
     * @param AEEventId the new AE event id
     */
    public void setAEEventId (final String AEEventId)
    {
        this.AEEventId = AEEventId;
    }

    /**
     * Sets the event type.
     *
     * @param EventType the new event type
     */
    public void setEventType (final String EventType)
    {
        this.EventType = EventType;
    }

    /**
     * Sets the event type flag.
     *
     * @param EventTypeFlag the new event type flag
     */
    public void setEventTypeFlag (final String EventTypeFlag)
    {
        this.EventTypeFlag = EventTypeFlag;
    }

    /**
     * Sets the listing type.
     *
     * @param ListingType the new listing type
     */
    public void setListingType (final String ListingType)
    {
        this.ListingType = ListingType;
    }

    /**
     * Sets the coded party.
     *
     * @param CodedParty the new coded party
     */
    public void setCodedParty (final String CodedParty)
    {
        this.CodedParty = CodedParty;
    }

    /**
     * Sets the task type.
     *
     * @param TaskType the new task type
     */
    public void setTaskType (final String TaskType)
    {
        this.TaskType = TaskType;
    }

    /**
     * Sets the case type category.
     *
     * @param CaseTypeCategory the new case type category
     */
    public void setCaseTypeCategory (final String CaseTypeCategory)
    {
        this.CaseTypeCategory = CaseTypeCategory;
    }

    /**
     * Gets the XML element.
     *
     * @return the XML element
     */
    public Element getXMLElement ()
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());

        XMLBuilder.addParam (paramsElement, "caseNumber", CaseNumber.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "eventID", EventId.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "caseType", CaseType.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "applicantType", ApplicantType.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "hearingType", HearingType.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "hearingFlag", HearingFlag.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "issue", Issue.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "applicantResponse", ApplicantResponse.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "aeEventId", AEEventId.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "eventType", EventType.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "eventTypeFlag", EventTypeFlag.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "listingType", ListingType.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "codedParty", CodedParty.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "taskType", TaskType.toUpperCase ());
        XMLBuilder.addParam (paramsElement, "caseTypeCategory", CaseTypeCategory.toUpperCase ());

        return paramsElement;
    } // getXMLElement()

} // class BMSRuleParamsXMLBuilder
