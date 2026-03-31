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
package uk.gov.dca.utils.perf;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by David Turner. User: Administrator Date: 04-Feb-2009 Time: 13:50:01 Utility class to provide access to maps
 * of times. By recording start and end times and then retrieving the difference in seconds the length of the test can
 * be recorded.
 */
public class Timer
{
    
    /** The start timings. */
    Map<String, Long> theStartTimings = new HashMap<String, Long> ();
    
    /** The end timings. */
    Map<String, Long> theEndTimings = new HashMap<String, Long> ();

    /**
     * Start timing.
     *
     * @param key the key
     */
    public void startTiming (final String key)
    {
        addStartTime (key, getTime ());
    }

    /**
     * End timing.
     *
     * @param key the key
     */
    public void endTiming (final String key)
    {
        addEndTime (key, getTime ());
    }

    /**
     * Adds the start time.
     *
     * @param key the key
     * @param value the value
     */
    private void addStartTime (final String key, final long value)
    {
        theStartTimings.put (key, new Long (value));
    }

    /**
     * Adds the end time.
     *
     * @param key the key
     * @param value the value
     */
    private void addEndTime (final String key, final long value)
    {
        theEndTimings.put (key, new Long (value));
    }

    /**
     * Gets the time.
     *
     * @return the time
     */
    private long getTime ()
    {
        return System.currentTimeMillis ();
    }

    /**
     * Gets the execution time in secs.
     *
     * @param key the key
     * @return the execution time in secs
     */
    public long getExecutionTimeInSecs (final String key)
    {
        return (getEndTime (key) - getStartTime (key)) / 1000;
    }

    /**
     * Gets the start time.
     *
     * @param key the key
     * @return the start time
     */
    private long getStartTime (final String key)
    {
        final Long l = (Long) theStartTimings.get (key);
        return l.longValue ();
    }

    /**
     * Gets the end time.
     *
     * @param key the key
     * @return the end time
     */
    private long getEndTime (final String key)
    {
        final Long l = (Long) theEndTimings.get (key);
        return l.longValue ();
    }
}
