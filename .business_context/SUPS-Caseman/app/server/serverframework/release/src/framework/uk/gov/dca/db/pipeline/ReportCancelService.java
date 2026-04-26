/*
 * Created on 01-Aug-2005
 *
 */
package uk.gov.dca.db.pipeline;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.xpath.XPath;

import uk.gov.dca.db.exception.BusinessException;
import uk.gov.dca.db.exception.SystemException;
import uk.gov.dca.db.queryengine.QueryEngineErrorHandler;
import uk.gov.dca.db.report.Report;
import uk.gov.dca.db.report.ReportFactory;
import uk.gov.dca.db.report.ReportManager;

/**
 * Service to handle the cancelation a report or a group of reports.
 * 
 * @author Michael Barker
 *
 */
public class ReportCancelService extends AbstractComponent2 implements IGenerator {

    private static final String XPATH_ATTR = "xpath";
    private DataSource m_reportQueueStore;
    private ReportManager rMgr;
    private static final String DATASOURCE_ELEMENT = "ReportStore";
    private static final String ID_ATTR = "id";
    private XPath xpath = null;
    
    protected void process() throws BusinessException, SystemException {
        
        try {
            Document d = (Document)this.m_inputData.getData(Document.class);
            
            Element eParam = (Element) xpath.selectSingleNode(d);
            List children = eParam.getChildren();
            if (children.size() > 0) {
                Element eReference = (Element) children.get(0);
                String idStr = eReference.getChildText("Id");
                
                if (idStr != null) {
                    long id = Long.parseLong(idStr);
                    Report report = rMgr.load(id);
                    if (report != null) {
                        report.setStatus(Report.Status.CANCELLED);
                        report.setPrintStatus(Report.Status.CANCELLED);
                        report.setSendStatus(Report.Status.CANCELLED);
                        
                        if (report.getIsParent()) {
                            for (Iterator i = report.getChildren().iterator(); i.hasNext();) {
                                Report child = (Report) i.next();
                                child.setStatus(Report.Status.CANCELLED);
                                child.setPrintStatus(Report.Status.CANCELLED);
                                child.setSendStatus(Report.Status.CANCELLED);
                            }
                        }
                        
                        rMgr.save(report);
                        String out = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" +
                    		ReportFactory.createResponse(report);

                        this.m_outputData.setData(out, String.class);                      
                    }
                    else {
                        throw new BusinessException("Unable to find report for Id: " + id);
                    }
                }
                else {
                    throw new BusinessException("Unable to get Id for report reference");
                }
            }
            else {
                throw new BusinessException("Report Reference not found");
            }
        }
        catch (JDOMException e) {
            throw new SystemException("Unable to get input for Cancel Report", e);            
        }
    }

    public void validate(String methodId, QueryEngineErrorHandler handler,
            Element processingInstructions, Map preloadCache)
            throws SystemException {
        // TODO Auto-generated method stub

    }

    public void preloadCache(Element processingInstructions, Map preloadCache)
            throws SystemException {
        // TODO Auto-generated method stub

    }

    public void prepare(Element processingInstructions, Map preloadCache)
            throws SystemException {

        try {
            xpath = XPath.newInstance(processingInstructions.getAttributeValue(XPATH_ATTR));
        }
        catch (JDOMException e) {
            throw new SystemException(e);
        }
        
        Element dataSrcElement = processingInstructions.getChild(DATASOURCE_ELEMENT);
        if ( dataSrcElement != null ) {
            String dsId = dataSrcElement.getAttributeValue(ID_ATTR);
            if ( dsId != null && dsId.length() > 0) {
                m_reportQueueStore = (DataSource)preloadCache.get(dsId);
                rMgr = new ReportManager(m_reportQueueStore);
            }
            else {
                throw new SystemException("DataSource for report store is not defined");
            }
        }
        else {
            throw new SystemException("DataSource for report store is not defined");
        }        
    }

}
