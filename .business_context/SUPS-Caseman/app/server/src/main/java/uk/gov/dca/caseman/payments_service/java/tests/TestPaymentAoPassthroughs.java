// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * import java.text.SimpleDateFormat;
 * 
 * import org.jdom.Element;
 * import org.jdom.Document;
 * import org.jdom.input.SAXBuilder;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestPaymentAoPassthroughs extends TestPayment {
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * }
 * 
 * public void testGetAoPassthroughExistsErrorOff() throws Exception
 * {
 * paymentEl.getChild("OldError").setText("Y");
 * paymentEl.getChild("Error").setText("N");
 * paymentEl.getChild("RDDate").setText("2006-05-04");
 * 
 * setupGetPayment();
 * setupGetWarrant("98765432", "HOME WARRANT", "", "0.67");
 * 
 * control.replay();
 * 
 * Payment ao = p.getAoPassthrough();
 * 
 * // These are the only fields that should have been altered.
 * paymentEl.getChild("OldError").setText("N");
 * paymentEl.getChild("OldAmount").setText("4.25");
 * paymentEl.getChild("OldRetentionType").setText("E");
 * paymentEl.getChild("ReportType").setText("");
 * paymentEl.getChild("ReportNumber").setText("");
 * paymentEl.getChild("Error").setText("Y");
 * 
 * assertTrue(new ElementMatcher().argumentMatches(
 * ao.toElement(), p.toElement()));
 * 
 * control.verify();
 * }
 * 
 * public void testGetAoPassthroughExistsChange() throws Exception
 * {
 * paymentEl.getChild("OldError").setText("Y");
 * paymentEl.getChild("Error").setText("N");
 * 
 * setupGetPayment();
 * setupGetWarrant("98765432", "HOME WARRANT", "", "0.67");
 * 
 * control.replay();
 * 
 * Payment ao = p.getAoPassthrough();
 * 
 * // These are the only fields that should have been altered.
 * paymentEl.getChild("OldError").setText("N");
 * paymentEl.getChild("OldAmount").setText("4.25");
 * paymentEl.getChild("OldRetentionType").setText("E");
 * paymentEl.getChild("ReportType").setText("");
 * paymentEl.getChild("ReportNumber").setText("");
 * paymentEl.getChild("Amount").setText("0.67");
 * 
 * assertTrue(new ElementMatcher().argumentMatches(
 * ao.toElement(), p.toElement()));
 * 
 * control.verify();
 * }
 * 
 * public void testGetAoPassthroughExistsNoChange() throws Exception
 * {
 * paymentEl.getChild("WarrantID").setText("");
 * 
 * setupGetPayment();
 * 
 * control.replay();
 * 
 * Payment ao = p.getAoPassthrough();
 * assertTrue(new ElementMatcher().argumentMatches(
 * ao.toElement(), p.toElement()));
 * 
 * control.verify();
 * };
 * 
 * public void testGetAoPassthroughNoExistsNegBalance() throws Exception
 * {
 * paymentEl.getChild("AOPassthroughTransactionNumber").setText("");
 * paymentEl.getChild("AdminCourt").setText("333");
 * paymentEl.getChild("Error").setText("N");
 * paymentEl.getChild("RDDate").setText("2452-05-09");
 * 
 * setupGetWarrant("45673133", "FOREIGN WARRANT", "45673133", "-51.25");
 * 
 * control.replay();
 * 
 * Payment ao = p.getAoPassthrough();
 * 
 * assertEquals("amount", 0, ao.getAmount(), 0);
 * assertEquals("enforcement court", "222", ao.getEnforcementCourt());
 * assertTrue("is error", ao.isError());
 * 
 * control.verify();
 * }
 * 
 * public void testGetAoPassthroughNoExists() throws Exception
 * {
 * paymentEl.getChild("AOPassthroughTransactionNumber").setText("");
 * paymentEl.getChild("AdminCourt").setText("333");
 * 
 * setupGetWarrant("98765432", "HOME WARRANT", "", "1.25");
 * 
 * control.replay();
 * 
 * Payment ao = p.getAoPassthrough();
 * 
 * assertEquals("trans no", "", ao.getTransactionNumber());
 * assertEquals("enforce no", "98765432", ao.getEnforcementNumber());
 * assertEquals("enforce type", "HOME WARRANT", ao.getEnforcementType());
 * assertEquals("amount", 1.25, ao.getAmount(), 0);
 * assertEquals("amount currency", "5.1", ao.getAmountCurrency());
 * assertEquals("payment type", "", ao.getPaymentType());
 * assertEquals("retention type", "AO/CAEO", ao.getRetentionType());
 * assertEquals("overpayment amount", 0, ao.getOverpaymentAmount(), 0);
 * assertEquals("overpay currency", "", ao.getOverpaymentAmountCurrency());
 * assertEquals("amount now due", 7.77, ao.getAmountNowDue(), 0);
 * assertFalse("isn't counter payment", ao.isCounterPayment());
 * assertEquals("notes", "", ao.getNotes());
 * assertEquals("po number 1", "", ao.getPoNumber1());
 * assertEquals("po number 2", "", ao.getPoNumber2());
 * assertEquals("po total", 0, ao.getPoTotal(), 0);
 * assertEquals("po currency", "", ao.getPoTotalCurrency());
 * assertFalse("receipt is not required", ao.isReceiptRequired());
 * assertFalse("bailiff knowledge not required", ao.hasBailiffKnowledge());
 * assertEquals("enforcement court", "111", ao.getEnforcementCourt());
 * assertEquals("admin court", "333", ao.getAdminCourt());
 * assertEquals("issuing court", "M", ao.getIssuingCourt());
 * assertEquals("issuing court name", "N", ao.getIssuingCourtName());
 * assertEquals("ver rep id", "", ao.getVerificationReportId());
 * assertEquals("created by", "P", ao.getCreatedBy());
 * assertTrue("is passthrough", ao.isPassthrough());
 * assertTrue("is error", ao.isError());
 * assertEquals("related trans no", "6", ao.getRelatedTransactionNumber());
 * assertEquals("related admin court", "333", ao.getRelatedAdminCourt());
 * assertEquals("ao trans no", "", ao.getAoPassthroughTransactionNumber());
 * assertEquals("payout report id", "", ao.getPayoutReportId());
 * assertEquals("debt seq", "", ao.getDebtSeq());
 * assertEquals("old ret type", "", ao.getOldRetentionType());
 * assertEquals("old amount", 0, ao.getOldAmount(), 0);
 * assertFalse("not old error", ao.wasOldError());
 * assertEquals("report type", "", ao.getReportType());
 * assertEquals("report no", "", ao.getReportNumber());
 * assertFalse("doesn't exist", ao.exists());
 * 
 * SimpleDateFormat sf = Payment.getSupsDateFormat();
 * assertEquals("pay date", "2006-07-08", sf.format(ao.getPaymentDate()));
 * assertNull("rel date", ao.getReleaseDate());
 * assertNull("payout date", ao.getPayoutDate());
 * assertNull("rddate", ao.getRdDate());
 * 
 * Party lodgment = ao.getLodgmentParty();
 * assertEquals("lodg name", "", lodgment.getName());
 * assertEquals("lodg role code", "", lodgment.getPartyRoleCode());
 * assertEquals("lodg party no", "", lodgment.getCasePartyNumber());
 * assertEquals("lodg address line 1", "", lodgment.getAddressLine(0));
 * assertEquals("lodg address line 2", "", lodgment.getAddressLine(1));
 * assertEquals("lodg address line 3", "", lodgment.getAddressLine(2));
 * assertEquals("lodg address line 4", "", lodgment.getAddressLine(3));
 * assertEquals("lodg address line 5", "", lodgment.getAddressLine(4));
 * assertEquals("lodg post code", "", lodgment.getAddressPostCode());
 * assertEquals("lodg reference", "", lodgment.getAddressReference());
 * 
 * Party payee = ao.getPayee();
 * assertEquals("payee name", "", payee.getName());
 * assertEquals("payee code", "", payee.getCodedPartyCode());
 * assertEquals("payee party id", "", payee.getPartyId());
 * assertEquals("payee address line 1", "", payee.getAddressLine(0));
 * assertEquals("payee address line 2", "", payee.getAddressLine(1));
 * assertEquals("payee address line 3", "", payee.getAddressLine(2));
 * assertEquals("payee address line 4", "", payee.getAddressLine(3));
 * assertEquals("payee address line 5", "", payee.getAddressLine(4));
 * assertEquals("payee post code", "", payee.getAddressPostCode());
 * assertEquals("payee reference", "", payee.getAddressReference());
 * assertEquals("payee DX", "", payee.getDxNumber());
 * 
 * Party overpayee = ao.getOverpayee();
 * assertEquals("ovp name", "", overpayee.getName());
 * assertEquals("ovp address line 1", "", overpayee.getAddressLine(0));
 * assertEquals("ovp address line 2", "", overpayee.getAddressLine(1));
 * assertEquals("ovp address line 3", "", overpayee.getAddressLine(2));
 * assertEquals("ovp address line 4", "", overpayee.getAddressLine(3));
 * assertEquals("ovp address line 5", "", overpayee.getAddressLine(4));
 * assertEquals("ovp post code", "", overpayee.getAddressPostCode());
 * 
 * control.verify();
 * }
 * 
 * public void testGetAoPassthroughNotNeeded() throws Exception
 * {
 * paymentEl.getChild("WarrantID").setText("");
 * paymentEl.getChild("AOPassthroughTransactionNumber").setText("");
 * Payment ao = p.getAoPassthrough();
 * assertTrue(ao instanceof NullPayment);
 * }
 * 
 * private void setupGetPayment() throws Exception
 * {
 * String payParamsString = "<params><param name=\"transactionNumber\">4"
 * + "</param><param name=\"courtCode\">L</param></params>";
 * Document doc = sb.build(new StringReader(payParamsString));
 * Element payParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal", "getPaymentLocal2",
 * payParams);
 * control.setReturnValue(new Document(p.toElement()));
 * }
 * 
 * private void setupGetWarrant(String number, String type,
 * String localNumber, String balance) throws Exception
 * {
 * String paramString = "<params><param name=\"warrantID\">1234"
 * + "</param></params>";
 * sb = new SAXBuilder();
 * Document doc = sb.build(new StringReader(paramString));
 * Element warrantParams = doc.getRootElement();
 * 
 * Element warrantSummary = new Element("ds").addContent(
 * new Element("Warrant"));
 * Element w = warrantSummary.getChild("Warrant");
 * w.addContent(new Element("WarrantNumber").setText("98765432"));
 * w.addContent(new Element("LocalNumber").setText(localNumber));
 * w.addContent(new Element("IssuedBy").setText("111"));
 * w.addContent(new Element("OwnedBy").setText("222"));
 * 
 * adaptor.callService("ejb/WarrantServiceLocal",
 * "getWarrantSummaryLocal2", warrantParams);
 * control.setReturnValue(new Document(warrantSummary));
 * 
 * String enforceParamString =
 * "<params><param name=\"issuingCourt\">111</param>"
 * + "<param name=\"owningCourt\">222</param>"
 * + "<param name=\"enforcementNumber\">" + number + "</param>"
 * + "<param name=\"enforcementType\">" + type
 * + "</param></params>";
 * doc = sb.build(new StringReader(enforceParamString));
 * Element enforcementParams = doc.getRootElement();
 * 
 * Element enforcementEl = new Element("Enforcement");
 * enforcementEl.addContent(
 * new Element("OutstandingBalance").setText(balance));
 * enforcementEl.addContent(new Element("WarrantID").setText("123"));
 * enforcementEl.addContent(new Element("NumberEvents").setText("3"));
 * enforcementEl.addContent(new Element("CaseNumber").setText("ADS"));
 * enforcementEl.addContent(new Element("Type").setText(type));
 * enforcementEl.addContent(new Element("Number").setText(number));
 * enforcementEl.addContent(new Element("CourtCode").setText("222"));
 * enforcementEl.addContent(
 * new Element("WarrantExecutingCourt").setText("222"));
 * enforcementEl.addContent(
 * new Element("WarrantIssuingCourt").setText("111"));
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
 * junit.textui.TestRunner.run(TestPaymentAoPassthroughs.class);
 * }
 * 
 * }
 * //[enddef] */