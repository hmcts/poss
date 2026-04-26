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
package uk.gov.dca.caseman.bms_service.java.bmsrules.impl;

import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRule;
import uk.gov.dca.db.exception.SystemException;

/**
 * Created on 09-Mar-2005
 *
 * Change History:
 * 15-May-2006 Phil Haferer (EDS): Refactor of exception handling. Defect 2689.
 * 
 * @author Amjad Khan
 */
public class BMSRule implements IBMSRule, Comparable<IBMSRule>
{
    
    /** The Constant BMSRULE_TAG. */
    private static final String BMSRULE_TAG = "BMSRule";
    
    /** The Constant EVENTID_TAG. */
    private static final String EVENTID_TAG = "EventId";
    
    /** The Constant CASETYPE_TAG. */
    private static final String CASETYPE_TAG = "CaseType";
    
    /** The Constant APPLICANTTYPE_TAG. */
    private static final String APPLICANTTYPE_TAG = "ApplicantType";
    
    /** The Constant HEARINGTYPE_TAG. */
    private static final String HEARINGTYPE_TAG = "HearingType";
    
    /** The Constant HEARINGFLAG_TAG. */
    private static final String HEARINGFLAG_TAG = "HearingFlag";
    
    /** The Constant ISSUE_TAG. */
    private static final String ISSUE_TAG = "Issue";
    
    /** The Constant LISTINGTYPE_TAG. */
    private static final String LISTINGTYPE_TAG = "ListingType";
    
    /** The Constant EVENT_TYPE_TAG. */
    private static final String EVENT_TYPE_TAG = "EventType";
    
    /** The Constant APPLICANTRESPONSE_TAG. */
    private static final String APPLICANTRESPONSE_TAG = "ApplicantResponse";
    
    /** The Constant AEEVENTID_TAG. */
    private static final String AEEVENTID_TAG = "AEEventId";
    
    /** The Constant COURT_TYPE_TAG. */
    private static final String COURT_TYPE_TAG = "CourtType";
    
    /** The Constant CODED_PARTY_TAG. */
    private static final String CODED_PARTY_TAG = "CodedParty";
    
    /** The Constant EVENT_TYPE_FLAG_TAG. */
    private static final String EVENT_TYPE_FLAG_TAG = "EventTypeFlag";
    
    /** The Constant CASE_TYPE_CATEGORY_TAG. */
    private static final String CASE_TYPE_CATEGORY_TAG = "CaseTypeCategory";
    
    /** The Constant TASK_TAG. */
    private static final String TASK_TAG = "Task";
    
    /** The Constant BMSTYPE_TAG. */
    private static final String BMSTYPE_TAG = "BMSType";
    
    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The out. */
    private final XMLOutputter out;

    /** The event id. */
    private int eventId;
    
    /** The case type. */
    private String caseType;
    
    /** The applicant type. */
    private String applicantType = "";
    
    /** The hearing type. */
    private String hearingType = "";
    
    /** The hearing flag. */
    private String hearingFlag = "";
    
    /** The issue. */
    private String issue = "";
    
    /** The listing type. */
    private String listingType = "";
    
    /** The event type. */
    private String eventType = "";
    
    /** The applicant response. */
    private String applicantResponse = "";
    
    /** The ae event id. */
    private int aeEventId;
    
    /** The court type. */
    private String courtType = "";
    
    /** The codedparty. */
    private String codedparty = "";
    
    /** The event type flag. */
    private String eventTypeFlag = "";
    
    /** The case type category. */
    private String caseTypeCategory = "";
    
    /** The task. */
    private String task = "";
    
    /** The bms type. */
    private String bmsType = "";
    
    /** The comp arr. */
    private ArrayList<String> compArr;

    /**
     * Constructor.
     * 
     * <BMSRule>
     * <EventID>10</EventID>
     * <BmsSeq>
     * <CaseType>M</CaseType>
     * <ApplicantType/> <!-- ? -->
     * <HearingType/> <!-- ? -->
     * <HearingTypeFlag/> <!-- ? -->
     * <Issue/> <!-- ? -->
     * <ListingType/> <!-- ? -->
     * <EventType/> <!-- ? -->
     * <ApplicantResponse/> <!-- ? -->
     * <AEEventId/> <!-- ? -->
     * <Task/> <!-- ? -->
     * <BmsType/> <!-- ? -->
     * </BmsSeq>
     * </BMSRule>
     *
     * @param eventID the event ID
     * @param caseType the case type
     * @param applicantType the applicant type
     * @param hearingType the hearing type
     * @param hearingFlag the hearing flag
     * @param issue the issue
     * @param listingType the listing type
     * @param eventType the event type
     * @param applicantResponse the applicant response
     * @param aeEventId the ae event id
     * @param courtType the court type
     * @param codedParty the coded party
     * @param eventTypeFlag the event type flag
     * @param caseTypeCategory the case type category
     * @param task the task
     * @param bmsType the bms type
     */
    public BMSRule (final int eventID, final String caseType, final String applicantType, final String hearingType,
            final String hearingFlag, final String issue, final String listingType, final String eventType,
            final String applicantResponse, final int aeEventId, final String courtType, final String codedParty,
            final String eventTypeFlag, final String caseTypeCategory, final String task, final String bmsType)
    {
        setEventId (eventID);
        setCaseType (caseType);
        setApplicantType (applicantType);
        setHearingType (hearingType);
        setHearingFlag (hearingFlag);
        setIssue (issue);
        setListingType (listingType);
        setEventType (eventType);
        setApplicantResponse (applicantResponse);
        setAEEventID (aeEventId);
        setCourtType (courtType);
        setCodedParty (codedParty);
        setEventTypeFlag (eventTypeFlag);
        setCaseTypeCategory (caseTypeCategory);
        setTask (task);
        setBMSType (bmsType);
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * Constructor.
     */
    public BMSRule ()
    {
        out = new XMLOutputter (Format.getCompactFormat ());
        compArr = new ArrayList<String> ();
    }

    /**
     * Sets the event id.
     *
     * @param eventId the new event id
     */
    public void setEventId (final int eventId)
    {
        this.eventId = eventId;
        // NO MATCH AS THIS IS A MANDATORY TYPE
    }

    /**
     * Sets the case type.
     *
     * @param caseType the new case type
     */
    public void setCaseType (final String caseType)
    {
        this.caseType = caseType;
        // NO MATCH AS WE NEED TO CATER FOR ALL CASE TYPES AND THIS IS A MANDATORY TYPE
    }

    /**
     * Sets the applicant type.
     *
     * @param applicantType the new applicant type
     */
    public void setApplicantType (final String applicantType)
    {
        this.applicantType = applicantType;
        addMethodName (applicantType, "getApplicantType");
        ;
    }

    /**
     * Sets the hearing type.
     *
     * @param hearingType the new hearing type
     */
    public void setHearingType (final String hearingType)
    {
        this.hearingType = hearingType;
        addMethodName (hearingType, "getHearingType");
    }

    /**
     * Sets the hearing flag.
     *
     * @param hearingFlag the new hearing flag
     */
    public void setHearingFlag (final String hearingFlag)
    {
        this.hearingFlag = hearingFlag;
        addMethodName (hearingFlag, "getHearingFlag");
    }

    /**
     * Sets the issue.
     *
     * @param issue the new issue
     */
    public void setIssue (final String issue)
    {
        this.issue = issue;
        addMethodName (issue, "getIssue");
    }

    /**
     * Sets the listing type.
     *
     * @param listingType the new listing type
     */
    public void setListingType (final String listingType)
    {
        this.listingType = listingType;
        addMethodName (listingType, "getListingType");
    }

    /**
     * Sets the event type.
     *
     * @param eventType the new event type
     */
    public void setEventType (final String eventType)
    {
        this.eventType = eventType;
        addMethodName (eventType, "getEventType");
    }

    /**
     * Sets the applicant response.
     *
     * @param applicantResponse the new applicant response
     */
    public void setApplicantResponse (final String applicantResponse)
    {
        this.applicantResponse = applicantResponse;
        addMethodName (applicantResponse, "getApplicantResponse");
    }

    /**
     * Sets the AE event ID.
     *
     * @param aeEventId the new AE event ID
     */
    public void setAEEventID (final int aeEventId)
    {
        this.aeEventId = aeEventId;
        addMethodName (aeEventId, "getAEEventID");
    }

    /**
     * Sets the court type.
     *
     * @param courtType the new court type
     */
    public void setCourtType (final String courtType)
    {
        this.courtType = courtType;
        // NO MATCH AS WE NEED TO CATER FOR DIFFERENT COURT TYPES
    }

    /**
     * Sets the coded party.
     *
     * @param codedparty the new coded party
     */
    public void setCodedParty (final String codedparty)
    {
        this.codedparty = codedparty;
        addMethodName (codedparty, "getCodedParty");
    }

    /**
     * Sets the event type flag.
     *
     * @param eventTypeFlag the new event type flag
     */
    public void setEventTypeFlag (final String eventTypeFlag)
    {
        this.eventTypeFlag = eventTypeFlag;
        addMethodName (eventTypeFlag, "getEventTypeFlag");
    }

    /**
     * Sets the case type category.
     *
     * @param caseTypeCategory the new case type category
     */
    public void setCaseTypeCategory (final String caseTypeCategory)
    {
        this.caseTypeCategory = caseTypeCategory;
        addMethodName (caseTypeCategory, "getCaseTypeCategory");
    }

    /**
     * Sets the task.
     *
     * @param task the new task
     */
    public void setTask (final String task)
    {
        this.task = task;
        // NO MATCH AS THIS IS WHATS RETURNED
    }

    /**
     * Sets the BMS type.
     *
     * @param bmsType the new BMS type
     */
    public void setBMSType (final String bmsType)
    {
        this.bmsType = bmsType;
        addMethodName (bmsType, "getBMSType");
    }

    /**
     * {@inheritDoc}
     */
    public int getEventId ()
    {
        return eventId;
    }

    /**
     * {@inheritDoc}
     */
    public String getCaseType ()
    {
        return caseType;
    }

    /**
     * {@inheritDoc}
     */
    public String getApplicantType ()
    {
        return applicantType;
    }

    /**
     * {@inheritDoc}
     */
    public String getHearingType ()
    {
        return hearingType;
    }

    /**
     * {@inheritDoc}
     */
    public String getHearingFlag ()
    {
        return hearingFlag;
    }

    /**
     * {@inheritDoc}
     */
    public String getIssue ()
    {
        return issue;
    }

    /**
     * {@inheritDoc}
     */
    public String getListingType ()
    {
        return listingType;
    }

    /**
     * {@inheritDoc}
     */
    public String getEventType ()
    {
        return eventType;
    }

    /**
     * {@inheritDoc}
     */
    public String getApplicantResponse ()
    {
        return applicantResponse;
    }

    /**
     * {@inheritDoc}
     */
    public int getAEEventId ()
    {
        return aeEventId;
    }

    /**
     * {@inheritDoc}
     */
    public String getAEEventID ()
    {
        return Integer.toString (aeEventId);
    }

    /**
     * {@inheritDoc}
     */
    public String getCourtType ()
    {
        return courtType;
    }

    /**
     * {@inheritDoc}
     */
    public String getCodedParty ()
    {
        return codedparty;
    }

    /**
     * {@inheritDoc}
     */
    public String getEventTypeFlag ()
    {
        return eventTypeFlag;
    }

    /**
     * {@inheritDoc}
     */
    public String getCaseTypeCategory ()
    {
        return caseTypeCategory;
    }

    /**
     * {@inheritDoc}
     */
    public String getTask ()
    {
        return task;
    }

    /**
     * {@inheritDoc}
     */
    public String getBMSType ()
    {
        return bmsType;
    }

    /**
     * (non-Javadoc).
     *
     * @param obj the obj
     * @return true, if successful
     * @see java.lang.Object#equals(java.lang.Object)
     */
    public boolean equals (final Object obj)
    {
        if (obj == this)
        {
            return true;
        }
        else if ( !(obj instanceof BMSRule))
        {
            return false;
        }

        final BMSRule objRule = (BMSRule) obj;
        if (eventId != objRule.eventId)
        {
            return false;
        }
        if (caseType != null && !caseType.equals (objRule.getCaseType ()))
        {
            return false;
        }
        if (applicantType != null && !applicantType.equals (objRule.getApplicantType ()))
        {
            return false;
        }
        if (hearingType != null && !hearingType.equals (objRule.getHearingType ()))
        {
            return false;
        }
        if (hearingFlag != null && !hearingFlag.equals (objRule.getHearingFlag ()))
        {
            return false;
        }
        if (issue != null && !issue.equals (objRule.getIssue ()))
        {
            return false;
        }
        if (listingType != null && !listingType.equals (objRule.getListingType ()))
        {
            return false;
        }
        if (eventType != null && !eventType.equals (objRule.getEventType ()))
        {
            return false;
        }
        if (applicantResponse != null && !applicantResponse.equals (objRule.getApplicantResponse ()))
        {
            return false;
        }
        if (aeEventId != objRule.aeEventId)
        {
            return false;
        }
        if (courtType != null && !courtType.equals (objRule.getCourtType ()))
        {
            return false;
        }
        if (codedparty != null && !codedparty.equals (objRule.getCodedParty ()))
        {
            return false;
        }
        if (eventTypeFlag != null && !eventTypeFlag.equals (objRule.getEventTypeFlag ()))
        {
            return false;
        }
        if (caseTypeCategory != null && !caseTypeCategory.equals (objRule.getCaseTypeCategory ()))
        {
            return false;
        }
        if (bmsType != null && !bmsType.equals (objRule.getBMSType ()))
        {
            return false;
        }
        if (task != null && !task.equals (objRule.getTask ()))
        {
            return false;
        }
        return true;
    }

    /**
     * (non-Javadoc).
     *
     * @param o1 the o 1
     * @return the int
     * @see java.lang.Comparable#compareTo(java.lang.Object)
     */
    public int compareTo (final IBMSRule o1)
    {
        if ( !(o1 instanceof BMSRule))
        {
            throw new ClassCastException ("Object is not of type BMSRule");
        }
        final BMSRule bms = (BMSRule) o1;
        // Keep Commented out code to reverse ordering.
        if (eventId != bms.getEventId ())
        {
            return eventId < bms.getEventId () ? -1 : 1;
        }
        else if (caseType != null && bms.getCaseType () != null && caseType.compareTo (bms.getCaseType ()) != 0)
        {
            // return caseType.compareTo(bms.getCaseType());
            return bms.getCaseType ().compareTo (caseType);
        }
        else if (applicantType != null && bms.getApplicantType () != null &&
                applicantType.compareTo (bms.getApplicantType ()) != 0)
        {
            // return applicantType.compareTo(bms.getApplicantType());
            return bms.getApplicantType ().compareTo (applicantType);
        }
        else if (hearingType != null && bms.getHearingType () != null &&
                hearingType.compareTo (bms.getHearingType ()) != 0)
        {
            // return hearingType.compareTo(bms.getHearingType());
            return bms.getHearingType ().compareTo (hearingType);
        }
        else if (hearingFlag != null && bms.getHearingFlag () != null &&
                hearingFlag.compareTo (bms.getHearingFlag ()) != 0)
        {
            // return hearingFlag.compareTo(bms.getHearingFlag());
            return bms.getHearingFlag ().compareTo (hearingFlag);
        }
        else if (issue != null && bms.getIssue () != null && issue.compareTo (bms.getIssue ()) != 0)
        {
            // return issue.compareTo(bms.getIssue());
            return bms.getIssue ().compareTo (issue);
        }
        else if (listingType != null && bms.getListingType () != null &&
                listingType.compareTo (bms.getListingType ()) != 0)
        {
            // return listingType.compareTo(bms.getListingType());
            return bms.getListingType ().compareTo (listingType);
        }
        else if (applicantResponse != null && bms.getApplicantResponse () != null &&
                applicantResponse.compareTo (bms.getApplicantResponse ()) != 0)
        {
            // return applicantResponse.compareTo(bms.getApplicantResponse());
            return bms.getApplicantResponse ().compareTo (applicantResponse);
        }
        else if (eventType != null && bms.getEventType () != null && eventType.compareTo (bms.getEventType ()) != 0)
        {
            // return eventType.compareTo(bms.getEventType());
            return bms.getEventType ().compareTo (eventType);
        }
        else if (aeEventId != bms.getAEEventId ())
        {
            // return aeEventId < bms.getAEEventId() ? -1 : 1;
            return bms.getAEEventId () < bms.aeEventId ? -1 : 1;
        }
        else if (courtType != null && bms.getCourtType () != null && courtType.compareTo (bms.getCourtType ()) != 0)
        {
            // return courtType.compareTo(bms.getCourtType());
            return bms.getCourtType ().compareTo (courtType);
        }
        else if (codedparty != null && bms.getCodedParty () != null && codedparty.compareTo (bms.getCodedParty ()) != 0)
        {
            // return codedparty.compareTo(bms.getCodedParty());
            return bms.getCodedParty ().compareTo (codedparty);
        }
        else if (eventTypeFlag != null && bms.getEventTypeFlag () != null &&
                eventTypeFlag.compareTo (bms.getEventTypeFlag ()) != 0)
        {
            // return eventTypeFlag.compareTo(bms.getEventTypeFlag());
            return bms.getEventTypeFlag ().compareTo (eventTypeFlag);
        }
        else if (caseTypeCategory != null && bms.getCaseTypeCategory () != null &&
                caseTypeCategory.compareTo (bms.getCaseTypeCategory ()) != 0)
        {
            // return caseTypeCategory.compareTo(bms.getCaseTypeCategory());
            return bms.getCaseTypeCategory ().compareTo (caseTypeCategory);
        }
        else if (bmsType != null && bms.getBMSType () != null && bmsType.compareTo (bms.getBMSType ()) != 0)
        {
            // return bmsType.compareTo(bms.getBMSType());
            return bms.getBMSType ().compareTo (bmsType);
        }
        else if (task != null && bms.getTask () != null && task.compareTo (bms.getTask ()) != 0)
        {
            // return task.compareTo(bms.getTask()); // No need to order
            return task.compareTo (bms.getTask ());
        }
        return 0;
    }

    /**
     * (non-Javadoc).
     *
     * @return the int
     * @see java.lang.Object#hashCode()
     */
    public int hashCode ()
    {

        int result = 17;
        result = 37 * result + eventId;
        if (caseType != null)
        {
            result = 37 * result + caseType.hashCode ();
        }
        if (applicantType != null)
        {
            result = 37 * result + applicantType.hashCode ();
        }
        if (hearingType != null)
        {
            result = 37 * result + hearingType.hashCode ();
        }
        if (hearingFlag != null)
        {
            result = 37 * result + hearingFlag.hashCode ();
        }
        if (issue != null)
        {
            result = 37 * result + issue.hashCode ();
        }
        if (listingType != null)
        {
            result = 37 * result + listingType.hashCode ();
        }
        if (applicantResponse != null)
        {
            result = 37 * result + applicantResponse.hashCode ();
        }
        if (eventType != null)
        {
            result = 37 * result + eventType.hashCode ();
        }
        result = 37 * result + aeEventId;
        if (courtType != null)
        {
            result = 37 * result + courtType.hashCode ();
        }
        if (codedparty != null)
        {
            result = 37 * result + codedparty.hashCode ();
        }
        if (eventTypeFlag != null)
        {
            result = 37 * result + eventTypeFlag.hashCode ();
        }
        if (caseTypeCategory != null)
        {
            result = 37 * result + caseTypeCategory.hashCode ();
        }
        if (task != null)
        {
            result = 37 * result + task.hashCode ();
        }
        if (bmsType != null)
        {
            result = 37 * result + bmsType.hashCode ();
        }
        return result;
    }

    /**
     * (non-Javadoc).
     *
     * @return the string
     * @throws SystemException the system exception
     * @see uk.gov.dca.caseman.bms_service.java.bmsrules.IBMSRule#toXML()
     */
    public String toXML () throws SystemException
    {
        final StringBuffer strBuf = new StringBuffer ();
        addXMLTag (strBuf, BMSRULE_TAG, false);
        addXMLTagValues (strBuf, Integer.toString (eventId), EVENTID_TAG);
        addXMLTagValues (strBuf, caseType, CASETYPE_TAG);
        addXMLTagValues (strBuf, applicantType, APPLICANTTYPE_TAG);
        addXMLTagValues (strBuf, hearingType, HEARINGTYPE_TAG);
        addXMLTagValues (strBuf, hearingFlag, HEARINGFLAG_TAG);
        addXMLTagValues (strBuf, issue, ISSUE_TAG);
        addXMLTagValues (strBuf, listingType, LISTINGTYPE_TAG);
        addXMLTagValues (strBuf, applicantResponse, APPLICANTRESPONSE_TAG);
        addXMLTagValues (strBuf, eventType, EVENT_TYPE_TAG);
        addXMLTagValues (strBuf, Integer.toString (aeEventId), AEEVENTID_TAG);
        addXMLTagValues (strBuf, courtType, COURT_TYPE_TAG);
        addXMLTagValues (strBuf, codedparty, CODED_PARTY_TAG);
        addXMLTagValues (strBuf, eventTypeFlag, EVENT_TYPE_FLAG_TAG);
        addXMLTagValues (strBuf, caseTypeCategory, CASE_TYPE_CATEGORY_TAG);
        addXMLTagValues (strBuf, task, TASK_TAG);
        addXMLTagValues (strBuf, bmsType, BMSTYPE_TAG);
        addXMLTag (strBuf, BMSRULE_TAG, true);
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return out.outputString (builder.build (new StringReader (strBuf.toString ())).getRootElement ());
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
    }

    /**
     * (non-Javadoc).
     *
     * @return the string
     * @see java.lang.Object#toString()
     */
    public String toString ()
    {
        return "[" + BMSRULE_TAG + " OBJECT = \n" + EVENTID_TAG + " = " + eventId + "," + CASETYPE_TAG + " = " +
                caseType + "," + APPLICANTTYPE_TAG + " = " + applicantType + "," + HEARINGTYPE_TAG + " = " +
                hearingType + "," + HEARINGFLAG_TAG + " = " + hearingFlag + "," + ISSUE_TAG + " = " + issue + "," +
                LISTINGTYPE_TAG + " = " + listingType + "," + APPLICANTRESPONSE_TAG + " = " + applicantResponse + "," +
                EVENT_TYPE_TAG + " = " + eventType + "," + AEEVENTID_TAG + " = " + aeEventId + "," + COURT_TYPE_TAG +
                " = " + courtType + "," + CODED_PARTY_TAG + " = " + codedparty + "," + EVENT_TYPE_FLAG_TAG + " = " +
                eventTypeFlag + "," + CASE_TYPE_CATEGORY_TAG + " = " + caseTypeCategory + "," + TASK_TAG + " = " +
                task + "," + BMSTYPE_TAG + " = " + bmsType + " ]";
    }

    /**
     * Adds the XML tag values.
     *
     * @param strBuf the str buf
     * @param val the val
     * @param constant the constant
     */
    private void addXMLTagValues (final StringBuffer strBuf, final String val, final String constant)
    {
        addXMLTag (strBuf, constant, false);
        strBuf.append (val);
        addXMLTag (strBuf, constant, true);
    }

    /**
     * Adds the XML tag.
     *
     * @param strBuf the str buf
     * @param constant the constant
     * @param endTag the end tag
     */
    private void addXMLTag (final StringBuffer strBuf, final String constant, final boolean endTag)
    {
        strBuf.append (STARTTAG);
        if (endTag)
        {
            strBuf.append (SLASH);
        }
        strBuf.append (constant);
        strBuf.append (ENDTAG);
    }

    /**
     * Adds the method to compare.
     *
     * @param methodName the method name
     */
    private void addMethodToCompare (final String methodName)
    {
        compArr.add (methodName);
    }

    /**
     * {@inheritDoc}
     */
    public List<String> getComparableValues ()
    {
        return compArr;
    }

    /**
     * Checks if is empty.
     *
     * @param s the s
     * @return true, if is empty
     */
    private boolean isEmpty (final String s)
    {
        return s == null || "".equals (s);
    }

    /**
     * Adds the method name.
     *
     * @param strVar the str var
     * @param methodName the method name
     */
    private void addMethodName (final String strVar, final String methodName)
    {
        if ( !isEmpty (strVar))
        {
            addMethodToCompare (methodName);
        }
    }

    /**
     * Adds the method name.
     *
     * @param intVar the int var
     * @param methodName the method name
     */
    private void addMethodName (final int intVar, final String methodName)
    {
        if (intVar != 0)
        {
            addMethodToCompare (methodName);
        }
    }
}
