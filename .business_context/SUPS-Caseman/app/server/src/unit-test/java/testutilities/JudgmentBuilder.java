/* This builds judgments onto the database */
package testutilities;

import org.jdom.Document;

/**
 * This class provides methods to add judgments to the database.
 * 
 * A default judgment and associated case are provided.
 * 
 * When the judgment is set up it is possible to provide a reference date
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
public class JudgmentBuilder extends DataBuilder
{
    /**
     * This method will set up a default judgment
     * and a default case with no particular date modifications.
     *
     * @return Document[] the judgment that has been created on the database
     */
    public static Document setUpJudgment ()
    {
        return setUpJudgment (null);
    }

    /**
     * This method will set up a default judgment
     * and a default case with a supplied date modification.
     *
     * @param referenceDate a String date (yyyy-MM-dd) which is used to modify all test dates.
     *
     * @return Document[] the judgment that has been created on the database
     */
    public static Document setUpJudgment (final String referenceDate)
    {
        return setUpJudgment (GENERIC_JUDGMENT_FILE, referenceDate);
    }

    /**
     * This method will set up a judgment
     * and a default case with a supplied date modification.
     *
     * @param theJudgmentXMLFile a String with a qualified filename containing the judgment
     * @param referenceDate a String date (yyyy-MM-dd) which is used to modify all test dates.
     * @return Document[] the judgment that has been created on the database
     */
    public static Document setUpJudgment (final String theJudgmentXMLFile, final String referenceDate)
    {
        return setUpJudgment (theJudgmentXMLFile, GENERIC_CASE_FILE, referenceDate);
    }

    /**
     * This method will set up a judgment
     * and a case with a supplied date modification.
     *
     * @param theJudgmentXMLFile a String with a qualified filename containing the judgment
     * @param theXMLCaseFile a String with a qualified filename containing the case
     * @param referenceDate a String date (yyyy-MM-dd) which is used to modify all test dates.
     * @return Document[] the judgment that has been created on the database
     */
    public static Document setUpJudgment (final String theJudgmentXMLFile, final String theXMLCaseFile,
                                          final String referenceDate)
    {
        if ( !IS_CASE)
        {
            CaseBuilder.setUpCase (theXMLCaseFile, referenceDate);
            IS_CASE = true;
        }
        String theXMLJudgment = extractFileContents (theJudgmentXMLFile);
        if (referenceDate != null)
        {
            theXMLJudgment = age (theXMLJudgment, referenceDate);
        }
        final String params = ParamBuilder.buildParams ("JudgmentSequence", theXMLJudgment);
        final String resultXML = callService ("Judgment", "maintainJudgment", params);
        return buildDoc (resultXML);
    }
}
