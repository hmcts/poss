// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * import java.util.List;
 * 
 * import junit.framework.TestCase;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestPaymentConstructor extends TestCase {
 * 
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private SAXBuilder sb;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * control = MockControl.createControl(ServiceAdaptor.class);
 * control.setDefaultMatcher(new ElementMatcher());
 * adaptor = (ServiceAdaptor)control.getMock();
 * sb = new SAXBuilder();
 * }
 * 
 * public void testGetPaymentNoExists() throws Exception
 * {
 * String payParamsString = "<params><param name=\"transactionNumber\">12"
 * + "</param><param name=\"courtCode\">367</param></params>";
 * Document doc = sb.build(new StringReader(payParamsString));
 * Element payParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal", "getPaymentLocal2",
 * payParams);
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * Payment p = Payment.getPayment("12", "367", adaptor);
 * assertTrue(p instanceof NullPayment);
 * 
 * control.verify();
 * }
 * 
 * public void testScnFlag()
 * {
 * Element payEl1 = new Element("Payment");
 * assertFalse("just root node", new Payment(payEl1, adaptor).exists());
 * 
 * Element payEl2 = new Element("Payment").addContent(new Element("SCNF"));
 * assertFalse("misspelled SCN", new Payment(payEl2, adaptor).exists());
 * 
 * Element payEl3 = new Element("Payment").addContent(new Element("SCN"));
 * assertTrue("SCN", new Payment(payEl3, adaptor).exists());
 * 
 * Element payEl4 = new Element("Payment").addContent(
 * new Element("SurrogateSCN"));
 * assertTrue("surrogate SCN", new Payment(payEl4, adaptor).exists());
 * }
 * 
 * public void testInvalidElement()
 * {
 * try {
 * new Payment(new Element(""), adaptor);
 * fail("should have thrown IllegalArgumentException for unnamed El");
 * }
 * catch(IllegalArgumentException e) {}
 * 
 * try {
 * new Payment(new Element("Payments"), adaptor);
 * fail("should have thrown IllegalArgumentException for Payments El");
 * }
 * catch(IllegalArgumentException e) {}
 * }
 * 
 * public void testNullElement()
 * {
 * try {
 * new Payment(null, adaptor);
 * fail("should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testNullServiceAdaptor()
 * {
 * try {
 * new Payment(new Element("Payment"), null);
 * fail("should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testParseElements()
 * {
 * Element payments = new Element("Payments");
 * payments.addContent(new Element("Payment").addContent(
 * new Element("TransactionNumber").setText("0")));
 * payments.addContent(new Element("Payment").addContent(
 * new Element("TransactionNumber").setText("1")));
 * payments.addContent(new Element("Payment").addContent(
 * new Element("TransactionNumber").setText("2")));
 * payments.addContent(new Element("Payment").addContent(
 * new Element("TransactionNumber").setText("3")));
 * List l = Payment.parseElements(payments, adaptor);
 * assertEquals("list size", 4, l.size());
 * for(int i = 0; i < l.size(); ++i) {
 * String no = Integer.toString(i);
 * Payment payment = (Payment)l.get(i);
 * assertEquals("payment " + no, no, payment.getTransactionNumber());
 * }
 * }
 * 
 * public void testParseElementsNoChildPayments()
 * {
 * Element payments = new Element("Payments");
 * payments.addContent(new Element("Pay"));
 * payments.addContent(new Element("asdjla"));
 * payments.addContent(new Element("Paymentjhs"));
 * payments.addContent(new Element("A354"));
 * List l = Payment.parseElements(new Element("Payments"), adaptor);
 * assertEquals("list size", 0, l.size());
 * }
 * 
 * public void testParseElementsInvalidPayments()
 * {
 * try {
 * Payment.parseElements(new Element("Paymentsadd"), adaptor);
 * fail("should have thrown IllegalArgumentException");
 * }
 * catch(IllegalArgumentException e) {}
 * }
 * 
 * public void testParseElementsNullAdaptor()
 * {
 * try {
 * Payment.parseElements(new Element("Payments"), null);
 * fail("should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testParseElementsNullPayments()
 * {
 * try {
 * Payment.parseElements(null, adaptor);
 * fail("should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testGetPassthroughPaymentsNullAdaptor() throws Exception
 * {
 * try {
 * Payment.getPassthroughPayments("A", "D", "B", null);
 * fail("should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public void testGetPassthroughPayments() throws Exception
 * {
 * String paymentParamString = "<params>"
 * + "<param name=\"enforcementType\">C</param>"
 * + "<param name=\"enforcementCourt\">D</param>"
 * + "<param name=\"enforcementNumber\">B</param>"
 * + "</params>";
 * Document doc = sb.build(new StringReader(paymentParamString));
 * Element paymentParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getPassthroughPaymentsLocal2", paymentParams);
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * Payment.getPassthroughPayments("B", "D", "C", adaptor);
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestPaymentConstructor.class);
 * }
 * 
 * }
 * //[enddef] */