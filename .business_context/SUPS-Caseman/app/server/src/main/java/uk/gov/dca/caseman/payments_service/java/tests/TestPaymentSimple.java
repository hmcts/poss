// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * import java.text.SimpleDateFormat;
 * 
 * import org.jdom.Document;
 * import org.jdom.Element;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestPaymentSimple extends TestPayment {
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * }
 * 
 * public void testPartyGetters()
 * {
 * Party lodgment = p.getLodgmentParty();
 * assertEquals("lodg name", "LA", lodgment.getName());
 * assertEquals("lodg role code", "LB", lodgment.getPartyRoleCode());
 * assertEquals("lodg party no", "LC", lodgment.getCasePartyNumber());
 * assertEquals("lodg address line 1", "LD1", lodgment.getAddressLine(0));
 * assertEquals("lodg address line 2", "LD2", lodgment.getAddressLine(1));
 * assertEquals("lodg address line 3", "LD3", lodgment.getAddressLine(2));
 * assertEquals("lodg address line 4", "LD4", lodgment.getAddressLine(3));
 * assertEquals("lodg address line 5", "LD5", lodgment.getAddressLine(4));
 * assertEquals("lodg post code", "LE", lodgment.getAddressPostCode());
 * assertEquals("lodg reference", "LF", lodgment.getAddressReference());
 * 
 * Party payee = p.getPayee();
 * assertEquals("payee name", "PA", payee.getName());
 * assertEquals("payee code", "PB", payee.getCodedPartyCode());
 * assertEquals("payee party id", "PC", payee.getPartyId());
 * assertEquals("payee address line 1", "PD1", payee.getAddressLine(0));
 * assertEquals("payee address line 2", "PD2", payee.getAddressLine(1));
 * assertEquals("payee address line 3", "PD3", payee.getAddressLine(2));
 * assertEquals("payee address line 4", "PD4", payee.getAddressLine(3));
 * assertEquals("payee address line 5", "PD5", payee.getAddressLine(4));
 * assertEquals("payee post code", "PE", payee.getAddressPostCode());
 * assertEquals("payee reference", "PF", payee.getAddressReference());
 * assertEquals("payee DX", "PG", payee.getDxNumber());
 * 
 * Party overpayee = p.getOverpayee();
 * assertEquals("ovp name", "OA", overpayee.getName());
 * assertEquals("ovp address line 1", "OB1", overpayee.getAddressLine(0));
 * assertEquals("ovp address line 2", "OB2", overpayee.getAddressLine(1));
 * assertEquals("ovp address line 3", "OB3", overpayee.getAddressLine(2));
 * assertEquals("ovp address line 4", "OB4", overpayee.getAddressLine(3));
 * assertEquals("ovp address line 5", "OB5", overpayee.getAddressLine(4));
 * assertEquals("ovp post code", "OC", overpayee.getAddressPostCode());
 * }
 * 
 * public void testDateGetters()
 * {
 * SimpleDateFormat sf = Payment.getSupsDateFormat();
 * 
 * assertEquals("pay date", "2006-07-08", sf.format(p.getPaymentDate()));
 * assertEquals("rel date", "2006-08-08", sf.format(p.getReleaseDate()));
 * assertEquals("out date", "2006-08-09", sf.format(p.getPayoutDate()));
 * assertNull("rddate", p.getRdDate());
 * }
 * 
 * public void testSimpleGettersSetters()
 * {
 * assertEquals("trans no", "6", p.getTransactionNumber());
 * assertEquals("enforce no", "B", p.getEnforcementNumber());
 * assertEquals("enforce type", "C", p.getEnforcementType());
 * assertEquals("amount", 4.25, p.getAmount(), 0);
 * assertEquals("amount currency", "5.1", p.getAmountCurrency());
 * assertEquals("payment type", "D", p.getPaymentType());
 * assertEquals("retention type", "E", p.getRetentionType());
 * assertEquals("overpayment amount", 1.25, p.getOverpaymentAmount(), 0);
 * assertEquals("overpay currency", "F", p.getOverpaymentAmountCurrency());
 * assertEquals("amount now due", 7.77, p.getAmountNowDue(), 0);
 * assertTrue("is counter payment", p.isCounterPayment());
 * assertEquals("notes", "G", p.getNotes());
 * assertEquals("po number 1", "H", p.getPoNumber1());
 * assertEquals("po number 2", "I", p.getPoNumber2());
 * assertEquals("po total", 3.54, p.getPoTotal(), 0);
 * assertEquals("po currency", "J", p.getPoTotalCurrency());
 * assertTrue("receipt is required", p.isReceiptRequired());
 * assertTrue("bailiff knowledge required", p.hasBailiffKnowledge());
 * assertEquals("enforcement court", "K", p.getEnforcementCourt());
 * assertEquals("admin court", "L", p.getAdminCourt());
 * assertEquals("issuing court", "M", p.getIssuingCourt());
 * assertEquals("issuing court name", "N", p.getIssuingCourtName());
 * assertEquals("ver rep id", "O", p.getVerificationReportId());
 * assertEquals("created by", "P", p.getCreatedBy());
 * assertTrue("is passthrough", p.isPassthrough());
 * assertTrue("is error", p.isError());
 * assertEquals("related trans no", "Q", p.getRelatedTransactionNumber());
 * assertEquals("related admin court", "R", p.getRelatedAdminCourt());
 * assertEquals("ao trans no", "4", p.getAoPassthroughTransactionNumber());
 * assertEquals("payout report id", "T", p.getPayoutReportId());
 * assertEquals("debt seq", "U", p.getDebtSeq());
 * assertEquals("old ret type", "E", p.getOldRetentionType());
 * assertEquals("old amount", 4.25, p.getOldAmount(), 0);
 * assertTrue("old error", p.wasOldError());
 * assertEquals("report type", "Y", p.getReportType());
 * 
 * assertEquals("report no before set", "X", p.getReportNumber());
 * p.setReportNumber("ASD");
 * assertEquals("report no after set", "ASD", p.getReportNumber());
 * 
 * Element el = p.toElement();
 * assertNotSame("toEl not same", paymentEl, el);
 * assertTrue("toEl", new ElementMatcher().argumentMatches(paymentEl, el));
 * }
 * 
 * public void testIsReportMethods()
 * {
 * assertFalse("not ver rep", p.isVerificationReport());
 * assertFalse("not adhoc", p.isAdhocReport());
 * assertFalse("not amendment", p.isAmendmentReport());
 * assertFalse("not overpayment", p.isOverpaymentReport());
 * 
 * paymentEl.getChild("ReportType").setText("PREC");
 * assertTrue("prec", p.isVerificationReport());
 * paymentEl.getChild("ReportType").setText("BVER");
 * assertTrue("bver", p.isVerificationReport());
 * paymentEl.getChild("ReportType").setText("CVER");
 * assertTrue("cver", p.isVerificationReport());
 * paymentEl.getChild("ReportType").setText("PVER");
 * assertTrue("pver", p.isVerificationReport());
 * paymentEl.getChild("ReportType").setText("ADH");
 * assertTrue("adh", p.isAdhocReport());
 * paymentEl.getChild("ReportType").setText("AMR");
 * assertTrue("amr", p.isAmendmentReport());
 * paymentEl.getChild("ReportType").setText("OVP");
 * assertTrue("ovp", p.isOverpaymentReport());
 * }
 * 
 * public void testIsEnforcementMethods()
 * {
 * assertFalse("not co", p.isCoPayment());
 * assertFalse("not ae", p.isAePayment());
 * assertFalse("not case", p.isCasePayment());
 * assertFalse("not warrant", p.isWarrantPayment());
 * 
 * paymentEl.getChild("EnforcementType").setText("CO");
 * assertTrue("co", p.isCoPayment());
 * paymentEl.getChild("EnforcementType").setText("AE");
 * assertTrue("ae", p.isAePayment());
 * paymentEl.getChild("EnforcementType").setText("CASE");
 * assertTrue("case", p.isCasePayment());
 * paymentEl.getChild("EnforcementType").setText("HOME WARRANT");
 * assertTrue("home warrant", p.isWarrantPayment());
 * paymentEl.getChild("EnforcementType").setText("FOREIGN WARRANT");
 * assertTrue("foreign warrant", p.isWarrantPayment());
 * }
 * 
 * public void testDeleteNoExists() throws Exception
 * {
 * control.replay();
 * 
 * p.delete();
 * 
 * control.verify();
 * }
 * 
 * public void testDeleteExists() throws Exception
 * {
 * paymentEl.addContent(new Element("SCN"));
 * p = new Payment(paymentEl, adaptor);
 * 
 * String paymentParamsString = "<params>"
 * + "<param name=\"transactionNumber\">6</param>"
 * + "<param name=\"courtCode\">L</param></params>";
 * Document doc = sb.build(new StringReader(paymentParamsString));
 * Element paymentParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal", "deletePaymentLocal2",
 * paymentParams);
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * assertTrue("before delete", p.exists());
 * p.delete();
 * assertFalse("after delete", p.exists());
 * 
 * control.verify();
 * }
 * 
 * public void testHaveFinancialDetailsChanged()
 * {
 * assertFalse(p.haveFinancialDetailsChanged());
 * }
 * 
 * public void testHaveFinancialDetailsChangedDifferentAmounts()
 * {
 * paymentEl.getChild("Amount").setText("2.78");
 * assertTrue(p.haveFinancialDetailsChanged());
 * }
 * 
 * public void testHaveFinancialDetailsChangedDifferentRetTypes()
 * {
 * paymentEl.getChild("RetentionType").setText("VBJKDS");
 * assertTrue(p.haveFinancialDetailsChanged());
 * }
 * 
 * public void testHaveFinancialDetailsChangedRdDatePresent()
 * {
 * paymentEl.getChild("RDDate").setText("2005-05-09");
 * assertTrue(p.haveFinancialDetailsChanged());
 * }
 * 
 * public void testHaveFinancialDetailsChangedErrorChanged()
 * {
 * paymentEl.getChild("Error").setText("N");
 * assertTrue(p.haveFinancialDetailsChanged());
 * }
 * 
 * public void testPopulateTransactionNumberNotPresent() throws Exception
 * {
 * paymentEl.getChild("TransactionNumber").setText("");
 * 
 * adaptor.getNextSequenceNumber("TRANSACTION NO", "L");
 * control.setReturnValue("12");
 * 
 * control.replay();
 * 
 * p.populateTransactionNumber();
 * assertEquals("trans no", "12", p.getTransactionNumber());
 * 
 * control.verify();
 * }
 * 
 * public void testPopulateTransactionNumberPresent() throws Exception
 * {
 * p.populateTransactionNumber();
 * assertEquals("trans no", "6", p.getTransactionNumber());
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestPaymentSimple.class);
 * }
 * 
 * }
 * //[enddef] */