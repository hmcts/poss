// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * import java.util.Date;
 * 
 * import junit.framework.TestCase;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import uk.gov.dca.caseman.payments_service.java.helpers.BmsHelper;
 * import uk.gov.dca.caseman.payments_service.java.util.Payment;
 * import uk.gov.dca.caseman.payments_service.java.util.ServiceAdaptor;
 * import uk.gov.dca.caseman.payments_service.java.util.ServiceCaller;
 * 
 * public class TestBmsHelper extends TestCase {
 * 
 * private Element paymentEl;
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private String paramString;
 * private SAXBuilder sb;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * 
 * paymentEl = new Element("Payment");
 * paymentEl.addContent(new Element("AdminCourt").setText("367"));
 * paymentEl.addContent(new Element("CreatedBy").setText("anonymous"));
 * paymentEl.addContent(
 * new Element("RelatedTransactionNumber"));
 * paymentEl.addContent(new Element("RDDate"));
 * paymentEl.addContent(new Element("Passthrough").setText("N"));
 * paymentEl.addContent(new Element("EnforcementType").setText("AE"));
 * 
 * paramString = "<params>"
 * + "<param name=\"section\">PAYMENT</param>"
 * + "<param name=\"courtCode\">367</param>"
 * + "<param name=\"receiptDate\">"
 * + Payment.getSupsDateFormat().format(new Date())
 * + "</param>"
 * + "<param name=\"processingDate\">"
 * + Payment.getSupsDateFormat().format(new Date())
 * + "</param>"
 * + "<param name=\"taskType\">B</param>"
 * + "<param name=\"userId\">anonymous</param>";
 * 
 * control = MockControl.createControl(ServiceAdaptor.class);
 * control.setDefaultMatcher(new ElementMatcher());
 * adaptor = (ServiceAdaptor)control.getMock();
 * 
 * sb = new SAXBuilder();
 * }
 * 
 * public void testDefaultPayment() throws Exception
 * {
 * paramString +=
 * "<param name=\"paymentType\">PAYMENT</param>"
 * + "</params>";
 * 
 * callLogBms();
 * }
 * 
 * public void testRdDatePopulated() throws Exception
 * {
 * paramString +=
 * "<param name=\"paymentType\">RD CHQ</param>"
 * + "</params>";
 * paymentEl.getChild("RDDate").setText("2006-05-06");
 * 
 * callLogBms();
 * }
 * 
 * public void testPassthroughNoRelatedTransNumber() throws Exception
 * {
 * paramString +=
 * "<param name=\"paymentType\">PASSTHROUGH</param>"
 * + "</params>";
 * paymentEl.getChild("Passthrough").setText("Y");
 * 
 * callLogBms();
 * }
 * 
 * public void testPassthroughWithRelatedTransNumber() throws Exception
 * {
 * paramString +=
 * "<param name=\"paymentType\">PAYMENT</param>"
 * + "</params>";
 * paymentEl.getChild("Passthrough").setText("Y");
 * paymentEl.getChild("RelatedTransactionNumber").setText("1234");
 * 
 * callLogBms();
 * }
 * 
 * public void testCoPayment() throws Exception
 * {
 * paramString +=
 * "<param name=\"paymentType\">AO/CAEO PAYMENT</param>"
 * + "</params>";
 * paymentEl.getChild("EnforcementType").setText("CO");
 * 
 * callLogBms();
 * }
 * 
 * private void callLogBms() throws Exception
 * {
 * Payment payment = new Payment(paymentEl, adaptor);
 * 
 * Document doc = sb.build(new StringReader(paramString));
 * Element params = doc.getRootElement();
 * 
 * adaptor.callService("ejb/BmsServiceLocal",
 * "addBmsRuleNonEventLocal2", params);
 * control.setReturnValue(new Document());
 * 
 * control.replay();
 * 
 * BmsHelper.logBms(payment, adaptor);
 * 
 * control.verify();
 * }
 * 
 * public void testNullPayment() throws Exception
 * {
 * try {
 * BmsHelper.logBms(null, new ServiceCaller(null));
 * fail("didn't throw an exception");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testNullServiceAdaptor() throws Exception
 * {
 * try {
 * Payment payment = new Payment(paymentEl, null);
 * BmsHelper.logBms(payment, null);
 * fail("didn't throw an exception");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestBmsHelper.class);
 * }
 * 
 * }
 * //[enddef] */