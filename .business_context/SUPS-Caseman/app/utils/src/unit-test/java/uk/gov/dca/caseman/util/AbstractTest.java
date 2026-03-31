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

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.rules.TestWatcher;
import org.junit.runner.Description;
import org.springframework.util.ReflectionUtils;

/**
 * Superclass for all tests extending AbstractTest.
 * 
 * @author Robin Compston.
 */
public abstract class AbstractTest
{
    /**
     * Logger instance.
     */
    private static final Log LOGGER = LogFactory.getLog (AbstractTest.class);

    /**
     * Relative path of property file containing database credientials.
     */
    private static final String TEST_PROPERTIES_FILE = "../build/env.properties";

    /**
     * Watcher to detect current test name.
     */
    @Rule
    public TestWatcher watcher = new TestWatcher ()
    {
        /**
         * Method called whenever JUnit starts a test.
         * 
         * @param description
         *            Information about the test.
         */
        protected void starting (final Description description)
        {
            LOGGER.info ("Start Test: " + description.getClassName () + "." + description.getMethodName () + ".");
        };
    };

    /**
     * Oracle system id.
     */
    private String sid;

    /**
     * Login user.
     */
    private String loginUserId;

    /**
     * Login password.
     */
    private String loginPassword;

    /**
     * Constructor for {@link AbstractTest}.
     */
    public AbstractTest ()
    {
        // Now load the properties for this test.
        final Properties testProperties = new Properties ();

        File file = null;
        try
        {
            file = new File (TEST_PROPERTIES_FILE);
            testProperties.load (new FileInputStream (file));

        }
        catch (final IOException e)
        {
            Assert.fail ("Failure to load test configuration parameters from " + file.getAbsolutePath ());
        }

        // Oracle migration logon parameters.
        loginUserId = testProperties.getProperty ("db.system.user");
        loginPassword = testProperties.getProperty ("db.system.pass");
        sid = testProperties.getProperty ("db.sid");
    }

    /**
     * This is a method to modify a private field with no accessor methods.
     * 
     * @param concreteClazz
     *            this is the class with the field accessor being changed (e.g.
     *            MyClazz.class)
     * @param classInstance
     *            this is the instance with the field state being changed (e.g.
     *            myClazz)
     * @param instanceVariableName
     *            this is the field name (e.g. "myString")
     * @param variableClazz
     *            this is the class of the field's type (e.g. String.class)
     * @param newFieldState
     *            the new value of the field (e.g. "a new value")
     */
    public void setPrivateField (final Class<?> concreteClazz, final Object classInstance,
                                 final String instanceVariableName, final Class<?> variableClazz,
                                 final Object newFieldState)
    {
        final Field field = ReflectionUtils.findField (concreteClazz, instanceVariableName, variableClazz);
        ReflectionUtils.makeAccessible (field);
        ReflectionUtils.setField (field, classInstance, newFieldState);
    }

    /**
     * Retrieve a field in its accessible state.
     * 
     * <p>
     * Scenario: field exists without a getter and is protected or private. This allows you to inspect that field's
     * state e.g. <code>LocalDateTime requestDateTimeField = (LocalDateTime) getAccesibleField(
				ServiceRequest.class, "requestDateTime", LocalDateTime.class,
				serviceRequest)</code>
     * </p>
     * 
     * @param clazzUnderTest
     *            This is the class that owns the field
     * @param fieldName
     *            this is the field name
     * @param clazzOfField
     *            this is the field type
     * @param target
     *            this is the object which has the variable
     * @return the field from the target object as an object.
     */
    public Object getAccesibleField (final Class<?> clazzUnderTest, final String fieldName,
                                     final Class<?> clazzOfField, final Object target)
    {
        final Field field = ReflectionUtils.findField (clazzUnderTest, fieldName, clazzOfField);
        ReflectionUtils.makeAccessible (field);
        return ReflectionUtils.getField (field, target);
    }

    /**
     * Retrieve a field in its accessible state.
     * 
     * <p>
     * Scenario: field exists without a getter and is protected or private. This allows you to inspect that field's
     * state e.g. <code>LocalDateTime re-questDateTimeField = (LocalDateTime) getAccesibleField(
				ServiceRequest.class, "requestDateTime", LocalDateTime.class,
				serviceRequest)</code>
     * </p>
     * 
     * @param clazzUnderTest
     *            This is the class that owns the method
     * @param methodName
     *            this is the method name
     * @return the accessible method.
     */
    public Method makeMethodAccesible (final Class<?> clazzUnderTest, final String methodName)
    {
        // return MethodUtils.getAccessibleMethod (clazzUnderTest, methodName, null);
        // final Method method = ReflectionUtils.findMethod (clazzUnderTest, methodName);
        // ReflectionUtils.makeAccessible (method);
        // return method;

        Method method = null;
        try
        {

            for (Method m : clazzUnderTest.getDeclaredMethods ())
            {
                if (methodName == m.getName ())
                {
                    method = m;
                    break;
                }
            }
        }
        catch (final SecurityException e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace ();
        }
        if (null != method)
        {
            method.setAccessible (true);
        }
        return method;
    }

    /**
     * Retrieve a field in its accessible state.
     * 
     * <p>
     * Scenario: field exists without a getter and is protected or private. This allows you to inspect that field's
     * state e.g. <code>LocalDateTime requestDateTimeField = (LocalDateTime) getAccesibleField(
                ServiceRequest.class, "requestDateTime", LocalDateTime.class,
                serviceRequest)</code>
     * </p>
     * 
     * @param clazzUnderTest
     *            This is the class that owns the method
     * @param methodName
     *            this is the method name
     * @param paramTypes the arguments
     * @return the method in its accesible form.
     */
    public Method makeMethodAccesible (final Class<?> clazzUnderTest, final String methodName,
                                       final Class<?>... paramTypes)
    {
        // return MethodUtils.getAccessibleMethod (clazzUnderTest, methodName, null);
        // final Method method = ReflectionUtils.findMethod (clazzUnderTest, methodName);
        // ReflectionUtils.makeAccessible (method);
        // return method;
        Method method = null;
        try
        {
            method = clazzUnderTest.getDeclaredMethod (methodName, paramTypes);
            method.setAccessible (true);
        }
        catch (final SecurityException e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace ();
        }
        catch (final NoSuchMethodException e)
        {
            // TODO Auto-generated catch block
            e.printStackTrace ();
        }
        // method.setAccessible(true);
        return method;
    }

    /**
     * Getter for oracle sid.
     * 
     * @return oracle sid.
     */
    public String getSid ()
    {
        return sid;
    }

    /**
     * Getter for login user id.
     * 
     * @return login user id.
     */
    public String getLoginUserId ()
    {
        return loginUserId;
    }

    /**
     * Getter for login password.
     * 
     * @return login password.
     */
    public String getLoginPassword ()
    {
        return loginPassword;
    }
}
