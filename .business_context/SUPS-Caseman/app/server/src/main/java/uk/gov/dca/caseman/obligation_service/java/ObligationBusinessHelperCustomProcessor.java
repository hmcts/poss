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
package uk.gov.dca.caseman.obligation_service.java;

import java.io.IOException;
import java.io.StringReader;
import java.io.Writer;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.logging.Log;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.caseman.common.java.XMLBuilder;
import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationManager;
import uk.gov.dca.caseman.obligation_service.java.obligationrules.IObligationRule;
import uk.gov.dca.caseman.obligation_service.java.obligationrules.impl.ObligationFactory;
import uk.gov.dca.caseman.obligation_service.java.obligationrules.impl.ObligationRule;
import uk.gov.dca.db.ejb.SupsLocalServiceProxy2;
import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.AbstractCustomProcessor;
import uk.gov.dca.db.pipeline.IComponentContext;
import uk.gov.dca.db.pipeline.component_input.ComponentInput;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * Created on 17-Feb-2005
 *
 * Change History:
 * 19-May-2006 Dave Wright (EDS): Refactor of exception handling. Defect 2689.
 * 28-Jan-2013 Chris Vincent: Calls to getObligationAutomaticRules() now made with String event id, not integer. Trac
 * 4767
 *
 * @author Amjad Khan
 */
public class ObligationBusinessHelperCustomProcessor extends AbstractCustomProcessor
{
    
    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (ObligationBusinessHelperCustomProcessor.class);

    /** The Constant OBLIGATION_SERVICE. */
    private static final String OBLIGATION_SERVICE = "ejb/ObligationServiceLocal";
    
    /** The Constant GET_OBLIGATION_SEQUENCE. */
    private static final String GET_OBLIGATION_SEQUENCE = "checkObligationExistanceLocal";
    
    /** The Constant GET_AE_OBLIGATION_SEQUENCE. */
    private static final String GET_AE_OBLIGATION_SEQUENCE = "checkAEObligationExistanceLocal";
    
    /** The Constant DETERMINE_ACTIVE_OBLIGATION. */
    private static final String DETERMINE_ACTIVE_OBLIGATION = "determineActiveObligationsLocal";
    
    /** The Constant ADD_OBLIGATION. */
    private static final String ADD_OBLIGATION = "addObligationLocal";
    
    /** The Constant ADD_AE_OBLIGATION. */
    private static final String ADD_AE_OBLIGATION = "addAEObligationLocal";
    
    /** The Constant DELETE_OBLIGATION. */
    private static final String DELETE_OBLIGATION = "deleteObligationLocal";
    
    /** The Constant DELETE_AE_OBLIGATION. */
    private static final String DELETE_AE_OBLIGATION = "deleteAEObligationLocal";
    
    /** The Constant NON_WORKING_DAYS_SERVICE. */
    private static final String NON_WORKING_DAYS_SERVICE = "ejb/NonWorkingDayServiceLocal";
    
    /** The Constant GET_NON_WORKING_DAYS. */
    private static final String GET_NON_WORKING_DAYS = "getNonWorkingDaysLocal";
    
    /** The Constant SYSTEM_DATE_SERVICE. */
    private static final String SYSTEM_DATE_SERVICE = "ejb/SystemDateServiceLocal";
    
    /** The Constant GET_SYSTEM_DATE. */
    private static final String GET_SYSTEM_DATE = "getSystemDateLocal";
    
    /** The Constant OPTIONAL_FLOW. */
    private static final String OPTIONAL_FLOW = "O";
    
    /** The Constant AUTOMATIC_FLOW. */
    private static final String AUTOMATIC_FLOW = "A";
    
    /** The Constant ERROR_MANDATORY_FLOW. */
    private static final String ERROR_MANDATORY_FLOW = "EM";
    
    /** The Constant ERROR_AUTOMATIC_FLOW. */
    private static final String ERROR_AUTOMATIC_FLOW = "EA";
    
    /** The Constant ERROR_OPTIONAL_FLOW. */
    private static final String ERROR_OPTIONAL_FLOW = "EO";
    
    /** The Constant NONE_FLOW. */
    private static final String NONE_FLOW = "N";
    
    /** The Constant CASEEVENT_FLAG. */
    private static final String CASEEVENT_FLAG = "C";
    
    /** The Constant AEEVENT_FLAG. */
    private static final String AEEVENT_FLAG = "A";
    
    /** The Constant ACTIVE_OBLIGATIONS. */
    private static final String ACTIVE_OBLIGATIONS = "A";
    
    /** The Constant NON_ACTIVE_OBLIGATIONS. */
    private static final String NON_ACTIVE_OBLIGATIONS = "NA";
    
    /** The Constant NO_ACTIVE_OBLIGATIONS. */
    private static final String NO_ACTIVE_OBLIGATIONS = "N";
    
    /** The Constant ACTIONFLOW_TAG. */
    private static final String ACTIONFLOW_TAG = "ActionFlow";
    
    /** The Constant OBLIGATION_TAG. */
    private static final String OBLIGATION_TAG = "Obligation";
    
    /** The Constant OBLIGATIONS_TAG. */
    private static final String OBLIGATIONS_TAG = "Obligations";
    
    /** The Constant CASENUMBER_TAG. */
    private static final String CASENUMBER_TAG = "CaseNumber";
    
    /** The Constant EVENTID_TAG. */
    private static final String EVENTID_TAG = "EventId";
    
    /** The Constant EVENTTYPE_TAG. */
    private static final String EVENTTYPE_TAG = "EventType";
    
    /** The Constant OBLIGATION_TYPE_TAG. */
    private static final String OBLIGATION_TYPE_TAG = "ObligationType";
    
    /** The Constant EXPIRYDATE_TAG. */
    private static final String EXPIRYDATE_TAG = "ExpiryDate";
    
    /** The Constant NOTES_TAG. */
    private static final String NOTES_TAG = "Notes";
    
    /** The Constant LASTUPDATE_USER_TAG. */
    private static final String LASTUPDATE_USER_TAG = "LastUpdateUser";
    
    /** The Constant EVENTSEQUENCE_TAG. */
    private static final String EVENTSEQUENCE_TAG = "EventSequence";
    
    /** The Constant EVENTSEQ_TAG. */
    private static final String EVENTSEQ_TAG = "EventSeq";
    
    /** The Constant CASENUMBER_PARAM_TAG. */
    private static final String CASENUMBER_PARAM_TAG = "caseNumber";
    
    /** The Constant AUTOMATIC_OBLIGATION. */
    private static final String AUTOMATIC_OBLIGATION = "AUTOMATIC OBLIGATION";
    
    /** The Constant MAINTAIN_OBLIGATIONS_TAG. */
    private static final String MAINTAIN_OBLIGATIONS_TAG = "MaintainObligations";
    
    /** The Constant DS_TAG. */
    private static final String DS_TAG = "ds";
    
    /** The Constant SLASH. */
    private static final String SLASH = "/";
    
    /** The Constant STARTTAG. */
    private static final String STARTTAG = "<";
    
    /** The Constant ENDTAG. */
    private static final String ENDTAG = ">";

    /** The out. */
    private final XMLOutputter out;
    
    /** The formatter. */
    private final SimpleDateFormat formatter;
    
    /** The proxy. */
    private final SupsLocalServiceProxy2 proxy;
    
    /** The obligation param sequence path. */
    private final XPath obligationParamSequencePath;
    
    /** The non working sequence path. */
    private final XPath nonWorkingSequencePath;
    
    /** The system date path. */
    private final XPath systemDatePath;
    
    /** The obligation type path. */
    private final XPath obligationTypePath;

    /** The case number. */
    private String caseNumber;
    
    /** The event ID. */
    private String eventID;
    
    /** The event seq. */
    private String eventSeq;
    
    /** The event type. */
    private String eventType;
    
    /** The last update user. */
    private String lastUpdateUser;
    
    /** The obligatin rule XML. */
    private String obligatinRuleXML = "";
    
    /** The action flow. */
    private String actionFlow;

    /** The iom. */
    private IObligationManager iom;
    
    /** The m context. */
    private IComponentContext m_context = null;

    /**
     * Constructor.
     *
     * @throws JDOMException the JDOM exception
     */
    public ObligationBusinessHelperCustomProcessor () throws JDOMException
    {
        super ();

        out = new XMLOutputter (Format.getCompactFormat ());
        proxy = new SupsLocalServiceProxy2 ();
        formatter = new SimpleDateFormat ("yyyy-MM-dd");
        obligationParamSequencePath = XPath.newInstance ("/Obligation/ObligationCount");
        nonWorkingSequencePath = XPath.newInstance ("/NonWorkingDays/NonWorkingDay/Date");
        systemDatePath = XPath.newInstance ("/SystemDate");
        obligationTypePath = XPath.newInstance ("/Obligations/Type");
    }

    /**
     * Processes the passed pipeline parameters document.
     * 
     * <params>
     * <param name="caseNumber">CJH00100</param>
     * <param name="eventID">CJH00100</param>
     * <param name="lastUpdateUser">CJH00100</param>
     * <param name="eventSeq">CJH00100</param>
     * </params>
     *
     * @param params the params
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    public Document process (final Document params) throws BusinessException, SystemException
    {
        processFlow (params);
        return convertToDoc ();
    }

    /**
     * (non-Javadoc).
     *
     * @param params the params
     * @param writer the writer
     * @param pLog the log
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.AbstractCustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final Document params, final Writer writer, final Log pLog)
        throws BusinessException, SystemException
    {
        processFlow (params);

        try
        {
            writer.write (toXML ());
        }
        catch (final IOException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
    }

    /**
     * {@inheritDoc}
     */
    public void setContext (final IComponentContext context)
    {
        this.m_context = context;
    }

    /**
     * (non-Javadoc)
     * Process the input parameters and if successful continue.
     *
     * @param params the params
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void processFlow (final Document params) throws BusinessException, SystemException
    {
        iom = ObligationFactory.getObligationManager ();
        if (processInputParams (params))
        {
            actionFlow (determineAutoOblRules (), determineOblRules ());
        }
    }

    /**
     * (non-Javadoc)
     * Set the actionFlow variable.
     *
     * @param autoflow the autoflow
     * @param flow the flow
     */
    private void actionFlow (final String autoflow, final String flow)
    {
        /* Please Note we are checking for for the scenario where an Event ID has two
         * asscociated obligation types. One of which is Mandatory/Optional and the other which
         * is Automatic. The current system does not allow a Mainatance mode to be asscoiated
         * with the the Automatic where there are two Obligation types linked on the Obligation Rules,
         * but this is feasible as their is no explict database rule
         * to prevent this. In case this does happen where an Automatic does have a flow due to a
         * Maintenance mode set, and there are two obligations set for the Event then only
         * the automatic will be returned by default. */
        if (autoflow.equals (NONE_FLOW) && flow.equals (NONE_FLOW))
        {
            actionFlow = NONE_FLOW;
        }
        else
        {
            if ( !autoflow.equals (NONE_FLOW) &&
                    !(flow.equals (ERROR_MANDATORY_FLOW) || flow.equals (ERROR_OPTIONAL_FLOW)))
            {
                actionFlow = autoflow;
            }
            else
            {
                actionFlow = flow;
            }
        }
    }

    /**
     * (non-Javadoc)
     * Convert string to document.
     *
     * @return the document
     * @throws SystemException the system exception
     */
    private Document convertToDoc () throws SystemException
    {
        final SAXBuilder builder = new SAXBuilder ();
        try
        {
            return builder.build (new StringReader (toXML ()));
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

    /**
     * (non-Javadoc)
     * Set class variables to input parameters.
     *
     * @param params the params
     * @return true, if successful
     */
    private boolean processInputParams (final Document params)
    {
        final List<Element> elements = params.getRootElement ().getChildren ();

        for (Iterator<Element> i = elements.iterator (); i.hasNext ();)
        {
            final Element current = (Element) i.next ();
            final String name = current.getName ();

            if (name.equals ("param"))
            {
                final String nameAtt = current.getAttributeValue ("name");
                if (nameAtt != null)
                {

                    if (nameAtt.equals ("caseNumber"))
                    {
                        caseNumber = current.getValue ();
                    }
                    if (nameAtt.equals ("eventID"))
                    {
                        eventID = current.getValue ();
                    }
                    if (nameAtt.equals ("lastUpdateUser"))
                    {
                        lastUpdateUser = current.getValue ();
                    }
                    if (nameAtt.equals ("eventSeq"))
                    {
                        eventSeq = current.getValue ();
                    }
                    if (nameAtt.equals ("eventType"))
                    {
                        eventType = current.getValue ();
                    }
                }
            }
        }

        return validateEventType ();
    }

    /**
     * Validate event type.
     *
     * @return true, if successful
     */
    private boolean validateEventType ()
    {
        return eventType.equals (AEEVENT_FLAG) || eventType.equals (CASEEVENT_FLAG);
    }

    /**
     * Gets the multi use.
     *
     * @param obligationType the obligation type
     * @return the multi use
     */
    private boolean getMultiUse (final String obligationType)
    {
        return iom.getObligationTypes (obligationType).getMultiUse ();
    }

    /**
     * (non-Javadoc)
     * Determine auto obligation rules.
     *
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String determineAutoOblRules () throws BusinessException, SystemException
    {
        final IObligationRule iorAutomatic = getAutomaticOblRules ();

        if (iorAutomatic != null)
        {

            if (iorAutomatic.getAction ().equals ("D"))
            {
                if (CheckObligationOnDatabase (iorAutomatic.getObligationType ()))
                {
                    automaticDelete (iorAutomatic);
                }
            }
            else if (iorAutomatic.getAction ().equals ("C"))
            {
                if (getMultiUse (iorAutomatic.getObligationType ()))
                {
                    automaticCreate (iorAutomatic);
                }
                else
                {
                    if (CheckObligationOnDatabase (iorAutomatic.getObligationType ()))
                    {
                        return ERROR_AUTOMATIC_FLOW;
                    }
                    automaticCreate (iorAutomatic);
                }
            }
            return determineNextActionMaintenanceMode (iorAutomatic.getMaintenanceMode (), iorAutomatic);
        }
        return NONE_FLOW;
    }

    /**
     * (non-Javadoc)
     * Determine obligation rules.
     *
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String determineOblRules () throws BusinessException, SystemException
    {
        final IObligationRule ior = getOblRules ();

        if (ior != null)
        {
            if (ior.getMechanism ().equals ("M"))
            {
                if (ior.getAction ().equals ("C"))
                {
                    if (getMultiUse (ior.getObligationType ()))
                    {
                        obligatinRuleXML = ior.toXML ();
                        return AUTOMATIC_FLOW;
                    }
                    if (CheckObligationOnDatabase (ior.getObligationType ()))
                    {
                        obligatinRuleXML = removeActionMechanism (ior).toXML ();
                        return ERROR_MANDATORY_FLOW;
                    }
                    obligatinRuleXML = ior.toXML ();
                    return AUTOMATIC_FLOW;
                }
                else if (ior.getAction ().equals ("M"))
                {
                    if (CheckObligationOnDatabase (ior.getObligationType ()))
                    {
                        obligatinRuleXML = ior.toXML ();
                        return AUTOMATIC_FLOW;
                    }
                    determineNextActionMaintenanceMode (ior.getMaintenanceMode (), ior);
                }
            }
            else if (ior.getMechanism ().equals ("O"))
            {
                if (getMultiUse (ior.getObligationType ()))
                {
                    obligatinRuleXML = ior.toXML ();
                    return OPTIONAL_FLOW;
                }
                if (CheckObligationOnDatabase (ior.getObligationType ()))
                {
                    return ERROR_OPTIONAL_FLOW;
                }
                obligatinRuleXML = ior.toXML ();
                return OPTIONAL_FLOW;
            }
            return determineNextActionMaintenanceMode (ior.getMaintenanceMode (), ior);
        }
        return NONE_FLOW;
    }

    /**
     * Gets the automatic obl rules.
     *
     * @return the automatic obl rules
     */
    private IObligationRule getAutomaticOblRules ()
    {
        if (eventType.equals (CASEEVENT_FLAG))
        {
            return iom.getObligationAutomaticRules (eventID);
        }
        else if (eventType.equals (AEEVENT_FLAG))
        {
            return iom.getObligationAutomaticRulesAE (eventID);
        }
        else
        {
            return null;
        }
    }

    /**
     * Gets the obl rules.
     *
     * @return the obl rules
     */
    private IObligationRule getOblRules ()
    {
        if (eventType.equals (CASEEVENT_FLAG))
        {
            return iom.getObligationRules (eventID);
        }
        else if (eventType.equals (AEEVENT_FLAG))
        {
            return iom.getObligationRulesAE (eventID);
        }
        else
        {
            return null;
        }
    }

    /**
     * (non-Javadoc)
     * Check to see if the obligation is on the database.
     *
     * @param obligationType the obligation type
     * @return true, if successful
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private boolean CheckObligationOnDatabase (final String obligationType) throws BusinessException, SystemException
    {
        Element obligationResult = null;
        try
        {
            if ( !isEmpty (caseNumber))
            {
                obligationResult = determineServiceForCheckObligationOnDatabase (obligationType);
                final Element obligationCountElement =
                        (Element) obligationParamSequencePath.selectSingleNode (obligationResult);

                if (isEmpty (obligationCountElement.getText ()))
                {
                    return false;
                }
                else if (Integer.parseInt (obligationCountElement.getText ()) > 0)
                {
                    return true;
                }
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
        return false;
    }

    /**
     * (non-Javadoc)
     * Call appropriate service to get obligation sequence based on the event type.
     *
     * @param obligationType the obligation type
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element determineServiceForCheckObligationOnDatabase (final String obligationType)
        throws SystemException, BusinessException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseNumber", caseNumber);
        XMLBuilder.addParam (paramsElement, "obligationType", obligationType);

        if (eventType.equals (CASEEVENT_FLAG))
        {
            return invokeLocalServiceProxy (OBLIGATION_SERVICE, GET_OBLIGATION_SEQUENCE, paramsElement.getDocument ())
                    .getRootElement ();
        }
        else if (eventType.equals (AEEVENT_FLAG))
        {
            return invokeLocalServiceProxy (OBLIGATION_SERVICE, GET_AE_OBLIGATION_SEQUENCE,
                    paramsElement.getDocument ()).getRootElement ();
        }
        else
        {
            throw new SystemException ("Event Type is not listed = " + eventType);
        }
    }

    /**
     * (non-Javadoc)
     * Create params for auto delete and call appropriate service.
     * <params>
     * <param name="caseNumber">
     * <Obligation>
     * <CaseNumber>CJH02679</CaseNumber>
     * <ObligationType>7</ObligationType>
     * <LastUpdateUser>AK</LastUpdateUser>
     * </Obligation>
     * </param>
     * </params>
     *
     * @param ior the ior
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void automaticDelete (final IObligationRule ior) throws BusinessException, SystemException
    {
        if ( !isEmpty (caseNumber))
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());

            final Element obligationTypeElement = new Element (OBLIGATION_TYPE_TAG);
            obligationTypeElement.setText (ior.getObligationType ());
            final Element caseNumberElement = new Element (CASENUMBER_TAG);
            caseNumberElement.setText (caseNumber);
            final Element luUserElement = new Element (LASTUPDATE_USER_TAG);
            luUserElement.setText (lastUpdateUser);

            final Element obligationElement = new Element (OBLIGATION_TAG);
            obligationElement.addContent (obligationTypeElement);
            obligationElement.addContent (caseNumberElement);
            obligationElement.addContent (luUserElement);
            XMLBuilder.addParam (paramsElement, CASENUMBER_PARAM_TAG, obligationElement);

            determineServiceForAutomaticDelete (paramsElement);
        }
    }

    /**
     * (non-Javadoc)
     * Determine appropriate service for auto delete based upon event type and invoke it.
     *
     * @param params the params
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void determineServiceForAutomaticDelete (final Element params) throws SystemException, BusinessException
    {
        if (eventType.equals (CASEEVENT_FLAG))
        {
            invokeLocalServiceProxy (OBLIGATION_SERVICE, DELETE_OBLIGATION, params.getDocument ()).getRootElement ();
        }
        else if (eventType.equals (AEEVENT_FLAG))
        {
            invokeLocalServiceProxy (OBLIGATION_SERVICE, DELETE_AE_OBLIGATION, params.getDocument ()).getRootElement ();
        }
        else
        {
            throw new SystemException ("Event Type is not listed = " + eventType);
        }
    }

    /**
     * (non-Javadoc)
     * Create params for auto create and invoke service.
     * <params>
     * <param name="caseNumber">
     * <ds>
     * <MaintainObligations>
     * <Obligations>
     * <Obligation>
     * <CaseNumber>CJH02679</CaseNumber>
     * <EventId>11</EventId>
     * <ObligationType>2</ObligationType>
     * <ExpiryDate>2005-01-25</ExpiryDate>
     * <Notes>Notes 1 These are notes.</Notes>
     * <LastUpdateUser>AK</LastUpdateUser>
     * </Obligation>
     * </Obligations>
     * </MaintainObligations>
     * </ds>
     * </param>
     * </params>
     *
     * @param ior the ior
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private void automaticCreate (final IObligationRule ior) throws BusinessException, SystemException
    {
        // <param name=\"caseNumber\"><ds><MaintainObligations><Obligations><Obligation>
        if ( !isEmpty (caseNumber))
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());

            final Element obligationTypeElement = new Element (OBLIGATION_TYPE_TAG);
            obligationTypeElement.setText (ior.getObligationType ());
            final Element caseNumberElement = new Element (CASENUMBER_TAG);
            caseNumberElement.setText (caseNumber);
            final Element luUserElement = new Element (LASTUPDATE_USER_TAG);
            luUserElement.setText (lastUpdateUser);
            final Element eventSeqElement = new Element (EVENTSEQ_TAG);
            eventSeqElement.setText (eventSeq);
            final Element expiryElement = new Element (EXPIRYDATE_TAG);
            expiryElement.setText (incrementDefaultDays (ior));
            final Element notesElement = new Element (NOTES_TAG);
            notesElement.setText (AUTOMATIC_OBLIGATION);

            final Element obligationElement = new Element (OBLIGATION_TAG);
            obligationElement.addContent (obligationTypeElement);
            obligationElement.addContent (caseNumberElement);
            obligationElement.addContent (luUserElement);
            obligationElement.addContent (eventSeqElement);
            obligationElement.addContent (expiryElement);
            obligationElement.addContent (notesElement);

            final Element obligationsElement = new Element (OBLIGATIONS_TAG);
            obligationsElement.addContent (obligationElement);
            final Element maintainObligationsElement = new Element (MAINTAIN_OBLIGATIONS_TAG);
            maintainObligationsElement.addContent (obligationsElement);
            final Element dsElement = new Element (DS_TAG);
            dsElement.addContent (maintainObligationsElement);

            XMLBuilder.addParam (paramsElement, CASENUMBER_PARAM_TAG, dsElement);

            determineServiceForAutomaticCreate (paramsElement);
        }
    }

    /**
     * (non-Javadoc)
     * Determine the service for auto create based upon event type and invoke it.
     *
     * @param params the params
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private void determineServiceForAutomaticCreate (final Element params) throws SystemException, BusinessException
    {
        if (eventType.equals (CASEEVENT_FLAG))
        {
            invokeLocalServiceProxy (OBLIGATION_SERVICE, ADD_OBLIGATION, params.getDocument ()).getRootElement ();
        }
        else if (eventType.equals (AEEVENT_FLAG))
        {
            invokeLocalServiceProxy (OBLIGATION_SERVICE, ADD_AE_OBLIGATION, params.getDocument ()).getRootElement ();
        }
        else
        {
            throw new SystemException ("Event Type is not listed = " + eventType);
        }
    }

    /**
     * (non-Javadoc)
     * Determine next action maintenance mode.
     *
     * @param maint the maint
     * @param ior the ior
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String determineNextActionMaintenanceMode (final String maint, final IObligationRule ior)
        throws BusinessException, SystemException
    {

        if (maint.equals ("M") && checkActiveObligationsForCase ())
        {
            obligatinRuleXML = removeActionMechanism (ior).toXML ();
            return AUTOMATIC_FLOW;
        }
        else if (maint.equals ("C") && ior.getMechanism ().equals ("A"))
        {
            obligatinRuleXML = removeActionMechanism (ior).toXML ();
            return AUTOMATIC_FLOW; // New Addition to simulate the legacy system
        }
        else if (maint.equals ("C"))
        {
            obligatinRuleXML = removeActionMechanism (ior).toXML ();
            return OPTIONAL_FLOW;
        }
        else if (ior.getMechanism ().equals ("A") && getOblRules () != null &&
                getOblRules ().getMechanism ().equals ("O"))
        {
            return AUTOMATIC_FLOW; // New Addition to simulate the legacy system
        }
        return NONE_FLOW;
    }

    /**
     * (non-Javadoc).
     *
     * @param ior the ior
     * @return the i obligation rule
     */
    private IObligationRule removeActionMechanism (final IObligationRule ior)
    {
        return new ObligationRule (ior.getEventId (), ior.getObligationType (), ior.getMaintenanceMode (), "", "",
                ior.getDefaultDays ());
    }

    /**
     * (non-Javadoc)
     * Check to see there is an active obligation for the case.
     *
     * @return true, if successful
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private boolean checkActiveObligationsForCase () throws BusinessException, SystemException
    {
        Element obligationResult = null;
        try
        {
            if ( !isEmpty (caseNumber))
            {
                obligationResult = determineServiceForCheckActiveObligationsForCase ();

                final Element activeObligationElement =
                        (Element) obligationTypePath.selectSingleNode (obligationResult);

                if (isEmpty (activeObligationElement.getText ()) ||
                        activeObligationElement.getText ().equals (NON_ACTIVE_OBLIGATIONS) ||
                        activeObligationElement.getText ().equals (NO_ACTIVE_OBLIGATIONS))
                {
                    return false;
                }
                else if (activeObligationElement.getText ().equals (ACTIVE_OBLIGATIONS))
                {
                    return true;
                }
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
        return false;
    }

    /**
     * (non-Javadoc)
     * Determine service for checking there is an active obligation for the case and invoke it.
     *
     * @return the element
     * @throws SystemException the system exception
     * @throws BusinessException the business exception
     */
    private Element determineServiceForCheckActiveObligationsForCase () throws SystemException, BusinessException
    {
        final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());
        XMLBuilder.addParam (paramsElement, "caseNumber", caseNumber);

        if (eventType.equals (CASEEVENT_FLAG))
        {
            XMLBuilder.addParam (paramsElement, "eventType", CASEEVENT_FLAG);
            return invokeLocalServiceProxy (OBLIGATION_SERVICE, DETERMINE_ACTIVE_OBLIGATION,
                    paramsElement.getDocument ()).getRootElement ();
        }
        else if (eventType.equals (AEEVENT_FLAG))
        {
            XMLBuilder.addParam (paramsElement, "eventType", AEEVENT_FLAG);
            return invokeLocalServiceProxy (OBLIGATION_SERVICE, DETERMINE_ACTIVE_OBLIGATION,
                    paramsElement.getDocument ()).getRootElement ();
        }
        else
        {
            throw new SystemException ("Event Type is not listed = " + eventType);
        }
    }

    /**
     * (non-Javadoc)
     * Increment default days.
     *
     * @param ior the ior
     * @return the string
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private String incrementDefaultDays (final IObligationRule ior) throws BusinessException, SystemException
    {
        final GregorianCalendar gCal = callSystemDateService ();
        gCal.add (Calendar.DATE, ior.getDefaultDays ());
        checkWeekEndDay (gCal);
        checkNonWorkingDay (gCal);
        return formatDate (gCal.getTime ());
    }

    /**
     * (non-Javadoc)
     * Format date to yyyy-MM-dd.
     *
     * @param pDate the date
     * @return the string
     */
    private String formatDate (final Date pDate)
    {
        SimpleDateFormat dateFormat = null;
        dateFormat = new SimpleDateFormat ("yyyy-MM-dd");
        dateFormat.applyPattern ("yyyy-MM-dd");
        return dateFormat.format (pDate);
    }

    /**
     * (non-Javadoc)
     * Format date to yyyy-MM-dd.
     *
     * @param pDate the date
     * @return the string
     * @throws ParseException the parse exception
     */
    private String formatDate (final String pDate) throws ParseException
    {
        SimpleDateFormat dateFormat = null;
        dateFormat = new SimpleDateFormat ("yyyy-MM-dd");
        dateFormat.applyPattern ("yyyy-MM-dd");
        Date parseDate = null;

        parseDate = dateFormat.parse (pDate);

        return dateFormat.format (parseDate);
    }

    /**
     * (non-Javadoc)
     * Format date to yyyy-MM-dd.
     *
     * @param pDate the date
     * @return the gregorian calendar
     * @throws ParseException the parse exception
     */
    private GregorianCalendar formatParseDate (final String pDate) throws ParseException
    {
        SimpleDateFormat dateFormat = null;
        dateFormat = new SimpleDateFormat ("yyyy-MM-dd");
        dateFormat.applyPattern ("yyyy-MM-dd");
        Date parseDate = null;

        parseDate = dateFormat.parse (pDate);

        final GregorianCalendar gCal = new GregorianCalendar ();
        gCal.setTime (parseDate);
        return gCal;
    }

    /**
     * (non-Javadoc)
     * Check to see if the day is a non working day.
     *
     * @param gCal the g cal
     * @return the gregorian calendar
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private GregorianCalendar checkNonWorkingDay (final GregorianCalendar gCal)
        throws BusinessException, SystemException
    {
        callNonWorkingDaysService (gCal);
        return gCal;
    }

    /**
     * (non-Javadoc)
     * Call a service to see if the day is a non working day.
     *
     * @param gCal the g cal
     * @return the gregorian calendar
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private GregorianCalendar callNonWorkingDaysService (final GregorianCalendar gCal)
        throws BusinessException, SystemException
    {
        Element nonWorkingResult = null;

        try
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());

            nonWorkingResult = invokeLocalServiceProxy (NON_WORKING_DAYS_SERVICE, GET_NON_WORKING_DAYS,
                    paramsElement.getDocument ()).getRootElement ();
            final List<Element> nonWorkinList = nonWorkingSequencePath.selectNodes (nonWorkingResult);

            final Iterator<Element> it = nonWorkinList.iterator ();
            Element nonWorkingSingle;
            while (it.hasNext ())
            {
                nonWorkingSingle = (Element) it.next ();
                if (nonWorkingSingle != null)
                {
                    if (formatDate (nonWorkingSingle.getText ()).equals (formatDate (gCal.getTime ())))
                    {
                        gCal.add (Calendar.DATE, 1);
                        checkWeekEndDay (gCal); // Easter + Christmas
                    }
                }
            }
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
        catch (final ParseException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
        return gCal;
    }

    /**
     * (non-Javadoc)
     * Get the database server date/time.
     *
     * @return the gregorian calendar
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    private GregorianCalendar callSystemDateService () throws BusinessException, SystemException
    {
        Element systemDate = null;

        try
        {
            final Element paramsElement = XMLBuilder.getNewParamsElement (new Document ());

            systemDate = invokeLocalServiceProxy (SYSTEM_DATE_SERVICE, GET_SYSTEM_DATE, paramsElement.getDocument ())
                    .getRootElement ();
            final Element systemDateEl = (Element) systemDatePath.selectSingleNode (systemDate);

            if (isEmpty (systemDateEl.getText ()))
            {
                throw new SystemException ("No System date found ");
            }
            return formatParseDate (systemDateEl.getText ());
        }
        catch (final JDOMException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
        catch (final ParseException e)
        {
            throw new SystemException ("Unable to write to output: " + e.getMessage (), e);
        }
    }

    /**
     * (non-Javadoc)
     * Check to see if the day is a weekend day.
     *
     * @param gCal the g cal
     * @return the gregorian calendar
     */
    private GregorianCalendar checkWeekEndDay (final GregorianCalendar gCal)
    {

        if (gCal.get (Calendar.SATURDAY) != Calendar.SATURDAY &&
                gCal.get (Calendar.SUNDAY) != Calendar.SUNDAY)
        {
            return gCal;
        }
        else if (gCal.get (Calendar.SATURDAY) == Calendar.SATURDAY)
        {
            gCal.add (Calendar.DATE, 2);
            return gCal;
        }
        else if (gCal.get (Calendar.SUNDAY) == Calendar.SUNDAY)
        {
            gCal.add (Calendar.DATE, 1);
            return gCal;
        }
        return gCal;
    }

    /**
     * Checks if is empty.
     *
     * @param s the s
     * @return true, if is empty
     */
    private boolean isEmpty (final String s)
    {
        return s == null || "".equals (s);
    }

    /**
     * Gets the XML string.
     *
     * @param e the e
     * @return the XML string
     */
    private String getXMLString (final Document e)
    {
        return out.outputString (e.getRootElement ());
    }

    /**
     * (non-Javadoc)
     * Create an obligationRuleXML element with children.
     *
     * @return the string
     */
    private String toXML ()
    {
        final StringBuffer strBuf = new StringBuffer ();
        addXMLTag (strBuf, OBLIGATION_TAG, false);
        addXMLTagValues (strBuf, actionFlow, ACTIONFLOW_TAG);

        if ( !isEmpty (obligatinRuleXML))
        {
            addXMLTagValues (strBuf, caseNumber, CASENUMBER_TAG);
            addXMLTagValues (strBuf, eventID, EVENTID_TAG);
            addXMLTagValues (strBuf, eventType, EVENTTYPE_TAG);
            addXMLTagValues (strBuf, eventSeq, EVENTSEQUENCE_TAG);
            strBuf.append (obligatinRuleXML);
        }

        addXMLTag (strBuf, OBLIGATION_TAG, true);
        return strBuf.toString ();
    }

    /**
     * (non-Javadoc)
     * Add start tag, value and end tag to a stringbuffer.
     *
     * @param strBuf the str buf
     * @param val the val
     * @param constant the constant
     */
    private void addXMLTagValues (final StringBuffer strBuf, final String val, final String constant)
    {
        addXMLTag (strBuf, constant, false);
        strBuf.append (val);
        addXMLTag (strBuf, constant, true);
    }

    /**
     * (non-Javadoc)
     * Add start or end tag to a buffer.
     *
     * @param strBuf the str buf
     * @param constant the constant
     * @param endTag the end tag
     */
    private void addXMLTag (final StringBuffer strBuf, final String constant, final boolean endTag)
    {
        strBuf.append (STARTTAG);
        if (endTag)
        {
            strBuf.append (SLASH);
        }
        strBuf.append (constant);
        strBuf.append (ENDTAG);
    }

    /**
     * (non-Javadoc)
     * Invoke a local service.
     *
     * @param pJndiName the jndi name
     * @param pMethodName the method name
     * @param pInputDoc the input doc
     * @return the document
     * @throws BusinessException the business exception
     * @throws SystemException the system exception
     */
    protected Document invokeLocalServiceProxy (final String pJndiName, final String pMethodName,
                                                final Document pInputDoc)
        throws BusinessException, SystemException
    {
        if (log.isDebugEnabled ())
        {
            log.debug ("SERVICE=" + pJndiName + ":" + pMethodName);
            log.debug ("CONTEXT=" + this.m_context);
            log.debug ("PARAMS=" + out.outputString (pInputDoc));
        }

        Document outputDoc = null;
        ComponentInput inputHolder = null;
        ComponentInput outputHolder = null;

        inputHolder = new ComponentInput (this.m_context.getInputConverterFactory ());
        inputHolder.setData (pInputDoc, Document.class);
        outputHolder = new ComponentInput (this.m_context.getInputConverterFactory ());

        proxy.invoke (pJndiName, pMethodName + "2", this.m_context, inputHolder, outputHolder);

        outputDoc = (Document) outputHolder.getData (Document.class);

        return outputDoc;
    } // invokeLocalServiceProxy()

}
