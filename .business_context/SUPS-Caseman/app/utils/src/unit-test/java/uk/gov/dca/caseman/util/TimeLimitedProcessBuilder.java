/* Copyrights and Licenses
 * 
 * Copyright (c) 2008-2009 by the Ministry of Justice. All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted
 * provided that the following conditions are met:
 * - Redistributions of source code must retain the above copyright notice, this list of conditions
 * and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice, this list of
 * conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 * - All advertising materials mentioning features or use of this software must display the
 * following acknowledgment: "This product includes Money Claims OnLine."
 * - Products derived from this software may not be called "Money Claims OnLine" nor may
 * "Money Claims OnLine" appear in their names without prior written permission of the
 * Ministry of Justice.
 * - Redistributions of any form whatsoever must retain the following acknowledgment: "This
 * product includes Money Claims OnLine."
 * This software is provided "as is" and any expressed or implied warranties, including, but
 * not limited to, the implied warranties of merchantability and fitness for a particular purpose are
 * disclaimed. In no event shall the Ministry of Justice or its contributors be liable for any
 * direct, indirect, incidental, special, exemplary, or consequential damages (including, but
 * not limited to, procurement of substitute goods or services; loss of use, data, or profits;
 * or business interruption). However caused any on any theory of liability, whether in contract,
 * strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this
 * software, even if advised of the possibility of such damage.
 * 
 * $Id: AbstractActionServiceTest.java 15899 2013-01-09 14:10:43Z compstonr $
 * $LastChangedRevision: 15899 $
 * $LastChangedDate: 2013-01-09 14:10:43 +0000 (Wed, 09 Jan 2013) $
 * $LastChangedBy: compstonr $ */
package uk.gov.dca.caseman.util;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.swing.Timer;

/**
 * Class combines the duties of a ProcessBuilder, Process and BufferedReader. The main purpos of this class is to allow
 * a process to be launched, its output monitored and terminated if it does not reply after a set time.
 *
 * @author $Author:   CompstonR  $
 * @version $Revision:   1.0  $
 */
public class TimeLimitedProcessBuilder
{
    /**
     * Reader for an output file.
     */
    private BufferedReader mBufferedReader;
    
    /**
     * Process builder to time test.
     */
    private ProcessBuilder mProcessBuilder;
    
    /**
     * Process being timed.
     */
    private Process mProcess;
    
    /**
     * Timer used to time process.
     */
    private javax.swing.Timer mTimer;
    
    /**
     * Default value for timeout in MilliSeconds.
     */
    private int mTimeMilliSeconds = 10000;
    
    /**
     * Flag to indicate test timed out.
     */
    private boolean mTimedOut;

    /**
     *  Action listener will be called by timer in the event of the process timing out.
     */
    private ActionListener taskPerformer = new ActionListener()
    {
        public void actionPerformed (final ActionEvent evt)
        {
            // The task is taking too long to return, so force the Process to exit;
            stopTimer ();
            mTimedOut = true;

            // Process will be killed by garbage collector.
            mProcess = null;  
            System.gc ();
        }
    };

    /**
     * Constructor for {@link TimeLimitedProcessBuilder}.
     * 
     * @param command to be timed.
     */
    public TimeLimitedProcessBuilder (final String... command)
    {
        mProcessBuilder = new ProcessBuilder (command);
    }

    /**
     * Closes any open IO connections.
     *
     * @throws IOException Exception during IO.
     */
    public void close ()
            throws IOException
    {
        if (mBufferedReader != null)
        {
            mBufferedReader.close ();
        }
    }

    /**
     * Cleans up after the process.
     *
     * @throws Throwable
     */
    // CHECKSTYLE:OFF
    public void finalize ()
            throws Throwable
    {
        // CHECKSTYLE:ON
        try
        {
            if (mTimer != null)
            {
                mTimer.stop ();
            }

            if (mBufferedReader != null)
            {
                mBufferedReader.close ();
            }
        }
        finally
        {
            super.finalize ();
        }
    }

    /**
     * Gets the wait time in millisconds before the process is timedout.
     *
     * @return time in milliseconds.
     */
    public int getTimeMilliSeconds ()
    {
        return mTimeMilliSeconds;
    }

    /**
     * Reads a text output from the process.
     *
     * @return String containg read text.
     * @throws IOException Exception during IO.
     */
    public String readLine ()
            throws IOException
    {
        final String value;
        startTimer ();
        value = mBufferedReader.readLine ();
        stopTimer ();
        return value;
    }

    /**
     * Sets this process builder's <code>redirectErrorStream</code> property.
     *
     * @param redirectErrorStream Stream to redirect to.
     */
    public void redirectErrorStream (final boolean redirectErrorStream)
    {
        mProcessBuilder.redirectErrorStream (redirectErrorStream);
    }

    /**
     * Sets this process builder's working directory.
     *
     * @param directory The new directory.
     */
    public void setDirectory (final File directory)
    {
        mProcessBuilder.directory (directory);
    }

    /**
     * Sets the wait time in millisconds before the process is timedout.
     *
     * @param time new time in milliseconds.
     */
    public void setTimeMilliSeconds (final int time)
    {
        mTimeMilliSeconds = time;
    }

    /**
     * Starts a new process using the attributes of this process builder.
     *
     * @throws IOException Exception during IO.
     */
    public void start ()
            throws IOException
    {
        mProcess = mProcessBuilder.start ();
        mBufferedReader = new BufferedReader (
                new InputStreamReader (mProcess.getInputStream ()));
    }

    /**
     * Starts the timer for determining a time out.
     */
    private void startTimer ()
    {
        mTimer = new Timer (mTimeMilliSeconds, taskPerformer);
        mTimer.start ();
    }

    /**
     * Stops the timer.
     */
    private void stopTimer ()
    {
        if (mTimer != null)
        {
            mTimer.stop ();
        }
    }

    /**
     * Returns true if the process exited due to a time out.
     *
     * @return true - timed out, false - did not time out.
     */
    public boolean timedOut ()
    {
        return mTimedOut;
    }
}
