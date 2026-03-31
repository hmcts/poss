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
 * public class TestWarrantCreateReturn extends TestCase {
 * 
 * private MockControl control;
 * private ServiceAdaptor adaptor;
 * private Element params;
 * private Payment payment;
 * private Element enforcementEl;
 * private WarrantReturn wr;
 * private String paramString1;
 * private String paramString2;
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
 * 
 * Element wrEl = new Element("WarrantEvent");
 * wrEl.addContent(new Element("WarrantID").setText("A"));
 * wrEl.addContent(new Element("WarrantReturnsID").setText("B"));
 * wrEl.addContent(new Element("ReturnDate").setText("C"));
 * wrEl.addContent(new Element("Code").setText("D"));
 * wrEl.addContent(new Element("CourtCode").setText("E"));
 * wrEl.addContent(new Element("ReturnText").setText("F"));
 * wrEl.addContent(new Element("AdditionalDetails").setText("G"));
 * wrEl.addContent(new Element("Notice").setText("H"));
 * wrEl.addContent(new Element("Defendant").setText("I"));
 * wrEl.addContent(new Element("Verified").setText("J"));
 * wrEl.addContent(new Element("Error").setText("K"));
 * wrEl.addContent(new Element("AppointmentDate").setText("L"));
 * wrEl.addContent(new Element("AppointmentTime").setText("M"));
 * wrEl.addContent(new Element("CreatedBy").setText("N"));
 * wrEl.addContent(new Element("ExecutedBy").setText("O"));
 * wrEl.addContent(new Element("ReceiptDate").setText("P"));
 * wrEl.addContent(new Element("ToTransfer").setText("Q"));
 * wrEl.addContent(new Element("CaseNumber").setText("R"));
 * wrEl.addContent(new Element("LocalNumber").setText("S"));
 * wr = new WarrantReturn(wrEl, adaptor);
 * 
 * paramString1 = "<params><param name=\"NewReturn\">"
 * + "<ds><WarrantReturns><WarrantEvents><WarrantEvent>"
 * + "<WarrantID>A</WarrantID>"
 * + "<WarrantReturnsID>B</WarrantReturnsID>"
 * + "<ReturnDate>C</ReturnDate>"
 * + "<Code>D</Code>"
 * + "<CourtCode>E</CourtCode>"
 * + "<ReturnText>F</ReturnText>"
 * + "<AdditionalDetails>G</AdditionalDetails>"
 * + "<Notice>H</Notice>"
 * + "<Defendant>";
 * 
 * paramString2 = "</Defendant>"
 * + "<Verified>J</Verified>"
 * + "<Error>K</Error>"
 * + "<AppointmentDate>L</AppointmentDate>"
 * + "<AppointmentTime>M</AppointmentTime>"
 * + "<CreatedBy>N</CreatedBy>"
 * + "<ExecutedBy>O</ExecutedBy>"
 * + "<ReceiptDate>P</ReceiptDate>"
 * + "<ToTransfer>Q</ToTransfer>"
 * + "<CaseNumber>R</CaseNumber>"
 * + "<LocalNumber>S</LocalNumber>"
 * + "</WarrantEvent></WarrantEvents></WarrantReturns></ds>"
 * + "</param></params>";
 * }
 * 
 * public void testNegativeBalance() throws Exception
 * {
 * Document doc1 = sb.build(new StringReader(
 * paramString1 + "1"+ paramString2));
 * Element wrParams1 = doc1.getRootElement();
 * 
 * Document doc2 = sb.build(new StringReader(
 * paramString1 + "2" + paramString2));
 * Element wrParams2 = doc2.getRootElement();
 * 
 * enforcementEl.getChild("OutstandingBalance").setText("-11.45");
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", params);
 * control.setReturnValue(new Document(enforcementEl));
 * 
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "insertWarrantReturnsLocal2", wrParams1);
 * control.setReturnValue(null);
 * 
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "insertWarrantReturnsLocal2", wrParams2);
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * Warrant warrant =
 * (Warrant)Enforcement.getInstance(payment, adaptor);
 * warrant.createFullyPaidWarrantReturns(wr);
 * 
 * control.verify();
 * }
 * 
 * public void testZeroBalance() throws Exception
 * {
 * Document doc1 = sb.build(new StringReader(
 * paramString1 + "1" + paramString2));
 * Element wrParams1 = doc1.getRootElement();
 * 
 * Document doc2 = sb.build(new StringReader(
 * paramString1 + "2" + paramString2));
 * Element wrParams2 = doc2.getRootElement();
 * 
 * Document doc3 = sb.build(new StringReader(
 * paramString1 + "3" + paramString2));
 * Element wrParams3 = doc3.getRootElement();
 * 
 * enforcementEl.getChild("OutstandingBalance").setText("0");
 * enforcementEl.getChild("Parties").addContent(
 * new Element("Party").addContent(
 * new Element("Role").setText("PARTY AGAINST")));
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", params);
 * control.setReturnValue(new Document(enforcementEl));
 * 
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "insertWarrantReturnsLocal2", wrParams1);
 * control.setReturnValue(null);
 * 
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "insertWarrantReturnsLocal2", wrParams2);
 * control.setReturnValue(null);
 * 
 * adaptor.callService("ejb/WarrantReturnsServiceLocal",
 * "insertWarrantReturnsLocal2", wrParams3);
 * control.setReturnValue(null);
 * 
 * control.replay();
 * 
 * Warrant warrant =
 * (Warrant)Enforcement.getInstance(payment, adaptor);
 * warrant.createFullyPaidWarrantReturns(wr);
 * 
 * control.verify();
 * }
 * 
 * public void testPositiveBalance() throws Exception
 * {
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", params);
 * control.setReturnValue(new Document(enforcementEl));
 * 
 * control.replay();
 * 
 * Warrant warrant =
 * (Warrant)Enforcement.getInstance(payment, adaptor);
 * warrant.createFullyPaidWarrantReturns(wr);
 * 
 * control.verify();
 * }
 * 
 * public void testNullParam() throws Exception
 * {
 * adaptor.callService("ejb/PaymentsServiceLocal",
 * "getEnforcementLocal2", params);
 * control.setReturnValue(new Document(enforcementEl));
 * 
 * control.replay();
 * 
 * Warrant warrant =
 * (Warrant)Enforcement.getInstance(payment, adaptor);
 * try {
 * warrant.createFullyPaidWarrantReturns(null);
 * fail("should have thrown NullPointerException");
 * }
 * catch(NullPointerException e) {}
 * 
 * control.verify();
 * }
 * 
 * public static void main(String[] args)
 * {
 * junit.textui.TestRunner.run(TestWarrantCreateReturn.class);
 * }
 * 
 * }
 * //[enddef] */