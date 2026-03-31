// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * import java.util.Date;
 * 
 * import org.jdom.Document;
 * import org.jdom.Element;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestPaymentReportData extends TestPayment {
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * }
 * 
 * public void testPopulateReportDataNoReportNumberNotCver() throws Exception
 * {
 * paymentEl.getChild("ReportNumber").setText("0");
 * paymentEl.getChild("ReportType").setText("ADH");
 * 
 * adaptor.getNextSequenceNumber("ADH", "L");
 * control.setReturnValue("12");
 * 
 * control.replay();
 * 
 * assertTrue("new rep no generated", p.populateReportData());
 * assertEquals("report number", "12", p.getReportNumber());
 * assertEquals("report type", "ADH", p.getReportType());
 * assertEquals("report id", "ADH 12", p.getReportId());
 * assertEquals("payout id", "ADH 12", p.getPayoutReportId());
 * assertEquals("ver rep id", "O", p.getVerificationReportId());
 * 
 * control.verify();
 * }
 * 
 * public void testPopulateReportDataReportNumberPresentNotCver()
 * throws Exception
 * {
 * paymentEl.getChild("ReportNumber").setText("23");
 * paymentEl.getChild("ReportType").setText("BVER");
 * 
 * assertFalse("new rep no not generated", p.populateReportData());
 * assertEquals("report number", "23", p.getReportNumber());
 * assertEquals("report type", "BVER", p.getReportType());
 * assertEquals("report id", "BVER23", p.getReportId());
 * assertEquals("payout id", "T", p.getPayoutReportId());
 * // already a ver rep id so shouldn't overwrite
 * assertEquals("ver rep id", "O", p.getVerificationReportId());
 * }
 * 
 * public void testPopulateReportDataEmptyReportNumber() throws Exception
 * {
 * paymentEl.getChild("ReportNumber").setText("");
 * 
 * assertFalse("new rep no not generated", p.populateReportData());
 * assertEquals("report number", "", p.getReportNumber());
 * assertEquals("report type", "", p.getReportType());
 * assertEquals("report id", "", p.getReportId());
 * assertEquals("payout id", "T", p.getPayoutReportId());
 * assertEquals("ver rep id", "O", p.getVerificationReportId());
 * }
 * 
 * public void testPopulateReportDataReportNumberCver() throws Exception
 * {
 * paymentEl.getChild("ReportNumber").setText("12");
 * callPopulateReportIdCver();
 * }
 * 
 * public void testPopulateReportDataNoReportNumberCver() throws Exception
 * {
 * paymentEl.getChild("ReportNumber").setText("0");
 * callPopulateReportIdCver();
 * }
 * 
 * private void callPopulateReportIdCver() throws Exception
 * {
 * paymentEl.getChild("ReportType").setText("CVER");
 * paymentEl.getChild("VerificationReportID").setText("");
 * 
 * String paymentParamsString = "<params>"
 * + "<param name=\"reportDate\">"
 * + Payment.getSupsDateFormat().format(new Date())
 * + "</param>"
 * + "<param name=\"reportType\">CVER</param>"
 * + "<param name=\"userId\">P</param>"
 * + "<param name=\"courtId\">L</param>"
 * + "</params>";
 * Document doc = sb.build(new StringReader(paymentParamsString));
 * Element paymentParams = doc.getRootElement();
 * 
 * Element returnVal =
 * new Element("Results").addContent(
 * new Element("ReportData").addContent(
 * new Element("ReportNumber").setText("56")));
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal", "getReportDataLocal2",
 * paymentParams);
 * control.setReturnValue(new Document(returnVal));
 * 
 * control.replay();
 * 
 * assertFalse("new rep no not generated", p.populateReportData());
 * assertEquals("report number", "56", p.getReportNumber());
 * assertEquals("report type", "CVER", p.getReportType());
 * assertEquals("report id", "CVER56", p.getReportId());
 * assertEquals("payout id", "T", p.getPayoutReportId());
 * assertEquals("ver rep id", "CVER56", p.getVerificationReportId());
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestPaymentReportData.class);
 * }
 * 
 * }
 * //[enddef] */