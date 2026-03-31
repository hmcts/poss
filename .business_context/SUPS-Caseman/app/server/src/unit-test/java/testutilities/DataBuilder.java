/* This is the base class which is extended by CaseBuilder, JudgmentBuilder, ObligationBuilder
 * This class provides methods to read files / build xml Documents and utilities to remove xml
 * coding from strings.
 *
 * The test classes can also use this class as it is normal that they will need to open and
 * manipulate xml files as well. */
package testutilities;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.Reader;
import java.io.StringReader;
import java.io.StringWriter;
import java.net.MalformedURLException;
import java.rmi.RemoteException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.rpc.ServiceException;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.jdom.Document;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

/**
 * This class provides utility methods to read xml files and mutate strings containing xml and create Document objects.
 * 
 * <p>
 * This class is extended by CaseBuilder, JudgmentBuilder, ObligationBuilder.
 * 
 * 
 */
public class DataBuilder
{
    
    /** The url. */
    private static String URL = "http://localhost:8080/caseman/";
    
    /** The case number. */
    public static String CASE_NUMBER;
    
    /** The is case. */
    protected static boolean IS_CASE = false;
    
    /** The case event seq. */
    protected static String CASE_EVENT_SEQ;
    
    /** The replace event seq regex. */
    protected static String REPLACE_EVENT_SEQ_REGEX = "REPLACE_EVENT_SEQ";
    
    /** The Constant REPLACE_OBLIGATION_SEQ_REGEX. */
    protected static final String REPLACE_OBLIGATION_SEQ_REGEX = "REPLACE_OBLIGATION_SEQ";
    
    /** The Constant REPLACE_NOTES_REGEX. */
    protected static final String REPLACE_NOTES_REGEX = "REPLACE_NOTES";
    
    /** The Constant GENERIC_CASE_FILE. */
    protected static final String GENERIC_CASE_FILE = "test/genericCase.xml";
    
    /** The Constant GENERIC_EVENT_FILE. */
    protected static final String GENERIC_EVENT_FILE = "test/genericEvents.xml";
    
    /** The Constant GENERIC_OBLIGATION_FILE. */
    protected static final String GENERIC_OBLIGATION_FILE = "test/obligationtestdata/genericObligations";
    
    /** The Constant GENERIC_JUDGMENT_FILE. */
    protected static final String GENERIC_JUDGMENT_FILE = "test/genericJudgment.xml";
    
    /** The Constant GENERIC_BMS_FILE. */
    protected static final String GENERIC_BMS_FILE = "test/genericBMS.xml";
    
    /** The Constant DATE_REGEXP. */
    private static final String DATE_REGEXP = "\\d\\d\\d\\d-\\d\\d-\\d\\d";
    
    /** The Constant ADATE. */
    private static final Pattern ADATE = Pattern.compile (DATE_REGEXP);
    
    /** The date finder. */
    private static Matcher DATE_FINDER;
    
    /** The format date. */
    private static SimpleDateFormat formatDate = new SimpleDateFormat ("yyyy-MM-dd");
    
    /** The Constant SEC_IN_DAY. */
    private static final long SEC_IN_DAY = 86400000L;

    /**
     * This method will extract the contents of file as a string.
     *
     * @param fileDir a String filedirectory realtive to DataBuilder
     * @param fileName a String containing a filename.
     * @return String the contents og the file
     */
    public static String extractFileContents (final String fileDir, final String fileName)
    {
        return extractFileContents (fileDir + "/" + fileName);
    }

    /**
     * This method will extract the contents of file as a string.
     *
     * @param fileName a String containing a qualified filename.
     * @return String the contents og the file
     */
    public static String extractFileContents (final String fileName)
    {
        final File file = new File (fileName);
        if (file.exists () && file.isFile () && file.canRead ())
        {
            try
            {
                final FileInputStream fileInputStream = new FileInputStream (file);
                final StringWriter out = new StringWriter (fileInputStream.available ());
                while (fileInputStream.available () != 0)
                {
                    out.write (fileInputStream.read ());
                }
                return out.toString ();
            }
            catch (final IOException e)
            {
                System.out.println ("Failed to read parameter file: " + e.getMessage ());
            }
        }
        else
        {
            System.out.println ("Could not read parameter file: " + file.toString ());
        }
        return null;
    }

    /**
     * This method will call the specified method within the service and this will provide a return value.
     *
     * @param serviceName a String containing the name of the service.
     * @param method a String containing the name of the method to be called in the service.
     * @param inputParameters a String containing all the paarmeters required for the service.
     * @return String the return value of the service (this will be xml.)
     */
    public static String callService (final String serviceName, final String method, final String inputParameters)
    {
        final String endpoint = URL + serviceName + "/" + serviceName + "ServiceServicePort";
        final Service service = new Service ();
        final Call call;
        try
        {
            call = (Call) service.createCall ();
            call.setTargetEndpointAddress (new java.net.URL (endpoint));
            call.setOperationName (method);
            call.setUsername ("nobody");
            call.setPassword ("test");
            call.setTimeout (new Integer (120000));
            return (String) call.invoke (new Object[] {"mark", "", inputParameters});
        }
        catch (final ServiceException e)
        {
            System.out.println ("DataBuilder.callService - Problem calling service:");
            e.printStackTrace ();
        }
        catch (final MalformedURLException e)
        {
            System.out.println ("DataBuilder.callService - The URl was incorrectly formed:");
            e.printStackTrace ();
        }
        catch (final RemoteException e)
        {
            System.out.println ("DataBuilder.callService - Remote Error:");
            e.printStackTrace ();
        }
        return null;
    }

    /**
     * This method will build a Document from a Reader stream.
     *
     * @param in a Reader - this should be reading a stream of xml.
     * @return Document read from the stream.
     */
    public static Document buildDoc (final Reader in)
    {
        final SAXBuilder b = new SAXBuilder ();
        try
        {
            return b.build (in);
        }
        catch (final JDOMException e)
        {
            System.out.println ("DataBuilder.buildDoc - System unable to build document:");
            e.printStackTrace ();
        }
        catch (final IOException e)
        {
            System.out.println ("DataBuilder.buildDoc - System error in io stream:");
            e.printStackTrace ();
        }
        return null;
    }

    /**
     * This method will build a Document from a String of xml.
     *
     * @param xml a String - this should be in xml format.
     * @return Document read from the string.
     */
    public static Document buildDoc (final String xml)
    {
        return buildDoc (new StringReader (xml));
    }

    /**
     * This method will build a Document from a Stringwriter.
     *
     * @param out a StringWriter.
     * @return Document read from out stream.
     */
    public static Document buildDoc (final StringWriter out)
    {
        return buildDoc (new StringReader (out.toString ()));
    }

    /**
     * This method will remove \r,\t and \n from the string arguement.
     *
     * @param dirty a String which will be searched for \r,\t and \n.
     * @return String a new string with the \r,\t and \n values removed.
     */
    public static String cleanString (final String dirty)
    {
        return dirty.replaceAll ("\r", "").replaceAll ("\t", "").replaceAll ("\n", "");
    }

    /**
     * Removes the beginning xml tag between "<?...?>"
     *
     * @param tagged String to have any <?..?> tag removed
     * @return String new string with <?..?> tag removed.
     */
    public static String removeCodingTag (final String tagged)
    {
        return tagged.substring (tagged.indexOf ("?>") + 2);
    }

    /**
     * Removes spaces from string.
     *
     * @param spaceString String to have any whitespace removed
     * @return String new string with whitespace tag removed.
     */
    public static String removeSpaces (final String spaceString)
    {
        return spaceString.replaceAll (" ", "");
    }

    /**
     * Removes all xml tags and trims whitespace.
     *
     * @param tagged String to have any values between <..> removed
     * @return String new string with values between <..> removed.
     */
    public static String removeTags (String tagged)
    {
        String tag;
        while (true)
        {
            try
            {
                tag = tagged.substring (tagged.indexOf ("<"), tagged.indexOf (">") + 1);
            }
            catch (final StringIndexOutOfBoundsException e)
            {
                break;
            }
            tagged = tagged.replaceAll (tag, "");
        }
        return tagged.trim ();
    }

    /**
     * Removes all traces of the case being tested from the database.
     */
    public static void tearDown ()
    {
        DBAccess.deleteAll (CASE_NUMBER);
    }

    /**
     * Ages all dates contained within the string arguement in the format yyyy-MM-dd
     * according to the number of days between the reference date and the system date.
     *
     * @param ageMe String to have any values between <..> removed
     * @param referenceDate the reference date
     * @return String new string with date values aged.
     */
    public static String age (final String ageMe, final String referenceDate)
    {
        DATE_FINDER = ADATE.matcher (ageMe);
        final StringBuffer theString = new StringBuffer ();
        final int daysToAge = calculateDaysToAge (referenceDate);
        while (DATE_FINDER.find ())
        {
            DATE_FINDER.appendReplacement (theString, Timewarper.warpTime (DATE_FINDER.group (), daysToAge));
        }
        DATE_FINDER.appendTail (theString);
        return theString.toString ();
    }

    /**
     * Calculates the number of days between the referenceDate and the system date.
     *
     * @param referenceDate the reference date
     * @return int new number of days between the reference date and the system date.
     */
    private static int calculateDaysToAge (final String referenceDate)
    {
        final String params = ParamBuilder.buildParams ("", "");
        String theCurrentDate = callService ("SystemDate", "getSystemDate", params);
        theCurrentDate = removeCodingTag (theCurrentDate);
        theCurrentDate = removeSpaces (theCurrentDate);
        theCurrentDate = removeTags (theCurrentDate);
        try
        {
            final long theDiff =
                    formatDate.parse (theCurrentDate).getTime () - formatDate.parse (referenceDate).getTime ();
            return (int) (theDiff / SEC_IN_DAY);
        }
        catch (final ParseException e)
        {
            e.printStackTrace ();
        }
        return 0;
    }

    /**
     * Utility method to remove \n\r\t and any tags.
     *
     * @param unShaven String to have any values between <..> and \n\r\t removed
     * @return String new string with <..> and \n\r\t removed.
     */
    public static String stripAll (final String unShaven)
    {
        return removeTags (removeCodingTag (cleanString (unShaven)));
    }
}
