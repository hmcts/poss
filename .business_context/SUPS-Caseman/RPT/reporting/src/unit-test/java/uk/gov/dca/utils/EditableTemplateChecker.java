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
package uk.gov.dca.utils;

import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Element;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import java.io.File;
import java.io.FilenameFilter;

/**
 * Test Java Class which compares the Editable Word Processing EDITME div node id attributes to
 * those currently in live. If the id's are different, then users will not be able to generate
 * the output if marked as not final and was generated using a previous version of the output
 * with a different EDITME div node id.
 *
 * @author Chris Vincent
 */
public class EditableTemplateChecker
{

    /**
     * The main method.
     *
     * @param args the arguments
     * @throws Exception the exception
     */
    public static void main (final String[] args) throws Exception
    {
        final String liveTemplateFolder = "test/java/uk/gov/dca/live-xsl"; // Location of live templates
        final String newTemplateFolder = "C:/SUPS/build/caseman/reporting_templates/xsl"; // Location of freshly built
                                                                                          // templates

        // Setup file filter to only look for XHTML files (editable outputs)
        final FilenameFilter filter = new FilenameFilter ()
        {
            public boolean accept (final File dir, final String name)
            {
                return (name.indexOf ("-XHTML") != -1);
            }
        };

        // Use the filter to get a list of editable output filenames
        final File newTemplateDir = new File (newTemplateFolder);
        final String[] xHTMLFileNames = newTemplateDir.list (filter);
        int issuesFound = 0;

        // For each editable output check the EDITME div nodes and compare live templates to new templates
        for (int i = 0; i < xHTMLFileNames.length; i++)
        {
            final File tempNewFile = new File (newTemplateFolder + "/" + xHTMLFileNames[i]); // New template to be
                                                                                             // tested
            final File tempLiveFile = new File (liveTemplateFolder + "/" + xHTMLFileNames[i]); // Live version of
                                                                                               // template to compare to

            // Break down the XSL template files and get the div nodes which contain the EDITME class attribute
            final DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance ();
            final DocumentBuilder db = dbf.newDocumentBuilder ();
            final Document newFileDoc = db.parse (tempNewFile);
            final Document liveFileDoc = db.parse (tempLiveFile);
            final NodeList nfDivNodes = newFileDoc.getElementsByTagName ("div"); // New template div nodes
            final NodeList lfDivNodes = liveFileDoc.getElementsByTagName ("div"); // Live template div nodes

            // Loop through all the Live template div nodes to identify the EDITME nodes and store the id in a String
            // array
            final String[] lfEditmeList = new String[lfDivNodes.getLength ()];
            int numLiveEditMes = 0;
            for (int j = 0; j < lfDivNodes.getLength (); j++)
            {
                final Element el_temp = (Element) lfDivNodes.item (j);
                if (el_temp.hasAttribute ("class") && el_temp.getAttribute ("class").equals ("EDITME"))
                {
                    // div node has a class of EDITME, store the id in array
                    lfEditmeList[numLiveEditMes] = el_temp.getAttribute ("id");
                    numLiveEditMes++;
                }
            }

            // Loop through all the New template div nodes to identify the EDITME nodes and store the id in a String
            // array
            final String[] nfEditmeList = new String[nfDivNodes.getLength ()];
            int numNewEditMes = 0;
            for (int k = 0; k < nfDivNodes.getLength (); k++)
            {
                final Element el_temp = (Element) nfDivNodes.item (k);
                if (el_temp.hasAttribute ("class") && el_temp.getAttribute ("class").equals ("EDITME"))
                {
                    // div node has a class of EDITME, store the id in array
                    nfEditmeList[numNewEditMes] = el_temp.getAttribute ("id");
                    numNewEditMes++;
                }
            }

            // Compare the EDITME ids for the Live template and the New template

            for (int idx = 0; idx < numLiveEditMes; idx++)
            {
                if ( !lfEditmeList[idx].equals (nfEditmeList[idx]))
                {
                    // Difference in id - flag the output
                    System.out.println (xHTMLFileNames[i] + ": PROBLEM " + "Live: " + lfEditmeList[idx] + " Current: " +
                            nfEditmeList[idx]);
                    issuesFound++;
                }
            }
        }

        // Message if all Ok
        if (issuesFound == 0)
        {
            System.out.println ("All templates Ok.");
        }

    }
}
