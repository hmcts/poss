<?xml version="1.0" ?>
<!--
	Service: Payments
	Method: updatePayment(), updateOverpayment()
	File: transform_update_payment.xml
	Author: Steve Blair
	Description:
		Sets up the input DOM for use in update payment services.
	Change History:
		02/06/2008 - Chris Vincent, fixed CaseMan Defect 6547 by adding IgnoreBMSNonEvent node
-->
<xsl:stylesheet	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	
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
			<PayoutDCSDOM>
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
			</PayoutDCSDOM>
			<NonPayoutDCSDOM>
				<DCSData>
					<ItemDate><xsl:value-of select="SystemDate" /></ItemDate>
                    <ReportId><xsl:value-of select="ReportID" /></ReportId>
                    <Transaction>1</Transaction>
                    <Ordinary>
                    	<xsl:call-template name="calcDcsAmount">
							<xsl:with-param name="retentionComparator">ORDINARY</xsl:with-param>
						</xsl:call-template>
					</Ordinary>
                    <OrdinaryCurrency>
                    	<xsl:if test="RetentionType='ORDINARY' or OldRetentionType='ORDINARY'">
	                    	<xsl:value-of select="AmountCurrency" />
	                    </xsl:if>
                    </OrdinaryCurrency>
                    <Cheque>
                    	<xsl:call-template name="calcDcsAmount">
							<xsl:with-param name="retentionComparator">CHEQUE</xsl:with-param>
						</xsl:call-template>
					</Cheque>
                    <ChequeCurrency>
                    	<xsl:if test="RetentionType='CHEQUE' or OldRetentionType='CHEQUE'">
	                    	<xsl:value-of select="AmountCurrency" />
	                    </xsl:if>
                    </ChequeCurrency>
                    <JGMT1000>
                    	<xsl:call-template name="calcDcsAmount">
							<xsl:with-param name="retentionComparator">JGMT(1000+)</xsl:with-param>
						</xsl:call-template>
					</JGMT1000>
                    <JGMT1000Currency>
                    	<xsl:if test="RetentionType='JGMT(1000+)' or OldRetentionType='JGMT(1000+)'">
	                    	<xsl:value-of select="AmountCurrency" />
	                    </xsl:if>
                    </JGMT1000Currency>
                    <AOCAEO>
                    	<xsl:call-template name="calcDcsAmount">
							<xsl:with-param name="retentionComparator">AO/CAEO</xsl:with-param>
						</xsl:call-template>
					</AOCAEO>
                    <AOCAEOCurrency>
                    	<xsl:if test="RetentionType='AO/CAEO' or OldRetentionType='AO/CAEO'">
	                    	<xsl:value-of select="AmountCurrency" />
	                    </xsl:if>
                    </AOCAEOCurrency>
                    <Miscellaneous>
                    	<xsl:call-template name="calcDcsAmount">
							<xsl:with-param name="retentionComparator">MISCELLANEOUS</xsl:with-param>
						</xsl:call-template>
					</Miscellaneous>
                    <MiscellaneousCurrency>
                    	<xsl:if test="RetentionType='MISCELLANEOUS' or OldRetentionType='MISCELLANEOUS'">
	                    	<xsl:value-of select="AmountCurrency" />
	                    </xsl:if>
                    </MiscellaneousCurrency>
                    <InOut>
                    	<xsl:choose>
							<xsl:when test="normalize-space(RDDate)">O</xsl:when>
							<xsl:otherwise>I</xsl:otherwise>
						</xsl:choose>
                    </InOut>
		    		<UserID><xsl:value-of select="CreatedBy" /></UserID>
		    		<CourtCode><xsl:value-of select="AdminCourt" /></CourtCode>
				</DCSData>
			</NonPayoutDCSDOM>
		</Input>
	</xsl:template>
	
	<xsl:template match="@*|node()">
		<xsl:copy>
			<xsl:apply-templates select="@*" />
			<xsl:apply-templates />
		</xsl:copy>
	</xsl:template>
	
	<xsl:template name="calcDcsAmount">
    	<xsl:param name="retentionComparator" />
    	<xsl:choose>
			<xsl:when test="normalize-space(RDDate)">
				<xsl:if test="OldRetentionType=$retentionComparator">
                	<xsl:value-of select="OldAmount" />
                </xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="RetentionType!=OldRetentionType">
						<xsl:if test="OldRetentionType=$retentionComparator">
	                    	<xsl:value-of select="- OldAmount" />
	                    </xsl:if>
	                    <xsl:if test="RetentionType=$retentionComparator">
	                    	<xsl:value-of select="Amount" />
	                    </xsl:if>
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when test="Amount!=OldAmount">
								<xsl:if test="OldRetentionType=$retentionComparator">
			                    	<xsl:value-of select="Amount - OldAmount" />
			                    </xsl:if>
							</xsl:when>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
</xsl:stylesheet>