// Requires EasyMock 1.2 for Java 1.3 to run.
/* //[ifdef]
 * package uk.gov.dca.caseman.payments_service.java.tests;
 * 
 * import java.io.StringReader;
 * 
 * import org.jdom.Element;
 * import org.jdom.Document;
 * 
 * import uk.gov.dca.caseman.payments_service.java.util.*;
 * 
 * public class TestPaymentSave extends TestPayment {
 * 
 * private String paymentString;
 * 
 * protected void setUp() throws Exception
 * {
 * super.setUp();
 * 
 * paymentEl.getChild("OldAmount").setText(
 * paymentEl.getChildText("Amount"));
 * paymentEl.getChild("OldRetentionType").setText(
 * paymentEl.getChildText("RetentionType"));
 * paymentEl.getChild("RDDate").setText("");
 * 
 * paymentString = "<params><param name=\"payment\"><Payment>"
 * + "<TransactionNumber>6</TransactionNumber>"
 * + "<EnforcementNumber>B</EnforcementNumber>"
 * + "<EnforcementType>C</EnforcementType>"
 * + "<Amount>4.25</Amount>"
 * + "<AmountCurrency>5.1</AmountCurrency>"
 * + "<PaymentType>D</PaymentType>"
 * + "<RetentionType>E</RetentionType>"
 * + "<OverpaymentAmount>1.25</OverpaymentAmount>"
 * + "<OverpaymentAmountCurrency>F</OverpaymentAmountCurrency>"
 * + "<AmountNowDue>7.77</AmountNowDue>"
 * + "<CounterPayment>Y</CounterPayment>"
 * + "<PaymentDate>2006-07-08</PaymentDate>"
 * + "<ReleaseDate>2006-08-08</ReleaseDate>"
 * + "<PayoutDate>2006-08-09</PayoutDate>"
 * + "<RDDate></RDDate>"
 * + "<Notes>G</Notes>"
 * + "<Lodgment>"
 * + "<Name>LA</Name>"
 * + "<PartyRole>LB</PartyRole>"
 * + "<CasePartyNumber>LC</CasePartyNumber>"
 * + "<Address>"
 * + "<Line>LD1</Line>"
 * + "<Line>LD2</Line>"
 * + "<Line>LD3</Line>"
 * + "<Line>LD4</Line>"
 * + "<Line>LD5</Line>"
 * + "<PostCode>LE</PostCode>"
 * + "<Reference>LF</Reference>"
 * + "</Address>"
 * + "</Lodgment>"
 * + "<PONumber1>H</PONumber1>"
 * + "<PONumber2>I</PONumber2>"
 * + "<POTotal>3.54</POTotal>"
 * + "<POTotalCurrency>J</POTotalCurrency>"
 * + "<ReceiptRequired>Y</ReceiptRequired>"
 * + "<BailiffKnowledge>Y</BailiffKnowledge>"
 * + "<EnforcementCourt>K</EnforcementCourt>"
 * + "<AdminCourt>L</AdminCourt>"
 * + "<IssuingCourt>M</IssuingCourt>"
 * + "<IssuingCourtName>N</IssuingCourtName>"
 * + "<VerificationReportID>O</VerificationReportID>"
 * + "<CreatedBy>P</CreatedBy>"
 * + "<Payee>"
 * + "<Name>PA</Name>"
 * + "<Code>PB</Code>"
 * + "<PartyID>PC</PartyID>"
 * + "<Address>"
 * + "<Line>PD1</Line>"
 * + "<Line>PD2</Line>"
 * + "<Line>PD3</Line>"
 * + "<Line>PD4</Line>"
 * + "<Line>PD5</Line>"
 * + "<PostCode>PE</PostCode>"
 * + "<Reference>PF</Reference>"
 * + "</Address>"
 * + "<DX>PG</DX>"
 * + "</Payee>"
 * + "<Overpayee>"
 * + "<Name>OA</Name>"
 * + "<Address>"
 * + "<Line>OB1</Line>"
 * + "<Line>OB2</Line>"
 * + "<Line>OB3</Line>"
 * + "<Line>OB4</Line>"
 * + "<Line>OB5</Line>"
 * + "<PostCode>OC</PostCode>"
 * + "</Address>"
 * + "</Overpayee>"
 * + "<Passthrough>Y</Passthrough>"
 * + "<Error>Y</Error>"
 * + "<RelatedTransactionNumber>Q</RelatedTransactionNumber>"
 * + "<RelatedAdminCourt>R</RelatedAdminCourt>"
 * + "<AOPassthroughTransactionNumber>4"
 * + "</AOPassthroughTransactionNumber>"
 * + "<PayoutReportID>T</PayoutReportID>"
 * + "<DebtSeq>U</DebtSeq>"
 * + "<OldRetentionType>E</OldRetentionType>"
 * + "<OldAmount>4.25</OldAmount>"
 * + "<OldError>Y</OldError>"
 * + "<WarrantID>1234</WarrantID>"
 * + "<ReportNumber>X</ReportNumber>"
 * + "<ReportType>Y</ReportType>"
 * + "</Payment></param></params>";
 * }
 * 
 * public void testSaveExists() throws Exception
 * {
 * Element scnElement = new Element("SCN");
 * paymentEl.addContent(scnElement);
 * p = new Payment(paymentEl, adaptor);
 * // Hack - Remove SCN node so can use common paymentString from setup().
 * paymentEl.removeContent(scnElement);
 * 
 * Document doc = sb.build(new StringReader(paymentString));
 * Element paymentParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal", "updatePaymentLocal2",
 * paymentParams);
 * control.setReturnValue(new Document(p.toElement()));
 * 
 * control.replay();
 * 
 * assertTrue("before save", p.exists());
 * p.save();
 * assertTrue("after save", p.exists());
 * 
 * control.verify();
 * }
 * 
 * public void testSaveNoExists() throws Exception
 * {
 * Document doc = sb.build(new StringReader(paymentString));
 * Element paymentParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal", "createPaymentLocal2",
 * paymentParams);
 * control.setReturnValue(new Document(p.toElement()));
 * 
 * control.replay();
 * 
 * assertFalse("before save", p.exists());
 * p.save();
 * assertTrue("after save", p.exists());
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestPaymentSave.class);
 * }
 * 
 * }
 * //[enddef] */