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

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Class: CalendarHelper.java
 * 
 * @author Phil Haferer (EDS) 26-Apr-2005
 *         Description:
 *         Provides common functions for manipulation of Dates.
 */
public class CalendarHelper
{

    /** The Constant XML_DATE_FORMAT_PATTERN. */
    private static final String XML_DATE_FORMAT_PATTERN = "yyyy-MM-dd";

    /**
     * Converts the date string to a Calendar object.
     *
     * @param pDateString The date string.
     * @return The calendar object
     * @throws ParseException the parse exception
     */
    public static Calendar toCalendar (final String pDateString) throws ParseException
    {
        return toCalendar (pDateString, XML_DATE_FORMAT_PATTERN);
    } // toCalendar()

    /**
     * Converts the date string to a Calendar object with the passed format.
     *
     * @param pDateString The date string.
     * @param pDateFormat the date format.
     * @return The calendar object
     * @throws ParseException the parse exception
     */
    public static Calendar toCalendar (final String pDateString, final String pDateFormat) throws ParseException
    {
        Calendar calendar = null;
        DateFormat dateFormat = null;
        Date date = null;

        try
        {
            dateFormat = new SimpleDateFormat (pDateFormat);
            date = dateFormat.parse (pDateString);
            calendar = new GregorianCalendar ();
            calendar.setTime (date);
        }
        finally
        {
            dateFormat = null;
            date = null;
        }

        return calendar;
    } // toCalendar()

    /**
     * Returns the passed calendar object as a string.
     * 
     * @param pCalendar The calendar object.
     * @return The date string.
     */
    public static String toString (final Calendar pCalendar)
    {
        return toString (pCalendar, XML_DATE_FORMAT_PATTERN);
    } // toString()

    /**
     * Returns the passed calendar object as a string using the passed date format.
     * 
     * @param pCalendar The calendar object.
     * @param pDateFormat The date format.
     * @return The date string.
     */
    public static String toString (final Calendar pCalendar, final String pDateFormat)
    {
        String sCalendar = null;
        DateFormat dateFormat = null;

        try
        {
            dateFormat = new SimpleDateFormat (pDateFormat);
            sCalendar = dateFormat.format (pCalendar.getTime ());
        }
        finally
        {
            dateFormat = null;
        }

        return sCalendar;
    } // toString()

    /**
     * Returns the difference in days between the two passed dates as a long.
     * 
     * @param pStartDate The start date.
     * @param pEndDate The end date.
     * @return The difference in days.
     */
    public static long differenceDays (final Calendar pStartDate, final Calendar pEndDate)
    {
        final long MILLISECS_PER_MINUTE = 60 * 1000;
        final long MILLISECS_PER_HOUR = 60 * MILLISECS_PER_MINUTE;
        final long MILLISECS_PER_DAY = 24 * MILLISECS_PER_HOUR;

        final long startms =
                pStartDate.getTimeInMillis () + pStartDate.getTimeZone ().getOffset (pStartDate.getTimeInMillis ());
        final long endms =
                pEndDate.getTimeInMillis () + pEndDate.getTimeZone ().getOffset (pEndDate.getTimeInMillis ());

        final long diffms = (endms - startms) / MILLISECS_PER_DAY;

        return diffms;
    } // differenceDays()

} // class CalendarHelper
