<?xml version="1.0" encoding="UTF-8"?>
<!-- 

	src_convertDStoWPData.xsl is the source for convertDsToWPData.xsl.
	The Ant target xxx transforms this file using gen_ds2wp_do.xsl

 -->

<!-- 
@author Sandeep Mullangi
@version 0.1 
Change History
	Sep 10, 2008 Sandeep Mullangi - Added InsolvencyNumber element as part of RFC 486
	Oct 21, 2009 Chris Vincent - added Welsh court and Executing Court nodes for Trac 1640
	Feb 10, 2010 Chris Vincent - added Welsh High Court Name and Welsh County Court Name nodes for Trac 2629
	Mar 1, 2010 Troy Baines - TRAC 2439 Use latest AE Employer Address on AE Letter to Employer
	Apr 07, 2010 Chris Vincent - Welsh Changes:
	Added <courtcode> node under <usercourt> and <executingcourt> (Trac 2662).
	Added <welsh> nodes for Welsh Translation indicators for aeemployer and warrant parties.  (Tracs 2800 + 2924).
	Swapped the namedperson and name node xpaths under <aeemployer> as were mixed up (Trac 2969).
	Used full variable path for <insolvencynumber>.  Trac 2863.
	Apr 16, 2010 Chris Vincent - Added Welsh flag to warrant/possession.  Trac 2924.
	Aug 08, 2010 Mark Groen - Trac 3023 - <divends/> replaced by <divends><xsl:value-of select="Dividends"/></divends>.
										Add <totalfeespaid> and <cooutstandingdebt/> nodes
	Aug 18, 2010 Mark Groen - Trac 1936 - added th e<debtseq> node to the <payee> and <creditor> nodes
	Dec 12, 2011 Chris Vincent - Trac 4621 - added <securities> and <cfotransfer> nodes
	Jun 11 2012, Chris Vincent - Trac 2481: added <receiptdate> node under <coevent>
	Jun 25  2012 - Des Johnston.  Added additional code to warrantpartyfor to include the Warrant Party For Representative.  Trac 3804.
	Aug 30 2012, Chris Vincent - Trac 4714, added <openfrom> and <opento> nodes under <court> and <executingcourt>.
	Sep 05 2012, Chris Vincent - Trac 4718, added <dropenfrom>, <dropento>, <byappointment> and <drtelnumber> nodes under <court> and <executingcourt>.
				 <drtelnumber> also added under /transfer/court.
	Jan 11 2013, Chris Vincent - Added /claim/receiptdate (Trac 4766) and  provassessmentcosts (Trac 4762)
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:xalan="http://xml.apache.org/xalan" >
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>

	<xsl:variable name="aeeventid"><xsl:value-of select="/params/param/ds/AE/AEEvent/StandardEventId"/></xsl:variable>
	<!--<xsl:variable name="coventid"><xsl:value-of select="/params/param/ds/COES/ManageCOEvents/COEvents/COEvent[1]/StandardEventId"/></xsl:variable> -->
	<xsl:variable name="eventId">
	<xsl:choose>
		<xsl:when test="string-length(/params/param/ds/COES/ManageCOEvents/COEvents/COEvent[1]/StandardEventId) > 0"><xsl:value-of select="/params/param/ds/COES/ManageCOEvents/COEvents/COEvent[1]/StandardEventId"/></xsl:when>
		<xsl:otherwise><xsl:value-of select="/params/param/ds/CaseEvent/StandardEventId"/></xsl:otherwise>
	</xsl:choose>
	</xsl:variable>
	<xsl:variable name="judgmentId">
		<xsl:choose>
			<xsl:when test="string-length(/params/param/ds/EnterVariableData/judgmentSelection) > 0">
				<xsl:value-of select="/params/param/ds/EnterVariableData/judgmentSelection"/>
			</xsl:when>
			<xsl:when test="string-length(/params/param[@name='xml']/ds/JudgementId) > 0">
				<xsl:value-of select="/params/param[@name='xml']/ds/JudgementId"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="/params/param[@name='xml']/ds/getdata/variabledata/JudgementId"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="debtSequence">
		<xsl:value-of select="/params/param[@name='xml']/ds/DebtSequence"/>
	</xsl:variable>
	<xsl:variable name="AENumber">	
			<xsl:value-of select="/params/param[@name='xml']/ds/AENumber"/>	
	</xsl:variable>
	<xsl:variable name="AEEventSeq">	
			<xsl:value-of select="/params/param[@name='xml']/ds/AEEventSeq"/>	
	</xsl:variable>	
	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	<xsl:template match="params/param">
		<xsl:choose>
			<xsl:when test="@name='xml'">
				<param name="xml">
					<xsl:apply-templates select="ds"/>
				</param>
			</xsl:when>
			<xsl:when test="@name='vardata'">
				</xsl:when>
			<xsl:otherwise>
				<xsl:copy>
					<xsl:apply-templates select="node()|@*"/>
				</xsl:copy>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template match="node()|@*">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
	<xsl:template match="ds">
		<variabledata>
			<xhtml/>
			
			<ddebugJudgmentId>
				<xsl:value-of select="$judgmentId"/>
			</ddebugJudgmentId>						
			<xsl:apply-templates select="ManageCase"/>
			<xsl:apply-templates select="MaintainCO"/>
			<!-- td 5224 - local warrant do have managecase, only foreign ones don't:  -->
			<xsl:if test="count(ManageCase) = 0">
				<xsl:apply-templates select="Warrant/WarrantReturnsId"/>
			</xsl:if>
			<sourcedata>
				<!--xnotsl:apply-templates select = "node()|@*" /-->
			</sourcedata>
			<duplicate>
				<xsl:value-of select="/params/param[@name='xml']/ds/DuplicateEvent" />			
			</duplicate>
			<warrantEventCode>
				<xsl:value-of select="/params/param[@name='xml']/ds/WarrantEvent/Code"/>
			</warrantEventCode>						
		</variabledata>
	</xsl:template>
	<xsl:template match="ManageCase">
		<xsl:call-template name="variabledata"/>
	</xsl:template>
	<xsl:template match="MaintainCO">
		<xsl:call-template name="variabledata"/>
	</xsl:template>
	<xsl:template match="Warrant/WarrantReturnsId">
		<xsl:call-template name="variabledata"/>
	</xsl:template>
	<xsl:template name="variabledata">
	
			<outputstrapline/>
		
			<xsl:variable name="aejudgmentcreditorpid" select="concat(/params/param[@name='xml']/ds/AE/AEApplication/PartyForPartyRoleCode , '_',/params/param[@name='xml']/ds/AE/AEApplication/PartyForCasePartyNumber)"/>
			<aejudgmentcreditorpid>
				<xsl:value-of select="/params/param/ds/ManageCase/Parties/LitigiousParty[SurrogateId = $aejudgmentcreditorpid]/PartyId" />
			</aejudgmentcreditorpid>	
			<aeeventid>
				<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEEvent/StandardEventId"/>
			</aeeventid>
			<aepartyfor>
				<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/PartyForRequestedName" />
			</aepartyfor>
			<aepartyagainst>
				<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/PartyAgainstRequestedName" />
			</aepartyagainst>
			<payrollref>
				<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/PayrollNo" />
			</payrollref>			
			<aeemployer>
				<namedperson>
					<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/NamedEmployer"/>		
				</namedperson>			
				<name>
					<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/Employer/PersonRequestedName"/>
				</name>
				<welsh>
					<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/Employer/ContactDetails/WelshIndicator"/>
				</welsh>
				<address>				
					<addressid>
						<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/Employer/ContactDetails/Addresses/Address[./ValidTo = '' and ./PartyId = /params/param[@name='xml']/ds/AE/AEApplication/DebtorsEmployersPartyId]/AddressId"/>
					</addressid>
					<line1>
						<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/Employer/ContactDetails/Addresses/Address[./ValidTo = '' and ./PartyId = /params/param[@name='xml']/ds/AE/AEApplication/DebtorsEmployersPartyId]/Line[position()=1]"/>
					</line1>
					<line2>
						<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/Employer/ContactDetails/Addresses/Address[./ValidTo = '' and ./PartyId = /params/param[@name='xml']/ds/AE/AEApplication/DebtorsEmployersPartyId]/Line[position()=2]"/>
					</line2>
					<line3>
						<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/Employer/ContactDetails/Addresses/Address[./ValidTo = '' and ./PartyId = /params/param[@name='xml']/ds/AE/AEApplication/DebtorsEmployersPartyId]/Line[position()=3]"/>
					</line3>
					<line4>
						<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/Employer/ContactDetails/Addresses/Address[./ValidTo = '' and ./PartyId = /params/param[@name='xml']/ds/AE/AEApplication/DebtorsEmployersPartyId]/Line[position()=4]"/>
					</line4>
					<line5>
						<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/Employer/ContactDetails/Addresses/Address[./ValidTo = '' and ./PartyId = /params/param[@name='xml']/ds/AE/AEApplication/DebtorsEmployersPartyId]/Line[position()=5]"/>
					</line5>
					<postcode>
						<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/Employer/ContactDetails/Addresses/Address[./ValidTo = '' and ./PartyId = /params/param[@name='xml']/ds/AE/AEApplication/DebtorsEmployersPartyId]/PostCode"/>
					</postcode>		
					<reference>
						<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEApplication/Employer/ContactDetails/Addresses/Address[./ValidTo = '' and ./PartyId = /params/param[@name='xml']/ds/AE/AEApplication/DebtorsEmployersPartyId]/Reference"/>
					</reference>																
				</address>
			</aeemployer>
				
				
		<bailiff>
			<name>
				<xsl:value-of select="/params/param/ds/EnterVariableData/bailiffName"/>
				<!--xsl:value-of select="/params/param/ds/EnterVariableData/bailiff/name" /-->
			</name>
			<telephone>
				<xsl:value-of select="/params/param/ds/EnterVariableData/bailiff/telephone"/>
			</telephone>
			<visitdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/bailiffVisitDate"/>
			</visitdate>			
			<availability>
				<xsl:value-of select="/params/param/ds/EnterVariableData/bailiff/availability"/>
			</availability>
		</bailiff>
		
		<warrant>
			<warrantcasenumber>
				<xsl:value-of select="/params/param/ds/Warrant/CaseNumber"/>
			</warrantcasenumber>
			<warrantreturnsequence>
				<xsl:value-of select="/params/param/ds/Warrant/WarrantReturnsId"/>
			</warrantreturnsequence>
			<paymentdate><!--  Q9208 // with wrong id inside 669 -->
				<xsl:value-of select="/params/param/ds/EnterVariableData/paymentDueDate"/>
			</paymentdate>
			<returndate>
				<xsl:value-of select="/params/param/ds/WarrantEvent/ReturnDate"/>
			</returndate>
			<receiptdate>
				<xsl:value-of select="/params/param/ds/WarrantEvent/ReceiptDate"/>
			</receiptdate>	

			<casenumber>
				<xsl:value-of select="/params/param/ds/Warrant/CaseNumber"/>
			</casenumber>
			
			<localnumber>
				<xsl:value-of select="/params/param/ds/Warrant/LocalNumber"/>
			</localnumber>

			<issuingcourtcode>
				<xsl:value-of select="/params/param/ds/Warrant/IssuedBy"/>
			</issuingcourtcode>				
		
			<foreigncourt>
				<xsl:choose>
					<xsl:when test="string-length(/params/param/ds/Warrant/LocalNumber) >0">
					<!-- Foreign Warrant -->
						<xsl:value-of select="/params/param/ds/Warrant/IssuedByName"/>
					</xsl:when>
					<xsl:otherwise>
					<!-- Home Warrant -->					
						<xsl:value-of select="/params/param/ds/Warrant/ForeignCourtName"/>
					</xsl:otherwise>
				</xsl:choose>
			</foreigncourt>
		
			<warrantnumber>
				<xsl:value-of select="/params/param/ds/Warrant/WarrantNumber"/>
			</warrantnumber>
			
			<partyforrolecode>
				<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/PartyType"/>
			</partyforrolecode>
			
			<partyforrolenumber>
				<xsl:value-of select="/params/param/ds/Warrant/Claimant/Number"/>
			</partyforrolenumber>
			
			<partyforname>
				<xsl:value-of select="/params/param/ds/Warrant/Claimant/Name"/>
			</partyforname>
	
			<partyforreference>
				<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/Reference"/>
			</partyforreference>			
			
			<partyagainstrolecode>
				<!-- <xsl:value-of select="/params/param/ds/EnterVariableData/Warrant/*[Number=/params/param/ds/EnterVariableData/Warrant/PartyAgainstNumber]/PartyType"/> -->
				<!-- UCT TD 610: Look for value under PartyAgainstNumber element and use this value to get either Defendant<1> or Defendant<2> element for Party Against Role Code -->
				<xsl:variable name="partyAgainstNumber">
					<xsl:value-of select="/params/param/ds/Warrant/PartyAgainstNumber"/>
				</xsl:variable>				
				<xsl:value-of select="xalan:evaluate(concat('/params/param/ds/Warrant/Defendant', $partyAgainstNumber))/PartyType"/>
			</partyagainstrolecode>
		
			
			<partyagainstname>
				<!-- <xsl:value-of select="/params/param/ds/EnterVariableData/Warrant/*[Number=/params/param/ds/EnterVariableData/Warrant/PartyAgainstNumber]/Name"/> -->
				<!-- UCT TD 610: Look for value under PartyAgainstNumber element and use this value to get either Defendant<1> or Defendant<2> element for Party Against Name -->
				<xsl:variable name="partyAgainstNumber">
					<xsl:value-of select="/params/param/ds/Warrant/PartyAgainstNumber"/>
				</xsl:variable>
				<xsl:value-of select="xalan:evaluate(concat('/params/param/ds/Warrant/Defendant', $partyAgainstNumber))/Name"/>
			</partyagainstname>
		
			
			<partyagainstreference>
				<!-- <xsl:value-of select="/params/param/ds/EnterVariableData/Warrant/*[Number=/params/param/ds/EnterVariableData/Warrant/PartyAgainstNumber]/Reference"/> -->
				<!-- UCT TD 610: Look for value under PartyAgainstNumber element and use this value to get either Defendant<1> or Defendant<2> element for Party Against Reference -->
				<xsl:variable name="partyAgainstNumber">
					<xsl:value-of select="/params/param/ds/Warrant/PartyAgainstNumber"/>
				</xsl:variable>
				<xsl:value-of select="xalan:evaluate(concat('/params/param/ds/Warrant/Defendant', $partyAgainstNumber))/Reference"/>
			</partyagainstreference>
			
			<partyagainstnumber>
				<xsl:value-of select="/params/param/ds/Warrant/PartyAgainstNumber"/>
			</partyagainstnumber>
			
			<appointmentdate>
				<xsl:value-of select="/params/param/ds/WarrantEvent/AppointmentDate"/>
			</appointmentdate>
			
			<appointmenttime>
				<xsl:value-of select="/params/param/ds/WarrantEvent/AppointmentTime"/>
			</appointmenttime>
			
			<bailiffareano>
				<xsl:choose>
					<xsl:when test="string-length(/params/param/ds/EnterVariableData/BailiffAreaNo) > 0">
						<xsl:value-of select="/params/param/ds/EnterVariableData/BailiffAreaNo"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="/params/param/ds/Warrant/BailiffAreaNo"/>
					</xsl:otherwise>
				</xsl:choose>				
			</bailiffareano>
			
			<warrantparties>
				<warrantpartyfor>
				<!--Added for trac 3804 -->
				    <dx>
						<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/ContactDetails/DX"/>
					</dx>

					<name>
						<xsl:choose>
							<xsl:when test="string-length(/params/param/ds/Warrant/LocalNumber) > 0">
								<!-- We are dealing with a foreign warrant, so Solicitor is mandatory, so always get name from Solicitor element-->
								<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/Name"/>
							</xsl:when>
							<xsl:otherwise>
								<!-- We are dealing with a home warrant, so if party is represented, use the solicitor's name otherwise use party's name -->
								<xsl:choose>
									<xsl:when test="/params/param/ds/Warrant/Claimant/PartyType = 'SOLICITOR'">
										<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/Name"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="/params/param/ds/Warrant/Claimant/Name"/>
									</xsl:otherwise>
								</xsl:choose>				
							</xsl:otherwise>
						</xsl:choose>
					</name>
					<reference>
						<xsl:choose>
							<xsl:when test="string-length(/params/param/ds/Warrant/LocalNumber) > 0">
								<!-- We are dealing with a foreign warrant, so Solicitor is mandatory, so always get reference from Solicitor element-->
								<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/Reference"/>								
							</xsl:when>
							<xsl:otherwise>
								<!-- We are dealing with a home warrant, so if party is represented, use the solicitor's reference otherwise use party's name -->
								<xsl:choose>
									<xsl:when test="/params/param/ds/Warrant/Claimant/PartyType = 'SOLICITOR'">
										<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/Reference"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/Reference"/>
										<!--xsl:value-of select="//Parties/LitigiousParty[TypeCode='CLAIMANT' and Number = /params/param/ds/Warrant/Claimant/Number]/Reference"/-->
									</xsl:otherwise>
								</xsl:choose>				
							</xsl:otherwise>
						</xsl:choose>
					</reference>
					<telephonenumber>
						<xsl:choose>
							<xsl:when test="string-length(/params/param/ds/Warrant/LocalNumber) > 0">
								<!-- We are dealing with a foreign warrant, so Solicitor is mandatory, so always get reference from Solicitor element-->
								<!--<xsl:value-of select="//Parties/Solicitor[TypeCode='SOLICITOR' and Number = /params/param/ds/EnterVariableData/Warrant/Claimant/Representative/Number]/ContactDetails/TelephoneNumber"/>-->
								<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/ContactDetails/TelephoneNumber"/>
							</xsl:when>
							<xsl:otherwise>
								<!-- We are dealing with a home warrant, so if party is represented, use the solicitor's reference otherwise use party's name -->
								<xsl:choose>
									<xsl:when test="/params/param/ds/Warrant/Claimant/PartyType = 'SOLICITOR'">
										<xsl:value-of select="//Parties/Solicitor[TypeCode='SOLICITOR' and Number = /params/param/ds/Warrant/Claimant/Representative/Number]/ContactDetails/TelephoneNumber"/>								
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="//Parties/LitigiousParty[TypeCode='CLAIMANT' and Number = /params/param/ds/Warrant/Claimant/Number]/ContactDetails/TelephoneNumber"/>
									</xsl:otherwise>
								</xsl:choose>				
							</xsl:otherwise>
						</xsl:choose>
					</telephonenumber>					
					<representativeid>
						<xsl:if test="string-length(/params/param/ds/Warrant/LocalNumber) = 0">
							<!-- Only in Home Warrants can a party for have a representative id -->
							<!-- In Foreign warrants the solicitor is just text information with no relationship data -->
							<xsl:if test="/params/param/ds/Warrant/Claimant/PartyType = 'SOLICITOR'">
								<!-- The party for is represented so build and store the representative id-->
								<xsl:variable name="partyType">
									<xsl:value-of select="/params/param/ds/Warrant/Claimant/PartyType"/>
								</xsl:variable>
								<xsl:variable name="partyNumber">
									<xsl:value-of select="/params/param/ds/Warrant/Claimant/Number"/>
								</xsl:variable>
								<xsl:variable name="representativeId">
									<xsl:value-of select="$partyType" /><xsl:text>_</xsl:text><xsl:value-of select="$partyNumber" />
								</xsl:variable>								
								<xsl:value-of select="$representativeId"/>
							</xsl:if>
						</xsl:if>
					</representativeid>	
					<address>
						<line1>
							<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/ContactDetails/Address/Line[1]"/>
						</line1>
						<line2>
							<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/ContactDetails/Address/Line[2]"/>
						</line2>
						<line3>
							<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/ContactDetails/Address/Line[3]"/>
						</line3>
						<line4>
							<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/ContactDetails/Address/Line[4]"/>
						</line4>
						<line5>
							<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/ContactDetails/Address/Line[5]"/>
						</line5>	
						<postcode>
							<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/ContactDetails/Address/PostCode"/>
						</postcode>																													
					</address>
					<!-- EX96 requires the Claimant Name even when represented -->
					<claimantname>
						<xsl:value-of select="/params/param/ds/Warrant/Claimant/Name"/>
					</claimantname>
					<welsh>
						<xsl:value-of select="/params/param/ds/Warrant/Claimant/Representative/WelshTranslation"/>
					</welsh>
				</warrantpartyfor>		
				<xsl:choose>
					<xsl:when test="string-length(/params/param/ds/Warrant/LocalNumber) > 0">
						<!-- We are dealing with a foreign warrant, so we explicitly specify type and number -->
						<warrantpartyagainst1>
							<xsl:call-template name="getWarrantPartyAgainstDetails">
								<xsl:with-param name="party">
									<xsl:copy-of select="/params/param/ds/Warrant/Defendant1/*"/>
								</xsl:with-param>
								<xsl:with-param name="number">1</xsl:with-param>
								<xsl:with-param name="partyType">DEFENDANT</xsl:with-param>								
							</xsl:call-template>
						</warrantpartyagainst1>	
						<warrantpartyagainst2>
							<xsl:call-template name="getWarrantPartyAgainstDetails">
								<xsl:with-param name="party">
									<xsl:copy-of select="/params/param/ds/Warrant/Defendant2/*"/>
								</xsl:with-param>					
								<xsl:with-param name="number">2</xsl:with-param>
								<xsl:with-param name="partyType">DEFENDANT</xsl:with-param>																
							</xsl:call-template>
						</warrantpartyagainst2>													
					</xsl:when>
					<xsl:otherwise>
						<!-- We are dealing with a home warrant here -->
						<warrantpartyagainst1>
							<xsl:call-template name="getWarrantPartyAgainstDetails">
								<xsl:with-param name="party">
									<xsl:copy-of select="/params/param/ds/Warrant/Defendant1/*"/>
								</xsl:with-param>
							</xsl:call-template>
						</warrantpartyagainst1>	
						<warrantpartyagainst2>
							<xsl:call-template name="getWarrantPartyAgainstDetails">
								<xsl:with-param name="party">
									<xsl:copy-of select="/params/param/ds/Warrant/Defendant2/*"/>
								</xsl:with-param>					
							</xsl:call-template>
						</warrantpartyagainst2>							
					</xsl:otherwise>
				</xsl:choose>
									
				<!-- Used by output N54 and EX96 which displays a possession address if it's a home warrant whose case has one-->
				<selectedwarrantpartyagainst>
					<xsl:variable name="partyAgainstNumber">
						<xsl:value-of select="/params/param/ds/Warrant/PartyAgainstNumber"/>
					</xsl:variable>
					
					<!-- Only populate if the party against number is specified -->
					<xsl:if test="string-length($partyAgainstNumber) > 0">
						<name>
							<xsl:value-of select="xalan:evaluate(concat('/params/param/ds/Warrant/Defendant', $partyAgainstNumber))/Name"/>
						</name>		
						<number>
							<xsl:choose> 								
								<xsl:when test="string-length(/params/param/ds/Warrant/LocalNumber) = 0">	
									<!-- We are dealing with a Home Warrant. So get the Party Number from detals return from Warrant.-->					
									<xsl:value-of select="xalan:evaluate(concat('/params/param/ds/Warrant/Defendant', $partyAgainstNumber))/Number"/>
								</xsl:when>
								<xsl:otherwise>
									<!-- We are dealing with a Foreign Warrant. 
									So the partyAgainstNumber itself becomes the number of party. 
									This is because the Warrant elements put empty tags for Number in case of Foreign Warrant
									-->
									<xsl:value-of select="$partyAgainstNumber"/>
								</xsl:otherwise>
								
							</xsl:choose>
							<!-- <xsl:value-of select="$partyAgainstNumber"/>							 -->
						</number>	
						<type>
							<xsl:choose>
								<xsl:when test="string-length(/params/param/ds/Warrant/LocalNumber) > 0">
									<!-- We are dealing with a foreign warrant, so we explicitly specify party type as 'DEFENDANT' -->
									<xsl:text>DEFENDANT</xsl:text>
								</xsl:when>
								<xsl:otherwise>
									<!-- We are dealing with a home warrant so take the party type from the data -->
									<xsl:value-of select="xalan:evaluate(concat('/params/param/ds/Warrant/Defendant', $partyAgainstNumber))/PartyType"/>									
								</xsl:otherwise>
							</xsl:choose>
						</type>			

						<!-- Only if a possession address is present does the address branch get created -->						
						<xsl:if test="string-length(/params/param/ds/ManageCase/OtherPossessionAddress/Address/Line[1]) > 0">
							<xsl:apply-templates select="/params/param/ds/ManageCase/OtherPossessionAddress/Address"/>
						</xsl:if>						
					</xsl:if>
				</selectedwarrantpartyagainst>
				<!-- Used by output L_13_3 -->
				<eventselectedwarrantpartyagainst>
					<xsl:variable name="partyAgainstNumber">
						<xsl:value-of select="/params/param/ds/Warrant/PartyAgainstNumber"/>
					</xsl:variable>
				</eventselectedwarrantpartyagainst>													
			</warrantparties>
			<!-- N54 (Temp Defect 344) addition of question for foreign warrant possession address -->
			<possession>
				<xsl:variable name="partyAgainstNumber">
					<xsl:value-of select="/params/param/ds/Warrant/PartyAgainstNumber"/>
				</xsl:variable>			
				<name>
					<xsl:value-of select="xalan:evaluate(concat('/params/param/ds/Warrant/Defendant', $partyAgainstNumber))/Name"/>
				</name>		
				<welsh>
					<xsl:value-of select="xalan:evaluate(concat('/params/param/ds/Warrant/Defendant', $partyAgainstNumber))/WelshTranslation"/>
				</welsh>
				<xsl:apply-templates select="/params/param/ds/EnterVariableData/Possession/Address"/>
			</possession>						
		</warrant>		
		
		<!-- the new user information will be put on these entervardata xpaths by the '' enter var data form intialisation - see generatejavascript.xsls.-->
		<user>
			<fullname>
				<xsl:choose>
					<xsl:when test="string-length(/params/param/ds/EnterVariableData/user/fullname) > 0">
						<xsl:value-of select="/params/param/ds/EnterVariableData/user/fullname"/>	
					</xsl:when>					
					<xsl:otherwise>
						<xsl:variable name="title">
							<xsl:value-of select="/params/param/ds/UserDetails/ds/MaintainUser/Title" />
						</xsl:variable>
						<xsl:variable name="firstname">
							<xsl:value-of select="/params/param/ds/UserDetails/ds/MaintainUser/Forenames" />
						</xsl:variable>
						<xsl:variable name="surname">
							<xsl:value-of select="/params/param/ds/UserDetails/ds/MaintainUser/Surname" />														
						</xsl:variable>
							<xsl:if test="string-length($title) > 0"> 
								<xsl:value-of select="$title" /><xsl:text> </xsl:text>
							</xsl:if>
							<xsl:if test="string-length($firstname) > 0"> 
								<xsl:value-of select="$firstname" /><xsl:text> </xsl:text>
							</xsl:if>
							<xsl:if test="string-length($surname) > 0"> 
								<xsl:value-of select="$surname" />
							</xsl:if>														
					</xsl:otherwise>
				</xsl:choose>
			</fullname>
			<name>
				<xsl:choose>
					<xsl:when test="string-length(/params/param/ds/EnterVariableData/user/name) > 0">
						<xsl:value-of select="/params/param/ds/EnterVariableData/user/name"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="/params/param[@name='userId'][1]" />
					</xsl:otherwise>
				</xsl:choose>
			</name>
			<alias>
				<xsl:value-of select="/params/param/ds/UserDetails/ds/MaintainUser/UserShortName" />
			</alias>
			<court>
				<xsl:value-of select="/params/param/ds/EnterVariableData/user/court"/>
			</court>
			
			<ext>
				<xsl:value-of select="/params/param/ds/EnterVariableData/user/ext"/>
			</ext>
			<section>
				<xsl:value-of select="/params/param/ds/EnterVariableData/user/section"/>
			</section>
		</user>
		<usercourt>
			<courtcode/>
			<name/>
			<address>
				<line1/>
				<line2/>
				<line3/>
				<line4/>
				<line5/>
				<postcode/>
			</address>
			<dx/>
			<telephonenumber/>
			<faxnumber/>
		</usercourt>
		<executingcourt>
			<courtcode/>
			<name/>
			<address>
				<line1/>
				<line2/>
				<line3/>
				<line4/>
				<line5/>
				<postcode/>
			</address>
			<dx/>
			<telephonenumber/>
			<faxnumber/>
			<drtelnumber/>
			<welshhighcourtname/>
			<welshcountycourtname/>
			<welshcourtname/>
            <welshaddress>
                <line1/>
                <line2/>
                <line3/>
                <line4/>
                <line5/>
                <postcode/>
            </welshaddress>
            <welshcourt/>
			<openfrom/>
			<opento/>
			<dropenfrom/>
			<dropento/>
			<byappointment/>
		</executingcourt>
		<division>
			<xsl:value-of select="CourtDivision"/>
		</division>
		<subdivision>
			<xsl:value-of select="CourtSubDivision"/>
		</subdivision>
		<court>
			<courtcode>
				<xsl:value-of select="OwningCourtCode"/>
			</courtcode>
			<name>
				<xsl:value-of select="OwningCourt"/>
			</name>
			<type>
				<xsl:value-of select="CourtDivision"/>
			</type>
			<xsl:call-template name="emptyAddress"/>
			<dx>
				<xsl:value-of select="DX"/>
			</dx>
			<telephonenumber>
				<xsl:value-of select="TelephoneNumber"/>
			</telephonenumber>
			<drtelnumber/>
			<faxnumber>
				<xsl:value-of select="FaxNumber"/>
			</faxnumber>
			<welshhighcourtname/>
			<welshcountycourtname/>
			<welshcourtname/>
            <welshaddress>
                <line1/>
                <line2/>
                <line3/>
                <line4/>
                <line5/>
                <postcode/>
            </welshaddress>
            <welshcourt/>
			<openfrom/>
			<opento/>
			<dropenfrom/>
			<dropento/>
			<byappointment/>
		</court>
		<claim>
			<type>
				<xsl:value-of select="CaseType"/>
			</type>
			<number>
				<xsl:value-of select="CaseNumber"/>
			</number>
			<insolvencynumber>
				<xsl:value-of select="/params/param/ds/ManageCase/InsolvencyNumber"/>
			</insolvencynumber>
			<creditorcode>
				<xsl:value-of select="CreditorCode"/>
			</creditorcode>
			<issuefee>
				<xsl:value-of select="DetailsOfClaim/CourtFee"/>
			</issuefee>
			<xsl:if test="DetailsOfClaim/DateOfIssue">
				<dateofissue>
					<xsl:value-of select="DetailsOfClaim/DateOfIssue"/>
				</dateofissue>
			</xsl:if>
			<xsl:if test="DetailsOfClaim/DateRequestReceived">
				<receiptdate>
					<xsl:value-of select="DetailsOfClaim/DateRequestReceived"/>
				</receiptdate>
			</xsl:if>
			<xsl:if test="mainclaimantid">
				<mainclaimantid/>
			</xsl:if>
			<xsl:if test="maindefendantid">
				<maindefendantid/>
			</xsl:if>
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='CLAIMANT']" mode="Claimant"/>
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='DEFENDANT']" mode="Defendant"/>
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='PT 20 CLMT']" mode="Part20Claimant"/>
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='PT 20 DEF']" mode="Part20Defendant"/>
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='DEBTOR']" mode="Debtor"/>
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='CREDITOR']" mode="Creditor"/>
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='COMPANY']" mode="TheCompany"/>
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='APPLICANT']" mode="Applicant"/>						
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='PETITIONER']" mode="Petitioner"/>
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='TRUSTEE']" mode="Trustee"/>
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='INS PRAC']" mode="InsolvencyPractitioner"/>			
			<xsl:apply-templates select="Parties/LitigiousParty[TypeCode='OFF REC']" mode="OfficialReceiver"/>
			
			<xsl:apply-templates select="Parties/Solicitor" mode="details"/>
			
				<particulars>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ParticularsEnclosed"/>
				</particulars>

			<xsl:choose>
				<xsl:when test="/params/param/ds/EnterVariableData/Hearing">
					<hearing>
						<supportCreditorsDet>
							<xsl:copy-of select="/params/param/ds/EnterVariableData/supportCreditorsDet"/>
						</supportCreditorsDet>
						<adjournedhearing>
							<xsl:value-of select="/params/param/ds/EnterVariableData/AdjournedHearing"/>
						</adjournedhearing>
						<date>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/Date"/>
						</date>
						<time>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/Time"/>
						</time>
						<court>
							<courtcode>
								<xsl:value-of select="/params/param/ds/EnterVariableData/HearingVenueCode"/>
							</courtcode>
							<atcourtcode>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Service/hearingVenueCode"/>
							</atcourtcode>
							<name>
								<xsl:value-of select="/params/param/ds/EnterVariableData/HearingVenue"/>
							</name>
							<atname>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/Service/hearingVenueName"/>
							</atname>
							<atdate>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Service/hearingDate2"/>
							</atdate>
							<attime>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Service/hearingTime2"/>
							</attime>
							<type/>
							<at>
								<xsl:apply-templates select="/params/param/ds/EnterVariableData/HearingAt/Address"/>
							</at>
							<xsl:apply-templates select="/params/param/ds/EnterVariableData/Hearing/Address"/>
							<telephonenumber>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/TelephoneNumber"/>
							</telephonenumber>
							<faxnumber>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/FaxNumber"/>
							</faxnumber>
							<xsl:if test="courtcode">
								<courtcode/>
							</xsl:if>
						</court>
						<attendees>
							<xsl:copy-of select="/params/param/ds/EnterVariableData/Hearing/Attendees/*"/>
						</attendees>

							<preliminaryhearingreason>
								<xsl:value-of select="/params/param/ds/EnterVariableData/PreliminaryHearing/reason"/>
							</preliminaryhearingreason>

							<hearinglisted>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/isListed"/>
							</hearinglisted>

							<hearingreasonclaimantdefendant>
								<xsl:for-each select="/params/param/ds/EnterVariableData/PreliminaryHearing/partywnppos/PartyId">
									<partyid>
										<xsl:value-of select="."/>
									</partyid>
								</xsl:for-each>
							</hearingreasonclaimantdefendant>

							<reasonsforhrgyorn>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Allocation/isReasonForHearing"/>
							</reasonsforhrgyorn>

							<hrgreasons>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Allocation/reasonsForHearing"/>
							</hrgreasons>

						<!-- CJR020 BEGIN-->
						<fasttrack>

								<jdgtrfaftalloc>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/transferCase"/>
								</jdgtrfaftalloc>

								<furtherdirections>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/furtherDirections"/>
								</furtherdirections>

								<transferdateflag>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/trialDateFixed"/>
								</transferdateflag>

								<wftstartdate>
									<xsl:value-of select="/params/param/wftxml/WindowsForTrial/WindowForTrial[position() = last()]/StartDate"/>
								</wftstartdate>

								<wftenddate>
									<xsl:value-of select="/params/param/wftxml/WindowsForTrial/WindowForTrial[position() = last()]/EndDate"/>
								</wftenddate>

								<fthrgdate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/Date"/>
								</fthrgdate>

								<fthrgtime>
									<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/Time"/>
								</fthrgtime>

								<statementofcaserequired>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/furtherStatementReqd"/>
								</statementofcaserequired>

								<ptytofiledocs>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/docsFiledBy"/>
								</ptytofiledocs>

								<ptytofiledocsother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/docsFiledByOther"/>
								</ptytofiledocsother>

								<docstobefiled>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/docsFiled"/>
								</docstobefiled>

								<docstobefiledother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/docsFiledOther"/>
								</docstobefiledother>

								<ptyservedon>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/docServedOn"/>
								</ptyservedon>

								<ptyservedonother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/docServedOn2Other"/>
								</ptyservedonother>

								<docsserveddate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/shouldFileDocsDate"/>
								</docsserveddate>

								<furtherinfoordered>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/furtherInformation"/>
								</furtherinfoordered>

								<furtherinfofiledate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/furtherInfoDate"/>
								</furtherinfofiledate>

								<furtherinfodeal>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isReplyDate"/>
								</furtherinfodeal>

								<furtherinfodealdate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/replyDate"/>
								</furtherinfodealdate>

								<disclosureordered>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isDisclosureOrdered"/>
								</disclosureordered>

								<disclosureto>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/partyDocsServe"/>
								</disclosureto>

								<disclosuretoother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/partyDocsServeOther"/>
								</disclosuretoother>

								<disclosureservicedto>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/docServedOn3"/>
								</disclosureservicedto>

								<disclosureservicedtoother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/docServedOn3Other"/>
								</disclosureservicedtoother>

								<docsrefspeissue>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/specificIssueDocs"/>
								</docsrefspeissue>

								<docswhichissue>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/whichIssue"/>
								</docswhichissue>

								<doscdateservicecopy>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/copyServiceDate"/>
								</doscdateservicecopy>

								<discoverylistordered>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isDiscoveryByList"/>
								</discoverylistordered>

								<disclosureorderlimit>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isLimitedDisclosure"/>
								</disclosureorderlimit>

								<disclosurestandard>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isStandardDisclosure"/>
								</disclosurestandard>

								<partydircomply>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isPartyToComply"/>
								</partydircomply>

								<partydirtocomply>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/partyToComply"/>
								</partydirtocomply>

								<partydirtocomply>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/partyToComply"/>
								</partydirtocomply>

								<partydortocomplyother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/partyToComplyOther"/>
								</partydortocomplyother>

								<partydirservedon>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/servedOn"/>
								</partydirservedon>

								<partydirservedonother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/servedOnOther"/>
								</partydirservedonother>

								<docsrelatedtodamage>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/damageDocs"/>
								</docsrelatedtodamage>

								<docsspecified>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isDocsSpecified"/>
								</docsspecified>

								<docsdetails>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/docDetails"/>
								</docsdetails>

								<listdeliverydate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isDeliveryListDate"/>
								</listdeliverydate>

								<latestdeliverydate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/latestDeliveryDate"/>
								</latestdeliverydate>

								<directioninspectionrequired>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/inspectDirectionReq"/>
								</directioninspectionrequired>

								<latestrequestdate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/latestReqDate"/>
								</latestrequestdate>

								<witnessfactdirection>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isWitnessOfFact"/>
								</witnessfactdirection>

								<simulexchorder>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isSimExchange"/>
								</simulexchorder>

								<exchangedate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/statementsExhDate"/>
								</exchangedate>

								<expertrefused>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/expertRefused"/>
								</expertrefused>

								<notifycourt>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isInstructionNotified"/>
								</notifycourt>

								<detailsofissue>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/issueDetails"/>
								</detailsofissue>

								<ptyinformcrt>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/partyToInform"/>
								</ptyinformcrt>

								<ptyinformcrtother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/partyToInformOther"/>
								</ptyinformcrtother>

								<ptyinformcrtdate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/partyInformDate"/>
								</ptyinformcrtdate>

								<issuedetails>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/issueDetails2"/>
								</issuedetails>

								<libertyappagreed>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isApplyLiberty"/>
								</libertyappagreed>

								<libertyagreedate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/agreementDate"/>
								</libertyagreedate>

								<orderpayexp>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/feesAndExpenses"/>
								</orderpayexp>

								<orderpayexppty>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/partyToPay"/>
								</orderpayexppty>

								<orderpayexpptyother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/partyToPayOther"/>
								</orderpayexpptyother>

								<orderpayexplimit>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isFeesLmtd"/>
								</orderpayexplimit>

								<feeslimitamt>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/feeLmtAmt"/>
								</feeslimitamt>

								<dateforfilingrep>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isExpertsReportDate"/>
								</dateforfilingrep>

								<filereportdate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/reportFilingDate"/>
								</filereportdate>

								<costrecoverylimit>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/expertCostLimit"/>
								</costrecoverylimit>

								<expertcostrecoveryamount>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/allowedAmount"/>
								</expertcostrecoveryamount>

								<exchangerepordered>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/exchangeReports"/>
								</exchangerepordered>

								<exchangesimseq>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/simOrSeqExch"/>
								</exchangesimseq>

								<exchangeserveto>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/firstParty"/>
								</exchangeserveto>

								<exchangeserveother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/firstPartyOther"/>
								</exchangeserveother>

								<exchangeservedate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/exchangeDate"/>
								</exchangeservedate>

								<exchangeservesecto>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/secondParty"/>
								</exchangeservesecto>

								<exchangeservesecother>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/secondPartyOther"/>
								</exchangeservesecother>

								<exchangeservedatefor>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/serviceDate"/>
								</exchangeservedatefor>

								<exchangeservedatefor2>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/serviceDate_2"/>
								</exchangeservedatefor2>

								<agreerep>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/reportsAgreed"/>
								</agreerep>

								<agreerepdate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/reachAgreementBy"/>
								</agreerepdate>

								<agreeafterservedays>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/daysAfterService"/>
								</agreeafterservedays>

								<agreementdate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/agreementDate2"/>
								</agreementdate>

								<woprejmeeting>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/withoutPrejDisc"/>
								</woprejmeeting>

								<meetingdate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/latestMeetingDate"/>
								</meetingdate>

								<orderissstat>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/orderIssuesStmt"/>
								</orderissstat>

								<stmttobefiled>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/fileStatement"/>
								</stmttobefiled>

								<orderfiledate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/filingDate"/>
								</orderfiledate>

								<expertwitpermitted>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/permitExpertWitnesses"/>
								</expertwitpermitted>

								<expertnames>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/expertNames"/>
								</expertnames>

								<evdoralwritt>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/oralOrWritten"/>
								</evdoralwritt>

								<evdsubmatt>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/subjectMatter"/>
								</evdsubmatt>

								<expertreppermitted>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isExpertReport"/>
								</expertreppermitted>

								<expertrepno>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/expertRptTotal"/>
								</expertrepno>

								<oralevdonlist>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/oralEvidenceConsidered"/>
								</oralevdonlist>

								<direcexpertques>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/expertsQDirections"/>
								</direcexpertques>

								<nodaysforfiling>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/numFilingDays"/>
								</nodaysforfiling>

								<direconreply>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/replyDirections"/>
								</direconreply>

								<direcfilesnodays>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/numFilingDays_2"/>
								</direcfilesnodays>

								<direcreqinfo>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/fFIDirn"/>
								</direcreqinfo>

								<noofdaysservreq>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/reqServiceDays"/>
								</noofdaysservreq>

								<direcrespond>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/respondDirn"/>
								</direcrespond>

								<noofdaysforreply>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/replyDays"/>
								</noofdaysforreply>

								<lqfiledwith>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/filedWithQA"/>
								</lqfiledwith>

								<lqfiledwithwhat>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/filedWithLQA"/>
								</lqfiledwithwhat>

								<lqdirecmade>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isLQADirnMade"/>
								</lqdirecmade>

								<lqdirecfiledate>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/filingLQDate"/>
								</lqdirecfiledate>

								<judgemltpsng>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/isJudgeReasons"/>
								</judgemltpsng>

								<otherdirns>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/shouldFileDocsDate"/>
								</otherdirns>

								<freetextdirns>
									<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/infoDetailsReqd"/>
								</freetextdirns>
						</fasttrack>

							<hearingisfor>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Allocation/hearingIsFor"/>
							</hearingisfor>

						<inforeqdfrom>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Allocation/infoReqdFrom"/>
						</inforeqdfrom>

						<isfurther>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Allocation/isFurtherInfo"/>
						</isfurther>
						<infofiledate>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Allocation/infoFileByDate"/>
						</infofiledate>
						<infodetails>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Allocation/infoDetailsReqd"/>
						</infodetails>
						<!-- CJR020 END-->
						<!-- CJR028 BEGIN-->
						<type>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/hearingType"/>
						</type>
						<listing>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/listing"/>
						</listing>
						<day>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/Day"/>
						</day>
						<timeallowedunits>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/trialTimeEstUnits"/>
						</timeallowedunits>
						<timeallowed>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/trialTimeEst"/>
						</timeallowed>
						<defcrossexaminationtimeunits>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/xExamDefTimeUnits"/>
						</defcrossexaminationtimeunits>
						<defcrossexaminationtime>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/xExamDefTime"/>
						</defcrossexaminationtime>
						<clmcrossexaminationtimeunits>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/xExamClmtTimeUnits"/>
						</clmcrossexaminationtimeunits>
						<clmcrossexaminationtime>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/xExamClmtTime"/>
						</clmcrossexaminationtime>
						<timetable>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/selectItemLsA"/>
						</timetable>
						<clmshalllodge>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/directionsGiven"/>
						</clmshalllodge>
						<informcourt>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/directionsGiven"/>
						</informcourt>
						<fasttrackdirections>
							<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/directionsGiven"/>
						</fasttrackdirections>
						<!-- CJR028 END-->
						<qasubmit>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Allocation/qASubmittedIRO"/>
						</qasubmit>
					</hearing>
				</xsl:when>
				<xsl:otherwise>
					<hearing>						
						<supportCreditorsDet>
							<xsl:value-of select="/params/param/ds/EnterVariableData/supportCreditorsDet"/>
						</supportCreditorsDet>
						<adjournedhearing>
							<xsl:value-of select="/params/param/ds/EnterVariableData/AdjournedHearing"/>
						</adjournedhearing>
						<date>
							<xsl:value-of select="HearingDetails/Date"/>
						</date>
						<time>
							<xsl:value-of select="HearingDetails/Time"/>
						</time>
						<court>
							<name>
								<xsl:value-of select="HearingDetails/VenueName"/>
							</name>
							<type/>
							<xsl:apply-templates select="HearingDetails/Address"/>
							<telephonenumber>
								<xsl:value-of select="HearingDetails/TelephoneNumber"/>
							</telephonenumber>
							<faxnumber>
								<xsl:value-of select="HearingDetails/FaxNumber"/>
							</faxnumber>
							<xsl:if test="courtcode">
								<courtcode/>
							</xsl:if>
						</court>
						<attendees>
							<xsl:copy-of select="/params/param/ds/EnterVariableData/Hearing/Attendees/*"/>
						</attendees>
						<xsl:if test="/params/param/ds/EnterVariableData/PreliminaryHearing/reason">
							<preliminaryhearingreason>
								<xsl:value-of select="/params/param/ds/EnterVariableData/PreliminaryHearing/reason"/>
							</preliminaryhearingreason>
						</xsl:if>
						<xsl:if test="/params/param/ds/EnterVariableData/Hearing/isListed">
							<hearinglisted>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/isListed"/>
							</hearinglisted>
						</xsl:if>
						<xsl:if test="/params/param/ds/EnterVariableData/PreliminaryHearing/partywnppos/PartyId">
							<hearingreasonclaimantdefendant>
								<xsl:for-each select="/params/param/ds/EnterVariableData/PreliminaryHearing/partywnppos/PartyId">
									<partyid>
										<xsl:value-of select="."/>
									</partyid>
								</xsl:for-each>
							</hearingreasonclaimantdefendant>
						</xsl:if>
					</hearing>
				</xsl:otherwise>
			</xsl:choose>
			<!-- CJR060 BEGIN -->
			<xsl:if test="/params/param/ds/EnterVariableData/HearingAt">
				<nexthearing>
					<xsl:if test="/params/param/ds/EnterVariableData/HearingAt">
						<court>
							<xsl:if test="/params/param/ds/EnterVariableData/Hearing/Service/hearingVenueName">
								<name>
									<xsl:value-of select="/params/param/ds/EnterVariableData/Hearing/Service/hearingVenueName"/>
								</name>
							</xsl:if>
							<xsl:apply-templates select="/params/param/ds/EnterVariableData/HearingAt/Address"/>
						</court>
					</xsl:if>
				</nexthearing>
			</xsl:if>
			<!-- CJR060 END-->
		</claim>
		<event>
			<id>
				<xsl:value-of select="$eventId"/>
			</id>
			<date>
				<xsl:value-of select="/params/param/ds/CaseEvent/EventDate"/>
			</date>
			<producedby>
				<xsl:value-of select="/params/param/ds/CaseEvent/UserName"/>
			</producedby>
			<SubjectCasePartyNumber>
				<xsl:value-of select="/params/param/ds/CaseEvent/SubjectCasePartyNumber"/>
			</SubjectCasePartyNumber>
			<SubjectPartyRoleCode>
				<xsl:value-of select="/params/param/ds/CaseEvent/SubjectPartyRoleCode"/>
			</SubjectPartyRoleCode>
			<InstigatorList>
				<xsl:for-each select="/params/param/ds/CaseEvent/InstigatorList/Instigator">
					<Instigator>
						<CasePartyNumber>
							<xsl:value-of select="CasePartyNumber"/>
						</CasePartyNumber>
						<CasePartyRoleCode>
							<xsl:value-of select="PartyRoleCode"/>
						</CasePartyRoleCode>
					</Instigator>
				</xsl:for-each>
			</InstigatorList>
			<aeeventdetails>
				<xsl:value-of select="/params/param[@name='xml']/ds/AE/AEEvent/EventDetails"/>
			</aeeventdetails>
		</event>
		<coevent>
			<date>
				<xsl:value-of select="/params/param[@name='xml']/ds/COES/ManageCOEvents/COEvents/COEvent[./COEventSeq = /params/param[@name='xml']/ds/COEventSeq]/EventDate"/>
			</date>
			<receiptdate>
				<xsl:value-of select="/params/param[@name='xml']/ds/COES/ManageCOEvents/COEvents/COEvent[./COEventSeq = /params/param[@name='xml']/ds/COEventSeq]/ReceiptDate"/>
			</receiptdate>
			<details>
				<xsl:value-of select="/params/param[@name='xml']/ds/COES/ManageCOEvents/COEvents/COEvent[position() = 1]/EventDetails"/>
			</details>
			<isaoaeinforce>
				<xsl:choose>
					<xsl:when test="/params/param[@name='xml']/ds/COES/ManageCOEvents/COType ='AO'">
						<xsl:choose>
							<xsl:when test="/params/param[@name='xml']/ds/COES/ManageCOEvents/COEvents/COEvent[StandardEventId = '921' and ErrorInd = 'N'] ">
								<xsl:choose>
									<xsl:when test="/params/param[@name='xml']/ds/COES/ManageCOEvents/COEvents/COEvent[StandardEventId = '901' and ErrorInd = 'N'] ">false</xsl:when>
									<xsl:otherwise>true</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>false</xsl:otherwise>
						</xsl:choose>
					</xsl:when>
				</xsl:choose>
			</isaoaeinforce>
		</coevent>
		<notice>
			<servicedate1>
				<xsl:value-of select="Parties/LitigiousParty[TypeCode='DEFENDANT']/DateOfService"/>
			</servicedate1>
			<xsl:if test="/params/param[@name='vardata']/ds/EnterVariableData/ServedBy">
				<servedby>
					<xsl:value-of select="/params/param[@name='vardata']/ds/EnterVariableData/ServedBy"/>
				</servedby>
			</xsl:if>
			<xsl:if test="/params/param[@name='vardata']/ds/EnterVariableData/Counterclaim">
				<counterclaim>
					<xsl:value-of select="/params/param[@name='vardata']/ds/EnterVariableData/Counterclaim"/>
				</counterclaim>
			</xsl:if>
			<xsl:if test="posteddate">
				<posteddate/>
			</xsl:if>
			<xsl:if test="string-length(Parties/LitigiousParty[TypeCode='DEFENDANT']/DateOfService) != 0">
				<servicedate>
					<xsl:value-of select="Parties/LitigiousParty[TypeCode='DEFENDANT']/DateOfService"/>
				</servicedate>
			</xsl:if>
			<xsl:if test="servicereplydate">
				<servicereplydate/>
			</xsl:if>
			<xsl:if test="interimorderdeadline">
				<interimorderdeadline/>
			</xsl:if>
			<xsl:if test="string-length(/params/param/ds/EnterVariableData/DeceasedEstateName) > 0">
				<estate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DeceasedEstateName"/>
				</estate>
			</xsl:if>
			<xsl:if test="/params/param/ds/CaseEvent/ReceiptDate">
				<receiptdate>
					<xsl:value-of select="/params/param/ds/CaseEvent/ReceiptDate"/>
				</receiptdate>
			</xsl:if>
			<xsl:if test="/params/param/ds/EnterVariableData/Stayed">
				<claimcounterclaimboth>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Stayed"/>
				</claimcounterclaimboth>
			</xsl:if>
			<xsl:if test="/params/param/ds/EnterVariableData/allocationtype">
				<allocation>
					<xsl:value-of select="/params/param/ds/EnterVariableData/allocationtype"/>
				</allocation>
			</xsl:if>
			<xsl:if test="/params/param/ds/EnterVariableData/Transfer/allocationToTrack">
				<allocationtotrack>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/allocationToTrack"/>
				</allocationtotrack>
			</xsl:if>
			<xsl:if test="/params/param/ds/EnterVariableData/MultiTrackAllocation/considerAllocQA">
				<aqconsideredregarding>
					<xsl:value-of select="/params/param/ds/EnterVariableData/MultiTrackAllocation/considerAllocQA"/>
				</aqconsideredregarding>
			</xsl:if>
			<!-- CJR023A BEGIN-->
				<hearingduration>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/hearingTimeAllowed"/>
				</hearingduration>
				<hearingdurationunits>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/hearingTimeAllowedUnits"/>
				</hearingdurationunits>
				<smallclaitypedirections>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/directionsTypeReqd"/>
				</smallclaitypedirections>
				<docsservedandfiled>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isServeFileDocs"/>
				</docsservedandfiled>
				<directionstype>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/directionsTypeReqd"/>
				</directionstype>
				<docsfiled>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isServeFileDocs"/>
				</docsfiled>
				<docsfiledate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/fileDocsWhen"/>
				</docsfiledate>
				<origdocs>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/bringOrigDocs"/>
				</origdocs>
				<costrepairs>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/ispartiesToAgreeRepairs"/>
				</costrepairs>
				<itemswork>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isComplaintsFiledList"/>
				</itemswork>
				<filelist>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/whoFilesList"/>
				</filelist>
				<filelistother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/otherPartyTitle1"/>
				</filelistother>
				<servlist>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/whoServedListCopy"/>
				</servlist>
				<servlistother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/otherPartyTitle2"/>
				</servlistother>
				<listcopydocs>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isListFiledWithCopy"/>
				</listcopydocs>
				<datelist>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/listServedFiledDate"/>
				</datelist>
				<workdone>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isWorkMaterialsFiledList"/>
				</workdone>
				<fileworkdone>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/whoFilesList2"/>
				</fileworkdone>
				<fileworkdoneother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/otherPartyTitle3"/>
				</fileworkdoneother>
				<serfvworkdone>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/whoServedCopyList2"/>
				</serfvworkdone>
				<serfvworkdoneother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/otherPartyTitle4"/>
				</serfvworkdoneother>
				<workdonecopy>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/listFiledWithCopyDocs"/>
				</workdonecopy>
				<dateworkdone>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/listServedFiledDate2"/>
				</dateworkdone>
				<itemloss>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/lossDamageItemsFiled"/>
				</itemloss>
				<fileitemloss>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/whoFilesList3"/>
				</fileitemloss>
				<fileitemlossother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/otherPartyTitle5"/>
				</fileitemlossother>
				<payitemloss>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/whoPaysLossDamage"/>
				</payitemloss>
				<payitemlossother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/titleOfOtherParty"/>
				</payitemlossother>
				<agreeitemloss>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/partiesAgreeCostNature"/>
				</agreeitemloss>
				<agreeworkdone>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/partiesAgressCostNature2"/>
				</agreeworkdone>
				<witstate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isWitnessStatementsInc"/>
				</witstate>
				<sketchplan>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/sketchPlansPhotosReqd"/>
				</sketchplan>
				<photorequire>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/photosWorkReqd"/>
				</photorequire>
				<photodirect>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/photoDirnsGiven"/>
				</photodirect>
				<videodirect>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/videoEvidenceDirns"/>
				</videodirect>
				<directdiscount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/discountEvidenceDirnGiven"/>
				</directdiscount>
				<specialdirns>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isSpecialDirns"/>
				</specialdirns>
				<clarifycasedirns>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isPartyToClarify"/>
				</clarifycasedirns>
				<ccparty>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/whoClarifiesCase"/>
				</ccparty>
				<ccpartyother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/otherPartyTitle6"/>
				</ccpartyother>
				<ccserve>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/whoIsServed"/>
				</ccserve>
				<ccserveother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/otherPartyTitle7"/>
				</ccserveother>
				<ccfiledate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/documentsFiledByDate2"/>
				</ccfiledate>
				<ccfiled>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/whatIsFiled"/>
				</ccfiled>
				<ccwording>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/detailsWhatFiled"/>
				</ccwording>
				<ccunless>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/uOClarification"/>
				</ccunless>
				<ccunlessdet>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/uODetails"/>
				</ccunlessdet>
				<inspectiondirns>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isInspectDirns"/>
				</inspectiondirns>
				<iparty>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/allowInspectParty"/>
				</iparty>
				<ipartyother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/otherPartyTitle8"/>
				</ipartyother>
				<ipartytoinsp>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/partyToInspect"/>
				</ipartytoinsp>
				<ipartytoinspother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/otherPartyTitle9"/>
				</ipartytoinspother>
				<iinspected>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/whatInpectedDetails"/>
				</iinspected>
				<inoofdays>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/reqToInspectDays"/>
				</inoofdays>
				<iunless>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/uOInspectDirns"/>
				</iunless>
				<iunlessdet>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/uODetails2"/>
				</iunlessdet>
				<dcbrought>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/broughtToHearing"/>
				</dcbrought>
				<dcparty>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/partyBringItems"/>
				</dcparty>
				<dcpartyother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/otherPartyTitle10"/>
				</dcpartyother>
				<dcitems>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/broughtItemsDetails"/>
				</dcitems>
				<dcunless>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/uOOtherItems"/>
				</dcunless>
				<dcunlessdet>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/uODetails3"/>
				</dcunlessdet>
				<specwitstate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/inclWitnessStatements"/>
				</specwitstate>
				<notcomply>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/docsIntoAccount"/>
				</notcomply>
				<expertevid>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isExpertEvidenceNec"/>
				</expertevid>
				<expertissue>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/expertIssueReqd"/>
				</expertissue>
				<expertprof>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/expertProfession"/>
				</expertprof>
				<specvideo>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/isShowVideo"/>
				</specvideo>
				<specvideodays>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/videoBeforeHearing"/>
				</specvideodays>
				<ishrgdaterqd>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SmallTrack/hearingDateReqd"/>
				</ishrgdaterqd>
			<!-- CJR023A END-->
			<!-- CJR024 BEGIN-->
			<hrgwording3>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/wording"/>
			</hrgwording3>
			<noticeptrtitle>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/noticeType2"/>
			</noticeptrtitle>
			<noticeptrtitleother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/otherNoticeType"/>
			</noticeptrtitleother>
			<timeestimate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/isHearingTimeEst"/>
			</timeestimate>
			<hrgduration>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/timeEstimate"/>
			</hrgduration>
			<hrgdurationunits>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/timeEstimateUnits"/>
			</hrgdurationunits>
			<!-- CJR024 END-->
			<formreturndate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/FormReturnDate"/>
			</formreturndate>
			<provassessmentcosts>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ProvisionalAssessmentCosts"/>
			</provassessmentcosts>
			<questionairereturndate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/LQFileByDate"/>
			</questionairereturndate>
			<localnumber>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Process/localnumber"/>
			</localnumber>
			<processnotserved>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Process/notserved"/>
			</processnotserved>
			<fromothercourt>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Process/court"/>
			</fromothercourt>
			<envelopemark>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Process/envelope"/>
			</envelopemark>
			<envelopemarkother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Process/envelope/other"/>
			</envelopemarkother>
			<formcompletedate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/FormReturnDate"/>
			</formcompletedate>
			<wordingrequired>
				<xsl:value-of select="/params/param/ds/EnterVariableData/wordingrequired"/>
			</wordingrequired>
			<applicationfor>
				<xsl:copy-of select="/params/param/ds/EnterVariableData/applicationfor"/>
			</applicationfor>
			<defendantintention>
				<xsl:value-of select="/params/param/ds/EnterVariableData/defendantintention"/>
			</defendantintention>
			<defendantintentionother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/defendantintentionother"/>
			</defendantintentionother>
			<defendantnamecorrected>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Defendant/namecorrected"/>
			</defendantnamecorrected>
			<newdefendantname>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Defendant/newdefendantname"/>
			</newdefendantname>
			<xsl:if test="servicename">
				<servicename/>
			</xsl:if>

				<servicesolicitorname>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Solicitor/ContactDetails/solName"/>
				</servicesolicitorname>

				<serviceaddress>
					<serviceaddressgiven>
						<xsl:value-of select="/params/param/ds/EnterVariableData/newaddressforservice"/>
					</serviceaddressgiven>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/Party/Address"/>
				</serviceaddress>

				<serviceaddressdx>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Solicitor/ContactDetails/dX"/>
				</serviceaddressdx>

				<allocationreasongiven>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Allocation/hasreason"/>
				</allocationreasongiven>

				<allocationreason>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/Allocation/reasons"/>
				</allocationreason>
				
				<judgetitle>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/JudgeTitle"/>	
				</judgetitle>

				<processnotservedother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Process/processnotservedother"/>
				</processnotservedother>

				<trialrespect>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/trialRespective"/>
				</trialrespect>

			<!-- CJR031 BEGIN-->
			<filedcounterclaim>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Filed/selectItemLsB"/>
			</filedcounterclaim>
			<deftotal>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Filed/noDefsFiled"/>
			</deftotal>
			<enclosed>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Filed/enclosed"/>
			</enclosed>
			<qreturndate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Filed/questReturnDate"/>
			</qreturndate>
			<qafee>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Filed/aQFilingFee"/>
			</qafee>
			<!-- CJR031 END-->
			<!-- CJR036 BEGIN-->
			<sumpayable>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DefaultCostsCert/sumPayable"/>
			</sumpayable>
			<sumpayable2>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DefaultCostsCert/sumPayable2"/>
			</sumpayable2>
			<sumpayablewithin>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DefaultCostsCert/whenSumPayable"/>
			</sumpayablewithin>
			<interestentitlement>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DefaultCostsCert/interestEntitlement"/>
			</interestentitlement>
			<amtpaiddate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DefaultCostsCert/dateAmountPaid"/>
			</amtpaiddate>			
			<!-- CJR036 END-->
			<!-- CJR037 BEGIN-->
			<assessedcosts>
				<xsl:value-of select="/params/param/ds/EnterVariableData/FinalCosts/totalAssessedCost"/>
			</assessedcosts>
			<detailassessmentcosts>
				<xsl:value-of select="/params/param/ds/EnterVariableData/FinalCosts/detailAssessCosts"/>
			</detailassessmentcosts>
			<amtpaidintrim>
				<xsl:value-of select="/params/param/ds/EnterVariableData/FinalCosts/interimCostCert"/>
			</amtpaidintrim>
			<balancewording>
				<xsl:value-of select="/params/param/ds/EnterVariableData/FinalCosts/iclCostDetAssess"/>
			</balancewording>
			<amtalreadypaid>
				<xsl:value-of select="/params/param/ds/EnterVariableData/FinalCosts/amountAlreadyPaid"/>
			</amtalreadypaid>
			<intrimcostscrtdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/FinalCosts/interimCostCertDate"/>
			</intrimcostscrtdate>
			<intrimsumpayablewithin>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DefaultCostsCert/dateAmountPaid"/>
			</intrimsumpayablewithin>
			<!-- CJR037 END-->
			<!-- CJR038 BEGIN-->
			<sumtopay>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/sumToPay"/>
			</sumtopay>
			<hrgwording2>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/applicationFor"/>
			</hrgwording2>
			<!-- CJR038 END-->
			<!-- CJR050 BEGIN-->
			<possessionproperty>
				<xsl:apply-templates select="OtherPossessionAddress/Address"/>
			</possessionproperty>
			<possessiondate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/possessionDate"/>
			</possessiondate>
			<amountrepresents>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/sumRepresents"/>
			</amountrepresents>
			<amountrepresentsother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/description"/>
			</amountrepresentsother>
			<amountordered>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/amountOrdered"/>
			</amountordered>
			<dailypaymentsreq>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/hasAddDailyPayments"/>
			</dailypaymentsreq>
			<dailyamount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/dailyPaymentAmt"/>
			</dailyamount>
			<dailystartdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/dailyPaymentStartDate"/>
			</dailystartdate>
				<orderforcosts>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/hasCostOrder"/>
				</orderforcosts>
				<costtype>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/costType"/>
				</costtype>
				<costscale>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/CostScale"/>
				</costscale>				
				<amountcosts>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/costs"/>
				</amountcosts>
				<instalmentamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/instalmentamount"/>
				</instalmentamount>
				<instalmentperiod>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/instalmentperiod"/>
				</instalmentperiod>
				<paymentinfulldate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/paymentdate"/>
				</paymentinfulldate>
				<firstpaymentdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/instalmentdate"/>
				</firstpaymentdate>
				<payaccountcosts>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/paymentsOnAccount"/>
				</payaccountcosts>
				<amountaccountcosts>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/paidOnAccountAmt"/>
				</amountaccountcosts>
			<!-- CJR050 END-->
			<!-- CJR051 BEGIN-->
			<writtenevidence>
				<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/hasDefWrittenEvidence"/>
			</writtenevidence>
			<!-- CJR051 END-->
			<!-- CJR052 BEGIN-->
				<datecease>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/orderCeaseDate"/>
				</datecease>
			<!-- CJR052 END-->
			<!-- CJR053 BEGIN-->
			<!-- CJR053 END-->
			<!-- CJR054 BEGIN-->
				<outstandingbalance>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/OutstandingBalance"/>
				</outstandingbalance>
				<costsdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/dateCostPaid"/>
				</costsdate>
				<arrearsamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/arrearsAmnt"/>
				</arrearsamount>
				<initialpayment>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/initialPaymentAmnt"/>
				</initialpayment>
				<initialamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/intalmentAmount2"/>
				</initialamount>
				<initialdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/initialPaymentDate"/>
				</initialdate>
				<moneyjudgment>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/costType2"/>
				</moneyjudgment>
				<judgmentgranted>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/judgmentMoneyGranted"/>
				</judgmentgranted>
			<!-- CJR054 END-->
			<!-- CJR061 BEGIN-->
				<applyingparty>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ASBO/partySeekingOrder"/>
				</applyingparty>
				<applicantname>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ASBO/ApplicantName"/>
				</applicantname>
				<ordersubjectsex>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ASBO/subjectSex"/>
				</ordersubjectsex>
				<prohibitedactivity>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ASBO/activityProhibited"/>
				</prohibitedactivity>
				<dateorderexpires>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ASBO/orderExpDate"/>
				</dateorderexpires>
				<orderwithoutnotice>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ASBO/isInterimWithoutNotice"/>
				</orderwithoutnotice>
			<!-- CJR061 END-->
			<!-- CJR072 BEGIN-->
				<partyfailfilelq>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/FailureToFile/partiesFailedToFile/*"/>
				</partyfailfilelq>
				<hrglq>
					<xsl:value-of select="/params/param/ds/EnterVariableData/FailureToFile/orderDetails2"/>
				</hrglq>
				<struckout>
					<xsl:value-of select="/params/param/ds/EnterVariableData/FailureToFile/struckOut"/>
				</struckout>
			<!-- CJR072 END-->
			<!-- CJR073 BEGIN-->
				<whoseevidence>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SubsService/whosEvidenceRead"/>
				</whoseevidence>
				<dateofevidence>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SubsService/evidenceReadDate"/>
				</dateofevidence>
				<document>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SubsService/doc2BServed"/>
				</document>
				<newspaper>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SubsService/newspaperName"/>
				</newspaper>
				<servtype>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SubsService/howDocServed"/>
				</servtype>
				<addresstype>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SubsService/isAddress"/>
				</addresstype>
			<!-- CJR073 END-->
			<!-- CJR080 BEGIN-->
				<questioningrequired>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/isN39Reqd"/>
				</questioningrequired>
				<whoconsideredapplication>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/whoConsidApp"/>
				</whoconsideredapplication>
				<judgeofthiscourt>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/judgmentThisCourt"/>
				</judgeofthiscourt>
				<judgecourtid>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/judgmentCourtCode"/>
				</judgecourtid>
				<judgecourtname>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/judgmentCourtName"/>
				</judgecourtname>
				<claimno>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/claimNumber"/>
				</claimno>
				<judgtype>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/judgmentOrderType"/>
				</judgtype>
				<nonmoneyorderdetails>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/nonMoneyOrderDetails"/>
				</nonmoneyorderdetails>
				<persondetails>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/QuestionWho"/>
				</persondetails>
				<officername>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/officerName"/>
				</officername>
				<officerfullname>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/officerFullName"/>
				</officerfullname>
				<attendby>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/beforeWhom"/>
				</attendby>
				<listsupplied>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/hasAppDocList"/>
				</listsupplied>
				<n39served>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/whoServesN39"/>
				</n39served>
			<!-- CJR080 END-->
			<!-- CJR081 BEGIN-->
				<isofficer>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/isAgainstCoOfficer"/>
				</isofficer>
				<officer>
					<xsl:if test="/params/param/ds/EnterVariableData/AttendForQuestion/officerName">
						<name>
							<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/officerName"/>
						</name>
					</xsl:if>
					<xsl:if test="/params/param/ds/EnterVariableData/DisobedienceArrest/officerFullName">
						<name>
							<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/officerFullName"/>
						</name>
					</xsl:if>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/AttendForQuestion/Officer/Address"/>
				</officer>
			<xsl:if test="/params/param/ds/EnterVariableData/Warrant/WarrantNumber">
				<warrantnumber>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Warrant/WarrantNumber"/>
				</warrantnumber>
			</xsl:if>
			<warranttotalremaining>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Warrant/TotalRemaining"/>
			</warranttotalremaining>
				<warrantorderdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/warrantOrderDate"/>
				</warrantorderdate>
				<dateofn39>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/n39Date"/>
				</dateofn39>
				<wpprisonname>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/prisonName"/>
				</wpprisonname>
				<wpcommitaldays>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/commitalDuration"/>
				</wpcommitaldays>
				<otherreqt>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/otherDirections"/>
				</otherreqt>
				<dateofn79aorder>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/n79ADate"/>
				</dateofn79aorder>
				<servicedateofn79a>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/n79AServiceDate"/>
				</servicedateofn79a>
				<n79acontempt>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/n79AComptemptDtls"/>
				</n79acontempt>
				<n39contempt>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/n39ComtemptDtls"/>
				</n39contempt>
				<othern39contempt>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/otherN39ComtemptDtls"/>
				</othern39contempt>
				<otherdetails>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/failureComplyDtls"/>
				</otherdetails>
				<debtorsex>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/morFDebtor"/>
				</debtorsex>
			<!-- CJR081 END-->
			<!-- CJR082 BEGIN-->
				<othersupsdetails>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceCommit/otherSuspDtls"/>
				</othersupsdetails>
				<arrestdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceCommit/arrestDate"/>
				</arrestdate>
				<lovn79acontempt>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceCommit/n39ComtemptDtls"/>
				</lovn79acontempt>
				<otherlovn79acontempt>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceCommit/otherN39ComtemptDtls"/>
				</otherlovn79acontempt>
				<n79acontempt2>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Disobedience/n79AContemptDetails2"/>
				</n79acontempt2>
			<!-- CJR082 END-->
			<!-- CJR083 BEGIN-->
				<isnewN79asreqd>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/isNewN79AsReqd"/>
				</isnewN79asreqd>
				<servicedateofn79a>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/n79AServiceDate"/>
				</servicedateofn79a>
				<servicedateofn39>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/n39ServiceDate"/>
				</servicedateofn39>
				<affofservby>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/affidavitOfServiceBy"/>
				</affofservby>
				<affofservdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/affidavitOfServiceDate"/>
				</affofservdate>
				<affofexpenseby>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/affidavitExpensesBy"/>
				</affofexpenseby>
				<dateaffofexpense>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/affidavitExpensesDate"/>
				</dateaffofexpense>
				<costpaymentdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/costPaymentDate"/>
				</costpaymentdate>
				<dateofnotattcert>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/certificateDate"/>
				</dateofnotattcert>
				<certby>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/nonAttendanceCertBy"/>
				</certby>
				<certbyjudgetitle>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceCommit/n40BJudgeTitle"/>
				</certbyjudgetitle>
				<certbyjudgename>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceCommit/n40BJudgeName"/>
				</certbyjudgename>
				<dateexpensespaid>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/expensesPaidDate"/>
				</dateexpensespaid>
				<specificquesdetail>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/specificQDtls"/>
				</specificquesdetail>
				<reasonforn79a>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/n79aReason"/>
				</reasonforn79a>
				<dateofhearingn39>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/n39HearingDate"/>
				</dateofhearingn39>
				<compliancedetails>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/requirementDtls"/>
				</compliancedetails>
				<amountofcosts>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/attendCostAmt"/>
				</amountofcosts>
				<n79aserved>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/n79AServedBy"/>
				</n79aserved>
				<n39servedby>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SuspCOforDisobedience/n39ServedBy"/>
				</n39servedby>			
			<!-- CJR083 END-->
			<!-- CJR090 BEGIN-->
				<intmorderdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/HardshipPayment/thirdPartyOrderDate"/>
				</intmorderdate>
				<n84total>
					<xsl:value-of select="/params/param/ds/EnterVariableData/HardshipPayment/n84Total"/>
				</n84total>
				<thirdpartyamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/HardshipPayment/thirdPartyAmnt"/>
				</thirdpartyamount>
				<directtodebtor>
					<xsl:value-of select="/params/param/ds/EnterVariableData/HardshipPayment/isDebtorPayment"/>
				</directtodebtor>
				<partyrecpayment>
					<xsl:value-of select="/params/param/ds/EnterVariableData/HardshipPayment/paymentReceiveBy"/>
				</partyrecpayment>
				<singlepayment>
					<xsl:value-of select="/params/param/ds/EnterVariableData/HardshipPayment/singlePaymentAmnt"/>
				</singlepayment>
				<weekmonth>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Hardship/instalPeriod2"/>
				</weekmonth>
				<dayofweek>
					<xsl:value-of select="/params/param/ds/EnterVariableData/HardshipPayment/instalmentDay"/>
				</dayofweek>
				<dayofmonth>
					<xsl:value-of select="/params/param/ds/EnterVariableData/HardshipPayment/instalmentMonth"/>
				</dayofmonth>
				<paymoney>
					<xsl:value-of select="/params/param/ds/EnterVariableData/FinalThirdPartyDebt/tPAmntToPay"/>
				</paymoney>
				<paymoneydate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/FinalThirdPartyDebt/payMoneyDate"/>
				</paymoneydate>
			<!-- CJR090 END-->
			<!-- CJR093 BEGIN-->
				<dateorder2>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/orderDate2"/>
				</dateorder2>
				<island>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCharge/isAssetChargedLand"/>
				</island>
				<landregnumber>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCharge/landRegTitleNo"/>
				</landregnumber>
				<islandaddress>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCharge/isChargedLandDebtorsAdd"/>
				</islandaddress>
				<land>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/InterimCharge/Asset/Address"/>
				</land>
				<securitydetails>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCharge/securityDtls"/>
				</securitydetails>
				<n86transfercourtcode>
					<xsl:value-of select="/params/param/ds/EnterVariableData/N86Transfercourt/code"/>
				</n86transfercourtcode>
				<n86transfercourtname>
					<xsl:value-of select="/params/param/ds/EnterVariableData/N86Transfercourt/name"/>
				</n86transfercourtname>
			<!-- CJR093 END-->
			<!-- CJR094 BEGIN-->
				<interimdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/FinalChargeOrder/interimOrderDate"/>
				</interimdate>
				<interimmod>
					<xsl:value-of select="/params/param/ds/EnterVariableData/FinalChargeOrder/isInterimModified"/>
				</interimmod>
				<amountcharge>
					<xsl:value-of select="/params/param/ds/EnterVariableData/FinalChargeOrder/amntOfCharge"/>
				</amountcharge>
				<secoldlady>
					<xsl:value-of select="/params/param/ds/EnterVariableData/FinalChargeOrder/hasBofESecurities"/>
				</secoldlady>
				<secinstitution>
					<xsl:value-of select="/params/param/ds/EnterVariableData/FinalChargeOrder/instnHoldingSecurity"/>
				</secinstitution>
			<!-- CJR094 END-->
			<!-- CJR100 BEGIN-->
				<breachorderdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Guardianship/breachDate"/>
				</breachorderdate>
                <section>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Guardianship/housingActSect"/>
				</section>
				<evidencegiven>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Guardianship/hasMedicalEvidence"/>
				</evidencegiven>
				<medicalpract1>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Guardianship/firstMedPract"/>
				</medicalpract1>
				<medicalpract2>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Guardianship/secondMedPract"/>
				</medicalpract2>
				<deftdisability>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Guardianship/defDisability"/>
				</deftdisability>
				<individualnamed>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Guardianship/isNamedIndividual"/>
				</individualnamed>
				<nameofindividual>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Guardianship/individualName"/>
				</nameofindividual>
				<councilname>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Guardianship/councilName"/>
				</councilname>
			<!-- CJR100 END-->
			<!-- CJR101 BEGIN-->
				<interimorder>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Hospital/isInterimOrder"/>
				</interimorder>
			<hospital>
					<name>
						<xsl:value-of select="/params/param/ds/EnterVariableData/Hospital/hospitalName"/>
					</name>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/Hospital/Address"/>
			</hospital>
				<detentionperiod>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Hospital/detentionPeriod"/>
				</detentionperiod>
				<detentionperiodunits>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Hospital/detentionPeriodUnits"/>
				</detentionperiodunits>
				<conveyorname>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Hospital/conveysDefendant"/>
				</conveyorname>
				<posidentified>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Hospital/isPlaceOfSafetyId"/>
				</posidentified>

			<placeofsafety>
					<name>
						<xsl:value-of select="/params/param/ds/EnterVariableData/Hospital/placeOfSafety/Name"/>
					</name>
					<conveyor>
						<xsl:value-of select="/params/param/ds/EnterVariableData/Hospital/conveyToPOSBy"/>
					</conveyor>
				<xsl:apply-templates select="/params/param/ds/EnterVariableData/Hospital/placeOfSafety/Address"/>
			</placeofsafety>
			<!-- CJR101 END-->
			<!-- CJR102 BEGIN-->
				<injunctdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ArrestWarrent/injunctionDate"/>
				</injunctdate>
				<schedattach>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ArrestWarrent/isBreachesSchdAttched"/>
				</schedattach>
				<breachdetails>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/ArrestWarrent/breachDtls"/>
				</breachdetails>
				<bringnow>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ArrestWarrent/isDefBeforeCourt"/>
				</bringnow>
			<!-- CJR102 END-->
			<!-- CJR103 BEGIN-->
				<!--  duplicate    schedattach>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ArrestWarrent/isBreachesSchdAttched"/>
				</schedattach-->
				<bailconditions>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/bailConditionsSet"/>
				</bailconditions>
				<recognizancesum>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/recognizanceSum"/>
				</recognizancesum>
				<suretysum1>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/suretySum1"/>
				</suretysum1>
				<suretysum2>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/suretySum2"/>
				</suretysum2>
				<furtherbailconds>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/hasFurtherBailConditions"/>
				</furtherbailconds>
				<otherconditions>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/otherConditions"/>
				</otherconditions>
				<medicalexam>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/isMedExamOrdered"/>
				</medicalexam>
			<!-- CJR103 END-->
			<!-- CJR104 BEGIN-->
				<medicalevidgiven>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/isMPEvidenceGiven"/>
				</medicalevidgiven>
				<evidencegivenhousing>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/evidenceType"/>
				</evidencegivenhousing>
				<medicalpract1housing>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/mPName"/>
				</medicalpract1housing>
				<poshousing>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/isPOSid"/>
				</poshousing>
				<conveyerhousing>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/conveyDeftoPOS"/>
				</conveyerhousing>
				<remandorder>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Remand/defRemandorDetnd"/>
				</remandorder>
			<!-- CJR104 END-->
			<!-- CJR105 BEGIN-->
				<orderid>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/orderToProduce"/>
				</orderid>
				<hasfurtherhearing>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/noticeOfFurtherHearing"/>
				</hasfurtherhearing>
				<dateconsidered>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/appConsideredDate"/>
				</dateconsidered>
				<ltdcomp>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/againstLtdCo"/>
				</ltdcomp>
				<forcedate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/inForceDate"/>
				</forcedate>
				<forcetime>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/orderCeaseTime"/>
				</forcetime>
				<detailsofacts>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/actsDetails"/>
				</detailsofacts>
				<dateofacts>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/actsPerfDate"/>
				</dateofacts>
				<furtherterms>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/furtherTerms"/>
				</furtherterms>
				<orderonnotice>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/orderOnNotice"/>
				</orderonnotice>
				<orderdetails>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/Interlocutory/orderDetailse"/>
				</orderdetails>
				<poa105>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/pOAApply"/>
				</poa105>
				<violenceharm>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/riskOfViolence"/>
				</violenceharm>
				<poaparas>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Interlocutory/pOAParaNums"/>
				</poaparas>
			<!-- CJR105 END-->
			<!-- CJR184 BEGIN-->
				<fee>
						<for>
							<xsl:value-of select="/params/param/ds/EnterVariableData/PayFee/feeFor"/>
						</for>
						<unpaidamount>
							<xsl:value-of select="/params/param/ds/EnterVariableData/PayFee/unpaidAmnt"/>
						</unpaidamount>
						<filedate>
							<xsl:value-of select="/params/param/ds/EnterVariableData/PayFee/filedDate"/>
						</filedate>
						<allocatedto>
							<xsl:value-of select="/params/param/ds/EnterVariableData/PayFee/claimAllocatedTo"/>
						</allocatedto>
						<listeddate>
							<xsl:value-of select="/params/param/ds/EnterVariableData/PayFee/listedDate"/>
						</listeddate>
						<paydate>
							<xsl:value-of select="/params/param/ds/EnterVariableData/PayFee/feePayByDate"/>
						</paydate>
				</fee>
			<!-- CJR184 END-->
				<transferdateflag>
					<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/trialDateFixed"/>
				</transferdateflag>
			<!-- CO02 BEGIN -->
				<hearingtyper5>
					<xsl:value-of select="/params/param/ds/EnterVariableData/NoticeType2Ent"/>
				</hearingtyper5>
				<hearingtyper5other>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/otherNoticeType"/>
				</hearingtyper5other>
				<hearingwordingr5>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/wording"/>
				</hearingwordingr5>
			<!-- CO02 END -->
			<typeofprocess>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/processtype"/>
			</typeofprocess>
			<visits>
				<xsl:for-each select="/params/param/ds/EnterVariableData/ConfNotice/visits/visit">
					<visit>
						<visitdate>
							<xsl:value-of select="date"/>
						</visitdate>
						<time>
							<xsl:value-of select="time"/>
						</time>
						<resultofvisit>
							<xsl:value-of select="result"/>
						</resultofvisit>
					</visit>
				</xsl:for-each>
			</visits>
			<bailiffvisitreason>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/bailiffvisitreason"/>
			</bailiffvisitreason>
			<letterleftdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/subServiceDate"/>
			</letterleftdate>
			<earningsorderother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/requestFor"/>
			</earningsorderother>
			<earningsorderothother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/returnPorcessType"/>
			</earningsorderothother>
			<orderfee>
				<xsl:value-of select="/params/param/ds/EnterVariableData/fee"/>
			</orderfee>
			<instalmentdueday>
				<xsl:value-of select="/params/param/ds/EnterVariableData/NumDayofMonthInstalDue"/>
			</instalmentdueday>
		</notice>
		<order>
        <!-- // Order starts here ....................//-->
        	<applicantidqa>
        		<xsl:value-of select="/params/param/ds/EnterVariableData/PMApp"/>
        	</applicantidqa>
            <settingdownno>
                <xsl:value-of select="/params/param/ds/EnterVariableData/SDNumber"/>
            </settingdownno>
			<demandissuedate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DemandIssued"/>
			</demandissuedate>
			<specialamount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/specialInCourt"/>
			</specialamount>
			<basicamount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/BasicInCourt"/>
			</basicamount>
			<cashamount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/cashInCourt" />
			</cashamount>
			<warrantsuspended>
				<xsl:value-of select="/params/param/ds/EnterVariableData/WarrantSuspended"/>
			</warrantsuspended>
			<outstandingamount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/WarrantOutstandingAmount"/>
			</outstandingamount>
			<ordersuspend>
				<xsl:value-of select="/params/param/ds/EnterVariableData/OrderSuspend"/>
			</ordersuspend>	
			<ordersuspendextended>
				<xsl:value-of select="/params/param/ds/EnterVariableData/OrderSuspendExtended"/>
			</ordersuspendextended>	
			<balancedue>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Balancedue"/>
			</balancedue>						
			<judgmentpartytype>
				<xsl:choose>
					<xsl:when test="/params/param/ds/EnterVariableData/ApplicationBy = 'JD'">Debtor</xsl:when>
					<xsl:when test="/params/param/ds/EnterVariableData/ApplicationBy = 'JC'">Creditor</xsl:when>					
				</xsl:choose>
			</judgmentpartytype>			
				<filer>
					<xsl:value-of select="/params/param/ds/CaseEvent/InstigatorList/Instigator/CasePartyNumner"/>
				</filer>
				<documentDetails>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/Documents/filedDetails"/>
				</documentDetails>
				<fileddate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Documents/filedDate"/>
				</fileddate>
				<allocationquestionairefiledate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AQ/filedByDate"/>
				</allocationquestionairefiledate>
				<documentservice>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Document"/>
				</documentservice>
				<documentserviceother>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/OtherDoc"/>
				</documentserviceother>
				<partyservice>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PartyOn"/>
				</partyservice>
				<partyserviceother>
					<xsl:value-of select="/params/param/ds/EnterVariableData/OtherParty"/>
				</partyserviceother>
				<allpartiesagree>
					<xsl:value-of select="/params/param/ds/EnterVariableData/partyagreement"/>
				</allpartiesagree>
				<datestayeduntil>
					<xsl:value-of select="/params/param/ds/EnterVariableData/staydate"/>
				</datestayeduntil>
				<fdexpirydate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/expirydate"/>
				</fdexpirydate>
				<interestincluded>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Payment/interestincluded"/>
				</interestincluded>
				<balanceoftotalprice>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/balanceoftotalprice"/>
				</balanceoftotalprice>
				<datemade>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/date"/>
				</datemade>
				<paymentdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/dateofpayment"/>
				</paymentdate>
				<applicationInstigator>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ApplicationParty"/>
				</applicationInstigator>
				<applicationInstigatorOther>
					<xsl:value-of select="/params/param/ds/EnterVariableData/OtherApplicationParty"/>
				</applicationInstigatorOther>
				<interestincludedamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Payment/totalamount"/>
				</interestincludedamount>
				<orderdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/JudgmentOrder/Date"/>
				</orderdate>
				<dateofextension>
					<xsl:value-of select="/params/param/ds/EnterVariableData/dateOfExtension"/>
				</dateofextension>				
				<goodsreturndate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/goodsreturndate"/>
				</goodsreturndate>
				<instalmentdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/instalmentdate"/>
				</instalmentdate>
				<haswrittenevidence>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/hasDefWrittenEvidence"/>
				</haswrittenevidence>
				<hascostorder>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterimCosts/PossessionOrder/hasCostOrder"/>
				</hascostorder>
				<haspostponerequest>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/hasPostponeRequest"/>
				</haspostponerequest>
			<!--CJR170 BEGIN-->
			<deponent>
				<name>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ExamDeponent/deponentName"/>
				</name>
				<xsl:apply-templates select="/params/param/ds/EnterVariableData/ExamDeponent/Deponent/Address"/>
				<type>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DeponentExam/partyMakingApp"/>
				</type>
				<offer>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ExamDeponent/offerConductMoney"/>
				</offer>
				<amount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ExamDeponent/amountOffered"/>
				</amount>
			</deponent>
			<!--CJR170 END-->
			<!--CJR177 BEGIN-->
			<settlement>
				<applicationdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Application/date"/>
				</applicationdate>
				<party>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/appForClaimantBy"/>
				</party>
				<isrepresented>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/wasDefRep"/>
				</isrepresented>
				<attendedfor>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/attendedForDef"/>
				</attendedfor>
				<satisfaction>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/isSumPaidInSat"/>
				</satisfaction>
				<amonut>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/satisfactionAmnt"/>
				</amonut>
				<ismultiple>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/moreThanOneClaim"/>
				</ismultiple>
				<subject>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/claimFor"/>
				</subject>
				<apportion>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/apportionAmnt"/>
				</apportion>
				<apportionsum>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/apportionSum"/>
				</apportionsum>
				<act>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/apportionSumAct"/>
				</act>
				<lawreform>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/lawReformActAmt"/>
				</lawreform>
				<accidentpayee>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/fatalAccidentSumTo"/>
				</accidentpayee>
				<claimamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/amtPaidToClaimant"/>
				</claimamount>
				<dependantamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/amntPaidChildDependant"/>
				</dependantamount>
				<childnames>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/childDepName"/>
				</childnames>
				<childgender>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/childSex"/>
				</childgender>
				<paydirect>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/payDirctToOtherParty"/>
				</paydirect>
				<paiddirectto>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/defPayDirctTo"/>
				</paiddirectto>
				<paiddirectdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/onOrBeforeDate"/>
				</paiddirectdate>
				<paydirectamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/amntPaidDirect"/>
				</paydirectamount>
				<investsum>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/defInvestFurtherSum"/>
				</investsum>
				<investsumamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/amntToInvest"/>
				</investsumamount>
				<investdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/investBeforeDate"/>
				</investdate>
				<firstcharge>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/subToFirstCharge"/>
				</firstcharge>
				<receiverapplication>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/appForReceiver"/>
				</receiverapplication>
				<receiverapplicationdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/appFiledBeforeDate"/>
				</receiverapplicationdate>
				<receiverapplicationamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/amntToInvest2"/>
				</receiverapplicationamount>
				<receiverapplicationfirstdirect>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/subToFirstCharge2"/>
				</receiverapplicationfirstdirect>
				<interest>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/interestPaidToDef"/>
				</interest>
				<rights>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/furtherClaimWaived"/>
				</rights>
				<claimantcosts>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/costForClmsSolicitor"/>
				</claimantcosts>
				<ispaidmajority>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Settlement/payOnMajority"/>
				</ispaidmajority>
			</settlement>
			<!--CJR177 END-->
			<!-- CJR027 & CJR199 BEGIN -->
				<clmevidencetimeunits>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/clmEvidenceTimeUnits"/>
				</clmevidencetimeunits>
				<clmevidencetime>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/clmEvidenceTime"/>
				</clmevidencetime>
				<defevidencetimeunits>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/defEvidenceTimeUnits"/>
				</defevidencetimeunits>
				<defevidencetime>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/defEvidenceTime"/>
				</defevidencetime>
				<submissiontimeunits>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/partySubmissionTimeUnits"/>
				</submissiontimeunits>
				<submissiontime>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/partySubmissionTime"/>
				</submissiontime>
				<remainingtimeunits>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/timeRemainingUnits"/>
				</remainingtimeunits>
				<remainingtime>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/timeRemaining"/>
				</remainingtime>
				<casesummary>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/caseSumIncluded"/>
				</casesummary>
				<agreebundle>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialNotice/partiesAgreeBundle"/>
				</agreebundle>
				<claimantoralevidenceby>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialDirections/clmtsOralEvidenceBy"/>
				</claimantoralevidenceby>
				<defendantoralevidenceby>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialDirections/clmntsWrittenEvidencdeBy"/>
				</defendantoralevidenceby>
				<claimantwrittenevidenceby>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialDirections/defdtsOralEvidenceBy"/>
				</claimantwrittenevidenceby>
				<defendantwrittenevidenceby>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialDirections/defdtsWrittenEvidenceBy"/>
				</defendantwrittenevidenceby>
				<timetableagreed>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TrialDirections/timeTableAgreed"/>
				</timetableagreed>
				<fine>
						<witnessdid>
							<xsl:value-of select="/params/param/ds/EnterVariableData/ConsiderFine/witnessDid"/>
						</witnessdid>
						<witnessto>
							<xsl:value-of select="/params/param/ds/EnterVariableData/ConsiderFine/witnessTo"/>
						</witnessto>
				</fine>
			<!-- CJR028 & CJR199 END -->
			<!--CJR186 BEGIN-->
				<part20>
						<formsincluded>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Part20/resFormsIncl"/>
						</formsincluded>
						<claimant>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Part20/part20Clmnt"/>
						</claimant>
						<defendant>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Part20/part20Defndt"/>
						</defendant>
						<fee>
							<xsl:value-of select="/params/param/ds/EnterVariableData/Part20/part20IssueFee"/>
						</fee>
				</part20>
			<!--CJR186 END-->
			<!-- CJR201 BEGIN -->
				<originalorderdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Variation/originalOrderDate"/>
				</originalorderdate>
			<cfotelephonenumber/>
            <cfo>
            <name/>
            <address>
                <line1/>
                <line2/>
                <line3/>
                <line4/>
                <line5/>
                <postcode/>
                          <dx/>
            </address>
            
            </cfo>
			<!-- CJR201 END -->
			<!-- CJR202 BEGIN -->
				<isfundnumber>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/isFundNumber"/>
				</isfundnumber>
				<cfofundnumber>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/fundNumber"/>
				</cfofundnumber>
				<cfoaccountnumber>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/cFOAccNumber"/>
				</cfoaccountnumber>
				<courtfunds>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/courtFunds"/>
				</courtfunds>
				<totalinvestmentamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/totalInvestAmnt"/>
				</totalinvestmentamount>
				<litigationfriend>
					<name>
						<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/litigationFriend"/>
					</name>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/InvestmentSchedule/Address"/>
						<partyid>
							<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/solicitor"/>
						</partyid>
				</litigationfriend>
				<beneficiary>
					<name>
						<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/Beneficiary/Name"/>
					</name>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/InvestmentSchedule/Beneficiary/Address"/>
						<dateofbirth>
							<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/dateOfBirth"/>
						</dateofbirth>
				</beneficiary>
				<isn243brequired>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/isN243BReqd"/>
				</isn243brequired>
				<partytoreceiven243b>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InvestmentSchedule/partyRecN243B"/>
				</partytoreceiven243b>
			<!-- CJR202 END -->
			<!-- CO03 BEGIN -->
				<text>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/EnterText"/>
				</text>
			<!-- CO03 END -->
			<!-- CO05 BEGIN -->
				<DFLT1-2>
					<xsl:value-of select="/params/param/ds/EnterVariableData/EnterItemDetails"/>
				</DFLT1-2>
			<!-- CO05 -->
			<!-- CO14 BEGIN -->
				<caeoinit>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Applicant"/>
				</caeoinit>
			<!-- CO14 END -->
			<!-- CO15 BEGIN -->
				<coststxt>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/CostsWording"/>
				</coststxt>
			<!-- CO15 END -->
			<!-- CO18 BEGIN -->
				<whatvaried>
					<xsl:value-of select="/params/param/ds/EnterVariableData/WhatIsVaried"/>
				</whatvaried>
				<variedcase>
					<xsl:value-of select="/params/param/ds/EnterVariableData/EnterCaseNumber"/>
				</variedcase>
				<variedamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/EnterTheAmount"/>
				</variedamount>
			<!-- CO18 END -->
			<!-- CONSOLIDATED ORDERS BEGIN -->
				<coorder>
					<feerate>
						<xsl:value-of select="/params/param/ds/MaintainCO/FeeRate"/>
					</feerate>
					<attendees>
						<xsl:copy-of select="/params/param/ds/EnterVariableData/Hearing/COAttendees/*"/>
					</attendees>
					<coapplication>
						<xsl:value-of select="/params/param/ds/EnterVariableData/DisStrAdj"/>
					</coapplication>
					<conumber>
						<xsl:value-of select="/params/param/ds/MaintainCO/CONumber"/>
					</conumber>
					<debtorname>
						<xsl:value-of select="/params/param/ds/MaintainCO/DebtorName"/>
					</debtorname>
					<oldnumber>
						<xsl:value-of select="/params/param/ds/MaintainCO/OldNumber"/>
					</oldnumber>
					<owningcourtcode>
						<xsl:value-of select="/params/param/ds/MaintainCO/OwningCourtCode"/>
					</owningcourtcode>
					<owningcourt>
						<xsl:value-of select="/params/param/ds/MaintainCO/OwningCourt"/>
					</owningcourt>
					<cotype>
						<xsl:value-of select="/params/param/ds/MaintainCO/COType"/>
					</cotype>
					<costatus>
						<xsl:value-of select="/params/param/ds/MaintainCO/COStatus"/>
					</costatus>
					<applnreceiveddate>
						<xsl:value-of select="/params/param/ds/MaintainCO/ApplnReceivedDate"/>
					</applnreceiveddate>
					<orderdate>
						<xsl:value-of select="/params/param/ds/MaintainCO/OrderDate"/>
					</orderdate>
					<comptype>
						<xsl:value-of select="/params/param/ds/MaintainCO/CompType"/>
					</comptype>
					<comprate>
						<xsl:value-of select="/params/param/ds/MaintainCO/CompRate"/>
					</comprate>
					<dividendtarget>
						<xsl:value-of select="/params/param/ds/MaintainCO/DividendTarget"/>
					</dividendtarget>
					<feerate>
						<xsl:value-of select="/params/param/ds/MaintainCO/FeeRate"/>
					</feerate>
					<adhocdividend>
						<xsl:value-of select="/params/param/ds/MaintainCO/AdhocDividend"/>
					</adhocdividend>
					<instalmentamount>
						<xsl:value-of select="/params/param/ds/MaintainCO/InstalAmount"/>
					</instalmentamount>
					<instalamountcurrency>
						<xsl:value-of select="/params/param/ds/MaintainCO/InstalAmountCurrency"/>
					</instalamountcurrency>
					<frequency>
						<xsl:value-of select="/params/param/ds/MaintainCO/Frequency"/>
					</frequency>
					<firstpaymentdate>
						<xsl:value-of select="/params/param/ds/MaintainCO/FirstPaymentDate"/>
					</firstpaymentdate>
					<reviewdate>
						<xsl:value-of select="/params/param/ds/MaintainCO/ReviewDate"/>
					</reviewdate>
					<revokeddischargedate>
						<xsl:value-of select="/params/param/ds/MaintainCO/RevokedDischargeDate"/>
					</revokeddischargedate>
					<debtoroccupation>
						<xsl:value-of select="/params/param/ds/MaintainCO/DebtorOccupation"/>
					</debtoroccupation>
					<payrollnumber>
						<xsl:value-of select="/params/param/ds/MaintainCO/PayrollNumber"/>
					</payrollnumber>
					<namedemployer>
						<xsl:value-of select="/params/param/ds/MaintainCO/NamedEmployer"/>
					</namedemployer>
					<protectedearningsrate>
						<xsl:value-of select="/params/param/ds/MaintainCO/ProtectedEarningsRate"/>
					</protectedearningsrate>
					<protectedearningsratecurrency>
						<xsl:value-of select="/params/param/ds/MaintainCO/ProtectedEarningsRateCurrency"/>
					</protectedearningsratecurrency>
					<paymentdividendinprogress>N</paymentdividendinprogress>
					<dividendcourtmoniesunavailable>N</dividendcourtmoniesunavailable>
					<unresolvedoverpayment>N</unresolvedoverpayment>
					<prepayoutlistrun>N</prepayoutlistrun>
					<adminordersenttoday>N</adminordersenttoday>
					<courtoftransfer>
						<xsl:value-of select="/params/param/ds/MaintainCO/CourtOfTransfer"/>
					</courtoftransfer>
					<courtnameoftransfer>
						<xsl:value-of select="/params/param/ds/MaintainCO/CourtNameOfTransfer"/>
					</courtnameoftransfer>
					<debtor>
						<type>debtor</type>
						<dateofbirth>
							<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/DateOfBirth"/>
						</dateofbirth>
						<id>
							<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/PartyId"/>
						</id>
						<name>
							<xsl:value-of select="/params/param/ds/MaintainCO/DebtorName"/>
						</name>
						<dx>
							<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/DX"/>
						</dx>
						<telno>
							<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/TelNo"/>
						</telno>
						<faxno>
							<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/FaxNo"/>
						</faxno>
						<email>
							<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Email"/>
						</email>
						<commmethod>
							<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/CommMethod"/>
						</commmethod>
						<welsh>
							<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/TranslationToWelsh"/>
						</welsh>
						<address>
							<status/>
							<addresssurrogateid>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/AddressSurrogateId"/>
							</addresssurrogateid>
							<addressid>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/AddressId"/>
							</addressid>
							<line1>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/Line[position()=1]"/>
							</line1>
							<line2>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/Line[position()=2]"/>
							</line2>
							<line3>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/Line[position()=3]"/>
							</line3>
							<line4>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/Line[position()=4]"/>
							</line4>
							<line5>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/Line[position()=5]"/>
							</line5>
							<postcode>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/PostCode"/>
							</postcode>
							<createdby>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/CreatedBy"/>
							</createdby>
							<validfrom>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/ValidFrom"/>
							</validfrom>
							<validto>
								<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/Address/ValidTo"/>
							</validto>
						</address>
						<addresshistory>
							<xsl:value-of select="/params/param/ds/MaintainCO/Debtor/AddressHistory"/>
						</addresshistory>
					</debtor>
					<employer>
						<type>employer</type>						
						<id>
							<xsl:value-of select="/params/param/ds/MaintainCO/Employer/PartyId"/>
						</id>
						<namedperson>
							<xsl:value-of select="/params/param/ds/MaintainCO/NamedEmployer"/>
						</namedperson>
						<name>
							<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Name"/>
						</name>
						<dx>
							<xsl:value-of select="/params/param/ds/MaintainCO/Employer/DX"/>
						</dx>
						<telno>
							<xsl:value-of select="/params/param/ds/MaintainCO/Employer/TelNo"/>
						</telno>
						<faxno>
							<xsl:value-of select="/params/param/ds/MaintainCO/Employer/FaxNo"/>
						</faxno>
						<email>
							<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Email"/>
						</email>
						<commmethod>
							<xsl:value-of select="/params/param/ds/MaintainCO/Employer/CommMethod"/>
						</commmethod>
						<welsh>
							<xsl:value-of select="/params/param/ds/MaintainCO/Employer/TranslationToWelsh"/>
						</welsh>
						<address>
							<status/>
							<addresssurrogateid>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/AddressSurrogateId"/>
							</addresssurrogateid>
							<addressid>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/AddressId"/>
							</addressid>
							<line1>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/Line[position()=1]"/>
							</line1>
							<line2>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/Line[position()=2]"/>
							</line2>
							<line3>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/Line[position()=3]"/>
							</line3>
							<line4>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/Line[position()=4]"/>
							</line4>
							<line5>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/Line[position()=5]"/>
							</line5>
							<postcode>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/PostCode"/>
							</postcode>
							<createdby>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/CreatedBy"/>
							</createdby>
							<validfrom>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/ValidFrom"/>
							</validfrom>
							<validto>
								<xsl:value-of select="/params/param/ds/MaintainCO/Employer/Address/ValidTo"/>
							</validto>
						</address>
						<addresshistory>
							<xsl:value-of select="/params/param/ds/MaintainCO/Employer/AddressHistory"/>
						</addresshistory>
						<reference>
							<xsl:value-of select="/params/param/ds/MaintainCO/PayrollNumber"/>
						</reference>
					</employer>
					<workplace>
						<address>
							<status/>
							<addresssurrogateid>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/AddressSurrogateId"/>
							</addresssurrogateid>
							<addressid>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/AddressId"/>
							</addressid>
							<line1>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/Line[position()=1]"/>
							</line1>
							<line2>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/Line[position()=2]"/>
							</line2>
							<line3>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/Line[position()=3]"/>
							</line3>
							<line4>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/Line[position()=4]"/>
							</line4>
							<line5>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/Line[position()=5]"/>
							</line5>
							<postcode>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/PostCode"/>
							</postcode>
							<createdby>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/CreatedBy"/>
							</createdby>
							<validfrom>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/ValidFrom"/>
							</validfrom>
							<validto>
								<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/Address/ValidTo"/>
							</validto>
						</address>
						<addresshistory>
							<xsl:value-of select="/params/param/ds/MaintainCO/Workplace/AddressHistory"/>
						</addresshistory>
					</workplace>
					<latestcoevent>
						
					</latestcoevent>
					<debts>
						<xsl:for-each select="/params/param/ds/MaintainCO/Debts/Debt">
							<debt>
								<debtseq>
									<xsl:value-of select="DebtSeq"/>
								</debtseq>
								<debtsurrogateid>
									<xsl:value-of select="DebtSurrogateId"/>
								</debtsurrogateid>
								<debtamountallowed>
									<xsl:value-of select="DebtAmountAllowed"/>
								</debtamountallowed>
								<debtamountallowedcurrency>
									<xsl:value-of select="DebtAmountAllowedCurrency"/>
								</debtamountallowedcurrency>
								<debtamountoriginal>
									<xsl:value-of select="DebtAmountOriginal"/>
								</debtamountoriginal>
								<debtamountoriginalcurrency>
									<xsl:value-of select="DebtAmountOriginalCurrency"/>
								</debtamountoriginalcurrency>
								<casemandebt>
									<xsl:value-of select="CasemanDebt"/>
								</casemandebt>
								<debtstatus>
									<xsl:value-of select="DebtStatus"/>
								</debtstatus>
								<passthrough>
									<xsl:value-of select="Passthroughs"/>
								</passthrough>
								<!-- &&& Sum of related Passthrough PAYMENTS for this Debt. -->
								<divends>
									<xsl:value-of select="Dividends"/>
								</divends>
								<!-- &&& Sum of Amounts in DEBT_DIVIDENDS where CREATED = 'Y'. -->
								<balance/>
								<!-- &&& Sum of Passthroughs and Divends. -->
								<balancecurrency/>
								<debtcasenumber>
									<xsl:value-of select="DebtCaseNumber"/>
								</debtcasenumber>
								<deftpartyrolecode>
									<xsl:value-of select="DeftPartyRoleCode"/>
								</deftpartyrolecode>
								<deftcasepartyno>
									<xsl:value-of select="DeftCasePartyNo"/>
								</deftcasepartyno>
								<debtadmincourtcode>
									<xsl:value-of select="DebtAdminCourtCode"/>
								</debtadmincourtcode>
								<debtadmincourtname>
									<xsl:value-of select="DebtAdminCourtName"/>
								</debtadmincourtname>
								<cpcreditorcode>
									<xsl:value-of select="CPCreditorCode"/>
								</cpcreditorcode>
								<!-- WRONG -->
								<partyrolecode>
									<xsl:value-of select="PartyRoleCode"/>
								</partyrolecode>
								<casepartynumber>
									<xsl:value-of select="CasePartyNumber"/>}</casepartynumber>
								<creditorreference>
									<xsl:value-of select="CreditorReference"/>
								</creditorreference>
								<addressunknown>
									<xsl:value-of select="AddressUnknown"/>
								</addressunknown>
								<cppayeeid>
									<xsl:value-of select="CPPayeeId"/>
								</cppayeeid>
								<payeereference>
									<xsl:value-of select="PayeeReference"/>
								</payeereference>
								<debtpayeeindicator>
									<xsl:value-of select="DebtPayeeIndicator"/>
								</debtpayeeindicator>
								<payee>
									<type>payee</type>
									<id>
										<xsl:value-of select="Payee/PartyId"/>
									</id>
									<debtseq>
										<xsl:value-of select="Payee/DebtSeq"/>
									</debtseq>
									<name>
										<xsl:value-of select="Payee/Name"/>
									</name>
									<dx>
										<xsl:value-of select="Payee/DX"/>
									</dx>
									<telno>
										<xsl:value-of select="Payee/TelNo"/>
									</telno>
									<address>
										<status/>
										<addresssurrogateid>
											<xsl:value-of select="Payee/Address/AddressSurrogateId"/>
										</addresssurrogateid>
										<addressid>
											<xsl:value-of select="Payee/Address/AddressId"/>
										</addressid>
										<line1>
											<xsl:value-of select="Payee/Address/Line[position()=1]"/>
										</line1>
										<line2>
											<xsl:value-of select="Payee/Address/Line[position()=2]"/>
										</line2>
										<line3>
											<xsl:value-of select="Payee/Address/Line[position()=3]"/>
										</line3>
										<line4>
											<xsl:value-of select="Payee/Address/Line[position()=4]"/>
										</line4>
										<line5>
											<xsl:value-of select="Payee/Address/Line[position()=5]"/>
										</line5>
										<postcode>
											<xsl:value-of select="Payee/Address/PostCode"/>
										</postcode>
										<createdby>
											<xsl:value-of select="Payee/Address/CreatedBy"/>
										</createdby>
										<validfrom>
											<xsl:value-of select="Payee/Address/ValidFrom"/>
										</validfrom>
										<validto>
											<xsl:value-of select="Payee/Address/ValidTo"/>
										</validto>
									</address>
									<addresshistory>
										<xsl:value-of select="Payee/Address/AddressHistory"/>
									</addresshistory>
									<welsh>
										<xsl:value-of select="PayeeTranslationToWelsh"/>
									</welsh>
								</payee>
								<creditor>
									<type>creditor</type>
									<id>
										<xsl:value-of select="Creditor/PartyId"/>
									</id>
									<debtseq>
										<xsl:value-of select="Creditor/DebtSeq"/>
									</debtseq>
									<name>
										<xsl:value-of select="Creditor/Name"/>
									</name>
									<dx>
										<xsl:value-of select="Creditor/DX"/>
									</dx>
									<telno>
										<xsl:value-of select="Creditor/TelNo"/>
									</telno>
									<address>
										<status/>
										<addresssurrogateid>
											<xsl:value-of select="Creditor/Address/AddressSurrogateId"/>
										</addresssurrogateid>
										<addressid>
											<xsl:value-of select="Creditor/Address/AddressId"/>
										</addressid>
										<line1>
											<xsl:value-of select="Creditor/Address/Line[position()=1]"/>
										</line1>
										<line2>
											<xsl:value-of select="Creditor/Address/Line[position()=2]"/>
										</line2>
										<line3>
											<xsl:value-of select="Creditor/Address/Line[position()=3]"/>
										</line3>
										<line4>
											<xsl:value-of select="Creditor/Address/Line[position()=4]"/>
										</line4>
										<line5>
											<xsl:value-of select="Creditor/Address/Line[position()=5]"/>
										</line5>
										<postcode>
											<xsl:value-of select="Creditor/Address/PostCode"/>
										</postcode>
										<createdby>
											<xsl:value-of select="Creditor/Address/CreatedBy"/>
										</createdby>
										<validfrom>
											<xsl:value-of select="Creditor/Address/ValidFrom"/>
										</validfrom>
										<validto>
											<xsl:value-of select="Creditor/Address/ValidTo"/>
										</validto>
									</address>
									<addresshistory>
										<xsl:value-of select="Creditor/AddressHistory"/>
									</addresshistory>
									<welsh>
										<xsl:value-of select="CreditorTranslationToWelsh"/>																		
									</welsh>
								</creditor>
								<cppayeecode>
									<xsl:value-of select="CPPayeeCode"/>
								</cppayeecode>
								<addedcasenumber>
									<xsl:value-of select="DebtCaseNumber"/>
								</addedcasenumber>
								<isnew>
									<xsl:if test="DebtSeq = $debtSequence">Y</xsl:if>
								</isnew>
							</debt>
						</xsl:for-each>
						<totalamount/>
					</debts>
					<fineamount>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EnterFineAmount"/>
					</fineamount>
					<fineamountcurrency>
						<xsl:value-of select="/params/param/ds/MaintainCO/FeeAmountCurrency"/>
					</fineamountcurrency>
					<finedate>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EnterFineDate"/>
					</finedate>
					<fineorprison>
						<xsl:value-of select="/params/param/ds/EnterVariableData/FineOrPrison"/>
					</fineorprison>
					<offencedetails>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EnterOffenceDetails"/>
					</offencedetails>
					<offencetext>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EnterOUPText"/>
					</offencetext>
					<prisonlength>
						<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/commitalDuration"/>
					</prisonlength>
					<reviewper>
						<xsl:value-of select="/params/param/ds/EnterVariableData/ReviewPeriod"/>
					</reviewper>
					<reviewinter>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EntRevIntPeriod"/>
					</reviewinter>
					<reviewmonths>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EntRevNoMonths"/>
					</reviewmonths>
					<revokeddischarged>
						<xsl:value-of select="/params/param/ds/EnterVariableData/RevokedDischarged"/>
					</revokeddischarged>
					<revokereason>
						<xsl:copy-of select="/params/param/ds/EnterVariableData/Allocation/reasons"/>
					</revokereason>
					<suspendvaried>
						<xsl:value-of select="/params/param/ds/EnterVariableData/CODStatus"/>
					</suspendvaried>
					<suspendreason>
						<xsl:copy-of select="/params/param/ds/EnterVariableData/Allocation/reasons"/>
					</suspendreason>
					<hearingorder>
						<xsl:value-of select="/params/param/ds/EnterVariableData/WasOrderMade"/>
					</hearingorder>
					<moneyincourt>
						<xsl:value-of select="/params/param/ds/MaintainCO/DebtSummary/MoniesInCourt"/>
					</moneyincourt>
					<coststext>
						<xsl:copy-of select="/params/param/ds/EnterVariableData/CostsWording"/>
					</coststext>
					<applicant>
						<id>
							<xsl:value-of select="/params/param/ds/MaintainCO/Applicant/PartyId"/>
						</id>
						<name>
							<xsl:value-of select="/params/param/ds/EnterVariableData/NameOfApplicant"/>
						</name>
						<dx>
							<xsl:value-of select="/params/param/ds/MaintainCO/Applicant/DX"/>
						</dx>
						<telno>
							<xsl:value-of select="/params/param/ds/MaintainCO/Applicant/TelNo"/>
						</telno>
						<address>
							<status/>
							<addresssurrogateid>
								<xsl:value-of select="/params/param/ds/MaintainCO/Applicant/Address/AddressSurrogateId"/>
							</addresssurrogateid>
							<addressid>
								<xsl:value-of select="/params/param/ds/MaintainCO/Applicant/Address/AddressId"/>
							</addressid>
							<line1>
								<xsl:value-of select="/params/param/ds/EnterVariableData/EnterAddOfApplicant"/>
							</line1>
							<line2>
								<xsl:value-of select="/params/param/ds/EnterVariableData/EnterAppAddL2"/>
							</line2>
							<line3>
								<xsl:value-of select="/params/param/ds/EnterVariableData/EnterAppAddL3"/>
							</line3>
							<line4>
								<xsl:value-of select="/params/param/ds/EnterVariableData/EnterAppAddL4"/>
							</line4>
							<line5>
								<xsl:value-of select="/params/param/ds/EnterVariableData/EnterAppAddL5"/>
							</line5>
							<postcode>
								<xsl:value-of select="/params/param/ds/EnterVariableData/EnterAppAddL6"/>
							</postcode>
							<createdby>
								<xsl:value-of select="/params/param/ds/MaintainCO/Applicant/Address/CreatedBy"/>
							</createdby>
							<validfrom>
								<xsl:value-of select="/params/param/ds/MaintainCO/Applicant/Address/ValidFrom"/>
							</validfrom>
							<validto>
								<xsl:value-of select="/params/param/ds/MaintainCO/Applicant/Address/ValidTo"/>
							</validto>
						</address>
						<addresshistory>
							<xsl:value-of select="/params/param/ds/MaintainCO/Applicant/AddressHistory"/>
						</addresshistory>
						<applicanttext>
							<xsl:value-of select="/params/param/ds/EnterVariableData/ApplicantAddCase"/>
						</applicanttext>
					</applicant>
					<objector>
						<xsl:value-of select="/params/param/ds/EnterVariableData/NamePartyObjecting"/>
					</objector>
					<ordermade>
						<xsl:value-of select="/params/param/ds/EnterVariableData/WasOrderMade"/>
					</ordermade>
					<disstruckadj>
						<xsl:value-of select="/params/param/ds/EnterVariableData/DisStrAdj"/>
					</disstruckadj>
					<objectingcreditor>
						<xsl:value-of select="/params/param/ds/EnterVariableData/ObjectingCreditor"/>
					</objectingcreditor>
					<malefemale>
						<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/morFDebtor"/>
					</malefemale>
					<debtordesc>
						<xsl:copy-of select="/params/param/ds/EnterVariableData/DescOfDebtor"/>
					</debtordesc>
					<commitalperiod>
						<xsl:value-of select="/params/param/ds/EnterVariableData/DisobedienceArrest/commitalDuration"/>
					</commitalperiod>
					<responsetime>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EnterResponsePeriod"/>
					</responsetime>
					<daten61a>
						<xsl:value-of select="/params/param/ds/EnterVariableData/N61AOrderDate"/>
					</daten61a>
					<reviewrequester>
						<xsl:value-of select="/params/param/ds/EnterVariableData/WhoReqRev"/>
					</reviewrequester>
					<creditorname>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EntCreditorName"/>
					</creditorname>
					<amount>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EnterFineAmount"/>
					</amount>
					<paymentsmissed>
						<xsl:value-of select="/params/param/ds/EnterVariableData/NoInstOutstanding"/>
					</paymentsmissed>
					<protectearnrate>
						<xsl:value-of select="/params/param/ds/MaintainCO/ProtectedEarningsRate"/>
					</protectearnrate>
					<sumpaydate>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EnterFineDate"/>
					</sumpaydate>
					<sumpayable>
						<xsl:value-of select="/params/param/ds/EnterVariableData/EnterFineAmount"/>
					</sumpayable>
					<feeamount>
						<xsl:value-of select="/params/param/ds/MaintainCO/DebtSummary/FeeAmount"/>
					</feeamount>
					<totalfeespaid>
						<xsl:value-of select="/params/param/ds/MaintainCO/DebtSummary/TotalFeesPaid"/>
					</totalfeespaid>
					<cooutstandingdebt/>					
					<objectiondate/>
				</coorder>
			<!-- CONSOLIDATED ORDERS END -->
				<DFLT1-2>
					<xsl:value-of select="/params/param/ds/EnterVariableData/EnterItemDetails"/>
				</DFLT1-2>
				<maxfine>
					<xsl:value-of select="/params/param/ds/EnterVariableData/MaximumFine"/>
				</maxfine>
				<detailsofoffence>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/DetailsOfAllegedOffence"/>
				</detailsofoffence>
				<coorderdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DateOfAEOrder"/>
				</coorderdate>
				<datesuspend>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DateSuspendedUntil"/>
				</datesuspend>
				<ordersetasidedate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/orderSetAsideDate"/>
				</ordersetasidedate>
				<reasonsetaside>
					<xsl:value-of select="/params/param/ds/EnterVariableData/ReasonSetAside"/>
				</reasonsetaside>
				<anythingfurther>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/anythingFurther"/>
				</anythingfurther>
				<ceftificatepurpose>
					<xsl:value-of select="/params/param/ds/EnterVariableData/CertificatePurpose"/>
				</ceftificatepurpose>
				<proceedingsissuedate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/proceedingsissuedate"/>
				</proceedingsissuedate>
				<causeofaction>
					<xsl:value-of select="/params/param/ds/EnterVariableData/CauseOfAction"/>
				</causeofaction>
				<amountofdebt>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DebtAmount"/>
				</amountofdebt>
				<interesttojudgmentdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterestToDateAmount"/>
				</interesttojudgmentdate>
				<subsequentcosts>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SubsequentCosts"/>
				</subsequentcosts>
				<interestsincejudgmentdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/InterestFromDateAmount"/>
				</interestsincejudgmentdate>
			<!-- O_2_6 BEGIN -->
			<courtsatisfied>
				<xsl:value-of select="/params/param/ds/EnterVariableData/courtSatisfied"/>
			</courtsatisfied>
			<arrestdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/powerOfArrestDate"/>
			</arrestdate>
			<arrestexpirydate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/powerOfArrestExpiryDate"/>
			</arrestexpirydate>
			<applicantphone>
				<xsl:value-of select="/params/param/ds/EnterVariableData/applicantphone"/>
			</applicantphone>
			<provisioninjunction>
				<xsl:copy-of select="/params/param/ds/EnterVariableData/provisionInjunction"/>
			</provisioninjunction>
			<!-- O_2_6 END -->
			<nameofnominee>
				<xsl:value-of select="/params/param/ds/EnterVariableData/NameOfNominee"/>
			</nameofnominee>
			<extensionperiod>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ExtensionPeriod"/>
			</extensionperiod>
			<reportdeliveredby>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ReportDeliveredDate"/>
			</reportdeliveredby>
			<orders255>
				<xsl:copy-of select="/params/param/ds/EnterVariableData/S255details"/>
			</orders255>
			<interimordereasons>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/InterimOrderReasons"/>
			</interimordereasons>
			<servedonor>
				<xsl:value-of select="/params/param/ds/EnterVariableData/servedOnOR"/>
			</servedonor>
			<!-- O_2_6 END -->
			<!-- O_5_5 BEGIN -->
			<costspaid>
				<xsl:value-of select="/params/param/ds/EnterVariableData/PayBy"/>
			</costspaid>
			<!-- O_5_5 END -->
			<!-- O_5_6 BEGIN -->
			<awarddate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DateofAward"/>
			</awarddate>
			<bodyname>
				<xsl:value-of select="/params/param/ds/EnterVariableData/NameofBody"/>
			</bodyname>
			<bodyref>
				<xsl:value-of select="/params/param/ds/EnterVariableData/AwardRef"/>
			</bodyref>
			<awardunpaid>
				<xsl:value-of select="/params/param/ds/EnterVariableData/AwardAmountUnpaid"/>
			</awardunpaid>
			<awardcourtfee>
				<xsl:value-of select="/params/param/ds/EnterVariableData/CourtFee"/>
			</awardcourtfee>
			<awardsolcosts>
				<xsl:value-of select="/params/param/ds/EnterVariableData/SolicitorCost"/>
			</awardsolcosts>
			<!-- O_5_6 END -->
			<petitioninstructions>
				<xsl:value-of select="/params/param/ds/EnterVariableData/PetitionInstructions"/>
			</petitioninstructions>
			<ordersubpetreason>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/OrderSubPetReason"/>
			</ordersubpetreason>
			<orderinterimreason>
				<xsl:value-of select="/params/parms/ds/EnterVariableData/ConfNotice/InterimOrderReasons" />
			</orderinterimreason>
			<statutorydeposit>
				<xsl:value-of select="/params/param/ds/EnterVariableData/statutoryDeposit"/>
			</statutorydeposit>
			<statutorydepositreserved>
				<xsl:value-of select="/params/param/ds/EnterVariableData/statutoryDepositReserved"/>
			</statutorydepositreserved>
			<daysservedby>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DaysServedby"/>
			</daysservedby>
			<petitiondate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/PetitionDate"/>
			</petitiondate>
			<practitionername>
				<xsl:value-of select="/params/param/ds/EnterVariableData/PractitionerName"/>
			</practitionername>
			<description>
				<xsl:copy-of select="/params/param/ds/EnterVariableData/Description"/>
			</description>
			<endorsementorder>
				<xsl:value-of select="/params/param/ds/EnterVariableData/EndorsementOrder"/>
			</endorsementorder>			
			<affidavit>
				<name>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/Affidavit/name"/>
				</name>
				<xsl:apply-templates select="/params/param/ds/EnterVariableData/Affidavit/Address"/>
				<job>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/descriptionApplicant"/>
				</job>
			</affidavit>
			<prepaidtype>
				<xsl:value-of select="/params/param/ds/EnterVariableData/PrepaidPost"/>
			</prepaidtype>
			<serviceaddressedto>
				<xsl:apply-templates select="/params/param/ds/EnterVariableData/AddressedTo"/>
			</serviceaddressedto>
			<serviceaddressed>
				<xsl:apply-templates select="/params/param/ds/EnterVariableData/Addressed"/>
			</serviceaddressed>
			<publishedin>
				<xsl:value-of select="/params/param/ds/EnterVariableData/PublishedIn"/>
			</publishedin>
			<afterpostingday>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ServedonDay"/>
			</afterpostingday>
			<apppresenteddate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ApplicationPresentedDate"/>
			</apppresenteddate>
			<descriptionapplicant>
				<xsl:value-of select="/params/param/ds/EnterVariableData/descriptionApplicant"/>
			</descriptionapplicant>
			<bankruptcyorder>
				<xsl:value-of select="/params/param/ds/EnterVariableData/BankruptcyOption"/>
			</bankruptcyorder>
			<bankruptcydate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/BankruptcyDate"/>
			</bankruptcydate>
			<registrationdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/RegistrationDate"/>
			</registrationdate>
			<lrreference>
				<xsl:value-of select="/params/param/ds/EnterVariableData/LRReference"/>
			</lrreference>
			<registrationwritsdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/RegistrationWritsDate"/>
			</registrationwritsdate>
			<referencenumber>
				<xsl:value-of select="/params/param/ds/EnterVariableData/referenceNumber"/>
			</referencenumber>
			<notificationindays>
				<xsl:value-of select="/params/param/ds/EnterVariableData/NotificationInDays"/>
			</notificationindays>
			<statutorydemanddate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/StatutoryDemandDate"/>
			</statutorydemanddate>
			<affidavitsupportdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Filed/AffidavitSupportDate"/>
			</affidavitsupportdate>
			<reportdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ReportDate"/>
			</reportdate>
			<debtorattendance>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DebtorAttendance"/>
			</debtorattendance>
			<nomineereportdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/FilingDate"/>
			</nomineereportdate>
			<interimdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimOrderDate"/>
			</interimdate>
			<interimextendeddate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/InterimExtendDate"/>
			</interimextendeddate>
			<meetingdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/MeetingDate"/>
			</meetingdate>
			<meetingtime>
				<xsl:value-of select="/params/param/ds/EnterVariableData/MeetingTime"/>
			</meetingtime>
			<petitionwording>
				<xsl:value-of select="/params/param/ds/EnterVariableData/EndorsementOrder"/>
			</petitionwording>
			<bankruptcydate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/BankruptcyDate"/>
			</bankruptcydate>
			<bankruptcydischargedate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DischargeDate"/>
			</bankruptcydischargedate>
			<judgmentorderdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/JudgmentOrder/JOrderDate"/>
			</judgmentorderdate>
			<proceedingsdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ProceedingDate"/>
			</proceedingsdate>
			<meetingaddress>
				<xsl:apply-templates select="/params/param/ds/EnterVariableData/Meeting/Address"/>
			</meetingaddress>
			<casereferencenumber>
				<xsl:value-of select="/params/param/ds/EnterVariableData/referenceNumber"/>			
			</casereferencenumber>
            <petitiondate2>
                <xsl:value-of select="/params/param/ds/EnterVariableData/dateOfPetition"/>         
            </petitiondate2>
             <petitionadjournedtime>
                <xsl:value-of select="/params/param/ds/EnterVariableData/petitionAdjournedTime"/>         
            </petitionadjournedtime>
            <adjourneddate>
                <xsl:value-of select="/params/param/ds/EnterVariableData/adjournedDate"/>         
            </adjourneddate>
            <petitionof>
                <xsl:value-of select="/params/param/ds/EnterVariableData/petitionOf"/>               
            </petitionof>
            <costinstructions> 
            	<xsl:value-of select="/params/param/ds/EnterVariableData/costInstructions"/> 
            </costinstructions>
            <notewording>
                <xsl:value-of select="/params/param/ds/EnterVariableData/specificOR"/>               
            </notewording>            
            <petitionaction>
                <xsl:value-of select="/params/param/ds/EnterVariableData/petitionWithdrawnDismissed"/>               
            </petitionaction>
			<originalpetitioner>
				  <xsl:value-of select="/params/param/ds/EnterVariableData/OriginalPetitioner"/>
			</originalpetitioner>
			<payeedetails>
				<xsl:copy-of select="/params/param/ds/EnterVariableData/PayeeBranch/payee_cols/payee"/>
			</payeedetails>
			<securities>
				<currentholding>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/securities/currentholding"/>
				</currentholding>
				<description>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/securities/description"/>
				</description>
			</securities>
			<cfotransfer>
				<originatingcourtname>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/cfotransfer/originatingcourt/name"/>
				</originatingcourtname>
				<originatingcourtcode>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/cfotransfer/originatingcourt/code"/>
				</originatingcourtcode>
				<receivingcourtname>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/cfotransfer/receivingcourt/name"/>
				</receivingcourtname>
				<receivingcourtcode>
					<xsl:apply-templates select="/params/param/ds/EnterVariableData/cfotransfer/receivingcourt/code"/>
				</receivingcourtcode>
			</cfotransfer>
			<!--
			<payeedetails>
				<details>
				</details>
				<name>
				</name>
				<address>
				</address>
				<reference>
				</reference>
				<bankdetails>
					<branchname>
					</branchname>
					<address>
					</address>
					<sortcode>
					</sortcode>
					<accountnumber>
					</accountnumber>
				</bankdetails>
				<amount>
				</amount>
			</payeedetails>
			-->
			<ecregulation><xsl:value-of select="/params/param/ds/EnterVariableData/ECRegulation"/></ecregulation>
			<ecproceedingtype><xsl:value-of select="/params/param/ds/EnterVariableData/ECProceedingType"/></ecproceedingtype>
		</order>
		<obligation>
			<expirydate>
				<xsl:value-of select="/params/param/ds/wp/MaintainObligations/Obligations/Obligation[EventId=$eventId]/ExpiryDate"/>
			</expirydate>
		</obligation>
		<judgment>
		    <judgmentid><xsl:value-of select="$judgmentId"/></judgmentid>
			<variationid>
				<xsl:value-of select="//CaseEvent/VarySeq"/>
			</variationid>
			<damagesamount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/DamagesAmount"/>
			</damagesamount>
			<returngoods>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ReturnGoods"/>
			</returngoods>
			<costpaid>
				<xsl:value-of select="/params/param/ds/EnterVariableData/CostPaid"/>
			</costpaid>
			<assessedcost>
				<xsl:value-of select="/params/param/ds/EnterVariableData/AssessedCosts"/>
			</assessedcost>
			<hpcsgreement>
				<xsl:value-of select="/params/param/ds/EnterVariableData/HPA"/>
			</hpcsgreement>
			<partyagainst>
				<id>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyId"/>
				</id>
				<number>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/CasePartyNumber"/>
				</number>
				<rolecode>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyRoleCode"/>
				</rolecode>
				<name>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyAgainstName"/>
				</name>
				<addressidatjudgment>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyAgainst/AddressAtJudgmentRegistration/AddressId"/>
				</addressidatjudgment>
				<address>
					<line1><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyAgainst/Address/Line1"/></line1>
					<line2><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyAgainst/Address/Line2"/></line2>
					<line3><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyAgainst/Address/Line3"/></line3>
					<line4><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyAgainst/Address/Line4"/></line4>
					<line5><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyAgainst/Address/Line5"/></line5>
					<postcode><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyAgainst/Address/PostCode"/></postcode>
					<reference><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PartyAgainst/Address/reference"/></reference>
				</address>

			</partyagainst>
			<infavourofparties>
				<selectedinfavourofpartyid>
					<xsl:value-of select="/params/param/ds/EnterVariableData/SelectedInFavourOfPartyId"/>					
				</selectedinfavourofpartyid>				
				<xsl:for-each select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/InFavourParties/Party">
					<xsl:variable name="prc"><xsl:value-of select="PartyRoleCode"/></xsl:variable>
					<xsl:variable name="cpn"><xsl:value-of select="CasePartyNumber"/></xsl:variable>
					<xsl:variable name="pid">
						<xsl:value-of select="$prc" /><xsl:text>_</xsl:text><xsl:value-of select="$cpn" />
					</xsl:variable>
					<party>
						<partyrolecode>
							<xsl:value-of select="$prc"/>
						</partyrolecode>
						<partynumber>
							<xsl:value-of select="$cpn"/>
						</partynumber>
						<partyid>												  							
							<xsl:value-of select="/params/param/ds/ManageCase/Parties/LitigiousParty[./SurrogateId=$pid]/PartyId" /> 
						</partyid>
					</party>
				</xsl:for-each>
			</infavourofparties>
				<judgmentdate>
					<xsl:choose>
						<xsl:when test="string-length(/params/param/ds/EnterVariableData/JudgmentOrder/Date) > 0">
							<xsl:value-of select="/params/param/ds/EnterVariableData/JudgmentOrder/Date"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[./JudgmentId = /params/param/ds/JudgementId]/Date" />
						</xsl:otherwise>						
					</xsl:choose>
				</judgmentdate>
			<judgmentdateout>
				<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Date"/>
			</judgmentdateout>
			<xsl:if test="judgmentdatedisplayed">
				<judgmentdatedisplayed/>
			</xsl:if>
				<judgetitle>
					<xsl:value-of select="/params/param[@name='vardata']/ds/EnterVariableData/JudgeTitle"/>
				</judgetitle>
				<judgename>
					<xsl:value-of select="/params/param[@name='vardata']/ds/EnterVariableData/JudgeName"/>
				</judgename>
				<otherjudgedesc>
					<xsl:value-of select="/params/param[@name='vardata']/ds/EnterVariableData/OtherJudgeDesc"/>
				</otherjudgedesc>
			<xsl:if test="judgmentpluscost">
				<judgmentpluscost/>
			</xsl:if>
			<xsl:choose>
				<xsl:when test="string-length(/params/param/ds/EnterVariableData/Judgment/amount) > 0">
					<amount>
						<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/amount"/>
					</amount>
				</xsl:when>
				<xsl:otherwise>
					<amount>
						<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Amount"/>
					</amount>
				</xsl:otherwise>
			</xsl:choose>
				<applicationfee>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/appFee"/>
				</applicationfee>
			<xsl:choose>
				<xsl:when test="string-length(/params/param/ds/EnterVariableData/Judgment/costs) > 0">
					<costs>
						<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/costs"/>
					</costs>
				</xsl:when>
				<xsl:otherwise>
					<xsl:choose>
						<xsl:when test="string-length(/params/param/ds/EnterVariableData/Judgment/costsCurrency) > 0">
							<costs>
								<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/costsCurrency"/>
							</costs>
						</xsl:when>
						<xsl:otherwise>
							<costs>
								<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/TotalCosts"/>
							</costs>
						</xsl:otherwise>
					</xsl:choose>										
				</xsl:otherwise>
			</xsl:choose>
				
				<judgmentstatus>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Status"/>
				</judgmentstatus>
				<jointjudgment>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/JointJudgment"/>
				</jointjudgment>
				<paidinfulldate>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PaidInFullDate"/>
				</paidinfulldate>
				<finaldateofpayment>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/paymentdate"/>
				</finaldateofpayment>
				<judgmentcourtcode>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/VenueCode"/>
				</judgmentcourtcode>
				<judgmentcourtname>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/VenueName"/>
				</judgmentcourtname>
				<judgmentpayee>
					<xsl:value-of select="Parties/LitigiousParty[Number='1']/SolicitorPayee"/>
				</judgmentpayee>
				<xsl:if test="result">
					<result/>
				</xsl:if>
				<xsl:if test="applcationtovaryapplicant">
					<applcationtovaryapplicant/>
				</xsl:if>
				<xsl:if test="determinationperiod">
					<determinationperiod/>
				</xsl:if>
				<judgmentreason>
					<xsl:value-of select="/params/param/ds/EnterVariableData/judgmentreason"/>
				</judgmentreason>
				<registered>
					<xsl:choose>
						<xsl:when test="string-length(/params/param/ds/EnterVariableData/Judgment/isregistered) > 0">
							<!-- This data has been entered via the Q and A screen -->
							<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/isregistered"/>
						</xsl:when>
						<xsl:otherwise>
							<!-- This data has been read from the database -->
							<xsl:choose>
								<!-- If an RTL date is present the output expects a Y to indicate the judgment is registered -->
								<xsl:when test="string-length(/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/DateRTL) > 0">
									<xsl:text>Y</xsl:text>
								</xsl:when>									
								<!-- No RTL date - the output expects an N to indicate the judgment is not registered -->
								<xsl:otherwise>
									<xsl:text>N</xsl:text>									
								</xsl:otherwise>	
							</xsl:choose>
						</xsl:otherwise>										
					</xsl:choose>										
				</registered>
			<xsl:choose>
				<xsl:when test="string-length(/params/param/ds/EnterVariableData/Judgment/prepaid) > 0">
					<paidbeforejudgment>
						<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/prepaid"/>
					</paidbeforejudgment>
				</xsl:when>
				<xsl:otherwise>
					<paidbeforejudgment>
						<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PaidBefore"/>
					</paidbeforejudgment>
				</xsl:otherwise>
			</xsl:choose>
				<firstpaymentdate>
					<xsl:choose>
						<xsl:when test="string-length(/params/param/ds/EnterVariableData/Judgment/instalmentdate) > 0">
							<!-- This data has been entered via the Q and A screen -->
							<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/instalmentdate"/>
						</xsl:when>
						<xsl:otherwise>
							<!-- This data has been read from the database -->
							<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/FirstPayDate"/>
						</xsl:otherwise>										
					</xsl:choose>					
				</firstpaymentdate>
				<paymentinfulldate>
					<xsl:choose>
						<xsl:when test="string-length(/params/param/ds/EnterVariableData/Judgment/paymentdate) > 0">
							<!-- This data has been entered via the Q and A screen -->
							<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/paymentdate"/>
						</xsl:when>
						<xsl:otherwise>
							<!-- This data has been read from the database -->
							<!-- Here we use the FirstPayDate node as does <firstpaymentdate> above (it is used to store both -->
							<!-- first payment date as well as payment in full date) but only if the period is FULL are we interested here -->
							<xsl:variable name="paymentPeriod">
								<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PeriodCode"/>
							</xsl:variable>							
							<xsl:if test="$paymentPeriod = 'FUL'">
								<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/FirstPayDate"/>								
							</xsl:if>
						</xsl:otherwise>										
					</xsl:choose>															
				</paymentinfulldate>
			<xsl:if test="paymentfrequency">
				<paymentfrequency/>
			</xsl:if>
				<instalmentamount>
					<xsl:choose>
						<xsl:when test="string-length(/params/param/ds/EnterVariableData/Judgment/instalmentamount) > 0">
							<!-- This data has been entered via the Q and A screen -->
							<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/instalmentamount"/>
						</xsl:when>
						<xsl:otherwise>
							<!-- This data has been read from the database -->
							<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/InstallAmount"/>
						</xsl:otherwise>										
					</xsl:choose>					
				</instalmentamount>
				<instalmentperiod>
					<xsl:choose>
						<xsl:when test="string-length(/params/param/ds/EnterVariableData/Judgment/instalmentperiod) > 0">
							<!-- This data has been entered via the Q and A screen -->
							<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/instalmentperiod"/>
						</xsl:when>
						<xsl:otherwise>
							<!-- This data has been read from the database -->
							<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PeriodCode"/>
						</xsl:otherwise>										
					</xsl:choose>					
				</instalmentperiod>
				<goodsdetained>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/Order/goodsdetained/*"/>
				</goodsdetained>
				<goodsdetainedvalue>
					<xsl:copy-of select="/params/param/ds/EnterVariableData/Order/goodsdetainedvalue"/>
				</goodsdetainedvalue>
				<dateofgoodsreturned>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/returnofgoodsdate"/>
				</dateofgoodsreturned>
				<unpaidamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/updaidbalance"/>
				</unpaidamount>
				<outstandingamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/outstandingAmt"/>
				</outstandingamount>
				<certifiedfitforcounsel>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/isfitforcousel"/>
				</certifiedfitforcounsel>
				<ordermadebyconsent>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/consent"/>
				</ordermadebyconsent>
				<hirepurchaseagreement>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/hashpagreement"/>
				</hirepurchaseagreement>
				<agreementdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Order/hpdate"/>
				</agreementdate>
			<xsl:if test="resultdate">
				<resultdate/>
			</xsl:if>
				<judgmentforthwith>
					<xsl:choose>
						<xsl:when test="string-length(/params/param/ds/EnterVariableData/Judgment/forthwith) > 0">
							<!-- This data has been entered via the Q and A screen -->
							<xsl:value-of select="/params/param/ds/EnterVariableData/Judgment/forthwith"/>
						</xsl:when>
						<xsl:otherwise>
							<!-- This data has been read from the database -->
							<!-- Convert the payment period to the format that the output expects to find in <judgmentforthwith> -->
							<xsl:variable name="paymentPeriod">
								<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/PeriodDesc"/>
							</xsl:variable>
							<xsl:choose>							
								<xsl:when test="$paymentPeriod = 'FORTHWITH'">
									<xsl:text>Y</xsl:text>
								</xsl:when>
								<xsl:otherwise>
									<xsl:text>N</xsl:text>
								</xsl:otherwise>						
							</xsl:choose>
						</xsl:otherwise>										
					</xsl:choose>
				</judgmentforthwith>
				<goodsagreemantwas>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DeliveryOfGoods/agreementWas"/>
				</goodsagreemantwas>
				<goodscostsare>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DeliveryOfGoods/costsAre"/>
				</goodscostsare>
				<goodscostamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/PossessionOrder/costAmount2"/>
				</goodscostamount>
				<goodscosttobepaid>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DeliveryOfGoods/costToBePaid"/>
				</goodscosttobepaid>
				<goodspaymentdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DeliveryOfGoods/paymentDate"/>
				</goodspaymentdate>
				<goodsmonthlyinstalment>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DeliveryOfGoods/monthlyInstallment"/>
				</goodsmonthlyinstalment>
				<goodsfirstpaymentdate>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DeliveryOfGoods/firstPaymentDate"/>
				</goodsfirstpaymentdate>
			<setaside>
				<appdate>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/ApplicationsToSetAside/Application/AppDate"/>
				</appdate>
				<dateresult>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/ApplicationsToSetAside/Application/DateResult"/>
				</dateresult>
				<result>
					<xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/ApplicationsToSetAside/Application/Result"/>
				</result>
			</setaside>
			<variations>
				<xsl:for-each select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/ApplicationsToVary/Variation">
					<xsl:sort select="Id" data-type="number" order="ascending"/>
					<variation>
						<id>
							<xsl:value-of select="Id"/>
						</id>
						<varysurrogateid>
							<xsl:value-of select="VarySurrogateId"/>
						</varysurrogateid>
						<judgment>
							<xsl:value-of select="Judgment"/>
						</judgment>
						<appdate>
							<xsl:value-of select="AppDate"/>
						</appdate>
						<applicant>
							<xsl:value-of select="Applicant"/>
						</applicant>
						<amountoffered>
							<xsl:value-of select="AmountOffered"/>
						</amountoffered>
						<amountofferedcurrency>
							<xsl:value-of select="AmountOfferedCurrency"/>
						</amountofferedcurrency>
						<amountofferedper>
							<xsl:value-of select="AmountOfferedPer"/>
						</amountofferedper>
						<amountofferedperid>
							<xsl:value-of select="AmountOfferedPerId"/>
						</amountofferedperid>
						<hearing>
							<xsl:value-of select="Hearing"/>
						</hearing>
						<claimresp>
							<xsl:value-of select="ClaimResp"/>
						</claimresp>
						<respdate>
							<xsl:value-of select="RespDate"/>
						</respdate>
						<result>
							<xsl:value-of select="Result"/>
						</result>
						<previousresult>
							<xsl:value-of select="PreviousResult"/>
						</previousresult>
						<dateresult>
							<xsl:value-of select="DateResult"/>
						</dateresult>
						<paydate>
							<xsl:value-of select="PayDate"/>
						</paydate>
						<resultamount>
							<xsl:value-of select="ResultAmount"/>
						</resultamount>
						<resultamountcurrency>
							<xsl:value-of select="ResultAmountCurrency"/>
						</resultamountcurrency>
						<resultamountper>
							<xsl:value-of select="ResultAmountPer"/>
						</resultamountper>
						<resultperid>
							<xsl:value-of select="ResultPerId"/>
						</resultperid>
						<objector>
							<xsl:value-of select="Objector"/>
						</objector>
						<objectiondate>
							<xsl:value-of select="ObjectionDate"/>
						</objectiondate>
					</variation>
				</xsl:for-each>
					<changedcondition>
						<xsl:value-of select="/params/param/ds/EnterVariableData/Variation/changedCondition"/>
					</changedcondition>
					<furthermodifications>
						<xsl:value-of select="/params/param/ds/EnterVariableData/Variation/modifications"/>
					</furthermodifications>
			</variations>
				<remainingamount>
					<xsl:value-of select="/params/param/ds/EnterVariableData/outstandingAmount"/>
				</remainingamount>
				<claimature>
					<xsl:value-of select="/params/param/ds/EnterVariableData/detailsOfClaim"/>
				</claimature>
				<annualInterestpercentage>
					<xsl:value-of select="/params/param/ds/EnterVariableData/annualInterestPercentage"/>
				</annualInterestpercentage>
				<datedefencefiled>
					<xsl:value-of select="/params/param/ds/EnterVariableData/DateDefenceFiled"/>
				</datedefencefiled>
				
				<xsl:choose>
					<xsl:when test="/params/param/ds/EnterVariableData/PartyFor/PartyKey">
						<xsl:for-each select="/params/param/ds/EnterVariableData/PartyFor/PartyKey">
							<partyforselected>
								<xsl:value-of select="."/>
							</partyforselected>
						</xsl:for-each>
					</xsl:when>
					<xsl:otherwise>
						<partyforselected>
							<xsl:value-of select="/params/param/ds/EnterVariableData/PartyFor"/>
						</partyforselected>		
					</xsl:otherwise>
				</xsl:choose>	
				<payee>
					<name><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Payee/Name"/></name>					
					
						<address>
							<line1><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Payee/ContactDetails/Address/Line[1]"/></line1>
							<line2><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Payee/ContactDetails/Address/Line[2]"/></line2>
							<line3><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Payee/ContactDetails/Address/Line[3]"/></line3>
							<line4><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Payee/ContactDetails/Address/Line[4]"/></line4>
							<line5><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Payee/ContactDetails/Address/Line[5]"/></line5>
							<postcode><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Payee/ContactDetails/Address/PostCode"/></postcode>
							<reference><xsl:value-of select="/params/param/ds/wp/MaintainJudgment/Judgments/Judgment[JudgmentId = $judgmentId]/Payee/Reference"/></reference>
						</address>
					
				</payee>
			</judgment>
		<letter>
			<selectdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/selectHearingDate"/>
			</selectdate>
			<suspenseitem>
				<xsl:value-of select="/params/param/ds/EnterVariableData/enterSuspenseItem"/>
			</suspenseitem>
			<letterrequestothother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/processReferredType"/>
			</letterrequestothother>
			<casenumber>
				<xsl:value-of select="/params/param/ds/EnterVariableData/enterCaseNumber" />
			</casenumber>
			<letterrequestoth>
				<xsl:value-of select="/params/param/ds/EnterVariableData/docType" />
			</letterrequestoth>
			<letterorderother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ConfNotice/processtype" />
			</letterorderother>
			<letservdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/ServiceDate" />
			</letservdate>
			<issuereissue>
				<xsl:value-of select="/params/param/ds/EnterVariableData/orderIssuedReissued" />
			</issuereissue>
			<drawninfavour>
				<xsl:value-of select="/params/param/ds/EnterVariableData/drawnInFavourOf" />
			</drawninfavour>
			<payableorderamount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/payableOrderAmount" />
			</payableorderamount>
			<feepayment>
				<xsl:value-of select="/params/param/ds/EnterVariableData/traveFeePayment" />
			</feepayment>
			<amountFeePayment>
				<xsl:value-of select="/params/param/ds/EnterVariableData/amountFeePayment" />
			</amountFeePayment>
			<feeretained>
				<xsl:value-of select="/params/param/ds/EnterVariableData/feeRetained" />
			</feeretained>
			<offeramount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/amountTerms"/>
			</offeramount>
			<examinationno>
				<xsl:value-of select="/params/param/ds/EnterVariableData/examNumber"/>
			</examinationno>
			<counterclaimamount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/cCFee"/>
			</counterclaimamount>
			<greeting>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Salutation"/>
			</greeting>
			<greetingother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/wordsFollowingDear"/>
			</greetingother>
			<letterorder>
				<xsl:value-of select="/params/param/ds/EnterVariableData/letterProcessTypes"/>
			</letterorder>
			<listingon>
				<xsl:value-of select="/params/param/ds/EnterVariableData/orderProcess"/>
			</listingon>
			<whattodo>
				<xsl:value-of select="/params/param/ds/EnterVariableData/replyType"/>
			</whattodo>
			<whattodoother>
				<xsl:copy-of select="/params/param/ds/EnterVariableData/detEnclosedInst"/>
			</whattodoother>
			<rcjcaseno>
				<xsl:value-of select="/params/param/ds/EnterVariableData/rCJNum"/>
			</rcjcaseno>
			<newdebtcasenumber>
				<xsl:value-of select="/params/param/ds/EnterVariableData/newNum"/>
			</newdebtcasenumber>
			<selection>
				<xsl:value-of select="/params/param/ds/EnterVariableData/selectLetter3"/>
			</selection>
			<date>
				<xsl:value-of select="/params/param/ds/EnterVariableData/letterDate"/>
			</date>
			<enquiry>
				<xsl:value-of select="/params/param/ds/EnterVariableData/enquiryAbout"/>
			</enquiry>
			<payableorderno>
				<xsl:value-of select="/params/param/ds/EnterVariableData/payableOrderNumber"/>
			</payableorderno>
			<sentdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/payableOrderSent"/>
			</sentdate>
			<originalpayableorderdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/payableOrderOriginal"/>
			</originalpayableorderdate>
			<respectof>
				<xsl:value-of select="/params/param/ds/EnterVariableData/inRespectOf"/>
			</respectof>
			<selectletter>
				<xsl:value-of select="/params/param/ds/EnterVariableData/selectLetter"/>
			</selectletter>
			<selectletter2>
				<xsl:value-of select="/params/param/ds/EnterVariableData/selectLetter2"/>
			</selectletter2>
			<billofcostsnumber>
				<xsl:value-of select="/params/param/ds/EnterVariableData/billNumber"/>
			</billofcostsnumber>
			<collectedbydate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/collectedByDate"/>
			</collectedbydate>
			<reasonsnonservice>
				<xsl:value-of select="/params/param/ds/EnterVariableData/reasonsNonService"/>
			</reasonsnonservice>
			<correspondencedate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/correspondanceDate"/>
			</correspondencedate>
			<courtselection>
				<xsl:value-of select="/params/param/ds/EnterVariableData/courtSelection"/>
			</courtselection>
			<returnprocesstype>
				<xsl:value-of select="/params/param/ds/EnterVariableData/returnProcessType"/>
			</returnprocesstype>			
			<appealnumber>
				<xsl:value-of select="/params/param/ds/EnterVariableData/appealNumber"/>
			</appealnumber>
			<appealdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/appealDate"/>
			</appealdate>
			<aenumber>
				<xsl:value-of select="$AENumber"/>
			</aenumber>
			<aeeventseq>
				<xsl:value-of select="$AEEventSeq"/>
			</aeeventseq>			
		</letter>
		<!-- CJR009 BEGIN-->
		<certificateofservice>
			<dateserved>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/dateServed"/>
			</dateserved>
			<documentserved>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/documentServed"/>
			</documentserved>
			<otherdocument>
				<xsl:copy-of select="/params/param/ds/EnterVariableData/Service/otherDocument"/>
			</otherdocument>
			<servedperson>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/personServed"/>
			</servedperson>
			<position>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/personServedPosition"/>
			</position>
			<servicemethod>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/serviceMethod"/>
			</servicemethod>
			<serviceother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/otherMeans"/>
			</serviceother>
			<serviceleftwithname>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/leftWithName"/>
			</serviceleftwithname>
			<servicetimesent>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/timeSent"/>
			</servicetimesent>
			<xsl:apply-templates select="/params/param/ds/EnterVariableData/Service/Address"/>
			<addressemail>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/emailAddress"/>
			</addressemail>
			<addressdx>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/DXNumber"/>
			</addressdx>
			<addressfax>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/FaxNumber"/>
			</addressfax>
			<addresstype>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/partyAddressType"/>
			</addresstype>
			<otheraddresstype>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/otherAddressType"/>
			</otheraddresstype>
		</certificateofservice>
		<!-- CJR009 END-->
		<!-- CJR018 BEGIN-->
		<informed>
			<name>
				<xsl:value-of select="/params/param/ds/EnterVariableData/AttendForQuestion/judgmentCourtName"/>
			</name>
			<xsl:apply-templates select="/params/param/ds/EnterVariableData/Court/Address"/>							
		</informed>
		<creditorselected>
			<name>
				<xsl:value-of select="/params/param[@name='xml']/ds/COES/ManageCOEvents/COEvents/COEvent[position()=1]/CreditorName"/>
			</name>
			<xsl:apply-templates select="/params/param/ds/MaintainCO/Debts/Debt/Creditor[Name = /params/param[@name='xml']/ds/COES/ManageCOEvents/COEvents/COEvent[position()=1]/CreditorName]/Address"/>
		</creditorselected>
		<transfer>
			<reason><xsl:value-of select="/params/param/ds/TransferCase/TransferReason"/></reason>
			<previouscourt>
				<name>
					<xsl:value-of select="/params/param/ds/EnterVariableData/TransferCase/PreviousCourt/Court/Name"/>
				</name>
				<xsl:apply-templates select="/params/param/ds/EnterVariableData/TransferCase/PreviousCourt/Court/ContactDetails/*"/>
			</previouscourt>
			<dateoftransfer>
				<xsl:value-of select="/params/param/ds/EnterVariableData/TransferCase/DateOfTransfer"/>
			</dateoftransfer>
			<amount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/amountHeld"/>
			</amount>
			<court>
				<specialistrcj>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/rCJSpecialistList"/>
				</specialistrcj>
				<divisionrcj>
					<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/rCJDivision"/>
				</divisionrcj>
				<multitracktransfer>
					<xsl:value-of select="/params/param[@name='vardata']/ds/EnterVariableData/MultiTrackAllocation/claimTransferTo"/>
				</multitracktransfer>
				<xsl:if test="/params/param/ds/EnterVariableData/FastTrack/transCourtName">
					<cname>
						<xsl:value-of select="/params/param/ds/EnterVariableData/FastTrack/transCourtName"/>
					</cname>
					<caddress>
						<xsl:apply-templates select="/params/param/ds/EnterVariableData/FastTrack/transCourtAddress/Address"/>					
					</caddress>
				</xsl:if>
				<rcjdivision>
					<xsl:value-of select="/params/param/ds/EnterVariableData/MultiTrackAllocation/divisionRCJ"/>
				</rcjdivision>
				<cctrialcentre>
					<xsl:value-of select="/params/param/ds/EnterVariableData/MultiTrackAllocation/trialCentreName"/>
				</cctrialcentre>
				<code>
					<xsl:value-of select="/params/param[@name='xml']/ds/TransferCase/TransferCourtCode"/>
				</code>
				<name>
					<xsl:value-of select="/params/param[@name='xml']/ds/TransferCase/TransferCourtName"/>
				</name>
				<type>
					<xsl:value-of select="/params/param[@name='xml']/ds/TransferCase/TransferCourtType"/>
				</type>
				<isdr>
					<xsl:value-of select="/params/param[@name='xml']/ds/TransferCase/TransferIsDR"/>
				</isdr>
				<newcasetype>
					<xsl:value-of select="/params/param[@name='xml']/ds/TransferCase/NewCaseType"/>
				</newcasetype>
				<division/>
				<subdivision/>
				<address>
					<line1/>
					<line2/>
					<line3/>
					<line4/>
					<line5/>
					<postcode/>
				</address>
				<telephonenumber/>
				<drtelnumber/>
				<faxnumber/>
				<dx/>
				<issups/>
			</court>
			<ismanualtransfer>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/ismanualtransfer"/>
			</ismanualtransfer>
			<dealhearing>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/wording"/>
			</dealhearing>
			<dealhearingother>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/dealHearApp"/>
			</dealhearingother>
			<applicationfor>
				<xsl:copy-of select="/params/param/ds/EnterVariableData/applicationfor"/>
			</applicationfor>
			<returnhomecourt>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/returnFileTo"/>
			</returnhomecourt>
			<to>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/caseTransferedTo"/>
			</to>
			<caseproceeding>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/caseProceedingOn"/>
			</caseproceeding>
			<orderdate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/transferOrderDate"/>
			</orderdate>
			<return>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/returnClaimtoHC"/>
			</return>
			<allocationto>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/allocationToTrack"/>
			</allocationto>
			<partyapplication>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/whoseApplication"/>
			</partyapplication>
			<partyapplicationattached>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Transfer/applicationAttached"/>
			</partyapplicationattached>
		</transfer>
		<!-- CJR018 END-->
		<!-- RFC 1806 -->		
		<lqandhearing>
			<lqfee>
				<xsl:value-of select="/params/param/ds/EnterVariableData/LQAndHearing/LQFee"/>
			</lqfee>
			<hearingfee>
				<xsl:value-of select="/params/param/ds/EnterVariableData/LQAndHearing/HearingFee"/>
			</hearingfee>
			<payablebydate>
				<xsl:value-of select="/params/param/ds/EnterVariableData/LQAndHearing/PayableByDate"/>
			</payablebydate>
			<whoistopay>
				<xsl:value-of select="/params/param/ds/EnterVariableData/LQAndHearing/PartyToPayFees" />
			</whoistopay>
			<whoistopaylq>
				<xsl:value-of select="/params/param/ds/EnterVariableData/LQAndHearing/PartyToPayLQHearingFee" />
			</whoistopaylq>
		</lqandhearing>
		<!-- RFC 1806 -->
		<xsl:if test="/params/param/ds/EnterVariableData/Print">
			<print>
				<xsl:if test="/params/param/ds/EnterVariableData/Print/numberofcopies">
					<numberofcopies>
						<xsl:value-of select="/params/param/ds/EnterVariableData/Print/numberofcopies"/>
					</numberofcopies>
				</xsl:if>
				<xsl:if test="/params/param/ds/EnterVariableData/Print/additionalcopies">
					<additionalcopies>
						<xsl:value-of select="/params/param/ds/EnterVariableData/Print/additionalcopies"/>
					</additionalcopies>
				</xsl:if>
			</print>
		</xsl:if>
		<!-- CJR030 BEGIN-->
		<witness>
			<id>
			</id>
			<number>
			</number>
			<name>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/witnessName"/>
			</name>
			<reference>
			</reference>
			<xsl:apply-templates select="/params/param/ds/EnterVariableData/Service/witness/Address"/>
			<dategiven>
			</dategiven>
			<hearingwordingunits>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/wDaysRequiredUnits"/>
			</hearingwordingunits>
			<hearingwording>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/wDaysRequired"/>
			</hearingwording>
			<documentexists>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/wProduceDocs"/>
			</documentexists>
			<documenttoproduce>
				<xsl:copy-of select="/params/param/ds/EnterVariableData/Service/produceDocs"/>
			</documenttoproduce>
			<expenseamount>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/conductMoneyAmt"/>
			</expenseamount>
			<party>
				<xsl:value-of select="/params/param/ds/EnterVariableData/Service/partyApplied"/>
			</party>
		</witness>
		<!-- CJR030 END-->
		<!--CJR091 BEGIN-->
			<thirdparty>
					<id/>
					<number/>
					<name>
						<xsl:value-of select="/params/param/ds/EnterVariableData/HardshipPayment/thirdPartyName"/>
					</name>
					<reference>
						<xsl:value-of select="/params/param/ds/EnterVariableData/ThirdPartyDebt/thirdPartyRef"/>
					</reference>
				<xsl:apply-templates select="/params/param/ds/EnterVariableData/ThirdPartyDebt/ThirdParty/Address"/>
					<telephonenumber>
						<xsl:value-of select="/params/param/ds/EnterVariableData/ThirdPartyDebt/thirdPartyTel"/>
					</telephonenumber>
					<orderdate>
						<xsl:value-of select="/params/param/ds/EnterVariableData/ThirdPartyDebt/judgementOrOrderDate"/>
					</orderdate>
					<applicationcosts>
						<xsl:value-of select="/params/param/ds/EnterVariableData/ThirdPartyDebt/applicableCostAmt"/>
					</applicationcosts>
					<isbankorbuildsoc>
						<xsl:value-of select="/params/param/ds/EnterVariableData/ThirdPartyDebt/isBankOrBuildSoc"/>
					</isbankorbuildsoc>					
					<bankdetails>
							<name>
								<xsl:value-of select="/params/param/ds/EnterVariableData/ThirdPartyDebt/branchName"/>
							</name>
							<xsl:apply-templates select="/params/param/ds/EnterVariableData/ThirdPartyDebt/Branch/Address"/>
							<sortcode>
								<xsl:value-of select="/params/param/ds/EnterVariableData/ThirdPartyDebt/sortCode"/>
							</sortcode>
							<accountnumber>
								<xsl:value-of select="/params/param/ds/EnterVariableData/ThirdPartyDebt/accountNum"/>
							</accountnumber>
					</bankdetails>
			</thirdparty>

	<!--CJR091 END-->
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="OfficialReceiver">
		<officialreceiver>
			<xsl:call-template name="party">
				<xsl:with-param name="type">officialreceiver</xsl:with-param>
			</xsl:call-template>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorpayee>
			</xsl:if>
		</officialreceiver>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="Claimant">
		<claimant>
			<xsl:call-template name="party">
				<xsl:with-param name="type">claimant</xsl:with-param>
			</xsl:call-template>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorPayee"/>
				</solicitorpayee>
			</xsl:if>
		</claimant>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="Part20Claimant">
		<part20claimant>
			<xsl:call-template name="party">
				<xsl:with-param name="type">part20claimant</xsl:with-param>
			</xsl:call-template>
			<!-- RetrieveRelatedSolicitorDetails/ -->
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorPayee"/>
				</solicitorpayee>
			</xsl:if>
		</part20claimant>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="Defendant">
		<defendant>
			<xsl:call-template name="party">
				<xsl:with-param name="type">defendant</xsl:with-param>
			</xsl:call-template>
			<!-- RetrieveRelatedSolicitorDetails/-->
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorpayee>
			</xsl:if>
		</defendant>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="Part20Defendant">
		<part20defendant>
			<xsl:call-template name="party">
				<xsl:with-param name="type">part20defendant</xsl:with-param>
			</xsl:call-template>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorpayee>
			</xsl:if>
		</part20defendant>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="Debtor">
		<debtor>
			<xsl:call-template name="party">
				<xsl:with-param name="type">debtor</xsl:with-param>
			</xsl:call-template>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorpayee>
			</xsl:if>
		</debtor>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="Creditor">
		<creditor>
			<xsl:call-template name="party">
				<xsl:with-param name="type">creditor</xsl:with-param>
			</xsl:call-template>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorpayee>
			</xsl:if>
		</creditor>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="TheCompany">
		<company>
			<xsl:call-template name="party">
				<xsl:with-param name="type">company</xsl:with-param>
			</xsl:call-template>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorpayee>
			</xsl:if>
		</company>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="Applicant">
		<applicant>
			<xsl:call-template name="party">
				<xsl:with-param name="type">applicant</xsl:with-param>
			</xsl:call-template>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorpayee>
			</xsl:if>
		</applicant>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="InsolvencyPractitioner">
		<insolvencypractitioner>
			<xsl:call-template name="party">
				<xsl:with-param name="type">insolvencypractitioner</xsl:with-param>
			</xsl:call-template>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorpayee>
			</xsl:if>
		</insolvencypractitioner>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="Petitioner">
		<petitioner>
			<xsl:call-template name="party">
				<xsl:with-param name="type">petitioner</xsl:with-param>
			</xsl:call-template>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorPayee"/>
				</solicitorpayee>
			</xsl:if>
		</petitioner>
	</xsl:template>
	<xsl:template match="LitigiousParty" mode="Trustee">
		<trustee>
			<xsl:call-template name="party">
				<xsl:with-param name="type">trustee</xsl:with-param>
			</xsl:call-template>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="SolicitorSurrogateId">
				<representativeid>
					<xsl:value-of select="SolicitorSurrogateId"/>
				</representativeid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<solicitorsurrogateid>
					<xsl:value-of select="SurrogateId"/>
				</solicitorsurrogateid>
			</xsl:if>
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
			<xsl:if test="SolicitorReference">
				<solicitorreference>
					<xsl:value-of select="SolicitorReference"/>
				</solicitorreference>
			</xsl:if>
			<xsl:if test="SolicitorPayee">
				<solicitorpayee>
					<xsl:value-of select="SolicitorPayee"/>
				</solicitorpayee>
			</xsl:if>
		</trustee>
	</xsl:template>
	<xsl:template match="Solicitor" mode="details">
		<representative>
			<xsl:call-template name="party">
				<xsl:with-param name="type">representative</xsl:with-param>
			</xsl:call-template>			
			<xsl:if test="SurrogateId">
				<surrogateid>
					<xsl:value-of select="SurrogateId"/>
				</surrogateid>
			</xsl:if>
		</representative>
	</xsl:template>
	<xsl:template name="party">
		<xsl:param name="type"></xsl:param>
		<xsl:if test="PartyId">
			<type>
				<xsl:value-of select="$type"/>
			</type>
			<id>
				<xsl:value-of select="PartyId"/>
			</id>
			<number>
				<xsl:value-of select="Number"/>
			</number>
			<name>
				<xsl:value-of select="Name"/>
			</name>
			<reference>
				<xsl:value-of select="Reference"/>
			</reference>
			<welsh>
				<xsl:value-of select="ContactDetails/TranslationToWelsh"/>
			</welsh>
			<xsl:apply-templates select="ContactDetails/Address"/>
			<xsl:if test="ContactDetails/DX">
				<dx>
					<xsl:value-of select="ContactDetails/DX"/>
				</dx>
			</xsl:if>
			<xsl:if test="ContactDetails/TelephoneNumber">
				<telephonenumber>
					<xsl:value-of select="ContactDetails/TelephoneNumber"/>
				</telephonenumber>
			</xsl:if>
			<xsl:if test="ContactDetails/FaxNumber">
				<faxnumber>
					<xsl:value-of select="ContactDetails/FaxNumber"/>
				</faxnumber>
			</xsl:if>
			<xsl:if test="DateOfBirth">
				<dateofbirth><xsl:value-of select="DateOfBirth"/></dateofbirth>
			</xsl:if>
						
			<xsl:apply-templates select="HistoricalAddresses"/>									
		</xsl:if>		
	</xsl:template>
	
	<xsl:template match="HistoricalAddresses">
		<historicaladdresses>		
			<xsl:for-each select="Address">
				<address>
					<id><xsl:value-of select="AddressId"/></id>
					<line1><xsl:value-of select="Line[1]"/></line1>
					<line2><xsl:value-of select="Line[2]"/></line2>
					<line3><xsl:value-of select="Line[3]"/></line3>
					<line4><xsl:value-of select="Line[4]"/></line4>
					<line5><xsl:value-of select="Line[5]"/></line5>
					<postcode><xsl:value-of select="PostCode"/></postcode>
					<dx><xsl:value-of select="Dx"/></dx>
					<validfrom><xsl:value-of select="DateFrom"/></validfrom>
					<validto><xsl:value-of select="DateTo"/></validto>																																								
				</address>				
			</xsl:for-each>
		</historicaladdresses>		
	</xsl:template>
	
	<xsl:template match="Address">
		<address>
			<xsl:if test="Line[1]">
				<xsl:if test="AddressId">
					<id>
						<xsl:value-of select="AddressId"/>
					</id>
				</xsl:if>
				<xsl:if test="type">
					<type/>
				</xsl:if>
				<line1>
					<xsl:value-of select="Line[1]"/>
				</line1>
				<line2>
					<xsl:value-of select="Line[2]"/>
				</line2>
				<line3>
					<xsl:value-of select="Line[3]"/>
				</line3>
				<line4>
					<xsl:value-of select="Line[4]"/>
				</line4>
				<line5>
					<xsl:value-of select="Line[5]"/>
				</line5>
				<postcode>
					<xsl:value-of select="PostCode"/>
				</postcode>
				<xsl:if test="reference">
					<reference/>
				</xsl:if>
				<xsl:if test="createdby">
					<createdby/>
				</xsl:if>
			</xsl:if>
		</address>
	</xsl:template>
	<xsl:template name="emptyAddress">
		<address>
			<id/>
			<type/>
			<line1/>
			<line2/>
			<line3/>
			<line4/>
			<line5/>
			<postcode/>
			<reference/>
			<createdby/>
		</address>
	</xsl:template>
	
	<xsl:template name="getWarrantPartyAgainstDetails">
		<xsl:param name="party"></xsl:param>
		<xsl:param name="number"></xsl:param>
		<xsl:param name="partyType"></xsl:param>
			<name>
				<xsl:value-of select="xalan:nodeset($party)/Name"/>
			</name>		
			<number>
				<xsl:choose>
					<!-- Number is explicitly specified when it's a foreign warrant -->
					<xsl:when test="$number">
						<xsl:value-of select="$number"/>
					</xsl:when>
					<xsl:otherwise>
						<!-- Number wasn't given so use what's in the data -->
						<xsl:value-of select="xalan:nodeset($party)/Number"/>
					</xsl:otherwise>
				</xsl:choose>				
			</number>
			<type>
				<xsl:choose>				
					<!-- PartyType is explicitly specified when it's a foreign warrant -->
					<xsl:when test="$partyType">
						<xsl:value-of select="$partyType"/>
					</xsl:when>
					<xsl:otherwise>
						<!-- PartyType wasn't given so use what's in the data -->
						<xsl:value-of select="xalan:nodeset($party)/PartyType"/>
					</xsl:otherwise>
				</xsl:choose>								
			</type>
			<welsh>
				<xsl:value-of select="xalan:nodeset($party)/WelshTranslation"/>
			</welsh>
			<address>
				<line1>
					<xsl:value-of select="xalan:nodeset($party)/Address/Line[1]"/>
				</line1>
				<line2>
					<xsl:value-of select="xalan:nodeset($party)/Address/Line[2]"/>
				</line2>
				<line3>
					<xsl:value-of select="xalan:nodeset($party)/Address/Line[3]"/>
				</line3>
				<line4>
					<xsl:value-of select="xalan:nodeset($party)/Address/Line[4]"/>
				</line4>
				<line5>
					<xsl:value-of select="xalan:nodeset($party)/Address/Line[5]"/>
				</line5>	
				<postcode>
					<xsl:value-of select="xalan:nodeset($party)/Address/PostCode"/>
				</postcode>																													
			</address>		
	</xsl:template>	
</xsl:stylesheet>
