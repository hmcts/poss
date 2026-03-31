// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * 
 * import junit.framework.TestCase;
 * 
 * import java.util.Date;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Document;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestNullPayment extends TestCase {
 * 
 * private Payment payment;
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
 * payment = Payment.getPayment("12", "367", adaptor);
 * }
 * 
 * public void testNullPayment() throws Exception
 * {
 * payment.populateReportData();
 * payment.populateTransactionNumber();
 * payment.refreshPayment();
 * payment.delete();
 * assertFalse("payment doesn't exist", payment.exists());
 * assertEquals("admin court", "", payment.getAdminCourt());
 * assertEquals("amount", 0, payment.getAmount(), 0);
 * assertEquals("amount currency", "", payment.getAmountCurrency());
 * assertEquals("amount now due", 0, payment.getAmountNowDue(), 0);
 * assertTrue(payment.getAoPassthrough() instanceof NullPayment);
 * assertEquals("ao trans no", "",
 * payment.getAoPassthroughTransactionNumber());
 * assertEquals("case no", "", payment.getCaseNumber());
 * assertEquals("co type", "", payment.getCoType());
 * assertEquals("created by", "", payment.getCreatedBy());
 * assertEquals("debt seq", "", payment.getDebtSeq());
 * assertEquals("enf court", "", payment.getEnforcementCourt());
 * assertEquals("enf no", "", payment.getEnforcementNumber());
 * assertEquals("enf type", "", payment.getEnforcementType());
 * assertEquals("executing court", "", payment.getExecutingCourt());
 * assertEquals("issuing court", "", payment.getIssuingCourt());
 * assertEquals("issuing court name", "", payment.getIssuingCourtName());
 * assertEquals("notes", "", payment.getNotes());
 * assertEquals("number defendants", 0, payment.getNumberDefendants());
 * assertEquals("number events", 0, payment.getNumberEvents());
 * assertEquals("old amount", 0, payment.getOldAmount(), 0);
 * assertEquals("old ret type", "", payment.getOldRetentionType());
 * assertEquals("overpay amount", 0, payment.getOverpaymentAmount(), 0);
 * assertEquals("overpay currency", "",
 * payment.getOverpaymentAmountCurrency());
 * assertEquals("payment type", "", payment.getPaymentType());
 * assertNull("payout date", payment.getPayoutDate());
 * assertEquals("payout rep id", "", payment.getPayoutReportId());
 * assertEquals("po no 1", "", payment.getPoNumber1());
 * assertEquals("po no 2", "", payment.getPoNumber2());
 * assertEquals("po total", 0, payment.getPoTotal(), 0);
 * assertEquals("po currency", "", payment.getPoTotalCurrency());
 * assertNull("rd date", payment.getRdDate());
 * assertEquals("rel admin court", "", payment.getRelatedAdminCourt());
 * assertEquals("rel trans no", "", payment.getRelatedTransactionNumber());
 * assertEquals("rep id", "", payment.getReportId());
 * assertEquals("rep no", "", payment.getReportNumber());
 * assertEquals("rep type", "", payment.getReportType());
 * assertEquals("retention type", "", payment.getRetentionType());
 * assertEquals("trans no", "", payment.getTransactionNumber());
 * assertEquals("ver rep id", "", payment.getVerificationReportId());
 * assertEquals("warrant id", "", payment.getWarrantId());
 * assertFalse("bailiff knowledge", payment.hasBailiffKnowledge());
 * assertFalse("financial changes", payment.haveFinancialDetailsChanged());
 * assertFalse("adhoc", payment.isAdhocReport());
 * assertFalse("ae", payment.isAePayment());
 * assertFalse("amendment", payment.isAmendmentReport());
 * assertFalse("case", payment.isCasePayment());
 * assertFalse("co", payment.isCoPayment());
 * assertFalse("counter payment", payment.isCounterPayment());
 * assertFalse("errored", payment.isError());
 * assertFalse("execution warrant", payment.isExecutionWarrant());
 * assertFalse("overpayment report", payment.isOverpaymentReport());
 * assertFalse("passthrough", payment.isPassthrough());
 * assertFalse("recepit required", payment.isReceiptRequired());
 * assertFalse("verification report", payment.isVerificationReport());
 * assertFalse("warrant", payment.isWarrantPayment());
 * payment.save();
 * assertFalse("old error", payment.wasOldError());
 * 
 * payment.setReportNumber("asd");
 * assertEquals("rep no after set", "", payment.getReportNumber());
 * 
 * control.verify();
 * }
 * 
 * public void testDates() throws Exception
 * {
 * Date paymentDate = Payment.getSupsDateFormat().parse("1970-01-01");
 * assertEquals("payment date", paymentDate, payment.getPaymentDate());
 * 
 * Date releaseDate = Payment.getSupsDateFormat().parse("2999-01-01");
 * assertEquals("release date", releaseDate, payment.getReleaseDate());
 * }
 * 
 * public void testParties()
 * {
 * Party[] parties = {payment.getLodgmentParty(), payment.getPayee(),
 * payment.getOverpayee()};
 * 
 * for(int i = 0; i < parties.length; ++i) {
 * Party p = parties[i];
 * 
 * for(int y = 0; y < p.getNumberAllowedAddressLines(); ++y) {
 * assertEquals("address " + y, "", p.getAddressLine(y));
 * }
 * assertEquals("post code", "", p.getAddressPostCode());
 * assertEquals("reference", "", p.getAddressReference());
 * assertEquals("case party no", "", p.getCasePartyNumber());
 * assertEquals("coded party code", "", p.getCodedPartyCode());
 * assertEquals("dx", "", p.getDxNumber());
 * assertEquals("name", "", p.getName());
 * assertEquals("party id", "", p.getPartyId());
 * assertEquals("party role code", "", p.getPartyRoleCode());
 * }
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestNullPayment.class);
 * }
 * 
 * }
 * //[enddef] */