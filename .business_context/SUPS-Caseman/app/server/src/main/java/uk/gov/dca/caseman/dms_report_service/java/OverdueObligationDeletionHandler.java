/**
 * Service: DmsReport
 * Method: deleteOverdueObligations()
 * Class: OverdueObligationDeletionHandler.java
 * 
 * @author Chris Vincent
 *         Created: 17 January 2013
 * 
 *         Description:
 *         Dynamically produces a SQL statement based on criteria supplied by the customer for
 *         deleting overdue obligations and then updates via a prepared statement.
 * 
 *         Change History:
 * 
 */

package uk.gov.dca.caseman.dms_report_service.java;

import java.io.IOException;
import java.io.Writer;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.logging.Log;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.pipeline.ICustomProcessor;
import uk.gov.dca.db.util.SUPSLogFactory;

/**
 * The Class OverdueObligationDeletionHandler.
 */
public class OverdueObligationDeletionHandler implements ICustomProcessor
{

    /** The Constant log. */
    private static final Log log = SUPSLogFactory.getLogger (OverdueObligationDeletionHandler.class);

    /**
     * {@inheritDoc}
     */
    public void setContext (final uk.gov.dca.db.pipeline.IComponentContext ctx)
    {
    }

    /**
     * (non-Javadoc).
     *
     * @param inputParameters the input parameters
     * @param writerObj the writer obj
     * @param pLog the log
     * @throws SystemException the system exception
     * @see uk.gov.dca.db.pipeline.ICustomProcessor#process(org.jdom.Document, java.io.Writer,
     *      org.apache.commons.logging.Log)
     */
    public void process (final org.jdom.Document inputParameters, final Writer writerObj, final Log pLog)
        throws SystemException
    {
        log.debug ("Starting process in DataProcessor");
        final XMLOutputter outputter = new XMLOutputter ();
        if (log.isDebugEnabled ())
        {
            log.debug (outputter.outputString (inputParameters));
        }
        try
        {
            final Element courtCodeNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='CourtCode']");
            String owningCourtCode = null;
            if (null != courtCodeNode)
            {
                owningCourtCode = courtCodeNode.getValue ();
            }

            final Element startDateNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='startDate']");
            String startDate = null;
            if (null != startDateNode)
            {
                startDate = startDateNode.getValue ();
            }

            final Element endDateNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='endDate']");
            String endDate = null;
            if (null != endDateNode)
            {
                endDate = endDateNode.getValue ();
            }

            final Element obligTypeNode =
                    (Element) XPath.selectSingleNode (inputParameters, "/params/param[@name='obligationType']");
            String obligationType = null;
            if (null != obligTypeNode)
            {
                obligationType = obligTypeNode.getValue ();
            }

            final StringBuffer buffer = new StringBuffer ();

            buffer.append ("UPDATE OBLIGATIONS OB ");
            buffer.append ("SET  OB.DELETE_FLAG = 'Y' ");
            buffer.append ("WHERE OB.CASE_NUMBER IN ( ");
            buffer.append ("		SELECT C.CASE_NUMBER FROM CASES C ");
            buffer.append ("		WHERE C.ADMIN_CRT_CODE = " + owningCourtCode + " ");
            buffer.append ("		AND C.CASE_NUMBER = OB.CASE_NUMBER) ");

            if (null != startDate && !startDate.equals ("") && null != endDate && !endDate.equals (""))
            {
                buffer.append ("AND TRUNC(OB.EXPIRY_DATE) BETWEEN TO_DATE('" + startDate +
                        "','YYYY-MM-DD') AND TO_DATE('" + endDate + "','YYYY-MM-DD') ");
            }
            else
            {
                buffer.append ("AND TRUNC(SYSDATE) > TRUNC(OB.EXPIRY_DATE) ");
            }

            buffer.append ("AND OB.DELETE_FLAG = 'N' ");

            if (null != obligationType && !obligationType.equals (""))
            {
                buffer.append ("AND OB.OBLIGATION_TYPE = " + obligationType + " ");
            }

            final Context ctx = new InitialContext ();
            if (ctx == null)
            {
                throw new SystemException ("Could not retrieve Context.");
            }
            final DataSource ds = (DataSource) ctx.lookup ("java:OracleDS");
            if (ds != null)
            {
                try (final Connection conn = ds.getConnection ())
                {
                    if (conn != null)
                    {
                        try (PreparedStatement ps2 = conn.prepareStatement (buffer.toString ()))
                        {
                            ps2.execute ();
                        }
                    }
                    else
                    {
                        log.error ("Connection is null");
                    }
                }
            }
            else
            {
                log.error ("DataSource is null");
            }

            final StringBuffer sb = new StringBuffer ();
            sb.append ("<overdueObligationDeletion>Y</overdueObligationDeletion>");
            final String s = sb.toString ();
            writerObj.write (s);
        }
        catch (final IOException e)
        {
            throw new SystemException (e);
        }
        catch (final JDOMException e)
        {
            throw new SystemException (e);
        }
        catch (final SQLException e)
        {
            throw new SystemException (e);
        }
        catch (final NamingException e)
        {
            throw new SystemException (e);
        }
    }
}
