import java.io.*;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

/**
 * This parses a text file containing full ClearCase history list of the service
 * method files, in order to produce an XML file containing file creating details
 * suitable for subsequent processing by XSLT.
 * <p>
 * The reason for doing this is so that author information can be automatically
 * included in the Service Catalogue document.
 * <p>
 * <b>Usage</b><br>
 * To generate the input file from the command line:
 * cd ...sups_caseman/server/src/uk/gov/dca/caseman
 * cleartool find . -type f -name *.xml -exec "cleartool lshistory -fmt %e\t%En\t%u\t%d\n %CLEARCASE_XPN%" > c:/temp/rawCleartoolOutput.txt
 *
 * @author lzncwl
 *
 */
public class SortAuthors
{
    Element root;
    Document doc;

    /**
     * This declares an instance of SortAuthors and calls the process method.
     *  
     * @param args Unused
     */
    public static void main(String[] args)
    {
        SortAuthors s = new SortAuthors("artefacts");
        s.process();
    }

    /**
     * This initialises the XML root element and document member variables, using
     * a string input parameter to name the root element. 
     * 
     * @param rootName a string containing the name to give to the root element
     */
    public SortAuthors(String rootName)
    {
        root = new Element(rootName);
        doc = new Document(root);
    }
    
    /**
     * This opens and reads the input file, parses the text and creates the XML
     * document.  
     */
    protected void process()
    {
        try
        {
            BufferedReader in = new BufferedReader(new FileReader("c:/temp/rawCleartoolOutput.txt"));
            PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("Artefacts.xml")));
/*PrintWriter authorFile = new PrintWriter(new BufferedWriter(new FileWriter("Authors.txt")));
String authors = new String();*/

            String s = new String();
            while ((s = in.readLine()) != null)
            {
                if (s.startsWith("create file element") &&
                    s.indexOf("methods") != -1)
                {
                    String str = new String();
// e.g. "create file element  .\ae_amounts_service\map_ae_amounts.xml gzyysf  11-Jul-05.13:34:40"
                    s = s.replaceFirst("create file element\t.\\\\", "");
// e.g. "ae_amounts_service\map_ae_amounts.xml gzyysf  11-Jul-05.13:34:40"
                    String methodName = new String();
                    String author = new String();
                    String date = new String();

                    // Extract method name
                    int index = s.indexOf("\t");
                    methodName = s.substring(0, index);
                    methodName = methodName.replace('\\', '/');
                    s = s.substring(index+1);

                    // Extract author
                    index = s.indexOf("\t");
                    author = s.substring(0, index);
/*if (authors.indexOf(author) == -1)
{
    authors += (author + "; ");
}*/
                    s = s.substring(index+1);

                    // Extract date
                    date = s.trim();

                    addArtefact(methodName, author, date);
                }
            }

            outputXML(out);
            out.close();
/*authorFile.println(authors);
authorFile.close();*/
        }
        catch (FileNotFoundException f)
        {
            System.out.println(f);
        }
        catch (IOException io)
        {
            System.out.println(io);
        }
    }

    /**
     * This builds an XML element using the strings passed in as arguments.
     * 
     * @param methodName a string representing the method name 
     * @param author     a string representing the name of the author
     * @param date       a string representing the creation date of the method
     * @throws IOException
     */
    protected void addArtefact(String methodName, String author, String date) throws IOException
    {
        Element eArtefact = new Element("artefact");
        Element eName = new Element("name");
        Element eAuthor = new Element("author");
        Element eDesc = new Element("description");
        Element eDate = new Element("date");

        eName.setText(methodName);
        eAuthor.setText(author);
        eDate.setText(date);

        eArtefact.addContent(eName);
        eArtefact.addContent(eAuthor);
        eArtefact.addContent(eDesc);
        eArtefact.addContent(eDate);

        root.addContent(eArtefact);
    }

   /**
    * This outputs the XML to a file. 
    *
    * @param  p  a PrintWriter linked to an output file
    */
    protected void outputXML(PrintWriter p) throws IOException
    {
        Format format = Format.getPrettyFormat().setIndent("    ");
        XMLOutputter outer = new XMLOutputter(format);

        outer.output(doc, p);
    }
}