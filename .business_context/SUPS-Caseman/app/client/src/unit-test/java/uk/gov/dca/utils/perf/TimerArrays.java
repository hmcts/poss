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

import java.util.ArrayList;

/**
 * Created by David Turner. User: Administrator Date: 24-Feb-2009 Time: 14:49:34
 */
public class TimerArrays
{
    
    /** The starttimes. */
    private ArrayList<String> starttimes = new ArrayList<>();
    
    /** The startobjects. */
    private ArrayList<String> startobjects = new ArrayList<>();
    
    /** The endtimes. */
    private ArrayList<String> endtimes = new ArrayList<>();
    
    /** The endobjects. */
    private ArrayList<String> endobjects = new ArrayList<>();

    /** The out. */
    private ResultsFileOutputter out;

    /**
     * Instantiates a new timer arrays.
     *
     * @param fileName the file name
     */
    public TimerArrays (final String fileName)
    {
        out = new ResultsFileOutputter (fileName);
    }

    /**
     * Adds the start.
     *
     * @param item the item
     */
    public void addStart (final String item)
    {
        startobjects.add (startobjects.size (), item);
        starttimes.add (starttimes.size (), String.valueOf (System.currentTimeMillis ()));
    }

    /**
     * Adds the end.
     *
     * @param item the item
     */
    public void addEnd (final String item)
    {
        endobjects.add (startobjects.size (), item);
        endtimes.add (starttimes.size (), String.valueOf (System.currentTimeMillis ()));
    }

    /**
     * Dump.
     */
    public void dump ()
    {
        String item;
        int count;
        long value1;
        long value2;
        for (int i = 0; i < startobjects.size (); i++)
        {
            item = (String) startobjects.get (i);
            value1 = Long.parseLong ((String) starttimes.get (i));
            out.write ("Started " + item + " " + value1 + " mSeconds");
            count = 0;
            while (count < endobjects.size ())
            {
                if (item.equals (endobjects.get (count)))
                {
                    value2 = Long.parseLong ((String) endtimes.get (count));
                    out.write ("Ended " + item + " " + value2 + " mSeconds");
                    out.write ("Total Time For" + item + " " + (value2 - value1) + " mSeconds");
                    break;
                }
                count++;
            }
        }
    }
}
