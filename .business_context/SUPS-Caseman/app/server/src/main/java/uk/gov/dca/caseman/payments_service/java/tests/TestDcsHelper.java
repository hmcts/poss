// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * 
 * import junit.framework.TestCase;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import uk.gov.dca.caseman.payments_service.java.helpers.DcsHelper;
 * import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
 * import uk.gov.dca.caseman.payments_service.java.util.ServiceCaller;
 * 
 * public class TestDcsHelper extends TestCase {
 * 
 * private Element dcsDom;
 * private Element dcsDataNode;
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private String paramString;
 * private SAXBuilder sb;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * 
 * dcsDom = new Element("DCSDOM");
 * dcsDom.addContent(new Element("DCSData"));
 * dcsDataNode = dcsDom.getChild("DCSData");
 * dcsDataNode.addContent(new Element("ItemDate").setText("A"));
 * dcsDataNode.addContent(new Element("ReportId").setText("B"));
 * dcsDataNode.addContent(new Element("Transaction").setText("C"));
 * dcsDataNode.addContent(new Element("Ordinary").setText("D"));
 * dcsDataNode.addContent(new Element("OrdinaryCurrency").setText("E"));
 * dcsDataNode.addContent(new Element("Cheque").setText("F"));
 * dcsDataNode.addContent(new Element("ChequeCurrency").setText("G"));
 * dcsDataNode.addContent(new Element("JGMT1000").setText("H"));
 * dcsDataNode.addContent(new Element("JGMT1000Currency").setText("I"));
 * dcsDataNode.addContent(new Element("AOCAEO").setText("J"));
 * dcsDataNode.addContent(new Element("AOCAEOCurrency").setText("K"));
 * dcsDataNode.addContent(new Element("Miscellaneous").setText("L"));
 * dcsDataNode.addContent(
 * new Element("MiscellaneousCurrency").setText("M"));
 * dcsDataNode.addContent(new Element("InOut").setText("N"));
 * dcsDataNode.addContent(new Element("UserID").setText("O"));
 * dcsDataNode.addContent(new Element("CourtCode").setText("P"));
 * 
 * paramString = "<params><param name=\"dcsData\">"
 * + "<DCSDOM><DCSData>"
 * + "<ItemDate>A</ItemDate>"
 * + "<ReportId>B</ReportId>"
 * + "<Transaction>C</Transaction>"
 * + "<Ordinary>D</Ordinary>"
 * + "<OrdinaryCurrency>E</OrdinaryCurrency>"
 * + "<Cheque>F</Cheque>"
 * + "<ChequeCurrency>G</ChequeCurrency>"
 * + "<JGMT1000>H</JGMT1000>"
 * + "<JGMT1000Currency>I</JGMT1000Currency>"
 * + "<AOCAEO>J</AOCAEO>"
 * + "<AOCAEOCurrency>K</AOCAEOCurrency>"
 * + "<Miscellaneous>L</Miscellaneous>"
 * + "<MiscellaneousCurrency>M</MiscellaneousCurrency>"
 * + "<InOut>N</InOut>"
 * + "<UserID>O</UserID>"
 * + "<CourtCode>P</CourtCode>"
 * + "</DCSData></DCSDOM>"
 * + "</param></params>";
 * 
 * control = MockControl.createControl(ServiceAdaptor.class);
 * control.setDefaultMatcher(new ElementMatcher());
 * adaptor = (ServiceAdaptor)control.getMock();
 * 
 * sb = new SAXBuilder();
 * }
 * 
 * public void testForceInsert() throws Exception
 * {
 * Document doc = sb.build(new StringReader(paramString));
 * Element params = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "insertDcsRecordLocal2", params);
 * control.setReturnValue(new Document());
 * 
 * control.replay();
 * 
 * DcsHelper.logDcsData(dcsDom, true, adaptor);
 * 
 * control.verify();
 * }
 * 
 * public void testNonForceInsert() throws Exception
 * {
 * Document doc = sb.build(new StringReader(paramString));
 * Element params = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "logDcsRecordLocal2", params);
 * control.setReturnValue(new Document());
 * 
 * control.replay();
 * 
 * DcsHelper.logDcsData(dcsDom, false, adaptor);
 * 
 * control.verify();
 * }
 * 
 * public void testNullDcsDom() throws Exception
 * {
 * try {
 * DcsHelper.logDcsData(null, true, new ServiceCaller(null));
 * fail("didn't throw an exception");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testNullServiceAdaptor() throws Exception
 * {
 * try {
 * DcsHelper.logDcsData(dcsDom, true, null);
 * fail("didn't throw an exception");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestDcsHelper.class);
 * }
 * 
 * }
 * //[enddef] */
