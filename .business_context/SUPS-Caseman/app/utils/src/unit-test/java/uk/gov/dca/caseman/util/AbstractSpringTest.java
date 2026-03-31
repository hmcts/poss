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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Rule;
import org.junit.rules.TestWatcher;
import org.junit.runner.Description;
import org.springframework.test.context.junit4.AbstractJUnit4SpringContextTests;

/**
 * Superclass for all tests extending AbstractTransactionalJUnit4SpringContextTests.
 */
public abstract class AbstractSpringTest extends AbstractJUnit4SpringContextTests
{
    /**
     * Logger instance.
     */
    private static final Log LOGGER = LogFactory.getLog (AbstractSpringTest.class);

    /**
     * Watcher to detect current test name.
     */
    @Rule
    public TestWatcher watcher = new TestWatcher ()
    {
        /**
         * Method called whenever JUnit starts a test.
         * 
         * @param description Information about the test.
         */
        protected void starting (final Description description)
        {
            LOGGER.info ("Start Test: " + description.getClassName () + "." + description.getMethodName () + ".");
        };
    };
}
