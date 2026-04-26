// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * import java.util.*;
 * 
 * import org.jdom.Element;
 * import org.jdom.Document;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestPaymentRefresh extends TestPayment {
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * }
 * 
 * public void testRefreshPaymentOverpaymentPassthroughNonCo() throws Exception
 * {
 * paymentEl.getChild("Error").setText("N");
 * paymentEl.getChild("ReportType").setText("BVER");
 * paymentEl.getChild("EnforcementType").setText("HOME WARRANT");
 * setupGetEnforcement("HOME WARRANT", "-15.21", "EXECUTION");
 * 
 * control.replay();
 * 
 * try {
 * p.refreshPayment();
 * fail("should have thrown IllegalStateException");
 * }
 * catch(IllegalStateException e) {}
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshPaymentOverpaymentPassthroughCo() throws Exception
 * {
 * paymentEl.getChild("Error").setText("N");
 * paymentEl.getChild("ReportType").setText("PREC");
 * paymentEl.getChild("EnforcementType").setText("CO");
 * setupGetEnforcement("CO", "-15.21", "ZXC");
 * 
 * control.replay();
 * 
 * p.refreshPayment();
 * 
 * assertEquals("overpayment amount", 0, p.getOverpaymentAmount(), 0);
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshPaymentOverpaymentRecorded1() throws Exception
 * {
 * paymentEl.getChild("Error").setText("N");
 * paymentEl.getChild("RDDate").setText("2006-02-12");
 * paymentEl.getChild("ReportType").setText("AMR");
 * paymentEl.getChild("EnforcementType").setText("AE");
 * paymentEl.getChild("Passthrough").setText("N");
 * setupGetEnforcement("AE", "-15.21", "ZXC");
 * 
 * control.replay();
 * 
 * p.refreshPayment();
 * 
 * assertEquals("amount due", -10.96, p.getAmountNowDue(), 0);
 * assertEquals("overpayment amount", 4.25, p.getOverpaymentAmount(), 0);
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshPaymentOverpaymentRecorded2() throws Exception
 * {
 * paymentEl.getChild("Error").setText("N");
 * paymentEl.getChild("ReportType").setText("CVER");
 * paymentEl.getChild("EnforcementType").setText("AE");
 * paymentEl.getChild("Passthrough").setText("N");
 * paymentEl.getChild("OldAmount").setText("");
 * setupGetEnforcement("AE", "1.78", "ZXC");
 * 
 * control.replay();
 * 
 * p.refreshPayment();
 * 
 * assertEquals("overpayment amount", 2.47, p.getOverpaymentAmount(), 0);
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshPaymentOverpaymentRecorded3() throws Exception
 * {
 * paymentEl.getChild("Error").setText("N");
 * paymentEl.getChild("ReportType").setText("AMR");
 * paymentEl.getChild("EnforcementType").setText("AE");
 * paymentEl.getChild("Passthrough").setText("N");
 * paymentEl.getChild("OldAmount").setText("1.50");
 * setupGetEnforcement("AE", "-1.02", "ZXC");
 * 
 * control.replay();
 * 
 * p.refreshPayment();
 * 
 * assertEquals("overpayment amount", 3.77, p.getOverpaymentAmount(), 0);
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshPaymentOverpaymentNotRecorded() throws Exception
 * {
 * paymentEl.getChild("ReportType").setText("PVER");
 * setupGetEnforcement("C", "-15.21", "ZXC");
 * 
 * control.replay();
 * 
 * p.refreshPayment();
 * 
 * assertEquals("amount due", -10.96, p.getAmountNowDue(), 0);
 * assertEquals("overpayment amount", 0, p.getOverpaymentAmount(), 0);
 * 
 * control.verify();
 * }
 * 
 * public void testRefreshPayment() throws Exception
 * {
 * paymentEl.getChild("Error").setText("N");
 * setupGetEnforcement("C", "12.52", "ZXC");
 * 
 * control.replay();
 * 
 * p.refreshPayment();
 * 
 * assertEquals("amount due", 12.52, p.getAmountNowDue(), 0);
 * assertEquals("warrant id", "123", p.getWarrantId());
 * assertEquals("number events", 3, p.getNumberEvents());
 * assertEquals("case number", "ADS", p.getCaseNumber());
 * assertEquals("number defendants", 2, p.getNumberDefendants());
 * assertEquals("executing court", "K", p.getExecutingCourt());
 * assertEquals("co type", "AO", p.getCoType());
 * assertEquals("overpayment amount", 1.25, p.getOverpaymentAmount(), 0);
 * 
 * Element el = p.toElement();
 * assertEquals("warrant type", "ZXC", el.getChildText("WarrantType"));
 * assertEquals("system date",
 * Payment.getSupsDateFormat().format(new Date()),
 * el.getChildText("SystemDate"));
 * 
 * control.verify();
 * }
 * 
 * private void setupGetEnforcement(String type, String balance,
 * String warrantType) throws Exception
 * {
 * String enforceParamString =
 * "<params><param name=\"issuingCourt\">K</param>"
 * + "<param name=\"owningCourt\">K</param>"
 * + "<param name=\"enforcementNumber\">B</param>"
 * + "<param name=\"enforcementType\">" + type
 * + "</param></params>";
 * Document doc = sb.build(new StringReader(enforceParamString));
 * Element enforcementParams = doc.getRootElement();
 * 
 * Element enforcementEl = new Element("Enforcement");
 * enforcementEl.addContent(
 * new Element("OutstandingBalance").setText(balance));
 * enforcementEl.addContent(new Element("WarrantID").setText("123"));
 * enforcementEl.addContent(new Element("NumberEvents").setText("3"));
 * enforcementEl.addContent(new Element("CaseNumber").setText("ADS"));
 * enforcementEl.addContent(new Element("Type").setText(type));
 * enforcementEl.addContent(new Element("Number").setText("B"));
 * enforcementEl.addContent(new Element("CourtCode").setText("222"));
 * enforcementEl.addContent(
 * new Element("WarrantType").setText(warrantType));
 * enforcementEl.addContent(
 * new Element("WarrantExecutingCourt").setText("K"));
 * enforcementEl.addContent(
 * new Element("WarrantIssuingCourt").setText("K"));
 * enforcementEl.addContent(new Element("COType").setText("AO"));
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
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal", "getEnforcementLocal2",
 * enforcementParams);
 * control.setReturnValue(new Document(enforcementEl));
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestPaymentRefresh.class);
 * }
 * 
 * }
 * //[enddef] */