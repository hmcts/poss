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
 * TODO LastChangedBy: $ */
package uk.gov.dca.xsl;

import uk.gov.dca.utils.SupsXsltTestBase;
import junit.framework.Test;
import junit.framework.TestSuite;

/**
 * Created By: Chris Vincent
 * Date: 16-Dec-2009
 * Test to compare the output of the CJR040 output XSLT.
 */
public class TestCJR040 extends SupsXsltTestBase
{

    /**
     * Constructor for the TestCJR040 class.
     * 
     * @param testName name of this test.
     */
    public TestCJR040 (final String testName)
    {
        super (testName, "C:/SUPS/build/caseman/reporting_templates/xsl");
    }

    /**
     * Return the suite of tests for this class.
     * 
     * @return the suite of tests for this class.
     */
    public static Test suite ()
    {
        return new TestSuite (TestCJR040.class);
    }

    /**
     * Overrided method returns the opening node of the out files. Method has
     * to be overriden because test is hard coded to search for a <body> node
     * which is specific to FamilyMan.
     *
     * @return String representing the opening node in the out files
     */
    public String getTestStartString ()
    {
        return "<fo:root xmlns:fo=\"http://www.w3.org/1999/XSL/Format\" xmlns:ns0=\"xmlns\" xmlns:supsfo=\"http://eds.com/supsfo\">";
    }

    /**
     * Overrided method returns the closing node of the out files. Method has
     * to be overriden because test is hard coded to search for a </body> node
     * which is specific to FamilyMan.
     *
     * @return String representing the closing node in the out files
     */
    public String getTestCompletedString ()
    {
        return "</fo:root>";
    }

    /**
     * Runs the test XSL Script test harness for the example XSL test.
     */
    public void testCJR040 ()
    {
        runTest ("CJR040-FO.xsl", "CJR040-FO.xml", COMPARE_TO_GOOD);
    }
}
