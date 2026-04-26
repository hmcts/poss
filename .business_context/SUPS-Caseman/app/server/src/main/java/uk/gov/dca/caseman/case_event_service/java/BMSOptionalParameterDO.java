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

import java.util.Iterator;
import java.util.List;

import org.jdom.Element;

/**
 * Created on 15-Feb-2005.
 *
 * @author nzwq68
 */
public class BMSOptionalParameterDO
{
    
    /** The Applicant type. */
    private boolean ApplicantType;
    
    /** The Hearing type. */
    private boolean HearingType;
    
    /** The Hearing flag. */
    private boolean HearingFlag;
    
    /** The Issue. */
    private boolean Issue;
    
    /** The Applicant response. */
    private boolean ApplicantResponse;
    
    /** The AE event id. */
    private boolean AEEventId;
    
    /** The Event type. */
    private boolean EventType;
    
    /** The Listing type. */
    private boolean ListingType;
    
    /** The Coded party. */
    private boolean CodedParty;

    /**
     * Constructor.
     *
     * @param pBMSElement the BMS element
     */
    public BMSOptionalParameterDO (final Element pBMSElement)
    {
        List<Element> elementList = null;
        Element paramTypeElement = null;
        String elementText = null;

        try
        {
            elementList = pBMSElement.getChildren ();
            for (Iterator<Element> i = elementList.iterator (); i.hasNext ();)
            {
                paramTypeElement = (Element) i.next ();
                elementText = paramTypeElement.getText ().trim ();
                if (elementText.equalsIgnoreCase ("ApplicantType"))
                {
                    ApplicantType = true;
                }
                else if (elementText.equalsIgnoreCase ("HearingType"))
                {
                    HearingType = true;
                }
                else if (elementText.equalsIgnoreCase ("HearingFlag"))
                {
                    HearingFlag = true;
                }
                else if (elementText.equalsIgnoreCase ("Issue"))
                {
                    Issue = true;
                }
                else if (elementText.equalsIgnoreCase ("ApplicantResponse"))
                {
                    ApplicantResponse = true;
                }
                else if (elementText.equalsIgnoreCase ("AEEventId"))
                {
                    AEEventId = true;
                }
                else if (elementText.equalsIgnoreCase ("EventType"))
                {
                    EventType = true;
                }
                else if (elementText.equalsIgnoreCase ("ListingType"))
                {
                    ListingType = true;
                }
                else if (elementText.equalsIgnoreCase ("CodedParty"))
                {
                    CodedParty = true;
                }
            }
        }
        finally
        {
            elementList = null;
            paramTypeElement = null;
            elementText = null;
        }

    } // BMSOptionalParameterDO()

    /**
     * Checks if is applicant type required.
     *
     * @return true, if is applicant type required
     */
    public boolean isApplicantTypeRequired ()
    {
        return ApplicantType;
    }

    /**
     * Checks if is hearing type required.
     *
     * @return true, if is hearing type required
     */
    public boolean isHearingTypeRequired ()
    {
        return HearingType;
    }

    /**
     * Checks if is hearing flag required.
     *
     * @return true, if is hearing flag required
     */
    public boolean isHearingFlagRequired ()
    {
        return HearingFlag;
    }

    /**
     * Checks if is issue required.
     *
     * @return true, if is issue required
     */
    public boolean isIssueRequired ()
    {
        return Issue;
    }

    /**
     * Checks if is applicant response required.
     *
     * @return true, if is applicant response required
     */
    public boolean isApplicantResponseRequired ()
    {
        return ApplicantResponse;
    }

    /**
     * Checks if is AE event id required.
     *
     * @return true, if is AE event id required
     */
    public boolean isAEEventIdRequired ()
    {
        return AEEventId;
    }

    /**
     * Checks if is event type required.
     *
     * @return true, if is event type required
     */
    public boolean isEventTypeRequired ()
    {
        return EventType;
    }

    /**
     * Checks if is listing type required.
     *
     * @return true, if is listing type required
     */
    public boolean isListingTypeRequired ()
    {
        return ListingType;
    }

    /**
     * Checks if is coded party required.
     *
     * @return true, if is coded party required
     */
    public boolean isCodedPartyRequired ()
    {
        return CodedParty;
    }

} // class BMSOptionalParameterDO
