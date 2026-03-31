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

import java.util.ArrayList;

/**
 * The Class AssertBuilder.
 */
public class AssertBuilder
{
    
    /** The tags. */
    public static ArrayList<String> tags = new ArrayList<String> ();
    
    /** The expected results. */
    public static ArrayList<String> expectedResults = new ArrayList<String> ();
    
    /** The actual results. */
    public static ArrayList<String> actualResults = new ArrayList<String> ();
    
    /** The count. */
    private static int count;

    /**
     * Builds the results.
     *
     * @param expected the expected
     * @param actuals the actuals
     */
    public static void buildResults (String expected, final String actuals)
    {
        String startTag;
        String nextTag;
        int endTag;
        int endStartTag;
        int startNextTag;
        int endNextTag;
        final String expectedResult;
        final String actualResult;
        int innercount = 0;
        while (true)
        {
            endStartTag = expected.indexOf (">");
            if (endStartTag == -1 || endStartTag + 1 == expected.length ())
            {
                break;
            }
            startTag = expected.substring (expected.indexOf ("<"), endStartTag + 1);
            expected = expected.substring (expected.indexOf (">") + 1);
            startNextTag = expected.indexOf ("<");
            endNextTag = expected.indexOf (">");
            nextTag = expected.substring (startNextTag, endNextTag + 1);
            endTag = expected.indexOf ("</" + startTag.substring (1, startTag.length () - 1));
            if (endTag == startNextTag)
            {
                tags.add (innercount, startTag);
                expectedResults.add (innercount, expected.substring (0, endTag));
                innercount++;
                expected = expected.substring (endNextTag + 1);
            }
        }
        innercount = 0;
        int startTagEnd;
        int endTagStart;
        final int numOfTags = tags.size ();
        while (true)
        {
            if (innercount + 1 > numOfTags)
            {
                break;
            }
            startTag = (String) tags.get (innercount);
            startTagEnd = actuals.indexOf (startTag) + startTag.length ();
            endTagStart = actuals.indexOf ("</" + startTag.substring (1, startTag.length ()));
            actualResults.add (innercount, actuals.substring (startTagEnd, endTagStart));
            innercount++;
        }
    }

    /**
     * Gets the next msg.
     *
     * @return the next msg
     */
    public static String getNextMsg ()
    {
        if (tags == null || count == tags.size ())
        {
            return null;
        }
        return "Value of tag:" + (String) tags.get (count++);
    }

    /**
     * Gets the next expected.
     *
     * @return the next expected
     */
    public static String getNextExpected ()
    {
        if (expectedResults == null || count == expectedResults.size ())
        {
            return null;
        }
        return (String) expectedResults.get (count);
    }

    /**
     * Gets the next actual.
     *
     * @return the next actual
     */
    public static String getNextActual ()
    {
        if (actualResults == null || count == actualResults.size ())
        {
            return null;
        }
        return (String) actualResults.get (count);
    }

    /**
     * Empty array lists.
     */
    public static void emptyArrayLists ()
    {
        tags.clear ();
        expectedResults.clear ();
        actualResults.clear ();
    }
}
