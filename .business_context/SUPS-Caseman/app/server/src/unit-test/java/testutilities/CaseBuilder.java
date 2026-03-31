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

import org.jdom.Document;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

/**
 * This class provides methods to add cases to the database.
 * 
 * A default case is provided.
 * 
 * When the case is set up it is possible to provide a reference date
 * in the format "yyyy-MM-dd" which should refer to the date against which the test data
 * was originally run. The database date is normally closely in step with the actual date
 * and so test data may provide different results over time. Normally a solution is to
 * alter the system date on the test box during the test but this is not possible with
 * many people sharing the same test database. This class provides another way to keep dates
 * roughly in line. The reference date is used (when supplied) to alter all the test data as
 * follows:
 * <p>
 * The difference in days between the reference date and the system date is calculated
 * each test data date encountered is aged by the same amount so test dates will remain in step
 * with the system date. This date change is dynamic and non-permanant. All expected test date
 * results should be similarly aged by the Timewarper class.
 * 
 */
public class CaseBuilder extends DataBuilder
{
    /**
     * This method will set up a default case with no particular date modifications.
     *
     * @return Document the case that has been created on the database
     */
    public static Document setUpCase ()
    {
        return setUpCase (null);
    }

    /**
     * This method will set up a default case with a supplied date modification.
     *
     * @param referenceDate a String date (yyyy-MM-dd) which is used to modify all test dates
     * 
     * @return Document the case that has been created on the database
     */
    public static Document setUpCase (final String referenceDate)
    {
        return setUpCase (GENERIC_CASE_FILE, referenceDate);
    }

    /**
     * This method will set up a case with a supplied date modification.
     *
     * @param theXMLCaseFile a String containing a qualified filename containing a case in xml format.
     * @param referenceDate a String date (yyyy-MM-dd) which is used to modify all test dates
     * @return Document the case that has been created on the database
     */
    public static Document setUpCase (final String theXMLCaseFile, final String referenceDate)
    {
        // Add the case to the database
        String theXMLCase = extractFileContents (theXMLCaseFile);
        if (referenceDate != null)
        {
            theXMLCase = age (theXMLCase, referenceDate);
        }

        final String params = ParamBuilder.buildParams ("caseNumber", theXMLCase);
        final String resultXML = callService ("Case", "addCase", params);
        CASE_NUMBER =
                resultXML.substring (resultXML.indexOf ("<CaseNumber>") + 12, resultXML.indexOf ("</CaseNumber>"));
        IS_CASE = true;
        final Document d = buildDoc (resultXML);
        try
        {
            CASE_EVENT_SEQ = XPath.newInstance ("//WordProcessing//Event//CaseEventSeq").valueOf (d);
        }
        catch (final JDOMException e)
        {
            e.printStackTrace ();
        }
        return d;
    }
}
