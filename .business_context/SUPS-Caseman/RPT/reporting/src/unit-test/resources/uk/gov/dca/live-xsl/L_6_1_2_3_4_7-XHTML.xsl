<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1002E"><div><font size="4" face="Arial">
		<div style="margin-bottom: 0.4cm;">Dear <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGreeting"/></div>
		<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: Case Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimNumber"/> 
			<xsl:choose xmlns="http://eds.com/supsfo">
				<xsl:when test="$vdCaseType = 'APP TO SET STAT DEMD'">
					<xsl:value-of select="$vdApplicantName"/>
				</xsl:when>
				<xsl:when test="$vdCaseType = 'CREDITORS PETITION'">
					<xsl:value-of select="$vdDebtorName"/>
				</xsl:when>
				<xsl:when test="$vdCaseType = 'DEBTORS PETITION'">
					<xsl:value-of select="$vdDebtorName"/>				
				</xsl:when>				
				<xsl:when test="$vdCaseType = 'WINDING UP PETITION'">
					<xsl:value-of select="$vdCompanyName"/> 				
				</xsl:when>
                                <xsl:when test="$vdCaseType = 'COMPANY ADMIN ORDER'">
					<xsl:value-of select="$vdCompanyName"/> 				
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$vdClaimantName"/> v <xsl:value-of select="$vdDefendant1Name"/> 				
				</xsl:otherwise>
			</xsl:choose>
		</div>

		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSelectionLetter = 1">		
		<div xmlns="" style="margin-bottom: 0.4cm;">
					I refer to your letter dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterRecDate"/>. I am currently unable to trace receipt of your <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFeePayment"/> of
					
						£<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdFeeOrPaymentAmount"/>.
						
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					In order to assist me in tracing your process please provide the following information:- 
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					1.   The name of the account on which the cheque was drawn. 
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					2.   The amount of the cheque. 
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					3.   The date cleared by your bank. 
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					4.   The date sent to us.
				</div>
				<div xmlns="" style="margin-bottom: 0.8cm;">
					I await your reply. 
				</div>
		</xsl:if>		

		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSelectionLetter = 2">		
		<div xmlns="" style="margin-bottom: 0.4cm;">
			I refer to your letter dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterRecDate"/> enquiring about <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEnquiry"/>
			I can confirm that a payable order number <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPayableOrderNo"/> was sent to you on <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterSentDate"/>.
		</div>
		<div xmlns="" style="margin-bottom: 0.4cm;">
			The payable order was drawn in favour of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdDrawnInFavour"/> in the sum of 
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdPayableOrderAmount"/></xsl:with-param>
			</xsl:call-template>. 
		</div>
		<div xmlns="" style="margin-bottom: 0.8cm;">
			If upon checking your records you find that you have not received the above payment, please write to us again quoting the payable order details so that a replacement may be issued where necessary.
		</div>
		</xsl:if>		

		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSelectionLetter = 3">		
		<div xmlns="" style="margin-bottom: 0.4cm;">
			I enclose a replacement payable order in the sum of
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdPayableOrderAmount"/></xsl:with-param>
			</xsl:call-template>. Enquiries have confirmed that the original payable order dated <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOriginalPayableOrderDate"/> has not been cashed. 
		</div>	
		</xsl:if>		

		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSelectionLetter = 4">		
		<div xmlns="" style="margin-bottom: 0.4cm;">
			I regret to inform you that your cheque in the sum of
			£<xsl:call-template xmlns="http://eds.com/supsfo" name="correctCalculation">
				<xsl:with-param name="value"><xsl:value-of select="$vdPayableOrderAmount"/></xsl:with-param>
			</xsl:call-template> submitted in respect of <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdRespectOf"/> in the above case has been returned by your Bank marked "Refer to Drawer".
		</div>
		<div xmlns="" style="margin-bottom: 0.4cm;">
			This amount is now due and should be paid to this office immediately.
		</div>
		<div xmlns="" style="margin-bottom: 0.4cm;">
			No further cheques will be accepted unless supported by a cheque card. 
		</div>
		<div xmlns="" style="margin-bottom: 0.8cm;">
			In the meantime all proceedings will be stayed pending receipt of your payment. If the court does not receive payment from yourselves the action will be marked withdrawn and further action will be taken to recover the monies from you. 
		</div>

		</xsl:if>		


		<xsl:if xmlns="http://eds.com/supsfo" test="$vdSelectionLetter = 5">		
			<div xmlns="" style="margin-bottom: 0.4cm;">
			It has been ordered that money held in Court be paid to yourself. As you have no Solicitor acting on your behalf, in order for us to be able to release the monies we require the following information: 
		</div>
		<div xmlns="" style="margin-bottom: 0.4cm;">
			1) Your bank account no: .................................... 
		</div>
		<div xmlns="" style="margin-bottom: 0.4cm;">
			2) The name of your account: ............................. 
		</div>
		<div xmlns="" style="margin-bottom: 0.4cm;">
			3) Your branch name and address: 
		</div>
		<div xmlns="" style="margin-bottom: 0.4cm; margin-left: 0.5cm;">
			......................................................................... 
		</div>
		<div xmlns="" style="margin-bottom: 0.4cm; margin-left: 0.5cm;">
			.........................................................................
		</div>
		<div xmlns="" style="margin-bottom: 0.4cm; margin-left: 0.5cm;">
			.........................................................................
		</div>
		<div xmlns="" style="margin-bottom: 0.4cm;">
			4) Your bank sort code: .......................................
		</div>
		<div xmlns="" style="margin-bottom: 0.8cm;">
			It would greatly assist us in processing your order if you could return this correspondence within 7 days. 
		</div>
		</xsl:if>		

		<div style="margin-bottom: 1.5cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
		<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
		<div>Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
		</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>