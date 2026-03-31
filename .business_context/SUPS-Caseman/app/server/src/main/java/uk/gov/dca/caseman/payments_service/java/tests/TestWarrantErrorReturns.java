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
 * public class TestWarrantErrorReturns extends TestCase {
 * 
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private Element wrParams;
 * private Payment payment;
 * private Element enforcementEl;
 * private Element warrantReturns;
 * private SAXBuilder sb;
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
 * sb = new SAXBuilder();
 * Document doc = sb.build(new StringReader(paramString));
 * Element params = doc.getRootElement();
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
 * 
 * warrantReturns = new Element("ds");
 * warrantReturns.addContent(new Element("WarrantReturns")
 * .addContent(new Element("WarrantEvents")));
 * 
 * String wrParamsString = "<params><param name=\"warrantID\">123"
 * + "</param></params>";
 * doc = sb.build(new StringReader(wrParamsString));
 * wrParams = doc.getRootElement();
 * 
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", params);
 * control.setReturnValue(new Document(enforcementEl));
 * }
 * 
 * public void testNoWarrantReturns() throws Exception
 * {
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "getWarrantReturnsLocal2", wrParams);
 * control.setReturnValue(new Document(warrantReturns));
 * 
 * control.replay();
 * 
 * Warrant w = (Warrant)Enforcement.getInstance(payment, adaptor);
 * w.errorFullyPaidWarrantReturns();
 * 
 * control.verify();
 * }
 * 
 * public void testNo101WarrantReturns() throws Exception
 * {
 * populateWarrantReturns(0, 0, 34);
 * populateWarrantReturns(1, 1, 78);
 * populateWarrantReturns(2, 2, 136);
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "getWarrantReturnsLocal2", wrParams);
 * control.setReturnValue(new Document(warrantReturns));
 * 
 * control.replay();
 * 
 * Warrant w = (Warrant)Enforcement.getInstance(payment, adaptor);
 * w.errorFullyPaidWarrantReturns();
 * 
 * control.verify();
 * }
 * 
 * public void test101WarrantReturnsExist() throws Exception
 * {
 * String updateWrParamsString = "<params><param name=\"NewReturn\">"
 * + "<ds><WarrantReturns><WarrantEvents>"
 * + "<WarrantEvent>"
 * + "<WarrantID>A1</WarrantID>"
 * + "<WarrantReturnsID>B1</WarrantReturnsID>"
 * + "<ReturnDate>C1</ReturnDate>"
 * + "<Code>101</Code>"
 * + "<CourtCode>E1</CourtCode>"
 * + "<ReturnText>F1</ReturnText>"
 * + "<AdditionalDetails>G1</AdditionalDetails>"
 * + "<Notice>H1</Notice>"
 * + "<Defendant>I1</Defendant>"
 * + "<Verified>J1</Verified>"
 * + "<Error>Y</Error>"
 * + "<AppointmentDate>L1</AppointmentDate>"
 * + "<AppointmentTime>M1</AppointmentTime>"
 * + "<CreatedBy>N1</CreatedBy>"
 * + "<ExecutedBy>O1</ExecutedBy>"
 * + "<ReceiptDate>P1</ReceiptDate>"
 * + "<ToTransfer>Q1</ToTransfer>"
 * + "<CaseNumber>R1</CaseNumber>"
 * + "<CaseEventSeq>S1</CaseEventSeq>"
 * + "<CoEventSeq>T1</CoEventSeq>"
 * + "</WarrantEvent>"
 * + "<WarrantEvent>"
 * + "<WarrantID>A3</WarrantID>"
 * + "<WarrantReturnsID>B3</WarrantReturnsID>"
 * + "<ReturnDate>C3</ReturnDate>"
 * + "<Code>101</Code>"
 * + "<CourtCode>E3</CourtCode>"
 * + "<ReturnText>F3</ReturnText>"
 * + "<AdditionalDetails>G3</AdditionalDetails>"
 * + "<Notice>H3</Notice>"
 * + "<Defendant>I3</Defendant>"
 * + "<Verified>J3</Verified>"
 * + "<Error>Y</Error>"
 * + "<AppointmentDate>L3</AppointmentDate>"
 * + "<AppointmentTime>M3</AppointmentTime>"
 * + "<CreatedBy>N3</CreatedBy>"
 * + "<ExecutedBy>O3</ExecutedBy>"
 * + "<ReceiptDate>P3</ReceiptDate>"
 * + "<ToTransfer>Q3</ToTransfer>"
 * + "<CaseNumber>R3</CaseNumber>"
 * + "<CaseEventSeq>S3</CaseEventSeq>"
 * + "<CoEventSeq>T3</CoEventSeq>"
 * + "</WarrantEvent>"
 * + "<WarrantEvent>"
 * + "<WarrantID>A4</WarrantID>"
 * + "<WarrantReturnsID>B4</WarrantReturnsID>"
 * + "<ReturnDate>C4</ReturnDate>"
 * + "<Code>101</Code>"
 * + "<CourtCode>E4</CourtCode>"
 * + "<ReturnText>F4</ReturnText>"
 * + "<AdditionalDetails>G4</AdditionalDetails>"
 * + "<Notice>H4</Notice>"
 * + "<Defendant>I4</Defendant>"
 * + "<Verified>J4</Verified>"
 * + "<Error>Y</Error>"
 * + "<AppointmentDate>L4</AppointmentDate>"
 * + "<AppointmentTime>M4</AppointmentTime>"
 * + "<CreatedBy>N4</CreatedBy>"
 * + "<ExecutedBy>O4</ExecutedBy>"
 * + "<ReceiptDate>P4</ReceiptDate>"
 * + "<ToTransfer>Q4</ToTransfer>"
 * + "<CaseNumber>R4</CaseNumber>"
 * + "<CaseEventSeq>S4</CaseEventSeq>"
 * + "<CoEventSeq>T4</CoEventSeq>"
 * + "</WarrantEvent>"
 * + "</WarrantEvents></WarrantReturns></ds>"
 * + "</param></params>";
 * 
 * Document doc = sb.build(new StringReader(updateWrParamsString));
 * Element updateWrParams = doc.getRootElement();
 * 
 * populateWarrantReturns(0, 0, 34);
 * populateWarrantReturns(1, 1, 101);
 * populateWarrantReturns(2, 2, 136);
 * populateWarrantReturns(3, 3, 101);
 * populateWarrantReturns(4, 4, 101);
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "getWarrantReturnsLocal2", wrParams);
 * control.setReturnValue(new Document(warrantReturns));
 * 
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "updateWarrantReturnsLocal2", updateWrParams);
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * Warrant w = (Warrant)Enforcement.getInstance(payment, adaptor);
 * w.errorFullyPaidWarrantReturns();
 * 
 * control.verify();
 * }
 * 
 * private void populateWarrantReturns(int start, int end, int returnCode)
 * {
 * for(; start < end + 1; ++start) {
 * Element wrEl = new Element("WarrantEvent");
 * warrantReturns.getChild("WarrantReturns").getChild("WarrantEvents")
 * .addContent(wrEl);
 * wrEl.addContent(new Element("WarrantID").setText("A" + start));
 * wrEl.addContent(new Element("WarrantReturnsID")
 * .setText("B" + start));
 * wrEl.addContent(new Element("ReturnDate").setText("C" + start));
 * wrEl.addContent(new Element("Code").setText(
 * Integer.toString(returnCode)));
 * wrEl.addContent(new Element("CourtCode").setText("E" + start));
 * wrEl.addContent(new Element("ReturnText").setText("F" + start));
 * wrEl.addContent(new Element("AdditionalDetails")
 * .setText("G" + start));
 * wrEl.addContent(new Element("Notice").setText("H" + start));
 * wrEl.addContent(new Element("Defendant").setText("I" + start));
 * wrEl.addContent(new Element("Verified").setText("J" + start));
 * wrEl.addContent(new Element("Error").setText("K" + start));
 * wrEl.addContent(new Element("AppointmentDate")
 * .setText("L" + start));
 * wrEl.addContent(new Element("AppointmentTime")
 * .setText("M" + start));
 * wrEl.addContent(new Element("CreatedBy").setText("N" + start));
 * wrEl.addContent(new Element("ExecutedBy").setText("O" + start));
 * wrEl.addContent(new Element("ReceiptDate").setText("P" + start));
 * wrEl.addContent(new Element("ToTransfer").setText("Q" + start));
 * wrEl.addContent(new Element("CaseNumber").setText("R" + start));
 * wrEl.addContent(new Element("CaseEventSeq").setText("S" + start));
 * wrEl.addContent(new Element("CoEventSeq").setText("T" + start));
 * }
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestWarrantErrorReturns.class);
 * }
 * 
 * }
 * //[enddef] */