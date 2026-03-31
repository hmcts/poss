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
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestNullEnforcement extends TestCase {
 * 
 * private Enforcement enforcement;
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
 * 
 * String paramString =
 * "<params><param name=\"issuingCourt\">A</param>"
 * + "<param name=\"owningCourt\">A</param>"
 * + "<param name=\"enforcementNumber\">B</param>"
 * + "<param name=\"enforcementType\">C</param></params>";
 * Document doc = sb.build(new StringReader(paramString));
 * Element enfParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", enfParams);
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * Element paymentEl = new Element("Payment");
 * paymentEl.addContent(new Element("EnforcementCourt").setText("A"));
 * paymentEl.addContent(new Element("EnforcementType").setText("C"));
 * paymentEl.addContent(new Element("EnforcementNumber").setText("B"));
 * Payment payment = new Payment(paymentEl, adaptor);
 * 
 * enforcement = Enforcement.getInstance(payment, adaptor);
 * }
 * 
 * public void testNullEnforcement() throws Exception
 * {
 * assertEquals("case no", "", enforcement.getCaseNumber());
 * assertEquals("co type", "", enforcement.getCoType());
 * assertEquals("court code", "", enforcement.getCourtCode());
 * assertEquals("enf number", "", enforcement.getEnforcementNumber());
 * assertEquals("enf type", "", enforcement.getEnforcementType());
 * assertEquals("number defendants", 0, enforcement.getNumberDefendants());
 * assertEquals("number events", 0, enforcement.getNumberEvents());
 * assertEquals("balance", 0, enforcement.getOutstandingBalance(), 0);
 * assertEquals("war ex court", "",
 * enforcement.getWarrantExecutingCourt());
 * assertEquals("war id", "", enforcement.getWarrantId());
 * assertEquals("war iss court", "", enforcement.getWarrantIssuingCourt());
 * assertEquals("war type", "", enforcement.getWarrantType());
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestNullEnforcement.class);
 * }
 * 
 * }
 * //[enddef] */