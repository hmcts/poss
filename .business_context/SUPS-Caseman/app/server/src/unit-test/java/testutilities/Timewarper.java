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
package testutilities;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * This class provides methods
 * to alter a date by given number of days.
 * 
 */
public class Timewarper
{
    
    /** Recognises the format "yyyy-MM-dd" only. */
    private static SimpleDateFormat formatDate = new SimpleDateFormat ("yyyy-MM-dd");
    
    /** The number of milliseconds in a day. */
    private static final long dayMillis = 86400000L;

    /**
     * Alters supplied Date by supplied number of days.
     *
     * @param timeToChange a Date to be changed
     * @param skip the number of days to midify the timeToChange date
     * @return Date a new modified Date
     */
    public static Date warpTime (final Date timeToChange, final int skip)
    {
        long currentMillis = timeToChange.getTime ();
        final long changeMillis = dayMillis * skip;
        currentMillis += changeMillis;
        return new Date (currentMillis);
    }

    /**
     * Alters supplied String date(yyyy-MM-dd) by supplied number of days.
     *
     * @param timeToChange a String to be changed
     * @param skip the number of days to midify the timeToChange date
     * @return Date a new modified Date
     */
    public static String warpTime (final String timeToChange, final int skip)
    {
        try
        {
            return formatDate.format (warpTime (formatDate.parse (timeToChange), skip));
        }
        catch (final ParseException e)
        {
            e.printStackTrace ();
        }
        return null;
    }
}
