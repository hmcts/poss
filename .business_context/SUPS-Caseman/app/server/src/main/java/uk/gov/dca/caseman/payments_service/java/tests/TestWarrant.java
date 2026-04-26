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
 * public class TestWarrant extends TestCase {
 * 
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
 * + "<param name=\"enforcementType\">HOME WARRANT"
 * + "</param></params>";
 * SAXBuilder sb = new SAXBuilder();
 * Document doc = sb.build(new StringReader(paramString));
 * params = doc.getRootElement();
 * 
 * Element paymentEl = new Element("Payment");
 * paymentEl.addContent(new Element("EnforcementCourt").setText("A"));
 * paymentEl.addContent(new Element("EnforcementType")
 * .setText("HOME WARRANT"));
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
 * enforcementEl.addContent(new Element("Type").setText("HOME WARRANT"));
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
 * public void testIsWarrant() throws Exception
 * {
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", params);
 * control.setReturnValue(new Document(enforcementEl));
 * 
 * control.replay();
 * 
 * Enforcement warrant = Enforcement.getInstance(payment, adaptor);
 * assertTrue(warrant instanceof Warrant);
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestWarrant.class);
 * }
 * 
 * }
 * //[enddef] */