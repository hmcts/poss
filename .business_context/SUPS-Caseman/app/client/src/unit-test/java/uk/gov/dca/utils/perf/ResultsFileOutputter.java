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

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.apache.log4j.Logger;

import uk.gov.dca.utils.common.AbstractCmTestBase;

/**
 * Created by David Turner. User: Administrator Date: 24-Feb-2009 Time: 14:36:18
 */
public class ResultsFileOutputter
{
    
    /** The out. */
    private BufferedWriter out;
    
    /** The Constant LOG. */
    private static final Logger LOG = Logger.getLogger (AbstractCmTestBase.class); // Private loggger

    /**
     * Constructor.
     *
     * @param theFileToOutput Name of the file to output
     */
    public ResultsFileOutputter (final String theFileToOutput)
    {
        final File theOutPutFile;
        try
        {
            theOutPutFile = new File (theFileToOutput);
            if ( !theOutPutFile.exists ())
            {
                final boolean result = theOutPutFile.createNewFile ();
                LOG.info ("New file created: " + result);
            }
            out = new BufferedWriter (new FileWriter (theOutPutFile));
        }
        catch (final IOException e)
        {
            e.printStackTrace ();
        }
    }

    /**
     * Writes a string to the buffered writer.
     *
     * @param message String to write
     */
    public void write (final String message)
    {
        try
        {
            out.write (message);
            out.close ();
        }
        catch (final IOException e)
        {
            e.printStackTrace ();
        }
    }
}
