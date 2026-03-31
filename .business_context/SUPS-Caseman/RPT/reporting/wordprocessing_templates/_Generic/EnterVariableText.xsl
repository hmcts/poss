<?xml version="1.0" encoding="UTF-8"?>
<!-- 
@author Sandeep Mullangi
@version 0.1 
Change History
Sep 10, 2008 Sandeep Mullangi - Added vdInsolvencyNumber as part of RFC 486
Oct 21, 2009 Chris Vincent - Multiple changes to Welsh Court templates and also changed foreign warrant
templates to link to executing court instead of user court.  Trac 1640.
Oct 23, 2009 Chris Vincent - change to 'party' template so calls value of numbersuffix variable instead of copy of.
Trac 2023.
Feb 10, 2010 Chris Vincent - added vdWelshHighCourtName, vdWelshCountyCourtName and vdWelshCourtOrDistrictName
to cater for the Welsh Court names.  Trac 2629.
07 Apr 2010, Chris Vincent - Welsh Changes:
Added flag vdTransWelshCourt Welsh Court indicator for Welsh Translation Cover Letter which should never have a bilingual header (Trac 2969)
Added vdWelshCoverLogoName for the logo on the Welsh Translation Cover Letter which should always show the English logo (Trac 2969)
Added variable vdCoverLetterHeadDate to display the letter header date for the Welsh Translation Cover Letter which is slightly different to other letter header dates. (Trac 2969)
Change to the template welshtranslation to display text in Arial format (Trac 2639)
Change to the template welshtranslation to include different letter subject based on the enforcement type. (Tracs 2598, 2747 and 2863)
Change to the template welshtranslation to alter the body layout (Trac 2969)
Added variable vdWelshAddressImage to determine the correct Welsh address image (Trac 2662)
Added variable vdLetterCourtCode to determine the court code of the Court in a letter output (Trac 2662)
Update to welshtranslation to amend the letter subject on Consolidated Orders after requirement change (Trac 2598)
04 Aug 2010, Troy Baines - CM 6. Trac 3111
Aug 09, 2010 Nilesh Mistry - added vdCOFrequency variable for TRAC 2859
08 Aug 2010, Mark Groen - CM6 Trac 3023. Add a new variable - vdDebtorTable4 added vdFeeAmount1 and vdOsNomicBalance1
10 Jan 2011, Chris Vincent. Trac 4134. Changed references to logo names.
12 May 2011, Chris Vincent, created new vaiable vdExecutingOrCourtCode and referenced in existing variable vdFooterCourtTelephoneFax.  Trac 3570.
10 Nov 2011, Chris Vincent, changed variable vdGreeting to include new value of Sir/Madam.  Trac 4588.
12 Dec 2011, Chris Vincent, added new variables for outputs O_9_1, O_9_2 and CJR202 for Trac 4621.
13 Dec 2011, Nilesh Mistry, amended variable vdComplicatedNoTransfer to include new case type of Company Admin Order. Trac 4594
27 Jan 2012, Chris Vincent, added templates noticeIssueDefendantName and noticeIssueDefendantReference for Trac 4589.
11 Jun 2012, Chris Vincent, added vdCOEventReceiptDate variable for Trac 2481.
30 Aug 2012, Chris Vincent, added vdFooterCourtAvailability and vdCourtAvailability.  Trac 4714
07 Sep 2012, Chris Vincent, updates to vdFooterCourtAvailability and vdCourtAvailability following introduction of DR opening hours and open by 
			 appointment courts.  Changes to vdUserCourtTelephone, vdMCOLUserCourtTelephone, vdCourtTelephoneNumber, vdTransferCourtTelephoneNumber 
			 and vdExecutingCourtTelephoneNumber (new variable) also made following introduction of DR Telephone Number.  Trac 4718.
28 Jan 2013, Chris Vincent.  RFS 3719 changes: 
	Added vdInstigatorNameHeader and vdNumberOfInstigators (Trac 4762)
	Added vdDirectionsText, vdClaimantOrRespondent, vdBillReturnDate and vdProvisionalAssessmentCosts and also altered vdCmfHrgAllPtc (Trac 4763)
	Added vdClaimReceiptDate (Trac 4766)
14 Aug 2013, Chris Vincent (Trac 4921). Changed MCOL Telephone and Fax Number for RFS3911.
08 Nov 2016, Paul Ridout.  Changes for RenderX replacement (Trac 6110)
03 Jan 2016, Chris Vincent.  Family Enforcement changes.  Trac 5886
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xalan="http://xml.apache.org/xalan" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" exclude-result-prefixes="ora w v w10 sl aml wx o dt st1 xalan" >
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:variable name="vdSystemDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/today"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWelshCourt">
		<xsl:choose>
			<xsl:when test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- not a foreign warrant so use normal court -->
				<xsl:value-of select="variabledata/court/welshcourt"/>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's a foreign warrant, so use executing court -->
				<xsl:value-of select="variabledata/executingcourt/welshcourt"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdTransWelshCourt">N</xsl:variable>
	<xsl:variable name="vdWelshHighCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
			
				<xsl:choose>
					<xsl:when test="string-length(/variabledata/warrant/localnumber) = 0">
						<!-- It's not a foreign warrant, so display case court -->
						<xsl:value-of select="variabledata/court/welshhighcourtname"/>
					</xsl:when>
					<xsl:otherwise>
						<!-- It's a foreign warrant, so get executing court -->
						<xsl:value-of select="variabledata/executingcourt/welshhighcourtname"/>
					</xsl:otherwise>
				</xsl:choose>
			
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWelshCountyCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
			
				<xsl:choose>
					<xsl:when test="string-length(/variabledata/warrant/localnumber) = 0">
						<!-- It's not a foreign warrant, so display case court -->
						<xsl:value-of select="variabledata/court/welshcountycourtname"/>
					</xsl:when>
					<xsl:otherwise>
						<!-- It's a foreign warrant, so get executing court -->
						<xsl:value-of select="variabledata/executingcourt/welshcountycourtname"/>
					</xsl:otherwise>
				</xsl:choose>
			
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWelshCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:choose>
					<xsl:when test="string-length(/variabledata/warrant/localnumber) = 0">
						<!-- It's not a foreign warrant, so display case court -->
						<xsl:value-of select="variabledata/court/welshcourtname"/>
					</xsl:when>
					<xsl:otherwise>
						<!-- It's a foreign warrant, so get executing court -->
						<xsl:value-of select="variabledata/executingcourt/welshcourtname"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWelshCourtOrDistrictName">
		<xsl:choose>
			<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
				<xsl:value-of select="$vdWelshHighCourtName"/>
			</xsl:when>
			<xsl:when test="$vdDistrictRegistry = 'F'">
				Y Llys Teulu yn: <xsl:value-of select="$vdWelshCourtName"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdWelshCountyCourtName"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- Add a new variable as part of Trac 3023-->
	<xsl:variable name="vdDebtorTable4">
		<xsl:for-each 
			select="variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or isnew='Y']">
			<xsl:variable name="debtamountallowed">
				<xsl:value-of select="debtamountallowed"/>
			</xsl:variable>
			<xsl:variable name="passthrough">
				<xsl:value-of select="passthrough"/>
			</xsl:variable>
			<xsl:variable name="dividend">
				<xsl:value-of select="divends"/>
			</xsl:variable>
			<fo:table-row>
				<fo:table-cell border-style="solid" border-width="0.02cm">
					<fo:block>
						<xsl:value-of select="debtcasenumber"/>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell border-style="solid" border-width="0.02cm">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert">
								<xsl:value-of select="creditor/name"/>
							</xsl:with-param>
							<xsl:with-param name="conversion">
								proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell border-style="solid" border-width="0.02cm" 
					text-align="right">
					<fo:block>
						<xsl:call-template name="correctCalculation">
							<xsl:with-param name="value">
								<xsl:value-of select="$debtamountallowed - $passthrough - $dividend"/>
							</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
			</fo:table-row>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vdLanguage">
		<xsl:choose>
			<!-- Welsh Courts -->
			<xsl:when test="$vdWelshCourt = 'Y'">cy</xsl:when>
			<xsl:otherwise></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdLogoName">
		<xsl:choose>
			<!-- Welsh Courts -->
			<xsl:when test="$vdLanguage='cy'">/HMCTS_Welsh_BLK.jpg</xsl:when>
			<xsl:otherwise>/HMCTS_BLK.jpg</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdWelshCoverLogoName">/HMCTS_BLK.jpg</xsl:variable>
	<xsl:variable name="vdWelshAddressImage">
		<xsl:choose>
			<xsl:when test="$vdLetterCourtCode = '280'">
				<xsl:choose>
					<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">/High280.PNG</xsl:when>
					<xsl:when test="$vdDistrictRegistry = 'F'">/Family280.png</xsl:when>
					<xsl:otherwise>/County280.PNG</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdLetterCourtCode = '344'">
				<xsl:choose>
					<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">/High344.PNG</xsl:when>
					<xsl:when test="$vdDistrictRegistry = 'F'">/Family344.png</xsl:when>
					<xsl:otherwise>/County344.PNG</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSealImage">
		<xsl:choose>
			<xsl:when test="$vdWelshCourt = 'Y' and $vdDistrictRegistry != 'F'">/HMCTS_County_Court_Seal_Welsh.png</xsl:when>
			<xsl:when test="$vdWelshCourt = 'Y' and $vdDistrictRegistry = 'F'">/HMCTS_Welsh_Family_Court_Seal.png</xsl:when>
			<xsl:when test="$vdWelshCourt = 'N' and $vdDistrictRegistry != 'F'">/HMCTS_County_Court_Seal.png</xsl:when>
			<xsl:when test="$vdWelshCourt = 'N' and $vdDistrictRegistry = 'F'">/HMCTS_Family_Court_Seal.png</xsl:when>
			<xsl:otherwise>/HMCTS_County_Court_Seal.png</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSelectedPartyForPartyKey">
		<xsl:value-of select="variabledata/judgment/partyforselected"/>
	</xsl:variable>
	<xsl:variable name="vdAEJudgmentCreditorID">
		<xsl:value-of select="variabledata/aejudgmentcreditorpid"/>
	</xsl:variable>
	<xsl:variable name="vdAEJudgmentCreditorName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="/variabledata/claim/*[id= $vdAEJudgmentCreditorID]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAEJudgmentCreditorRef">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/*[id= $vdAEJudgmentCreditorID]/representativeid) > 0">
				<xsl:value-of 
					select="/variabledata/claim/*[id= $vdAEJudgmentCreditorID]/solicitorreference"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of 
					select="/variabledata/claim/*[id= $vdAEJudgmentCreditorID]/name"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSelectedPartyForName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="/variabledata/claim/*[surrogateid= $vdSelectedPartyForPartyKey]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSelectedPartyForReference">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/claim/*[surrogateid= $vdSelectedPartyForPartyKey]/representativeid) > 0">
				<xsl:value-of 
					select="/variabledata/claim/*[surrogateid= $vdSelectedPartyForPartyKey]/solicitorreference"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of 
					select="/variabledata/claim/*[surrogateid= $vdSelectedPartyForPartyKey]/reference"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDuplicateEvent">
		<xsl:choose>
			<xsl:when test="variabledata/duplicate = 'true'"> (Duplicate) 
				</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdWarrantEventCode">
		<xsl:value-of select="variabledata/warrantEventCode"/>
	</xsl:variable>
	<xsl:variable name="vdSubjectPartyRoleCode">
		<xsl:value-of select="variabledata/event/SubjectPartyRoleCode"/>
	</xsl:variable>
	<xsl:variable name="vdSubjectPartyRole">
		<xsl:choose>
			<xsl:when test="$vdSubjectPartyRoleCode = 'CLAIMANT'">Claimant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'DEFENDANT'">Defendant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">Part 20 Claimant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">Part 20 Defendant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'DEBTOR'">Debtor</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'CREDITOR'">Creditor</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'COMPANY'">The Company</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'APPLICANT'">Applicant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PETITIONER'">Petitioner</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'INS PRAC'">Insolvency Practitioner</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'OFF REC'">Official Receiver</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'TRUSTEE'">Trustee</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInstigatorPartyNumber">
		<xsl:choose>
			<xsl:when test="$vdInstigatorNumber = '1'">1st</xsl:when>
			<xsl:when test="$vdInstigatorNumber = '2'">2nd</xsl:when>
			<xsl:when test="$vdInstigatorNumber = '3'">3rd</xsl:when>
			<xsl:otherwise><xsl:value-of 
				select="$vdInstigatorNumber"/>th</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSubjectPartyNumber">
		<xsl:choose>
			<xsl:when test="$vdSubjectNumber = '1'">1st</xsl:when>
			<xsl:when test="$vdSubjectNumber = '2'">2nd</xsl:when>
			<xsl:when test="$vdSubjectNumber = '3'">3rd</xsl:when>
			<xsl:otherwise><xsl:value-of 
				select="$vdSubjectNumber"/>th</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInstigatorNumber">
		<xsl:value-of 
			select="variabledata/event/InstigatorList/Instigator[position() = 1]/CasePartyNumber"/>
	</xsl:variable>
	<xsl:variable name="vdInstigatorPartyRoleCode">
		<xsl:value-of 
			select="variabledata/event/InstigatorList/Instigator[position() = 1]/CasePartyRoleCode"/>
	</xsl:variable>
	<xsl:variable name="vdInstigatorPartyRole">
		<xsl:choose>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">Claimant</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">Defendant</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">Part 20 Claimant</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">Part 20 Defendant</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'DEBTOR'">Debtor</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'CREDITOR'">Creditor</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'COMPANY'">The Company</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'APPLICANT'">Applicant</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PETITIONER'">Petitioner</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'INS PRAC'">Insolvency Practitioner</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'OFF REC'">Official Receiver</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'TRUSTEE'">Trustee</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdIssueFee">
		<xsl:value-of select="variabledata/claim/issuefee"/>
	</xsl:variable>
	<xsl:variable name="vdServedBy">
		<xsl:value-of select="variabledata/notice/servedby"/>
	</xsl:variable>
	<xsl:variable name="vdCounterclaim">
		<xsl:value-of select="variabledata/notice/counterclaim"/>
	</xsl:variable>
	<xsl:variable name="vdParticularsEnclosed">
		<xsl:value-of select="variabledata/claim/particulars"/>
	</xsl:variable>
	<xsl:variable name="vdSubjectNumber">
		<xsl:value-of select="variabledata/event/SubjectCasePartyNumber"/>
	</xsl:variable>
	<xsl:variable name="vdDefendantSubjectRepresentativeId">
		<xsl:value-of 
			select="variabledata/claim/defendant[./number = $vdSubjectNumber]/representativeid"/>
	</xsl:variable>
	<xsl:variable name="vdDefendantSubjectName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/defendant[./number = $vdSubjectNumber]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSubjectPartyRoleLower">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="$vdSubjectPartyRole"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">lower</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSubjectName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:if test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
					<xsl:value-of 
						select="variabledata/claim/claimant[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
					<xsl:value-of 
						select="variabledata/claim/defendant[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">
					<xsl:value-of 
						select="variabledata/claim/part20claimant[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">
					<xsl:value-of 
						select="variabledata/claim/part20defendant[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'DEBTOR'">
					<xsl:value-of 
						select="variabledata/claim/debtor[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'CREDITOR'">
					<xsl:value-of 
						select="variabledata/claim/creditor[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'COMPANY'">
					<xsl:value-of 
						select="variabledata/claim/company[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'APPLICANT'">
					<xsl:value-of 
						select="variabledata/claim/applicant[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'PETITIONER'">
					<xsl:value-of 
						select="variabledata/claim/petitioner[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'INS PRAC'">
					<xsl:value-of 
						select="variabledata/claim/insolvencypractitioner[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'OFF REC'">
					<xsl:value-of 
						select="variabledata/claim/officialreceiver[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdSubjectPartyRoleCode = 'TRUSTEE'">
					<xsl:value-of 
						select="variabledata/claim/trustee[./number = $vdSubjectNumber]/name"/>
				</xsl:if>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAEReference">
		<xsl:variable name="vdAEForType">
			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert">
					<xsl:value-of 
						select="//claim//*[name = //aepartyfor]/type"/>
				</xsl:with-param>
				<xsl:with-param name="conversion">upper</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="vdAEForNumber">
			<xsl:value-of select="//claim//*[name = //aepartyfor]/number"/>
		</xsl:variable>
		<xsl:variable name="vdAEAgainstType">
			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert">
					<xsl:value-of 
						select="//claim//*[name = //aepartyagainst]/type"/>
				</xsl:with-param>
				<xsl:with-param name="conversion">upper</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="vdAEAgainstNumber">
			<xsl:value-of select="//claim//*[name = //aepartyagainst]/number"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/event/aeeventdetails) > 0">
				<xsl:choose>
					<xsl:when 
						test="/variabledata/event/aeeventdetails = 'JUDGMENT CREDITOR'">
						<xsl:choose>
							<xsl:when test="$vdAEForType = 'CLAIMANT'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/claimant[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/claimant[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/claimant[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'DEFENDANT'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/defendant[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/defendant[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/defendant[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'PT 20 CLMT'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/part20claimant[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/part20claimant[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/claimant[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'PT 20 DEF'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/part20defendant[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/part20defendant[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/defendant[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'DEBTOR'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/debtor[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/debtor[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/debtor[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'CREDITOR'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/creditor[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/creditor[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/creditor[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'COMPANY'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/company[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/company[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/company[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'APPLICANT'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/applicant[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/applicant[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/applicant[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'PETITIONER'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/petitioner[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/petitioner[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/petitioner[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'TRUSTEE'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/trustee[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/trustee[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/trustee[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'INS PRAC'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/insolvencypractitioner[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/insolvencypractitioner[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/insolvencypractitioner[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEForType = 'OFF REC'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/officialreceiver[number = $vdAEForNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/officialreceiver[number = $vdAEForNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/officialreceiver[number = $vdAEForNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
						</xsl:choose>
					</xsl:when>
					<xsl:when 
						test="/variabledata/event/aeeventdetails = 'JUDGMENT DEBTOR'">
						<xsl:choose>
							<xsl:when test="$vdAEAgainstType = 'CLAIMANT'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/claimant[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/claimant[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/claimant[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'DEFENDANT'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/defendant[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/defendant[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/defendant[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'PT 20 CLMT'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/part20claimant[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/part20claimant[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/claimant[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'PT 20 DEF'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/part20defendant[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/part20defendant[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/defendant[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'DEBTOR'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/debtor[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/debtor[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/debtor[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'CREDITOR'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/creditor[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/creditor[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/creditor[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'COMPANY'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/company[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/company[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/company[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'APPLICANT'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/applicant[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/applicant[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/applicant[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'TRUSTEE'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/trustee[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/trustee[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/trustee[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'PETITIONER'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/petitioner[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/petitioner[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/petitioner[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'INS PRAC'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/insolvencypractitioner[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/insolvencypractitioner[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/insolvencypractitioner[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:when test="$vdAEAgainstType = 'OFF REC'">
								<xsl:choose>
									<xsl:when 
										test="string-length(variabledata/claim/officialreceiver[number = $vdAEAgainstNumber]/representativeid) > 0">
										<xsl:value-of 
											select="variabledata/claim/officialreceiver[number = $vdAEAgainstNumber]/solicitorreference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of 
											select="variabledata/claim/officialreceiver[number = $vdAEAgainstNumber]/reference"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
						</xsl:choose>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when 
				test="string-length(/variabledata/event/aeeventdetails) = 0">
				<xsl:value-of 
					select="/variabledata/aeemployer/address/reference"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCreditorRef">
		<xsl:variable name="DebtSeq">
			<xsl:value-of 
				select="//debt[creditor/name = //creditorselected/name]/debtseq"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when 
				test="string-length(normalize-space(//debt[debtseq = $DebtSeq]/payeereference)) > 0">
				<xsl:value-of 
					select="//variabledata/order/coorder/debts/debt[debtseq = $DebtSeq]/payeereference"/>
			</xsl:when>
			<xsl:when 
				test="string-length(normalize-space(//debt[debtseq = $DebtSeq]/creditorreference)) > 0">
				<xsl:value-of 
					select="//variabledata/order/coorder/debts/debt[debtseq = $DebtSeq]/creditorreference"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCOReference">
		<xsl:choose>
			<xsl:when test="/variabledata/event/id = 105">
				<xsl:value-of 
					select="/variabledata/order/coorder/employer/reference"/>
			</xsl:when>
			<xsl:when test="/variabledata/event/id = 966">
				<xsl:value-of select="$vdCreditorRef"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSubjectReference">
		<xsl:choose>
			<xsl:when test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/claimant[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/defendant[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/part20claimant[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/part20defendant[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'DEBTOR'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/debtor[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/debtor[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/debtor[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'CREDITOR'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/creditor[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/creditor[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/creditor[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'COMPANY'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/company[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/company[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/company[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'APPLICANT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/applicant[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/applicant[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/applicant[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PETITIONER'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/petitioner[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/petitioner[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/petitioner[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'TRUSTEE'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/trustee[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/trustee[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/trustee[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'INS PRAC'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/insolvencypractitioner[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/insolvencypractitioner[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/insolvencypractitioner[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'OFF REC'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/officialreceiver[number = $vdSubjectNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/officialreceiver[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/officialreceiver[number = $vdSubjectNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSubjectAddress">
		<xsl:if test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/defendant[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/claimant[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/part20defendant[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/part20claimant[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'DEBTOR'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/debtor[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'CREDITOR'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/creditor[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'COMPANY'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/company[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'APPLICANT'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/applicant[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PETITIONER'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/petitioner[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'TRUSTEE'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/trustee[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'INS PRAC'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/insolvencypractitioner[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'OFF REC'">
			<xsl:call-template name="format-address-single-line">
				<xsl:with-param name="theAddress">
					<xsl:copy-of 
						select="variabledata/claim/officialreceiver[./number = $vdSubjectNumber]/address"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSubjectAddressMultiLineNoDX">
		<xsl:variable name="tempSubId">
			<xsl:value-of select="variabledata/event/subjects/subject/id"/>
		</xsl:variable>
		<xsl:call-template name="format-address-multi-line-noDX">
			<xsl:with-param name="party">
				<xsl:copy-of 
					select="/descendant-or-self::node()/claim/descendant-or-self::node()/parent::node()[./id = $tempSubId]/*"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSubjectAddressMultiLine">
		<xsl:if test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/defendant[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/claimant[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/part20defendant[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/part20claimant[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'DEBTOR'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/debtor[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'CREDITOR'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/creditor[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'COMPANY'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/company[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'APPLICANT'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/applicant[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PETITIONER'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/petitioner[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'TRUSTEE'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/trustee[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'INS PRAC'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/insolvencypractitioner[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'OFF REC'">
			<xsl:call-template name="format-address-multi-line">
				<xsl:with-param name="party">
					<xsl:copy-of 
						select="variabledata/claim/officialreceiver[./number = $vdSubjectNumber]/*"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSubjectAddressId">
		<xsl:if test="$vdSubjectPartyRoleCode = 'DEFENDANT'"><xsl:value-of select="variabledata/claim/defendant[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'CLAIMANT'"><xsl:value-of select="variabledata/claim/claimant[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PT 20 DEF'"><xsl:value-of select="variabledata/claim/part20defendant[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'"><xsl:value-of select="variabledata/claim/part20claimant[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'DEBTOR'"><xsl:value-of select="variabledata/claim/debtor[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'CREDITOR'"><xsl:value-of select="variabledata/claim/creditor[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'COMPANY'"><xsl:value-of select="variabledata/claim/debtor[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'APPLICANT'"><xsl:value-of select="variabledata/claim/applicant[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PETITIONER'"><xsl:value-of select="variabledata/claim/petitioner[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'INS PRAC'"><xsl:value-of select="variabledata/claim/insolvencypractitioner[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'OFF REC'"><xsl:value-of select="variabledata/claim/officialreceiver[./number = $vdSubjectNumber]/address/id"/></xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'TRUSTEE'"><xsl:value-of select="variabledata/claim/trustee[./number = $vdSubjectNumber]/address/id"/></xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSubjectHasRepresentative">
		<xsl:if test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
			<xsl:if 
				test="string-length(variabledata/claim/claimant[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
			<xsl:if 
				test="string-length(variabledata/claim/defendant[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">
			<xsl:if 
				test="string-length(variabledata/claim/part20claimant[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">
			<xsl:if 
				test="string-length(variabledata/claim/part20defendant[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'DEBTOR'">
			<xsl:if 
				test="string-length(variabledata/claim/debtor[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'CREDITOR'">
			<xsl:if 
				test="string-length(variabledata/claim/creditor[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'COMPANY'">
			<xsl:if 
				test="string-length(variabledata/claim/company[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'APPLICANT'">
			<xsl:if 
				test="string-length(variabledata/claim/applicant[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'PETITIONER '">
			<xsl:if 
				test="string-length(variabledata/claim/petitioner[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'INS PRAC'">
			<xsl:if 
				test="string-length(variabledata/claim/insolvencypractitioner[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'OFF REC'">
			<xsl:if 
				test="string-length(variabledata/claim/officialreceiver[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'TRUSTEE'">
			<xsl:if 
				test="string-length(variabledata/claim/trustee[number = $vdSubjectNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSubjectRepresentativeId">
		<xsl:variable name="tempRepId">
			<xsl:value-of select="variabledata/event/subjects/subject/id"/>
		</xsl:variable>
		<xsl:value-of 
			select="/descendant-or-self::node()/claim/descendant-or-self::node()/parent::node()[./id = $tempRepId]/representativeid"/>
	</xsl:variable>
	<xsl:variable name="vdSubjectRepresentativeAddressMultiLine">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of 
					select="variabledata/claim/representative[surrogateid = $vdSubjectRepresentativeId]/*"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstigatorHasRepresentative">
		<xsl:if test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
			<xsl:if 
				test="string-length(variabledata/claim/claimant[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
			<xsl:if 
				test="string-length(variabledata/claim/defendant[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
			<xsl:if 
				test="string-length(variabledata/claim/part20claimant[number = $vdInstigatorNumber]/representativeid) > 0">	Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
			<xsl:if 
				test="string-length(variabledata/claim/part20defendant[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'DEBTOR'">
			<xsl:if 
				test="string-length(variabledata/claim/debtor[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'CREDITOR'">
			<xsl:if 
				test="string-length(variabledata/claim/creditor[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'COMPANY'">
			<xsl:if 
				test="string-length(variabledata/claim/company[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'APPLICANT'">
			<xsl:if 
				test="string-length(variabledata/claim/applicant[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'PETITIONER '">
			<xsl:if 
				test="string-length(variabledata/claim/petitioner[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'TRUSTEE '">
			<xsl:if 
				test="string-length(variabledata/claim/trustee[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'INS PRAC'">
			<xsl:if 
				test="string-length(variabledata/claim/insolvencypractitioner[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'OFF REC'">
			<xsl:if 
				test="string-length(variabledata/claim/officialreceiver[number = $vdInstigatorNumber]/representativeid) > 0">Y</xsl:if>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdInstigatorRepresentativeId">
		<xsl:if test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
			<xsl:value-of 
				select="variabledata/claim/claimant[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
			<xsl:value-of 
				select="variabledata/claim/defendant[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
			<xsl:value-of 
				select="variabledata/claim/part20claimant[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
			<xsl:value-of 
				select="variabledata/claim/part20defendant[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'DEBTOR'">
			<xsl:value-of 
				select="variabledata/claim/debtor[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'CREDITOR'">
			<xsl:value-of 
				select="variabledata/claim/creditor[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'COMPANY'">
			<xsl:value-of 
				select="variabledata/claim/company[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'APPLICANT'">
			<xsl:value-of 
				select="variabledata/claim/applicant[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'PETITIONER'">
			<xsl:value-of 
				select="variabledata/claim/petitioner[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'INS PRAC'">
			<xsl:value-of 
				select="variabledata/claim/insolvencypractitioner[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'OFF REC'">
			<xsl:value-of 
				select="variabledata/claim/officialreceiver[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
		<xsl:if test="$vdInstigatorPartyRoleCode = 'TRUSTEE'">
			<xsl:value-of 
				select="variabledata/claim/trustee[number = $vdInstigatorNumber]/representativeid"/>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdInstigatorRepresentativeAddressMultiLine">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of 
					select="variabledata/claim/representative[surrogateid = $vdInstigatorRepresentativeId]/*"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstigatorRepresentativeAddress">
		<xsl:copy-of 
			select="variabledata/claim/representative[surrogateid = $vdInstigatorRepresentativeId]/address"/>
	</xsl:variable>
	<xsl:variable name="vdInstigatorRepresentativeName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/representative[surrogateid = $vdInstigatorRepresentativeId]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstigatorSolTel">
		<xsl:value-of 
			select="variabledata/claim/representative[surrogateid = $vdInstigatorRepresentativeId]/telephonenumber"/>
	</xsl:variable>
	<xsl:variable name="vdInstigatorPartyRoleLower">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="$vdInstigatorPartyRole"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">lower</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstigatorName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:if test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
					<xsl:value-of 
						select="variabledata/claim/claimant[./number = $vdInstigatorNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
					<xsl:value-of 
						select="variabledata/claim/defendant[./number = $vdInstigatorNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
					<xsl:value-of select="$vdPart20ClaimantName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
					<xsl:value-of select="$vdPart20DefendantName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'DEBTOR'">
					<xsl:value-of 
						select="variabledata/claim/debtor[./number = $vdInstigatorNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'CREDITOR'">
					<xsl:value-of 
						select="variabledata/claim/creditor[./number = $vdInstigatorNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'COMPANY'">
					<xsl:value-of select="$vdCompanyName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'APPLICANT'">
					<xsl:value-of select="$vdApplicantName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'PETITIONER'">
					<xsl:value-of select="$vdPetitionerName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'INS PRAC'">
					<xsl:value-of select="$vdInsolvencyPractitionerName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'OFF REC'">
					<xsl:value-of select="$vdOfficialReceiverName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'TRUSTEE'">
					<xsl:value-of select="$vdTrusteeName"/>
				</xsl:if>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstigatorNameHeader">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:if test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
					<xsl:value-of 
						select="variabledata/claim/claimant[./number = $vdInstigatorNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
					<xsl:value-of 
						select="variabledata/claim/defendant[./number = $vdInstigatorNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
					<xsl:value-of select="$vdPart20ClaimantName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
					<xsl:value-of select="$vdPart20DefendantName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'DEBTOR'">
					<xsl:value-of 
						select="variabledata/claim/debtor[./number = $vdInstigatorNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'CREDITOR'">
					<xsl:value-of 
						select="variabledata/claim/creditor[./number = $vdInstigatorNumber]/name"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'COMPANY'">
					<xsl:value-of select="$vdCompanyName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'APPLICANT'">
					<xsl:value-of select="$vdApplicantName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'PETITIONER'">
					<xsl:value-of select="$vdPetitionerName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'INS PRAC'">
					<xsl:value-of select="$vdInsolvencyPractitionerName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'OFF REC'">
					<xsl:value-of select="$vdOfficialReceiverName"/>
				</xsl:if>
				<xsl:if test="$vdInstigatorPartyRoleCode = 'Trustee'">
					<xsl:value-of select="$vdTrusteeName"/>
				</xsl:if>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
		<xsl:choose>
			<xsl:when test="$vdNumberOfInstigators = 2">
				<fo:inline font-size="8pt"> and 1 other</fo:inline>
			</xsl:when>
			<xsl:when test="$vdNumberOfInstigators > 2">
				<fo:inline font-size="8pt"> and <xsl:value-of 
					select="$vdNumberOfInstigators - 1"/> 
					others</fo:inline>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInstigatorReference">
		<xsl:choose>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/claimant[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/defendant[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/part20claimant[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/part20defendant[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'DEBTOR'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/debtor[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/debtor[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/debtor[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'CREDITOR'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/creditor[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/creditor[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/creditor[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'COMPANY'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/company[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/company[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/company[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'APPLICANT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/applicant[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/applicant[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/applicant[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PETITIONER'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/petitioner[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/petitioner[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/petitioner[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'INS PRAC'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/insolvencypractitioner[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/insolvencypractitioner[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/insolvencypractitioner[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'OFF REC'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/officialreceiver[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/officialreceiver[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/officialreceiver[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'TRUSTEE'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/trustee[number = $vdInstigatorNumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/trustee[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/trustee[number = $vdInstigatorNumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInstigatorAddress">
		<xsl:choose>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/claimant[number = $vdInstigatorNumber]/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/defendant[number = $vdInstigatorNumber]/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInstigatorAddressMultiLineNoDX">
		<xsl:variable name="tempInsId">
			<xsl:value-of 
				select="variabledata/event/instigators/instigator/id"/>
		</xsl:variable>
		<xsl:call-template name="format-address-multi-line-noDX">
			<xsl:with-param name="party">
				<xsl:copy-of 
					select="/descendant-or-self::node()/claim/descendant-or-self::node()/parent::node()[./id = $tempInsId]/*"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstigatorAddressMultiLine">
		<xsl:choose>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/claimant[number = $vdInstigatorNumber]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/defendant[number = $vdInstigatorNumber]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'DEBTOR'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/debtor[number = $vdInstigatorNumber]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'CREDITOR'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/creditor[number = $vdInstigatorNumber]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/part20claimant[number = $vdInstigatorNumber]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/part20defendant[number = $vdInstigatorNumber]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'COMPANY'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/company[position()=last()]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'APPLICANT'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/applicant[position()=last()]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PETITIONER'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/petitioner[position()=last()]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'INS PRAC'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/insolvencypractitioner[position()=last()]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'OFF REC'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/officialreceiver[position()=last()]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'TRUSTEE'">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/trustee[position()=last()]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudge">
		<xsl:if test="string-length(variabledata/judgment/judgename) > 0"> 
			<xsl:call-template name="convertcase"> <xsl:with-param 
			name="toconvert"> <xsl:value-of 
			select="variabledata/judgment/judgetitle"/> </xsl:with-param> 
			<xsl:with-param name="conversion">proper</xsl:with-param> 
			</xsl:call-template>&#xa0;<xsl:call-template name="convertcase"> 
			<xsl:with-param name="toconvert"> <xsl:value-of 
			select="variabledata/judgment/judgename"/> </xsl:with-param> 
			<xsl:with-param name="conversion">proper</xsl:with-param> 
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="variabledata/judgment/judgetitle = 'Other'"> 
			<xsl:value-of select="variabledata/judgment/otherjudgedesc"/>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFiler">
		<xsl:for-each select="variabledata/event/InstigatorList/Instigator">
			<xsl:if test="position()=last() and position() > 1">
				<xsl:text> and </xsl:text>
			</xsl:if>
			<xsl:variable name="partyNo">
				<xsl:value-of select="CasePartyNumber"/>
			</xsl:variable>
			<xsl:variable name="type">
				<xsl:value-of select="CasePartyRoleCode"/>
			</xsl:variable>						
			<xsl:choose>
				<xsl:when test="$type = 'CLAIMANT'">claimant 
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/claimant[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param> 
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'DEFENDANT'">defendant 
					<xsl:call-template name="convertcase"> 
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/defendant[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param> 
					</xsl:call-template> 
				</xsl:when>
				<xsl:when test="$type = 'PT 20 CLMT'">part 20 claimant  
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/part20claimant[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param> 
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'PT 20 DEF'">part 20 defendant 
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/part20defendant[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param> 
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'DEBTOR'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/debtor[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'CREDITOR'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/creditor[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'EMPLOYER'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/employer[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'COMPANY'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/company[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'APPLICANT'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/applicant[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'PETITIONER'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/petitioner[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'INS PRAC'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/insolvencypractitioner[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'OFF REC'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/officialreceiver[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'TRUSTEE'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert"><xsl:value-of select="/variabledata/claim/trustee[number = $partyNo]/name"/></xsl:with-param>
						<xsl:with-param name="conversion">proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
			<xsl:if test="(position()!=last()) and (position()!=(last()-1))">
				<xsl:text>, </xsl:text>
			</xsl:if>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vdDocumentDetails">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/order/documentDetails"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFiledDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/fileddate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDemandOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/demandissuedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdClaimCounterClaimBoth">
		<xsl:choose>
			<xsl:when test="variabledata/notice/claimcounterclaimboth = 'CLM'">
				<xsl:text>claim</xsl:text>
			</xsl:when>
			<xsl:when test="variabledata/notice/claimcounterclaimboth = 'CTR'">
				<xsl:text>counterclaim</xsl:text>
			</xsl:when>
			<xsl:when test="variabledata/notice/claimcounterclaimboth = 'BTH'">
				<xsl:text>claim and counterclaim</xsl:text>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdAllocation">
		<xsl:choose>
			<xsl:when test="variabledata/notice/allocation = 'CLM'"> claim </xsl:when>
			<xsl:when test="variabledata/notice/allocation = 'CTR'"> counterclaim </xsl:when>
			<xsl:when test="variabledata/notice/allocation = 'BTH'"> claim and counterclaim </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdAllocationToTrack">
		<xsl:choose>
			<xsl:when test="variabledata/notice/allocationtotrack = 'CLM'"> claim </xsl:when>
			<xsl:when test="variabledata/notice/allocationtotrack = 'CTR'"> counterclaim </xsl:when>
			<xsl:when test="variabledata/notice/allocationtotrack = 'BTH'"> claim and counterclaim </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdAQConsideredInRespectOf">
		<xsl:choose>
			<xsl:when test="variabledata/notice/aqconsideredregarding = 'CLM'"> claim </xsl:when>
			<xsl:when test="variabledata/notice/aqconsideredregarding = 'CTR'"> counterclaim </xsl:when>
			<xsl:when test="variabledata/notice/aqconsideredregarding = 'BTH'"> claim and counterclaim </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdAllocationQuestionaireFileDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/order/allocationquestionairefiledate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgementReason">
		<xsl:choose>
			<xsl:when test="variabledata/judgment/judgmentreason = 'LIAB'">
				<fo:block>The defendant having admitted liability i</fo:block>
			</xsl:when>
			<xsl:when test="variabledata/judgment/judgmentreason = 'LNAC'">
				<fo:block>The defendant having admitted liability and offered 
					an amount i</fo:block>
			</xsl:when>
			<xsl:when test="variabledata/judgment/judgmentreason = 'ACK'">
				<fo:block>No Acknowledgement of service having been filed 
					i</fo:block>
			</xsl:when>
			<xsl:when test="variabledata/judgment/judgmentreason = 'DEF'">
				<fo:block>No Defence having been filed i</fo:block>
			</xsl:when>
			<xsl:otherwise>
				<fo:block>I</fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingAttendees">
		<xsl:call-template name="attendees">
			<xsl:with-param name="path">
				variabledata/claim/hearing</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFormReturnDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/formreturndate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHearingAttendeesOther">
		<xsl:value-of 
			select="variabledata/claim/hearing/hearingattendeesother"/>
	</xsl:variable>
	<xsl:variable name="vdQuestionaireReturnDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/notice/questionairereturndate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAmount">
		<xsl:choose>
			<xsl:when test="string-length(variabledata/judgment/amount) > 0">
				<xsl:value-of select="variabledata/judgment/amount"/>
			</xsl:when>
			<xsl:otherwise>0.00</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCost">
		<xsl:choose>
			<xsl:when test="string-length(variabledata/judgment/costs) > 0">
				<xsl:value-of select="variabledata/judgment/costs"/>
			</xsl:when>
			<xsl:otherwise>0.00</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdRemainingAmount">
		<xsl:value-of select="variabledata/judgment/remainingamount"/>
	</xsl:variable>
	<xsl:variable name="vdClaimNature">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/judgment/claimature"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterestPercentage">
		<xsl:value-of select="variabledata/judgment/annualInterestpercentage"/>
	</xsl:variable>
	<xsl:variable name="vdRegistered">
		<xsl:value-of select="variabledata/judgment/registered"/>
	</xsl:variable>
	<xsl:variable name="vdPaidBeforeJudgment">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/judgment/paidbeforejudgment) > 0">
				<xsl:value-of 
					select="variabledata/judgment/paidbeforejudgment"/>
			</xsl:when>
			<xsl:otherwise>0.00</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdLocalNumber">
		<xsl:value-of select="variabledata/notice/localnumber"/>
	</xsl:variable>
	<xsl:variable name="vdEnvelopeMarkCode">
		<xsl:value-of select="variabledata/notice/envelopemark"/>
	</xsl:variable>
	<xsl:variable name="vdEnvelopeMark">
		<xsl:choose>
			<xsl:when test="$vdEnvelopeMarkCode = 'GA'">gone away</xsl:when>
			<xsl:when test="$vdEnvelopeMarkCode = 'INSF'">insufficient 
				address</xsl:when>
			<xsl:when test="$vdEnvelopeMarkCode = 'NK'">not known at the 
				address given</xsl:when>
			<xsl:when test="$vdEnvelopeMarkCode = 'NOADD'">no such 
				address</xsl:when>
			<xsl:when test="$vdEnvelopeMarkCode = 'NA'">No answer</xsl:when>
			<xsl:when test="$vdEnvelopeMarkCode = 'IA'">Address 
				incomplete</xsl:when>
			<xsl:when test="$vdEnvelopeMarkCode = 'AI'">Address 
				inaccessible</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdEnvelopeMarkOther"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdEnvelopeMarkOther">
		<xsl:value-of select="variabledata/notice/envelopemarkother"/>
	</xsl:variable>
	<xsl:variable name="vdName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/user/fullname"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSection">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/user/section"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdExtension">
		<xsl:value-of select="variabledata/user/ext"/>
	</xsl:variable>
	<xsl:variable name="vdUserCourtName">
		<xsl:value-of select="variabledata/usercourt/name"/>
	</xsl:variable>
	<xsl:variable name="vdExecutingOrCourtCode">
		<xsl:choose>
			<xsl:when test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- It's a home warrant, so display case court -->
				<xsl:value-of select="$vdCourtCode"/>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's a foreign warrant, so get executing court -->
				<xsl:value-of select="variabledata/executingcourt/courtcode"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFooterStrapline">
		<xsl:choose>
			<xsl:when test="$vdDistrictRegistry != 'F'">
				<xsl:value-of select="variabledata/outputstrapline"/>
			</xsl:when>
			<xsl:otherwise></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFooterCourtAvailability">
		<xsl:choose>
			<xsl:when test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- Not a foreign warrant, so display case court -->
				<xsl:choose>
					<!-- Check if court is open by appointment only -->
					<xsl:when test="variabledata/court/byappointment = 'Y'">by appointment</xsl:when>
					<xsl:otherwise>
						<!-- Determine whether case is District Registry or County Court -->
						<xsl:choose>
							<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
								between <xsl:value-of select="variabledata/court/dropenfrom"/> and <xsl:value-of select="variabledata/court/dropento"/>
							</xsl:when>
							<xsl:otherwise>
								between <xsl:value-of select="variabledata/court/openfrom"/> and <xsl:value-of select="variabledata/court/opento"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's a foreign warrant, so get executing court -->
				<xsl:choose>
					<!-- Check if court is open by appointment only -->
					<xsl:when test="variabledata/executingcourt/byappointment = 'Y'">by appointment</xsl:when>
					<xsl:otherwise>
						<!-- Determine whether case is District Registry or County Court -->
						<xsl:choose>
							<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
								between <xsl:value-of select="variabledata/executingcourt/dropenfrom"/> and <xsl:value-of select="variabledata/executingcourt/dropento"/>
							</xsl:when>
							<xsl:otherwise>
								between <xsl:value-of select="variabledata/executingcourt/openfrom"/> and <xsl:value-of select="variabledata/executingcourt/opento"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCourtAvailability">
		<xsl:choose>
			<xsl:when test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- Not a foreign warrant, so display case court -->
				<xsl:choose>
					<!-- Check if court is open by appointment only -->
					<xsl:when test="variabledata/court/byappointment = 'Y'">by appointment</xsl:when>
					<xsl:otherwise>
						<!-- Determine whether case is District Registry or County Court -->
						<xsl:choose>
							<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
								<xsl:value-of select="variabledata/court/dropenfrom"/> to <xsl:value-of select="variabledata/court/dropento"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="variabledata/court/openfrom"/> to <xsl:value-of select="variabledata/court/opento"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's a foreign warrant, so get executing court -->
				<xsl:choose>
					<!-- Check if court is open by appointment only -->
					<xsl:when test="variabledata/executingcourt/byappointment = 'Y'">by appointment</xsl:when>
					<xsl:otherwise>
						<!-- Determine whether case is District Registry or County Court -->
						<xsl:choose>
							<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
								<xsl:value-of select="variabledata/executingcourt/dropenfrom"/> to <xsl:value-of select="variabledata/executingcourt/dropento"/>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="variabledata/executingcourt/openfrom"/> to <xsl:value-of select="variabledata/executingcourt/opento"/>
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<!-- TD 5232 -->
	<xsl:variable name="vdUserOrCaseCourtName">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- It's a home warrant, so display case court -->
				<xsl:value-of select="$vdCourtName"/>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's a foreign warrant, so get executing court -->
				<xsl:value-of select="variabledata/executingcourt/name"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- TD 5232 -->
	<!-- TD 5557 -->
	<xsl:variable name="vdUserOrCaseCourtNameProper">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:choose>
					<xsl:when 
						test="string-length(/variabledata/warrant/localnumber) = 0">
						<!-- It's a home warrant, so display case court -->
						<xsl:value-of select="$vdCourtName"/>
					</xsl:when>
					<xsl:otherwise>
						<!-- It's a foreign warrant, so get executing court -->
						<xsl:value-of select="variabledata/executingcourt/name"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- TD 5557 -->
	<!-- TD 5557 -->
	<xsl:variable name="vdCourtUserAddress">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- It's a home warrant, so display case court -->
				<xsl:copy-of select="$vdCourtAddress"/>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's a foreign warrant, so get executing court -->
				<xsl:copy-of 
					select="xalan:nodeset(variabledata/executingcourt/address)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- TD 5557 -->
	<!-- TD 5557 -->
	<xsl:variable name="vdUserCourtTelephone">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- It's a home warrant-->
				<xsl:value-of select="$vdCourtTelephoneNumber"/>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's a foreign warrant -->
				<xsl:value-of select="$vdExecutingCourtTelephoneNumber"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- TD 5557 -->
	<!-- TD 5557 -->
	<xsl:variable name="vdUserCourtFax">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- It's a home warrant-->
				<xsl:value-of select="$vdCourtFaxNumber"/>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's a foreign warrant -->
				<xsl:value-of select="variabledata/executingcourt/faxnumber"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- MCOL Specific Variables -->
	<xsl:variable name="vdMCOLUserOrCaseCourtNameProper">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:choose>
					<xsl:when 
						test="string-length(/variabledata/warrant/localnumber) = 0">
						<!-- It's a home warrant, so display case court -->
						<xsl:value-of select="$vdMCOLCourtName"/>
					</xsl:when>
					<xsl:otherwise>
						<!-- It's a foreign warrant, so get executing court -->
						<xsl:value-of select="variabledata/executingcourt/name"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdMCOLUserCourtTelephone">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- It's a home warrant-->
				<xsl:value-of select="$vdMCOLCourtTelephoneNumber"/>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's a foreign warrant -->
				<xsl:value-of select="$vdExecutingCourtTelephoneNumber"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdMCOLUserCourtFax">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- It's a home warrant-->
				<xsl:value-of select="$vdMCOLCourtFaxNumber"/>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's a foreign warrant -->
				<xsl:value-of select="variabledata/executingcourt/faxnumber"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<!-- TD 5557 -->
	<xsl:variable name="vdUserCourtAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="xalan:nodeset(variabledata/usercourt/address)"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdUserCourtDx">
		<xsl:value-of select="variabledata/usercourt/dx"/>
	</xsl:variable>
	<xsl:variable name="vdListUserCourtAddress">
		<xsl:value-of select="variabledata/usercourt/telephonenumber"/>
	</xsl:variable>
	<xsl:variable name="vdBailiffVisitDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/bailiff/visitdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdBailiffName">
		<xsl:value-of select="variabledata/bailiff/name"/>
	</xsl:variable>
	<xsl:variable name="vdBailiffTelephone">
		<xsl:value-of select="variabledata/bailiff/telephone"/>
	</xsl:variable>
	<xsl:variable name="vdBailiffAvailability">
		<xsl:value-of select="variabledata/bailiff/availability"/>
	</xsl:variable>
	<xsl:variable name="vdFormCompleteDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/formcompletedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPreliminaryHearingReason">
		<xsl:value-of 
			select="variabledata/claim/hearing/preliminaryhearingreason"/>
	</xsl:variable>
	<xsl:variable name="vdPreliminaryHearingReasonValue">
		<xsl:choose>
			<xsl:when test="$vdPreliminaryHearingReason = 'DIS'">to consider 
				whether the <xsl:value-of select="$vdAllocation"/> can be 
				disposed of because the <xsl:value-of 
				select="$vdHearingReasonClaimantDefendant"/> no real prospect 
				of success at a final hearing. </xsl:when>
			<xsl:when test="$vdPreliminaryHearingReason = 'SD'">special 
				directions are needed in this <xsl:value-of 
				select="$vdAllocation"/> to prepare for the final hearing which 
				the judge would prefer to explain to you in person. </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdAllPartiesAgree">
		<xsl:value-of select="variabledata/order/allpartiesagree"/>
	</xsl:variable>
	<xsl:variable name="vdApplicantQAId">
		<xsl:value-of select="variabledata/order/applicantidqa"/>
	</xsl:variable>
	<xsl:variable name="vdApplicantNameQA">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="/descendant-or-self::node()/claim/descendant-or-self::node()/parent::node()[./id = $vdApplicantQAId]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdApplicantQAAddressMultiLine">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of 
					select="/descendant-or-self::node()/claim/descendant-or-self::node()/parent::node()[./id = $vdApplicantQAId]/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDateStayedUntil">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/datestayeduntil"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFDExpiryDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/obligation/expirydate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="numOfInstigators">
		<xsl:value-of 
			select="count(variabledata/event/InstigatorList/Instigator)"/>
	</xsl:variable>
	<xsl:variable name="vdWordingRequired">
		<xsl:choose>
			<xsl:when test="string-length($vdInstigatorPartyRoleCode) > 0"> The 
				hearing of the <xsl:if 
				test="variabledata/event/InstigatorList/Instigator/CasePartyRoleCode='CLAIMANT'"> 
				claimant's </xsl:if> <xsl:if 
				test="variabledata/event/InstigatorList/Instigator/CasePartyRoleCode='DEFENDANT'"> 
				defendant's </xsl:if> application for </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:template name="numberpostfix">
		<xsl:param name="number"/>
		<xsl:value-of select="$number"/>
		<xsl:if test="string-length($number) = 1">
			<xsl:choose>
				<xsl:when test="$number = '1'">
					<fo:inline vertical-align="super" font-size="8pt">st 
						</fo:inline>
				</xsl:when>
				<xsl:when test="$number = '2'">
					<fo:inline vertical-align="super" font-size="8pt">nd 
						</fo:inline>
				</xsl:when>
				<xsl:when test="$number = '3'">
					<fo:inline vertical-align="super" font-size="8pt">rd 
						</fo:inline>
				</xsl:when>
				<xsl:otherwise>
					<fo:inline vertical-align="super" font-size="8pt">th 
						</fo:inline>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
		<xsl:if test="string-length($number) > 1">
			<xsl:variable name="lastchar">
				<xsl:value-of 
					select="substring($number, string-length($number), 1)"/>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="$lastchar = '1' and $number != '11'">
					<fo:inline vertical-align="super" font-size="8pt">st 
						</fo:inline>
				</xsl:when>
				<xsl:when test="$lastchar = '2' and $number != '12'">
					<fo:inline vertical-align="super" font-size="8pt">nd 
						</fo:inline>
				</xsl:when>
				<xsl:when test="$lastchar = '3' and $number != '13'">
					<fo:inline vertical-align="super" font-size="8pt">rd 
						</fo:inline>
				</xsl:when>
				<xsl:otherwise>
					<fo:inline vertical-align="super" font-size="8pt">th 
						</fo:inline>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>
	<xsl:template name="variableRoleCredDebt">
		<xsl:param name="role"/>
		<xsl:if test="string-length(/variabledata/division) > 0 and /variabledata/division = 'F'">
			<xsl:choose>
				<xsl:when test="$role = 'claimant'">Creditor</xsl:when>
				<xsl:when test="$role = 'defendant'">Debtor</xsl:when>
				<xsl:when test="$role = 'jcreditor'">Creditor</xsl:when>
				<xsl:when test="$role = 'jdebtor'">Debtor</xsl:when>
			</xsl:choose>
		</xsl:if>
		<xsl:if test="string-length(/variabledata/division) = 0 or /variabledata/division != 'F'">
			<xsl:choose>
				<xsl:when test="$role = 'claimant'">Claimant</xsl:when>
				<xsl:when test="$role = 'defendant'">Defendant</xsl:when>
				<xsl:when test="$role = 'jcreditor'">Judgment Creditor</xsl:when>
				<xsl:when test="$role = 'jdebtor'">Judgment Debtor</xsl:when>
			</xsl:choose>
		</xsl:if>
	</xsl:template>
	<xsl:variable name="vdSubjectPartyCode">
		<xsl:choose>
			<xsl:when test="$vdSubjectPartyRoleCode = 'CLAIMANT'">claimant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'DEFENDANT'">defendant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">claimant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">defendant</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSubjectPartyCodeOther">
		<xsl:choose>
			<xsl:when test="$vdSubjectPartyRoleCode = 'CLAIMANT'">defendant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'DEFENDANT'">claimant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">defendant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">claimant</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdApplicationFor">
		<xsl:copy-of select="variabledata/notice/applicationfor"/>
	</xsl:variable>
	<xsl:variable name="vdDefendantIntentionCode">
		<xsl:value-of select="variabledata/notice/defendantintention"/>
	</xsl:variable>
	<xsl:variable name="vdDefendantIntentionOther">
		<xsl:value-of select="variabledata/notice/defendantintentionother"/>
	</xsl:variable>
	<xsl:variable name="vdDefendantIntention">
		<xsl:choose>
			<xsl:when test="$vdDefendantIntentionCode = 'ALL'"> defend all of 
				the claim. </xsl:when>
			<xsl:when test="$vdDefendantIntentionCode = 'CTST'"> contest the 
				court's jurisdiction. </xsl:when>
			<xsl:when test="$vdDefendantIntentionCode = 'PRT'"> defend part of 
				the claim. </xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdDefendantIntentionOther"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDefendantIntentionValue">
		<xsl:choose>
			<xsl:when test="$vdDefendantIntention = 'CTST'"> an application to 
				contest the court's jurisdiction. </xsl:when>
			<xsl:otherwise> a defence. </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdServiceName">
		<xsl:choose>
			<xsl:when test="$vdServiceAddressGiven = 'ACK'">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/notice/servicesolicitorname"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="$vdServiceAddressGiven = 'ADDR'">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdSubjectNumber]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdServiceAddressGiven">
		<xsl:value-of 
			select="variabledata/notice/serviceaddress/serviceaddressgiven"/>
	</xsl:variable>
	<xsl:variable name="vdServiceAddressGivenValue">
		<xsl:choose>
			<xsl:when test="$vdServiceAddressGiven = 'ADDR'"> The defendant has 
				given a new address for service of documents </xsl:when>
			<xsl:when test="$vdServiceAddressGiven = 'ACK'"> The 
				acknowledgement was filed by the solicitors acting for the 
				defendant who have given the following name and address for 
				service of documents </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdServiceAddress">
		<xsl:choose>
			<xsl:when test="$vdServiceAddressGiven = 'ACK'">
				<xsl:copy-of 
					select="variabledata/notice/serviceaddress/address"/>
			</xsl:when>
			<xsl:when test="$vdServiceAddressGiven = 'ADDR'">
				<xsl:copy-of 
					select="variabledata/notice/serviceaddress/address"/>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdServiceAddressDX">
		<xsl:choose>
			<xsl:when test="$vdServiceAddressGiven = 'ACK'">
				<xsl:value-of select="variabledata/notice/serviceaddressdx"/>
			</xsl:when>
			<xsl:when test="$vdServiceAddressGiven = 'ADDR'">
				<xsl:value-of select="variabledata/notice/serviceaddressdx"/>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPaymentInFullDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/judgment/paymentinfulldate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPaymentFrequency">
		<xsl:value-of 
			select="variabledata/judgment/variations/variation[position()=last()]/resultperid"/>
	</xsl:variable>
	<xsl:variable name="vdPaymentFrequencyValue">
		<xsl:choose>
			<xsl:when test="$vdPaymentFrequency = 'FW'"> forthwith</xsl:when>
			<xsl:when test="$vdPaymentFrequency = 'FUL'"> by <xsl:value-of 
				select="$vdVariationPaymentDate"/> </xsl:when>
			<xsl:otherwise> by instalments of &#163;<xsl:call-template 
				name="correctCalculation"> <xsl:with-param name="value"> 
				<xsl:value-of select="$vdVariationAmountOffered"/> 
				</xsl:with-param> </xsl:call-template> for every <xsl:choose> 
				<xsl:when test="$vdPaymentFrequency = 'MTH'"> month </xsl:when> 
				<xsl:when test="$vdPaymentFrequency = 'WK'"> week </xsl:when> 
				<xsl:when test="$vdPaymentFrequency = 'FOR'"> fortnight 
				</xsl:when> <xsl:otherwise/> </xsl:choose> the first payment to 
				reach the <xsl:value-of select="$vdSubjectPartyCodeOther"/> by 
				<xsl:value-of select="$vdVariationPaymentDate"/> 
				</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInstalmentPeriod">
		<xsl:value-of select="variabledata/judgment/instalmentperiod"/>
	</xsl:variable>
	<xsl:variable name="vdInstalmentPeriodValue">
		<xsl:choose>
			<xsl:when test="$vdInstalmentPeriod = 'MTH'">
				<fo:block>month</fo:block>
			</xsl:when>
			<xsl:when test="$vdInstalmentPeriod = 'FOR'">
				<fo:block>fortnight</fo:block>
			</xsl:when>
			<xsl:when test="$vdInstalmentPeriod = 'WK'">
				<fo:block>week</fo:block>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInterestIncluded">
		<xsl:value-of select="variabledata/order/interestincluded"/>
	</xsl:variable>
	<xsl:variable name="vdInterestIncludedAmount">
		<xsl:value-of select="variabledata/order/interestincludedamount"/>
	</xsl:variable>
	<xsl:variable name="vdVariationAmountOffered">
		<xsl:value-of 
			select="variabledata/judgment/variations/variation[position()=last()]/resultamount"/>
	</xsl:variable>
	<xsl:variable name="vdGoodsDetained">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/judgment/goodsdetained"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdGoodsDetainedValue">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/judgment/goodsdetainedvalue"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDateOfGoodsReturned">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/judgment/dateofgoodsreturned"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdGoodsReturnDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/goodsreturndate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdUnpaidAmount">
		<xsl:value-of select="variabledata/judgment/unpaidamount"/>
	</xsl:variable>
	<xsl:variable name="vdCertifiedFitForCounsel">
		<xsl:value-of select="variabledata/judgment/certifiedfitforcounsel"/>
	</xsl:variable>
	<xsl:variable name="vdBalanceofTotalPrice">
		<xsl:value-of select="variabledata/order/balanceoftotalprice"/>
	</xsl:variable>
	<xsl:variable name="vdOrderDateMade">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/datemade"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPaymentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/paymentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/orderdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDateOfExtension">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/dateofextension"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/judgmentorderdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdResultDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/ordersetasidedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOrderMadeByConsent">
		<xsl:value-of select="variabledata/judgment/ordermadebyconsent"/>
	</xsl:variable>
	<xsl:variable name="vdHirePurchaseAgreement">
		<xsl:value-of select="variabledata/judgment/hirepurchaseagreement"/>
	</xsl:variable>
	<xsl:variable name="vdAgreementDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/judgment/agreementdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentForthwith">
		<xsl:value-of select="variabledata/judgment/judgmentforthwith"/>
	</xsl:variable>
	<xsl:variable name="vdCourtAddress">
		<xsl:copy-of select="variabledata/court/address"/>
	</xsl:variable>
	<xsl:variable name="vdCourtTelephoneNumber">
		<xsl:choose>
			<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
				<xsl:value-of select="variabledata/court/drtelnumber"/>
			</xsl:when>
			<xsl:otherwise><xsl:value-of select="variabledata/court/telephonenumber"/></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdExecutingCourtTelephoneNumber">
		<xsl:choose>
			<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
				<xsl:value-of select="variabledata/executingcourt/drtelnumber"/>
			</xsl:when>
			<xsl:otherwise><xsl:value-of select="variabledata/executingcourt/telephonenumber"/></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCourtFaxNumber">
		<xsl:value-of select="variabledata/court/faxnumber"/>
	</xsl:variable>
	<xsl:variable name="vdCourtDXNumber">
		<xsl:value-of select="variabledata/court/dx"/>
	</xsl:variable>
	<xsl:variable name="vdProducedBy">
		<xsl:value-of select="variabledata/user/alias"/>
	</xsl:variable>
	<xsl:variable name="vdDistrictRegistry">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/division"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCourt">
		<xsl:copy-of select="variabledata/court/*"/>
	</xsl:variable>
	<xsl:variable name="vdCourtDetails">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- It's case based (could be a home warrant), so display case court -->
				<xsl:choose>
					<xsl:when test="string-length(variabledata/court/name) = 0">
						<xsl:copy-of select="variabledata/usercourt/*"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:copy-of select="variabledata/court/*"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's not case based (foreign warrant), so get court details from the user-->
				<xsl:copy-of select="xalan:nodeset(variabledata/executingcourt/*)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdLetterCourtCode">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- It's case based (could be a home warrant), so display case court -->
				<xsl:choose>
					<xsl:when test="string-length(variabledata/court/name) = 0">
						<xsl:copy-of select="variabledata/usercourt/courtcode"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:copy-of select="variabledata/court/courtcode"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<!-- It's not case based (foreign warrant), so get court details from the user-->
				<xsl:copy-of select="xalan:nodeset(variabledata/executingcourt/courtcode)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCourtDivision">
		<xsl:choose>
			<xsl:when test="$vdDistrictRegistry = 'Q'">
				<fo:block text-align="left">In the High Court of 
					Justice</fo:block>
				<fo:block text-align="left">Queen's Bench Division</fo:block>
			</xsl:when>
			<xsl:when test="$vdDistrictRegistry = 'C'">
				<fo:block text-align="left">In the High Court of 
					Justice</fo:block>
				<fo:block text-align="left">Chancery Division</fo:block>
			</xsl:when>
			<xsl:otherwise>
				<fo:block text-align="left">In the</fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCourtDivisionSingleLine">
		<xsl:choose>
			<xsl:when test="$vdDistrictRegistry = 'Q'"> In the High Court of 
				Justice Queen's Bench Division </xsl:when>
			<xsl:when test="$vdDistrictRegistry = 'C'"> In the High Court of 
				Justice Chancery Division </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/court/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdMCOLCourtName">
		<xsl:text>Money Claim Online, Northampton</xsl:text>
	</xsl:variable>
	<xsl:variable name="vdMCOLCourtTelephoneNumber">
		<xsl:text>0300 123 1057</xsl:text>
	</xsl:variable>
	<xsl:variable name="vdMCOLCourtFaxNumber">
		<xsl:text>01604 619526</xsl:text>
	</xsl:variable>
	<xsl:variable name="vdCourtOrDistrict">
		<xsl:choose>
			<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">District 
				Registry</xsl:when>
			<xsl:when test="$vdDistrictRegistry = 'F'">Family Court</xsl:when>
			<xsl:otherwise>County Court</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdClaimNumber">
		<xsl:value-of select="variabledata/claim/number"/>
	</xsl:variable>
	<xsl:variable name="vdInsolvencyNumber">
		<xsl:value-of select="variabledata/claim/insolvencynumber"/>
	</xsl:variable>
	<xsl:variable name="vdCreditorCode">
		<xsl:value-of select="variabledata/claim/creditorcode"/>
	</xsl:variable>
	<xsl:variable name="vdClaimantId">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/mainclaimantid) > 0">
				<xsl:value-of select="variabledata/claim/mainclaimantid"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of 
					select="variabledata/claim/claimant[number=1]/id"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdClaimantName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/claimant[id=$vdClaimantId]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdClaimantReference">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/mainclaimantid) > 0">
				<xsl:variable name="mainClaimantId">
					<xsl:value-of select="variabledata/claim/mainclaimantid"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/claimant[surrogateid = $mainClaimantId]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/claimant[surrogateid = $mainClaimantId]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/claimant[surrogateid = $mainClaimantId]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/claimant[number=1]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/claimant[number=1]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/claimant[number=1]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPart20ClaimantName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/part20claimant[number=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPart20ClaimantReference">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/part20claimant[number=1]/representativeid) > 0">
				<xsl:value-of 
					select="variabledata/claim/part20claimant[number=1]/solicitorreference"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of 
					select="variabledata/claim/part20claimant[number=1]/reference"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDefendant1Name">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/defendant[number=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:template name="noticeIssueDefendantName">
		<xsl:param name="defendant"/>
		<xsl:variable name="defname" select="xalan:nodeset($defendant)/name"/>
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="$defname"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
		<xsl:choose>
			<xsl:when test="$vdNumberOfDefendants = 2">
				<fo:inline font-size="8pt"> and 1 other</fo:inline>
			</xsl:when>
			<xsl:when test="$vdNumberOfDefendants > 2">
				<fo:inline font-size="8pt"> and <xsl:value-of 
					select="$vdNumberOfDefendants - 1"/> 
					others</fo:inline>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="noticeIssueDefendantReference">
		<xsl:param name="defendant"/>
		<xsl:variable name="representativeid" select="xalan:nodeset($defendant)/representativeid"/>
		<xsl:variable name="defreference" select="xalan:nodeset($defendant)/reference"/>
		<xsl:variable name="solreference" select="xalan:nodeset($defendant)/solicitorreference"/>
		<xsl:choose>
			<xsl:when test="string-length($representativeid) > 0">
				<xsl:value-of select="$solreference"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$defreference"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:variable name="vdDefendantName">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/maindefendantid) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/defendant[id=variabledata/claim/maindefendantid]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/defendant/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
				<xsl:choose>
					<xsl:when test="$vdNumberOfDefendants = 2">
						<fo:inline font-size="8pt"> and 1 other</fo:inline>
					</xsl:when>
					<xsl:when test="$vdNumberOfDefendants > 2">
						<fo:inline font-size="8pt"> and <xsl:value-of 
							select="$vdNumberOfDefendants - 1"/> 
							others</fo:inline>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:template name="tmpAddresseesDefendantName">
		<xsl:param name="addressee"/>
		<xsl:variable name="addresseeId" select="xalan:nodeset($addressee)/id"/>
		<xsl:choose>
			<xsl:when 
				test="/variabledata/claim/*[id = $addresseeId and type = 'defendant']">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="/variabledata/claim/*[id = $addresseeId and type = 'defendant']/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
				<xsl:choose>
					<xsl:when test="$vdNumberOfDefendants = 2">
						<fo:inline font-size="8pt"> and 1 other</fo:inline>
					</xsl:when>
					<xsl:when test="$vdNumberOfDefendants > 2">
						<fo:inline font-size="8pt"> and <xsl:value-of 
							select="$vdNumberOfDefendants - 1"/> 
							others</fo:inline>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:when 
				test="/variabledata/claim/defendant[representativeid = /variabledata/claim/representative[id = $addresseeId]/surrogateid]">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="/variabledata/claim/defendant[representativeid = /variabledata/claim/representative[id = $addresseeId]/surrogateid]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
				<xsl:choose>
					<xsl:when test="$vdNumberOfDefendants = 2">
						<fo:inline font-size="8pt"> and 1 other</fo:inline>
					</xsl:when>
					<xsl:when test="$vdNumberOfDefendants > 2">
						<fo:inline font-size="8pt"> and <xsl:value-of 
							select="$vdNumberOfDefendants - 1"/> 
							others</fo:inline>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="/variabledata/claim/defendant/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
				<xsl:choose>
					<xsl:when test="$vdNumberOfDefendants = 2">
						<fo:inline font-size="8pt"> and 1 other</fo:inline>
					</xsl:when>
					<xsl:when test="$vdNumberOfDefendants > 2">
						<fo:inline font-size="8pt"> and <xsl:value-of 
							select="$vdNumberOfDefendants - 1"/> 
							others</fo:inline>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="tmpAddresseesDefendantReference">
		<xsl:param name="addressee"/>
		<xsl:variable name="addresseeId" select="xalan:nodeset($addressee)/id"/>
		<xsl:choose>
			<xsl:when 
				test="/variabledata/claim/*[id = $addresseeId and type = 'defendant']">
				<xsl:choose>
					<xsl:when 
						test="string-length(/variabledata/claim/defendant[id = $addresseeId]/representativeid) > 0">
						<xsl:value-of 
							select="/variabledata/claim/defendant[id = $addresseeId]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="/variabledata/claim/defendant[id = $addresseeId]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when 
				test="/variabledata/claim/defendant[representativeid = /variabledata/claim/representative[id = $addresseeId]/surrogateid]">
				<xsl:choose>
					<xsl:when 
						test="string-length(/variabledata/claim/defendant[representativeid = /variabledata/claim/representative[id = $addresseeId]/surrogateid]/representativeid) > 0">
						<xsl:value-of 
							select="/variabledata/claim/defendant[representativeid = /variabledata/claim/representative[id = $addresseeId]/surrogateid]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="/variabledata/claim/defendant[representativeid = /variabledata/claim/representative[id = $addresseeId]/surrogateid]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when 
						test="string-length(/variabledata/claim/defendant[number=1]/representativeid) > 0">
						<xsl:value-of 
							select="/variabledata/claim/defendant[number=1]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="/variabledata/claim/defendant[number=1]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:variable name="vdSubjectDefendantName">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/maindefendantid) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/defendant[./number = $vdSubjectNumber]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/defendant[./number = $vdSubjectNumber]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
				<xsl:choose>
					<xsl:when test="$vdNumberOfDefendants = 2">
						<fo:inline font-size="8pt"> and 1 other</fo:inline>
					</xsl:when>
					<xsl:when test="$vdNumberOfDefendants > 2">
						<fo:inline font-size="8pt"> and <xsl:value-of 
							select="$vdNumberOfDefendants - 1"/> 
							others</fo:inline>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- This variable will return the name of the defendant who has been selected as the subject -->
	<!-- of the output that will be generated. -->
	<xsl:variable name="vdSubjectDefendantName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/defendant[number=$vdSubjectNumber]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
		<xsl:choose>
			<xsl:when test="$vdNumberOfDefendants = 2">
				<fo:inline font-size="8pt"> and 1 other</fo:inline>
			</xsl:when>
			<xsl:when test="$vdNumberOfDefendants > 2">
				<fo:inline font-size="8pt"> and <xsl:value-of 
					select="$vdNumberOfDefendants - 1"/> others</fo:inline>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- This variable will return the reference of the defendant who has been selected as the subject -->
	<!-- of the output that will be generated. -->
	<xsl:variable name="vdSubjectDefendantReference">
		<!-- If the defendant is represented then use the solicitor's reference -->
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/defendant[number=$vdSubjectNumber]/representativeid) > 0">
				<xsl:value-of 
					select="variabledata/claim/defendant[number=$vdSubjectNumber]/solicitorreference"/>
			</xsl:when>
			<!-- Otherwise use the the defendant's reference -->
			<xsl:otherwise>
				<xsl:value-of 
					select="variabledata/claim/defendant[number=$vdSubjectNumber]/reference"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDefendantReference">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/maindefendantid) > 0">
				<xsl:variable name="mainDefendantId">
					<xsl:value-of select="variabledata/claim/maindefendantid"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/defendant[surrogateid = $mainDefendantId]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/defendant[surrogateid = $mainDefendantId]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/defendant[surrogateid = $mainDefendantId]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/defendant[number=1]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/defendant[number=1]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/defendant[number=1]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDefendantBirthDate">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/defendant[number=1]/birthdate"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPart20DefendantName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/part20defendant[number=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPart20DefendantReference">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/part20defendant[number=1]/representativeid) > 0">
				<xsl:value-of 
					select="variabledata/claim/part20defendant[number=1]/solicitorreference"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of 
					select="variabledata/claim/part20defendant[number=1]/reference"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdNumberOfPart20defendant">
		<xsl:value-of select="count(variabledata/claim/part20defendant)"/>
	</xsl:variable>
	<xsl:variable name="vdNumberOfPart20claimant">
		<xsl:value-of select="count(variabledata/claim/part20claimant)"/>
	</xsl:variable>
	<xsl:variable name="vdNumberOfClaimants">
		<xsl:value-of select="count(variabledata/claim/claimant)"/>
	</xsl:variable>
	<xsl:variable name="vdNumberOfDefendants">
		<xsl:value-of select="count(variabledata/claim/defendant)"/>
	</xsl:variable>
	<xsl:variable name="vdNumberOfInstigators">
		<xsl:value-of select="count(variabledata/event/InstigatorList/Instigator)"/>
	</xsl:variable>
	<xsl:variable name="vdDebtorName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/debtor[position()=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDebtorAddress">
		<xsl:copy-of select="variabledata/claim/debtor[position()=1]/address"/>
	</xsl:variable>
	<xsl:variable name="vdCreditorName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/creditor[position()=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCompanyName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/company[position()=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCompanyAddress">
		<xsl:copy-of select="variabledata/claim/company[position()=1]/address"/>
	</xsl:variable>
	<xsl:variable name="vdApplicantName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/applicant[position()=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOfficialReceiverName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/officialreceiver[position()=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOfficialReceiverPartyAddress">
		<xsl:copy-of 
			select="variabledata/claim/officialreceiver[position()=1]/address"/>
	</xsl:variable>
	<xsl:variable name="vdOfficialReceiverPartyTelephone">
		<xsl:if 
			test="string-length(variabledata/claim/officialreceiver[position()=1]/telephonenumber) > 0">
			 (Telephone number: <xsl:copy-of 
			select="variabledata/claim/officialreceiver[position()=1]/telephonenumber"/>) 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdTrusteeName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/trustee[position()=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTrusteePartyAddress">
		<xsl:copy-of 
			select="variabledata/claim/trustee[position()=1]/address"/>
	</xsl:variable>
	<xsl:variable name="vdTrusteePartyTelephone">
		<xsl:if 
			test="string-length(variabledata/claim/trustee[position()=1]/telephonenumber) > 0">
			 (Telephone number: <xsl:copy-of 
			select="variabledata/claim/trustee[position()=1]/telephonenumber"/>) 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPetitionerName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/petitioner[position()=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPetitionerHasSolicitor">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/petitioner/representativeid) > 0" 
				>
				<xsl:text>Y</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>N</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPetitionerSolAddress">
		<xsl:copy-of 
			select="variabledata/claim/representative[./surrogateid= ../petitioner/representativeid]/*" 
			/>
	</xsl:variable>
	<xsl:variable name="vdPetitionerSolTelephone">
		<xsl:copy-of 
			select="variabledata/claim/representative[./surrogateid= ../petitioner/representativeid]/telephonenumber" 
			/>
	</xsl:variable>
	<xsl:variable name="vdPetitionerSolReference">
		<xsl:copy-of select="variabledata/claim/petitioner/solicitorreference" 
			/>
	</xsl:variable>
	<xsl:variable name="vdPetitionerAddress">
		<xsl:copy-of select="variabledata/claim/petitioner/*"/>
	</xsl:variable>
	<xsl:variable name="vdPetitionerTelephone">
		<xsl:value-of select="variabledata/claim/petitioner/telephonenumber" />
	</xsl:variable>
	<xsl:variable name="vdPetitionerReference">
		<xsl:value-of select="variabledata/claim/petitioner/reference" />
	</xsl:variable>
	<xsl:variable name="vdInsolvencyPractitionerName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/insolvencypractitioner[position()=last()]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInsolvencyPractitionerAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/claim/insolvencypractitioner[position()=last()]/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInsolvencyPractitionerMultiAddress">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of 
					select="variabledata/claim/insolvencypractitioner[position()=last()]/*"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdNationalCodedPartyName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/nationalcodedparty[position()=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdNationalCodedPartysPayeeName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/nationalcodedpartyspayee[position()=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdEventDate">
		<xsl:choose>
			<xsl:when test="string-length(variabledata/event/date) > 0">
				<xsl:call-template name="format-date-placeholder">
					<xsl:with-param name="date-xpath">
						<xsl:value-of select="variabledata/event/date"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="string-length(variabledata/coevent/date) > 0">
				<xsl:call-template name="format-date-placeholder">
					<xsl:with-param name="date-xpath">
						<xsl:value-of select="variabledata/coevent/date"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="string-length(variabledata/claim/dateofissue) > 0">
				<xsl:call-template name="format-date-placeholder">
					<xsl:with-param name="date-xpath">
						<xsl:value-of select="variabledata/claim/dateofissue"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$emptyDate"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCOEventReceiptDate">
		<xsl:choose>
			<xsl:when test="string-length(variabledata/coevent/receiptdate) > 0">
				<xsl:call-template name="format-date-placeholder">
					<xsl:with-param name="date-xpath">
						<xsl:value-of select="variabledata/coevent/receiptdate"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$emptyDate"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdClaimDateOfIssue">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/claim/dateofissue"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdClaimReceiptDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/claim/receiptdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHearingDate">
		<xsl:if test="string-length(variabledata/claim/hearing/date) >0">
			<xsl:call-template name="format-date-placeholder">
				<xsl:with-param name="date-xpath">
					<xsl:value-of select="variabledata/claim/hearing/date"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
		<xsl:if test="string-length(variabledata/claim/hearing/date) =0">
			<xsl:call-template name="format-date-placeholder">
				<xsl:with-param name="date-xpath">
					<xsl:value-of select="variabledata/claim/dateofissue"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdHearingDate1">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/claim/hearing/date"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSelectHearingDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/letter/selectdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHearingTime">
		<xsl:choose>
			<xsl:when test="string-length(variabledata/claim/hearing/time) > 0">
				<xsl:value-of select="variabledata/claim/hearing/time"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$emptyTime"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingCourtName">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/hearing/court/name) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/hearing/court/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>_____________________________</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHasHearingAt">
		<xsl:if 
			test="string-length(variabledata/claim/hearing/court/atname) > 0">Y</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdHearingAtCourtName">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/hearing/court/atname) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/hearing/court/atname"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>_____________________________</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingCourtAddress">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/hearing/court/address/line1) > 0">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/hearing/court/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$emptyAddress"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingAtCourtAddress">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/hearing/court/at/address/line1) > 0">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/hearing/court/at/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>
					__________________________________________________</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingListed">
		<xsl:value-of select="variabledata/claim/hearing/hearinglisted"/>
	</xsl:variable>
	<xsl:variable name="vdHearingAtCourtDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/claim/hearing/court/atdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHearingAtCourtTime">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/hearing/court/attime) > 0">
				<xsl:value-of select="variabledata/claim/hearing/court/attime"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$emptyTime"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingCourtOrDistrict">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/hearing/court/districtregistry='Y'">
				District Registry</xsl:when>
			<xsl:otherwise>County Court</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingAtCourtOrDistrict">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/hearing/court/atdistrictregistry='Y'">
				District Registry</xsl:when>
			<xsl:otherwise>County Court</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdServiceDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/servicedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdServiceDate1">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/servicedate1"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdServiceReplyDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/servicereplydate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPostedDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/posteddate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDeceasedEstate">
		<xsl:choose>
			<xsl:when test="string-length(variabledata/notice/estate) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of select="variabledata/notice/estate"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>____________</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdProcessNotServedNotDec">
		<xsl:value-of select="variabledata/notice/processnotserved"/>
	</xsl:variable>
	<xsl:variable name="vdProcessNotServedOther">
		<xsl:value-of select="variabledata/notice/processnotservedother"/>
	</xsl:variable>
	<xsl:variable name="vdProcessNotServed">
		<xsl:choose>
			<xsl:when test="$vdProcessNotServedNotDec = 'APP'">application</xsl:when>
			<xsl:when test="$vdProcessNotServedNotDec = 'CLM'">claim form</xsl:when>
			<xsl:when test="$vdProcessNotServedNotDec = 'JDG'">judgment</xsl:when>
			<xsl:when test="$vdProcessNotServedNotDec = 'ORD'">order</xsl:when>
			<xsl:when test="$vdProcessNotServedNotDec = 'OFQ'">order for questioning</xsl:when>
			<xsl:when test="$vdProcessNotServedNotDec = 'OTH'"><xsl:value-of select="$vdProcessNotServedOther"/></xsl:when>
			<xsl:when test="$vdProcessNotServedNotDec = 'PRT'">particulars of claim</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFromOtherCourt">
		<xsl:value-of select="variabledata/notice/fromothercourt"/>
	</xsl:variable>
	<xsl:variable name="vdReceiptDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/receiptdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDefendantNameCorrected">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/notice/defendantnamecorrected"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdNewDefendantName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/notice/newdefendantname"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/judgment/judgmentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDateOut">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/judgment/judgmentdateout"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdVariationApplicationDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/judgment/variations/variation[position()=last()]/appdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdVariationResultDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/judgment/variations/variation[position()=last()]/dateresult"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentStatusValue1">
		<xsl:choose>
			<xsl:when test="$vdCourtCode = '335'">
				<xsl:choose>
					<xsl:when test="$vdJudgmentStatus = 'SET ASIDE'"> The judgment 
						giving rise to the registration has been set aside </xsl:when>
					<xsl:when test="$vdJudgmentStatus = 'CANCELLED'"> This debt, 
						including any interest, is paid </xsl:when>
					<xsl:when test="$vdJudgmentStatus = 'SATISFIED'"> This debt, 
						including any interest, is paid </xsl:when>
					<xsl:otherwise/>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$vdJudgmentStatus = 'SET ASIDE'"> The judgment 
						giving rise to the registration has been set aside </xsl:when>
					<xsl:when test="$vdJudgmentStatus = 'CANCELLED'"> This debt, 
						including any interest, is satisfied </xsl:when>
					<xsl:when test="$vdJudgmentStatus = 'SATISFIED'"> This debt, 
						including any interest, is satisfied </xsl:when>
					<xsl:otherwise/>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentStatusValue2">
		<xsl:choose>
			<xsl:when test="$vdCourtCode = '335'">
				<xsl:choose>
					<xsl:when test="$vdJudgmentStatus = 'SET ASIDE'"> REMOVED (because 
						judgment was set aside) </xsl:when>
					<xsl:when test="$vdJudgmentStatus = 'CANCELLED'"> CANCELLED (as 
						payment has been made in full within one month) </xsl:when>
					<xsl:when test="$vdJudgmentStatus = 'SATISFIED'"> Marked to show 
						that the debt is satisfied </xsl:when>
					<xsl:otherwise/>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$vdJudgmentStatus = 'SET ASIDE'"> REMOVED (because 
						judgment was set aside) </xsl:when>
					<xsl:when test="$vdJudgmentStatus = 'CANCELLED'"> REMOVED (as 
						payment has been made in full within one month) </xsl:when>
					<xsl:when test="$vdJudgmentStatus = 'SATISFIED'"> Marked to show 
						that the debt is satisfied </xsl:when>
					<xsl:otherwise/>
				</xsl:choose>							
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentStatus">
		<xsl:value-of select="variabledata/judgment/judgmentstatus"/>
	</xsl:variable>
	<xsl:variable name="vdFinalDate">
		<xsl:choose>
			<xsl:when test="$vdJudgmentStatus = 'SET ASIDE'">
				<xsl:value-of select="$vdSetAsideDate"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="format-date-placeholder">
					<xsl:with-param name="date-xpath">
						<xsl:value-of 
							select="variabledata/judgment/paidinfulldate"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSetAsideDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/judgment/setaside/dateresult"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCourtCode">
		<xsl:value-of select="variabledata/court/courtcode"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCourtCode">
		<xsl:value-of select="variabledata/judgment/judgmentcourtcode"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCourtName">
		<xsl:choose>
			<xsl:when test="$vdJudgmentCourtCode != $vdCourtCode"> in 
				<xsl:call-template name="court-name-description">
					<xsl:with-param name="courtCode">
						<xsl:value-of select="$vdJudgmentCourtCode"/>
					</xsl:with-param>
					<xsl:with-param name="courtName">
						<xsl:value-of select="$vdJudgmentCourtFullName"/>
					</xsl:with-param>
					<xsl:with-param name="mcolCheck">N</xsl:with-param>
					<xsl:with-param name="highCourtPrefix">Y</xsl:with-param>
				</xsl:call-template></xsl:when>
			<xsl:otherwise> in this court</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCourtName2">
		<xsl:choose>
			<xsl:when test="$vdJudgmentCourtCode != $vdCourtCode">
				<xsl:call-template name="court-name-description">
					<xsl:with-param name="courtCode">
						<xsl:value-of select="$vdJudgmentCourtCode"/>
					</xsl:with-param>
					<xsl:with-param name="courtName">
						<xsl:value-of select="$vdJudgmentCourtFullName"/>
					</xsl:with-param>
					<xsl:with-param name="mcolCheck">N</xsl:with-param>
					<xsl:with-param name="highCourtPrefix">Y</xsl:with-param>
				</xsl:call-template></xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCourtFullName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/judgment/judgmentcourtname"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentAddress">
		<xsl:copy-of select="variabledata/judgment/address"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentAddressLine1">
		<xsl:copy-of select="variabledata/judgment/address/line1"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentPayee">
		<xsl:choose>
			<xsl:when test="variabledata/judgment/judgmentpayee = 'N'">
				<xsl:value-of 
					select="variabledata/claim/representative[id = $vdSolicitorSubjectId]/name"/>
				<br/>
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/representative[id = $vdSolicitorSubjectId]/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdSubjectName"/>
				<br/>
				<xsl:value-of select="$vdSubjectAddress"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentResult">
		<xsl:value-of 
			select="variabledata/judgment/variations/variation[position()=last()]/result"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentResultDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/judgment/variations/variation[position()=last()]/dateresult"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDateDefenceFiled">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/judgment/datedefencefiled"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdVariationPaymentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/judgment/variations/variation[position()=last()]/paydate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFirstPaymentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/judgment/firstpaymentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstalmentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/instalmentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstalmentAmount">
		<xsl:value-of select="variabledata/judgment/instalmentamount"/>
	</xsl:variable>
	<xsl:variable name="vdApplicationToVaryApplicant">
		<xsl:variable name="applicant">
			<xsl:value-of 
				select="variabledata/judgment/variations/variation[id=../../variationid]/applicant" 
				/>
		</xsl:variable>
		<xsl:variable name="variationPartyFor">
			<xsl:choose>
				<xsl:when 
					test="count(variabledata/judgment/infavourofparties/party) > 1">
					<xsl:for-each 
						select="variabledata/judgment/infavourofparties/party">
						<xsl:choose>
							<xsl:when test="position() = last()">
								&#xa0;and&#xa0;</xsl:when>
							<xsl:otherwise>
								<xsl:if test="position() > 1">
									&#xa0;,&#xa0;</xsl:if>
							</xsl:otherwise>
						</xsl:choose>
						<xsl:variable name="number">
							<xsl:value-of select="partynumber"/>
						</xsl:variable>
						<xsl:variable name="numbersuffix">
							<xsl:call-template name="numberpostfix">
								<xsl:with-param name="number">
									<xsl:value-of select="$number"/>
								</xsl:with-param>
							</xsl:call-template>
						</xsl:variable>
						<xsl:copy-of select="$numbersuffix"/>
						<xsl:choose>
							<xsl:when test="partyrolecode = 'CLAIMANT'">claimant</xsl:when>
							<xsl:when test="partyrolecode = 'DEFENDANT'">defendant</xsl:when>
							<xsl:when test="partyrolecode = 'PT 20 CLMT'">Part 20 claimant</xsl:when>
							<xsl:when test="partyrolecode = 'PT 20 DEF'">Part 20 defendant</xsl:when>
						</xsl:choose>
					</xsl:for-each>
				</xsl:when>
				<xsl:otherwise>
					<xsl:variable name="number">
						<xsl:value-of 
							select="variabledata/judgment/infavourofparties/party/partynumber"/>
					</xsl:variable>
					<xsl:variable name="numbersuffix">
						<xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of select="$number"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:variable>
					<xsl:copy-of select="$numbersuffix"/>
					<xsl:choose>
						<xsl:when 
							test="variabledata/judgment/infavourofparties/party/partyrolecode = 'CLAIMANT'">claimant</xsl:when>
						<xsl:when 
							test="variabledata/judgment/infavourofparties/party/partyrolecode = 'DEFENDANT'">defendant</xsl:when>
						<xsl:when 
							test="variabledata/judgment/infavourofparties/party/partyrolecode = 'PT 20 CLMT'">Part 20 claimant</xsl:when>
						<xsl:when 
							test="variabledata/judgment/infavourofparties/party/partyrolecode = 'PT 20 DEF'">Part 20 defendant</xsl:when>
					</xsl:choose>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="variationPartyAgainst">
			<xsl:variable name="number">
				<xsl:value-of 
					select="variabledata/judgment/partyagainst/number"/>
			</xsl:variable>
			<xsl:variable name="numbersuffix">
				<xsl:call-template name="numberpostfix">
					<xsl:with-param name="number">
						<xsl:value-of select="$number"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:variable>
			<xsl:copy-of select="$numbersuffix"/>
			<xsl:choose>
				<xsl:when 
					test="variabledata/judgment/partyagainst/rolecode = 'CLAIMANT'">claimant</xsl:when>
				<xsl:when 
					test="variabledata/judgment/partyagainst/rolecode = 'DEFENDANT'">defendant</xsl:when>
				<xsl:when 
					test="variabledata/judgment/partyagainst/rolecode = 'PT 20 CLMT'">Part 20 claimant</xsl:when>
				<xsl:when 
					test="variabledata/judgment/partyagainst/rolecode = 'PT 20 DEF'">Part 20 defendant</xsl:when>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$applicant='PARTY AGAINST'">
				<xsl:value-of select="$variationPartyAgainst" />
			</xsl:when>
			<xsl:when test="$applicant='PARTY FOR'">
				<xsl:value-of select="$variationPartyFor" />
			</xsl:when>
			<xsl:when test="$applicant='BY CONSENT'"> <xsl:value-of 
				select="$variationPartyAgainst"/>&#xa0;and&#xa0;<xsl:value-of 
				select="$variationPartyFor"/> </xsl:when>
			<xsl:when test="$applicant='PROPER OFFICER'">Proper 
				Officer</xsl:when>
			<xsl:when test="$applicant='THIRD_PARTY'">Third Party</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDeterminationPeriod">
		<xsl:value-of select="variabledata/judgment/determinationperiod"/>
	</xsl:variable>
	<xsl:variable name="vdAllocationReasonGiven">
		<xsl:value-of select="variabledata/notice/allocationreasongiven"/>
	</xsl:variable>
	<xsl:variable name="vdAllocationReason">
		<xsl:copy-of select="variabledata/notice/allocationreason"/>
	</xsl:variable>
	<xsl:variable name="vdJudgeTitle">
		<xsl:copy-of select="variabledata/notice/judgetitle"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentInFavourOfRoleCode">
		<xsl:value-of 
			select="variabledata/judgment/infavourofparties/party/partyrolecode"/>
	</xsl:variable>
	<xsl:variable name="vdSelectedJudgmentInFavourOfRoleCode">
		<xsl:value-of 
			select="/variabledata/judgment/infavourofparties/party[partyid=/variabledata/judgment/infavourofparties/selectedinfavourofpartyid]/partyrolecode"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentInFavourOfRole">
		<xsl:choose>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'CLAIMANT'">Claimant</xsl:when>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'DEFENDANT'">Defendant</xsl:when>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'PT 20 CLMT'">Part 20 Claimant</xsl:when>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'PT 20 DEF'">Part 20 Defendant</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSelectedJudgmentInFavourOfRole">
		<xsl:choose>
			<xsl:when test="$vdSelectedJudgmentInFavourOfRoleCode = 'CLAIMANT'">Claimant</xsl:when>
			<xsl:when 
				test="$vdSelectedJudgmentInFavourOfRoleCode = 'DEFENDANT'">Defendant</xsl:when>
			<xsl:when 
				test="$vdSelectedJudgmentInFavourOfRoleCode = 'PT 20 CLMT'">Part 20 Claimant</xsl:when>
			<xsl:when 
				test="$vdSelectedJudgmentInFavourOfRoleCode = 'PT 20 DEF'">Part 20 Defendant</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentInFavourOfRoleLower">
		<xsl:choose>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'CLAIMANT'">claimant</xsl:when>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'DEFENDANT'">defendant</xsl:when>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'PT 20 CLMT'">part 20 claimant</xsl:when>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'PT 20 DEF'">part 20 defendant</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentInFavourOfName">
		<xsl:variable name="partynumber">
			<xsl:value-of 
				select="variabledata/judgment/infavourofparties/party/partynumber"/>
		</xsl:variable>
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:choose>
					<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'CLAIMANT'">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $partynumber]/name"/>
					</xsl:when>
					<xsl:when 
						test="$vdJudgmentInFavourOfRoleCode = 'DEFENDANT'">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $partynumber]/name"/>
					</xsl:when>
					<xsl:when 
						test="$vdJudgmentInFavourOfRoleCode = 'PT 20 CLMT'">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $partynumber]/name"/>
					</xsl:when>
					<xsl:when 
						test="$vdJudgmentInFavourOfRoleCode = 'PT 20 DEF'">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $partynumber]/name"/>
					</xsl:when>
				</xsl:choose>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSelectedJudgmentInFavourOfName">
		<xsl:variable name="selectedPartyId">
			<xsl:value-of 
				select="/variabledata/judgment/infavourofparties/selectedinfavourofpartyid"/>
		</xsl:variable>
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:choose>
					<xsl:when 
						test="$vdSelectedJudgmentInFavourOfRoleCode = 'CLAIMANT'">
						<xsl:value-of 
							select="variabledata/claim/claimant[id = $selectedPartyId]/name"/>
					</xsl:when>
					<xsl:when 
						test="$vdSelectedJudgmentInFavourOfRoleCode = 'DEFENDANT'">
						<xsl:value-of 
							select="variabledata/claim/defendant[id = $selectedPartyId]/name"/>
					</xsl:when>
					<xsl:when 
						test="$vdSelectedJudgmentInFavourOfRoleCode = 'PT 20 CLMT'">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[id = $selectedPartyId]/name"/>
					</xsl:when>
					<xsl:when 
						test="$vdSelectedJudgmentInFavourOfRoleCode = 'PT 20 DEF'">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[id = $selectedPartyId]/name"/>
					</xsl:when>
				</xsl:choose>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentInFavourOfReference">
		<xsl:variable name="partynumber">
			<xsl:value-of 
				select="variabledata/judgment/infavourofparties/party/partynumber"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'CLAIMANT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/claimant[number = $partynumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $partynumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $partynumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'DEFENDANT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/defendant[number = $partynumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $partynumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $partynumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'PT 20 CLMT'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/part20claimant[number = $partynumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $partynumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $partynumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'PT 20 DEF'">
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/part20defendant[number = $partynumber]/representativeid) > 0">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $partynumber]/solicitorreference"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $partynumber]/reference"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentInFavourOfAddress">
		<xsl:variable name="partynumber">
			<xsl:value-of 
				select="variabledata/judgment/infavourofparties/party/partynumber"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'CLAIMANT'">
				<xsl:copy-of 
					select="variabledata/claim/claimant[number = $partynumber]/address"/>
			</xsl:when>
			<xsl:when test="$vdJudgmentInFavourOfRoleCode = 'DEFENDANT'">
				<xsl:copy-of 
					select="variabledata/claim/defendant[number = $partynumber]/address"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSelectedJudgmentInFavourOfAddress">
		<xsl:variable name="selectedPartyId">
			<xsl:value-of 
				select="/variabledata/judgment/infavourofparties/selectedinfavourofpartyid"/>
		</xsl:variable>
		<xsl:copy-of 
			select="/variabledata/claim/*[./id = $selectedPartyId]/address"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentAgainstRoleCode">
		<xsl:value-of select="variabledata/judgment/partyagainst/rolecode"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentAgainstRole">
		<xsl:choose>
			<xsl:when test="$vdJudgmentAgainstRoleCode = 'CLAIMANT'">Claimant</xsl:when>
			<xsl:when test="$vdJudgmentAgainstRoleCode = 'DEFENDANT'">Defendant</xsl:when>
			<xsl:when test="$vdJudgmentAgainstRoleCode = 'PT 20 CLMT'">Part 20 Claimant</xsl:when>
			<xsl:when test="$vdJudgmentAgainstRoleCode = 'PT 20 DEF'">Part 20 Defendant</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentAgainstRoleLower">
		<xsl:choose>
			<xsl:when test="$vdJudgmentAgainstRoleCode = 'CLAIMANT'">claimant</xsl:when>
			<xsl:when test="$vdJudgmentAgainstRoleCode = 'DEFENDANT'">defendant</xsl:when>
			<xsl:when test="$vdJudgmentAgainstRoleCode = 'PT 20 CLMT'">part 20 claimant</xsl:when>
			<xsl:when test="$vdJudgmentAgainstRoleCode = 'PT 20 DEF'">part 20 defendant</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentAgainstName">
		<xsl:variable name="partynumber">
			<xsl:value-of select="variabledata/judgment/partyagainst/number"/>
		</xsl:variable>
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:choose>
					<xsl:when test="$vdJudgmentAgainstRoleCode = 'CLAIMANT'">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $partynumber]/name"/>
					</xsl:when>
					<xsl:when test="$vdJudgmentAgainstRoleCode = 'DEFENDANT'">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $partynumber]/name"/>
					</xsl:when>
					<xsl:when test="$vdJudgmentAgainstRoleCode = 'PT 20 CLMT'">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $partynumber]/name"/>
					</xsl:when>
					<xsl:when test="$vdJudgmentAgainstRoleCode = 'PT 20 DEF'">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $partynumber]/name"/>
					</xsl:when>
				</xsl:choose>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPartyForRoleCode">
		<xsl:value-of select="variabledata/warrant/partyforrolecode"/>
	</xsl:variable>
	<!-- UCT TD 610 : Translate vdPartyForRoleCode to a value so that we can match it with contents of <type> element for each party -->
	<xsl:variable name="vdPartyForRoleToElementName">
		<xsl:choose>
			<xsl:when test="$vdPartyForRoleCode = 'CLAIMANT'">claimant</xsl:when>
			<xsl:when test="$vdPartyForRoleCode = 'DEFENDANT'">defendant</xsl:when>
			<xsl:when test="$vdPartyForRoleCode = 'PT 20 CLMT'">part20claimant</xsl:when>
			<xsl:when test="$vdPartyForRoleCode = 'PT 20 DEF'">part20defendant</xsl:when>
			<xsl:when test="$vdPartyForRoleCode = 'DEBTOR'">debtor</xsl:when>
			<xsl:when test="$vdPartyForRoleCode = 'CREDITOR'">creditor</xsl:when>
			<xsl:when test="$vdPartyForRoleCode = 'APPLICANT'">applicant</xsl:when>
			<xsl:when test="$vdPartyForRoleCode = 'PETITIONER'">petitioner</xsl:when>
			<xsl:when test="$vdPartyForRoleCode = 'TRUSTEE'">trustee</xsl:when>
			<xsl:when test="$vdPartyForRoleCode = 'SOLICITOR'">representative</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdReferenceForFirstPartyAgainstRole">
		<xsl:choose>
			<!-- If the party is represented, then use solicitor's reference else use party's reference -->
			<xsl:when 
				test="string-length(/variabledata/claim/*[./type = $vdFirstPartyAgainstRoleToType and ./number=$vdFirstPartyAgainstNumber]/solicitorreference) > 0">
				<xsl:value-of 
					select="/variabledata/claim/*[./type = $vdFirstPartyAgainstRoleToType and ./number=$vdFirstPartyAgainstNumber]/solicitorreference"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of 
					select="/variabledata/claim/*[./type = $vdFirstPartyAgainstRoleToType and ./number=$vdFirstPartyAgainstNumber]/reference"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFirstPartyAgainstRoleToType">
		<xsl:choose>
			<xsl:when test="$vdFirstPartyAgainstType = 'CLAIMANT'">claimant</xsl:when>
			<xsl:when test="$vdFirstPartyAgainstType = 'DEFENDANT'">defendant</xsl:when>
			<xsl:when test="$vdFirstPartyAgainstType = 'PT 20 CLMT'">part20claimant</xsl:when>
			<xsl:when test="$vdFirstPartyAgainstType = 'PT 20 DEF'">part20defendant</xsl:when>
			<xsl:when test="$vdFirstPartyAgainstType = 'DEBTOR'">debtor</xsl:when>
			<xsl:when test="$vdFirstPartyAgainstType = 'CREDITOR'">creditor</xsl:when>
			<xsl:when test="$vdFirstPartyAgainstType = 'APPLICANT'">applicant</xsl:when>
			<xsl:when test="$vdFirstPartyAgainstType = 'PETITIONER'">petitioner</xsl:when>
			<xsl:when test="$vdFirstPartyAgainstType = 'TRUSTEE'">trustee</xsl:when>
			<xsl:when test="$vdFirstPartyAgainstType = 'SOLICITOR'">representative</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFirstPartyAgainstType">
		<xsl:value-of 
			select="/variabledata/warrant/warrantparties/warrantpartyagainst1/type"/>
	</xsl:variable>
	<xsl:variable name="vdFirstPartyAgainstName">
		<xsl:value-of 
			select="/variabledata/warrant/warrantparties/warrantpartyagainst1/name"/>
	</xsl:variable>
	<xsl:variable name="vdFirstPartyAgainstNumber">
		<xsl:value-of 
			select="/variabledata/warrant/warrantparties/warrantpartyagainst1/number"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentPartyType">
		<xsl:value-of select="variabledata/order/judgmentpartytype"/>
	</xsl:variable>
	<xsl:variable name="vdPartyForName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/warrant/partyforname"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPartyForReference">
		<xsl:value-of select="variabledata/warrant/partyforreference"/>
	</xsl:variable>
	<xsl:variable name="vdPartyAgainstName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:copy-of select="variabledata/warrant/partyagainstname"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPartyAgainstReference">
		<!-- Party Against has reference only in case of Home Warrants -->
		<xsl:if test="string-length(/variabledata/warrant/localnumber) = 0">
			<xsl:choose>
				<!-- If the party is represented, then use solicitor's reference else use party's reference -->
				<xsl:when 
					test="string-length(variabledata/claim/*[./type = $vdSubjectType and ./number=$vdSubjectNumber]/solicitorreference) > 0">
					<xsl:value-of 
						select="variabledata/claim/*[./type = $vdSubjectType and ./number=$vdSubjectNumber]/solicitorreference"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of 
						select="variabledata/claim/*[./type = $vdSubjectType and ./number=$vdSubjectNumber]/reference"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdApplicationInstigator">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/order/applicationinstigatorOther) > 0">
				<xsl:copy-of 
					select="variabledata/order/applicationinstigatorOther"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdInstigatorPartyRole"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDocumentServiceOther">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/order/documentserviceother"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDocumentService">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/order/documentserviceother) > 0">
				<xsl:copy-of select="$vdDocumentServiceOther"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="variabledata/order/documentservice = 'CF'">
						claim form</xsl:when>
					<xsl:when 
						test="variabledata/order/documentservice = 'CFPC'">
						claim form and particulars of claim</xsl:when>
					<xsl:when test="variabledata/order/documentservice = 'PC'">
						particulars of claim</xsl:when>
					<xsl:otherwise/>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPartyServiceOther">
		<xsl:value-of select="variabledata/order/partyserviceother"/>
	</xsl:variable>
	<xsl:variable name="vdPartyService">
		<xsl:choose>
			<xsl:when test="string-length($vdPartyServiceOther) > 0">
				<xsl:value-of select="$vdPartyServiceOther"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:variable name="partyId">
					<xsl:value-of select="variabledata/order/partyservice"/>
				</xsl:variable>
				<xsl:variable name="vdPartyServiceRole">
					<xsl:value-of 
						select="name(variabledata/claim/child::*[id = $partyId])"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="$vdPartyServiceRole = 'claimant'">Claimant</xsl:when>
					<xsl:when test="$vdPartyServiceRole = 'defendant'">Defendant</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPartyServiceName">
		<xsl:variable name="partyId">
			<xsl:value-of select="variabledata/order/partyservice"/>
		</xsl:variable>
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/child::*[id = $partyId]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdEventId">
		<xsl:value-of select="variabledata/event/id"/>
	</xsl:variable>
	<xsl:variable name="vdClaimCounterClaim">
		<xsl:choose>
			<xsl:when test="variabledata/judgment/claimcounterclaim = 'CLM'">
				<xsl:text>claim</xsl:text>
			</xsl:when>
			<xsl:when test="variabledata/judgment/claimcounterclaim = 'CTR'">
				<xsl:text>counterclaim</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!--  Release 2 Variables END -->
	<!--  Release 3 Variables BEGIN -->
	<!-- CJR009 BEGIN-->
	<xsl:variable name="vdDateServed">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/certificateofservice/dateserved"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDocumentServed">
		<xsl:choose>
			<xsl:when 
				test="variabledata/certificateofservice/documentserved = 'APP'">
				 Application </xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/documentserved = 'CLM'">
				 Claim Form </xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/documentserved = 'JDG'">
				 Judgment </xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/documentserved = 'ORD'">
				 Order </xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/documentserved = 'OTH'">
				<xsl:call-template name="formatTextAreaText">
					<xsl:with-param name="text">
						<xsl:copy-of 
							select="variabledata/certificateofservice/otherdocument"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/documentserved = 'PART'">
				 Particulars of claim </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdServedPerson">
		<xsl:value-of select="variabledata/certificateofservice/servedperson"/>
	</xsl:variable>
	<xsl:variable name="vdPosition">
		<xsl:if 
			test="string-length(variabledata/certificateofservice/position)>0"> 
			(<xsl:value-of 
			select="variabledata/certificateofservice/position"/>) </xsl:if>
		<xsl:if 
			test="string-length(variabledata/certificateofservice/position) = 0"/>
	</xsl:variable>
	<xsl:variable name="vdServiceMethod">
		<xsl:choose>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'DELIV'">
				by delivering to or leaving it at</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'EMAIL'">
				by email</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'EXCH'">
				by document exchange</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'FAX'">
				by fax machine</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'HAND'">
				by handing it to or leaving it with</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'POST'">
				by first class post at</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'OTH'">
				<xsl:value-of 
					select="variabledata/certificateofservice/serviceother"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdServiceMethodDetails">
		<xsl:choose>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'HAND'">
				<xsl:value-of 
					select="variabledata/certificateofservice/serviceleftwithname"/>
			</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'FAX'">
				sent at <xsl:value-of 
				select="variabledata/certificateofservice/servicetimesent"/> 
				</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'EMAIL'">
				sent at <xsl:value-of 
				select="variabledata/certificateofservice/servicetimesent"/> 
				</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdServiceAddress2">
		<xsl:choose>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'EMAIL'">
				at <xsl:value-of 
				select="variabledata/certificateofservice/addressemail"/></xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'FAX'">
				at <xsl:value-of 
				select="variabledata/certificateofservice/addressfax"/></xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod = 'EXCH'">
				at <xsl:value-of 
				select="variabledata/certificateofservice/addressdx"/></xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/servicemethod != 'HAND'">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="xalan:nodeset(variabledata/certificateofservice)/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdAddressType">
		<xsl:choose>
			<xsl:when 
				test="variabledata/certificateofservice/addresstype = 'BUS'">
				place of business</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/addresstype = 'REG'">
				registered office</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/addresstype = 'RES'">
				residence</xsl:when>
			<xsl:when 
				test="variabledata/certificateofservice/addresstype = 'OTH'">
				<xsl:value-of 
					select="variabledata/certificateofservice/otheraddresstype"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR009 END-->
	<!-- CJR028 BEGIN-->
	<xsl:variable name="vdTrialNoticeRespect">
		<xsl:choose>
			<xsl:when test="variabledata/notice/trialrespect = 'CLM'">
				<xsl:text>claim</xsl:text>
			</xsl:when>
			<xsl:when test="variabledata/notice/trialrespect = 'CTR'">
				<xsl:text>counterclaim</xsl:text>
			</xsl:when>
			<xsl:when test="variabledata/notice/trialrespect = 'BTH'">
				<xsl:text>claim and counterclaim</xsl:text>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdTimeAllowed">
		<xsl:if 
			test="string-length(variabledata/claim/hearing/timeallowed) > 0">
			<xsl:variable name="timeallowed">
				<xsl:call-template name="minutehourday">
					<xsl:with-param name="units">
						<xsl:value-of 
							select="variabledata/claim/hearing/timeallowedunits"/>
					</xsl:with-param>
					<xsl:with-param name="quantity">
						<xsl:value-of 
							select="variabledata/claim/hearing/timeallowed"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:variable>
			<xsl:value-of select="normalize-space($timeallowed)"/>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdCrossExaminationTime">
		<xsl:choose>
			<xsl:when test="variabledata/claim/hearing/timetable = 'STA'">The 
				evidence in chief for each party will be contained in witness 
				statements and reports, the time allowed for cross-examination 
				by the defendant is limited to <xsl:call-template 
				name="minutehourday"> <xsl:with-param name="units"> 
				<xsl:value-of 
				select="variabledata/claim/hearing/defcrossexaminationtimeunits"/> 
				</xsl:with-param> <xsl:with-param name="quantity"> 
				<xsl:value-of 
				select="variabledata/claim/hearing/defcrossexaminationtime"/> 
				</xsl:with-param> </xsl:call-template> and the time allowed for 
				cross-examination by the claimant is limited to 
				<xsl:call-template name="minutehourday"> <xsl:with-param 
				name="units"> <xsl:value-of 
				select="variabledata/claim/hearing/clmcrossexaminationtimeunits"/> 
				</xsl:with-param> <xsl:with-param name="quantity"> 
				<xsl:value-of 
				select="variabledata/claim/hearing/clmcrossexaminationtime"/> 
				</xsl:with-param> </xsl:call-template>. </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdClaimantTime">
		<xsl:if test="string-length(variabledata/order/clmevidencetime) > 0"> 
			<xsl:variable name="claimtime"> <xsl:call-template 
			name="minutehourday"> <xsl:with-param name="units" 
			select="variabledata/order/clmevidencetimeunits"/> <xsl:with-param 
			name="quantity" select="variabledata/order/clmevidencetime"/> 
			</xsl:call-template> </xsl:variable> <xsl:value-of 
			select="normalize-space($claimtime)"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdDefendantTime">
		<xsl:if test="string-length(variabledata/order/defevidencetime) > 0"> 
			<xsl:variable name="deftime"> <xsl:call-template 
			name="minutehourday"> <xsl:with-param name="units"> <xsl:value-of 
			select="variabledata/order/defevidencetimeunits"/> 
			</xsl:with-param> <xsl:with-param name="quantity"> <xsl:value-of 
			select="variabledata/order/defevidencetime"/> </xsl:with-param> 
			</xsl:call-template> </xsl:variable> <xsl:value-of 
			select="normalize-space($deftime)"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSubmissionTime">
		<xsl:if test="string-length(variabledata/order/submissiontime) > 0"> 
			<xsl:variable name="submission"> <xsl:call-template 
			name="minutehourday"> <xsl:with-param name="units"> <xsl:value-of 
			select="variabledata/order/submissiontimeunits"/> </xsl:with-param> 
			<xsl:with-param name="quantity"> <xsl:value-of 
			select="variabledata/order/submissiontime"/> </xsl:with-param> 
			</xsl:call-template> </xsl:variable> <xsl:value-of 
			select="normalize-space($submission)"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdRemainingTime">
		<xsl:variable name="remain">
			<xsl:call-template name="minutehourday">
				<xsl:with-param name="units">
					<xsl:value-of 
						select="variabledata/order/remainingtimeunits"/>
				</xsl:with-param>
				<xsl:with-param name="quantity">
					<xsl:value-of select="variabledata/order/remainingtime"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:value-of select="normalize-space($remain)"/>
	</xsl:variable>
	<xsl:variable name="vdCaseSummary">
		<xsl:value-of select="variabledata/order/casesummary"/>
	</xsl:variable>
	<xsl:variable name="vdAgreeBundle">
		<xsl:value-of select="variabledata/order/agreebundle"/>
	</xsl:variable>
	<xsl:variable name="vdClmShallLodge">
		<xsl:value-of select="variabledata/claim/hearing/clmshalllodge"/>
	</xsl:variable>
	<xsl:variable name="vdInformCourt">
		<xsl:value-of select="variabledata/claim/hearing/informcourt"/>
	</xsl:variable>
	<xsl:variable name="vdTimetable">
		<xsl:value-of select="variabledata/claim/hearing/timetable"/>
	</xsl:variable>
	<xsl:variable name="vdTrialNoticeHearingType">
		<xsl:value-of select="variabledata/claim/hearing/type"/>
	</xsl:variable>
	<xsl:variable name="vdListType">
		<xsl:value-of select="variabledata/claim/hearing/type"/>
	</xsl:variable>
	<xsl:variable name="vdFastTrack">
		<xsl:value-of select="variabledata/claim/hearing/fasttrackdirections"/>
	</xsl:variable>
	<!-- CJR028 END-->
	<!-- CJR030 BEGIN-->
	<xsl:variable name="vdWitnessName">
		<xsl:value-of select="variabledata/witness/name"/>
	</xsl:variable>
	<xsl:variable name="vdWitnessAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of select="variabledata/witness/*"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHearingWording">
		<xsl:if test="variabledata/witness/hearingwording = 'MOD'">and each 
			following day of the hearing until the court tells you that you are 
			no longer required.</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdDocumentExists">
		<xsl:value-of select="variabledata/witness/documentexists"/>
	</xsl:variable>
	<xsl:variable name="vdDocumentToProduce">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/witness/documenttoproduce"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdExpenseAmount">
		<xsl:value-of select="variabledata/witness/expenseamount"/>
	</xsl:variable>
	<xsl:variable name="vdPartyType">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/claim/claimant[id = /variabledata/witness/party]/id) > 0">
				 claimant </xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/defendant[id = /variabledata/witness/party]/id) > 0">
				 defendant </xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/part20claimant[id = /variabledata/witness/party]/id) > 0">
				 part20 claimant </xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/part20defendant[id = /variabledata/witness/party]/id) > 0">
				 part20 defendant </xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/representative[id = /variabledata/witness/party]/id) > 0">
				 solicitor </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPartyName">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/claim/claimant[id = /variabledata/witness/party]/id) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/claimant[id = /variabledata/witness/party]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/defendant[id = /variabledata/witness/party]/id) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/defendant[id = /variabledata/witness/party]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/part20claimant[id = /variabledata/witness/party]/id) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[id = /variabledata/witness/party]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/part20defendant[id = /variabledata/witness/party]/id) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[id = /variabledata/witness/party]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/representative[id = /variabledata/witness/party]/id) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/representative[id = /variabledata/witness/party]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPartyAddress">
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/claim/claimant[id = /variabledata/witness/party]/id) > 0">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/claimant[id = /variabledata/witness/party]/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/defendant[id = /variabledata/witness/party]/id) > 0">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/defendant[id = /variabledata/witness/party]/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/part20claimant[id = /variabledata/witness/party]/id) > 0">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/part20claimant[id = /variabledata/witness/party]/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/part20defendant[id = /variabledata/witness/party]/id) > 0">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/part20defendant[id = /variabledata/witness/party]/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when 
				test="string-length(/variabledata/claim/representative[id = /variabledata/witness/party]/id) > 0">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/representative[id = /variabledata/witness/party]/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPartyReference">
		<xsl:if 
			test="string-length(/variabledata/claim/claimant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]) > 0">
			<xsl:value-of 
				select="variabledata/claim/claimant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]/solicitorreference"/>
		</xsl:if>
		<xsl:if 
			test="string-length(/variabledata/claim/claimant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]) = 0">
			<xsl:value-of 
				select="variabledata/claim/claimant[id = /variabledata/witness/party]/reference"/>
		</xsl:if>
		<xsl:if 
			test="string-length(/variabledata/claim/defendant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]) > 0">
			<xsl:value-of 
				select="variabledata/claim/defendant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]/solicitorreference"/>
		</xsl:if>
		<xsl:if 
			test="string-length(/variabledata/claim/defendant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]) = 0">
			<xsl:value-of 
				select="variabledata/claim/defendant[id = /variabledata/witness/party]/reference"/>
		</xsl:if>
		<xsl:if 
			test="string-length(/variabledata/claim/part20claimant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]) > 0">
			<xsl:value-of 
				select="variabledata/claim/part20claimant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]/solicitorreference"/>
		</xsl:if>
		<xsl:if 
			test="string-length(/variabledata/claim/part20claimant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]) = 0">
			<xsl:value-of 
				select="variabledata/claim/part20claimant[id = /variabledata/witness/party]/reference"/>
		</xsl:if>
		<xsl:if 
			test="string-length(/variabledata/claim/part20defendant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]) > 0">
			<xsl:value-of 
				select="variabledata/claim/part20defendant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]/solicitorreference"/>
		</xsl:if>
		<xsl:if 
			test="string-length(/variabledata/claim/part20defendant[ representativeid = /variabledata/claim/representative[id = /variabledata/witness/party]/surrogateid]) = 0">
			<xsl:value-of 
				select="variabledata/claim/part20defendant[id = /variabledata/witness/party]/reference"/>
		</xsl:if>
	</xsl:variable>
	<!-- CJR030 END-->
	<!-- CJR031 BEGIN-->
	<xsl:variable name="vdFiledNoticeTitle">
		<xsl:choose>
			<xsl:when test="variabledata/notice/filedcounterclaim = 'D'">
				Defence</xsl:when>
			<xsl:when test="variabledata/notice/filedcounterclaim = 'DCC'">
				Defence and Counterclaim</xsl:when>
			<xsl:when test="variabledata/notice/filedcounterclaim = 'CC'">
				Counterclaim</xsl:when>
			<xsl:when test="variabledata/notice/filedcounterclaim = 'CD'">
				Defence</xsl:when>
			<xsl:when test="variabledata/notice/filedcounterclaim = 'CDS'">
				Defence</xsl:when>
			<xsl:when test="variabledata/notice/filedcounterclaim = 'CDF'">
				<xsl:value-of select="$vdEnclosed"/>
			</xsl:when>
			<xsl:when test="variabledata/notice/filedcounterclaim = 'CDSF'">
				<xsl:value-of select="$vdEnclosed"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdEnclosed">
		<xsl:choose>
			<xsl:when test="variabledata/notice/enclosed = 'D'">
				Defence</xsl:when>
			<xsl:when test="variabledata/notice/enclosed = 'C'">
				Counterclaim</xsl:when>
			<xsl:when test="variabledata/notice/enclosed = 'DC'">Defence and 
				Counterclaim</xsl:when>
		</xsl:choose>
	</xsl:variable>

	<xsl:variable name="vdFiledCounterclaim">
		<xsl:value-of select="variabledata/notice/filedcounterclaim"/>
	</xsl:variable>
	<xsl:variable name="vdDefTotal">
		<xsl:value-of select="variabledata/notice/deftotal"/>
	</xsl:variable>
	
	<xsl:template name="tmpAddresseesFiledCounterclaimText">
		<xsl:param name="addressee"/>
		<xsl:variable name="addresseeType" select="xalan:nodeset($addressee)/type"/>
		<xsl:choose>
			<xsl:when test="$vdFiledCounterclaim = 'D' or $vdFiledCounterclaim = 'DCC' or $vdFiledCounterclaim = 'CC'">
				<xsl:choose>
					<xsl:when test="$vdCourtCode = '335'">
						<xsl:choose>
							<xsl:when test="$addresseeType = 'defendant'">
								 An allocation questionnaire is enclosed which 
								contains notes for guidance on how to complete it.
							</xsl:when>
							<xsl:otherwise>
								 The defendant has filed a <xsl:call-template 
								name="convertcase"> <xsl:with-param name="toconvert"> 
								<xsl:value-of select="$vdFiledNoticeTitle"/> </xsl:with-param> 
								<xsl:with-param name="conversion">lower</xsl:with-param> 
								</xsl:call-template>, a copy of which is enclosed with this 
								notice.
							</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise>
						 The defendant has filed a <xsl:call-template 
						name="convertcase"> <xsl:with-param name="toconvert"> 
						<xsl:value-of select="$vdFiledNoticeTitle"/> </xsl:with-param> 
						<xsl:with-param name="conversion">lower</xsl:with-param> 
						</xsl:call-template>, a copy of which is enclosed with this 
						notice. An allocation questionnaire is also enclosed which 
						contains notes for guidance on how to complete it. 
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise> 
				<xsl:choose>
					<xsl:when test="$addresseeType = 'defendant'"></xsl:when>
					<xsl:otherwise>
						 You have already been sent <xsl:if 
						test="$vdFiledCounterclaim = 'CD' or $vdFiledCounterclaim = 'CDF'">a 
						copy of a defence</xsl:if> <xsl:if 
						test="$vdFiledCounterclaim = 'CDS' or $vdFiledCounterclaim = 'CDSF'">copies 
						of defences</xsl:if> received from <xsl:if 
						test="$vdFiledCounterclaim = 'CDS' or $vdFiledCounterclaim = 'CDSF'"> 
						<xsl:value-of select="$vdDefTotal"/> 
						of</xsl:if> the defendants in this claim.
					</xsl:otherwise>
				</xsl:choose>
				 The time for all the 
				defendants to file their defences has now elapsed and I am 
				enclosing an allocation questionnaire for you to complete. 
				<xsl:if 
				test="$vdFiledCounterclaim = 'CD' or $vdFiledCounterclaim = 'CDS'">No 
				further defences have been received.</xsl:if> <xsl:if 
				test="$vdFiledCounterclaim = 'CDF'">A copy of 
				the final <xsl:call-template name="convertcase"> 
				<xsl:with-param name="toconvert"> <xsl:value-of 
				select="$vdEnclosed"/> </xsl:with-param> <xsl:with-param 
				name="conversion">lower</xsl:with-param> </xsl:call-template> 
				received is also enclosed.</xsl:if> </xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:variable name="vdQReturnDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/qreturndate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAQFee">
		<xsl:value-of select="variabledata/notice/qafee"/>
	</xsl:variable>

	<xsl:template name="tmpFiledNoticeWordingText">
		<xsl:param name="addressee"/>
		<xsl:variable name="addresseeType" select="xalan:nodeset($addressee)/type"/>
		<xsl:choose>
			<xsl:when test="$vdFiledCounterclaim = 'DCC'">
				<xsl:choose>
					<xsl:when test="$vdCourtCode = '335'">
						<xsl:choose>
							<xsl:when test="$addresseeType != 'defendant'">
								 If you intend to defend the counterclaim, you must file a copy of 
								your defence with your completed allocation questionnaire. Your 
								defence must contain a statement of truth. 
							</xsl:when>
						</xsl:choose>
					</xsl:when>
					<xsl:otherwise>
						 If you intend to defend the counterclaim, you must file a copy of 
						your defence with your completed allocation questionnaire. Your 
						defence must contain a statement of truth. 
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdFiledCounterclaim = 'CDF' or $vdFiledCounterclaim = 'CDSF' or $vdFiledCounterclaim = 'CC'">
				 If you intend to defend the counterclaim, you must file a copy of 
				your defence with your completed allocation questionnaire. Your 
				defence must contain a statement of truth. 
			</xsl:when>
		</xsl:choose>
	</xsl:template>
	<xsl:variable name="vdDirectionsText">
		<xsl:choose>
			<xsl:when test="$vdFiledCounterclaim = 'D'">
				The defendant has filed a defence, a copy of which is enclosed.
			</xsl:when>
			<xsl:when test="$vdFiledCounterclaim = 'DCC'">
				The defendant has filed a defence and a counterclaim, copies of which are enclosed.
			</xsl:when>
			<xsl:when test="$vdFiledCounterclaim = 'CC'">
				The defendant has filed a counterclaim, a copy of which is enclosed.
			</xsl:when>
			<xsl:when test="$vdFiledCounterclaim = 'CDS'">
				A copy of the defence has already been sent to you by the defendant.
			</xsl:when>
			<xsl:when test="$vdFiledCounterclaim = 'DNA'">
				The states paid defence was not accepted.
			</xsl:when>
			<xsl:when test="$vdFiledCounterclaim = 'PNA'">
				The part admission was not accepted.
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR031 END-->
	<!-- CJR018A BEGIN-->
	<xsl:variable name="vdNonSUPSCourt">
		<xsl:value-of select="variabledata/transfer/court/issups"/>
	</xsl:variable>
	<xsl:variable name="vdComplicatedNoTransfer">
		<xsl:choose>
			<xsl:when 
				test="starts-with($vdCaseType,'APP INT ORD (INSOLV)') or starts-with($vdCaseType,'CREDITORS PETITION') or starts-with($vdCaseType,'DEBTORS PETITION') or starts-with($vdCaseType,'APP ON DEBT PETITION') or starts-with($vdCaseType,'WINDING UP PETITION') or starts-with($vdCaseType,'APP TO SET STAT DEMD') or starts-with($vdCaseType,'COMPANY ADMIN ORDER')">true</xsl:when>
			<xsl:otherwise>false</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdComplicatedTransfer">
		<xsl:choose>
			<xsl:when 
				test="($vdNumberOfClaimants > 1) or ($vdNumberOfDefendants > 9) or ($vdNumberOfPart20defendant > 0) or ($vdNumberOfPart20claimant > 0)">true</xsl:when>
			<xsl:otherwise>false</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdIsManualTransfer">
		<xsl:value-of select="variabledata/transfer/ismanualtransfer"/>
	</xsl:variable>
	<xsl:variable name="vdTransferCourtDivision">
		<xsl:choose>
			<xsl:when test="variabledata/transfer/court/division = 'Q'"> High 
				Court of Justice, Queen's Bench Division </xsl:when>
			<xsl:when test="variabledata/transfer/court/division = 'C'"> High 
				Court of Justice, Chancery Division </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdTransferCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/transfer/court/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTransferedCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/court/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTransferCourtType">
		<xsl:choose>
			<xsl:when test="string-length($vdTransferCourtDivision) > 0">
				District Registry</xsl:when>
			<xsl:when test="variabledata/transfer/court/division = 'F'">Family Court</xsl:when>
			<xsl:otherwise>County Court</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdTransferCourtAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="xalan:nodeset(variabledata/transfer/court/address)"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTransferCourtAddressMultiLine">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of 
					select="xalan:nodeset(variabledata/transfer/court/address)"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTransferCourtTelephoneNumber">
		<xsl:choose>
			<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
				<xsl:value-of select="variabledata/transfer/court/drtelnumber"/>
			</xsl:when>
			<xsl:otherwise><xsl:value-of select="variabledata/transfer/court/telephonenumber"/></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR018A END-->
	<!-- CJR018B BEGIN-->
	<xsl:variable name="vdTransferDealHearing">
		<xsl:choose>
			<xsl:when test="variabledata/transfer/dealhearing = 'DC'">deal with 
				the claimant's application</xsl:when>
			<xsl:when test="variabledata/transfer/dealhearing = 'DD'">deal with 
				the defendant's application</xsl:when>
			<xsl:when test="variabledata/transfer/dealhearing = 'HC'">hear the 
				claimant's application</xsl:when>
			<xsl:when test="variabledata/transfer/dealhearing = 'HD'">hear the 
				defendant's application</xsl:when>
			<xsl:when test="variabledata/transfer/dealhearing = 'OTH'">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/transfer/dealhearingother"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">lower</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdTransferApplicationFor"> for <xsl:call-template 
		name="formatTextAreaText"> <xsl:with-param name="text"> <xsl:copy-of 
		select="variabledata/transfer/applicationfor"/> </xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<xsl:variable name="vdTransferDistrictRegistry">
		<xsl:choose>
			<xsl:when test="$vdTransferCourtType = 'County Court'">
				court</xsl:when>
			<xsl:otherwise>district registry</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdTransferReturnHomeCourt">
		<xsl:choose>
			<xsl:when test="variabledata/transfer/returnhomecourt= 'Y'">After 
				the hearing the file will be returned to this court.</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdTransferReturnHomeCourt2">
		<xsl:choose>
			<xsl:when test="variabledata/transfer/return= 'Y'"> After the 
				trial, the claim will be transferred back to this court. You 
				will be told when this happens. </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR018B END-->
	<!-- CJR018C BEGIN-->
	<xsl:variable name="vdTransferTo">
		<xsl:choose>
			<xsl:when test="variabledata/transfer/to = 'CCTC'">Civil Trial 
				Centre at the County Court at <xsl:value-of select="$vdTransferCourtName"/></xsl:when>
			<xsl:when test="variabledata/transfer/to = 'RCJ'"> <xsl:value-of 
				select="variabledata/transfer/court/specialistrcj"/> list at 
				the <xsl:value-of 
				select="variabledata/transfer/court/divisionrcj"/> Division of 
				the Royal Courts of Justice </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdReferedTo">
		<xsl:choose>
			<xsl:when test="variabledata/transfer/to = 'CCTC'">a procedural 
				judge for case management directions</xsl:when>
			<xsl:otherwise> the judge in charge of the specialist list for the 
				judge to decide if it is a suitable case for that list and, if 
				so, for case management directions to be given </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdTransferSent">
		<xsl:choose>
			<xsl:when test="variabledata/transfer/to = 'CCTC'">a notice of 
				allocation</xsl:when>
			<xsl:otherwise> an order </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR018C END-->
	<!-- CJR018D BEGIN-->
	<xsl:variable name="vdTransferOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/transfer/orderdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTransferReturn">
		<xsl:choose>
			<xsl:when test="variabledata/transfer/return = 'Y'"> After the 
				trial, the claim will be transferred back to this court. You 
				will be told when this happens. </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCaseProceeding">
		<xsl:choose>
			<xsl:when test="variabledata/transfer/caseproceeding = 'CLM'">
				<xsl:text>claim</xsl:text>
			</xsl:when>
			<xsl:when test="variabledata/transfer/caseproceeding = 'CTR'">
				<xsl:text>counterclaim</xsl:text>
			</xsl:when>
			<xsl:when test="variabledata/transfer/caseproceeding = 'BTH'">
				<xsl:text>claim and counterclaim</xsl:text>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR018D END-->
	<!-- CJR018E BEGIN-->
	<xsl:variable name="vdTransferPartyApplication"> The <xsl:choose> <xsl:when 
		test="string-length(/variabledata/claim/claimant[id = /variabledata/transfer/partyapplication]/id) > 0"> 
		<xsl:value-of select="$vdTransferPartyApplicationNumber"/> claimant 
		</xsl:when> <xsl:when 
		test="string-length(/variabledata/claim/defendant[id = /variabledata/transfer/partyapplication]/id) > 0"> 
		<xsl:value-of select="$vdTransferPartyApplicationNumber"/> defendant 
		</xsl:when> <xsl:when 
		test="string-length(/variabledata/claim/part20claimant[id = /variabledata/transfer/partyapplication]/id) > 0"> 
		<xsl:value-of select="$vdTransferPartyApplicationNumber"/> Part20 
		claimant </xsl:when> <xsl:when 
		test="string-length(/variabledata/claim/part20defendant[id = /variabledata/transfer/partyapplication]/id) > 0"> 
		<xsl:value-of select="$vdTransferPartyApplicationNumber"/> Part20 
		defendant </xsl:when> </xsl:choose> wishes to issue an application 
		<xsl:value-of select="$vdTransferApplicationFor"/> <xsl:choose> 
		<xsl:when test="variabledata/transfer/partyapplicationattached = 'Y'"> 
		a copy of which is attached </xsl:when> </xsl:choose> </xsl:variable>
	<xsl:variable name="vdTransferPartyApplicationNumber">
		<xsl:variable name="tmpPartyApplication">
			<xsl:value-of select="variabledata/transfer/partyapplication"/>
		</xsl:variable>
		<xsl:variable name="tmpPartyNumber">
			<xsl:value-of 
				select="variabledata/claim/*[id = $tmpPartyApplication]/number"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$tmpPartyNumber = '1'">1st</xsl:when>
			<xsl:when test="$tmpPartyNumber = '2'">2nd</xsl:when>
			<xsl:when test="$tmpPartyNumber = '3'">3rd</xsl:when>
			<xsl:otherwise><xsl:value-of 
				select="$tmpPartyNumber"/>th</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR018E END-->
	<!-- CJR018F BEGIN-->
	<xsl:variable name="vdAllocationTo">
		<xsl:choose>
			<xsl:when test="variabledata/transfer/allocationto = 'CLM'">
				<xsl:text>claim</xsl:text>
			</xsl:when>
			<xsl:when test="variabledata/transfer/allocationto = 'CTR'">
				<xsl:text>counterclaim</xsl:text>
			</xsl:when>
			<xsl:when test="variabledata/transfer/allocationto = 'BTH'">
				<xsl:text>claim and counterclaim</xsl:text>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR018F END-->
	<!-- CJR018G BEGIN-->
	<!-- CJR018G END-->
	<!-- CJR018H BEGIN-->
	<!-- CJR018H END-->
	<!-- CJR018I BEGIN-->
	<!-- CJR018I END-->
	<!-- CJR018J BEGIN-->
	<!-- CJR018J END-->
	<!-- CJR018K BEGIN-->
	<!-- CJR018K END-->
	<!-- CJR065B BEGIN-->
	<xsl:variable name="vdApplicationOutcome">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/hearing/applicationoutcome= 'ADJ'">ADJOURNED</xsl:when>
			<xsl:when 
				test="variabledata/claim/hearing/applicationoutcome= 'REF'">REFUSED</xsl:when>
			<xsl:when 
				test="variabledata/claim/hearing/applicationoutcome= 'SUC'">SUCCESSFUL</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR065B END-->
	<!-- CJR020 BEGIN-->
	<xsl:variable name="vdFastTrackDirectionsB1">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/hearing/fasttrack/jdgtrfaftalloc = 'Y'">
				 The judge has ordered that this claim be transferred to the 
				County Court at 
				<xsl:call-template name="convertcase"> <xsl:with-param 
				name="toconvert"> <xsl:value-of 
				select="variabledata/transfer/court/cname"/> </xsl:with-param> 
				<xsl:with-param name="conversion">proper</xsl:with-param> 
				</xsl:call-template> where <xsl:choose> <xsl:when 
				test="variabledata/claim/hearing/fasttrack/furtherdirections = 'N'">you 
				should forward all future correspondence.</xsl:when> 
				<xsl:otherwise>the procedural judge will give any necessary 
				directions.</xsl:otherwise> </xsl:choose> The address of that 
				court is </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsB2">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="xalan:nodeset(variabledata/transfer/court/caddress/address)"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsC1">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/hearing/fasttrack/transferdateflag = 'TBF'">
				 The trial of this <xsl:value-of select="$vdAllocation"/> will 
				take place during the period commencing <xsl:call-template 
				name="format-date-placeholder"> <xsl:with-param 
				name="date-xpath"> <xsl:value-of 
				select="variabledata/claim/hearing/fasttrack/wftstartdate/StartDate"/> 
				</xsl:with-param> </xsl:call-template> and ending on 
				<xsl:call-template name="format-date-placeholder"> 
				<xsl:with-param name="date-xpath"> <xsl:value-of 
				select="variabledata/claim/hearing/fasttrack/wftenddate/EndDate"/> 
				</xsl:with-param> </xsl:call-template> </xsl:when>
			<xsl:when 
				test="variabledata/claim/hearing/fasttrack/transferdateflag = 'FIX'">
				 The trial of this <xsl:value-of select="$vdAllocation"/> will 
				take place on <xsl:call-template 
				name="format-date-placeholder"> <xsl:with-param 
				name="date-xpath"> <xsl:value-of 
				select="variabledata/claim/hearing/fasttrack/fthrgdate"/> 
				</xsl:with-param> </xsl:call-template> at <xsl:value-of 
				select="variabledata/claim/hearing/fasttrack/fthrgtime"/> at 
				the County Court at 
				<xsl:call-template name="convertcase"> <xsl:with-param 
				name="toconvert"> <xsl:value-of 
				select="variabledata/claim/hearing/court/name"/> 
				</xsl:with-param> <xsl:with-param 
				name="conversion">proper</xsl:with-param> </xsl:call-template>, 
				<xsl:call-template 
				name="format-address-single-line"> <xsl:with-param 
				name="theAddress"> <xsl:copy-of 
				select="variabledata/claim/hearing/court/address"/>. 
				</xsl:with-param> </xsl:call-template> (Time Estimate: 
				<xsl:value-of select="$vdTimeAllowed"/>) </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsD1">The judge orders that you and 
		the other parties prepare for trial as follows:</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsE1">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/statementofcaserequired = 'Y'">
			 The <xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/ptytofiledocs = 'CLM'">Claimant</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/ptytofiledocs = 'DEF'">Defendant</xsl:when> 
			<xsl:otherwise> <xsl:copy-of 
			select="variabledata/claim/hearing/fasttrack/ptytofiledocsother"/> 
			</xsl:otherwise> </xsl:choose> must file a <xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/docstobefiled = 'D'">Defence</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/docstobefiled = 'DCC'">Defence 
			to counterclaim</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/docstobefiled = 'CC'">Counterclaim</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/docstobefiled = 'AD'">Amended 
			defence</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/docstobefiled = 'ACC'">Amended 
			counterclaim</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/docstobefiled = 'ADCC'">Amended 
			defence to counterclaim</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/docstobefiled = 'RD'">Reply 
			to defence</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/docstobefiled = 'RDCC'">Reply 
			to defence to counterclaim</xsl:when> <xsl:otherwise> <xsl:copy-of 
			select="variabledata/claim/hearing/fasttrack/docstobefiledother"/> 
			</xsl:otherwise> </xsl:choose> and serve a copy on the <xsl:choose> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/ptyservedon = 'CLM'">Claimant</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/ptyservedon = 'DEF'">Defendant</xsl:when> 
			<xsl:otherwise> <xsl:copy-of 
			select="variabledata/claim/hearing/fasttrack/ptyservedonother"/> 
			</xsl:otherwise> </xsl:choose> no later than <xsl:call-template 
			name="format-date-placeholder"> <xsl:with-param name="date-xpath"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/docsserveddate"/>. 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsF1">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/hearing/fasttrack/furtherinfoordered = 'Y'">
				 Any request for clarification or further information based on 
				another party's statement of case shall be served no later than 
				<xsl:variable name="furtherinfofiledate"> <xsl:call-template 
				name="format-date-placeholder"> <xsl:with-param 
				name="date-xpath"> <xsl:value-of 
				select="variabledata/claim/hearing/fasttrack/furtherinfofiledate"/> 
				</xsl:with-param> </xsl:call-template> </xsl:variable> 
				<xsl:value-of select="normalize-space($furtherinfofiledate)"/>. 
				<xsl:if 
				test="variabledata/claim/hearing/fasttrack/furtherinfodeal = 'Y'"> 
				Any such request shall be dealt with no later than 
				<xsl:variable name="furtherinfodealdate"> <xsl:call-template 
				name="format-date-placeholder"> <xsl:with-param 
				name="date-xpath"> <xsl:value-of 
				select="variabledata/claim/hearing/fasttrack/furtherinfodealdate"/> 
				</xsl:with-param> </xsl:call-template> </xsl:variable> 
				<xsl:value-of select="normalize-space($furtherinfodealdate)"/>. 
				</xsl:if> </xsl:when>
			<xsl:otherwise> No disclosure of documents is required. 
				</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsG2">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/disclosureordered = 'Y'">
			 <xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/disclosureto = 'ALL'">All 
			Parties</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/disclosureto = 'CLM'">The 
			Claimant</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/disclosureto = 'DEF'">The 
			Defendant</xsl:when> <xsl:otherwise> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/disclosuretoother"/> 
			</xsl:otherwise> </xsl:choose> shall give to <xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/disclosureservicedto = 'ALL'">All 
			Parties</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/disclosureservicedto = 'CLM'">The 
			Claimant</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/disclosureservicedto = 'DEF'">The 
			Defendant</xsl:when> <xsl:otherwise> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/disclosureservicedtoother"/> 
			</xsl:otherwise> </xsl:choose> standard disclosure of documents 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsG3">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/docsrefspeissue = 'Y'"> 
			relating to <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/docswhichissue"/> by 
			serving copies together with a disclosure statement no later than 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/doscdateservicecopy"/>. 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsG4">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/discoverylistordered = 'Y' or variabledata/claim/hearing/fasttrack/disclosureorderlimit = 'Y'">
			 Disclosure shall take place as follows: </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsG5">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/discoverylistordered = 'Y'">
			 Each party shall give standard discovery to every other party by 
			list. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsG6">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/disclosureorderlimit = 'Y'">
			 Disclosure is limited to <xsl:if 
			test="variabledata/claim/hearing/fasttrack/disclosurestandard = 'Y'"> 
			standard </xsl:if> disclosure <xsl:if 
			test="variabledata/claim/hearing/fasttrack/partydircomply = 'Y'"> 
			by the <xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/partydirtocomply = 'CLM'">Claimant</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/partydirtocomply = 'DEF'">Defendant</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/partydirtocomply = 'OTH'"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/partydortocomplyother"/> 
			</xsl:when> </xsl:choose> to <xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/partydirservedon = 'CLM'">the 
			Claimant</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/partydirservedon = 'DEF'">the 
			Defendant</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/partydirservedon = 'ALL'">All 
			Parties</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/partydirservedon = 'OTH'"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/partydirservedonother"/> 
			</xsl:when> </xsl:choose> </xsl:if> <xsl:if 
			test="variabledata/claim/hearing/fasttrack/docsrelatedtodamage = 'Y'"> 
			of documents relating to damage. </xsl:if> <xsl:if 
			test="variabledata/claim/hearing/fasttrack/docsspecified = 'Y'"> 
			the following documents: <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/docsdetails"/>. 
			</xsl:if> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsG9">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/listdeliverydate = 'Y'"> 
			The latest date for delivery of the lists is <xsl:call-template 
			name="format-date-placeholder"> <xsl:with-param name="date-xpath"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/latestdeliverydate"/>. 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsG10">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/directioninspectionrequired = 'Y'">
			 The latest date for service of any request to inspect or for a 
			copy of a document is <xsl:call-template 
			name="format-date-placeholder"> <xsl:with-param name="date-xpath"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/latestrequestdate"/>. 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsH1">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/witnessfactdirection = 'Y'">
			 Each party shall serve on every other party the witness statements 
			of all witnesses of fact on whom he intends to rely. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsH2">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/simulexchorder = 'Y'"> 
			There shall be simultaneous exchange of such statements no later 
			than <xsl:call-template name="format-date-placeholder"> 
			<xsl:with-param name="date-xpath"> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/exchangedate"/>. 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI1">
		<xsl:if test="variabledata/claim/hearing/fasttrack/expertrefused = 'Y'">
			 No expert evidence being necessary, no party has permission to 
			call or rely on expert evidence. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI2">
		<xsl:if test="variabledata/claim/hearing/fasttrack/notifycourt = 'Y'"> 
			On it appearing to the court that expert evidence is necessary on 
			the issue of <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/detailsofissue"/> and 
			that evidence should be given by the report of a single expert 
			instructed jointly by the parties, <xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/ptyinformcrt = 'CLM'">the 
			Claimant</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/ptyinformcrt = 'DEF'">the 
			Defendant</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/ptyinformcrt = 'OTH'"> 
			the <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/ptyinformcrtother"/> 
			</xsl:when> </xsl:choose> shall no later than <xsl:call-template 
			name="format-date-placeholder"> <xsl:with-param name="date-xpath"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/ptyinformcrtdate"/> 
			</xsl:with-param> </xsl:call-template> inform the court whether or 
			not such an expert has been instructed. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI3">
		<xsl:if 
			test="string-length(variabledata/claim/hearing/fasttrack/issuedetails) > 0">
			 The expert evidence on the issue of <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/issuedetails"/> shall 
			be limited to a single expert jointly instructed by the parties. 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI4">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/libertyappagreed = 'Y'"> 
			If the parties cannot agree by <xsl:call-template 
			name="format-date-placeholder"> <xsl:with-param name="date-xpath"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/libertyagreedate"/> 
			</xsl:with-param> </xsl:call-template> who that expert is to be and 
			about the payment of his fees, either party may apply for further 
			directions. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI5">
		<xsl:if test="variabledata/claim/hearing/fasttrack/orderpayexp = 'Y'"> 
			Unless the parties agree in writing or the court orders otherwise, 
			the fees and expenses of such an expert shall be paid to him by 
			<xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/orderpayexppty = 'CLM'">the 
			Claimant<xsl:if 
			test="variabledata/claim/hearing/fasttrack/orderpayexplimit = 'N'">.</xsl:if> 
			</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/orderpayexppty = 'DEF'">the 
			Defendant<xsl:if 
			test="variabledata/claim/hearing/fasttrack/orderpayexplimit = 'N'">.</xsl:if> 
			</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/orderpayexppty = 'OTH'"> 
			the <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/orderpayexpptyother"/> 
			<xsl:if 
			test="variabledata/claim/hearing/fasttrack/orderpayexplimit = 'N'">.</xsl:if> 
			</xsl:when> </xsl:choose> <xsl:if 
			test="variabledata/claim/hearing/fasttrack/orderpayexplimit = 'Y'"> 
			and shall be limited to &#163;<xsl:call-template 
			name="correctCalculation"> <xsl:with-param name="value"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/feeslimitamt"/> 
			</xsl:with-param> </xsl:call-template> </xsl:if>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI6">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/dateforfilingrep = 'Y'"> 
			The expert's report shall be filed at the court no later than 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/filereportdate"/>. 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI7">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/costrecoverylimit = 'Y'">
			 No party shall be entitled to recover by way of costs from any 
			other party more than &#163;<xsl:call-template 
			name="correctCalculation"> <xsl:with-param name="value"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/expertcostrecoveryamount"/> 
			</xsl:with-param> </xsl:call-template> for the fees or expenses of 
			an expert. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI8">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/exchangerepordered = 'Y'">
			 The parties shall exchange reports setting out the substance of 
			any expert evidence on which they intend to rely. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI9">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/exchangesimseq = 'SIM'"> 
			The exchange shall take place simultaneously no later than 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/exchangeservedate"/>. 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI10">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/exchangesimseq = 'SEQ'"> 
			The <xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/exchangeserveto = 'CLM'">Claimant</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/exchangeserveto = 'DEF'">Defendant</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/exchangeserveto = 'OTH'"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/exchangeserveother"/> 
			</xsl:when> </xsl:choose> shall serve his report(s) no later than 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/exchangeservedatefor"/> 
			</xsl:with-param> </xsl:call-template> and the <xsl:choose> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/exchangeservesecto = 'CLM'">Claimant</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/exchangeservesecto = 'DEF'">Defendant</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/exchangeservesecto = 'OTH'"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/exchangeservesecother"/> 
			</xsl:when> </xsl:choose> shall serve his report(s) no later than 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/exchangeservedatefor2"/>. 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI12">
		<xsl:if test="variabledata/claim/hearing/fasttrack/agreerep = 'Y'"> The 
			report shall be agreed if possible no later than <xsl:choose> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/agreerepdate = 'SD'"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/agreeafterservedays"/> 
			day(s) after service. </xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/agreerepdate = 'GD'"> 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/agreementdate"/>. 
			</xsl:with-param> </xsl:call-template> </xsl:when> </xsl:choose> 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI13">
		<xsl:if test="variabledata/claim/hearing/fasttrack/woprejmeeting = 'Y'">
			 If the reports are not agreed within that time, there shall be a 
			'without prejudice' discussion between the experts no later than 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/meetingdate"/> 
			</xsl:with-param> </xsl:call-template> to identify the issues 
			between them and to reach agreement if possible. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI14">
		<xsl:if test="variabledata/claim/hearing/fasttrack/orderissstat = 'Y'"> 
			The experts shall prepare for the court a statement of the issues 
			on which they agree and on which they disagree with a summary of 
			their reasons, and that statement shall be filed <xsl:variable 
			name="stmttobefiled"> <xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/stmttobefiled = 'LQ'">with 
			the court with the pre-trial checklists</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/stmttobefiled = 'NLQ'">no 
			later than the date for filing the pre-trial checklists</xsl:when> 
			<xsl:otherwise> with the court no later than <xsl:call-template 
			name="format-date-placeholder"> <xsl:with-param name="date-xpath"> 
			<xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/orderfiledate"/> 
			</xsl:with-param> </xsl:call-template> </xsl:otherwise> 
			</xsl:choose> </xsl:variable> <xsl:value-of 
			select="normalize-space($stmttobefiled)"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI15">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/expertwitpermitted = 'Y'">
			 Each party has permission to use <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/expertnames"/> as 
			expert witness(es) to give <xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/evdoralwritt = 'ORL'">oral 
			evidence</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/evdoralwritt = 'WRIT'">evidence 
			in the form of a report</xsl:when> </xsl:choose> at the trial in 
			the field of <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/evdsubmatt"/> provided 
			that the substance of the evidence to be given has been disclosed 
			as above and has not been agreed. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsI16">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/expertreppermitted = 'Y'">
			 Each party has permission to use in evidence <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/expertrepno"/> 
			experts' reports <xsl:if 
			test="variabledata/claim/hearing/fasttrack/oralevdonlist= 'Y'"> and 
			the court will consider when the claim is listed for trial whether 
			expert oral evidence will be allowed. </xsl:if> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsJ1">
		<xsl:if 
			test="variabledata/claim/hearing/fasttrack/direcexpertques = 'Y'"> 
			The time for service on another party of any question addressed to 
			an expert instructed by that party is not later than <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/nodaysforfiling"/> 
			day(s) after service of that expert's report. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsJ2">
		<xsl:if test="variabledata/claim/hearing/fasttrack/direconreply = 'Y'"> 
			Any such question shall be answered within <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/direcfilesnodays"/> 
			day(s) of service. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsK1">
		<xsl:if test="variabledata/claim/hearing/fasttrack/direcreqinfo = 'Y'"> 
			Each party shall serve any request for clarification or further 
			information based on any document disclosed or statement served by 
			another party no later than <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/noofdaysservreq"/> 
			day(s) after disclosure or service. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsK2">
		<xsl:if test="variabledata/claim/hearing/fasttrack/direcrespond = 'Y'"> 
			Any such request shall be dealt with within <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/noofdaysforreply"/> 
			day(s) of service. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsL1">
		<xsl:if test="variabledata/claim/hearing/fasttrack/lqfiledwith = 'Y'"> 
			The parties must file with their pre-trial checklists copies of 
			<xsl:choose> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/lqfiledwithwhat = 'E'">experts' 
			reports</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/lqfiledwithwhat = 'ER'">experts' 
			reports and replies to requests for further info</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/lqfiledwithwhat = 'EW'">experts' 
			reports and witness statements</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/lqfiledwithwhat = 'EWR'">experts' 
			reports, witness statements and replies to request</xsl:when> 
			<xsl:when 
			test="variabledata/claim/hearing/fasttrack/lqfiledwithwhat = 'R'">replies 
			to requests for further information</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/lqfiledwithwhat = 'W'">witness 
			statements</xsl:when> <xsl:when 
			test="variabledata/claim/hearing/fasttrack/lqfiledwithwhat = 'WR'">witness 
			statements and replies to requests for further 
			information</xsl:when> </xsl:choose>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsM1">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/hearing/fasttrack/lqdirecmade = 'Y'"> 
				Each party must file a completed pre-trial checklist no later 
				than <xsl:call-template name="format-date-placeholder"> 
				<xsl:with-param name="date-xpath"> <xsl:value-of 
				select="variabledata/claim/hearing/fasttrack/lqdirecfiledate"/> 
				</xsl:with-param></xsl:call-template> and <xsl:value-of 
				select="$vdHearingWhoIsToPayLQ"/> must pay a fee of &#163;<xsl:value-of 
				select="$vdLQFee"/>.
				<fo:block>
					In addition a hearing fee of &#163;<xsl:value-of select="$vdLQHearingFee"/> 
					must be paid by <xsl:value-of select="$vdHearingWhoIsToPay"/>.
				</fo:block>
				<fo:block>
					If the court is notified in 
					writing that the hearing is no longer needed the hearing fee 
					will be refunded in full or in part in certain circumstances, 
					please refer to the leaflets explaining more about what happens 
					when your case is allocated to track.
				</fo:block>
			</xsl:when>
			<xsl:otherwise> The judge considers that the claim can be listed 
				for trial without the need for a pre-trial checklist. 
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFastTrackDirectionsO1">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/hearing/fasttrack/judgemltpsng = 'S'"> 
				The reason the judge has given for allocation to track is that 
				<xsl:value-of select="$vdAllocationReason"/>. </xsl:when>
			<xsl:when 
				test="variabledata/claim/hearing/fasttrack/judgemltpsng = 'M'"> 
				The reasons the judge has given for allocation to track are 
				that <xsl:value-of select="$vdAllocationReason"/>. </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdLQFee">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/lqandhearing/lqfee"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHearingWhoIsToPayLQ">
		<xsl:variable name="partyId">
			<xsl:value-of select="variabledata/lqandhearing/whoistopaylq"/>
		</xsl:variable>
		<xsl:variable name="partyType">
			<xsl:value-of select="name(variabledata/claim/child::*[id = $partyId])"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$partyType = 'claimant'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/claimant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Claimant
					</xsl:when>
					<xsl:otherwise>the claimant</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'defendant'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/defendant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Defendant
					</xsl:when>
					<xsl:otherwise>the defendant</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'part20claimant'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/part20claimant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Part 20 Claimant
					</xsl:when>
					<xsl:otherwise>the part 20 claimant</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'part20defendant'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/part20defendant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Part 20 Defendant
					</xsl:when>
					<xsl:otherwise>the part 20 defendant</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'debtor'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/debtor) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Debtor
					</xsl:when>
					<xsl:otherwise>the debtor</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'creditor'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/creditor) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Creditor
					</xsl:when>
					<xsl:otherwise>the creditor</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'company'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/company) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Company
					</xsl:when>
					<xsl:otherwise>the company</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'applicant'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/applicant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Applicant
					</xsl:when>
					<xsl:otherwise>the applicant</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'petitioner'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/applicant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Petitioner
					</xsl:when>
					<xsl:otherwise>the petitioner</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'trustee'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/trustee) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Trustee
					</xsl:when>
					<xsl:otherwise>the trustee</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'insolvencypractitioner'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/insolvencypractitioner) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Insolvency Practitioner
					</xsl:when>
					<xsl:otherwise>the insolvency practitioner</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'officialreceiver'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/insolvencypractitioner) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Official Receiver
					</xsl:when>
					<xsl:otherwise>the official receiver</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR020 END-->
	<!-- N35 BEGIN-->
	<!-- N35 END-->
	<!-- N35A BEGIN-->
	<!-- N35A END-->
	<!-- N441A BEGIN-->
	<xsl:variable name="vdJudgmentAddressDifferent">
		<xsl:choose>
			<xsl:when test="$vdSubjectAddressId != $vdJudgmentAgainstIDD">Y</xsl:when>
			<xsl:otherwise>N</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentAgainstAddress">
		<xsl:copy-of select="variabledata/judgment/partyagainst/address"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentAgainstAddress1">
		<xsl:variable name="tempRepId">
			<xsl:value-of select="variabledata/judgment/partyagainst/id"/>
		</xsl:variable>
		<xsl:copy-of 
			select="/descendant-or-self::node()/claim/descendant-or-self::node()/parent::node()[./id = $tempRepId]/address"/>
	</xsl:variable>
	<xsl:template name="fixdatefornumericcomparison">
		<xsl:param name="date"/>
		<xsl:variable name="year" select="substring($date,1,4)"/>
		<xsl:variable name="month" select="substring($date,6,2)"/>
		<xsl:variable name="day" select="substring($date,9,2)"/>
		<xsl:value-of select="concat($year,$month,$day)"/>
	</xsl:template>
	<xsl:template name="fixdatefornumericcomparison2">
		<xsl:param name="date"/>
		<xsl:variable name="year" select="substring($date,8,4)"/>
		<xsl:variable name="month">
			<xsl:variable name="tmpMonth" select="substring($date,4,3)"/>
			<xsl:variable name="lcletters">
				abcdefghijklmnopqrstuvwxyz</xsl:variable>
			<xsl:variable name="ucletters">
				ABCDEFGHIJKLMNOPQRSTUVWXYZ</xsl:variable>
			<xsl:variable name="tmpUPPMonth" 
				select="translate($tmpMonth, $lcletters, $ucletters)"/>
			<xsl:choose>
				<xsl:when test="'JAN' = $tmpUPPMonth">01</xsl:when>
				<xsl:when test="'FEB' = $tmpUPPMonth">02</xsl:when>
				<xsl:when test="'MAR' = $tmpUPPMonth">03</xsl:when>
				<xsl:when test="'APR' = $tmpUPPMonth">04</xsl:when>
				<xsl:when test="'MAY' = $tmpUPPMonth">05</xsl:when>
				<xsl:when test="'JUN' = $tmpUPPMonth">06</xsl:when>
				<xsl:when test="'JUL' = $tmpUPPMonth">07</xsl:when>
				<xsl:when test="'AUG' = $tmpUPPMonth">08</xsl:when>
				<xsl:when test="'SEP' = $tmpUPPMonth">09</xsl:when>
				<xsl:when test="'OCT' = $tmpUPPMonth">10</xsl:when>
				<xsl:when test="'NOV' = $tmpUPPMonth">11</xsl:when>
				<xsl:when test="'DEC' = $tmpUPPMonth">12</xsl:when>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="day" select="substring($date,1,2)"/>
		<xsl:value-of select="concat($year,$month,$day)"/>
	</xsl:template>
	<xsl:variable name="vdJudgmentAgainstAddress2">
		<xsl:copy-of 
			select="/descendant-or-self::node()/claim/descendant-or-self::node()/parent::node()/historicaladdresses/address[./id = $vdJudgmentAgainstIDD]"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentAgainstIDD"><xsl:value-of select="variabledata/judgment/partyagainst/addressidatjudgment"/></xsl:variable>
	<!-- N441A END-->
	<!-- CJR065A BEGIN-->
	<xsl:variable name="vdJudgmentCost">
		<xsl:choose>
			<xsl:when test="$vdPaidBeforeJudgment > 0">
				<xsl:call-template name="correctCalculation">
					<xsl:with-param name="value">
						<xsl:value-of 
							select="$vdTotal - $vdPaidBeforeJudgment"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdTotal">
		<xsl:value-of select="$vdAmount + $vdCost"/>
	</xsl:variable>
	<xsl:variable name="vdSubjectWording">
		<xsl:choose>
			<xsl:when test="$vdSubjectPartyRole = $vdInstigatorPartyRole"> 
				<xsl:value-of select="$vdSubjectPartyRole"/>&#xA0;<xsl:value-of 
				select="$vdSubjectName"/> </xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of select="$vdSubjectPartyRole"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
					<xsl:with-param name="surnameFlag">false</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInstigatorWording">
		<xsl:choose>
			<xsl:when test="$vdSubjectPartyRole = $vdInstigatorPartyRole"> 
				<xsl:value-of 
				select="$vdInstigatorPartyRole"/>&#xA0;<xsl:value-of 
				select="$vdInstigatorName"/> </xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of select="$vdInstigatorPartyRole"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
					<xsl:with-param name="surnameFlag">false</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPeriodWording">
		<xsl:choose>
			<xsl:when test="$vdInstalmentPeriod = 'MTH'"> for every 
				month</xsl:when>
			<xsl:when test="$vdInstalmentPeriod = 'WK'"> for every 
				week</xsl:when>
			<xsl:when test="$vdInstalmentPeriod = 'FOR'"> for every 
				fortnight</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR065A END-->
	<!-- CJR019 BEGIN-->
	<xsl:variable name="vdHearingFor">
		<xsl:choose>
			<xsl:when test="variabledata/claim/hearing/hearingisfor = 'ALLOC'">
				allocation</xsl:when>
			<xsl:otherwise>listing</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdQASubmit">
		<xsl:choose>
			<xsl:when test="variabledata/claim/hearing/qasubmit = 'CLM'">
				<xsl:text>claim</xsl:text>
			</xsl:when>
			<xsl:when test="variabledata/claim/hearing/qasubmit = 'CTR'">
				<xsl:text>counterclaim</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingType">
		<xsl:choose>
			<xsl:when test="variabledata/claim/hearing/type= 'ALLOC'">alloc 
				hearing</xsl:when>
			<xsl:otherwise> listing </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCmfHrgAllPtc">
		<xsl:choose>
			<xsl:when test="variabledata/claim/hearing/hearingisfor = 'ALLOC'">
				directions questionnaires</xsl:when>
			<xsl:otherwise>pre-trial checklists</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingReasons">
		<xsl:if test="variabledata/claim/hearing/reasonsforhrgyorn = 'Y'"> 
			Reasons for hearing are as follows: <xsl:value-of 
			select="variabledata/claim/hearing/hrgreasons"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdInfoRequiredFrom">
		<xsl:value-of select="variabledata/claim/hearing/inforeqdfrom"/>
	</xsl:variable>
	<xsl:variable name="vdInfoDetails">
		<xsl:value-of select="variabledata/claim/hearing/infodetails"/>
	</xsl:variable>
	<xsl:variable name="vdIsFurtherHearing">
		<xsl:value-of select="variabledata/claim/hearing/isfurther"/>
	</xsl:variable>
	<xsl:variable name="vdInfoFileDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/claim/hearing/infofiledate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CJR019 END-->
	<!-- CJR021 BEGIN-->
	<xsl:variable name="vdMultiTrackTransfer">
		<xsl:value-of select="variabledata/transfer/court/multitracktransfer"/>
	</xsl:variable>
	<!-- CJR021 END-->
	<!-- CJR023A BEGIN-->
	<xsl:variable name="vdHearingDuration">
		<xsl:call-template name="minutehourday">
			<xsl:with-param name="units">
				<xsl:value-of 
					select="variabledata/notice/hearingdurationunits"/>
			</xsl:with-param>
			<xsl:with-param name="quantity">
				<xsl:value-of select="variabledata/notice/hearingduration"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimTypeDirections">
		<xsl:value-of select="variabledata/notice/smallclaitypedirections"/>
	</xsl:variable>
	<xsl:variable name="vdSpecialDirections">
		<xsl:value-of select="variabledata/notice/specialdirns"/>
	</xsl:variable>
	<xsl:variable name="vdIsHearingDate">
		<xsl:value-of select="variabledata/notice/ishrgdaterqd"/>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormA4"> The court must be informed 
		immediately if the case is settled by agreement before the hearing 
		date. </xsl:variable>
	<xsl:variable name="vdSmallClaimFormA1">
		<xsl:if test="variabledata/notice/docsservedandfiled = 'Y'">
			<xsl:choose>
				<xsl:when test="variabledata/notice/directionstype = 'SD'"> 
					Each party shall deliver to every other party and to the 
					court office copies of all documents (including any 
					experts' report) on which he intends to rely at the hearing 
					no later than </xsl:when>
				<xsl:otherwise> The copies shall be delivered no later than 
					</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="variabledata/notice/docsfiledate= 'GD'">
					<xsl:call-template name="format-date-placeholder">
						<xsl:with-param name="date-xpath">
							<xsl:value-of 
								select="variabledata/claim/hearing/fasttrack/docsserveddate"/>
						</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise> 14 days before the hearing. </xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimOriginalDocuments">
		<xsl:if test="variabledata/notice/origdocs = 'Y'"> The original 
			documents shall be brought to the hearing. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormB4">
		<xsl:if test="variabledata/notice/costrepairs = 'Y'"> Before the date 
			of the hearing the parties shall try to agree the cost of the 
			repairs and any other losses claimed subject to the court's 
			decision about whose fault the accident was. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormC4">
		<xsl:if test="variabledata/notice/itemswork = 'Y'"> The <xsl:choose> 
			<xsl:when test="variabledata/notice/filelist = 'OTH'"> 
			<xsl:value-of select="variabledata/notice/filelistother"/> 
			</xsl:when> <xsl:when 
			test="variabledata/notice/filelist = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/filelist = 'DEF'">defendant</xsl:when> 
			</xsl:choose> shall deliver to the <xsl:choose> <xsl:when 
			test="variabledata/notice/servlist = 'OTH'"> <xsl:value-of 
			select="variabledata/notice/servlistother"/> </xsl:when> <xsl:when 
			test="variabledata/notice/servlist = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/servlist = 'DEF'">defendant</xsl:when> 
			</xsl:choose> and to the court office <xsl:choose> <xsl:when 
			test="variabledata/notice/listcopydocs  = 'Y'"> with his copy 
			documents </xsl:when> <xsl:otherwise> no later than 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/notice/datelist"/> </xsl:with-param> 
			</xsl:call-template> </xsl:otherwise> </xsl:choose> a list showing 
			all items of work which he complains about and why, and the amount 
			claimed for putting each item right. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormC5">
		<xsl:if test="variabledata/notice/workdone = 'Y'"> The <xsl:choose> 
			<xsl:when test="variabledata/notice/fileworkdone  = 'OTH'"> 
			<xsl:value-of select="variabledata/notice/fileworkdoneother"/> 
			</xsl:when> <xsl:when 
			test="variabledata/notice/fileworkdone = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/fileworkdone = 'DEF'">defendant</xsl:when> 
			</xsl:choose> shall deliver to the <xsl:choose> <xsl:when 
			test="variabledata/notice/serfvworkdone = 'OTH'"> <xsl:value-of 
			select="variabledata/notice/serfvworkdoneother"/> </xsl:when> 
			<xsl:when 
			test="variabledata/notice/serfvworkdone = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/serfvworkdone = 'DEF'">defendant</xsl:when> 
			</xsl:choose> and to the court office <xsl:choose> <xsl:when 
			test="variabledata/notice/workdonecopy  = 'Y'"> with his copy 
			documents </xsl:when> <xsl:otherwise> no later than 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/notice/dateworkdone"/> </xsl:with-param> 
			</xsl:call-template> </xsl:otherwise> </xsl:choose> a breakdown of 
			the amount he is claiming showing all work done and materials 
			supplied. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormD4">
		<xsl:if test="variabledata/notice/itemloss = 'Y'"> The <xsl:choose> 
			<xsl:when test="variabledata/notice/fileitemloss  = 'OTH'"> 
			<xsl:value-of select="variabledata/notice/fileitemlossother"/> 
			</xsl:when> <xsl:when 
			test="variabledata/notice/fileitemloss = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/fileitemloss = 'DEF'">defendant</xsl:when> 
			</xsl:choose> shall deliver with his copy documents a list showing 
			each item of loss or damage for which he claims the <xsl:choose> 
			<xsl:when test="variabledata/notice/payitemloss  = 'OTH'"> 
			<xsl:value-of select="variabledata/notice/payitemlossother"/> 
			</xsl:when> <xsl:when 
			test="variabledata/notice/payitemloss = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/payitemloss = 'DEF'">defendant</xsl:when> 
			</xsl:choose> ought to pay, and the amount he claims for the 
			replacement or repair. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormD5">
		<xsl:if test="variabledata/notice/agreeitemloss = 'Y'"> The parties 
			shall before the hearing date try to agree about the nature and 
			cost of any repairs and replacements needed, subject to the court's 
			decision about any other issue in the case. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormC6">
		<xsl:if test="variabledata/notice/agreeworkdone = 'Y'"> Before the date 
			of the hearing the parties shall try to agree about the nature and 
			cost of any remedial work required, subject to the court's decision 
			about any other issue in the case. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormB5">
		<xsl:if test="variabledata/notice/witstate  = 'Y'"> Signed statements 
			setting out the evidence of all witnesses on whom each party 
			intends to rely shall be prepared and <xsl:choose> <xsl:when 
			test="variabledata/notice/directions = 'RTA'">copies</xsl:when> 
			<xsl:when 
			test="variabledata/notice/directions = 'HW'">copies</xsl:when> 
			</xsl:choose> included in the documents mentioned. This includes 
			the evidence of the parties themselves and of any other witness, 
			whether or not he is going to come to court to give evidence. 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormB6">
		<xsl:value-of select="variabledata/notice/sketchplan"/>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormC8">
		<xsl:value-of select="variabledata/notice/photorequire"/>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormD7">
		<xsl:value-of select="variabledata/notice/photodirect"/>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormE5">
		<xsl:value-of select="variabledata/notice/videodirect"/>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormE6">
		<xsl:if test="variabledata/notice/directdiscount = 'Y'"> The parties 
			should note that the court may decide not to take into account a 
			document or the evidence of a witness or a video if these 
			directions have not been complied with. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormF1">
		<xsl:if test="variabledata/notice/clarifycasedirns  = 'Y'"> The 
			<xsl:choose> <xsl:when test="variabledata/notice/ccparty  = 'OTH'"> 
			<xsl:value-of select="variabledata/notice/ccpartyother"/> 
			</xsl:when> <xsl:when 
			test="variabledata/notice/ccparty = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/ccparty = 'DEF'">defendant</xsl:when> 
			</xsl:choose> must clarify his case. He must do this by delivering 
			to the court office and to the <xsl:choose> <xsl:when 
			test="variabledata/notice/ccserve = 'OTH'"> <xsl:value-of 
			select="variabledata/notice/ccserveother"/> </xsl:when> <xsl:when 
			test="variabledata/notice/ccserve = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/ccserve = 'DEF'">defendant</xsl:when> 
			</xsl:choose> no later than <xsl:call-template 
			name="format-date-placeholder"> <xsl:with-param name="date-xpath"> 
			<xsl:value-of select="variabledata/notice/ccfiledate"/> 
			</xsl:with-param> </xsl:call-template> <xsl:choose> <xsl:when 
			test="variabledata/notice/ccfiled = 'LST'"> a list of </xsl:when> 
			<xsl:when test="variabledata/notice/ccfiled = 'DET'"> details of 
			</xsl:when> <xsl:when test="variabledata/notice/ccfiled = 'BTH'"> a 
			list of and details of </xsl:when> </xsl:choose> </xsl:if>
		<xsl:value-of select="variabledata/notice/ccwording"/>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormF7A">
		<xsl:if test="variabledata/notice/ccunless = 'Y'"> If he does not do so 
			the following consequences will apply <xsl:value-of 
			select="variabledata/notice/ccunlessdet"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormF2">
		<xsl:if test="variabledata/notice/inspectiondirns  = 'Y'"> The 
			<xsl:choose> <xsl:when 
			test="variabledata/notice/iparty = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/iparty = 'DEF'">defendant</xsl:when> 
			<xsl:when test="variabledata/notice/iparty = 'OTH'"> <xsl:value-of 
			select="variabledata/notice/ipartyother"/> </xsl:when> 
			</xsl:choose> shall allow the <xsl:choose> <xsl:when 
			test="variabledata/notice/ipartytoinsp = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/ipartytoinsp = 'DEF'">defendant</xsl:when> 
			<xsl:when test="variabledata/notice/ipartytoinsp = 'OTH'"> 
			<xsl:value-of select="variabledata/notice/ipartytoinspother"/> 
			</xsl:when> </xsl:choose> to inspect <xsl:value-of 
			select="variabledata/notice/iinspected"/> by appointment within 
			<xsl:value-of select="variabledata/notice/inoofdays"/> day(s) of 
			receiving a request to do so. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormF7B">
		<xsl:if test="variabledata/notice/iunless = 'Y'"> If he does not do so 
			the following consequences will apply <xsl:value-of 
			select="variabledata/notice/iunlessdet"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormF4">
		<xsl:if test="variabledata/notice/dcbrought = 'Y'"> The <xsl:choose> 
			<xsl:when 
			test="variabledata/notice/dcparty = 'CLM'">claimant</xsl:when> 
			<xsl:when 
			test="variabledata/notice/dcparty = 'DEF'">defendant</xsl:when> 
			<xsl:when test="variabledata/notice/dcparty = 'OTH'"> <xsl:value-of 
			select="variabledata/notice/dcpartyother"/> </xsl:when> 
			</xsl:choose> must bring to court at the hearing the <xsl:value-of 
			select="variabledata/notice/dcitems"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormF7C">
		<xsl:if test="variabledata/notice/dcunless = 'Y'"> If he does not do so 
			the following consequences will apply <xsl:value-of 
			select="variabledata/notice/dcunlessdet"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormF5">
		<xsl:if test="variabledata/notice/specwitstate = 'Y'"> Signed 
			statements setting out the evidence of all witnesses on whom each 
			party intends to rely shall be prepared and copies included in the 
			documents mentioned. This includes the evidence of the parties 
			themselves and of any other witness, whether or not he is going to 
			come to court to give evidence. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormF6">
		<xsl:if test="variabledata/notice/notcomply = 'Y'"> The court may 
			decide not to take into account a document [or video] or the 
			evidence of a witness if these directions have not been complied 
			with. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormF8">
		<xsl:if test="variabledata/notice/expertevid = 'Y'"> It appears to the 
			court that expert evidence is necessary on the issue of 
			<xsl:value-of select="variabledata/notice/expertissue"/> and that 
			the evidence should be given by a single expert <xsl:value-of 
			select="variabledata/notice/expertprof"/> to be instructed by the 
			parties jointly. If the parties cannot agree about who to choose 
			and what arrangements to make about paying his fee, either party 
			may apply to the court for further directions. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSmallClaimFormF9">
		<xsl:if test="variabledata/notice/specvideo = 'Y'"> <xsl:value-of 
			select="variabledata/notice/specvideodays"/> day(s) </xsl:if>
	</xsl:variable>
	<!-- CJR023A END-->
	<!-- CJR023C BEGIN-->
	<xsl:variable name="vdLQHearingFee">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/lqandhearing/hearingfee"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdLQPayableByDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/lqandhearing/payablebydate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHearingWhoIsToPay">
		<xsl:variable name="partyId">
			<xsl:value-of select="variabledata/lqandhearing/whoistopay"/>
		</xsl:variable>
		<xsl:variable name="partyType">
			<xsl:value-of select="name(variabledata/claim/child::*[id = $partyId])"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$partyType = 'claimant'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/claimant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Claimant
					</xsl:when>
					<xsl:otherwise>the claimant</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'defendant'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/defendant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Defendant
					</xsl:when>
					<xsl:otherwise>the defendant</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'part20claimant'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/part20claimant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Part 20 Claimant
					</xsl:when>
					<xsl:otherwise>the part 20 claimant</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'part20defendant'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/part20defendant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Part 20 Defendant
					</xsl:when>
					<xsl:otherwise>the part 20 defendant</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'debtor'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/debtor) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Debtor
					</xsl:when>
					<xsl:otherwise>the debtor</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'creditor'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/creditor) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Creditor
					</xsl:when>
					<xsl:otherwise>the creditor</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'company'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/company) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Company
					</xsl:when>
					<xsl:otherwise>the company</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'applicant'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/applicant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Applicant
					</xsl:when>
					<xsl:otherwise>the applicant</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'petitioner'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/applicant) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Petitioner
					</xsl:when>
					<xsl:otherwise>the petitioner</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'trustee'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/trustee) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Trustee
					</xsl:when>
					<xsl:otherwise>the trustee</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'insolvencypractitioner'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/insolvencypractitioner) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Insolvency Practitioner
					</xsl:when>
					<xsl:otherwise>the insolvency practitioner</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$partyType = 'officialreceiver'">
				<xsl:choose>
					<xsl:when test="count(variabledata/claim/insolvencypractitioner) > 1">
						the <xsl:call-template name="numberpostfix">
							<xsl:with-param name="number">
								<xsl:value-of 
									select="variabledata/claim/child::*[id = $partyId]/number"/>
							</xsl:with-param>
						</xsl:call-template> Official Receiver
					</xsl:when>
					<xsl:otherwise>the official receiver</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR023C END-->
	<!-- CJR024 BEGIN-->
	<xsl:variable name="vdNoticePTRTitle"> Notice of <xsl:choose> <xsl:when 
		test="variabledata/notice/noticeptrtitle='HRG'"> <xsl:choose> <xsl:when 
		test="variabledata/notice/hrgwording3='ADJ'">Adjourned 
		Hearing</xsl:when> <xsl:when 
		test="variabledata/notice/hrgwording3='RES'">Restored 
		Hearing</xsl:when> <xsl:when 
		test="variabledata/notice/hrgwording3='TPL'">Hearing</xsl:when> 
		</xsl:choose> </xsl:when> <xsl:otherwise> <xsl:value-of 
		select="$vdNotice"/> </xsl:otherwise> </xsl:choose> </xsl:variable>
	<xsl:variable name="vdNotice">
		<xsl:choose>
			<xsl:when test="variabledata/notice/noticeptrtitle='CMC'">Case 
				Management Conference</xsl:when>
			<xsl:when test="variabledata/notice/noticeptrtitle='HRG'">
				Hearing</xsl:when>
			<xsl:when test="variabledata/notice/noticeptrtitle='TRL'">
				Trial</xsl:when>
			<xsl:when test="variabledata/notice/noticeptrtitle='PTR'">Pre Trial 
				Review</xsl:when>
			<xsl:when test="variabledata/notice/noticeptrtitle='OTH'">
				<xsl:value-of select="variabledata/notice/noticeptrtitleother"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingWording2">
		<xsl:choose>
			<xsl:when test="variabledata/notice/hrgwording3='ADJ'">has been 
				adjourned until</xsl:when>
			<xsl:when test="variabledata/notice/hrgwording3='RES'">has been 
				restored to</xsl:when>
			<xsl:when test="variabledata/notice/hrgwording3='TPL'">will take 
				place on</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingDurationWording">
		<xsl:if test="variabledata/notice/timeestimate = 'Y'"> 
			<xsl:call-template name="minutehourday"> <xsl:with-param 
			name="units"> <xsl:value-of 
			select="variabledata/notice/hrgdurationunits"/> </xsl:with-param> 
			<xsl:with-param name="quantity"> <xsl:value-of 
			select="variabledata/notice/hrgduration"/> </xsl:with-param> 
			</xsl:call-template> has been allowed for the <xsl:value-of 
			select="$vdNotice"/> </xsl:if>
	</xsl:variable>
	<!-- CJR024 END-->
	<!-- CJR036 BEGIN-->
	<xsl:variable name="vdInterestEntitlement">
		<xsl:value-of select="variabledata/notice/interestentitlement"/>
	</xsl:variable>
	<xsl:variable name="vdClaimantDefendant">
		<xsl:value-of select="$vdSubjectPartyCode"/>
	</xsl:variable>
	<xsl:variable name="vdSumPayable">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/notice/sumpayable"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSumToPay">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/notice/sumtopay"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSumPayable2">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/notice/sumpayable2"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSumPayableWithin">
		<xsl:choose>
			<xsl:when test="variabledata/notice/sumpayablewithin='FD'">within 
				14 days from the date of this order</xsl:when>
			<xsl:when test="variabledata/notice/sumpayablewithin='PIC'">into 
				court to await the issue of a final costs certificate</xsl:when>
			<xsl:otherwise>on or before <xsl:call-template 
				name="format-date-placeholder"> <xsl:with-param 
				name="date-xpath"> <xsl:value-of 
				select="variabledata/notice/intrimsumpayablewithin"/> 
				</xsl:with-param> </xsl:call-template> </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR036 END-->
	<!-- CJR037 BEGIN-->
	<xsl:variable name="vdAssessedCosts">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/notice/assessedcosts) > 0">
				<xsl:value-of select="variabledata/notice/assessedcosts"/>
			</xsl:when>
			<xsl:otherwise>0.00</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDetailAssessmentCosts">
		<xsl:variable name="output">
			<xsl:choose>
				<xsl:when 
					test="string-length(variabledata/notice/detailassessmentcosts) > 0">
					<xsl:call-template name="correctCalculation">
						<xsl:with-param name="value">
							<xsl:value-of 
								select="variabledata/notice/detailassessmentcosts"/>
						</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>0.00</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:if test="$vdBalanceWording = 'Y'"> including &#163;<xsl:value-of 
			select="normalize-space($output)"/> for the costs of the detailed 
			assessment. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdInterimCosts">
		<xsl:if test="variabledata/notice/amtpaidintrim = 'Y'"> And 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of select="$vdAmtAlreadyPaid"/> 
			</xsl:with-param> </xsl:call-template> already having been paid 
			under the interim costs certificate issued on <xsl:value-of 
			select="normalize-space($vdIntrimCostsCrtDate)"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdIntrimCostsCrtDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/intrimcostscrtdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdBalanceWording">
		<xsl:if test="string-length(variabledata/notice/balancewording) > 0">
			<xsl:value-of select="variabledata/notice/balancewording"/>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdAmtAlreadyPaid">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/notice/amtalreadypaid) > 0">
				<xsl:value-of select="variabledata/notice/amtalreadypaid"/>
			</xsl:when>
			<xsl:otherwise>0.00</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdBalanceAmount">
		<xsl:value-of select="$vdAssessedCosts - $vdAmtAlreadyPaid"/>
	</xsl:variable>
	<xsl:variable name="vdSumPayableWithin2">
		<xsl:choose>
			<xsl:when test="variabledata/notice/sumpayablewithin='FD'">within 
				14 days from the date of this order</xsl:when>
			<xsl:when test="variabledata/notice/sumpayablewithin='GD'">into 
				court to await the issue of a final costs certificate on or 
				before <xsl:call-template name="format-date-placeholder"> 
				<xsl:with-param name="date-xpath"> <xsl:value-of 
				select="variabledata/notice/amtpaiddate"/> </xsl:with-param> 
				</xsl:call-template> </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR037 END-->
	<!-- CJR038 BEGIN-->
	<xsl:variable name="vdApplication">
		<xsl:choose>
			<xsl:when test="variabledata/notice/hrgwording2='AH'">a detailed 
				assessment hearing</xsl:when>
			<xsl:when test="variabledata/notice/hrgwording2='ICC'">the issue of 
				an interim costs certificate by agreement</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR038 END-->
	<!-- CJR035 BEGIN-->
	<xsl:variable name="vdProvisionalAssessmentCosts"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/notice/provassessmentcosts"/> </xsl:with-param> 
		</xsl:call-template>
	</xsl:variable>
	<!-- CJR035 END-->
	<!-- CJR050 BEGIN-->
	<xsl:variable name="vdPossessionProperty">
		<xsl:choose>
			<xsl:when test="variabledata/notice/possessionproperty/address">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/notice/possessionproperty/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdDefendantAddress"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdAmountRepresents">
		<xsl:choose>
			<xsl:when test="variabledata/notice/amountrepresents = 'R'">rent 
				arrears</xsl:when>
			<xsl:when test="variabledata/notice/amountrepresents = 'U'">use and 
				occupation</xsl:when>
			<xsl:when test="variabledata/notice/amountrepresents = 'RAUO'">rent 
				arrears and for use and occupation</xsl:when>
			<xsl:when test="variabledata/notice/amountrepresents = 'OTH'">
				<xsl:value-of 
					select="variabledata/notice/amountrepresentsother"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPossessionDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/possessiondate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPossession2">
		<xsl:if test="string-length(variabledata/notice/amountordered) > 0">
			<xsl:if test="number(variabledata/notice/amountordered) != 0"> The 
				defendant pay the claimant &#163;<xsl:call-template 
				name="correctCalculation"> <xsl:with-param name="value"> 
				<xsl:value-of select="variabledata/notice/amountordered"/> 
				</xsl:with-param> </xsl:call-template> for <xsl:value-of 
				select="$vdAmountRepresents"/> <xsl:if 
				test="variabledata/notice/dailypaymentsreq = 'Y'"> and 
				&#163;<xsl:call-template name="correctCalculation"> 
				<xsl:with-param name="value"> <xsl:value-of 
				select="variabledata/notice/dailyamount"/> </xsl:with-param> 
				</xsl:call-template> per day from <xsl:call-template 
				name="format-date-placeholder"> <xsl:with-param 
				name="date-xpath"> <xsl:value-of 
				select="variabledata/notice/dailystartdate"/> </xsl:with-param> 
				</xsl:call-template> until possession of the property is given 
				to the claimant </xsl:if> </xsl:if>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPossessionCosts3">
		<xsl:if test="variabledata/notice/orderforcosts = 'Y'">
			<xsl:choose>
				<xsl:when test="variabledata/notice/costtype = 'F'"> The 
					defendant pay the claimant's costs of 
					&#163;<xsl:call-template name="correctCalculation"> 
					<xsl:with-param name="value"> <xsl:value-of 
					select="variabledata/notice/amountcosts"/> 
					</xsl:with-param> </xsl:call-template> </xsl:when>
				<xsl:when test="variabledata/notice/costtype = 'A'"> The 
					defendant pay the claimant's costs, within 14 days after 
					they are assessed <xsl:choose> <xsl:when 
					test="variabledata/notice/payaccountcosts = 'Y'"> and in 
					the meantime pay the claimant &#163;<xsl:call-template 
					name="correctCalculation"> <xsl:with-param name="value"> 
					<xsl:value-of 
					select="variabledata/notice/amountaccountcosts"/> 
					</xsl:with-param> </xsl:call-template> on account of those 
					costs </xsl:when> <xsl:otherwise/> </xsl:choose> </xsl:when>
				<xsl:when test="variabledata/notice/costtype = 'M'"> The 
					claimant's costs will be added to the amount owing under 
					the mortgage </xsl:when>
			</xsl:choose>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPossession4">
		<xsl:if 
			test="number(variabledata/notice/amountordered) > 0 or number(variabledata/notice/amountcosts) > 0 or number(variabledata/notice/amountaccountcosts) > 0">
			 The defendant pay the total amount of <xsl:choose> <xsl:when 
			test="number(variabledata/notice/amountordered) > 0 and number(variabledata/notice/amountcosts) > 0 and number(variabledata/notice/amountaccountcosts) > 0"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/amountordered + variabledata/notice/amountcosts + variabledata/notice/amountaccountcosts"/> 
			</xsl:with-param> </xsl:call-template> </xsl:when> <xsl:when 
			test="number(variabledata/notice/amountordered) > 0 and number(variabledata/notice/amountcosts) > 0 and number(variabledata/notice/amountaccountcosts) = 0"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/amountordered + variabledata/notice/amountcosts"/> 
			</xsl:with-param> </xsl:call-template> </xsl:when> <xsl:when 
			test="number(variabledata/notice/amountordered) > 0 and number(variabledata/notice/amountcosts) = 0 and number(variabledata/notice/amountaccountcosts) > 0"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/amountordered + variabledata/notice/amountaccountcosts"/> 
			</xsl:with-param> </xsl:call-template> </xsl:when> <xsl:when 
			test="(number(variabledata/notice/amountordered) = 0 or string-length(variabledata/notice/amountordered) = 0)  and number(variabledata/notice/amountcosts) > 0 and number(variabledata/notice/amountaccountcosts) > 0"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/amountcosts + variabledata/notice/amountaccountcosts"/> 
			</xsl:with-param> </xsl:call-template> </xsl:when> <xsl:when 
			test="number(variabledata/notice/amountordered) > 0 and number(variabledata/notice/amountcosts) = 0 and number(variabledata/notice/amountaccountcosts) = 0"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/amountordered"/> </xsl:with-param> 
			</xsl:call-template> </xsl:when> <xsl:when 
			test="(number(variabledata/notice/amountordered) = 0 or string-length(variabledata/notice/amountordered) = 0)and number(variabledata/notice/amountcosts) > 0 and number(variabledata/notice/amountaccountcosts) = 0"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/amountcosts"/> </xsl:with-param> 
			</xsl:call-template> </xsl:when> <xsl:when 
			test="(number(variabledata/notice/amountordered) = 0 or string-length(variabledata/notice/amountordered) = 0) and (number(variabledata/notice/amountcosts) = 0 or string-length(variabledata/notice/amountcosts) = 0) and number(variabledata/notice/amountaccountcosts) > 0"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/amountaccountcosts"/> </xsl:with-param> 
			</xsl:call-template> </xsl:when> </xsl:choose> <xsl:if 
			test="number(variabledata/judgment/instalmentamount) > 0"> by 
			instalments of &#163;<xsl:value-of 
			select="variabledata/notice/instalmentamount"/> per <xsl:choose> 
			<xsl:when 
			test="variabledata/notice/instalmentperiod = 'FOR'">fortnight</xsl:when> 
			<xsl:when 
			test="variabledata/notice/instalmentperiod = 'MTH'">month</xsl:when> 
			<xsl:when 
			test="variabledata/notice/instalmentperiod = 'WK'">week</xsl:when> 
			</xsl:choose> the first instalment to be paid </xsl:if> to the 
			claimant on or before <xsl:choose> <xsl:when 
			test="string-length(variabledata/judgment/paymentinfulldate) = 0"> 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/judgment/firstpaymentdate"/> </xsl:with-param> 
			</xsl:call-template> </xsl:when> <xsl:when 
			test="string-length(variabledata/judgment/paymentinfulldate) > 0"> 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/judgment/paymentinfulldate"/> 
			</xsl:with-param> </xsl:call-template> </xsl:when> </xsl:choose> 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPayAccountCosts">
		<xsl:value-of select="variabledata/notice/costtype"/>
	</xsl:variable>
	<!-- CJR050 END-->
	<!-- CJR051 BEGIN-->
	<xsl:variable name="vdHasWrittenEvidence">
		<xsl:value-of select="variabledata/order/haswrittenevidence"/>
	</xsl:variable>
	<xsl:variable name="vdHasCostOrder">
		<xsl:value-of select="variabledata/order/hascostorder"/>
	</xsl:variable>
	<xsl:variable name="vdHasPostponeRequest">
		<xsl:value-of select="variabledata/order/haspostponerequest"/>
	</xsl:variable>
	<xsl:variable name="vdPossessionInstalmentPeriod">
		<xsl:choose>
			<xsl:when test="variabledata/notice/instalmentperiod = 'FOR'">
				fortnight</xsl:when>
			<xsl:when test="variabledata/notice/instalmentperiod = 'MTH'">
				month</xsl:when>
			<xsl:when test="variabledata/notice/instalmentperiod = 'WK'">
				week</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPossessionShorthold3">
		<xsl:value-of select="$vdPossessionInstalmentPeriod"/>
	</xsl:variable>
	<!-- CJR051 END-->
	<!-- CJR052 BEGIN-->
	<xsl:variable name="vdPossessionForfeiture2"> The defendant pay the 
		claimant &#163;<xsl:call-template name="correctCalculation"> 
		<xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/notice/amountordered"/> </xsl:with-param> 
		</xsl:call-template> for <xsl:value-of select="$vdAmountRepresents"/> 
		<xsl:if test="string-length(variabledata/notice/dailyamount) > 0"> and 
		&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
		name="value"> <xsl:value-of select="variabledata/notice/dailyamount"/> 
		</xsl:with-param> </xsl:call-template> per day from <xsl:call-template 
		name="format-date-placeholder"> <xsl:with-param name="date-xpath"> 
		<xsl:value-of select="variabledata/notice/dailystartdate"/> 
		</xsl:with-param> </xsl:call-template> </xsl:if> until possession is 
		given to the claimant or payment is made under paragraph <xsl:choose> 
		<xsl:when test="variabledata/notice/orderforcosts = 'Y'">5</xsl:when> 
		<xsl:otherwise>4</xsl:otherwise> </xsl:choose> below. </xsl:variable>
	<xsl:variable name="vdPossessionForfeiture3">
		<xsl:choose>
			<xsl:when test="variabledata/notice/moneyjudgment = 'F'">The 
				defendant pay the claimant's costs of &#163;<xsl:call-template 
				name="correctCalculation"> <xsl:with-param name="value"> 
				<xsl:value-of select="$vdCost"/> </xsl:with-param> 
				</xsl:call-template> </xsl:when>
			<xsl:when test="variabledata/notice/moneyjudgment = 'A'">The 
				defendant pay the claimant's costs, within 14 days after they 
				are assessed</xsl:when>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="variabledata/notice/payaccountcosts = 'Y'"> and in 
				the meantime pay the claimant &#163;<xsl:call-template 
				name="correctCalculation"> <xsl:with-param name="value"> 
				<xsl:value-of select="variabledata/notice/amountaccountcosts"/> 
				</xsl:with-param> </xsl:call-template> on account of those 
				costs. </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPossessionForfeiture4"> The defendant pay the total 
		of the sums mentioned above to the claimant <xsl:if 
		test="string-length(variabledata/notice/paymentinfulldate) > 0"> on or 
		before <xsl:call-template name="format-date-placeholder"> 
		<xsl:with-param name="date-xpath"> <xsl:value-of 
		select="variabledata/notice/paymentinfulldate"/> </xsl:with-param> 
		</xsl:call-template> </xsl:if> <xsl:if 
		test="string-length(variabledata/notice/instalmentperiod )> 0"> 
		<xsl:choose> <xsl:when 
		test="variabledata/notice/instalmentperiod  = 'FOR'">fortnightly</xsl:when> 
		<xsl:when 
		test="variabledata/notice/instalmentperiod  = 'MTH'">monthly</xsl:when> 
		<xsl:when 
		test="variabledata/notice/instalmentperiod  = 'WK'">weekly</xsl:when> 
		</xsl:choose> by instalments of &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/notice/instalmentamount"/> </xsl:with-param> 
		</xsl:call-template>, the first instalment to be paid to the claimant 
		on or before <xsl:call-template name="format-date-placeholder"> 
		<xsl:with-param name="date-xpath"> <xsl:value-of 
		select="variabledata/notice/firstpaymentdate"/>. </xsl:with-param> 
		</xsl:call-template> </xsl:if> <xsl:if 
		test="string-length(variabledata/notice/instalmentperiod) = 0">.</xsl:if> 
		</xsl:variable>
	<xsl:variable name="vdCeaseDate">
		<xsl:value-of select="variabledata/notice/datecease"/>
	</xsl:variable>
	<xsl:variable name="vdCostsAssessed">
		<xsl:value-of select="variabledata/notice/moneyjudgment"/>
	</xsl:variable>
	<!-- CJR052 END-->
	<!-- CJR053 BEGIN-->
	<xsl:variable name="vdPossessionRent2">
		<xsl:if 
			test="string-length(variabledata/notice/amountordered) > 0 and number(variabledata/notice/amountordered) > 0">
			 The defendant pay the claimant &#163;<xsl:call-template 
			name="correctCalculation"> <xsl:with-param name="value"> 
			<xsl:value-of select="variabledata/notice/amountordered"/> 
			</xsl:with-param> </xsl:call-template> for <xsl:value-of 
			select="$vdAmountRepresents"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPossessionRent3">
		<xsl:if 
			test="string-length($vdGoodsCostAmount) > 0 and number($vdGoodsCostAmount) > 0">
			 The defendant pay the claimant's costs of the claim 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of select="$vdGoodsCostAmount"/> 
			</xsl:with-param> </xsl:call-template>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPossessionRent4">
		<xsl:if 
			test="(string-length($vdGoodsCostAmount) > 0 and number($vdGoodsCostAmount) > 0) or (string-length(variabledata/notice/amountordered) > 0 and number(variabledata/notice/amountordered) > 0)">
			 The defendant pay the total of <xsl:choose> <xsl:when 
			test="(string-length($vdGoodsCostAmount) > 0 and number($vdGoodsCostAmount) > 0) and (string-length(variabledata/notice/amountordered) > 0 and number(variabledata/notice/amountordered) > 0)"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/amountordered + $vdGoodsCostAmount"/> 
			</xsl:with-param> </xsl:call-template> </xsl:when> <xsl:when 
			test="(string-length($vdGoodsCostAmount) > 0 and number($vdGoodsCostAmount) > 0) and (string-length(variabledata/notice/amountordered) = 0 or  number(variabledata/notice/amountordered) = 0)"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of select="$vdGoodsCostAmount"/> 
			</xsl:with-param> </xsl:call-template> </xsl:when> <xsl:when 
			test="(string-length($vdGoodsCostAmount) = 0 or number($vdGoodsCostAmount) = 0) and (string-length(variabledata/notice/amountordered) > 0 and number(variabledata/notice/amountordered) > 0)"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/amountordered"/> </xsl:with-param> 
			</xsl:call-template> </xsl:when> </xsl:choose> to the claimant. 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPossessionRent5"> This order is not to be enforced so 
		long as the defendant pays the claimant the rent arrears and the amount 
		for use and occupation <xsl:if 
		test="variabledata/notice/orderforcosts = 'Y'"> and costs totalling 
		<xsl:choose> <xsl:when 
		test="(string-length($vdGoodsCostAmount) > 0 and number($vdGoodsCostAmount) > 0) and (string-length(variabledata/notice/amountordered) > 0 and number(variabledata/notice/amountordered) > 0)"> 
		&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
		name="value"> <xsl:value-of 
		select="variabledata/notice/amountordered + $vdGoodsCostAmount"/> 
		</xsl:with-param> </xsl:call-template> </xsl:when> <xsl:when 
		test="(string-length($vdGoodsCostAmount) > 0 and number($vdGoodsCostAmount) > 0) and (string-length(variabledata/notice/amountordered) = 0 or number(variabledata/notice/amountordered) = 0)"> 
		&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
		name="value"> <xsl:value-of select="$vdGoodsCostAmount"/> 
		</xsl:with-param> </xsl:call-template> </xsl:when> <xsl:when 
		test="(string-length($vdGoodsCostAmount) = 0 or number($vdGoodsCostAmount) = 0) and (string-length(variabledata/notice/amountordered) > 0 and number(variabledata/notice/amountordered) > 0)"> 
		&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
		name="value"> <xsl:value-of 
		select="variabledata/notice/amountordered"/> </xsl:with-param> 
		</xsl:call-template> </xsl:when> </xsl:choose> </xsl:if> by the 
		payments set out below </xsl:variable>
	<xsl:variable name="vdInitialPaymentRequired">
		<xsl:if 
			test="string-length(variabledata/notice/initialpayment) > 0 and number(variabledata/notice/initialpayment) > 0">
			 &#163;<xsl:call-template name="correctCalculation"> 
			<xsl:with-param name="value"> <xsl:value-of 
			select="variabledata/notice/initialpayment"/> </xsl:with-param> 
			</xsl:call-template> on or before <xsl:call-template 
			name="format-date-placeholder"> <xsl:with-param name="date-xpath"> 
			<xsl:value-of select="variabledata/notice/initialdate"/> 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdInstallmentPaymentRequired">
		<xsl:if 
			test="string-length(variabledata/notice/instalmentamount) > 0 and number(variabledata/notice/instalmentamount) > 0 ">
			 &#163;<xsl:call-template name="correctCalculation"> 
			<xsl:with-param name="value"> <xsl:value-of 
			select="variabledata/notice/instalmentamount"/> </xsl:with-param> 
			</xsl:call-template> per <xsl:choose> <xsl:when 
			test="variabledata/notice/instalmentperiod = 'FOR'">fortnight,</xsl:when> 
			<xsl:when 
			test="variabledata/notice/instalmentperiod = 'MTH'">month,</xsl:when> 
			<xsl:when 
			test="variabledata/notice/instalmentperiod = 'WK'">week,</xsl:when> 
			</xsl:choose> the first payment being made on or before 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/notice/firstpaymentdate"/>. </xsl:with-param> 
			</xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPossessionRent52"> in addition to the current rent. 
		</xsl:variable>
	<!-- CJR053 END-->
	<!-- CJR054 BEGIN-->
	<xsl:variable name="vdPossessionMortgage2">
		<xsl:if 
			test="string-length(variabledata/notice/outstandingbalance) > 0"> 
			The defendant pay the claimant &#163;<xsl:call-template 
			name="correctCalculation"> <xsl:with-param name="value"> 
			<xsl:value-of select="variabledata/notice/outstandingbalance"/> 
			</xsl:with-param> </xsl:call-template> being the amount outstanding 
			under the mortgage. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPossessionMortgage3">
		<xsl:if test="variabledata/notice/orderforcosts = 'Y'">
			<xsl:choose>
				<xsl:when test="variabledata/notice/moneyjudgment = 'F'"> The 
					defendant pay the claimant's costs of 
					&#163;<xsl:call-template name="correctCalculation"> 
					<xsl:with-param name="value"> <xsl:value-of 
					select="$vdGoodsCostAmount"/> </xsl:with-param> 
					</xsl:call-template> on or before <xsl:call-template 
					name="format-date-placeholder"> <xsl:with-param 
					name="date-xpath"> <xsl:value-of 
					select="variabledata/notice/costsdate"/>. </xsl:with-param> 
					</xsl:call-template> </xsl:when>
				<xsl:when test="variabledata/notice/moneyjudgment = 'A'"> The 
					claimant's costs of the claim will be added to the amount 
					owing under the mortgage. </xsl:when>
			</xsl:choose>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPossessionMortgage4">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/notice/arrearsamount"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPossessionMortgageInitialPay">
		<xsl:if test="string-length(variabledata/notice/initialpayment) > 0"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/initialpayment"/> </xsl:with-param> 
			</xsl:call-template> on or before <xsl:call-template 
			name="format-date-placeholder"> <xsl:with-param name="date-xpath"> 
			<xsl:value-of select="variabledata/notice/initialdate"/> 
			</xsl:with-param> </xsl:call-template> and </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPossessionMortgageInstallment">
		<xsl:if test="string-length(variabledata/notice/instalmentamount) > 0"> 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:value-of 
			select="variabledata/notice/instalmentamount"/> </xsl:with-param> 
			</xsl:call-template> per <xsl:choose> <xsl:when 
			test="variabledata/notice/instalmentperiod = 'FOR'">fortnight</xsl:when> 
			<xsl:when 
			test="variabledata/notice/instalmentperiod = 'MTH'">month</xsl:when> 
			<xsl:when 
			test="variabledata/notice/instalmentperiod = 'WK'">week</xsl:when> 
			</xsl:choose> the first payment being made on or before 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/notice/firstpaymentdate"/>. </xsl:with-param> 
			</xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdPossessionMortgageMoneyOrder">
		<xsl:choose>
			<xsl:when test="variabledata/notice/judgmentgranted = 'Y'">Y</xsl:when>
			<xsl:when test="variabledata/notice/moneyjudgment = 'F'">Y</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR054 END-->
	<!-- CJR055 BEGIN -->
	<xsl:variable name="vdPossFirstInstalmentDate">
		<xsl:call-template name="format-date-placeholder"> 
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/firstpaymentdate"/>. 
			</xsl:with-param> 
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPossOrderCostAmount">
		<xsl:call-template name="correctCalculation"> 
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/judgment/goodscostamount"/> 
			</xsl:with-param> 
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPossInstalmentAmount">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:copy-of 
					select="variabledata/notice/instalmentamount"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPossAmountOrdered">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:copy-of 
					select="variabledata/notice/amountordered"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPossTotalAmountOwing">
		<xsl:choose>
			<xsl:when test="$vdOrderForCosts = 'Y'"> 
				<xsl:call-template name="correctCalculation">
					<xsl:with-param name="value">
						<xsl:value-of select="variabledata/notice/amountordered + variabledata/judgment/goodscostamount"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="correctCalculation">
					<xsl:with-param name="value">
						<xsl:copy-of 
							select="variabledata/notice/amountordered"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR055 END -->
	<!-- CJR060 BEGIN-->
	<xsl:variable name="vdFastTrackGeneralDirectionsC1">
		<xsl:if test="variabledata/notice/transferdateflag = 'TBF'"> The trial 
			of this case will take place during the period commencing 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/wftstartdate/StartDate"/> 
			</xsl:with-param> </xsl:call-template> and ending on 
			<xsl:call-template name="format-date-placeholder"> <xsl:with-param 
			name="date-xpath"> <xsl:value-of 
			select="variabledata/claim/hearing/fasttrack/wftenddate/EndDate"/> 
			</xsl:with-param> </xsl:call-template> at a venue to be notified. 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackGeneralDirectionsC2">
		<xsl:if test="variabledata/notice/transferdateflag = 'FIX'"> The trial 
			of this case will take place on <xsl:value-of 
			select="$vdHearingDate"/> at <xsl:value-of 
			select="$vdHearingTime"/> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdFastTrackGeneralDirectionsC3"> (Time Estimate: 
		<xsl:value-of select="$vdTimeAllowed"/>) </xsl:variable>
	<!-- CJR060 END-->
	<!-- CJR061 BEGIN-->
	<xsl:variable name="vdOrderApplicant">
		<xsl:choose>
			<xsl:when test="variabledata/notice/applyingparty = 'APP'">applicant</xsl:when>
			<xsl:otherwise>
				<xsl:variable name="partyId">
					<xsl:value-of select="variabledata/notice/applyingparty"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="variabledata/claim/claimant[id = $partyId]">claimant</xsl:when>
					<xsl:otherwise>defendant</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOrderApplicantName">
		<xsl:value-of select="variabledata/notice/applicantname"/>
	</xsl:variable>
	<xsl:variable name="vdHimselfHerself">
		<xsl:choose>
			<xsl:when test="variabledata/notice/ordersubjectsex = 'M'">himself</xsl:when>
			<xsl:otherwise>herself</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOrderClaimantDefendant">
		<xsl:choose>
			<xsl:when test="variabledata/notice/applyingparty = 'APP'">
				<xsl:value-of select="$vdSubjectPartyCode"/>
			</xsl:when>
			<xsl:when 
				test="string-length(variabledata/claim/claimant[id = /variabledata/notice/applyingparty]/id) > 0">defendant</xsl:when>
			<xsl:when 
				test="string-length(variabledata/claim/defendant[id = /variabledata/notice/applyingparty]/id) > 0">claimant</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDateOrderExpires">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateorderexpires"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOrderWithoutNotice">
		<xsl:copy-of select="variabledata/notice/orderwithoutnotice"/>
	</xsl:variable>
	<xsl:variable name="vdProhibitedActivity">
		<xsl:copy-of select="variabledata/notice/prohibitedactivity"/>
	</xsl:variable>
	<!-- CJR061 END-->
	<!-- CJR072 BEGIN-->
	<xsl:variable name="vdFailureParty">
		<xsl:for-each select="variabledata/notice/partyfailfilelq/PartyId">
			<xsl:if test="position()=last() and position() > 1">
				<xsl:text> and </xsl:text>
			</xsl:if>
			<xsl:variable name="id">
				<xsl:value-of select="."/>
			</xsl:variable>
			<xsl:variable name="partyDescription">
				<xsl:choose>
					<xsl:when 
						test="string-length(/variabledata/claim/claimant[id = $id]/id) > 0">
						 <xsl:call-template 
						name="numberpostfix"><xsl:with-param name="number"> 
						<xsl:value-of 
						select="/variabledata/claim/claimant[id = $id]/number"/></xsl:with-param> 
						</xsl:call-template>Claimant </xsl:when>
					<xsl:when 
						test="string-length(/variabledata/claim/defendant[id = $id]/id) > 0">
						 <xsl:call-template 
						name="numberpostfix"><xsl:with-param name="number"> 
						<xsl:value-of 
						select="/variabledata/claim/defendant[id = $id]/number"/></xsl:with-param> 
						</xsl:call-template>Defendant </xsl:when>
					<xsl:when 
						test="string-length(/variabledata/claim/part20claimant[id = $id]/id) > 0">
						 <xsl:call-template 
						name="numberpostfix"><xsl:with-param name="number"> 
						<xsl:value-of 
						select="/variabledata/claim/part20claimant[id = $id]/number"/></xsl:with-param> 
						</xsl:call-template>Part 20 Claimant </xsl:when>
					<xsl:when 
						test="string-length(/variabledata/claim/part20defendant[id = $id]/id) > 0">
						 <xsl:call-template 
						name="numberpostfix"><xsl:with-param name="number"> 
						<xsl:value-of 
						select="/variabledata/claim/part20defendant[id = $id]/number"/></xsl:with-param> 
						</xsl:call-template>Part 20 Defendant </xsl:when>
					<xsl:when 
						test="string-length(/variabledata/claim/representative[id = $id]/id) > 0">
						<xsl:variable name="partySurrogateId">
							<xsl:value-of 
								select="/variabledata/claim/representative[id = $id]/surrogateid"/>
						</xsl:variable>
						<xsl:if 
							test="string-length(/variabledata/claim/claimant[representativeid = $partySurrogateId]/id) > 0">
							 <xsl:call-template 
							name="numberpostfix"><xsl:with-param name="number"> 
							<xsl:value-of 
							select="/variabledata/claim/claimant[representativeid = $partySurrogateId]/number"/></xsl:with-param> 
							</xsl:call-template>Claimant's solicitor </xsl:if>
						<xsl:if 
							test="string-length(/variabledata/claim/defendant[representativeid = $partySurrogateId]/id) > 0">
							 <xsl:call-template 
							name="numberpostfix"><xsl:with-param name="number"> 
							<xsl:value-of 
							select="/variabledata/claim/defendant[representativeid = $partySurrogateId]/number"/></xsl:with-param> 
							</xsl:call-template>Defendant's solicitor </xsl:if>
					</xsl:when>
				</xsl:choose>
			</xsl:variable>
			<xsl:value-of select="normalize-space($partyDescription)"/>
			<xsl:if test="(position()!=last()) and (position()!=(last()-1))">, 
				</xsl:if>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vdFailureWording"> The <xsl:value-of 
		select="$vdFailureParty"/> having failed to file <xsl:choose> <xsl:when 
		test="count(variabledata/notice/partyfailfilelq/PartyId) = 1">a 
		completed listing questionnaire</xsl:when> <xsl:otherwise>completed 
		listing questionnaires</xsl:otherwise> </xsl:choose> by the date 
		required. </xsl:variable>
	<xsl:variable name="vdInstructionsLQ">
		<xsl:if test="variabledata/notice/hrglq  = 'LQ'"> this <xsl:choose> 
			<xsl:when 
			test="variabledata/notice/struckout = 'C'">Claim</xsl:when> 
			<xsl:when 
			test="variabledata/notice/struckout = 'CC'">Counterclaim</xsl:when> 
			<xsl:when 
			test="variabledata/notice/struckout = 'D'">Defence</xsl:when> 
			<xsl:when test="variabledata/notice/struckout = 'CCC'">Claim and 
			Counterclaim</xsl:when> <xsl:when 
			test="variabledata/notice/struckout = 'CD'">Claim and 
			Defence</xsl:when> <xsl:when 
			test="variabledata/notice/struckout = 'CCD'">Counterclaim and 
			Defence</xsl:when> <xsl:when 
			test="variabledata/notice/struckout = 'CCCD'">Claim, Counterclaim 
			and Defence</xsl:when> </xsl:choose> be struck out unless all 
			completed listing questionnaires have been filed with the court on 
			or before <xsl:call-template name="format-date-placeholder"> 
			<xsl:with-param name="date-xpath"> <xsl:value-of 
			select="variabledata/notice/questionairereturndate"/>. 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdInstructionsHearing1">
		<xsl:if test="variabledata/notice/hrglq  = 'HRG'"> you attend the court 
			office at <xsl:value-of select="$vdHearingTime"/> on <xsl:value-of 
			select="$vdHearingDate"/> at <xsl:value-of 
			select="$vdHearingCourtAddress"/> to explain your default. </xsl:if>
	</xsl:variable>
	<!-- CJR072 END-->
	<!-- CJR073 BEGIN-->
	<xsl:variable name="vdWhoseEvidence">
		<xsl:value-of select="variabledata/notice/whoseevidence"/>
	</xsl:variable>
	<xsl:variable name="vdDateEvidence">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateofevidence"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstructionsSubstituted1">
		<xsl:choose>
			<xsl:when test="variabledata/notice/servtype = 'ADDR'">that the 
				delivery of a sealed copy of the <xsl:value-of 
				select="$vdInstructionsSubstitutedDocument"/> issued in this 
				claim, together with a sealed copy of this order, to an adult 
				at </xsl:when>
			<xsl:when test="variabledata/notice/servtype = 'NEWS'">that notice 
				of the <xsl:value-of 
				select="$vdInstructionsSubstitutedDocument"/> issued in this 
				action be published in the <xsl:value-of 
				select="variabledata/notice/newspaper"/> newspaper and that 
				publications of such notice </xsl:when>
			<xsl:when test="variabledata/notice/servtype = 'REC'">that the 
				posting of a sealed copy of the <xsl:value-of 
				select="$vdInstructionsSubstitutedDocument"/> issued in this 
				action, together with a sealed copy of this order, by recorded 
				delivery addressed to the defendant at </xsl:when>
			<xsl:when test="variabledata/notice/servtype = 'REG'">that the 
				posting of a sealed copy of the <xsl:value-of 
				select="$vdInstructionsSubstitutedDocument"/> issued in this 
				action, together with a sealed copy of this order, by 
				registered post addressed to the defendant at </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdServiceAddress3">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/certificateofservice/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdServiceAddressMultiLine">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of 
					select="variabledata/certificateofservice/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstructionsSubstituted3">
		<xsl:if test="variabledata/notice/servtype != 'NEWS'"> being the usual 
			or last known <xsl:choose> <xsl:when 
			test="variabledata/notice/addresstype = 'BUS'"> place of business 
			</xsl:when> <xsl:otherwise> address </xsl:otherwise> </xsl:choose> 
			of the defendant</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdInstructionsSubstitutedDocument">
		<xsl:value-of select="variabledata/notice/document"/>
	</xsl:variable>
	<xsl:variable name="vdGoodServiceWording">
		<xsl:choose>
			<xsl:when test="variabledata/notice/servtype = 'REC'"> on the day 
				when they would be delivered in the ordinary course of 
				post</xsl:when>
			<xsl:when test="variabledata/notice/servtype = 'REG'"> on the day 
				when they would be delivered in the ordinary course of 
				post</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR073 END-->
	<!-- CJR080 BEGIN-->
	<xsl:variable name="vdQuestioningRequired">
		<xsl:value-of select="variabledata/notice/questioningrequired"/>
	</xsl:variable>
	<xsl:variable name="vdWhoConsideredApplication">
		<xsl:value-of select="variabledata/notice/whoconsideredapplication"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCreditor">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="$vdInstigatorPartyRole"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">lower</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCreditorReference">
		<xsl:value-of select="$vdInstigatorReference"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCreditorName">
		<xsl:value-of select="$vdInstigatorName"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCreditorAddress">
		<xsl:value-of select="$vdInstigatorAddress"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDebtor">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="$vdSubjectPartyRole"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">lower</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDebtorName">
		<xsl:value-of select="$vdSubjectName"/>
	</xsl:variable>
	<xsl:variable name="vdN39Served">
		<xsl:value-of select="variabledata/notice/n39served"/>
	</xsl:variable>
	<xsl:variable name="vdN39ServedBy">
		<xsl:value-of select="variabledata/notice/n39servedby"/>
	</xsl:variable>
	<xsl:variable name="vdJudgmentAtThisCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/notice/judgecourtname"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentOtherCourt1">
		<xsl:choose>
			<xsl:when test="variabledata/notice/judgeofthiscourt = 'Y'">
				,</xsl:when>
			<xsl:otherwise> by <xsl:value-of select="$vdJudgmentCourtNameDescription"/> in claim 
				no. <xsl:value-of select="variabledata/notice/claimno"/>, 
				</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentOtherCourt">
		<xsl:choose>
			<xsl:when test="variabledata/notice/judgeofthiscourt = 'Y'"> by 
				<xsl:value-of select="$vdCourtNameDescriptionPrefix"/> in claim no. <xsl:value-of 
				select="$vdClaimNumber"/> </xsl:when>
			<xsl:otherwise> by <xsl:value-of select="$vdJudgmentCourtNameDescription"/> in claim 
				no. <xsl:value-of select="variabledata/notice/claimno"/>, 
				</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdWhoIs">
		<xsl:choose>
			<xsl:when test="variabledata/notice/isofficer = 'Y'">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/notice/officerfullname"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdJudgmentDebtorName"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdWhereIs">
		<xsl:choose>
			<xsl:when test="variabledata/notice/isofficer = 'Y'">
				<xsl:value-of select="$vdOfficerAddress"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdJudgmentDebtorAddress"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOfficerName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/notice/officername"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOfficerAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of select="variabledata/notice/officer/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgeAmount">
		<xsl:if test="variabledata/notice/judgtype != 'N'">pay money to the 
			judgment creditor, and that the amount now owing under the judgment 
			or order is &#163;<xsl:call-template name="correctCalculation"> 
			<xsl:with-param name="value"><xsl:value-of 
			select="$vdAmountOutstanding"/></xsl:with-param> 
			</xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdQuestioningNonMoney">
		<xsl:choose>
			<xsl:when test="variabledata/notice/judgtype = 'N'">
				<xsl:value-of 
					select="variabledata/notice/nonmoneyorderdetails"/>
			</xsl:when>
			<xsl:when test="variabledata/notice/judgtype = 'B'">and to 
				<xsl:value-of 
				select="variabledata/notice/nonmoneyorderdetails"/> </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdQuestioningName">
		<xsl:if test="variabledata/notice/persondetails = 'D'">
			<xsl:value-of select="$vdJudgmentDebtorName"/>
		</xsl:if>
		<xsl:if test="variabledata/notice/persondetails != 'D'">
			<xsl:value-of select="variabledata/notice/officername"/>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdQuestioningWhoIs"> <xsl:if 
		test="variabledata/notice/persondetails = 'D'"> <xsl:value-of 
		select="$vdJudgmentDebtorName"/> the judgment debtor </xsl:if> <xsl:if 
		test="variabledata/notice/persondetails != 'D'"> <xsl:value-of 
		select="variabledata/notice/officername"/> who is an officer of the 
		judgment debtor </xsl:if> <xsl:choose> <xsl:when 
		test="variabledata/notice/persondetails = 'COM'">company</xsl:when> 
		<xsl:when 
		test="variabledata/notice/persondetails = 'CORP'">corporation</xsl:when> 
		</xsl:choose> attend at </xsl:variable>
	<xsl:variable name="vdQuestioningWhereIs">
		<xsl:if test="variabledata/notice/persondetails = 'D'">
			<xsl:value-of select="$vdJudgmentDebtorAddress"/>
		</xsl:if>
		<xsl:if test="variabledata/notice/persondetails != 'D'">
			<xsl:value-of select="$vdOfficerAddress"/>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdQuestioningAttendenceBeforeWhom">
		<xsl:choose>
			<xsl:when test="variabledata/notice/attendby = 'J'">judge</xsl:when>
			<xsl:otherwise>court officer</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdQuestioningBeforeJudge">
		<xsl:if test="variabledata/notice/attendby = 'J'">The questioning will 
			take place before a judge.</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdQuestioning2"> The <xsl:choose> <xsl:when 
		test="variabledata/notice/persondetails = 'D'">judgment 
		debtor</xsl:when> <xsl:otherwise>officer</xsl:otherwise> </xsl:choose> 
		at that time and place produce at court all documents in the judgment 
		debtor's control <xsl:if test="variabledata/notice/judgtype != 'N'"> 
		which relate to the judgment debtor's means of paying the amount due 
		under the judgment or order and </xsl:if> which relate to those matters 
		mentioned in paragraph 1. <xsl:if 
		test="variabledata/notice/listsupplied = 'Y'"> The documents produced 
		must include those shown in the attached list. </xsl:if> </xsl:variable>
	<xsl:variable name="vdQuestioning3"> The <xsl:choose> <xsl:when 
		test="variabledata/notice/persondetails = 'D'">judgment 
		debtor</xsl:when> <xsl:otherwise>officer</xsl:otherwise> </xsl:choose> 
		at that time and place answer on oath, all the questions which the 
		court asks and which the court allows the judgment creditor to ask. 
		</xsl:variable>
	<xsl:variable name="vdJudgmentDebtorAddress">
		<xsl:value-of select="$vdSubjectAddress"/>
	</xsl:variable>
	<xsl:variable name="vdCourtFee"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/judgment/costs"/> </xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<xsl:variable name="vdApplicationFee">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/judgment/applicationfee) > 0">
				<xsl:value-of select="variabledata/judgment/applicationfee"/>
			</xsl:when>
			<xsl:otherwise>0.00</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdAmountOutstanding">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/judgment/outstandingamount) > 0">
				<xsl:value-of select="variabledata/judgment/outstandingamount"/>
			</xsl:when>
			<xsl:otherwise>0.00</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdQuestioningTotalOwing">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of 
					select="$vdApplicationFee + $vdAmountOutstanding"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CJR080 END-->
	<xsl:variable name="vdWarrantPaymentDue">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/warrant/paymentdate" />
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CJR081 BEGIN-->
	<xsl:variable name="vdWarrantNumber">
		<xsl:value-of select="variabledata/warrant/warrantnumber"/>
	</xsl:variable>
	<xsl:variable name="vdWarrantDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/warrantorderdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdQuestioningDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateofn39"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDebtorHeShe">
		<xsl:choose>
			<xsl:when test="variabledata/notice/debtorsex = 'M'">he</xsl:when>
			<xsl:when test="variabledata/notice/debtorsex = 'F'">she</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDebtorHimHer">
		<xsl:choose>
			<xsl:when test="variabledata/notice/debtorsex = 'M'">him</xsl:when>
			<xsl:when test="variabledata/notice/debtorsex = 'F'">her</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDisobedienceArrestPrisonName">
		<xsl:value-of select="variabledata/notice/wpprisonname"/>
	</xsl:variable>
	<xsl:variable name="vdDisobedienceArrestCommittalDays">
		<xsl:value-of select="variabledata/notice/wpcommitaldays"/>
	</xsl:variable>
	<xsl:variable name="vdOtherRequirement">
		<xsl:value-of select="variabledata/notice/otherreqt"/>
	</xsl:variable>
	<xsl:variable name="vdIsNewN79AsReqd">
		<xsl:value-of select="variabledata/notice/isnewN79asreqd"/>
	</xsl:variable>
	<xsl:variable name="vdQuestioningOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateofn79aorder"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdQuestioningServiceDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/servicedateofn79a"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdQuestioningContempt">
		<xsl:choose>
			<xsl:when test="variabledata/notice/n79acontempt = 'F'">failed to attend</xsl:when>
			<xsl:when test="variabledata/notice/n79acontempt = 'A'">attended but failed to comply</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOtherDetails">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/notice/otherdetails"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">lower</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CJR081 END-->
	<!-- CJR082 BEGIN-->
	<xsl:variable name="vdDebtorHisHer">
		<xsl:choose>
			<xsl:when test="variabledata/notice/debtorsex = 'M'">his</xsl:when>
			<xsl:when test="variabledata/notice/debtorsex = 'F'">her</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdArrestDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/arrestdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDisobedienceContempt">
		<xsl:choose>
			<xsl:when test="variabledata/notice/lovn79acontempt = 'DA'">did not 
				attend court</xsl:when>
			<xsl:when test="variabledata/notice/lovn79acontempt = 'RO'">refused 
				to take the oath</xsl:when>
			<xsl:when test="variabledata/notice/lovn79acontempt = 'RTAQ'">
				refused to answer the questions asked</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOtherSuspensionDetails">
		<xsl:value-of select="variabledata/notice/othersupsdetails"/>
	</xsl:variable>
	<xsl:variable name="vdQuestioningContempt2">
		<xsl:choose>
			<xsl:when test="variabledata/notice/n79acontempt2 = 'DA'">attend 
				court</xsl:when>
			<xsl:when test="variabledata/notice/n79acontempt2 = 'RO'">take the 
				oath</xsl:when>
			<xsl:when test="variabledata/notice/n79acontempt2 = 'RTAQ'">answer 
				the questions</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdQuestioningContempt2Details"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdQuestioningContempt2Details">
		<xsl:value-of select="variabledata/notice/otherlovn79acontempt"/>
	</xsl:variable>
	<!-- CJR082 END-->
	<!-- CJR083 BEGIN-->
	<xsl:variable name="vdOrderForCosts">
		<xsl:value-of select="variabledata/notice/orderforcosts"/>
	</xsl:variable>
	<xsl:variable name="vdDisobedienceServiceDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/servicedateofn39"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAffidavitServedBy">
		<xsl:value-of select="variabledata/notice/affofservby"/>
	</xsl:variable>
	<xsl:variable name="vdAffidavitServiceDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/affofservdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAffidavitExpenseBy">
		<xsl:value-of select="variabledata/notice/affofexpenseby"/>
	</xsl:variable>
	<xsl:variable name="vdAffidavitExpenseDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateaffofexpense"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCertifiedNonAttendance">
		<xsl:value-of select="variabledata/notice/certby"/>
	</xsl:variable>
	<xsl:variable name="vdCertifiedNonAttendanceJudge"> <xsl:call-template 
		name="convertcase"> <xsl:with-param name="toconvert"> <xsl:value-of 
		select="variabledata/notice/certbyjudgetitle"/> </xsl:with-param> 
		<xsl:with-param name="conversion">proper</xsl:with-param> 
		</xsl:call-template>&#xa0;<xsl:call-template name="convertcase"> 
		<xsl:with-param name="toconvert"> <xsl:value-of 
		select="variabledata/notice/certbyjudgename"/> </xsl:with-param> 
		<xsl:with-param name="conversion">proper</xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<xsl:variable name="vdNonAttendanceDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateofnotattcert"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdExpensesPaidDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateexpensespaid"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCostPaymentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/costpaymentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDisobedienceHearingDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateofhearingn39"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDisobedienceSuspendedReason">
		<xsl:choose>
			<xsl:when test="variabledata/notice/reasonforn79a = 'D'"> did not 
				attend court on <xsl:value-of 
				select="$vdDisobedienceHearingDate"/> to be questioned. 
				</xsl:when>
			<xsl:otherwise> having attended court, refused to <xsl:choose> 
				<xsl:when test="variabledata/notice/reasonforn79a = 'R'">be 
				sworn.</xsl:when> <xsl:when 
				test="variabledata/notice/reasonforn79a = 'AQ'">answer any 
				question.</xsl:when> <xsl:when 
				test="variabledata/notice/reasonforn79a = 'SQ'">answer the 
				question.</xsl:when> </xsl:choose> </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSpecificQuestionDetail">
		<xsl:value-of select="variabledata/notice/specificquesdetail"/>
	</xsl:variable>
	<xsl:variable name="vdComplianceDetails">
		<xsl:value-of select="variabledata/notice/compliancedetails"/>
	</xsl:variable>
	<xsl:variable name="vdDisobedienceSuspendedCostsAmount">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:copy-of select="variabledata/notice/amountofcosts"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDisobedienceSuspendedServedBy">
		<xsl:value-of select="variabledata/notice/n79aserved"/>
	</xsl:variable>
	<xsl:variable name="vdDisobedienceSuspendedRequired">
		<xsl:value-of select="variabledata/notice/n79arequired"/>
	</xsl:variable>
	<!-- CJR083 END-->
	<!-- CJR090 BEGIN-->
	<xsl:variable name="vdThirdPartyAmount">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:copy-of select="variabledata/notice/thirdpartyamount"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPaymentAmount">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/notice/singlepayment) > 0">
				<xsl:call-template name="correctCalculation">
					<xsl:with-param name="value">
						<xsl:copy-of 
							select="variabledata/notice/singlepayment"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="correctCalculation">
					<xsl:with-param name="value">
						<xsl:copy-of 
							select="variabledata/notice/instalmentamount"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInterimNoticeDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/intmorderdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterimOrderTotal">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:copy-of select="variabledata/notice/n84total"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHardship1">
		<xsl:choose>
			<xsl:when test="variabledata/notice/directtodebtor = 'Y'">the 
				judgment debtor</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="variabledata/notice/partyrecpayment"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHardship2">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/notice/paymentinfulldate) = 0">
				<xsl:choose>
					<xsl:when test="variabledata/notice/weekmonth = 'WK'"> the 
						<xsl:call-template name="format-week-name"> 
						<xsl:with-param name="week-string-WWW"> <xsl:value-of 
						select="variabledata/notice/dayofweek"/> 
						</xsl:with-param> </xsl:call-template> of each week 
						</xsl:when>
					<xsl:otherwise> the <xsl:call-template 
						name="numberpostfix"> <xsl:with-param name="number"> 
						<xsl:value-of select="variabledata/notice/dayofmonth"/> 
						</xsl:with-param> </xsl:call-template> day of each 
						month </xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="format-date-placeholder">
					<xsl:with-param name="date-xpath">
						<xsl:value-of 
							select="variabledata/notice/paymentinfulldate"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR090 END-->
	<!-- CJR091 BEGIN-->
	<xsl:variable name="vdSolicitorSubjectId">
		<xsl:choose>
			<xsl:when test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
				<xsl:value-of 
					select="variabledata/claim/claimant[number = $vdSubjectNumber]/representativeid"/>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
				<xsl:value-of 
					select="variabledata/claim/defendant[number = $vdSubjectNumber]/representativeid"/>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">
				<xsl:value-of 
					select="variabledata/claim/part20claimant[number = $vdSubjectNumber]/representativeid"/>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">
				<xsl:value-of 
					select="variabledata/claim/part20defendant[number = $vdSubjectNumber]/representativeid"/>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'CREDITOR'">
				<xsl:value-of 
					select="variabledata/claim/creditor[number = $vdSubjectNumber]/representativeid"/>
			</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'DEBTOR'">
				<xsl:value-of 
					select="variabledata/claim/debtor[number = $vdSubjectNumber]/representativeid"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSolicitorInstigatorId">
		<xsl:choose>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
				<xsl:value-of 
					select="variabledata/claim/claimant[number = $vdInstigatorNumber]/representativeid"/>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
				<xsl:value-of 
					select="variabledata/claim/defendant[number = $vdInstigatorNumber]/representativeid"/>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
				<xsl:value-of 
					select="variabledata/claim/part20claimant[number = $vdInstigatorNumber]/representativeid"/>
			</xsl:when>
			<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
				<xsl:value-of 
					select="variabledata/claim/part20defendant[number = $vdInstigatorNumber]/representativeid"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCreditorSolicitorName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:choose>
					<xsl:when 
						test="variabledata/claim/representative[surrogateid = $vdSolicitorInstigatorId]">
						<xsl:value-of 
							select="variabledata/claim/representative[surrogateid = $vdSolicitorInstigatorId]/name"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:choose>
							<xsl:when 
								test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
								<xsl:value-of 
									select="variabledata/claim/claimant[number = $vdInstigatorNumber]/name"/>
							</xsl:when>
							<xsl:when 
								test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
								<xsl:value-of 
									select="variabledata/claim/defendant[number = $vdInstigatorNumber]/name"/>
							</xsl:when>
							<xsl:when 
								test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
								<xsl:value-of 
									select="variabledata/claim/part20claimant[number = $vdInstigatorNumber]/name"/>
							</xsl:when>
							<xsl:when 
								test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
								<xsl:value-of 
									select="variabledata/claim/part20defendant[number = $vdInstigatorNumber]/name"/>
							</xsl:when>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCreditorSolicitorAddress">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/representative[surrogateid = $vdSolicitorInstigatorId]">
				<xsl:copy-of 
					select="variabledata/claim/representative[surrogateid = $vdSolicitorInstigatorId]/address"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
						<xsl:copy-of 
							select="variabledata/claim/claimant[number = $vdInstigatorNumber]/address"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
						<xsl:copy-of 
							select="variabledata/claim/defendant[number = $vdInstigatorNumber]/address"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
						<xsl:copy-of 
							select="variabledata/claim/part20claimant[number = $vdInstigatorNumber]/address"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
						<xsl:copy-of 
							select="variabledata/claim/part20defendant[number = $vdInstigatorNumber]/address"/>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCreditorSolicitorReference">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/representative[surrogateid = $vdSolicitorInstigatorId]">
				<xsl:choose>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $vdInstigatorNumber]/solicitorreference"/>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $vdInstigatorNumber]/reference"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdInstigatorNumber]/reference"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $vdInstigatorNumber]/reference"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $vdInstigatorNumber]/reference"/>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCreditorSolicitorTelephone">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/representative[surrogateid = $vdSolicitorInstigatorId]">
				<xsl:value-of 
					select="variabledata/claim/representative[surrogateid = $vdSolicitorInstigatorId]/telephonenumber"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'CLAIMANT'">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $vdInstigatorNumber]/telephonenumber"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'DEFENDANT'">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdInstigatorNumber]/telephonenumber"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 CLMT'">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $vdInstigatorNumber]/telephonenumber"/>
					</xsl:when>
					<xsl:when test="$vdInstigatorPartyRoleCode = 'PT 20 DEF'">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $vdInstigatorNumber]/telephonenumber"/>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDebtorHasSolicitor">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/representative[surrogateid = $vdSolicitorSubjectId]" 
				>
				<xsl:text>Y</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>N</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDebtorSolicitorName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:choose>
					<xsl:when 
						test="variabledata/claim/representative[surrogateid = $vdSolicitorSubjectId]">
						<xsl:value-of 
							select="variabledata/claim/representative[surrogateid = $vdSolicitorSubjectId]/name"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$vdSubjectName"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDebtorSolicitorAddress">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/representative[surrogateid = $vdSolicitorSubjectId]">
				<xsl:copy-of 
					select="variabledata/claim/representative[surrogateid = $vdSolicitorSubjectId]/address"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
						<xsl:copy-of 
							select="variabledata/claim/claimant[number = $vdSubjectNumber]/address"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
						<xsl:copy-of 
							select="variabledata/claim/defendant[number = $vdSubjectNumber]/address"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">
						<xsl:copy-of 
							select="variabledata/claim/part20claimant[number = $vdSubjectNumber]/address"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">
						<xsl:copy-of 
							select="variabledata/claim/part20defendant[number = $vdSubjectNumber]/address"/>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDebtorSolicitorReference">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/representative[surrogateid = $vdSolicitorSubjectId]">
				<xsl:choose>
					<xsl:when test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $vdSubjectNumber]/solicitorreference"/>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $vdSubjectNumber]/reference"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdSubjectNumber]/reference"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $vdSubjectNumber]/reference"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $vdSubjectNumber]/reference"/>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDebtorSolicitorTelephone">
		<xsl:choose>
			<xsl:when 
				test="variabledata/claim/representative[surrogateid = $vdSolicitorSubjectId]">
				<xsl:value-of 
					select="variabledata/claim/representative[surrogateid = $vdSolicitorSubjectId]/telephonenumber"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
						<xsl:value-of 
							select="variabledata/claim/claimant[number = $vdSubjectNumber]/telephonenumber"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
						<xsl:value-of 
							select="variabledata/claim/defendant[number = $vdSubjectNumber]/telephonenumber"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[number = $vdSubjectNumber]/telephonenumber"/>
					</xsl:when>
					<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[number = $vdSubjectNumber]/telephonenumber"/>
					</xsl:when>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdThirdPartyName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/thirdparty/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdThirdPartyAddress">
		<xsl:copy-of select="variabledata/thirdparty/address"/>
	</xsl:variable>
	<xsl:variable name="vdThirdPartyAddressReference">
		<xsl:value-of select="variabledata/thirdparty/reference"/>
	</xsl:variable>
	<xsl:variable name="vdThirdPartyAddressTelephone">
		<xsl:value-of select="variabledata/thirdparty/telephonenumber"/>
	</xsl:variable>
	<xsl:variable name="vdApplicationCosts">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/thirdparty/applicationcosts) > 0">
				<xsl:value-of 
					select="variabledata/thirdparty/applicationcosts"/>
			</xsl:when>
			<xsl:otherwise>0.00</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdIsBankOrBuildSoc">
		<xsl:value-of select="variabledata/thirdparty/isbankorbuildsoc"/>
	</xsl:variable>
	<xsl:variable name="vdIsBank">
		<xsl:if test="variabledata/thirdparty/bankdetails">Y</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdBranchName">
		<xsl:value-of select="variabledata/thirdparty/bankdetails/name"/>
	</xsl:variable>
	<xsl:variable name="vdBranchAddress">
		<xsl:copy-of select="variabledata/thirdparty/bankdetails/address"/>
	</xsl:variable>
	<xsl:variable name="vdBranchSortCode">
		<xsl:value-of select="variabledata/thirdparty/bankdetails/sortcode"/>
	</xsl:variable>
	<xsl:variable name="vdBranchAccountNumber">
		<xsl:value-of 
			select="variabledata/thirdparty/bankdetails/accountnumber"/>
	</xsl:variable>
	<xsl:variable name="vdTotalOwing">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of 
					select="$vdAmountOutstanding + $vdApplicationFee + $vdApplicationCosts"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CJR091 END-->
	<!-- CJR092 BEGIN-->
	<xsl:variable name="vdPayMoney">
		<xsl:choose>
			<xsl:when test="string-length(variabledata/notice/paymoney) > 0">
				<xsl:call-template name="correctCalculation">
					<xsl:with-param name="value">
						<xsl:copy-of select="variabledata/notice/paymoney"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>0.00</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPayMoneyDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/paymoneydate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CJR092 END-->
	<!-- CJR093 BEGIN-->
	<xsl:variable name="vdCourtorJudge">
		<xsl:choose>
			<xsl:when test="variabledata/notice/whoconsideredapplication = 'C'">the court officer</xsl:when>
			<xsl:when test="variabledata/notice/whoconsideredapplication = 'J' and $vdDistrictRegistry = 'F'">a judge</xsl:when>
			<xsl:when test="variabledata/notice/whoconsideredapplication = 'J' and $vdDistrictRegistry != 'F'"><xsl:value-of select="$vdJudge"/></xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFamEnfCreditor">
		<xsl:choose>
			<xsl:when test="$vdDistrictRegistry = 'F'">creditor(s)</xsl:when>
			<xsl:otherwise><xsl:value-of select="$vdJudgmentCreditor"/> ('the judgment creditor')</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFamEnfCreditor2">
		<xsl:choose>
			<xsl:when test="$vdDistrictRegistry = 'F'">creditor</xsl:when>
			<xsl:otherwise>judgment creditor</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFamEnfDebtor">
		<xsl:choose>
			<xsl:when test="$vdDistrictRegistry = 'F'">debtor</xsl:when>
			<xsl:otherwise><xsl:value-of select="$vdJudgmentDebtor"/> ('the judgment debtor')</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFamEnfDebtor2">
		<xsl:choose>
			<xsl:when test="$vdDistrictRegistry = 'F'">debtor</xsl:when>
			<xsl:otherwise>judgment debtor</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCJR093Policy">
		<xsl:choose>
			<xsl:when test="$vdDistrictRegistry = 'F'">FPR 40.6</xsl:when>
			<xsl:otherwise>CPR 73.7</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdN86TransferCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/notice/n86transfercourtname"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterimChargingOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/thirdparty/orderdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterimChargingOrderDate2">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateorder2"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterimOrderDeadlineDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/notice/interimorderdeadline"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterimCharging2">
		<xsl:if test="string-length(variabledata/notice/landregnumber) > 0"> 
			the title to which is registered at H.M. Land Registry under Title 
			No. <xsl:copy-of select="variabledata/notice/landregnumber"/> 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdIsLand">
		<xsl:value-of select="variabledata/notice/island"/>
	</xsl:variable>
	<xsl:variable name="vdIsLandAddress">
		<xsl:value-of select="variabledata/notice/islandaddress"/>
	</xsl:variable>
	<xsl:variable name="vdAssetAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of select="variabledata/notice/land/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterimCharging3">
		<xsl:value-of select="variabledata/notice/securitydetails"/>
	</xsl:variable>
	<!-- CJR093 END-->
	<!-- CJR094 BEGIN-->
	<xsl:variable name="vdCJR094JudgeText">
		<xsl:choose>
			<xsl:when test="$vdDistrictRegistry = 'F'">Judge&#xa0;<xsl:call-template name="convertcase"> 
			<xsl:with-param name="toconvert"> <xsl:value-of select="variabledata/judgment/judgename"/> </xsl:with-param> 
			<xsl:with-param name="conversion">proper</xsl:with-param> 
			</xsl:call-template></xsl:when>
			<xsl:otherwise><xsl:value-of select="$vdJudge"/></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInterimDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/interimdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterimMod">
		<xsl:if test="variabledata/notice/interimmod  = 'Y'">&#xa0;as modified 
			by this order</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdAmountCharge">
		<xsl:value-of select="variabledata/notice/amountcharge"/>
	</xsl:variable>
	<xsl:variable name="vdHoldBody">
		<xsl:choose>
			<xsl:when test="variabledata/notice/secoldlady  = 'Y'"> the Bank of 
				England </xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="variabledata/notice/secinstitution"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR094 END-->
	<!-- CJR100 BEGIN-->
	<xsl:variable name="vdBreachOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/breachorderdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdEvidenceGiven">
		<xsl:choose>
			<xsl:when test="variabledata/notice/evidencegiven = 'H'">heard 
				the</xsl:when>
			<xsl:when test="variabledata/notice/evidencegiven = 'W'">considered 
				the written</xsl:when>
			<xsl:when test="variabledata/notice/evidencegiven = 'B'">heard the 
				evidence and considered the written</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdMedicalPractitioner1">
		<xsl:value-of select="variabledata/notice/medicalpract1"/>
	</xsl:variable>
	<xsl:variable name="vdMedicalPractitioner2">
		<xsl:value-of select="variabledata/notice/medicalpract2"/>
	</xsl:variable>
	<xsl:variable name="vdDefendantDisability">
		<xsl:choose>
			<xsl:when test="variabledata/notice/deftdisability = 'MI'">mental 
				illness</xsl:when>
			<xsl:when test="variabledata/notice/deftdisability = 'SMI'">severe 
				mental impairment</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDefendantReceivedBy">
		<xsl:choose>
			<xsl:when test="variabledata/notice/individualnamed = 'N'">
				authority</xsl:when>
			<xsl:when test="variabledata/notice/individualnamed = 'Y'">
				person</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDefendantAddress">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/maindefendantid) > 0">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/defendant[id=variabledata/claim/maindefendantid]/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/claim/defendant/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdGuardianship1">
		<xsl:if test="string-length(variabledata/notice/nameofindividual) > 0"> 
			<xsl:copy-of select="variabledata/notice/nameofindividual"/> being 
			a person approved by </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdCouncilName">
		<xsl:value-of select="variabledata/notice/councilname"/>
	</xsl:variable>
	<xsl:variable name="vdGuardianshipSection">
		<xsl:choose>
			<xsl:when test="variabledata/notice/section = '153A'"> 153A (3) and 
				(4) </xsl:when>
			<xsl:when test="variabledata/notice/section = '153B'"> 153B (1) 
				</xsl:when>
			<xsl:when test="variabledata/notice/section = '153D'"> 153D 
				</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR100 END-->
	<!-- CJR101 BEGIN-->
	<xsl:variable name="vdSectionNumber">
		<xsl:choose>
			<xsl:when test="variabledata/notice/interimorder = 'N'">
				37</xsl:when>
			<xsl:when test="variabledata/notice/interimorder = 'Y'">
				38</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInterimOrder1">
		<xsl:choose>
			<xsl:when test="variabledata/notice/interimorder = 'Y'">Interim 
				h</xsl:when>
			<xsl:otherwise>H</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHospitalName">
		<xsl:value-of select="variabledata/notice/hospital/name"/>
	</xsl:variable>
	<xsl:variable name="vdHospitalAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of select="variabledata/notice/hospital/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHospitalOrderDetentionPeriod">
		<xsl:if test="string-length(variabledata/notice/detentionperiod) > 0"> 
			for a period of <xsl:call-template name="minutehourday"> 
			<xsl:with-param name="units"> <xsl:value-of 
			select="variabledata/notice/detentionperiodunits"/> 
			</xsl:with-param> <xsl:with-param name="quantity"> <xsl:value-of 
			select="variabledata/notice/detentionperiod"/> </xsl:with-param> 
			</xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdConveyerName">
		<xsl:value-of select="variabledata/notice/conveyorname"/>
	</xsl:variable>
	<xsl:variable name="vdHospitalOrder1">
		<xsl:if test="variabledata/notice/posidentified = 'Y'"> and, pending 
			admission to that hospital within seven days, the defendant shall 
			be detained at a place of safety, namely <xsl:value-of 
			select="variabledata/notice/placeofsafety/name"/>, 
			<xsl:call-template name="format-address-single-line"> 
			<xsl:with-param name="theAddress"> <xsl:copy-of 
			select="variabledata/notice/placeofsafety/address"/> 
			</xsl:with-param> </xsl:call-template> and conveyed there by 
			<xsl:value-of 
			select="variabledata/notice/placeofsafety/conveyor"/>. </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdInterimOrder2">
		<xsl:choose>
			<xsl:when test="variabledata/notice/interimorder = 'Y'">an Interim 
				h</xsl:when>
			<xsl:otherwise>a H</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR101 END-->
	<!-- CJR102 BEGIN-->
	<xsl:variable name="vdInjunctionDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/injunctdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWarrantArrestScheduledAttached">
		<xsl:choose>
			<xsl:when test="variabledata/notice/schedattach = 'N'">
				below:</xsl:when>
			<xsl:otherwise>in the schedule also attached to this 
				warrant.</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdBreachDetails">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/notice/breachdetails"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWarrantArrestDetails">
		<xsl:if test="variabledata/notice/bringnow != 'Y'">and that upon being 
			arrested the defendant be brought before a judge within the period 
			of 24 hours beginning at the time of the arrest (but in reckoning 
			that period no account shall be taken of Christmas Day, Good Friday 
			or any Sunday)</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdWarrantArrestBringNow">
		<xsl:choose>
			<xsl:when test="variabledata/notice/bringnow != 'Y'">
				accordingly.</xsl:when>
			<xsl:otherwise>immediately.</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR102 END-->
	<!-- CJR103 BEGIN-->
	<xsl:variable name="vdScheduleAttached">
		<xsl:value-of select="variabledata/notice/schedattach"/>
	</xsl:variable>
	<xsl:variable name="vdBreachAttached">
		<xsl:choose>
			<xsl:when test="variabledata/notice/schedattach = 'Y'">in the 
				schedule attached.</xsl:when>
			<xsl:otherwise> below:</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdBailConditions">
		<xsl:if test="variabledata/notice/bailconditions != 'N'"> on the 
			conditions set out below </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdRecognizanceSum">
		<xsl:if test="string-length(variabledata/notice/recognizancesum) > 0"> 
			on entering into a recognizance in the sum of 
			&#163;<xsl:call-template name="correctCalculation"> <xsl:with-param 
			name="value"> <xsl:copy-of 
			select="variabledata/notice/recognizancesum"/> </xsl:with-param> 
			</xsl:call-template> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSureties">
		<xsl:if 
			test="string-length(variabledata/notice/suretysum1) > 0 or string-length(variabledata/notice/suretysum2) > 0">
			 <xsl:if 
			test="string-length(variabledata/notice/recognizancesum) > 0">and 
			</xsl:if> on providing <xsl:choose> <xsl:when 
			test="string-length(variabledata/notice/suretysum1) > 0 and string-length(variabledata/notice/suretysum2) > 0"> 
			sureties in the sum of &#163;<xsl:call-template 
			name="correctCalculation"> <xsl:with-param name="value"> 
			<xsl:copy-of select="variabledata/notice/suretysum1"/> 
			</xsl:with-param> </xsl:call-template> and &#163;<xsl:call-template 
			name="correctCalculation"> <xsl:with-param name="value"> 
			<xsl:copy-of select="variabledata/notice/suretysum2"/> 
			</xsl:with-param> </xsl:call-template> </xsl:when> <xsl:when 
			test="string-length(variabledata/notice/suretysum1) > 0 and string-length(variabledata/notice/suretysum2) = 0"> 
			a surety in the sum of &#163;<xsl:call-template 
			name="correctCalculation"> <xsl:with-param name="value"> 
			<xsl:copy-of select="variabledata/notice/suretysum1"/> 
			</xsl:with-param> </xsl:call-template> </xsl:when> <xsl:when 
			test="string-length(variabledata/notice/suretysum1) = 0 and string-length(variabledata/notice/suretysum2) > 0"> 
			a surety in the sum of &#163;<xsl:call-template 
			name="correctCalculation"> <xsl:with-param name="value"> 
			<xsl:copy-of select="variabledata/notice/suretysum2"/> 
			</xsl:with-param> </xsl:call-template> </xsl:when> </xsl:choose> 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdBailConditions1">
		<xsl:if test="variabledata/notice/furtherbailconds != 'N'"> <xsl:if 
			test="string-length(variabledata/notice/suretysum1) > 0 or string-length(variabledata/notice/suretysum2) > 0 or string-length(variabledata/notice/recognizancesum) > 0"> 
			and </xsl:if> subject to the following condition<xsl:choose> 
			<xsl:when 
			test="string-length(variabledata/notice/otherconditions) = 0">:</xsl:when> 
			<xsl:otherwise>s:</xsl:otherwise> </xsl:choose> </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdBailConditions2">
		<xsl:if 
			test="variabledata/notice/furtherbailconds != 'N' and variabledata/notice/medicalexam != 'N'">
			 that a medical examination and report be made on the defendant 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdBailConditions3">
		<xsl:if test="variabledata/notice/furtherbailconds != 'N'">
			<xsl:copy-of select="variabledata/notice/otherconditions"/>
		</xsl:if>
	</xsl:variable>
	<!-- CJR103 END-->
	<!-- CJR104 BEGIN-->
	<xsl:variable name="vdHousing1">
		<xsl:if test="variabledata/notice/medicalevidgiven != 'N'"> and 
			<xsl:choose> <xsl:when 
			test="variabledata/notice/evidencegivenhousing = 'O'">heard the 
			oral</xsl:when> <xsl:when 
			test="variabledata/notice/evidencegivenhousing = 'W'">considered 
			the written</xsl:when> <xsl:when 
			test="variabledata/notice/evidencegivenhousing = 'B'">heard the 
			oral and considered the written</xsl:when> </xsl:choose> evidence 
			of a medical practitioner <xsl:copy-of 
			select="variabledata/notice/medicalpract1housing"/> as required by 
			the provisions of section 35 of the Mental Health Act 1983 that the 
			defendant is suffering from <xsl:copy-of 
			select="$vdDefendantDisability"/> within the meaning of that Act 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdHousing2">
		<xsl:if test="variabledata/notice/remandorder = 'R'"> in custody to 
			<xsl:copy-of select="$vdDisobedienceArrestPrisonName"/> until the 
			next hearing </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdHousing3">
		<xsl:if test="variabledata/notice/remandorder = 'D'"> admitted to and 
			detained in <xsl:value-of select="$vdHospitalName"/> and conveyed 
			there by <xsl:value-of select="$vdConveyerName"/> to enable a 
			medical examination and report to be made under section 35 of the 
			Mental Health Act 1983 </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdHospitalOrder2">
		<xsl:if test="variabledata/notice/posidentified = 'Y'"> and, pending 
			admission to that hospital within seven days, the defendant shall 
			be detained at a place of safety, namely <xsl:value-of 
			select="variabledata/notice/placeofsafety/name"/>, 
			<xsl:call-template name="format-address-single-line"> 
			<xsl:with-param name="theAddress"> <xsl:copy-of 
			select="variabledata/notice/placeofsafety/address"/> 
			</xsl:with-param> </xsl:call-template> and conveyed there by 
			<xsl:value-of select="variabledata/notice/conveyerhousing"/> 
			</xsl:if>
	</xsl:variable>
	<!-- CJR104 END-->
	<!-- CJR105 BEGIN-->
	<xsl:variable name="vdInjunctionDisplayOrderID">
		<xsl:copy-of select="variabledata/notice/orderid"/>
	</xsl:variable>
	<xsl:variable name="vdInjunctionOrderDetails">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/notice/orderdetails"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHasFurtherHearing">
		<xsl:copy-of select="variabledata/notice/hasfurtherhearing"/>
	</xsl:variable>
	<xsl:variable name="vdInjunctionDateConsidered">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateconsidered"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInjunctionLimitedCompanyClause">
		<xsl:choose>
			<xsl:when test="variabledata/notice/ltdcomp = 'Y'">whether by its 
				servants, agents, officers or otherwise</xsl:when>
			<xsl:otherwise>whether by himself or by instructing or encouraging 
				any other person</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInjunctionForceDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/forcedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInjunctionForceTime">
		<xsl:copy-of select="variabledata/notice/forcetime"/>
	</xsl:variable>
	<xsl:variable name="vdInjunctionActsDetails">
		<xsl:copy-of select="variabledata/notice/detailsofacts"/>
	</xsl:variable>
	<xsl:variable name="vdInjunctionActsDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/dateofacts"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInjunctionFurtherTerms">
		<xsl:copy-of select="variabledata/notice/furtherterms"/>
	</xsl:variable>
	<xsl:variable name="vdInjunctionOrder">
		<xsl:copy-of select="variabledata/notice/orderonnotice"/>
	</xsl:variable>
	<xsl:variable name="vdInjunctionPOA">
		<xsl:copy-of select="variabledata/notice/poa105"/>
	</xsl:variable>
	<xsl:variable name="vdInjunctionViolenceHarm">
		<xsl:choose>
			<xsl:when test="variabledata/notice/violenceharm = 'V'">the conduct 
				which is prohibited by this injunction, consists of or includes 
				the use or threatened use of violence</xsl:when>
			<xsl:when test="variabledata/notice/violenceharm = 'H'">there is a 
				significant risk of harm to a person towards whom the conduct 
				prohibited by this injunction is directed</xsl:when>
			<xsl:when test="variabledata/notice/violenceharm = 'B'">the conduct 
				which is prohibited by this injunction, consists of or includes 
				the use or threatened use of violence and there is a 
				significant risk of harm to a person towards whom the conduct 
				prohibited by this injunction is directed</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInjunctionPOADetails">
		<xsl:copy-of select="variabledata/notice/poaparas"/>
	</xsl:variable>
	<!-- CJR105 END-->
	<!-- CJR170 BEGIN-->
	<xsl:variable name="vdDeponentName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/order/deponent/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">upper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDeponentAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of select="variabledata/order/deponent/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDeponentClaimantDefendant">
		<xsl:variable name="typeId">
			<xsl:value-of select="variabledata/order/deponent/type"/>
		</xsl:variable>
		<xsl:variable name="typeName">
			<xsl:if test="variabledata/claim/claimant[id=$typeId]">CLAIMANT</xsl:if>
			<xsl:if test="variabledata/claim/defendant[id=$typeId]">DEFENDANT</xsl:if>
			<xsl:if test="variabledata/claim/part20claimant[id=$typeId]">PT 20 CLM</xsl:if>
			<xsl:if test="variabledata/claim/part20defendant[id=$typeId]">PT 20 DEF</xsl:if>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$typeName = 'CLAIMANT'">
				<xsl:text>claimant</xsl:text>
			</xsl:when>
			<xsl:when test="$typeName = 'DEFENDANT'">
				<xsl:text>defendant</xsl:text>
			</xsl:when>
			<xsl:when test="$typeName = 'PT 20 CLM'">
				<xsl:text>Part 20 claimant</xsl:text>
			</xsl:when>
			<xsl:when test="$typeName = 'PT 20 DEF'">
				<xsl:text>Part 20 defendant</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!--and to produce the following document(s):  now in template -->
	<xsl:variable name="vdDocuments">
		<xsl:if test="string-length($vdDocumentToProduce) > 0">
			<xsl:copy-of select="$vdDocumentToProduce"/>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdDeponentExpensesWording">
		<xsl:choose>
			<xsl:when test="variabledata/order/deponent/offer = 'OFF'"> Sum to 
				be offered or handed to deponent &#163;<xsl:value-of 
				select="variabledata/order/deponent/amount"/> for travelling 
				expenses to and from the place of examination and compensation 
				for loss of time. </xsl:when>
			<xsl:when test="variabledata/order/deponent/offer = 'ATT'"> 
				&#163;<xsl:value-of 
				select="variabledata/order/deponent/amount"/> to cover your 
				travelling expenses to and from the place of examination and 
				compensation for your loss of time is attached. </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR170 END-->
	<!-- CJR177 BEGIN-->
	<xsl:variable name="vdApplicationDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/order/settlement/applicationdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPartyApplying">
		<xsl:choose>
			<xsl:when test="variabledata/order/settlement/party = 'CSL'"> 
				counsel </xsl:when>
			<xsl:when test="variabledata/order/settlement/party = 'SOLS'"> 
				solicitors </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDefendantRepresentedBy">
		<xsl:choose>
			<xsl:when test="variabledata/order/settlement/isrepresented = 'Y'">
				<xsl:choose>
					<xsl:when 
						test="variabledata/order/settlement/attendedfor = 'CSL'">
						 counsel </xsl:when>
					<xsl:when 
						test="variabledata/order/settlement/attendedfor = 'SOLS'">
						 solicitors </xsl:when>
					<xsl:otherwise/>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSatisfactionAmount">
		<xsl:choose>
			<xsl:when test="variabledata/order/settlement/satisfaction = 'Y'">
				<xsl:value-of select="variabledata/order/settlement/amonut"/>
			</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOrderSubject">
		<xsl:value-of select="variabledata/order/settlement/subject"/>
	</xsl:variable>
	<xsl:variable name="vdApportioned">
		<xsl:value-of select="variabledata/order/settlement/apportionsum"/>
	</xsl:variable>
	<xsl:variable name="vdSumAmount">
		<xsl:value-of select="variabledata/order/settlement/apportion"/>
	</xsl:variable>
	<xsl:variable name="vdAct">
		<xsl:value-of select="variabledata/order/settlement/act"/>
	</xsl:variable>
	<xsl:variable name="vdLawReformAmount">
		<xsl:value-of select="variabledata/order/settlement/lawreform"/>
	</xsl:variable>
	<xsl:variable name="vdFatalAccidentPayee">
		<xsl:value-of select="variabledata/order/settlement/accidentpayee"/>
	</xsl:variable>
	<xsl:variable name="vdClaimantClaimAmount">
		<xsl:value-of select="variabledata/order/settlement/claimamount"/>
	</xsl:variable>
	<xsl:variable name="vdChildDependantAmount">
		<xsl:value-of select="variabledata/order/settlement/dependantamount"/>
	</xsl:variable>
	<xsl:variable name="vdChildNames">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/order/settlement/childnames"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDefendantPayDirect">
		<xsl:choose>
			<xsl:when test="variabledata/order/settlement/paydirect = 'Y'"> The 
				defendant pay the sum of &#163;<xsl:value-of 
				select="variabledata/order/settlement/paydirectamount"/> to the 
				<xsl:choose> <xsl:when 
				test="variabledata/order/settlement/paiddirectto = 'CLM'"> 
				<xsl:text>claimant</xsl:text> </xsl:when> <xsl:when 
				test="variabledata/order/settlement/paiddirectto = 'SOLS'"> 
				<xsl:text>claimant's solicitors</xsl:text> </xsl:when> 
				<xsl:when 
				test="variabledata/order/settlement/paiddirectto = 'LIT'"> 
				<xsl:text>claimant's litigation friend</xsl:text> </xsl:when> 
				</xsl:choose> on or before <xsl:call-template 
				name="format-date-placeholder"> <xsl:with-param 
				name="date-xpath"> <xsl:value-of 
				select="variabledata/order/settlement/paiddirectdate"/> 
				</xsl:with-param> </xsl:call-template> </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDefendantInvest">
		<xsl:choose>
			<xsl:when test="variabledata/order/settlement/investsum = 'F'"> 
				further sum of &#163;<xsl:value-of 
				select="variabledata/order/settlement/investsumamount"/> into 
				the Court Funds Office </xsl:when>
			<xsl:when test="variabledata/order/settlement/investsum = 'S'"> sum 
				of &#163;<xsl:value-of 
				select="variabledata/order/settlement/investsumamount"/> into 
				the Court Funds Office </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPayDate2">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/order/settlement/investdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFirstCharge1">
		<xsl:value-of select="variabledata/order/settlement/firstcharge"/>
	</xsl:variable>
	<xsl:variable name="vdChildHeShe">
		<xsl:choose>
			<xsl:when test="variabledata/order/settlement/childgender = 'M'"> 
				he </xsl:when>
			<xsl:otherwise> she </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdApplicationReceiver">
		<xsl:choose>
			<xsl:when 
				test="variabledata/order/settlement/receiverapplication= 'Y'"> 
				The claimant's solicitor to apply to the Court of Protection 
				for the appointment of a receiver on or before 
				<xsl:call-template name="format-date-placeholder"> 
				<xsl:with-param name="date-xpath"> <xsl:value-of 
				select="variabledata/order/settlement/receiverapplicationdate"/> 
				</xsl:with-param> </xsl:call-template> and upon such 
				appointment being made the sum of &#163;<xsl:value-of 
				select="variabledata/order/settlement/receiverapplicationamount"/> 
				<xsl:choose> <xsl:when 
				test="variabledata/order/settlement/receiverapplicationfirstdirect = 'Y'"> 
				subject to a first charge under section 16(6) of the Legal Aid 
				Act 1998 </xsl:when> <xsl:otherwise/> </xsl:choose> together 
				with any interest accrued on that sum from the date of this 
				order to be carried over to the Court of Protection to the 
				credit of the claimant there to be dealt with as the Court of 
				Protection thinks fit. </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdInterest">
		<xsl:value-of select="variabledata/order/settlement/interest"/>
	</xsl:variable>
	<xsl:variable name="vdRightsWording">
		<xsl:value-of select="variabledata/order/settlement/rights"/>
	</xsl:variable>
	<xsl:variable name="vdClaimantCosts">
		<xsl:value-of select="variabledata/order/settlement/claimantcosts"/>
	</xsl:variable>
	<xsl:variable name="vdMultipleClaims">
		<xsl:value-of select="variabledata/order/settlement/ismultiple"/>
	</xsl:variable>
	<xsl:variable name="vdPaidMajority">
		<xsl:value-of select="variabledata/order/settlement/ispaidmajority"/>
	</xsl:variable>
	<!-- CJR177 END-->
	<!-- CJR178 BEGIN-->
	<xsl:variable name="vdWitnessFailure">
		<xsl:choose>
			<xsl:when test="variabledata/order/fine/witnessdid = 'ATT'"> your 
				failure to attend as a witness summoned to attend this court 
				</xsl:when>
			<xsl:when test="variabledata/order/fine/witnessdid = 'PD'"> your 
				failure to produce documents </xsl:when>
			<xsl:when test="variabledata/order/fine/witnessdid = 'SE'"> your 
				refusal to be sworn or give evidence </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdWitnessInstructions">
		<xsl:choose>
			<xsl:when test="variabledata/order/fine/witnessto = 'WS'"> set out 
				your reasons in a witness statement </xsl:when>
			<xsl:otherwise> attend the hearing on <xsl:value-of 
				select="$vdHearingDate1"/> at <xsl:value-of 
				select="$vdHearingTime"/> at <xsl:value-of 
				select="$vdHearingCourtNameDescription"/>, <xsl:value-of 
				select="$vdHearingCourtAddress"/> </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdWitnessInstructions2">
		<xsl:choose>
			<xsl:when test="variabledata/order/fine/witnessto = 'WS'"/>
			<xsl:otherwise>to give your reasons orally to the 
				court</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR178 END-->
	<!-- CJR184 BEGIN-->
	<xsl:variable name="vdFeeFor">
		<xsl:choose>
			<xsl:when 
				test="variabledata/notice/fee/for='AQ' or variabledata/notice/fee/for='LQ' or variabledata/notice/fee/for='DQ'">
				 On the <xsl:value-of 
				select="normalize-space($vdFeeFileDate)"/> the court received 
				your <xsl:choose> <xsl:when 
				test="variabledata/notice/fee/for='AQ'"> <xsl:text>allocation 
				</xsl:text> </xsl:when> <xsl:when 
				test="variabledata/notice/fee/for='DQ'"> <xsl:text>directions 
				</xsl:text> </xsl:when><xsl:otherwise> <xsl:text>listing 
				</xsl:text> </xsl:otherwise> </xsl:choose> questionnaire. 
				Either a fee of &#163;<xsl:value-of 
				select="variabledata/notice/fee/unpaidamount"/> or an 
				application for a fee remission should have 
				accompanied the questionnaire. Neither was enclosed. </xsl:when>
			<xsl:otherwise> Your <xsl:choose> <xsl:when 
				test="variabledata/notice/fee/for='ACC' or variabledata/notice/fee/for='LCC' or variabledata/notice/fee/for='HCC'">
				counterclaim</xsl:when><xsl:otherwise>claim</xsl:otherwise></xsl:choose> was 
				<xsl:choose> <xsl:when 
				test="variabledata/notice/fee/for='ACC' or variabledata/notice/fee/for='AC'"> 
				allocated to the <xsl:choose> <xsl:when 
				test="variabledata/notice/fee/allocatedto='FT'"> fast track 
				</xsl:when> <xsl:otherwise> multi-track </xsl:otherwise> 
				</xsl:choose> </xsl:when> <xsl:otherwise> listed for trial 
				</xsl:otherwise> </xsl:choose> on <xsl:value-of 
				select="normalize-space($vdFeeListedDate)"/>. A fee of 
				&#163;<xsl:value-of 
				select="variabledata/notice/fee/unpaidamount"/> was payable 
				unless you had made an application for a fee remission. Neither have been received. 
				</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFeePayDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/fee/paydate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFeeListedDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/fee/listeddate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFeeFileDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/fee/filedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPartyIncurringCosts">
		<xsl:choose>
			<xsl:when test="$vdFeeClaimCounterClaim = ' claim '"> defendant </xsl:when>
			<xsl:otherwise> claimant </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFeeClaimCounterClaim">
		<xsl:choose>
			<xsl:when 
				test="variabledata/notice/fee/for='ACC' or variabledata/notice/fee/for='LCC' or variabledata/notice/fee/for='HCC'">
				 counterclaim </xsl:when>
			<xsl:otherwise> claim </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR184 END-->
	<!-- CJR186 BEGIN-->
	<xsl:variable name="vdSelectedPart20ClaimantName">
		<xsl:variable name="partyid">
			<xsl:value-of select="variabledata/order/part20/claimant"/>
		</xsl:variable>
		<xsl:variable name="partyid2">
			<xsl:value-of 
				select="variabledata/claim/representative[id=$partyid]/surrogateid"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/representative[id=$partyid]/name) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[representativeid=$partyid2]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/part20claimant[id=$partyid]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSelectedPart20ClaimantReference">
		<xsl:variable name="partyid">
			<xsl:value-of select="variabledata/order/part20/claimant"/>
		</xsl:variable>
		<xsl:variable name="partyid2">
			<xsl:value-of 
				select="variabledata/claim/representative[id=$partyid]/surrogateid"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/part20claimant[id=$partyid]/solicitorreference) > 0">
				<xsl:value-of 
					select="variabledata/claim/part20claimant[id=$partyid]/solicitorreference"/>
			</xsl:when>
			<xsl:when 
				test="string-length(variabledata/claim/representative[id=$partyid]/name) > 0">
				<xsl:value-of 
					select="variabledata/claim/part20claimant[representativeid=$partyid2]/solicitorreference"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of 
					select="variabledata/claim/part20claimant[id=$partyid]/reference"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSelectedPart20DefendantName">
		<xsl:variable name="partyid">
			<xsl:value-of select="variabledata/order/part20/defendant"/>
		</xsl:variable>
		<xsl:variable name="partyid2">
			<xsl:value-of 
				select="variabledata/claim/representative[id=$partyid]/surrogateid"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/representative[id=$partyid]/name) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[representativeid=$partyid2]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="variabledata/claim/part20defendant[id=$partyid]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSelectedPart20DefendantReference">
		<xsl:variable name="partyid">
			<xsl:value-of select="variabledata/order/part20/defendant"/>
		</xsl:variable>
		<xsl:variable name="partyid2">
			<xsl:value-of 
				select="variabledata/claim/representative[id=$partyid]/surrogateid"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/part20defendant[id=$partyid]/solicitorreference) > 0">
				<xsl:value-of 
					select="variabledata/claim/part20defendant[id=$partyid]/solicitorreference"/>
			</xsl:when>
			<xsl:when 
				test="string-length(variabledata/claim/representative[id=$partyid]/name) > 0">
				<xsl:value-of 
					select="variabledata/claim/part20defendant[representativeid=$partyid2]/solicitorreference"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of 
					select="variabledata/claim/part20defendant[id=$partyid]/reference"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPart20IssueFee">
		<xsl:value-of select="variabledata/order/part20/fee"/>
	</xsl:variable>
	<xsl:variable name="vdFormsIncluded">
		<xsl:value-of select="variabledata/order/part20/formsincluded"/>
	</xsl:variable>
	<!-- CJR186 END-->
	<!-- CJR186A BEGIN-->
	<!-- CJR186A END-->
	<!-- CJR199 BEGIN-->
	<xsl:variable name="vdClaimantOralBy">
		<xsl:value-of select="variabledata/order/claimantoralevidenceby"/>
	</xsl:variable>
	<xsl:variable name="vdClaimantWrittenBy">
		<xsl:value-of select="variabledata/order/defendantoralevidenceby"/>
	</xsl:variable>
	<xsl:variable name="vdDefendantOralBy">
		<xsl:value-of select="variabledata/order/claimantwrittenevidenceby"/>
	</xsl:variable>
	<xsl:variable name="vdDefendantWrittenBy">
		<xsl:value-of select="variabledata/order/defendantwrittenevidenceby"/>
	</xsl:variable>
	<xsl:variable name="vdTimetableAgreed">
		<xsl:value-of select="variabledata/order/timetableagreed"/>
	</xsl:variable>
	<!-- CJR199 END-->
	<!-- CJR201 BEGIN-->
	<xsl:variable name="vdOriginalOrderDate">
		<xsl:if test="string-length(variabledata/order/originalorderdate) > 0">
			<xsl:call-template name="format-date-placeholder">
				<xsl:with-param name="date-xpath">
					<xsl:value-of 
						select="variabledata/order/originalorderdate"/>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdCFOTelephone">
		<xsl:value-of select="variabledata/order/cfotelephonenumber"/>
	</xsl:variable>
	<!-- CJR201 END-->
	<!-- CJR202 BEGIN-->
	<xsl:variable name="vdInvestmentCourtDivision">
		<xsl:choose>
			<!-- If the district registry type for the court in which claims of the case's type are heard is 'Q' -->
			<xsl:when test="$vdDistrictRegistry = 'Q'">
				<!-- Use Queen's Bench -->
				<fo:block text-align="left">In the High Court of Justice 
					Queen's Bench Division</fo:block>
			</xsl:when>
			<!-- If the district registry type for the court in which claims of the case's type are heard is 'C' -->
			<xsl:when test="$vdDistrictRegistry = 'C'">
				<!-- Use Chancery -->
				<fo:block text-align="left">In the High Court of Justice 
					Chancery Division</fo:block>
			</xsl:when>
			<!-- If the district registry type for the court in which claims of the case's type are heard is not 'Q' or 'C' then leave blank -->
			<xsl:otherwise>
				<fo:block text-align="left">In the</fo:block>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdLitigationFriendName">
		<xsl:value-of select="variabledata/order/litigationfriend/name"/>
	</xsl:variable>
	<xsl:variable name="vdLitigationFriendAddress">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of select="variabledata/order/litigationfriend/*"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSolicitorName">
		<xsl:variable name="partyId">
			<xsl:value-of select="variabledata/order/litigationfriend/partyid"/>
		</xsl:variable>
		<xsl:variable name="representativeId">
			<xsl:value-of 
				select="variabledata/claim/*[id = $partyId]/representativeid"/>
		</xsl:variable>
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/claim/representative[surrogateid = $representativeId]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSolicitorReference">
		<xsl:variable name="partyId">
			<xsl:value-of select="variabledata/order/litigationfriend/partyid"/>
		</xsl:variable>
		<xsl:value-of 
			select="variabledata/claim/*[id = $partyId]/solicitorreference"/>
	</xsl:variable>
	<xsl:variable name="vdBeneficiaryName">
		<xsl:value-of select="variabledata/order/beneficiary/name"/>
	</xsl:variable>
	<xsl:variable name="vdBeneficiaryAddress">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of select="variabledata/order/beneficiary/*"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdBeneficiaryBirthDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/order/beneficiary/dateofbirth"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCFOFundsHeld">
		<xsl:value-of select="variabledata/order/courtfunds"/>
	</xsl:variable>
	<xsl:variable name="vdCFOFundsInvestment">
		<xsl:value-of select="variabledata/order/totalinvestmentamount"/>
	</xsl:variable>
	<xsl:variable name="vdCFOFundNo">
		<xsl:value-of select="variabledata/order/cfofundnumber"/>
	</xsl:variable>
	<xsl:variable name="vdCFOAccountNo">
		<xsl:value-of select="variabledata/order/cfoaccountnumber"/>
	</xsl:variable>
	<xsl:variable name="vdIsN243BRequired">
		<xsl:value-of select="variabledata/order/isn243brequired"/>
	</xsl:variable>
	<xsl:variable name="vdN243BAdressee">
		<xsl:variable name="representativeId">
			<xsl:value-of 
				select="variabledata/order/litigationfriend/representativeid"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length($representativeId) > 0">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/claim/representative[surrogateid = $representativeId]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of 
							select="variabledata/order/litigationfriend/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CJR202 END-->
	<!-- CJR351 BEGIN-->
	<xsl:variable name="vdGoodsAgreementWas">
		<xsl:choose>
			<xsl:when test="variabledata/judgment/goodsagreemantwas = 'HP'">
				hire purchase</xsl:when>
			<xsl:when test="variabledata/judgment/goodsagreemantwas = 'RCS'">
				regulated conditional sale</xsl:when>
			<xsl:when test="variabledata/judgment/goodsagreemantwas = 'RHP'">
				regulated hire purchase</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdGoodsCostsAre">
		<xsl:value-of select="variabledata/judgment/goodscostsare"/>
	</xsl:variable>
	<xsl:variable name="vdGoodsCostAmount">
		<xsl:value-of select="variabledata/judgment/goodscostamount"/>
	</xsl:variable>
	<xsl:variable name="vdGoodsCostToBePaid">
		<xsl:value-of select="variabledata/judgment/goodscosttobepaid"/>
	</xsl:variable>
	<xsl:variable name="vdGoodsPaymentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/judgment/goodspaymentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdGoodsMonthlyInstalment">
		<xsl:value-of select="variabledata/judgment/goodsmonthlyinstalment"/>
	</xsl:variable>
	<xsl:variable name="vdGoodsFirstPaymentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/judgment/goodsfirstpaymentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CJR351 END-->
	<!-- CJR352 BEGIN-->
	<xsl:variable name="vdChangedCondition">
		<xsl:value-of 
			select="variabledata/judgment/variations/changedcondition"/>
	</xsl:variable>
	<xsl:variable name="vdFurtherModifications">
		<xsl:value-of 
			select="variabledata/judgment/variations/furthermodifications"/>
	</xsl:variable>
	<!-- CJR352 END-->
	<!--  Release 3 Variables END -->
	<!--  Release 5 Variables BEGIN -->
	<!-- CO02 BEGIN-->
	<xsl:variable name="vdCONumber">
		<xsl:value-of select="variabledata/order/coorder/conumber"/>
	</xsl:variable>
	<xsl:variable name="vdCODebtorName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/order/coorder/debtorname"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCODebtorAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/order/coorder/debtor/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCODebtorReference">
		<xsl:value-of select="variabledata/order/coorder/debtor/reference"/>
	</xsl:variable>
	<xsl:variable name="vdCOCreditorName">
		<!--		
		<xsl:variable name="numberOfCOCreditors">
			<xsl:value-of select="count(variabledata/order/coorder/debts/debt/creditor)"/>
		</xsl:variable>
-->
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/order/coorder/debts/debt/creditor/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
		<!--		
		<xsl:choose>
			<xsl:when test="$numberOfCOCreditors = 2">
				<fo:inline font-size="8pt"> and 1 other</fo:inline>
			</xsl:when>
			<xsl:when test="$numberOfCOCreditors > 2">
				<fo:inline font-size="8pt"> and <xsl:value-of select="$numberOfCOCreditors - 1"/> others</fo:inline>
			</xsl:when>
		</xsl:choose>
-->
	</xsl:variable>
	<xsl:variable name="vdCOCreditorReference">
		<!-- If there is a payee present then use the first payee's reference -->
		<xsl:if 
			test="string-length(variabledata/order/coorder/debts/debt/payee/name) > 0">
			<fo:table-cell border-style="solid" border-width="0.02cm" 
				padding-left="0.2cm">
				<fo:block>
					<xsl:value-of 
						select="variabledata/order/coorder/debts/debt/payeereference"/>
				</fo:block>
			</fo:table-cell>
		</xsl:if>
		<!-- If there is no payee present then use the first creditor's reference -->
		<xsl:if 
			test="string-length(variabledata/order/coorder/debts/debt/payee/name) = 0">
			<fo:table-cell border-style="solid" border-width="0.02cm" 
				padding-left="0.2cm">
				<fo:block>
					<xsl:value-of 
						select="variabledata/order/coorder/debts/debt/creditorreference"/>
				</fo:block>
			</fo:table-cell>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdCOEmployerReference">
		<xsl:value-of select="variabledata/order/coorder/employer/reference"/>
	</xsl:variable>
	<xsl:variable name="vdCODate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/coorder/orderdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHearingTypeR5">
		<xsl:choose>
			<xsl:when test="variabledata/notice/hearingtyper5 = 'HRG'">
				Hearing</xsl:when>
			<xsl:when test="variabledata/notice/hearingtyper5 = 'OTH'">
				<xsl:copy-of select="/variabledata/notice/hearingtyper5other"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingWordingR5">
		<xsl:choose>
			<xsl:when test="variabledata/notice/hearingwordingr5 = 'ADJ'">has 
				been adjourned until</xsl:when>
			<xsl:when test="variabledata/notice/hearingwordingr5 = 'TPL'">will 
				take place on</xsl:when>
			<xsl:when test="variabledata/notice/hearingwordingr5 = 'RES'">has 
				been restored to</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdIsTimeEstimateRequired">
		<xsl:value-of select="variabledata/notice/istimeestimaterequired"/>
	</xsl:variable>
	<!-- CO02 END-->
	<!-- CO03 BEGIN-->
	<xsl:variable name="vdOrderText">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/order/text"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCOHearingAttendees">
		<xsl:call-template name="attendees">
			<xsl:with-param name="path">
				variabledata/order/coorder</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CO03 END-->
	<!-- CO05 BEGIN-->
	<xsl:variable name="vdCOPrisonName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/notice/wpprisonname"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdEmployerNamedPerson">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/order/coorder/employer/namedperson"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdEmployerName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/order/coorder/employer/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdEmployerAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/order/coorder/employer/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDebtorWorkAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/order/coorder/workplace/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDFLT1-2">
		<xsl:choose>
			<xsl:when test="variabledata/order/DFLT1-2 = 'DFLT1'">having failed 
				to complete and return a statement of his earnings, resources 
				and needs in accordance with section 14 of the Attachment of 
				Earnings Act 1971, has failed to attend an appointment to show 
				cause why he should not be committed to prison for up to 14 
				days [or, having attended such a hearing, has refused to be 
				sworn (or to give evidence)]</xsl:when>
			<xsl:when test="variabledata/order/DFLT1-2 = 'DFLT2'">having been 
				ordered to attend at a specified day for the adjourned hearing 
				of an application for an attachment of earnings order, has 
				failed to do so [or, having attended such a hearing, has 
				refused to be sworn (or to give evidence)]</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CO05 END -->
	<!-- CO09 BEGIN -->
	<xsl:variable name="vdMaxfine"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/order/maxfine"/> </xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<xsl:variable name="vdDetailsOfOffence">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/order/detailsofoffence"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCOOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/coorderdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CO09 END -->
	<!-- CO13 BEGIN-->
	<xsl:variable name="vdDebtorTable">
		<xsl:for-each 
			select="variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or isnew='Y']">
			<fo:table-row>
				<fo:table-cell border-style="solid" border-width="0.02cm">
					<fo:block>
						<xsl:value-of select="debtcasenumber"/>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell border-style="solid" border-width="0.02cm">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert">
								<xsl:value-of select="creditor/name"/>
							</xsl:with-param>
							<xsl:with-param name="conversion">
								proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell border-style="solid" border-width="0.02cm" 
					text-align="right">
					<fo:block>
						<xsl:call-template name="correctCalculation">
							<xsl:with-param name="value">
								<xsl:value-of select="debtamountallowed"/>
							</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
			</fo:table-row>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vdDebtorTableDeleted2">
		<xsl:for-each 
			select="variabledata/order/coorder/debts/debt[(debtstatus='LIVE' or debtstatus='SCHEDULE2') and isnew!='Y']">
			<fo:table-row>
				<fo:table-cell border-style="solid" border-width="0.02cm">
					<fo:block>
						<xsl:value-of select="debtcasenumber"/>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell border-style="solid" border-width="0.02cm">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert">
								<xsl:value-of select="creditor/name"/>
							</xsl:with-param>
							<xsl:with-param name="conversion">
								proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell border-style="solid" border-width="0.02cm" 
					text-align="right">
					<fo:block>
						<xsl:call-template name="correctCalculation">
							<xsl:with-param name="value">
								<xsl:value-of select="debtamountallowed"/>
							</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
			</fo:table-row>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vdOsNomicBalance">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of 
					select="variabledata/order/coorder/debts/totalamount"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOsNomicBalance1">
		<xsl:variable name="cooutstandingdebt">
			<xsl:value-of select="variabledata/order/coorder/cooutstandingdebt"/>
		</xsl:variable>
		<xsl:variable name="feeamount">
			<xsl:value-of select="variabledata/order/coorder/feeamount"/>
		</xsl:variable>
		<xsl:variable name="totalfeespaid">
			<xsl:value-of select="variabledata/order/coorder/totalfeespaid"/>
		</xsl:variable>
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of 
					select="$cooutstandingdebt + $feeamount - $totalfeespaid"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInstallmentPeriod">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/frequency = 'FOR'">
				fortnight</xsl:when>
			<xsl:when test="variabledata/order/coorder/frequency  = 'MTH'">
				month</xsl:when>
			<xsl:when test="variabledata/order/coorder/frequency  = 'WK'">
				week</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCOInstalmentAmount"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/order/coorder/instalmentamount"/> 
		</xsl:with-param> </xsl:call-template> </xsl:variable>
	<xsl:variable name="vdPerRate"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/order/coorder/protectedearningsrate"/> 
		</xsl:with-param> </xsl:call-template> </xsl:variable>
	<!-- CO13 END-->
	<!-- CO14 BEGIN-->
	<xsl:variable name="vdDebtorNoticeCOTable">
		<xsl:choose>
			<xsl:when 
				test="variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or debtstatus='PENDING' or isnew='Y']">
				<xsl:for-each 
					select="variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or debtstatus='PENDING' or isnew='Y']">
					<fo:table-row>
						<fo:table-cell border-style="solid" 
							border-width="0.02cm" padding-left="0.2cm">
							<fo:block>
								<xsl:value-of select="addedcasenumber"/>
							</fo:block>
						</fo:table-cell>
						<fo:table-cell border-style="solid" 
							border-width="0.02cm" padding-left="0.2cm" padding-right="0.2cm">
							<fo:block>
								<xsl:call-template name="convertcase">
									<xsl:with-param name="toconvert">
										<xsl:value-of select="creditor/name"/>
									</xsl:with-param>
									<xsl:with-param name="conversion">
										proper</xsl:with-param>
								</xsl:call-template>
							</fo:block>
						</fo:table-cell>
						<xsl:if test="string-length(payee/name) > 0">
							<fo:table-cell border-style="solid" text-align="left" 
								border-width="0.02cm" padding-left="0.2cm">
								<fo:block>
									<xsl:value-of select="payeereference"/>
								</fo:block>
							</fo:table-cell>
						</xsl:if>
						<xsl:if test="string-length(payee/name) = 0">
							<fo:table-cell border-style="solid" 
								border-width="0.02cm" padding-left="0.2cm">
								<fo:block>
									<xsl:value-of select="creditorreference"/>
								</fo:block>
							</fo:table-cell>
						</xsl:if>
						<fo:table-cell border-style="solid" 
							border-width="0.02cm" text-align="right" 
							padding-right="0.2cm">
							<fo:block> &#163;<xsl:call-template 
								name="correctCalculation"> <xsl:with-param 
								name="value"> <xsl:value-of 
								select="debtamountallowed"/> </xsl:with-param> 
								</xsl:call-template> </fo:block>
						</fo:table-cell>
					</fo:table-row>
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<fo:table-row>
					<fo:table-cell border-style="solid" border-width="0.02cm" 
						padding-left="0.2cm">
						<fo:block>_</fo:block>
					</fo:table-cell>
					<fo:table-cell border-style="solid" border-width="0.02cm" 
						padding-left="0.2cm">
						<fo:block>_</fo:block>
					</fo:table-cell>
					<fo:table-cell border-style="solid" border-width="0.02cm" 
						padding-left="0.2cm">
						<fo:block>_</fo:block>
					</fo:table-cell>
					<fo:table-cell border-style="solid" border-width="0.02cm" 
						text-align="right" padding-left="0.2cm">
						<fo:block>_</fo:block>
					</fo:table-cell>
				</fo:table-row>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCAEOInitiator">
		<xsl:choose>
			<xsl:when test="variabledata/order/caeoinit = 'COURT'">An 
				attachment of earnings order is already in force and the court 
				considers that a consolidated order should be made</xsl:when>
			<xsl:otherwise> Take notice that an application for a consolidated 
				attachment of earnings order has been made by <xsl:choose> 
				<xsl:when test="variabledata/order/caeoinit = 'CRED'">The 
				Creditor</xsl:when> <xsl:when 
				test="variabledata/order/caeoinit = 'DEB'">The 
				Debtor</xsl:when> <xsl:when 
				test="variabledata/order/caeoinit = 'EM'"> The Debtor's 
				employer</xsl:when> </xsl:choose> </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFeeRate">
		<xsl:value-of select="variabledata/order/coorder/feerate"/>
	</xsl:variable>
	<!-- CO14 END -->
	<!-- CO15 BEGIN -->
	<xsl:variable name="vdMoneyInCourt">
		<xsl:if 
			test="string-length(variabledata/order/coorder/moneyincourt) >0">
			<xsl:if test="number(variabledata/order/coorder/moneyincourt) >0"> 
				&#163;<xsl:call-template name="correctCalculation"> 
				<xsl:with-param name="value"> <xsl:value-of 
				select="variabledata/order/coorder/moneyincourt"/> 
				</xsl:with-param> </xsl:call-template> held in court is of 
				insufficient value for a dividend to be declared.&#x0A; 
				</xsl:if>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdCaseNumber">
		<xsl:value-of 
			select="variabledata/order/coorder/debts/debt[isnew='Y']/debtcasenumber"/>
	</xsl:variable>
	<!-- CO15 END -->
	<!-- CO16 BEGIN -->
	<xsl:variable name="vdFeeAmount">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/order/coorder/feeamount"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFeeAmount1">
		<xsl:variable name="feeamount">
			<xsl:value-of select="variabledata/order/coorder/feeamount"/>
		</xsl:variable>
		<xsl:variable name="totalfeespaid">
			<xsl:value-of select="variabledata/order/coorder/totalfeespaid"/>
		</xsl:variable>
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="$feeamount - $totalfeespaid"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CO16 END -->
	<!-- CO17 BEGIN -->
	<!-- CO17 END -->
	<!-- CO18 BEGIN -->
	<xsl:variable name="vdWhatVaried">
		<xsl:variable name="frequency">
			<xsl:choose>
				<xsl:when test="variabledata/order/coorder/frequency = 'WK'">
					week</xsl:when>
				<xsl:when test="variabledata/order/coorder/frequency = 'MTH'">
					month</xsl:when>
				<xsl:when test="variabledata/order/coorder/frequency = 'FOR'">
					fortnight</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="variabledata/order/whatvaried = 'PER'"> so that the 
				Protected Earnings Rate shall be &#163;<xsl:call-template 
				name="correctCalculation"> <xsl:with-param name="value"> 
				<xsl:value-of 
				select="variabledata/order/coorder/protectedearningsrate"/> 
				</xsl:with-param> </xsl:call-template> per <xsl:value-of 
				select="$frequency"/> with effect from </xsl:when>
			<xsl:when test="variabledata/order/whatvaried = 'NDR'"> and the 
				Normal Deduction Rate shall be <xsl:value-of 
				select="$vdCOInstalmentAmount"/> per <xsl:value-of 
				select="$frequency"/> with effect from </xsl:when>
			<xsl:when test="variabledata/order/whatvaried = 'BTH'"> so that the 
				Protected Earnings Rate shall be &#163;<xsl:call-template 
				name="correctCalculation"> <xsl:with-param name="value"> 
				<xsl:value-of 
				select="variabledata/order/coorder/protectedearningsrate"/> 
				</xsl:with-param> </xsl:call-template> per <xsl:value-of 
				select="$frequency"/> and the Normal Deduction Rate shall be 
				<xsl:value-of select="$vdCOInstalmentAmount"/> per 
				<xsl:value-of select="$frequency"/> with effect from </xsl:when>
			<xsl:when test="variabledata/order/whatvaried = 'DEBT'"> to show 
				that the amount owing under case no. <xsl:value-of 
				select="$vdVariedCaseNumber"/> is <xsl:value-of 
				select="$vdVariedAmount"/> as at </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdVariedCaseNumber">
		<xsl:value-of select="variabledata/order/variedcase"/>
	</xsl:variable>
	<xsl:variable name="vdVariedAmount"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/order/variedamount"/> </xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<!-- CO18 END -->
	<!-- CO19 BEGIN -->
	<xsl:variable name="vdDateSuspend">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/datesuspend"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CO19 END -->
	<!-- CO22 BEGIN -->
	<xsl:variable name="vdListApplicantAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/order/coorder/applicant/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdApplicantAddressMultiLine">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of 
					select="variabledata/order/coorder/applicant/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdApplicantText">
		<xsl:choose>
			<xsl:when 
				test="variabledata/order/coorder/applicant/applicanttext = 'COURT'">
				The Court by its own initiative</xsl:when>
			<xsl:when 
				test="variabledata/order/coorder/applicant/applicanttext = 'CRED'">
				The Creditor</xsl:when>
			<xsl:when 
				test="variabledata/order/coorder/applicant/applicanttext = 'DEB'">
				The Debtor</xsl:when>
			<xsl:when 
				test="variabledata/order/coorder/applicant/applicanttext = 'EM'">
				The Debtor's Employer</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCOAddedCaseNumber">
		<xsl:value-of 
			select="variabledata/order/coorder/debts/debt[isnew='Y']/addedcasenumber"/>
	</xsl:variable>
	<xsl:variable name="vdObjectionDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/order/coorder/objectiondate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CO22 END -->
	<!-- CO23 BEGIN -->
	<xsl:variable name="vdCOApplicant">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/coapplication = 'DIS'">
				Dismissed</xsl:when>
			<xsl:when 
				test="variabledata/order/coorder/coapplication = 'STRUCK'">
				Struck Out</xsl:when>
			<xsl:when test="variabledata/order/coorder/coapplication = 'ADJ'">
				Adjourned</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCOApplicantTitle">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/coapplication = 'DIS'">
				Dismissing</xsl:when>
			<xsl:when 
				test="variabledata/order/coorder/coapplication = 'STRUCK'">
				Striking Out</xsl:when>
			<xsl:when test="variabledata/order/coorder/coapplication = 'ADJ'">
				Adjourning</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOrderCourtAddress">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/hearing/court/name) > 0">
				 <xsl:value-of 
				select="$vdHearingCourtNameDescription"/>, <xsl:call-template 
				name="format-address-single-line"> <xsl:with-param 
				name="theAddress"> <xsl:copy-of 
				select="variabledata/claim/hearing/court/address"/> 
				</xsl:with-param> </xsl:call-template> </xsl:when>
			<xsl:otherwise> <xsl:value-of 
				select="$vdHearingAtCourtNameDescription"/>, <xsl:call-template 
				name="format-address-single-line"> <xsl:with-param 
				name="theAddress"> <xsl:copy-of 
				select="variabledata/claim/hearing/court/at/address"/> 
				</xsl:with-param> </xsl:call-template> </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CO23 END -->
	<!-- CO24 BEGIN -->
	<xsl:variable name="vdFineOrPrison">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/fineorprison = 'FINE'">FINE</xsl:when>
			<xsl:when test="variabledata/order/coorder/fineorprison = 'PRISON'">PRISON</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOffenceDetails">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/offencedetails = 'A'">
				assaulted an officer of this court, whilst in the execution of 
				his duty</xsl:when>
			<xsl:when test="variabledata/order/coorder/offencedetails = 'AR'">
				assaulted an officer of this court, whilst in the execution of 
				his duty and rescued or attempted to rescue certain goods 
				seized under process of this court</xsl:when>
			<xsl:when test="variabledata/order/coorder/offencedetails = 'R'">
				rescued or attempted to rescue certain goods seized under 
				process of this court</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOffenceText">
		<xsl:value-of select="variabledata/order/coorder/offencetext"/>
	</xsl:variable>
	<xsl:variable name="vdPrisonLength">
		<xsl:value-of select="variabledata/order/coorder/prisonlength"/>
	</xsl:variable>
	<xsl:variable name="vdAmountOwed">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/order/coorder/sumpayable"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSumPayDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/coorder/sumpaydate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CO24 END -->
	<!-- CO25 BEGIN -->
	<xsl:variable name="vdCompType">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/order/coorder/comptype) = 0"> 
				in full </xsl:when>
			<xsl:otherwise> to the extent of <xsl:value-of 
				select="variabledata/order/coorder/comprate"/> pence in the 
				pound </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFrequency">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/frequency  = 'FOR'">
				fortnight</xsl:when>
			<xsl:when test="variabledata/order/coorder/frequency  = 'MTH'">
				month</xsl:when>
			<xsl:when test="variabledata/order/coorder/frequency  = 'WK'">
				week</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOrderFirstPaymentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/order/coorder/firstpaymentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdReviewPeriod">
		<xsl:if test="variabledata/order/coorder/reviewper = 'Y'"> and it is 
			directed that this order be subject to review <xsl:if 
			test="string-length(variabledata/order/coorder/reviewinter) > 0"> 
			at intervals of <xsl:value-of 
			select="variabledata/order/coorder/reviewinter"/> </xsl:if> <xsl:if 
			test="string-length(variabledata/order/coorder/reviewmonths) > 0"> 
			after <xsl:value-of 
			select="variabledata/order/coorder/reviewmonths"/> months </xsl:if> 
			</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdDebtorTable2">
		<xsl:for-each 
			select="variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or isnew='Y']">
			<xsl:if test="position() mod 2 = 1">
				<fo:table-row>
					<fo:table-cell border-style="solid" border-width="0.02cm" padding-left="0.2cm">
						<fo:block>
							<xsl:call-template name="convertcase">
								<xsl:with-param name="toconvert">
									<xsl:value-of select="creditor/name"/>
								</xsl:with-param>
								<xsl:with-param name="conversion">
									proper</xsl:with-param>
							</xsl:call-template>
						</fo:block>
					</fo:table-cell>
					<fo:table-cell border-style="solid" border-width="0.02cm" 
						text-align="right" padding-right="0.2cm">
						<fo:block>
							<xsl:call-template name="correctCalculation">
								<xsl:with-param name="value">
									<xsl:value-of select="debtamountallowed"/>
								</xsl:with-param>
							</xsl:call-template>
						</fo:block>
					</fo:table-cell>
				</fo:table-row>
			</xsl:if>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vdDebtorTable3">
		<xsl:for-each 
			select="variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or isnew='Y']">
			<xsl:choose>
				<xsl:when test="position() mod 2 = 0">
					<fo:table-row>
						<fo:table-cell border-style="solid" 
							border-width="0.02cm" padding-left="0.2cm">
							<fo:block>
								<xsl:call-template name="convertcase">
									<xsl:with-param name="toconvert">
										<xsl:value-of select="creditor/name"/>
									</xsl:with-param>
									<xsl:with-param name="conversion">
										proper</xsl:with-param>
								</xsl:call-template>
							</fo:block>
						</fo:table-cell>
						<fo:table-cell border-style="solid" 
							border-width="0.02cm" text-align="right" padding-right="0.2cm">
							<fo:block>
								<xsl:call-template name="correctCalculation">
									<xsl:with-param name="value">
										<xsl:value-of 
											select="debtamountallowed"/>
									</xsl:with-param>
								</xsl:call-template>
							</fo:block>
						</fo:table-cell>
					</fo:table-row>
				</xsl:when>
				<xsl:otherwise>
					<xsl:if 
						test="count(/variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or isnew='Y']) = position()">
						<fo:table-row>
							<fo:table-cell border-style="solid" 
								border-width="0.02cm">
								<fo:block> &#xa0; </fo:block>
							</fo:table-cell>
							<fo:table-cell border-style="solid" 
								border-width="0.02cm" text-align="right">
								<fo:block> &#xa0; </fo:block>
							</fo:table-cell>
						</fo:table-row>
					</xsl:if>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vdCOFrequency">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/frequency  = 'FOR'">
				fortnightly</xsl:when>
			<xsl:when test="variabledata/order/coorder/frequency  = 'MTH'">
				monthly</xsl:when>
			<xsl:when test="variabledata/order/coorder/frequency  = 'WK'">
				weekly</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CO25 END -->
	<!-- CO26 BEGIN -->
	<xsl:variable name="vdRevokedDischarged">
		<xsl:choose>
			<xsl:when 
				test="variabledata/order/coorder/revokeddischarged  = 'DISCHARGED'">
				discharged</xsl:when>
			<xsl:when 
				test="variabledata/order/coorder/revokeddischarged  = 'REVOKED'">
				revoked</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdRevokingDischarging">
		<xsl:choose>
			<xsl:when 
				test="variabledata/order/coorder/revokeddischarged  = 'DISCHARGED'">
				Discharging</xsl:when>
			<xsl:when 
				test="variabledata/order/coorder/revokeddischarged  = 'REVOKED'">
				Revoking</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdRevokeReason">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/order/coorder/revokereason"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CO26 END -->
	<!-- CO27 BEGIN -->
	<xsl:variable name="vdSuspendVaried">
		<xsl:choose>
			<xsl:when 
				test="variabledata/order/coorder/suspendvaried = 'SUSPENDED' or variabledata/order/coorder/suspendvaried = 'Suspended' or variabledata/order/coorder/suspendvaried = 'suspended'">
				suspended</xsl:when>
			<xsl:otherwise>varied</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSuspendReason">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/order/coorder/suspendreason"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHearingOrder">
		<xsl:value-of select="variabledata/order/coorder/hearingorder"/>
	</xsl:variable>
	<!-- CO27 END -->
	<!-- CO28 BEGIN -->
	<xsl:variable name="vdRemovedDebtorName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="/variabledata/order/coorder/debts/debt[isnew = 'Y']/creditor/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdRemovedDebtorAmount">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of 
					select="/variabledata/order/coorder/debts/debt[isnew = 'Y']/debtamountallowed"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCostsText">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="/variabledata/order/coorder/coststext"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDebtorTableDeleted">
		<xsl:for-each 
			select="variabledata/order/coorder/debts/debt[(debtstatus='LIVE' or debtstatus='SCHEDULE2') and isnew!='Y']">
			<fo:table-row>
				<fo:table-cell/>
				<fo:table-cell border-style="solid" border-width="0.02cm">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert">
								<xsl:value-of select="creditor/name"/>
							</xsl:with-param>
							<xsl:with-param name="conversion">
								proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell border-style="solid" border-width="0.02cm" 
					text-align="right">
					<fo:block>
						<xsl:call-template name="correctCalculation">
							<xsl:with-param name="value">
								<xsl:value-of select="debtamountallowed"/>
							</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell/>
			</fo:table-row>
		</xsl:for-each>
	</xsl:variable>
	<!-- CO28 END -->
	<!-- CO29 BEGIN -->
	<xsl:variable name="vdNewDebtorName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="/variabledata/order/coorder/debts/debt[isnew = 'Y']/creditor/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdNewDebtorAmount">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of 
					select="/variabledata/order/coorder/debts/debt[isnew = 'Y']/debtamountallowed"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDebtorTableNew">
		<xsl:for-each 
			select="variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or isnew='Y']">
			<xsl:variable name="debtamountallowed">
				<xsl:value-of select="debtamountallowed"/>
			</xsl:variable>
			<xsl:variable name="passthrough">
				<xsl:value-of select="passthrough"/>
			</xsl:variable>
			<fo:table-row>
				<fo:table-cell/>
				<fo:table-cell padding-left="0.2cm" border-style="solid" 
					border-width="0.02cm">
					<fo:block>
						<xsl:call-template name="convertcase">
							<xsl:with-param name="toconvert">
								<xsl:value-of select="creditor/name"/>
							</xsl:with-param>
							<xsl:with-param name="conversion">
								proper</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell padding-right="0.2cm" border-style="solid" 
					border-width="0.02cm">
					<fo:block text-align="right">
						<xsl:call-template name="correctCalculation">
							<xsl:with-param name="value">
								<xsl:value-of 
									select="$debtamountallowed - $passthrough"/>
							</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell/>
			</fo:table-row>
		</xsl:for-each>
	</xsl:variable>
	<!-- CO29 END -->
	<!-- CO30 BEGIN -->
	<xsl:variable name="vdApplicantAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/order/coorder/applicant/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCreditorAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="/variabledata/order/coorder/debts/debt[isnew = 'Y']/creditor/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CO30 END -->
	<!-- CO32 BEGIN -->
	<xsl:variable name="vdObjector">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="/variabledata/order/coorder/objector"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOrderMade">
		<xsl:value-of select="/variabledata/order/coorder/hearingorder"/>
	</xsl:variable>
	<xsl:variable name="vdOrderMade2">
		<xsl:value-of select="/variabledata/order/coorder/ordermade"/>
	</xsl:variable>
	<!-- CO32 END -->
	<!-- CO34 BEGIN -->
	<xsl:variable name="vdDisStruckAdj">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/disstruckadj  = 'ADJ'">
				adjourned</xsl:when>
			<xsl:when test="variabledata/order/coorder/disstruckadj  = 'DIS'">
				dismissed</xsl:when>
			<xsl:when 
				test="variabledata/order/coorder/disstruckadj  = 'STRUCK'">
				struck out</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdDisStruckAdjCapitals">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/disstruckadj  = 'ADJ'">
				Adjourning</xsl:when>
			<xsl:when test="variabledata/order/coorder/disstruckadj  = 'DIS'">
				Dismissing</xsl:when>
			<xsl:when 
				test="variabledata/order/coorder/disstruckadj  = 'STRUCK'">
				Striking Out</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- CO34 END -->
	<!-- CO35 BEGIN -->
	<xsl:variable name="vdObjectingCreditor">
		<xsl:variable name="id">
			<xsl:value-of 
				select="/variabledata/order/coorder/objectingcreditor"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when 
				test="string-length(/variabledata/order/coorder/debts/debt/creditor[id=$id]/name) > 0">
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="/variabledata/order/coorder/debts/debt/creditor[id=$id]/name"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="convertcase">
					<xsl:with-param name="toconvert">
						<xsl:value-of 
							select="/variabledata/order/coorder/objectingcreditor"/>
					</xsl:with-param>
					<xsl:with-param name="conversion">proper</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CO35 END -->
	<!-- CO36 BEGIN -->
	<xsl:variable name="vdCOOrderHeShe">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/malefemale = 'M'">
				he</xsl:when>
			<xsl:when test="variabledata/order/coorder/malefemale = 'F'">
				she</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCOOrderHimHer">
		<xsl:choose>
			<xsl:when test="variabledata/order/coorder/malefemale = 'M'">
				him</xsl:when>
			<xsl:when test="variabledata/order/coorder/malefemale = 'F'">
				her</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCODebtorDesc">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/order/coorder/debtordesc"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CO36 END -->
	<!-- CO37 BEGIN -->
	<xsl:variable name="vdCOCommitalPeriod">
		<xsl:value-of select="/variabledata/order/coorder/commitalperiod"/>
	</xsl:variable>
	<xsl:variable name="vdCOResponseTime">
		<xsl:value-of select="/variabledata/order/coorder/responsetime"/>
	</xsl:variable>
	<!-- CO37 END -->
	<!-- CO41 BEGIN -->
	<xsl:variable name="vdDateN61A">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/coorder/daten61a"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFineDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/coorder/finedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdFineAmount"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:copy-of 
		select="variabledata/order/coorder/fineamount"/> </xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<!-- CO41 END -->
	<!-- CO43 BEGIN -->
	<xsl:variable name="vdReviewRequester">
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/order/coorder/reviewrequester) > 0">
				 On the application of <xsl:choose> <xsl:when 
				test="variabledata/order/coorder/reviewrequester = 'CRED'"> 
				<xsl:value-of 
				select="variabledata/order/coorder/creditorname"/> </xsl:when> 
				<xsl:when 
				test="variabledata/order/coorder/reviewrequester = 'COURT'">the 
				court by its own initiative</xsl:when> </xsl:choose> </xsl:when>
			<xsl:otherwise>On the direction of the court</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- CO43 END -->
	<!-- CO44 BEGIN -->
	<xsl:variable name="vdCOPaymentsMissed">
		<xsl:value-of select="/variabledata/order/coorder/paymentsmissed"/>
	</xsl:variable>
	<xsl:variable name="vdCOBalance">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of 
					select="variabledata/order/coorder/instalmentamount * $vdCOPaymentsMissed"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- CO44 END -->
	<!-- CO52 BEGIN -->
	<xsl:variable name="vdProtectEarnRate"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:copy-of 
		select="variabledata/order/coorder/protectearnrate"/> </xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<!-- CO52 END -->
	<!--  Release 5 Variables END -->
	<xsl:variable name="vdOurRef">
		<xsl:value-of select="$vdSubjectReference"/>
	</xsl:variable>
	<xsl:variable name="vdYourRef">
	</xsl:variable>
	<!--  Release 7 Variables BEGIN -->
	<xsl:variable name="vdGreeting">
		<xsl:choose>
			<xsl:when test="variabledata/letter/greeting = '1'">Sir</xsl:when>
			<xsl:when test="variabledata/letter/greeting = '2'">Madam</xsl:when>
			<xsl:when test="variabledata/letter/greeting = '3'">Sir/Madam</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="variabledata/letter/greetingother"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPlaintiffName">
		<xsl:value-of select="$vdClaimantName"/>
	</xsl:variable>
	<xsl:variable name="vdSelectionLetter">
		<xsl:value-of select="variabledata/letter/selection"/>
	</xsl:variable>
	<!-- O_7_8 -->
	<xsl:variable name="vdIsCostAssesssed">
		<xsl:value-of select="variabledata/judgment/assessedcost"/>
	</xsl:variable>
	<xsl:variable name="vdCostAssessed">
		<xsl:choose>
			<xsl:when test="variabledata/judgment/assessedcost='Y'"> the sum of 
				&#163;<xsl:value-of select="$vdGoodsCostAmount"/> <xsl:if 
				test="$vdGoodsCostAmount > 0"> for costs</xsl:if> </xsl:when>
			<xsl:otherwise>his costs to be assessed</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCostPaidPeriod">
		<xsl:choose>
			<xsl:when test="variabledata/judgment/costpaid = 'F'">
				forthwith</xsl:when>
			<xsl:when test="variabledata/judgment/costpaid = 'BGD'">to the 
				claimant by <xsl:value-of select="$vdGoodsPaymentDate"/> 
				</xsl:when>
			<xsl:when test="variabledata/judgment/costpaid = 'INST'">to be paid 
				by instalments of &#163;<xsl:if 
				test="string-length(variabledata/judgment/instalmentamount) > 0"><xsl:call-template 
				name="correctCalculation"> <xsl:with-param name="value"> 
				<xsl:copy-of select="variabledata/judgment/instalmentamount"/> 
				</xsl:with-param> </xsl:call-template> <xsl:choose> <xsl:when 
				test="variabledata/notice/instalmentperiod = 'WK'"> for every 
				week</xsl:when> <xsl:when 
				test="variabledata/notice/instalmentperiod = 'FOR'"> for every 
				fortnight</xsl:when> <xsl:when 
				test="variabledata/notice/instalmentperiod = 'MTH'"> for every 
				calendar month</xsl:when> </xsl:choose> the first instalment to 
				reach the claimant by <xsl:value-of 
				select="$vdInstalmentDate"/> </xsl:if> </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- N32_1 BEGIN-->
	<xsl:variable name="vdHPCSAgreement">
		<xsl:choose>
			<xsl:when test="variabledata/judgment/hpcsgreement = 'RHP'">
				regulated hire purchase agreement</xsl:when>
			<xsl:when test="variabledata/judgment/hpcsgreement = 'HP'">hire 
				purchase agreement</xsl:when>
			<xsl:when test="variabledata/judgment/hpcsgreement = 'RCS'">
				regulated conditional sale agreement</xsl:when>
			<xsl:when test="variabledata/judgment/hpcsgreement = 'CS'">
				conditional sale agreement</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdGoodsDetained1">
		<xsl:copy-of select="variabledata/judgment/goodsdetained1"/>
	</xsl:variable>
	<xsl:variable name="vdGoodsDetained2">
		<xsl:copy-of select="variabledata/judgment/goodsdetained2"/>
	</xsl:variable>
	<xsl:variable name="vdGoodsAmount">
		<xsl:choose>
			<xsl:when test="variabledata/judgment/goodsamount = 'ASS'">the sum 
				of &#163;<xsl:call-template name="correctCalculation"> 
				<xsl:with-param name="value"> <xsl:copy-of 
				select="variabledata/judgment/costs"/> </xsl:with-param> 
				</xsl:call-template> for costs</xsl:when>
			<xsl:when test="variabledata/judgment/goodsamount = 'TBA'">his 
				costs to be assessed</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdGoodsAmount2">
		<xsl:choose>
			<xsl:when test="variabledata/judgment/goodsamount = 'ASS'">the sum 
				of &#163;<xsl:call-template name="correctCalculation"> 
				<xsl:with-param name="value"> <xsl:copy-of 
				select="variabledata/judgment/costs"/> </xsl:with-param> 
				</xsl:call-template> for costs <xsl:choose> <xsl:when 
				test="variabledata/judgment/goodspaidby = 'FW'">forthwith</xsl:when> 
				<xsl:when test="variabledata/judgment/goodspaidby = 'BY'">to 
				the claimant by <xsl:copy-of select="$vdPaymentInFullDate"/> 
				</xsl:when> <xsl:when 
				test="variabledata/judgment/goodspaidby = 'IN'">to be paid by 
				instalments of &#163;<xsl:call-template 
				name="correctCalculation"> <xsl:with-param name="value"> 
				<xsl:copy-of select="variabledata/judgment/amountoffered"/> 
				</xsl:with-param> </xsl:call-template> <xsl:choose> <xsl:when 
				test="$vdPaymentFrequency = 'MTH'"> for every week </xsl:when> 
				<xsl:when test="$vdPaymentFrequency = 'WK'"> weekly </xsl:when> 
				<xsl:when test="$vdPaymentFrequency = 'FOR'"> fortnightly 
				</xsl:when> </xsl:choose> the first payment to reach the 
				<xsl:copy-of select="$vdSubjectPartyCodeOther"/> by 
				<xsl:copy-of select="$vdPaymentDate"/> </xsl:when> 
				</xsl:choose> </xsl:when>
			<xsl:when test="variabledata/judgment/goodsamount = 'TBA'">his 
				costs to be assessed</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- N32_1 END-->
	<!-- N32 BEGIN -->
	<xsl:variable name="vdDamagesAmount">
		<xsl:value-of select="variabledata/judgment/damagesamount"/>
	</xsl:variable>
	<xsl:variable name="vdReturnGoods">
		<xsl:value-of select="variabledata/judgment/returngoods"/>
	</xsl:variable>
	<!-- N33 BEGIN -->
	<xsl:variable name="vdTotalArrearsAndCost">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="$vdIntArrearsAndCost"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdIntArrearsAndCost">
		<xsl:value-of 
			select="variabledata/notice/arrearsamount + variabledata/judgment/costs"/>
	</xsl:variable>
	<!-- N33 END -->
	<!-- N54 -->
	<xsl:variable name="vdAppointmentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/warrant/appointmentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAppointmentTime">
		<xsl:value-of select="variabledata/warrant/appointmenttime"/>
	</xsl:variable>
	<xsl:variable name="vdPartyForOrSolicitorName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/warrant/warrantparties/warrantpartyfor/name"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPartyForOrSolicitorAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/warrant/warrantparties/warrantpartyfor/*"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPartyForOrSolicitorTelephoneNumber">
		<xsl:value-of 
			select="variabledata/warrant/warrantparties/warrantpartyfor/telephonenumber"/>
	</xsl:variable>
	<xsl:variable name="vdPartyForOrSolicitorReference">
		<xsl:value-of 
			select="variabledata/warrant/warrantparties/warrantpartyfor/reference"/>
	</xsl:variable>
	<!-- N246 BEGIN-->
	<xsl:variable name="vdSolicitorsText">
		<xsl:if 
			test="variabledata/claim/claimant[id=$vdClaimantId]/representativeid !='' or variabledata/claim/claimant[id=$vdClaimantId]/solicitorsurrogateid !='' ">
			's Solicitor</xsl:if>
	</xsl:variable>
	<!-- N246 END-->
	<!-- N293 BEGIN-->
	<xsl:variable name="vdCertificatePurpose">
		<xsl:choose>
			<xsl:when test="variabledata/order/ceftificatepurpose = 'EJ'">for 
				the purpose of enforcing judgment in the High Court by 
				execution against goods</xsl:when>
			<xsl:when test="variabledata/order/ceftificatepurpose = 'AHC'">
				following the Claimant's application to the High Court under 
				section 42 CCA (for transfer to the High Court)</xsl:when>
			<xsl:when test="variabledata/order/ceftificatepurpose = 'AS'">
				recovering payment from a serviceman pursuant to Section 151a 
				Army Act 1955</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdProceedingsIssueDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/proceedingsissuedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdProceedingsDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/proceedingsdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCauseOfAction">
		<xsl:copy-of select="variabledata/order/causeofaction"/>
	</xsl:variable>
	<xsl:variable name="vdChief"> Court Manager </xsl:variable>
	<xsl:variable name="vdAmountOfDebt">
		<xsl:copy-of select="variabledata/order/amountofdebt"/>
	</xsl:variable>
	<xsl:variable name="vdInterestToJudgmentDate">
		<xsl:copy-of select="variabledata/order/interesttojudgmentdate"/>
	</xsl:variable>
	<xsl:variable name="vdSubsequentCosts">
		<xsl:copy-of select="variabledata/order/subsequentcosts"/>
	</xsl:variable>
	<xsl:variable name="vdInterestSinceJudgmentdate">
		<xsl:copy-of select="variabledata/order/interestsincejudgmentdate"/>
	</xsl:variable>
	<xsl:variable name="vdTotalAmountOwing">
		<xsl:copy-of 
			select="$vdInterestSinceJudgmentdate + $vdSubsequentCosts + $vdInterestToJudgmentDate + $vdAmountOfDebt+  $vdGoodsCostAmount"/>
	</xsl:variable>
	<!-- N293 END-->
	<!-- QB5 BEGIN-->
	<xsl:variable name="vdSettingDownNo">
		<xsl:copy-of select="variabledata/order/settingdownno"/>
	</xsl:variable>
	<xsl:variable name="vdListCourtAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of select="variabledata/order/listcourt/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- QB5 END-->
	<!-- FORM 200 BEGIN-->
	<xsl:variable name="vdForm200Division">
		<xsl:choose>
			<xsl:when test="$vdDistrictRegistry = 'Q'"> In the High Court of 
				Justice Queen's Bench Division </xsl:when>
			<xsl:when test="$vdDistrictRegistry = 'C'"> In the High Court of 
				Justice Chancery Division </xsl:when>
			<xsl:otherwise> In the </xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdForm200Court">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:copy-of select="variabledata/court/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
		<xsl:choose>
			<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">District 
				Registry</xsl:when>
			<xsl:when test="$vdDistrictRegistry = 'F'">Family Court</xsl:when>
			<xsl:otherwise>County Court</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdIsFund">
		<xsl:value-of select="variabledata/order/isfundnumber" />
	</xsl:variable>
	<xsl:variable name="vdCourtOrFund">
		<xsl:choose>
			<xsl:when test="$vdIsFund = 'Y' ">Fund</xsl:when>
			<xsl:otherwise>Court Case</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCashAmount">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/order/cashamount"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdBasicAmount">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/order/basicamount"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSpecialAmount">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/order/specialamount"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPayeeDetails1">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=1]/detail"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeName1">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/order/payeedetails/payee[payeeid=1]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPayeeAddress1">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=1]/address"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeRef1">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=1]/reference"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeBankName1">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=1]/bankname"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeBankAddress1">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=1]/bankaddress"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeSortcode1">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=1]/sortcode"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeAccountNo1">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=1]/accnumber"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeAmount1">
		<xsl:choose>
			<xsl:when 
				test="string-length($vdPayeeName1) > 0  and string-length(variabledata/order/payeedetails/payee[payeeid=1]/amount) = 0">
				unknown</xsl:when>
			<xsl:when 
				test="string-length(variabledata/order/payeedetails/payee[payeeid=1]/amount) > 0">
				 &#163;<xsl:call-template name="correctCalculation"> 
				<xsl:with-param name="value"> <xsl:value-of 
				select="variabledata/order/payeedetails/payee[payeeid=1]/amount"/> 
				</xsl:with-param> </xsl:call-template> </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPayeeDetails2">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=2]/detail"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeName2">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/order/payeedetails/payee[payeeid=2]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPayeeAddress2">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=2]/address"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeRef2">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=2]/reference"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeBankName2">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=2]/bankname"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeBankAddress2">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=2]/bankaddress"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeSortcode2">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=2]/sortcode"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeAccountNo2">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=2]/accnumber"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeAmount2">
		<xsl:choose>
			<xsl:when 
				test="string-length($vdPayeeName2) > 0  and string-length(variabledata/order/payeedetails/payee[payeeid=2]/amount) = 0">
				unknown</xsl:when>
			<xsl:when 
				test="string-length(variabledata/order/payeedetails/payee[payeeid=2]/amount) > 0">
				 &#163;<xsl:call-template name="correctCalculation"> 
				<xsl:with-param name="value"> <xsl:value-of 
				select="variabledata/order/payeedetails/payee[payeeid=2]/amount"/> 
				</xsl:with-param> </xsl:call-template> </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPayeeDetails3">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=3]/detail"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeName3">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/order/payeedetails/payee[payeeid=3]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPayeeAddress3">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=3]/address"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeRef3">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=3]/reference"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeBankName3">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=3]/bankname"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeBankAddress3">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=3]/bankaddress"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeSortcode3">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=3]/sortcode"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeAccountNo3">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=3]/accnumber"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeAmount3">
		<xsl:choose>
			<xsl:when 
				test="string-length($vdPayeeName3) > 0  and string-length(variabledata/order/payeedetails/payee[payeeid=3]/amount) = 0">
				unknown</xsl:when>
			<xsl:when 
				test="string-length(variabledata/order/payeedetails/payee[payeeid=3]/amount) > 0">
				 &#163;<xsl:call-template name="correctCalculation"> 
				<xsl:with-param name="value"> <xsl:value-of 
				select="variabledata/order/payeedetails/payee[payeeid=3]/amount"/> 
				</xsl:with-param> </xsl:call-template> </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPayeeDetails4">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=4]/detail"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeName4">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="variabledata/order/payeedetails/payee[payeeid=4]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPayeeAddress4">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=4]/address"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeRef4">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=4]/reference"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeBankName4">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=4]/bankname"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeBankAddress4">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=4]/bankaddress"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeSortcode4">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=4]/sortcode"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeAccountNo4">
		<xsl:value-of 
			select="variabledata/order/payeedetails/payee[payeeid=4]/accnumber"/>
	</xsl:variable>
	<xsl:variable name="vdPayeeAmount4">
		<xsl:choose>
			<xsl:when 
				test="string-length($vdPayeeName4) > 0  and string-length(variabledata/order/payeedetails/payee[payeeid=4]/amount) = 0">
				unknown</xsl:when>
			<xsl:when 
				test="string-length(variabledata/order/payeedetails/payee[payeeid=4]/amount) > 0">
				 &#163;<xsl:call-template name="correctCalculation"> 
				<xsl:with-param name="value"> <xsl:value-of 
				select="variabledata/order/payeedetails/payee[payeeid=4]/amount"/> 
				</xsl:with-param> </xsl:call-template> </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- FORM 200 END-->
	<!-- FORM 211 BEGIN-->
	<xsl:variable name="vdCaseReferenceNumber">
		<xsl:value-of select="variabledata/order/casereferencenumber"/>
	</xsl:variable>
	<xsl:variable name="vdTransferAmount"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/transfer/amount"/> </xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<!-- FORM 211 END-->
	<xsl:variable name="vdEmployerReference">
	</xsl:variable>
	<!-- BK1 BEGIN-->
	<xsl:variable name="vdOfficialReceiverAddress">
		<!--xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party"-->
		<xsl:copy-of select="variabledata/order/officialreceiver/address"/>
		<!--/xsl:with-param>
		</xsl:call-template-->
	</xsl:variable>
	<xsl:variable name="vdBKClaimantAddress">
		<!-- These need to be chanfed to allow for solicitors -->
		<xsl:choose>
			<xsl:when test="vdInstigatorPartyRoleCode = 'CLAIMANT'">
				<xsl:copy-of 
					select="variabledata/claim/claimant[number = $vdInstigatorNumber]/address"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:copy-of 
					select="variabledata/claim/defendant[number = $vdInstigatorNumber]/address"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdClaimantSolicitor">
		<!-- the vdClaimantReference is the sollicitor's reference if there is a solicitor, otherwise the claimant ref - Release 1 UTC Phase 2 defect -->
		<xsl:choose>
			<xsl:when 
				test="string-length(variabledata/claim/mainclaimantid) > 0">
				<xsl:variable name="mainClaimantId">
					<xsl:value-of select="variabledata/claim/mainclaimantid"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/claimant[surrogateid = $mainClaimantId]/representativeid) > 0">
						 Solicitor's </xsl:when>
					<xsl:otherwise> Petitioner's </xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when 
						test="string-length(variabledata/claim/claimant[number=1]/representativeid) > 0">
						 Solicitor's </xsl:when>
					<xsl:otherwise> Petitioner's </xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPresentationPetitionDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of 
					select="variabledata/order/presentationpetitiondate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdClaimanttelephoneNumber">
		<xsl:value-of 
			select="variabledata/claim/claimant[number=1]/telephonenumber"/>
	</xsl:variable>
	<xsl:variable name="vdBKDefendantAddress">
		<xsl:if test="$vdSubjectPartyRoleCode = 'DEFENDANT'">
			<xsl:copy-of 
				select="variabledata/claim/defendant[./number = $vdSubjectNumber]/address"/>
		</xsl:if>
		<xsl:if test="$vdSubjectPartyRoleCode = 'CLAIMANT'">
			<xsl:copy-of 
				select="variabledata/claim/claimant[./number = $vdSubjectNumber]/address"/>
		</xsl:if>
	</xsl:variable>
	<!-- BK1 END-->
	<!-- Letter 351 BEGIN -->
	<xsl:variable name="vdCorrespondanceDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/letter/correspondencedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCollectedByDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/letter/collectedbydate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdBillOfCostsNumber">
		<xsl:value-of select="variabledata/letter/billofcostsnumber"/>
	</xsl:variable>
	<xsl:variable name="vdLetterEnding">
		<xsl:choose>
			<xsl:when 
				test="variabledata/letter/greeting = '1' or variabledata/letter/greeting = '2'">
				Yours faithfully</xsl:when>
			<xsl:otherwise>Yours sincerely</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdHearingDate365">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/hearingdate365"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdLetterRecDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/letter/date"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- Letter 351 END -->
	<!-- Letter 366 BEGIN -->
	<xsl:variable name="vdCollectionDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/collectiondate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- Letter 366 END -->
	<!-- Letter 297 BEGIN -->
	<xsl:variable name="vdFeePayment">
		<xsl:choose>
			<xsl:when test="variabledata/letter/feepayment = 'F'">fee</xsl:when>
			<xsl:when test="variabledata/letter/feepayment = 'P'">
				payment</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- Letter 297 END -->
	<xsl:variable name="vdLetServiceDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/letter/letservdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- L_4_1 -->
	<xsl:variable name="vdLetClaimNumber">
		<xsl:value-of select="variabledata/letter/casenumber" />
	</xsl:variable>
	<!-- L_6_1_2_3_4_7 BEGIN -->
	<xsl:variable name="vdDrawnInFavour">
		<xsl:value-of select="variabledata/letter/drawninfavour" />
	</xsl:variable>
	<xsl:variable name="vdPayableOrderAmount">
		<xsl:value-of select="variabledata/letter/payableorderamount" />
	</xsl:variable>
	<xsl:variable name="vdFeeOrPaymentAmount">
		<xsl:value-of select="variabledata/letter/amountFeePayment" />
	</xsl:variable>
	<xsl:variable name="vdCaseType">
		<xsl:value-of select="variabledata/claim/type"/>
	</xsl:variable>
	<xsl:variable name="vdEnquiry">
		<xsl:choose>
			<xsl:when test="variabledata/letter/enquiry = 'FR' ">a refund of 
				fee</xsl:when>
			<xsl:when test="variabledata/letter/enquiry = 'PO' ">payment out of 
				money in court</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPayableOrderNo">
		<xsl:value-of select="variabledata/letter/payableorderno"/>
	</xsl:variable>
	<xsl:variable name="vdLetterSentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/letter/sentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOriginalPayableOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of 
					select="variabledata/letter/originalpayableorderdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdRespectOf">
		<xsl:choose>
			<xsl:when test="variabledata/letter/respectof = 'C'">a 
				claim</xsl:when>
			<xsl:when test="variabledata/letter/respectof = 'PC'">a claim for 
				possession of land</xsl:when>
			<xsl:when test="variabledata/letter/respectof = 'OTH'">
				<xsl:value-of select="$vdTypeOfProcess"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- L_6_1_2_3_4_7 END -->
	<!-- L_13_1 STRAT -->
	<xsl:variable name="vdWarrantReturnDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/warrant/returndate" />
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWarrantReceiptDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/warrant/receiptdate" />
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdLetterHeadDate">
		<xsl:choose>
			<xsl:when test="($vdWarrantReceiptDate != $emptyDate)">
				<xsl:value-of select="$vdWarrantReceiptDate"/>
			</xsl:when>
			<xsl:when test="($vdEventDate != $emptyDate)">
				<xsl:value-of select="$vdEventDate"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdSystemDate"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCoverLetterHeadDate">
		<xsl:choose>
			<xsl:when test="($vdWarrantReturnDate != $emptyDate)">
				<xsl:value-of select="$vdWarrantReturnDate"/>
			</xsl:when>
			<xsl:when test="($vdEventDate != $emptyDate)">
				<xsl:value-of select="$vdEventDate"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdSystemDate"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- L_13_1 END -->
	<!-- O_1_3_4 START -->
	<xsl:variable name="vdDayOfMonthDue" >
		<xsl:call-template name="numberpostfix">
			<xsl:with-param name="number" >
				<xsl:copy-of select="variabledata/notice/instalmentdueday" />
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWarrantLocalNumber">
		<xsl:value-of select="variabledata/warrant/localnumber" />
	</xsl:variable>
	<xsl:variable name="vdWarrantIssueCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/warrant/foreigncourt" />
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- O_1_3_4 END -->
	<!-- O_2_6 BEGIN -->
	<xsl:variable name="vdCourtSatisfied">
		<xsl:choose>
			<xsl:when test="variabledata/order/courtsatisfied ='C'"> That the 
				conduct consists of or includes use of violence. </xsl:when>
			<xsl:when test="variabledata/order/courtsatisfied ='R'"> That there 
				is a risk of harm to the person named in section 153A(4) 
				</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdArrestOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/arrestdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdArrestOrderExpiryDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/arrestexpirydate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdApplicantTelephone">
		<xsl:value-of select="variabledata/order/applicantphone"/>
	</xsl:variable>
	<xsl:variable name="vdProvisionInjunction">
		<xsl:value-of select="variabledata/order/provisioninjunction"/>
	</xsl:variable>
	<!-- O_2_6 END -->
	<!-- O_5_5 BEGIN -->
	<xsl:variable name="vdCostsPaid">
		<xsl:choose>
			<xsl:when test="variabledata/order/costspaid ='I'">
				immediately</xsl:when>
			<xsl:when test="variabledata/order/costspaid ='G'">by <xsl:value-of 
				select="$vdPaymentDate"/> </xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDefendantWording1">
		<xsl:choose>
			<xsl:when test="variabledata/notice/amountcosts > 0">the sum of 
				&#163;<xsl:call-template name="correctCalculation"> 
				<xsl:with-param name="value"> <xsl:value-of 
				select="variabledata/notice/amountcosts"/> </xsl:with-param> 
				</xsl:call-template> for the <xsl:value-of 
				select="$vdInstigatorPartyNumber"/>&#xa0;<xsl:copy-of 
				select="$vdInstigatorPartyRoleLower"/>'s costs</xsl:when>
			<xsl:otherwise>the <xsl:value-of 
				select="$vdInstigatorPartyNumber"/>&#xa0;<xsl:copy-of 
				select="$vdInstigatorPartyRoleLower"/>'s costs of this action, 
				to be assessed on scale <xsl:value-of 
				select="variabledata/notice/costscale"/></xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdJudgmentDefendantWording2">
		<xsl:choose>
			<xsl:when test="variabledata/notice/amountcosts > 0">
				<xsl:choose>
					<xsl:when test="variabledata/order/costspaid ='I'">sum 
						immediately</xsl:when>
					<xsl:otherwise>sum by <xsl:value-of 
						select="$vdPaymentDate"/> </xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="variabledata/order/costspaid ='I'">costs 
						immediately, or if the costs have not been assessed, 
						within 14 days of assessment</xsl:when>
					<xsl:otherwise>costs by <xsl:value-of 
						select="$vdPaymentDate"/> and pays the assessed costs 
						by that day, or if the costs have not been assessed, 
						within 14 days of assessment</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- O_5_5 END -->
	<!-- O_5_6 BEGIN -->
	<xsl:variable name="vdAwardDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/awarddate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdBodyName">
		<xsl:value-of select="variabledata/order/bodyname"/>
	</xsl:variable>
	<xsl:variable name="vdBodyReference">
		<xsl:value-of select="variabledata/order/bodyref"/>
	</xsl:variable>
	<xsl:variable name="vdAwardUnpaid">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/order/awardunpaid"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAwardCourtFee">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/order/awardcourtfee"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAwardSolicitorCosts">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="variabledata/order/awardsolcosts"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTotalAmount">
		<xsl:call-template name="correctCalculation">
			<xsl:with-param name="value">
				<xsl:value-of select="$vdAwardTotal"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAwardTotal">
		<xsl:value-of 
			select="variabledata/order/awardunpaid + variabledata/order/awardcourtfee + variabledata/order/awardsolcosts"/>
	</xsl:variable>
	<!-- O_5_6 END -->
	<!-- O_9_1 START -->
	<xsl:variable name="vdSecuritiesHoldings">
		<xsl:copy-of select="variabledata/order/securities/currentholding"/>
	</xsl:variable>
	<xsl:variable name="vdSecuritiesDescription">
		<xsl:copy-of select="variabledata/order/securities/description"/>
	</xsl:variable>
	<xsl:variable name="vdCFOAddressLine">Glasgow, G58 1AB</xsl:variable>
	<xsl:variable name="vdCFODXNumber">DX 501757, Cowglen</xsl:variable>
	<xsl:variable name="vdCFOEmailAddress">enquiries@cfo.gsi.gov.uk</xsl:variable>
	<!-- O_9_1 END -->
	<!-- O_9_2 START -->
	<xsl:variable name="vdTransferFromCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/order/cfotransfer/originatingcourtname" 
					/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTransferToCourtName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/order/cfotransfer/receivingcourtname" 
					/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- O_9_2 END -->
	<!-- O_10_4 BEGIN -->
	<xsl:variable name="vdNomineeReportDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/nomineereportdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterimOrderDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/interimdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterimOrderExtendedDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/interimextendeddate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdMeetingDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/meetingdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdMeetingTime">
		<xsl:choose>
			<xsl:when test="string-length(variabledata/order/meetingtime) > 0">
				<xsl:value-of select="variabledata/order/meetingtime"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$emptyTime"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdMeetingAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/order/meetingaddress/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- O_10_4 END -->
	<!-- O_10_5 BEGIN -->
	<xsl:variable name="vdPetitionDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of select="variabledata/order/petitiondate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAffidavitName">
		<xsl:copy-of select="variabledata/order/affidavit/name"/>
	</xsl:variable>
	<xsl:variable name="vdAffidavitAddress">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of select="variabledata/order/affidavit/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAffidavitJob">
		<xsl:copy-of select="variabledata/order/affidavit/job"/>
	</xsl:variable>
	<xsl:variable name="vdPrepaidPostType">
		<xsl:choose>
			<xsl:when test="variabledata/order/prepaidtype = 'FC'">by first 
				class prepaid post </xsl:when>
			<xsl:when test="variabledata/order/prepaidtype = 'SC'">by second 
				class prepaid post </xsl:when>
			<xsl:when test="variabledata/order/prepaidtype = 'REG'">by 
				registered prepaid post</xsl:when>
			<xsl:when test="variabledata/order/prepaidtype = 'REC'">by recorded 
				prepaid post</xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdServiceAddressedTo">
		<xsl:copy-of select="variabledata/order/serviceaddressedto"/>
	</xsl:variable>
	<xsl:variable name="vdServiceAddressed">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/order/serviceaddressed/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSubstitutedServiceWording"> <xsl:choose> <xsl:when 
		test="variabledata/order/publishedin = 'LG'">and by publication in the 
		London Gazette</xsl:when> <xsl:when 
		test="variabledata/order/publishedin = 'OTH'">and by publication in the 
		<xsl:value-of select="variabledata/notice/newspaper"/> newspaper of the 
		presentation of such Petition and the time and place fixed for hearing 
		the Petition</xsl:when> <xsl:when 
		test="variabledata/order/publishedin = 'BTH'">and by publication in the 
		London Gazette and in the <xsl:value-of 
		select="variabledata/notice/newspaper"/> newspaper of the presentation 
		of such Petition and the time and place fixed for hearing the 
		Petition</xsl:when> </xsl:choose> shall be deemed to be good and 
		sufficient service of the said Petition on the above-named Debtor on 
		the <xsl:call-template name="numberpostfix"> <xsl:with-param 
		name="number"> <xsl:value-of 
		select="variabledata/order/afterpostingday"/> </xsl:with-param> 
		</xsl:call-template> day after completing such posting<xsl:if 
		test="variabledata/order/publishedin != 'N'"> and publication as 
		aforesaid</xsl:if>. </xsl:variable>
	<!-- O_10_5 END -->
	<!-- O_10_10 BEGIN -->
	<xsl:variable name="vdPetitionWording">
		<xsl:value-of select="variabledata/order/petitionwording"/>
	</xsl:variable>
	<xsl:variable name="vdECRegulation"><xsl:value-of select="variabledata/order/ecregulation"/></xsl:variable>
	<xsl:variable name="vdECProceedingType">
		<xsl:choose>
			<xsl:when test="variabledata/order/ecproceedingtype = 'M'">Main </xsl:when>
			<xsl:when test="variabledata/order/ecproceedingtype = 'SEC'">Secondary </xsl:when>
			<xsl:when test="variabledata/order/ecproceedingtype = 'TER'">Territorial </xsl:when>
			<xsl:otherwise/>
		</xsl:choose>
	</xsl:variable>
	<!-- O_10_10 END -->
	<!-- O_10_16 BEGIN -->
	<xsl:variable name="vdBankruptcyDischargeDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:copy-of 
					select="variabledata/order/bankruptcydischargedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- O_10_16 END -->
	<!-- O_10_17 BEGIN -->
	<!-- O_10_17 END -->
	<!-- O_11_1_2_3_4 BEGIN -->
	<xsl:variable name="vdInsolvencyPetitionerHeader">
		<xsl:choose>
			<xsl:when test="$vdEventId='690'">Order Adjourning 
				Petition</xsl:when>
			<xsl:when test="$vdEventId='691'">Company Winding Up 
				Order</xsl:when>
			<xsl:when test="$vdEventId='692'">Order Dismissing 
				Petition</xsl:when>
			<xsl:when test="$vdEventId='693'">General Order</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdCostInstructions">
		<xsl:value-of select="variabledata/order/costinstructions"/>
	</xsl:variable>
	<xsl:variable name="vdInsolvencyPetitionerWording">
		<xsl:choose>
			<xsl:when test="$vdCostInstructions='CAPC'">the costs be awarded to 
				the Petitioning Creditor</xsl:when>
			<xsl:when test="$vdCostInstructions='CASC'">the costs be awarded to 
				the Supporting Creditor</xsl:when>
			<xsl:when test="$vdCostInstructions='CR'">the costs be 
				reserved</xsl:when>
			<xsl:when test="$vdCostInstructions='NOC'">there be no order as to 
				costs</xsl:when>
			<xsl:when test="$vdCostInstructions='CPOA'">the costs of the 
				Petitioning Creditor be paid out of the assets of the company 
				to be assessed if not agreed</xsl:when>
			<xsl:when test="$vdCostInstructions='CPONA'">"the costs of the 
				Petitioning Creditor be paid by the company to be assessed if 
				not agreed</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPetitionOf">
		<xsl:value-of select="variabledata/order/petitionof"/>
	</xsl:variable>
	<xsl:variable name="vdPetitionDate2">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/petitiondate2"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdPetitionAdjournedTime">
		<xsl:value-of select="variabledata/order/petitionadjournedtime"/>
	</xsl:variable>
	<xsl:variable name="vdPetitionAdjournedDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/adjourneddate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdNoteWording">
		<xsl:choose>
			<xsl:when test="variabledata/order/notewording='OR'">The official 
				receiver attached to the court by virtue of this order 
				liquidator of the company.</xsl:when>
			<xsl:when test="variabledata/order/notewording='OOR'">One of the 
				official receivers attached to the court by virtue of this 
				order liquidator of the company.</xsl:when>
			<xsl:otherwise>Costs reserved attached to the court by virtue of 
				this order.</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdPetitionAction">
		<xsl:choose>
			<xsl:when test="variabledata/order/petitionaction='W'">
				withdrawn</xsl:when>
			<xsl:otherwise>dismissed</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- O_11_1_2_3_4 END -->
	<!-- O_10_6 START -->
	<xsl:variable name="vdPetitionInstructions">
		<xsl:choose>
			<xsl:when test="variabledata/order/petitioninstructions='DIS'">this 
				Petition be dismissed</xsl:when>
			<xsl:otherwise>the Petitioner has leave to withdraw this 
				Petition</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<!-- O_10_6 END -->
	<!-- O_10_7 START-->
	<xsl:variable name="vdAdjournedHearing">
		<xsl:choose>
			<xsl:when test="variabledata/claim/hearing/adjournedhearing = 'Y' ">
				 Upon the adjourned hearing of the Petition today </xsl:when>
			<xsl:otherwise> Upon the hearing of the Petition today 
				</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSupportCreditorsDet">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of 
					select="variabledata/claim/hearing/supportCreditorsDet"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- O_10_7 FINISH-->
	<!-- Letter 242 BEGIN -->
	<xsl:variable name="vdLetterOrder">
		<xsl:choose>
			<!-- <xsl:when test="variabledata/letter/letterorder = '1'">order for attendance at oral examination (N37/N38)</xsl:when> -->
			<xsl:when test="variabledata/letter/letterorder = '2'">order for 
				attendance at adjourned oral examination (N39)</xsl:when>
			<!-- <xsl:when test="variabledata/letter/letterorder = '3'">order for production of statement of means</xsl:when> -->
			<xsl:when test="variabledata/letter/letterorder = '4'">claim for 
				possession of land</xsl:when>
			<xsl:when test="variabledata/letter/letterorder = '5'">
				claim</xsl:when>
			<xsl:when test="variabledata/letter/letterorder = '6'">claim for 
				return of goods</xsl:when>
			<xsl:when test="variabledata/letter/letterorder = '7'">originating 
				application</xsl:when>
			<xsl:when test="variabledata/letter/letterorder = '8'">warrant of 
				committal</xsl:when>
			<xsl:when test="variabledata/letter/letterorder = 'OTH'">
				<xsl:value-of select="variabledata/letter/letterorderother"/>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdIssueReissue">
		<xsl:choose>
			<xsl:when test="variabledata/letter/issuereissue = 'Y'">
				re-issued</xsl:when>
			<xsl:when test="variabledata/letter/issuereissue != 'Y'">
				issued</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdListingOn">
		<xsl:choose>
			<xsl:when test="variabledata/letter/listingon = '1'">listed for 
				hearing on <xsl:value-of select="$vdHearingDate1"/> at 
				<xsl:value-of select="$vdHearingTime"/>, subject to 
				service.</xsl:when>
			<xsl:when test="variabledata/letter/listingon = '2'">the date of 
				service is <xsl:value-of 
				select="$vdLetServiceDate"/>.</xsl:when>
			<xsl:when test="variabledata/letter/listingon = '3'">has been 
				passed to the Bailiff for service.</xsl:when>
			<xsl:when test="variabledata/letter/listingon = '4'">is enclosed 
				for your own service. Kindly return the endorsement copy with 
				your sworn affidavit once service has been effected.</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- Letter 242 END -->
	<!-- Letter 383 BEGIN -->
	<xsl:variable name="vdNameForeignCourt">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/notice/nameforeigncourt"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWarrantTotalRemaining"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/notice/warranttotalremaining"/> </xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<xsl:variable name="vdNoticePaymentDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/paymentdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- Letter 383 END -->
	<!-- Letter 393 BEGIN -->
	<xsl:variable name="vdProcessNo">
		<xsl:value-of select="variabledata/notice/processno"/>
	</xsl:variable>
	<xsl:variable name="vdTypeOfProcess">
		<xsl:value-of select="variabledata/notice/typeofprocess"/>
	</xsl:variable>
	<!--xsl:variable name="vdDebtorTable">
		<xsl:for-each select="variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or isnew='Y']">
			<fo:block>
				<fo:table table-layout="fixed">
					<fo:table-column column-width="82.4pt"/>
					<fo:table-column column-width="215pt"/>
					<fo:table-column column-width="146.4pt"/>
					<fo:table-body>
						<fo:table-row>
							<fo:table-cell border-style="solid" border-width="0.02cm">
								<fo:block>
									<xsl:value-of select="debtcasenumber"/>
								</fo:block>
							</fo:table-cell>
							<fo:table-cell border-style="solid" border-width="0.02cm">
								<fo:block>
									<xsl:call-template name="convertcase">
										<xsl:with-param name="toconvert">
											<xsl:value-of select="creditor/name"/>
										</xsl:with-param>
										<xsl:with-param name="conversion">proper</xsl:with-param>
									</xsl:call-template>
								</fo:block>
							</fo:table-cell>
							<fo:table-cell border-style="solid" border-width="0.02cm" text-align="right">
								<fo:block>
									<xsl:call-template name="correctCalculation">
										<xsl:with-param name="value">
											<xsl:value-of select="debtamountallowed"/>
										</xsl:with-param>
									</xsl:call-template>
								</fo:block>
							</fo:table-cell>
						</fo:table-row>
					</fo:table-body>
				</fo:table>
			</fo:block>
		</xsl:for-each>
	</xsl:variable-->
	<xsl:variable name="vdBailiffVisitTable">
		<xsl:for-each select="variabledata/notice/visits/visit">
			<fo:table-row keep-with-next="always" border-style="solid">
				<fo:table-cell border-style="solid" border-width="0.02cm">
					<fo:block>
						<xsl:call-template name="format-date-placeholder">
							<xsl:with-param name="date-xpath">
								<xsl:value-of select="visitdate"/>
							</xsl:with-param>
						</xsl:call-template>
					</fo:block>
				</fo:table-cell>
				<fo:table-cell border-style="solid" border-width="0.02cm">
					<xsl:choose>
						<xsl:when test="string-length(time) > 0">
							<fo:block>
								<xsl:value-of select="time"/>
							</fo:block>
						</xsl:when>
						<xsl:otherwise>
							<fo:block>
								<xsl:value-of select="$emptyTime"/>
							</fo:block>
						</xsl:otherwise>
					</xsl:choose>
				</fo:table-cell>
				<fo:table-cell border-style="solid" border-width="0.02cm">
					<fo:block>
						<xsl:value-of select="resultofvisit"/>
					</fo:block>
				</fo:table-cell>
			</fo:table-row>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vdCO">
		<xsl:value-of select="variabledata/notice/bailiffvisitreason"/>
	</xsl:variable>
	<xsl:variable name="vdBailiffVisitReason">
		<xsl:value-of select="variabledata/notice/bailiffvisitreason"/>
	</xsl:variable>
	<xsl:variable name="vdBailiffAreaNumber">
		<xsl:value-of select="variabledata/warrant/bailiffareano"/>
	</xsl:variable>
	<xsl:variable name="vdLetterLeftDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/notice/letterleftdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- Letter 393 END -->
	<!-- Letter 244 BEGIN -->
	<xsl:variable name="vdCounterClaimAmount"> &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/letter/counterclaimamount"/> </xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<!-- Letter 244 END -->
	<!-- Letter 247 BEGIN -->
	<xsl:variable name="vdWhatToDo">
		<xsl:value-of select="variabledata/letter/whattodo"/>
	</xsl:variable>
	<xsl:variable name="vdWhatToDoOther">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/letter/whattodoother"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- Letter 247 END -->
	<!-- Letter 279 BEGIN -->
	<xsl:variable name="vdFeeRetained">
		<xsl:value-of select="variabledata/letter/feeretained"/>
	</xsl:variable>
	<xsl:variable name="vdSuspenseItem">
		<xsl:value-of select="variabledata/letter/suspenseitem"/>
	</xsl:variable>
	<xsl:variable name="vdLetterRequestOth">
		<xsl:value-of select="variabledata/letter/letterrequestoth"/>
	</xsl:variable>
	<xsl:variable name="vdLetterRequestOthOther">
		<xsl:value-of select="variabledata/letter/letterrequestothother"/>
	</xsl:variable>
	<xsl:variable name="vdLetterDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/letter/correspondencedate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdRequestIssue">
		<xsl:value-of select="variabledata/letter/requestissue"/>
	</xsl:variable>
	<xsl:variable name="vdDistrictCircuitJudge">
		<xsl:choose>
			<xsl:when test="$vdEventId='179'">
				<xsl:text>Circuit Judge</xsl:text>
			</xsl:when>
			<xsl:when test="$vdEventId='177'">
				<xsl:text>District Judge</xsl:text>
			</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- Letter 279 END -->
	<!-- Letter 396 BEGIN -->
	<xsl:variable name="vdRCJCaseNo">
		<xsl:value-of select="variabledata/letter/rcjcaseno"/>
	</xsl:variable>
	<xsl:variable name="vdReasonSetAside">
		<xsl:value-of select="variabledata/order/reasonsetaside"/>
	</xsl:variable>
	<xsl:variable name="vdAnythingFurther">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/order/anythingfurther"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- Letter 396 END -->
	<!-- Letter 291 BEGIN -->
	<xsl:variable name="vdEarningsOrderOther">
		<xsl:value-of select="variabledata/notice/earningsorderother"/>
	</xsl:variable>
	<xsl:variable name="vdEarningsOrderOthOther">
		<xsl:value-of select="variabledata/letter/earningsorderothother"/>
	</xsl:variable>
	<xsl:variable name="vdOrderFee"> and fee of &#163;<xsl:call-template 
		name="correctCalculation"> <xsl:with-param name="value"> <xsl:value-of 
		select="variabledata/notice/orderfee"/> </xsl:with-param> 
		</xsl:call-template> </xsl:variable>
	<xsl:variable name="vdCourtSelection">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/letter/courtselection"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- Letter 291 END -->
	<!-- Letter 282 BEGIN -->
	<xsl:variable name="vdAppealNumber">
		<xsl:value-of select="variabledata/letter/appealnumber"/>
	</xsl:variable>
	<xsl:variable name="vdAppealDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/letter/appealdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDefendantAddressMultiline">
		<xsl:copy-of select="variabledata/claim/defendant/address"/>
	</xsl:variable>
	<xsl:variable name="vdClaimantAddressMultiline">
		<!-- <xsl:copy-of select="variabledata/claim/claimant/address"/> -->
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of select="variabledata/claim/claimant/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- Letter 282 END -->
	<!-- Letter 402 BEGIN -->
	<xsl:variable name="vdRefNo">
		<xsl:copy-of select="variabledata/letter/refno"/>
	</xsl:variable>
	<!-- Letter 402 END -->
	<!-- L_8_6 BEGIN -->
	<xsl:variable name="vdAENumber">
		<xsl:copy-of select="variabledata/letter/aenumber"/>
	</xsl:variable>
	<!-- L_8_6 END -->
	<!-- L_5_1 BEGIN -->
	<xsl:variable name="vdReturnProcessType">
		<xsl:copy-of select="variabledata/letter/returnprocesstype"/>
	</xsl:variable>
	<!-- L_5_1 END -->
	<!-- Letter 337 BEGIN -->
	<xsl:variable name="vdExaminationNo">
		<xsl:copy-of select="variabledata/letter/examinationno"/>
	</xsl:variable>
	<xsl:variable name="vdOfferAmount">
		<xsl:value-of select="variabledata/letter/offeramount"/>
	</xsl:variable>
	<!-- Letter 337 END -->
	<!-- Letter 339 BEGIN -->
	<xsl:variable name="vdOENumber">
		<xsl:copy-of select="variabledata/letter/oenumber"/>
	</xsl:variable>
	<xsl:variable name="vdNewCaseNumber">
		<xsl:copy-of select="variabledata/letter/newdebtcasenumber"/>
	</xsl:variable>
	<!-- Letter 339 END -->
	<!-- Letter 348 BEGIN -->
	<xsl:variable name="vdNSReasons">
		<xsl:copy-of select="variabledata/letter/nsreasons"/>
	</xsl:variable>
	<!-- Letter 348 END -->
	<!-- Letter 411 BEGIN -->
	<xsl:variable name="vdCorrespondenceDate">
		<!--xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath"-->
		<xsl:value-of select="variabledata/letter/correspondencedate"/>
		<!--/xsl:with-param>
		</xsl:call-template-->
	</xsl:variable>
	<xsl:variable name="vdOrderAmendedOrder">
		<xsl:choose>
			<xsl:when test="variabledata/letter/orderamendedorder = '1'">order 
				as requested.</xsl:when>
			<xsl:when test="variabledata/letter/orderamendedorder = '2'">
				amended order as request.</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- Letter 411 END -->
	<!-- Letter 039 BEGIN -->
	<xsl:variable name="vdChargeReText">
		<xsl:copy-of select="variabledata/letter/chargeretext"/>
	</xsl:variable>
	<!-- Letter 039 END -->
	<!-- L_BLANK -->
	<xsl:variable name="vdAeJudgmentCreditor">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/aepartyfor" />
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAeJudgmentDebtor">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/aepartyagainst" />
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- end L_BLANK-->
	<xsl:variable name="vdSelectLetter">
		<xsl:copy-of select="variabledata/letter/selectletter"/>
	</xsl:variable>
	<!-- Letter 9_1_2,3,4,9 & 10 -->
	<xsl:variable name="vdletterselectvalue">
		<xsl:value-of select="variabledata/letter/selectletter2"/>
	</xsl:variable>
	<xsl:variable name="vdExamineeOrOfficer">
		<xsl:if 
			test="$vdletterselectvalue=1 or $vdletterselectvalue=3 or $vdletterselectvalue=6">
			<xsl:text>examinee</xsl:text>
		</xsl:if>
		<xsl:if test="$vdletterselectvalue=2 or $vdletterselectvalue=4">
			<xsl:text>officer of the examinee company</xsl:text>
		</xsl:if>
		<xsl:if test="$vdletterselectvalue=5">
			<xsl:text>officer of the judgement debtor</xsl:text>
		</xsl:if>
	</xsl:variable>
	<xsl:variable name="vdSelectLetter2">
		<xsl:choose>
			<xsl:when test="variabledata/letter/selectletter2 = 3">
				<xsl:text>O/E Number</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>Examination Number</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdSelectLetter2Para1">
		<xsl:choose>
			<xsl:when 
				test="$vdletterselectvalue > 0 and 5 > $vdletterselectvalue">
				<xsl:text>The </xsl:text>
				<xsl:value-of select="$vdExamineeOrOfficer"/>
				<xsl:text> has attended an examination and gave a statement 
					about income, expenses, assets and liabilities (copy 
					enclosed). If you are not satisfied with information in the 
					statement you must make a fresh application for an 
					examination, and pay a further fee.</xsl:text>
			</xsl:when>
			<xsl:otherwise>
				<xsl:text>The bailiff has been unable to serve (hand the order 
					personally to) the </xsl:text>
				<xsl:value-of select="$vdExamineeOrOfficer"/>
				<xsl:text> with an order to attend court on the </xsl:text>
				<xsl:value-of select="$vdSelectHearingDate"/>
				<xsl:text>.</xsl:text>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOffer">
		<xsl:if test="$vdletterselectvalue=1 or $vdletterselectvalue=2"> If you 
			do not accept the offer </xsl:if>
		<xsl:if test="$vdletterselectvalue=3"> The examinee has not made an 
			offer, but </xsl:if>
		<xsl:if test="$vdletterselectvalue=4"> The officer has not made an 
			offer, but </xsl:if>
	</xsl:variable>
	<xsl:variable name="vdReasonsNonService">
		<xsl:value-of select="variabledata/letter/reasonsnonservice"/>
	</xsl:variable>
	<xsl:variable name="vdNomine">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/order/nameofnominee"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- Order 0_1_3_4 -->
	<xsl:variable name="vdWarrantSuspended">
		<xsl:value-of select="variabledata/order/warrantsuspended"/>
	</xsl:variable>
	<xsl:variable name="vdOutstandingAmount">
		<xsl:value-of select="variabledata/order/outstandingamount"/>
	</xsl:variable>
	<xsl:variable name="vdBalanceDue">
		<xsl:value-of select="variabledata/order/balancedue"/>
	</xsl:variable>
	<xsl:variable name="vdOrderSuspend">
		<xsl:choose>
			<xsl:when test="variabledata/order/ordersuspend = 'PJ'">
				judgment</xsl:when>
			<xsl:when test="variabledata/order/ordersuspend = 'PO'">
				order</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdOrderSuspendExtended">
		<xsl:choose>
			<xsl:when test="variabledata/order/ordersuspendextended = 'PJ'">the 
				judgment or order be suspended</xsl:when>
			<xsl:when test="variabledata/order/ordersuspendextended = 'WE'">the 
				warrant of control issued in this action be 
				suspended</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdExtensionPeriod">
		<xsl:value-of select="variabledata/order/extensionperiod"/>
	</xsl:variable>
	<xsl:variable name="vdReportDeliveredBy">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/reportdeliveredby"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOrderS255">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/order/orders255"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInterimOrderReasons">
		<xsl:value-of select="variabledata/order/interimordereasons"/>
	</xsl:variable>
	<xsl:variable name="vdServedOnOR">
		<xsl:value-of select="variabledata/order/servedonor"/>
	</xsl:variable>
	<xsl:variable name="vdOrderSubPetReason">
		<xsl:value-of select="variabledata/order/ordersubpetreason"/>
	</xsl:variable>
	<xsl:variable name="vdStatutoryDeposit">
		<xsl:value-of select="variabledata/order/statutorydeposit"/>
	</xsl:variable>
	<xsl:variable name="vdStatutoryDepositReserved">
		<xsl:value-of select="variabledata/order/statutorydepositreserved"/>
	</xsl:variable>
	<xsl:variable name="vdPriorInstigatorName">
		<!-- Discontinued as event 659 isn't a pre-requisite for O_10_8 and O_10_9 anymore -->
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/event/e659/instigator/name" 
					/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdOriginalPetitioner">
		<xsl:variable name="id">
			<xsl:value-of select="variabledata/order/originalpetitioner"/>
		</xsl:variable>
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="/variabledata/claim/creditor[id=$id]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDaysServedBy">
		<xsl:value-of select="variabledata/order/daysservedby"/>
	</xsl:variable>
	<xsl:variable name="vdPractitionerName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of select="variabledata/order/practitionername"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDescription">
		<xsl:call-template name="formatTextAreaText">
			<xsl:with-param name="text">
				<xsl:copy-of select="variabledata/order/description"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdEndorsementOrder">
		<xsl:value-of select="variabledata/order/endorsementorder"/>
	</xsl:variable>
	<xsl:variable name="vdUnFormattedReceiverAddress">
		<xsl:copy-of select="variabledata/claim/officialreceiver/address"/>
	</xsl:variable>
	<xsl:variable name="vdReceiverAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/claim/officialreceiver/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdInsolvencySectionAddress">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:copy-of 
					select="variabledata/order/insolvencysection/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAppPresentedDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/apppresenteddate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDescriptionOfApplicant">
		<xsl:value-of select="variabledata/order/descriptionapplicant"/>
	</xsl:variable>
	<xsl:variable name="vdBankruptcyOrder">
		<xsl:choose>
			<xsl:when test="variabledata/order/bankruptcyorder = 'BNM'">the 
				bankruptcy order ought not to have been made</xsl:when>
			<xsl:when test="variabledata/order/bankruptcyorder = 'BEP'">the 
				bankruptcy debts and the expenses of the bankruptcy have all 
				been paid or secured to the satisfaction of the court</xsl:when>
			<xsl:when test="variabledata/order/bankruptcyorder = 'BAN'">under 
				Section 282(2) of the Insolvency Act 1986 the bankruptcy order 
				ought to be annulled</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdBankruptcyDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/bankruptcydate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdRegistrationDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/registrationdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdLRReference">
		<xsl:value-of select="variabledata/order/lrreference"/>
	</xsl:variable>
	<xsl:variable name="vdWritDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of 
					select="variabledata/order/registrationwritsdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWritReference">
		<xsl:value-of select="variabledata/order/referencenumber"/>
	</xsl:variable>
	<xsl:variable name="vdNotificationInDays">
		<xsl:value-of select="variabledata/order/notificationindays"/>
	</xsl:variable>
	<xsl:variable name="vdStatutoryDemandDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/statutorydemanddate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAffidavitSupportDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/affidavitsupportdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdReportDate">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<xsl:value-of select="variabledata/order/reportdate"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDebtorAttendance">
		<xsl:choose>
			<xsl:when test="variabledata/order/debtorattendance = 'DIR'">And 
				the debtor is directed to attend the hearing</xsl:when>
			<xsl:when test="variabledata/order/debtorattendance = 'MA'">And the 
				debtor may attend the hearing</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!--  Release 7 Variables END -->
	<xsl:variable name="numOfNoHopers">
		<xsl:value-of 
			select="count(variabledata/claim/hearing/hearingreasonclaimantdefendant/partyid)"/>
	</xsl:variable>
	<xsl:variable name="vdHearingReasonClaimantDefendant">
		<xsl:for-each 
			select="variabledata/claim/hearing/hearingreasonclaimantdefendant/partyid">
			<xsl:if test="position()=last() and position() > 1">
				<xsl:text> and </xsl:text>
			</xsl:if>
			<xsl:variable name="partyId">
				<xsl:value-of select="."/>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="/variabledata/claim/claimant[id = $partyId]">
					claimant <xsl:call-template name="convertcase"> 
					<xsl:with-param name="toconvert"> <xsl:value-of 
					select="/variabledata/claim/claimant[id = $partyId]/name"/> 
					</xsl:with-param> <xsl:with-param 
					name="conversion">proper</xsl:with-param> 
					</xsl:call-template> </xsl:when>
				<xsl:otherwise> defendant <xsl:call-template 
					name="convertcase"> <xsl:with-param name="toconvert"> 
					<xsl:value-of 
					select="/variabledata/claim/defendant[id = $partyId]/name"/> 
					</xsl:with-param> <xsl:with-param 
					name="conversion">proper</xsl:with-param> 
					</xsl:call-template> </xsl:otherwise>
			</xsl:choose>
			<xsl:if test="(position()!=last()) and (position()!=(last()-1))">
				<xsl:text>, </xsl:text>
			</xsl:if>
		</xsl:for-each>
		<xsl:if test="$numOfNoHopers > 1"> have </xsl:if>
		<xsl:if test="$numOfNoHopers = 1"> has </xsl:if>
	</xsl:variable>
	<xsl:variable name="emptyAddress">
		<xsl:text>__________________________________________________</xsl:text>
	</xsl:variable>
	<xsl:variable name="vdDateOfBirth">
		<xsl:call-template name="format-date-placeholder">
			<xsl:with-param name="date-xpath">
				<!--<xsl:value-of select="variabledata/claim/claimant/dateofbirth"/>-->
				<xsl:value-of 
					select="variabledata/claim/defendant[./number = $vdSubjectNumber]/dateofbirth"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdDateOfBirthForSubject">
		<xsl:value-of 
			select="/variabledata/claim/*[./number = $vdSubjectNumber and ./type = $vdSubjectType]/dateofbirth"/>
		<!-- Less Efficient way was refactored above. Will keep until very sure.		
		<xsl:choose>
			<xsl:when test="$vdSubjectType = 'claimant'">
				<xsl:value-of select="variabledata/claim/claimant[./number = $vdSubjectNumber]/dateofbirth"/>
			</xsl:when>
			<xsl:when test="$vdSubjectType = 'defendant'">
				<xsl:value-of select="variabledata/claim/defendant[./number = $vdSubjectNumber]/dateofbirth"/>
			</xsl:when>		
			<xsl:when test="$vdSubjectType = 'part20claimant'">
				<xsl:value-of select="variabledata/claim/part20claimant[./number = $vdSubjectNumber]/dateofbirth"/>
			</xsl:when>		
			<xsl:when test="$vdSubjectType = 'part20defendant'">
				<xsl:value-of select="variabledata/claim/part20defendant[./number = $vdSubjectNumber]/dateofbirth"/>
			</xsl:when>	
			<xsl:when test="$vdSubjectType = 'debtor'">
				<xsl:value-of select="variabledata/claim/debtor[./number = $vdSubjectNumber]/dateofbirth"/>
			</xsl:when>		
			<xsl:when test="$vdSubjectType = 'creditor'">
				<xsl:value-of select="variabledata/claim/creditor[./number = $vdSubjectNumber]/dateofbirth"/>
			</xsl:when>
			<xsl:when test="$vdSubjectType = 'applicant'">
				<xsl:value-of select="variabledata/claim/applicant[./number = $vdSubjectNumber]/dateofbirth"/>
			</xsl:when>			
			<xsl:when test="$vdSubjectType = 'petitioner'">
				<xsl:value-of select="variabledata/claim/petitioner[./number = $vdSubjectNumber]/dateofbirth"/>
			</xsl:when>															
		</xsl:choose>
-->
	</xsl:variable>
	<!-- Those subjects that are eligible for date of birth formatting. 
		These are the only party types for whom Date of Birth can be enetered on Client application -->
	<xsl:variable name="vdSubjectType">
		<xsl:choose>
			<xsl:when test="$vdSubjectPartyRoleCode = 'CLAIMANT'">claimant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'DEFENDANT'">defendant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 CLMT'">part20claimant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PT 20 DEF'">part20defendant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'DEBTOR'">debtor</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'CREDITOR'">creditor</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'APPLICANT'">applicant</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'PETITIONER'">petitioner</xsl:when>
			<xsl:when test="$vdSubjectPartyRoleCode = 'TRUSTEE'">trustee</xsl:when>
		</xsl:choose>
	</xsl:variable>
	<!-- EX96 BEGIN -->
	<xsl:variable name="vdWarrantPartyForName">
		<xsl:value-of 
			select="variabledata/warrant/warrantparties/warrantpartyfor/name"/>
	</xsl:variable>
	<xsl:variable name="vdWarrantClaimantName">
		<xsl:value-of 
			select="variabledata/warrant/warrantparties/warrantpartyfor/claimantname"/>
	</xsl:variable>
	<xsl:variable name="vdWarrantPartyForReference">
		<xsl:value-of 
			select="variabledata/warrant/warrantparties/warrantpartyfor/reference"/>
	</xsl:variable>
	<xsl:variable name="vdWarrantPartyForTelephoneNumber">
		<xsl:value-of 
			select="variabledata/warrant/warrantparties/warrantpartyfor/telephonenumber"/>
	</xsl:variable>
	<xsl:variable name="vdWarrantPartyAgainstName">
		<xsl:value-of 
			select="variabledata/warrant/warrantparties/warrantpartyagainst1/name"/>
	</xsl:variable>
	<xsl:variable name="vdWarrantPartyAgainstAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:copy-of 
					select="variabledata/warrant/warrantparties/warrantpartyagainst1/address"/>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<!-- TD 5229 -->
	<xsl:variable name="vdSelectedWarrantPartyAgainstType">
		<xsl:value-of 
			select="/variabledata/warrant/warrantparties/selectedwarrantpartyagainst/type"/>
	</xsl:variable>
	<xsl:variable name="vdSelectedWarrantPartyAgainstNumber">
		<xsl:value-of 
			select="/variabledata/warrant/warrantparties/selectedwarrantpartyagainst/number"/>
	</xsl:variable>
	<xsl:variable name="vdSelectedWarrantPartyAgainstName">
		<xsl:call-template name="convertcase">
			<xsl:with-param name="toconvert">
				<xsl:value-of 
					select="/variabledata/warrant/warrantparties/*[type=$vdSelectedWarrantPartyAgainstType and number=$vdSelectedWarrantPartyAgainstNumber]/name"/>
			</xsl:with-param>
			<xsl:with-param name="conversion">proper</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSelectedWarrantPartyAgainstAddress">
		<xsl:call-template name="format-address-single-line">
			<xsl:with-param name="theAddress">
				<xsl:choose>
					<xsl:when 
						test="variabledata/warrant/warrantparties/warrantpartyagainst1/number = $vdSelectedWarrantPartyAgainstNumber">
						<xsl:copy-of 
							select="variabledata/warrant/warrantparties/warrantpartyagainst1/address"/>
					</xsl:when>
					<xsl:when 
						test="variabledata/warrant/warrantparties/warrantpartyagainst2/number = $vdSelectedWarrantPartyAgainstNumber">
						<xsl:copy-of 
							select="variabledata/warrant/warrantparties/warrantpartyagainst2/address"/>
					</xsl:when>
				</xsl:choose>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdSelectedWarrantPartyAgainstAddressMultiLine">
		<xsl:call-template name="format-address-multi-line">
			<xsl:with-param name="party">
				<xsl:choose>
					<xsl:when 
						test="variabledata/warrant/warrantparties/warrantpartyagainst1/number = $vdSelectedWarrantPartyAgainstNumber">
						<xsl:copy-of 
							select="variabledata/warrant/warrantparties/warrantpartyagainst1/*"/>
					</xsl:when>
					<xsl:when 
						test="variabledata/warrant/warrantparties/warrantpartyagainst2/number = $vdSelectedWarrantPartyAgainstNumber">
						<xsl:copy-of 
							select="variabledata/warrant/warrantparties/warrantpartyagainst2/*"/>
					</xsl:when>
				</xsl:choose>
			</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdAppointmentAddress">
		<xsl:choose>
			<xsl:when test="variabledata/notice/possessionproperty/address">
				<xsl:call-template name="format-address-single-line">
					<xsl:with-param name="theAddress">
						<xsl:copy-of 
							select="variabledata/notice/possessionproperty/address"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdSelectedWarrantPartyAgainstAddress"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdWarrantCaseNumber">
		<xsl:value-of select="variabledata/warrant/warrantcasenumber"/>
	</xsl:variable>
	
	<xsl:variable name="vdFooterCourtName">
		<xsl:choose>
			<xsl:when test="$vdCourtCode = '335' and $vdCreditorCode = '1999'">
				<xsl:value-of select="$vdMCOLUserOrCaseCourtNameProper"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$vdUserOrCaseCourtNameProper"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="vdFooterCourtTelephoneFax">
		<xsl:choose>
			<xsl:when test="$vdExecutingOrCourtCode = '335' and $vdCreditorCode = '1999'">
				<xsl:if test="string-length($vdMCOLCourtTelephoneNumber) > 0">
					 Tel: <xsl:value-of select="$vdMCOLCourtTelephoneNumber"/>
				</xsl:if>
				<xsl:if test="string-length($vdMCOLCourtFaxNumber) > 0">
					 Fax: <xsl:value-of select="$vdMCOLCourtFaxNumber"/>
				</xsl:if>
				<xsl:if test="string-length($vdMCOLCourtTelephoneNumber) > 0 or string-length($vdMCOLCourtFaxNumber) > 0">
					<xsl:text>. </xsl:text>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:if test="string-length($vdUserCourtTelephone) > 0">
					 Tel: <xsl:value-of select="$vdUserCourtTelephone"/>
				</xsl:if>
				<xsl:if test="string-length($vdUserCourtFax) > 0">
					 Fax: <xsl:value-of select="$vdUserCourtFax"/>
				</xsl:if>
				<xsl:if test="string-length($vdUserCourtTelephone) > 0 or string-length($vdUserCourtFax) > 0">
					<xsl:text>. </xsl:text>
				</xsl:if>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<!-- TD 5229 -->
	<!-- EX96 END -->
	<xsl:template name="attendees">
		<xsl:param name="path"/>
		<xsl:variable name="otherpath">/attendees/attendee[attendance = 
			'5']</xsl:variable>
		<xsl:variable name="other">
			<xsl:copy-of select="xalan:evaluate(concat($path,$otherpath))"/>
		</xsl:variable>
		<xsl:variable name="letterpath">/attendees/attendee[attendance = 
			'4']</xsl:variable>
		<xsl:variable name="letter">
			<xsl:copy-of select="xalan:evaluate(concat($path,$letterpath))"/>
		</xsl:variable>
		<xsl:variable name="personpath">/attendees/attendee[attendance = 
			'3']</xsl:variable>
		<xsl:variable name="person">
			<xsl:copy-of select="xalan:evaluate(concat($path,$personpath))"/>
		</xsl:variable>
		<xsl:variable name="solicitorpath">/attendees/attendee[attendance = 
			'2']</xsl:variable>
		<xsl:variable name="solicitor">
			<xsl:copy-of select="xalan:evaluate(concat($path,$solicitorpath))"/>
		</xsl:variable>
		<xsl:variable name="counselpath">/attendees/attendee[attendance = 
			'1']</xsl:variable>
		<xsl:variable name="counsel">
			<xsl:copy-of select="xalan:evaluate(concat($path,$counselpath))"/>
		</xsl:variable>
		<xsl:if 
			test="string-length($other) > 0 or string-length($letter) > 0 or string-length($person) > 0 or string-length($solicitor) > 0 or string-length($counsel) > 0">
			 Upon </xsl:if>
		<xsl:if test="string-length($letter) > 0"> reading a letter from 
			<xsl:call-template name="party"> <xsl:with-param 
			name="input">4</xsl:with-param> <xsl:with-param name="path"> 
			<xsl:value-of select="$path"/> </xsl:with-param> 
			</xsl:call-template> <xsl:choose> <xsl:when 
			test="string-length($person) > 0 and string-length($solicitor) = 0 and string-length($counsel) = 0 and string-length($other) = 0">&#xA0;and</xsl:when> 
			<xsl:when 
			test="string-length($person) = 0 and string-length($solicitor) = 0 and string-length($counsel) = 0 and string-length($other) = 0"/> 
			<xsl:otherwise>, </xsl:otherwise> </xsl:choose> </xsl:if>
		<xsl:if test="string-length($person) > 0"> <xsl:variable 
			name="punction"> <xsl:choose> <xsl:when 
			test="string-length($solicitor) > 0 and string-length($counsel) = 0 and string-length($other) = 0">&#xA0;and</xsl:when> 
			<xsl:when 
			test="string-length($solicitor) = 0 and string-length($counsel) = 0 and string-length($other) = 0"/> 
			<xsl:otherwise>, </xsl:otherwise> </xsl:choose> </xsl:variable> 
			hearing <xsl:call-template name="party"> <xsl:with-param 
			name="input">3</xsl:with-param> <xsl:with-param name="path"> 
			<xsl:value-of select="$path"/> </xsl:with-param> 
			</xsl:call-template> in person<xsl:value-of select="$punction"/> 
			</xsl:if>
		<xsl:if test="string-length($solicitor) > 0"> hearing 
			<xsl:call-template name="party"> <xsl:with-param 
			name="input">2</xsl:with-param> <xsl:with-param name="path"> 
			<xsl:value-of select="$path"/> </xsl:with-param> 
			</xsl:call-template> <xsl:choose> <xsl:when 
			test="string-length($counsel) > 0 and string-length($other) = 0">&#xA0;and</xsl:when> 
			<xsl:when 
			test="string-length($counsel) = 0 and string-length($other) = 0"/> 
			<xsl:otherwise>, </xsl:otherwise> </xsl:choose> </xsl:if>
		<xsl:if test="string-length($counsel) > 0"> hearing <xsl:call-template 
			name="party"> <xsl:with-param name="input">1</xsl:with-param> 
			<xsl:with-param name="path"> <xsl:value-of select="$path"/> 
			</xsl:with-param> </xsl:call-template> <xsl:choose> <xsl:when 
			test="string-length($other) > 0">&#xA0;and</xsl:when> <xsl:when 
			test="string-length($other) = 0"/> <xsl:otherwise>, 
			</xsl:otherwise> </xsl:choose> </xsl:if>
		<xsl:if test="string-length($other) > 0"> hearing <xsl:call-template 
			name="party"> <xsl:with-param name="input">5</xsl:with-param> 
			<xsl:with-param name="path"> <xsl:value-of select="$path"/> 
			</xsl:with-param> </xsl:call-template> </xsl:if>
	</xsl:template>
	<xsl:template name="party">
		<xsl:param name="input"/>
		<xsl:param name="path"/>
		<xsl:variable name="isClaimantMultiplePath">/attendees/attendee[type = 
			'CLAIMANT']</xsl:variable>
		<xsl:variable name="isClaimantMultiple">
			<xsl:for-each 
				select="xalan:evaluate(concat($path,$isClaimantMultiplePath))">
				<xsl:variable name="innumber">
					<xsl:value-of select="number"/>
				</xsl:variable>
				<xsl:if test="$innumber = '2'"> Y </xsl:if>
			</xsl:for-each>
		</xsl:variable>
		<xsl:variable name="isDefendantMultiplePath">/attendees/attendee[type = 
			'DEFENDANT']</xsl:variable>
		<xsl:variable name="isDefendantMultiple">
			<xsl:for-each 
				select="xalan:evaluate(concat($path,$isDefendantMultiplePath))">
				<xsl:variable name="innumber">
					<xsl:value-of select="number"/>
				</xsl:variable>
				<xsl:if test="$innumber = '2'"> Y </xsl:if>
			</xsl:for-each>
		</xsl:variable>
		<xsl:variable name="isPT20ClaimantMultiplePath">
			/attendees/attendee[type = 'PT 20 CLMT']</xsl:variable>
		<xsl:variable name="isPT20ClaimantMultiple">
			<xsl:for-each 
				select="xalan:evaluate(concat($path,$isPT20ClaimantMultiplePath))">
				<xsl:variable name="innumber">
					<xsl:value-of select="number"/>
				</xsl:variable>
				<xsl:if test="$innumber = '2'"> Y </xsl:if>
			</xsl:for-each>
		</xsl:variable>
		<xsl:variable name="isPT20DefendantMultiplePath">
			/attendees/attendee[type = 'PT 20 DEF']</xsl:variable>
		<xsl:variable name="isPT20DefendantMultiple">
			<xsl:for-each 
				select="xalan:evaluate(concat($path,$isPT20DefendantMultiplePath))">
				<xsl:variable name="innumber">
					<xsl:value-of select="number"/>
				</xsl:variable>
				<xsl:if test="$innumber = '2'"> Y </xsl:if>
			</xsl:for-each>
		</xsl:variable>
		<xsl:variable name="isDebtorMultiplePath">/attendees/attendee[type = 
			'Debtor']</xsl:variable>
		<xsl:variable name="isDebtorMultiple">
			<xsl:for-each 
				select="xalan:evaluate(concat($path,$isDebtorMultiplePath))">
				<xsl:variable name="innumber">
					<xsl:value-of select="number"/>
				</xsl:variable>
				<xsl:if test="$innumber = '2'"> Y </xsl:if>
			</xsl:for-each>
		</xsl:variable>
		<xsl:variable name="isCreditorMultiplePath">/attendees/attendee[type = 
			'Creditor']</xsl:variable>
		<xsl:variable name="isCreditorMultiple">
			<xsl:for-each 
				select="xalan:evaluate(concat($path,$isCreditorMultiplePath))">
				<xsl:variable name="innumber">
					<xsl:value-of select="number"/>
				</xsl:variable>
				<xsl:if test="$innumber = '2'"> Y </xsl:if>
			</xsl:for-each>
		</xsl:variable>
		<xsl:variable name="isEmployerMultiplePath">/attendees/attendee[type = 
			'Employer']</xsl:variable>
		<xsl:variable name="isEmployerMultiple">
			<xsl:for-each 
				select="xalan:evaluate(concat($path,$isEmployerMultiplePath))">
				<xsl:variable name="innumber">
					<xsl:value-of select="number"/>
				</xsl:variable>
				<xsl:if test="$innumber = '2'"> Y </xsl:if>
			</xsl:for-each>
		</xsl:variable>
		<xsl:variable name="newPath">/attendees/attendee[attendance = 
			$input]</xsl:variable>
		<xsl:for-each select="xalan:evaluate(concat($path,$newPath))">
			<xsl:if test="$input=2"> the Solicitor for </xsl:if>
			<xsl:if test="$input=1"> Counsel for </xsl:if>
			<xsl:if test="$input=5"> <xsl:value-of select="other"/> on behalf 
				of </xsl:if>
			<xsl:variable name="number">
				<xsl:value-of select="number"/>
			</xsl:variable>
			<xsl:variable name="numbersuffix">
				<xsl:call-template name="numberpostfix">
					<xsl:with-param name="number">
						<xsl:value-of select="number"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:variable>
			<xsl:variable name="type">
				<xsl:value-of select="type"/>
			</xsl:variable>
			<xsl:choose>
				<xsl:when test="$type = 'CLAIMANT'"> the <xsl:if 
					test="normalize-space($isClaimantMultiple) = 'Y'"> 
					<xsl:value-of select="$numbersuffix"/> </xsl:if> 
					<xsl:choose> <xsl:when 
					test="$vdWarrantEventCode !=''">Creditor</xsl:when> 
					<xsl:when 
					test="$vdDistrictRegistry = 'F'">Creditor</xsl:when>
					<xsl:otherwise>Claimant</xsl:otherwise> </xsl:choose> 
					</xsl:when>
				<xsl:when test="$type = 'DEFENDANT'"> the <xsl:if 
					test="normalize-space($isDefendantMultiple) = 'Y'"> 
					<xsl:value-of select="$numbersuffix"/> </xsl:if> 
					<xsl:choose> <xsl:when 
					test="$vdWarrantEventCode != ''">Debtor</xsl:when>
					<xsl:when 
					test="$vdDistrictRegistry = 'F'">Debtor</xsl:when>
					<xsl:otherwise>Defendant</xsl:otherwise> </xsl:choose> 
					</xsl:when>
				<xsl:when test="$type = 'PT 20 CLMT'"> the <xsl:if 
					test="normalize-space($isPT20ClaimantMultiple) = 'Y'"> 
					<xsl:value-of select="$numbersuffix"/> </xsl:if> Part 20 
					Claimant</xsl:when>
				<xsl:when test="$type = 'PT 20 DEF'"> the <xsl:if 
					test="normalize-space($isPT20DefendantMultiple) = 'Y'"> 
					<xsl:value-of select="$numbersuffix"/> </xsl:if> Part 20 
					Defendant</xsl:when>
				<xsl:when test="$type = 'Debtor'"> the <xsl:if 
					test="normalize-space($isDebtorMultiple) = 'Y'"> 
					<xsl:value-of select="$numbersuffix"/> </xsl:if> 
					Debtor</xsl:when>
				<xsl:when test="$type = 'Creditor'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of 
								select="/variabledata/order/coorder/debts/debt[position() = $number]/creditor/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">
							proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'Employer'"> the <xsl:if 
					test="normalize-space($isEmployerMultiple) = 'Y'"> 
					<xsl:value-of select="$numbersuffix"/> </xsl:if> Debtor's 
					Employer</xsl:when>
				<xsl:when test="$type = 'DEBTOR'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of 
								select="/variabledata/claim/debtor[position()=$number]/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">
							proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'CREDITOR'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of 
								select="/variabledata/claim/creditor[position()=$number]/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">
							proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'EMPLOYER'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of 
								select="/variabledata/claim/employer[position()=$number]/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">
							proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'COMPANY'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of 
								select="/variabledata/claim/company[position()=$number]/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">
							proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'APPLICANT'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of 
								select="/variabledata/claim/applicant[position()=$number]/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">
							proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'PETITIONER'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of 
								select="/variabledata/claim/petitioner[position()=$number]/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">
							proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'TRUSTEE'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of 
								select="/variabledata/claim/trustee[position()=$number]/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">
							proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'INS PRAC'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of 
								select="/variabledata/claim/insolvencypractitioner[position()=$number]/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">
							proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:when test="$type = 'OFF REC'">
					<xsl:call-template name="convertcase">
						<xsl:with-param name="toconvert">
							<xsl:value-of 
								select="/variabledata/claim/officialreceiver[position()=$number]/name"/>
						</xsl:with-param>
						<xsl:with-param name="conversion">
							proper</xsl:with-param>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise/>
			</xsl:choose>
			<xsl:if 
				test="position()=last()-1 or (position()!=last() and $input=5)">
				<xsl:text> and </xsl:text>
			</xsl:if>
			<xsl:if 
				test="position()!=last()-1 and position() != last() and $input!=5">
				<xsl:text>, </xsl:text>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
	<xsl:template name="SUPSFOCourtCase_Set1">
		<court>
			<fo:block text-align="left" font-size="12pt" font-weight="bold">
				<xsl:value-of select="$vdCourtDivision"/>
			</fo:block>
			<fo:block text-align="center">
				<xsl:value-of select="$vdCourtName"/>
			</fo:block>
			<fo:block text-align="right">
				<xsl:value-of select="$vdCourtOrDistrict"/>
			</fo:block>
		</court>
		<caseparameters>
			<supsfo:parameter>
				<supsfo:name>
					<fo:block font-weight="bold">Claim Number</fo:block>
				</supsfo:name>
				<supsfo:value>
					<fo:block>
						<xsl:value-of select="$vdClaimNumber"/>
					</fo:block>
				</supsfo:value>
			</supsfo:parameter>
			<supsfo:parameter>
				<supsfo:name>
					<fo:block font-weight="bold">Claimant</fo:block>
					<fo:block font-size="9pt">(including ref.)</fo:block>
				</supsfo:name>
				<supsfo:value>
					<fo:block>
						<xsl:value-of select="$vdClaimantName"/>
					</fo:block>
					<fo:block font-size="9pt">
						<xsl:value-of select="$vdClaimantReference"/>
					</fo:block>
				</supsfo:value>
			</supsfo:parameter>
			<supsfo:parameter>
				<supsfo:name>
					<fo:block font-weight="bold">Defendant(s)</fo:block>
				</supsfo:name>
				<supsfo:value>
					<fo:block>
						<xsl:value-of select="$vdDefendantName"/>
					</fo:block>
				</supsfo:value>
			</supsfo:parameter>
			<supsfo:parameter>
				<supsfo:name>
					<fo:block font-weight="bold">Issue Fee</fo:block>
				</supsfo:name>
				<supsfo:value>
					<fo:block>&#163;<xsl:value-of select="$vdIssueFee"/> 
						</fo:block>
				</supsfo:value>
			</supsfo:parameter>
		</caseparameters>
	</xsl:template>
	
	<!-- Start Single Court Changes -->
	
	<xsl:variable name="vdCourtHeaderBlock">
		<xsl:choose>
			<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
				<!-- High court case type, behave as did previously -->
				<fo:block text-align="left" font-size="12pt" font-weight="bold">
					<xsl:copy-of select="$vdCourtDivision"/>
				</fo:block>
				<xsl:choose>
					<xsl:when test="variabledata/subdivision = 'T'">
						<fo:block text-align="left" font-weight="bold"><xsl:value-of select="$vdCourtName"/> District Registry</fo:block>
						<fo:block text-align="left" font-weight="bold">Technology and Construction Court</fo:block>
					</xsl:when>
					<xsl:when test="variabledata/subdivision = 'M'">
						<fo:block text-align="left" font-weight="bold"><xsl:value-of select="$vdCourtName"/> District Registry</fo:block>
						<fo:block text-align="left" font-weight="bold">Mercantile Court</fo:block>
					</xsl:when>
					<xsl:otherwise>
						<fo:block text-align="center" font-weight="bold">
							<xsl:value-of select="$vdCourtName"/>
						</fo:block>
						<fo:block text-align="right" font-weight="bold">
							<xsl:value-of select="$vdCourtOrDistrict"/>
						</fo:block>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdDistrictRegistry = 'F'">
				<!-- Family court -->
				<fo:block text-align="left" font-size="12pt" font-weight="bold">
					In the Family Court at
				</fo:block>
				<fo:block text-align="center" font-weight="bold">
					<xsl:value-of select="$vdCourtName"/>
				</fo:block>
				<fo:block text-align="right" font-weight="bold">&#xA0;</fo:block>
			</xsl:when>
			<xsl:otherwise>
				<!-- County court case type -->
				<xsl:choose>
					<xsl:when test="$vdCourtCode = '335'">
						<!-- CCBC case -->
						<fo:block text-align="left" font-size="12pt" font-weight="bold">In the</fo:block>
						<fo:block text-align="center" font-weight="bold">County Court Business Centre</fo:block>
						<fo:block text-align="right" font-weight="bold">&#xA0;</fo:block>
					</xsl:when>
					<xsl:when test="$vdCourtCode = '390' or $vdCourtCode = '391'">
						<!-- CCMCC case -->
						<fo:block text-align="left" font-size="12pt" font-weight="bold">In the</fo:block>
						<fo:block text-align="center" font-weight="bold">County Court Money Claims Centre</fo:block>
						<fo:block text-align="right" font-weight="bold">&#xA0;</fo:block>
					</xsl:when>
					<xsl:otherwise>
						<!-- Normal county court -->
						<fo:block text-align="left" font-size="12pt" font-weight="bold">
							In the County Court at
						</fo:block>
						<fo:block text-align="center" font-weight="bold">
							<xsl:value-of select="$vdCourtName"/>
						</fo:block>
						<fo:block text-align="right" font-weight="bold">&#xA0;</fo:block>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<xsl:variable name="vdWarrantCourtHeaderBlock">
		<xsl:choose>
			<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
				<!-- High court case type, behave as did previously -->
				<fo:block text-align="left" font-size="12pt" font-weight="bold">
					<xsl:copy-of select="$vdCourtDivision"/>
				</fo:block>
				<xsl:choose>
					<xsl:when test="variabledata/subdivision = 'T'">
						<fo:block text-align="left" font-weight="bold"><xsl:value-of select="$vdUserOrCaseCourtNameProper"/> District Registry</fo:block>
						<fo:block text-align="left" font-weight="bold">Technology and Construction Court</fo:block>
					</xsl:when>
					<xsl:when test="variabledata/subdivision = 'M'">
						<fo:block text-align="left" font-weight="bold"><xsl:value-of select="$vdUserOrCaseCourtNameProper"/> District Registry</fo:block>
						<fo:block text-align="left" font-weight="bold">Mercantile Court</fo:block>
					</xsl:when>
					<xsl:otherwise>
						<fo:block text-align="center" font-weight="bold">
							<xsl:value-of select="$vdUserOrCaseCourtNameProper"/>
						</fo:block>
						<fo:block text-align="right" font-weight="bold">
							<xsl:value-of select="$vdCourtOrDistrict"/>
						</fo:block>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="$vdDistrictRegistry = 'F'">
				<!-- Family court -->
				<fo:block text-align="left" font-size="12pt" font-weight="bold">
					In the Family Court at
				</fo:block>
				<fo:block text-align="center" font-weight="bold">
					<xsl:value-of select="$vdUserOrCaseCourtNameProper"/>
				</fo:block>
				<fo:block text-align="right" font-weight="bold">&#xA0;</fo:block>
			</xsl:when>
			<xsl:otherwise>
				<!-- County court case type -->
				<xsl:choose>
					<xsl:when test="$vdExecutingOrCourtCode = '335'">
						<!-- CCBC case -->
						<fo:block text-align="left" font-size="12pt" font-weight="bold">In the</fo:block>
						<fo:block text-align="center" font-weight="bold">County Court Business Centre</fo:block>
						<fo:block text-align="right" font-weight="bold">&#xA0;</fo:block>
					</xsl:when>
					<xsl:when test="$vdExecutingOrCourtCode = '390' or $vdExecutingOrCourtCode = '391'">
						<!-- CCMCC case -->
						<fo:block text-align="left" font-size="12pt" font-weight="bold">In the</fo:block>
						<fo:block text-align="center" font-weight="bold">County Court Money Claims Centre</fo:block>
						<fo:block text-align="right" font-weight="bold">&#xA0;</fo:block>
					</xsl:when>
					<xsl:otherwise>
						<!-- Normal county court -->
						<fo:block text-align="left" font-size="12pt" font-weight="bold">
							In the County Court at
						</fo:block>
						<fo:block text-align="center" font-weight="bold">
							<xsl:value-of select="$vdUserOrCaseCourtNameProper"/>
						</fo:block>
						<fo:block text-align="right" font-weight="bold">&#xA0;</fo:block>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<xsl:variable name="vdFooterCourtNameDescription">
		<xsl:choose>
			<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
				<!-- High court case type, behave as did previously -->
				<xsl:value-of select="$vdUserOrCaseCourtNameProper"/>&#xA0;<xsl:value-of select="$vdCourtOrDistrict"/>
			</xsl:when>
			<xsl:when test="$vdDistrictRegistry = 'F'">the Family Court at <xsl:value-of select="$vdUserOrCaseCourtNameProper"/></xsl:when>
			<xsl:otherwise>
				<!-- County court case type -->
				<xsl:choose>
					<!-- MCOL case -->
					<xsl:when test="$vdLetterCourtCode = '335' and $vdCreditorCode = '1999'">Money Claim Online, County Court Business Centre</xsl:when>
					<!-- CCBC case -->
					<xsl:when test="$vdLetterCourtCode = '335'">the County Court Business Centre</xsl:when>
					<!-- CCMCC case -->
					<xsl:when test="$vdLetterCourtCode = '390' or $vdLetterCourtCode = '391'">the County Court Money Claims Centre</xsl:when>
					<!-- Normal county court -->
					<xsl:otherwise>the County Court at <xsl:value-of select="$vdUserOrCaseCourtNameProper"/></xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<xsl:template name="court-name-description">
		<xsl:param name="mcolCheck"/>
		<xsl:param name="courtName"/>
		<xsl:param name="courtCode"/>
		<xsl:param name="highCourtPrefix"/>
		<xsl:choose>
			<xsl:when test="string-length($vdDistrictRegistry) > 0 and $vdDistrictRegistry != 'F'">
				<!-- Case is District Registry -->
				<xsl:if test="$highCourtPrefix='Y'">the </xsl:if>
				<xsl:value-of select="$courtName"/>&#xA0;<xsl:value-of select="$vdCourtOrDistrict"/>
			</xsl:when>
			<xsl:when test="$vdDistrictRegistry = 'F'">the Family Court at <xsl:value-of select="$courtName"/></xsl:when>
			<xsl:otherwise>
				<!-- Case is County Court -->
				<xsl:choose>
					<!-- MCOL case -->
					<xsl:when test="$mcolCheck = 'Y' and $courtCode = '335' and $vdCreditorCode = '1999'">Money Claim Online, County Court Business Centre</xsl:when>
					<!-- CCBC case -->
					<xsl:when test="$courtCode = '335'">the County Court Business Centre</xsl:when>
					<!-- CCMCC case -->
					<xsl:when test="$courtCode = '390' or $courtCode = '391'">the County Court Money Claims Centre</xsl:when>
					<!-- Normal county court -->
					<xsl:otherwise>the County Court at <xsl:value-of select="$courtName"/></xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="transfer-court-name-description">
		<xsl:param name="highCourtPrefix"/>
		<xsl:param name="courtName"/>
		<xsl:param name="courtCode"/>
		<xsl:choose>
			<xsl:when test="string-length($vdTransferCourtDivision) > 0">
				<!-- Case is District Registry -->
				<xsl:choose>
					<xsl:when test="$highCourtPrefix = 'true'">
						<xsl:value-of select="$vdTransferCourtDivision"/> <xsl:value-of select="$courtName"/> <xsl:value-of select="$vdTransferCourtType"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="$courtName"/> <xsl:value-of select="$vdTransferCourtType"/>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="variabledata/transfer/court/division = 'F'">Family Court at <xsl:value-of select="$courtName"/></xsl:when>
			<xsl:otherwise>
				<!-- Case is County Court -->
				<xsl:choose>
					<!-- CCBC case -->
					<xsl:when test="$courtCode = '335'">County Court Business Centre</xsl:when>
					<!-- CCMCC case -->
					<xsl:when test="$courtCode = '390' or $courtCode = '391'">County Court Money Claims Centre</xsl:when>
					<!-- Normal county court -->
					<xsl:otherwise>County Court at <xsl:value-of select="$courtName"/></xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:variable name="vdHearingAtCourtNameDescription">
		<xsl:call-template name="court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="variabledata/claim/hearing/court/atcourtcode"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdHearingAtCourtName"/>
			</xsl:with-param>
			<xsl:with-param name="mcolCheck">N</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">N</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdHearingCourtNameDescription">
		<xsl:call-template name="court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="variabledata/claim/hearing/court/courtcode"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdHearingCourtName"/>
			</xsl:with-param>
			<xsl:with-param name="mcolCheck">N</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">N</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTransferCourtNameDescription">
		<xsl:call-template name="transfer-court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="variabledata/transfer/court/code"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdTransferCourtName"/>
			</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">false</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTransferCourtNameDescriptionPrefix">
		<xsl:call-template name="transfer-court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="variabledata/transfer/court/code"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdTransferCourtName"/>
			</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">true</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCourtNameDescription">
		<xsl:call-template name="court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="variabledata/court/courtcode"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdCourtName"/>
			</xsl:with-param>
			<xsl:with-param name="mcolCheck">N</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">N</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdCourtNameDescriptionPrefix">
		<xsl:call-template name="court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="variabledata/court/courtcode"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdCourtName"/>
			</xsl:with-param>
			<xsl:with-param name="mcolCheck">N</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">Y</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCourtNameDescription">
		<xsl:call-template name="court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="variabledata/notice/judgecourtid"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdJudgmentAtThisCourtName"/>
			</xsl:with-param>
			<xsl:with-param name="mcolCheck">N</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">Y</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTransferFromCourtNameDescription">
		<xsl:call-template name="court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="variabledata/order/cfotransfer/originatingcourtcode"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdTransferFromCourtName"/>
			</xsl:with-param>
			<xsl:with-param name="mcolCheck">N</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">N</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdTransferToCourtNameDescription">
		<xsl:call-template name="court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="variabledata/order/cfotransfer/receivingcourtcode"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdTransferToCourtName"/>
			</xsl:with-param>
			<xsl:with-param name="mcolCheck">N</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">N</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdWarrantIssueCourtNameDescription">
		<xsl:call-template name="court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="variabledata/warrant/issuingcourtcode"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdWarrantIssueCourtName"/>
			</xsl:with-param>
			<xsl:with-param name="mcolCheck">N</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">N</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="vdJudgmentCourtNameDescription2">
		<xsl:call-template name="court-name-description">
			<xsl:with-param name="courtCode">
				<xsl:value-of select="$vdJudgmentCourtCode"/>
			</xsl:with-param>
			<xsl:with-param name="courtName">
				<xsl:value-of select="$vdJudgmentCourtFullName"/>
			</xsl:with-param>
			<xsl:with-param name="mcolCheck">N</xsl:with-param>
			<xsl:with-param name="highCourtPrefix">Y</xsl:with-param>
		</xsl:call-template>
	</xsl:variable>

	<!-- End Single Court Changes -->
	
	<xsl:template name="welshtranslation">
		<xsl:param name="addressee"/>
		<xsl:param name="type"/>
		<fo:flow flow-name="xsl-region-body" font-family="Arial" 
			font-size="12pt">
			
			<!--
				RenderX Replacement: Removed translation required logic as this is now in a separate template.  Also
				removed if statement as this template will now only be called if welsh translation is required.
			-->
			<fo:table table-layout="fixed">
				<fo:table-column column-width="19cm"/>
				<fo:table-body>
					<fo:table-row>
						<fo:table-cell padding-left="1.50cm">
							<fo:block space-after="5cm">
								<fo:block space-after="0.4cm">Dear 
									Sir/Madam</fo:block>
								<fo:block space-after="0.4cm" 
									font-weight="bold" 
									text-decoration="underline">REQUEST FOR 
									TRANSLATION INTO WELSH</fo:block>
									
								<xsl:choose>
									<xsl:when test="string-length(variabledata/aeeventid) >0">
										<fo:block font-weight="bold">Case Number: <xsl:value-of select="$vdClaimNumber"/></fo:block>
										<fo:block font-weight="bold">Re: <xsl:value-of select="$vdAeJudgmentCreditor"/> v <xsl:value-of select="$vdAeJudgmentDebtor"/></fo:block>
									</xsl:when>
									<xsl:when test="string-length(variabledata/warrant/warrantreturnsequence) >0">
										<fo:block font-weight="bold">Case Number: <xsl:value-of select="$vdClaimNumber"/></fo:block>
										<fo:block font-weight="bold">Re: <xsl:value-of select="$vdPartyForName"/> v <xsl:value-of select="$vdPartyAgainstName"/></fo:block>
										<fo:block space-before="0.4cm" font-weight="bold">Warrant Number:  
										<xsl:choose>
											<xsl:when test="string-length($vdWarrantLocalNumber) > 0"><xsl:value-of select="$vdWarrantLocalNumber"/></xsl:when>
											<xsl:otherwise><xsl:value-of select="$vdWarrantNumber"/></xsl:otherwise>
										</xsl:choose>
										</fo:block>
									</xsl:when>
									<xsl:when test="string-length($vdCONumber) > 0">
										<fo:block font-weight="bold">AO/CAEO Number: <xsl:value-of select="$vdCONumber"/></fo:block>
										<fo:block font-weight="bold">Re: <xsl:value-of select="$vdCODebtorName"/></fo:block>
									</xsl:when>
									<xsl:when test="string-length($vdInsolvencyNumber) > 0">
										<fo:block font-weight="bold">Insolvency Number: <xsl:value-of select="substring($vdInsolvencyNumber,1,4)"/> of <xsl:value-of select="substring($vdInsolvencyNumber,5,4)"/></fo:block>
										<fo:block font-weight="bold">Re: 
										<xsl:choose>
											<xsl:when test="$vdCaseType = 'APP TO SET STAT DEMD'">
												<xsl:value-of select="$vdApplicantName"/>
											</xsl:when>
											<xsl:when test="$vdCaseType = 'CREDITORS PETITION'">
												<xsl:value-of select="$vdDebtorName"/>
											</xsl:when>
											<xsl:when test="$vdCaseType = 'DEBTORS PETITION' or $vdCaseType='APP ON DEBT PETITION'">
												<xsl:value-of select="$vdDebtorName"/>				
											</xsl:when>	
											<xsl:when test="$vdCaseType = 'APP INT ORD (INSOLV)'">
												<xsl:value-of select="$vdDebtorName"/>				
											</xsl:when>				
											<xsl:when test="$vdCaseType = 'WINDING UP PETITION'">
												<xsl:value-of select="$vdCompanyName"/> 				
											</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select="$vdClaimantName"/> v <xsl:value-of select="$vdDefendant1Name"/>
											</xsl:otherwise>
										</xsl:choose>
										</fo:block>
									</xsl:when>
									<xsl:otherwise>
										<fo:block font-weight="bold">Case Number: <xsl:value-of select="$vdClaimNumber"/></fo:block>
										<fo:block font-weight="bold">Re: 
										<xsl:choose>
											<xsl:when test="$vdCaseType = 'APP TO SET STAT DEMD'">
												<xsl:value-of select="$vdApplicantName"/>
											</xsl:when>
											<xsl:when test="$vdCaseType = 'CREDITORS PETITION'">
												<xsl:value-of select="$vdDebtorName"/>
											</xsl:when>
											<xsl:when test="$vdCaseType = 'DEBTORS PETITION' or $vdCaseType='APP ON DEBT PETITION'">
												<xsl:value-of select="$vdDebtorName"/>				
											</xsl:when>	
											<xsl:when test="$vdCaseType = 'APP INT ORD (INSOLV)'">
												<xsl:value-of select="$vdDebtorName"/>				
											</xsl:when>				
											<xsl:when test="$vdCaseType = 'WINDING UP PETITION'">
												<xsl:value-of select="$vdCompanyName"/> 				
											</xsl:when>
											<xsl:otherwise>
												<xsl:value-of select="$vdClaimantName"/> v <xsl:value-of select="$vdDefendant1Name"/>
											</xsl:otherwise>
										</xsl:choose>
										</fo:block>
									</xsl:otherwise>
								</xsl:choose>

								<fo:block space-before="0.4cm" space-after="0.4cm">Please find 
									enclosed documents for translation in 
									the above named case.</fo:block>
								<fo:table table-layout="fixed" 
									border-style="solid" 
									border-width="0.02cm" >
									<fo:table-column column-width="3cm"/>
									<fo:table-column column-width="10cm"/>
									<fo:table-column column-width="4cm"/>
									<fo:table-body>
										<fo:table-row>
											<fo:table-cell padding="0.1cm" 
												border-style="solid" 
												border-width="0.02cm" >
												<fo:block font-weight="bold">Name and Address 
													of party to be 
													served</fo:block>
											</fo:table-cell>
											<fo:table-cell padding="0.1cm" 
												border-style="solid" 
												border-width="0.02cm" >
												<xsl:if test="$type = 'true'">
													<fo:block>
														STAFF IN CONFIDENCE
													</fo:block>
												</xsl:if>
												<fo:block>
													<xsl:call-template 
														name="format-address-multi-line">
														<xsl:with-param 
															name="party">
															<xsl:copy-of 
																select="xalan:nodeset($addressee)/*"/>
														</xsl:with-param>
													</xsl:call-template>
												</fo:block>
											</fo:table-cell>
											<fo:table-cell padding="0.1cm" 
												border-style="solid" 
												border-width="0.02cm" >
												<fo:block>Date by which 
													party should be 
													served:</fo:block>
											</fo:table-cell>
										</fo:table-row>
									</fo:table-body>
								</fo:table>
								<fo:block space-after="0.4cm" 
									space-before="0.4cm">Yours 
									faithfully,</fo:block>
								<fo:block space-after="2.0cm"/>
								<fo:block>
									<xsl:value-of select="$vdName"/>
								</fo:block>
								<fo:block><xsl:value-of 
									select="$vdSection"/> Section</fo:block>
								<fo:block>Extension: <xsl:value-of 
									select="$vdExtension"/></fo:block>
								<fo:block space-after="0.4cm" 
									space-before="0.4cm" font-weight="bold">
									This request form and document is to be 
									faxed to the Welsh Language 
									Unit.</fo:block>
								<fo:table table-layout="fixed">
									<fo:table-column column-width="2cm"/>
									<fo:table-column column-width="4cm"/>
									<fo:table-column column-width="3cm"/>
									<fo:table-column column-width="3cm"/>
									<fo:table-body>
										<fo:table-row>
											<fo:table-cell>
												<fo:block 
													font-weight="bold">Fax 
													No:</fo:block>
											</fo:table-cell>
											<fo:table-cell>
												<fo:block 
													font-weight="bold">
													01286 669797</fo:block>
											</fo:table-cell>
											<fo:table-cell>
												<fo:block 
													font-weight="bold">
													Enquiries:</fo:block>
											</fo:table-cell>
											<fo:table-cell>
												<fo:block 
													font-weight="bold">
													01286 669800</fo:block>
											</fo:table-cell>
										</fo:table-row>
									</fo:table-body>
								</fo:table>
							</fo:block>
						</fo:table-cell>
					</fo:table-row>
				</fo:table-body>
			</fo:table>
		</fo:flow>
	</xsl:template>
</xsl:stylesheet>