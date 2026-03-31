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
package uk.gov.dca.caseman.warrant_service.java;

import java.io.IOException;
import java.io.Writer;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Class: WarrantStatus.java
 * 
 * Created: 18-Apr-2005
 * 
 * @author Tim Connor
 *
 *         Change History:
 *         17-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 *         11-Dec-2013 Chris Vincent: Included new warrant type CONTROL in if statement. Trac 5025.
 *
 */
public class WarrantStatus extends AbstractCustomProcessor
{

    /** The out. */
    private final XMLOutputter out;

    /** The warrant path. */
    private final XPath warrantPath;
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (WarrantStatus.class);

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public WarrantStatus () throws JDOMException
    {

        warrantPath = XPath.newInstance ("/ds/Warrant");
        out = new XMLOutputter (Format.getCompactFormat ());
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param pLog the log
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document,
     *      java.io.Writer, org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log pLog) throws SystemException
    {
        try
        {
            final Element warrantElement = (Element) warrantPath.selectSingleNode (params);
            if (warrantElement == null)
            {
                return;
            }
            final Element statusElement = warrantElement.getChild ("WarrantStatus");
            final Element printStatusElement = warrantElement.getChild ("PrintStatus");
            final Element warrantIDElement = warrantElement.getChild ("WarrantID");

            String status = "";
            String printStatus = "";

            String warrantID = null;
            if (warrantIDElement != null)
            {
                warrantID = warrantIDElement.getText ();
            }

            final String warrantType = warrantElement.getChildText ("WarrantType");

            // Calculate the PRINT STATUS
            if (warrantType.equals ("EXECUTION") || warrantType.equals ("CONTROL"))
            {
                final String toTransfer = warrantElement.getChild ("ToTransfer").getText ();
                if (WarrantUtils.isEmpty (toTransfer) || toTransfer.equals ("0"))
                {
                    String date = warrantElement.getChild ("DatePrinted").getText ();
                    if ( !WarrantUtils.isEmpty (date))
                    {
                        date = warrantElement.getChild ("DateReprinted").getText ();
                        if (WarrantUtils.isEmpty (date))
                        {
                            printStatus = "PRINTED";
                        }
                        else
                        {
                            printStatus = "REPRINTED";
                        }
                    }
                    else
                    {
                        printStatus = "TO PRINT";
                    }
                }
                else if (toTransfer.equals ("1"))
                {
                    printStatus = "TO TRANSFER";
                }
                else
                {
                    printStatus = "TRANSFERRED";
                }
            }

            // CALCULATE THE STATUS
            if ( !WarrantUtils.isEmpty (warrantElement.getChildText ("ReIssueDate")))
            {
                status = "REISSUED";
            }

            // Check for a final return
            if (WarrantUtils.isEmpty (status))
            {
                final List<Element> nodes = warrantElement.getChild ("FinalReturnCodes").getChildren ("Code");
                if (nodes.size () > 0)
                {
                    final Iterator<Element> it = nodes.iterator ();
                    while (it.hasNext ())
                    {
                        final String code = ((Element) it.next ()).getText ().trim ();
                        if (code.equals ("42") || code.equals ("101"))
                        {
                            status = "PAID";
                        }
                    }
                }
                else
                {
                    // There is no final return for this warrant
                    status = "LIVE";
                }
            }

            if (statusElement != null)
            {
                statusElement.setText (status);
            }
            if (printStatusElement != null)
            {
                printStatusElement.setText (printStatus);
            }

            final String s = out.outputString (params.getRootElement ());
            log.debug ("WarrantStatus response: " + s);
            writer.write (s);
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
    }
}