<?xml version="1.0" ?>
<!--
	Service: Payments
	Method: createPayment()
	File: transform_create_payment.xml
	Author: Steve Blair
	Description:
		Sets up the input DOM for use in createPayment.
	Change History:
		02/06/2008 - Chris Vincent, fixed CaseMan Defect 6547 by adding IgnoreBMSNonEvent node
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:output indent="yes" />
	
	<xsl:template match="Payment">
		<Input>
			<xsl:copy>
				<xsl:apply-templates />
			</xsl:copy>
			<WarrantReturnDOM>
				<ds>
					<WarrantReturns>
						<WarrantEvents>
							<WarrantEvent>
								<WarrantID><xsl:value-of select="WarrantID" /></WarrantID>
								<WarrantReturnsID />
								<ReturnDate><xsl:value-of select="SystemDate" /></ReturnDate>
								<Code>101</Code>
								<CourtCode>0</CourtCode>
								<ReturnText />
								<AdditionalDetails />
								<Notice>N</Notice>
								<Defendant>1</Defendant>
								<Verified />
								<Error>N</Error>
								<IgnoreBMSNonEvent>N</IgnoreBMSNonEvent>
								<AppointmentDate />
								<AppointmentTime />
								<CreatedBy><xsl:value-of select="CreatedBy" /></CreatedBy>
								<ExecutedBy><xsl:value-of select="ExecutingCourt" /></ExecutedBy>
								<ReceiptDate><xsl:value-of select="SystemDate" /></ReceiptDate>
								<ToTransfer>0</ToTransfer>
								<CaseNumber><xsl:value-of select="CaseNumber" /></CaseNumber>
								<LocalNumber>
									<xsl:if test="EnforcementType='FOREIGN WARRANT'">
				                    	<xsl:value-of select="EnforcementNumber" />
				                    </xsl:if>
								</LocalNumber>
							</WarrantEvent>
						</WarrantEvents>
					</WarrantReturns>
				</ds>
			</WarrantReturnDOM>
			<DCSDOM>
				<DCSData>
					<ItemDate><xsl:value-of select="SystemDate" /></ItemDate>
                    <ReportId><xsl:value-of select="ReportID" /></ReportId>
                    <Transaction>1</Transaction>
                    <Ordinary>
                    	<xsl:if test="RetentionType='ORDINARY'">
	                    	<xsl:value-of select="Amount" />
	                    </xsl:if>
					</Ordinary>
                    <OrdinaryCurrency>
                    	<xsl:if test="RetentionType='ORDINARY'">
	                    	<xsl:value-of select="AmountCurrency" />
	                    </xsl:if>
                    </OrdinaryCurrency>
                    <Cheque>
                    	<xsl:if test="RetentionType='CHEQUE'">
	                    	<xsl:value-of select="Amount" />
	                    </xsl:if>
					</Cheque>
                    <ChequeCurrency>
                    	<xsl:if test="RetentionType='CHEQUE'">
	                    	<xsl:value-of select="AmountCurrency" />
	                    </xsl:if>
                    </ChequeCurrency>
                    <JGMT1000>
                    	<xsl:if test="RetentionType='JGMT(1000+)'">
	                    	<xsl:value-of select="Amount" />
	                    </xsl:if>
					</JGMT1000>
                    <JGMT1000Currency>
                    	<xsl:if test="RetentionType='JGMT(1000+)'">
	                    	<xsl:value-of select="AmountCurrency" />
	                    </xsl:if>
                    </JGMT1000Currency>
                    <AOCAEO>
                    	<xsl:if test="RetentionType='AO/CAEO'">
	                    	<xsl:value-of select="Amount" />
	                    </xsl:if>
					</AOCAEO>
                    <AOCAEOCurrency>
                    	<xsl:if test="RetentionType='AO/CAEO'">
	                    	<xsl:value-of select="AmountCurrency" />
	                    </xsl:if>
                    </AOCAEOCurrency>
                    <Miscellaneous>
                    	<xsl:if test="RetentionType='MISCELLANEOUS'">
	                    	<xsl:value-of select="Amount" />
	                    </xsl:if>
					</Miscellaneous>
                    <MiscellaneousCurrency>
                    	<xsl:if test="RetentionType='MISCELLANEOUS'">
	                    	<xsl:value-of select="AmountCurrency" />
	                    </xsl:if>
                    </MiscellaneousCurrency>
                    <InOut>
                    	<xsl:if test="	substring(ReportID, 1, 4)='PREC' or substring(ReportID, 1, 4)='BVER' or
                    						substring(ReportID, 1, 4)='CVER'">I</xsl:if>
	                    <xsl:if test="	substring(ReportID, 1, 3)='DIV' or substring(ReportID, 1, 3)='ADH' or 
	                    					substring(ReportID, 1, 3)='CFO' or substring(ReportID, 1, 3)='PPL'">O</xsl:if>
                    </InOut>
		    		<UserID><xsl:value-of select="CreatedBy" /></UserID>
		    		<CourtCode><xsl:value-of select="AdminCourt" /></CourtCode>
				</DCSData>
			</DCSDOM>
		</Input>
	</xsl:template>
	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*" />
			<xsl:apply-templates />
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>