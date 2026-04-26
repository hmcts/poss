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
package uk.gov.dca.caseman.common.java;

import java.text.ParseException;
import java.util.Calendar;
import java.util.List;

import org.jdom.Element;

/**
 * Class: EventHelper.java
 * 
 * @author Chris Hutt (EDS)
 *         Created: 29 april 2006
 *         Description:
 *         Common methods relating to Events
 * 
 *         Change History:
 * 
 *         v1.0 29/04/06 Chris Hutt
 */
public class EventHelper
{

    /**
     * method: SubstituteChangedEventDescription
     * 
     * This method will substitute the event description applicable at the date when the event was created
     * It will work for Case, Ae and Co events on the basis that each associated map the following common tags
     * 1."StandardEventId"
     * 2."EventDate"
     * 3."StandardEventDescription"
     *
     * @param pRetrievedEventElement the retrieved event element
     * @param pChangedEventListElement the changed event list element
     * @throws ParseException the parse exception
     */
    public void SubstituteChangedEventDescription (final Element pRetrievedEventElement,
                                                   final Element pChangedEventListElement)
        throws ParseException
    {
        Element retrievedEventStandardEventIdElement = null;
        int retrievedEventStandardEventId = 0;
        int listSize = 0;
        int idx = 0;
        boolean searching = false;
        boolean found = false;
        List<Element> changedEventElementList = null;
        Element changedEventElement = null;
        Element standardEventIdElement = null;
        int standardEventId = 0;
        Element retrievedEventEventDateElement = null;
        Element releaseDateElement = null;
        Element finalDateElement = null;
        Element retrievedEventStandardEventDescriptionElement = null;
        Element changedEventDescriptionElement = null;
        Calendar retrievedEventEventDate = null;
        Calendar releaseDate = null;
        Calendar finalDate = null;

        try
        {
            if (null != pChangedEventListElement)
            {
                // Get the Event Id that we are to search for...
                retrievedEventStandardEventIdElement = pRetrievedEventElement.getChild ("StandardEventId");
                retrievedEventStandardEventId = Integer.parseInt (retrievedEventStandardEventIdElement.getText ());

                // Get the Date of the Ae Event row...
                retrievedEventEventDateElement = pRetrievedEventElement.getChild ("EventDate");
                retrievedEventEventDate = CalendarHelper.toCalendar (retrievedEventEventDateElement.getText ());

                // Initialise the iteration over the list 'Changed Events' Descriptions.
                changedEventElementList = pChangedEventListElement.getChildren ();
                if (null != changedEventElementList)
                {
                    listSize = changedEventElementList.size ();
                    idx = 0;

                    searching = true;
                    do
                    {
                        searching = false;
                        if (idx < listSize)
                        {
                            // Get the next Changed Event row...
                            changedEventElement = (Element) changedEventElementList.get (idx);
                            found = false;

                            // Is it one for the current Event Id?
                            standardEventIdElement = changedEventElement.getChild ("StandardEventId");
                            standardEventId = Integer.parseInt (standardEventIdElement.getText ());
                            if (standardEventId == retrievedEventStandardEventId)
                            {
                                // Is it within the date range?
                                releaseDateElement = changedEventElement.getChild ("ReleaseDate");
                                releaseDate = CalendarHelper.toCalendar (releaseDateElement.getText ());
                                if (retrievedEventEventDate.equals (releaseDate))
                                {
                                    found = true;
                                }
                                else if (retrievedEventEventDate.after (releaseDate))
                                {
                                    finalDateElement = changedEventElement.getChild ("FinalDate");
                                    finalDate = CalendarHelper.toCalendar (finalDateElement.getText ());
                                    if (retrievedEventEventDate.before (finalDate))
                                    {
                                        found = true;
                                    }
                                    else if (retrievedEventEventDate.equals (finalDate))
                                    {
                                        found = true;
                                    }
                                }
                                if (found)
                                {
                                    // Substitute the Description.
                                    changedEventDescriptionElement = changedEventElement.getChild ("EventDescription");
                                    retrievedEventStandardEventDescriptionElement =
                                            pRetrievedEventElement.getChild ("StandardEventDescription");
                                    retrievedEventStandardEventDescriptionElement
                                            .setText (changedEventDescriptionElement.getText ());
                                }
                            }

                            if ( !found)
                            {
                                searching = true;
                                idx++;
                            }
                        } // if (idx < listSize)
                    }
                    while (searching);
                } // if (null != changedEventListElementList)
            }
        }
        finally
        {
            retrievedEventStandardEventIdElement = null;
            retrievedEventEventDateElement = null;
            retrievedEventEventDate = null;
            changedEventElementList = null;
            changedEventElementList = null;
            changedEventElement = null;
            standardEventIdElement = null;
            releaseDateElement = null;
            releaseDate = null;
            finalDateElement = null;
            finalDate = null;
            retrievedEventStandardEventDescriptionElement = null;
            changedEventDescriptionElement = null;
        }
    } // SubstituteChangedEventDescriptions()

} // class EventHelper
