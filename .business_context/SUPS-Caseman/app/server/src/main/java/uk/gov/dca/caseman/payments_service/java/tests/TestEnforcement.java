// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import junit.framework.TestCase;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestEnforcement extends TestCase {
 * 
 * private Enforcement enforcement;
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private Element params;
 * private Payment payment;
 * private Element enforcementEl;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * control = MockControl.createControl(ServiceAdaptor.class);
 * control.setDefaultMatcher(new ElementMatcher());
 * adaptor = (ServiceAdaptor)control.getMock();
 * 
 * String paramString =
 * "<params><param name=\"issuingCourt\">A</param>"
 * + "<param name=\"owningCourt\">A</param>"
 * + "<param name=\"enforcementNumber\">B</param>"
 * + "<param name=\"enforcementType\">C</param></params>";
 * SAXBuilder sb = new SAXBuilder();
 * Document doc = sb.build(new StringReader(paramString));
 * params = doc.getRootElement();
 * 
 * Element paymentEl = new Element("Payment");
 * paymentEl.addContent(new Element("EnforcementCourt").setText("A"));
 * paymentEl.addContent(new Element("EnforcementType").setText("C"));
 * paymentEl.addContent(new Element("EnforcementNumber").setText("B"));
 * payment = new Payment(paymentEl, adaptor);
 * 
 * enforcementEl = new Element("Enforcement");
 * enforcementEl.addContent(new Element("OutstandingBalance")
 * .setText("12.52"));
 * enforcementEl.addContent(new Element("WarrantID").setText("123"));
 * enforcementEl.addContent(new Element("NumberEvents").setText("3"));
 * enforcementEl.addContent(new Element("CaseNumber").setText("ADS"));
 * enforcementEl.addContent(new Element("WarrantType").setText("ZXC"));
 * enforcementEl.addContent(new Element("WarrantExecutingCourt")
 * .setText("111"));
 * enforcementEl.addContent(new Element("WarrantIssuingCourt")
 * .setText("222"));
 * enforcementEl.addContent(new Element("COType").setText("AO"));
 * enforcementEl.addContent(new Element("Type").setText("AE"));
 * enforcementEl.addContent(new Element("CourtCode").setText("367"));
 * enforcementEl.addContent(new Element("Number").setText("132DF"));
 * enforcementEl.addContent(new Element("Parties"));
 * Element parties = enforcementEl.getChild("Parties");
 * parties.addContent(new Element("Party").addContent(
 * new Element("Role").setText("PARTY AGAINST")));
 * parties.addContent(new Element("Party").addContent(
 * new Element("Role").setText("ASDSDD")));
 * parties.addContent(new Element("Party").addContent(
 * new Element("Role").setText("PARTY AGAINST")));
 * parties.addContent(new Element("Party").addContent(
 * new Element("Role").setText("PARTY AG213AINST")));
 * }
 * 
 * public void testValidEnforcement() throws Exception
 * {
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", params);
 * control.setReturnValue(new Document(enforcementEl));
 * 
 * control.replay();
 * 
 * enforcement = Enforcement.getInstance(payment, adaptor);
 * 
 * assertEquals(12.52, enforcement.getOutstandingBalance(), 0);
 * assertEquals("123", enforcement.getWarrantId());
 * assertEquals(3, enforcement.getNumberEvents());
 * assertEquals("ADS", enforcement.getCaseNumber());
 * assertEquals("ZXC", enforcement.getWarrantType());
 * assertEquals("111", enforcement.getWarrantExecutingCourt());
 * assertEquals("222", enforcement.getWarrantIssuingCourt());
 * assertEquals("AO", enforcement.getCoType());
 * assertEquals("AE", enforcement.getEnforcementType());
 * assertEquals("367", enforcement.getCourtCode());
 * assertEquals("132DF", enforcement.getEnforcementNumber());
 * assertEquals(2, enforcement.getNumberDefendants());
 * 
 * control.verify();
 * }
 * 
 * public void testNullEnforcement() throws Exception
 * {
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", params);
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * enforcement = Enforcement.getInstance(payment, adaptor);
 * assertTrue(enforcement instanceof NullEnforcement);
 * 
 * control.verify();
 * }
 * 
 * public void testNullFactoryArguments() throws Exception
 * {
 * try {
 * Enforcement.getInstance(null, adaptor);
 * fail("null payment should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * 
 * try {
 * Enforcement.getInstance(payment, null);
 * fail("null adaptor should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestEnforcement.class);
 * }
 * 
 * }
 * //[enddef] */