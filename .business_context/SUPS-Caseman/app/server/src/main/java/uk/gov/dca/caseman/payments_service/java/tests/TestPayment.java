// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import junit.framework.TestCase;
 * 
 * import org.easymock.MockControl;
 * import org.jdom.Element;
 * import org.jdom.input.SAXBuilder;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestPayment extends TestCase {
 * 
 * MockControl control;
 * ServiceAdaptor adaptor;
 * Element paymentEl;
 * SAXBuilder sb;
 * Payment p;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * control = MockControl.createControl(ServiceAdaptor.class);
 * control.setDefaultMatcher(new ElementMatcher());
 * adaptor = (ServiceAdaptor)control.getMock();
 * sb = new SAXBuilder();
 * 
 * paymentEl = new Element("Payment");
 * paymentEl.addContent(new Element("TransactionNumber").setText("6"));
 * paymentEl.addContent(new Element("EnforcementNumber").setText("B"));
 * paymentEl.addContent(new Element("EnforcementType").setText("C"));
 * paymentEl.addContent(new Element("Amount").setText("4.25"));
 * paymentEl.addContent(new Element("AmountCurrency").setText("5.1"));
 * paymentEl.addContent(new Element("PaymentType").setText("D"));
 * paymentEl.addContent(new Element("RetentionType").setText("E"));
 * paymentEl.addContent(new Element("OverpaymentAmount").setText("1.25"));
 * paymentEl.addContent(
 * new Element("OverpaymentAmountCurrency").setText("F"));
 * paymentEl.addContent(new Element("AmountNowDue").setText("7.77"));
 * paymentEl.addContent(new Element("CounterPayment").setText("Y"));
 * paymentEl.addContent(new Element("PaymentDate").setText("2006-07-08"));
 * paymentEl.addContent(new Element("ReleaseDate").setText("2006-08-08"));
 * paymentEl.addContent(new Element("PayoutDate").setText("2006-08-09"));
 * paymentEl.addContent(new Element("RDDate").setText(""));
 * paymentEl.addContent(new Element("Notes").setText("G"));
 * 
 * paymentEl.addContent(new Element("Lodgment"));
 * Element lodgment = paymentEl.getChild("Lodgment");
 * lodgment.addContent(new Element("Name").setText("LA"));
 * lodgment.addContent(new Element("PartyRole").setText("LB"));
 * lodgment.addContent(new Element("CasePartyNumber").setText("LC"));
 * lodgment.addContent(new Element("Address"));
 * Element lodgmentAddress = lodgment.getChild("Address");
 * lodgmentAddress.addContent(new Element("Line").setText("LD1"));
 * lodgmentAddress.addContent(new Element("Line").setText("LD2"));
 * lodgmentAddress.addContent(new Element("Line").setText("LD3"));
 * lodgmentAddress.addContent(new Element("Line").setText("LD4"));
 * lodgmentAddress.addContent(new Element("Line").setText("LD5"));
 * lodgmentAddress.addContent(new Element("PostCode").setText("LE"));
 * lodgmentAddress.addContent(new Element("Reference").setText("LF"));
 * 
 * paymentEl.addContent(new Element("PONumber1").setText("H"));
 * paymentEl.addContent(new Element("PONumber2").setText("I"));
 * paymentEl.addContent(new Element("POTotal").setText("3.54"));
 * paymentEl.addContent(new Element("POTotalCurrency").setText("J"));
 * paymentEl.addContent(new Element("ReceiptRequired").setText("Y"));
 * paymentEl.addContent(new Element("BailiffKnowledge").setText("Y"));
 * paymentEl.addContent(new Element("EnforcementCourt").setText("K"));
 * paymentEl.addContent(new Element("AdminCourt").setText("L"));
 * paymentEl.addContent(new Element("IssuingCourt").setText("M"));
 * paymentEl.addContent(new Element("IssuingCourtName").setText("N"));
 * paymentEl.addContent(new Element("VerificationReportID").setText("O"));
 * paymentEl.addContent(new Element("CreatedBy").setText("P"));
 * 
 * paymentEl.addContent(new Element("Payee"));
 * Element payee = paymentEl.getChild("Payee");
 * payee.addContent(new Element("Name").setText("PA"));
 * payee.addContent(new Element("Code").setText("PB"));
 * payee.addContent(new Element("PartyID").setText("PC"));
 * payee.addContent(new Element("Address"));
 * payee.addContent(new Element("DX").setText("PG"));
 * Element payeeAddress = payee.getChild("Address");
 * payeeAddress.addContent(new Element("Line").setText("PD1"));
 * payeeAddress.addContent(new Element("Line").setText("PD2"));
 * payeeAddress.addContent(new Element("Line").setText("PD3"));
 * payeeAddress.addContent(new Element("Line").setText("PD4"));
 * payeeAddress.addContent(new Element("Line").setText("PD5"));
 * payeeAddress.addContent(new Element("PostCode").setText("PE"));
 * payeeAddress.addContent(new Element("Reference").setText("PF"));
 * 
 * paymentEl.addContent(new Element("Overpayee"));
 * Element overpayee = paymentEl.getChild("Overpayee");
 * overpayee.addContent(new Element("Name").setText("OA"));
 * overpayee.addContent(new Element("Address"));
 * Element overpayeeAddress = overpayee.getChild("Address");
 * overpayeeAddress.addContent(new Element("Line").setText("OB1"));
 * overpayeeAddress.addContent(new Element("Line").setText("OB2"));
 * overpayeeAddress.addContent(new Element("Line").setText("OB3"));
 * overpayeeAddress.addContent(new Element("Line").setText("OB4"));
 * overpayeeAddress.addContent(new Element("Line").setText("OB5"));
 * overpayeeAddress.addContent(new Element("PostCode").setText("OC"));
 * 
 * paymentEl.addContent(new Element("Passthrough").setText("Y"));
 * paymentEl.addContent(new Element("Error").setText("Y"));
 * paymentEl.addContent(
 * new Element("RelatedTransactionNumber").setText("Q"));
 * paymentEl.addContent(new Element("RelatedAdminCourt").setText("R"));
 * paymentEl.addContent(
 * new Element("AOPassthroughTransactionNumber").setText("4"));
 * paymentEl.addContent(new Element("PayoutReportID").setText("T"));
 * paymentEl.addContent(new Element("DebtSeq").setText("U"));
 * paymentEl.addContent(new Element("OldRetentionType").setText("E"));
 * paymentEl.addContent(new Element("OldAmount").setText("4.25"));
 * paymentEl.addContent(new Element("OldError").setText("Y"));
 * paymentEl.addContent(new Element("WarrantID").setText("1234"));
 * paymentEl.addContent(new Element("ReportNumber").setText("X"));
 * paymentEl.addContent(new Element("ReportType").setText("Y"));
 * 
 * p = new Payment(paymentEl, adaptor);
 * }
 * 
 * public void testPreventWarning() {} // Prevent JUnit no tests warning.
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestPayment.class);
 * }
 * 
 * }
 * //[enddef] */