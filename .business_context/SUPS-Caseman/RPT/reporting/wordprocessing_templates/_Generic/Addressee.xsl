<?xml version="1.0" encoding="UTF-8"?>
<!-- Change History
10 Jan 2011, Chris Vincent. Trac 4134. Reference HM Courts & Tribunals Service instead of Her Majesty's Courts Service for caps addressee
27 Jan 2012, Chris Vincent.  Trac 4589.  Added noticeissuespecial addressee.
-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xalan="http://xml.apache.org/xalan" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:supsfo="http://eds.com/supsfo" exclude-result-prefixes="w v w10 sl aml wx o dt st1 xalan">
	<xsl:output method="xml" version="1.0" encoding="UTF-8" indent="yes"/>
	<xsl:template name="addressee">
		<xsl:param name="party">claimant</xsl:param>
		<xsl:variable name="partynode">
			<xsl:copy-of select="/variabledata/claim/child::*[local-name()=$party and number=1]/*"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length(xalan:nodeset($partynode)/representativeid) > 0">
				<xsl:variable name="representativeId">
					<xsl:value-of select="xalan:nodeset($partynode)/representativeid"/>
				</xsl:variable>
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="/variabledata/claim/representative[surrogateid = $representativeId]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="xalan:nodeset($partynode)/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="instigatorAddressee">
	<xsl:for-each select="/variabledata/event/InstigatorList/Instigator">
		<xsl:variable name="casePartyNumber">
			<xsl:value-of select="CasePartyNumber"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="CasePartyRoleCode = 'CLAIMANT'">
				<xsl:variable name="partynode">
					<xsl:copy-of select="/variabledata/claim/claimant[number=$casePartyNumber]/*"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="string-length(xalan:nodeset($partynode)/representativeid) > 0">
						<xsl:variable name="representativeId">
							<xsl:copy-of select="xalan:nodeset($partynode)/representativeid"/>
						</xsl:variable>
						<xsl:call-template name="format-address-multi-line">
							<xsl:with-param name="party">
								<xsl:copy-of select="/variabledata/claim/representative[surrogateid = $representativeId]/*"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="format-address-multi-line">
							<xsl:with-param name="party">
								<xsl:copy-of select="xalan:nodeset($partynode)/*"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="CasePartyRoleCode = 'DEFENDANT'">
				<xsl:variable name="partynode">
					<xsl:copy-of select="/variabledata/claim/defendant[number=$casePartyNumber]/*"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="string-length(xalan:nodeset($partynode)/representativeid) > 0">
						<xsl:variable name="representativeId">
							<xsl:copy-of select="xalan:nodeset($partynode)/representativeid"/>
						</xsl:variable>
						<xsl:call-template name="format-address-multi-line">
							<xsl:with-param name="party">
								<xsl:copy-of select="/variabledata/claim/representative[surrogateid = $representativeId]/*"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="format-address-multi-line">
							<xsl:with-param name="party">
								<xsl:copy-of select="xalan:nodeset($partynode)/*"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="CasePartyRoleCode = 'PT 20 CLMT'">
				<xsl:variable name="partynode">
					<xsl:copy-of select="/variabledata/claim/part20claimant[number=$casePartyNumber]/*"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="string-length(xalan:nodeset($partynode)/representativeid) > 0">
						<xsl:variable name="representativeId">
							<xsl:copy-of select="xalan:nodeset($partynode)/representativeid"/>
						</xsl:variable>
						<xsl:call-template name="format-address-multi-line">
							<xsl:with-param name="party">
								<xsl:copy-of select="/variabledata/claim/representative[surrogateid = $representativeId]/*"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="format-address-multi-line">
							<xsl:with-param name="party">
								<xsl:copy-of select="xalan:nodeset($partynode)/*"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="CasePartyRoleCode = 'PT 20 DEF'">
				<xsl:variable name="partynode">
					<xsl:copy-of select="/variabledata/claim/part20defendant[number=$casePartyNumber]/*"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="string-length(xalan:nodeset($partynode)/representativeid) > 0">
						<xsl:variable name="representativeId">
							<xsl:copy-of select="xalan:nodeset($partynode)/representativeid"/>
						</xsl:variable>
						<xsl:call-template name="format-address-multi-line">
							<xsl:with-param name="party">
								<xsl:copy-of select="/variabledata/claim/representative[surrogateid = $representativeId]/*"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="format-address-multi-line">
								<xsl:with-param name="party">
									<xsl:copy-of select="xalan:nodeset($partynode)/*"/>
								</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:template>
	<!-- Used to populate the bottom address box on output N54 - notice of eviction -->
	<xsl:template name="noticeOfEvictionAddressee">
		<xsl:choose>
			<!-- Test to see what type of warrant we are dealing with -->
			<xsl:when test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- We are dealing with a Home Warrant here -->
				<!-- Check to see if the party against is represented -->
				<!-- First build the solicitor surrogate id, which indentifies the party -->
				<!-- in the claim branch of the dom -->
				<xsl:variable name="partyAgainstSolicitorSurrogateId">
					<xsl:value-of select="/variabledata/warrant/warrantparties/selectedwarrantpartyagainst/type"/>
					<xsl:text>_</xsl:text>
					<xsl:value-of select="/variabledata/warrant/warrantparties/selectedwarrantpartyagainst/number"/>
				</xsl:variable>
				<!-- Now use the solicitor surrogate id to select the representative id, which we -->
				<!-- can use to work out if the party is represented-->
				<xsl:variable name="partyAgainstRepresentativeId">
					<xsl:value-of select="/variabledata/claim/*[solicitorsurrogateid = $partyAgainstSolicitorSurrogateId]/representativeid"/>
				</xsl:variable>
				<!-- Check the party's representative id to determine if the party is represented -->
				<xsl:choose>
					<xsl:when test="string-length($partyAgainstRepresentativeId) > 0">
						<!-- The party is represented so use the solicitor's address -->
						<xsl:call-template name="format-address-multi-line">
							<xsl:with-param name="party">
								<xsl:copy-of select="/variabledata/claim/representative[surrogateid = $partyAgainstRepresentativeId]/*"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<!-- The party is not represented. Now check to see if a possession address -->
						<!-- is present on the case -->
						<xsl:choose>
							<xsl:when test="string-length(/variabledata/notice/possessionproperty/address/line1) > 0">
								<!-- A possession address is supplied so use the party against's address -->
								<!-- Get the address from either warrant party against 1 or 2 depending on selected warrant party's type and number -->
								<xsl:variable name="partyAgainstType">
									<xsl:value-of select="/variabledata/warrant/warrantparties/selectedwarrantpartyagainst/type"/>
								</xsl:variable>
								<xsl:variable name="partyAgainstNumber">
									<xsl:value-of select="/variabledata/warrant/warrantparties/selectedwarrantpartyagainst/number"/>
								</xsl:variable>
								<xsl:call-template name="format-address-multi-line">
									<xsl:with-param name="party">
										<xsl:copy-of select="/variabledata/warrant/warrantparties/*[type=$partyAgainstType and number=$partyAgainstNumber]/*"/>
									</xsl:with-param>
								</xsl:call-template>
							</xsl:when>
							<xsl:otherwise>
								<!-- No possession address therefore the address should be blank so do nothing -->
							</xsl:otherwise>
						</xsl:choose>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="string-length(/variabledata/warrant/possession/address/line1) > 0">
						<xsl:variable name="partyAgainstType">
							<xsl:value-of select="/variabledata/warrant/warrantparties/selectedwarrantpartyagainst/type"/>
						</xsl:variable>
						<xsl:variable name="partyAgainstNumber">
							<xsl:value-of select="/variabledata/warrant/warrantparties/selectedwarrantpartyagainst/number"/>
						</xsl:variable>
						<xsl:if test="/variabledata/warrant/warrantparties/*[type=$partyAgainstType and number=$partyAgainstNumber]/address/line1 != /variabledata/warrant/possession/address/line1">
							<xsl:call-template name="format-address-multi-line">
								<xsl:with-param name="party">
									<xsl:copy-of select="/variabledata/warrant/warrantparties/*[type=$partyAgainstType and number=$partyAgainstNumber]/*"/>
								</xsl:with-param>
							</xsl:call-template>							
						</xsl:if>
					</xsl:when>
					<xsl:otherwise>
						<!-- No possession address therefore the address should be blank so do nothing -->
					</xsl:otherwise>
				</xsl:choose>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="partyforaddressee">
		<xsl:variable name="partyid">
			<xsl:copy-of select="/variabledata/judgment/infavourofparties/party[1]/partyid"/>
		</xsl:variable>
		<xsl:variable name="partynode">
			<xsl:copy-of select="/variabledata/claim/child::*[id=$partyid]/*"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length(xalan:nodeset($partynode)/representativeid) > 0">
				<xsl:variable name="representativeId">
					<xsl:value-of select="xalan:nodeset($partynode)/representativeid"/>
				</xsl:variable>
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="/variabledata/claim/representative[surrogateid = $representativeId]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="xalan:nodeset($partynode)/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="payee">
		<xsl:variable name="numberlist">
			<xsl:for-each select="/variabledata/event/InstigatorList/Instigator/CasePartyNumber">
				<xsl:sort data-type="number"/>
				<xsl:value-of select="."/>,
			</xsl:for-each>
		</xsl:variable>
		<xsl:variable name="lowestnumber">
			<xsl:value-of select="substring-before($numberlist, ',')"/>
		</xsl:variable>
		<xsl:variable name="instigatornode">
			<xsl:copy-of select="/variabledata/event/InstigatorList/Instigator[CasePartyNumber = $lowestnumber]/*"/>
		</xsl:variable>
		<xsl:variable name="partytype">
			<xsl:call-template name="convertcase">
				<xsl:with-param name="toconvert" select="xalan:nodeset($instigatornode)/CasePartyRoleCode"/>
				<xsl:with-param name="conversion">lower</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="partynode">
			<xsl:copy-of select="/variabledata/claim/child::*[local-name() = $partytype and number = $lowestnumber]/*"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length(/variabledata/judgment/payee/name) > 0">
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="/variabledata/judgment/payee/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:when test="string-length(xalan:nodeset($partynode)/representativeid) > 0 and string-length(xalan:nodeset($partynode)/solicitorpayee) > 0">
				<xsl:variable name="representativeId">
					<xsl:value-of select="xalan:nodeset($partynode)/representativeid"/>
				</xsl:variable>
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="/variabledata/claim/representative[surrogateid = $representativeId]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="xalan:nodeset($partynode)/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="payeedefendant">
		<xsl:variable name="partynode">
			<xsl:choose>
				<xsl:when test="string-length(variabledata/claim/maindefendantid) > 0">
					<xsl:copy-of select="variabledata/claim/defendant[id=variabledata/claim/maindefendantid]/*"/>
				</xsl:when>
				<xsl:otherwise>
					<xsl:copy-of select="variabledata/claim/defendant[number=1]/*"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="string-length(xalan:nodeset($partynode)/representativeid) > 0 and string-length(xalan:nodeset($partynode)/solicitorpayee) > 0">
				<xsl:variable name="representativeId">
					<xsl:value-of select="xalan:nodeset($partynode)/representativeid"/>
				</xsl:variable>
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="/variabledata/claim/representative[surrogateid = $representativeId]/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="xalan:nodeset($partynode)/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!-- UCT TD 610 : Show address of Party For in Payment box. 
	on variabledata/warrant/partyforrolenumber and variable vdPartyForRoleCode -->
	<xsl:template name="payeePartyFor">
		<xsl:choose>
			<xsl:when test="string-length(/variabledata/warrant/localnumber) = 0">
				<!-- Means it's a Home Warrant-->
				<xsl:variable name="partyForRoleNumber">
					<xsl:copy-of select="variabledata/warrant/partyforrolenumber"/>
				</xsl:variable>
				<xsl:variable name="partynode">
					<xsl:copy-of select="variabledata/claim/*[type=$vdPartyForRoleToElementName and number=$partyForRoleNumber]/*"/>
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="string-length(xalan:nodeset($partynode)/representativeid) > 0 and string-length(xalan:nodeset($partynode)/solicitorpayee) > 0">
						<xsl:variable name="representativeId">
							<xsl:value-of select="xalan:nodeset($partynode)/representativeid"/>
						</xsl:variable>
						<xsl:call-template name="format-address-multi-line">
							<xsl:with-param name="party">
								<xsl:copy-of select="/variabledata/claim/representative[surrogateid = $representativeId]/*"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:when>
					<xsl:otherwise>
						<xsl:call-template name="format-address-multi-line">
							<xsl:with-param name="party">
								<xsl:copy-of select="xalan:nodeset($partynode)/*"/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<!-- We are dealing with a Foreign Warrant -->
				<xsl:call-template name="format-address-multi-line">
					<xsl:with-param name="party">
						<xsl:copy-of select="/variabledata/warrant/warrantparties/warrantpartyfor/*"/>
					</xsl:with-param>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="multiaddress">
		<xsl:param name="pagelayout"/>
		<xsl:param name="section"/>
		<xsl:element name="xsl:variable">
			<xsl:attribute name="name">eventId</xsl:attribute>
			<xsl:element name="xsl:value-of">
				<xsl:attribute name="select">variabledata/event/id</xsl:attribute>
			</xsl:element>
		</xsl:element>
		<xsl:element name="xsl:variable">
			<xsl:attribute name="name">aeeventId</xsl:attribute>
			<xsl:element name="xsl:value-of">
				<xsl:attribute name="select">variabledata/aeeventid</xsl:attribute>
			</xsl:element>
		</xsl:element>
		<!--
		<xsl:element name="xsl:variable">
			<xsl:attribute name="name">coeventId</xsl:attribute>
			<xsl:element name="xsl:value-of">
				<xsl:attribute name="select">variabledata/event/id</xsl:attribute>
			</xsl:element>
		</xsl:element>				
		-->
		<xsl:if test="supsfo:addressee/supsfo:blank">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test">variabledata/court/courtcode != '335'</xsl:attribute>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:additionalblank">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test">variabledata/court/courtcode != '335'</xsl:attribute>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:subject">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:subject/@event"><xsl:value-of select="supsfo:addressee/supsfo:subject/@event"/> = $eventId</xsl:when><xsl:when test="supsfo:addressee/supsfo:subject/@aeevent"><xsl:value-of select="supsfo:addressee/supsfo:subject/@aeevent"/> = $aeeventId</xsl:when><xsl:when test="supsfo:addressee/supsfo:subject/@coevent"><xsl:value-of select="supsfo:addressee/supsfo:subject/@coevent"/> = $coeventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:if">
					<xsl:attribute name="test">string-length(variabledata/event/SubjectCasePartyNumber) > 0</xsl:attribute>
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">subjectCasePartyNumber</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">variabledata/event/SubjectCasePartyNumber</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">mode</xsl:attribute>subject</xsl:element>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:choose">
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'CLAIMANT'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/claimant[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/claimant[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/claimant[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'DEFENDANT'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/defendant[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/defendant[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/defendant[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'DEBTOR'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/debtor[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/debtor[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/debtor[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'CREDITOR'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/creditor[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/creditor[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/creditor[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'PT 20 CLMT'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/part20claimant[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/part20claimant[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/part20claimant[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'PT 20 DEF'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/part20defendant[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/part20defendant[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/part20defendant[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'COMPANY'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/company[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/company[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/company[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'APPLICANT'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/applicant[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/applicant[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/applicant[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'PETITIONER'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/petitioner[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/petitioner[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/petitioner[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'INS PRAC'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/insolvencypractitioner[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/insolvencypractitioner[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/insolvencypractitioner[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'TRUSTEE'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/trustee[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/trustee[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/trustee[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'OFF REC'</xsl:attribute>
									<xsl:element name="xsl:choose">
										<xsl:element name="xsl:when">
											<xsl:attribute name="test">string-length(variabledata/claim/officialreceiver[number=$subjectCasePartyNumber]/representativeid) &gt; 0</xsl:attribute>
											<xsl:element name="xsl:variable">
												<xsl:attribute name="name">representativeId</xsl:attribute>
												<xsl:element name="xsl:value-of">
													<xsl:attribute name="select">variabledata/claim/officialreceiver[number=$subjectCasePartyNumber]/representativeid</xsl:attribute>
												</xsl:element>
											</xsl:element>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:otherwise">
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">variabledata/claim/officialreceiver[number=$subjectCasePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:claimant">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:claimant/@event"><xsl:value-of select="supsfo:addressee/supsfo:claimant/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">mode</xsl:attribute>claimant</xsl:element>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">addressee</xsl:attribute>
						<xsl:element name="xsl:choose">
							<xsl:element name="xsl:when">
								<xsl:attribute name="test">string-length(variabledata/claim/claimant[number=1]/representativeid) &gt; 0</xsl:attribute>
								<xsl:element name="xsl:variable">
									<xsl:attribute name="name">representativeId</xsl:attribute>
									<xsl:element name="xsl:value-of">
										<xsl:attribute name="select">variabledata/claim/claimant[number=1]/representativeid</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:otherwise">
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/claim/claimant[number=1]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		
		<xsl:if test="supsfo:addressee/supsfo:noticeissuespecial">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:defendants/@event"><xsl:value-of select="supsfo:addressee/supsfo:defendants/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/defendant</xsl:attribute>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">string-length(../claimant[number=1]/representativeid) &gt; 0</xsl:attribute>

							<xsl:element name="xsl:variable">
								<xsl:attribute name="name">representativeId</xsl:attribute>
								<xsl:element name="xsl:value-of">
									<xsl:attribute name="select">../claimant[number=1]/representativeid</xsl:attribute>
								</xsl:element>
							</xsl:element>
							
							<xsl:element name="xsl:call-template">
								<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">mode</xsl:attribute>noticeissuespecial</xsl:element>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">addressee</xsl:attribute>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">../representative[surrogateid = $representativeId]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">defendant</xsl:attribute>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
						
						<xsl:element name="xsl:otherwise">
						
							<xsl:element name="xsl:call-template">
								<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">mode</xsl:attribute>noticeissuespecial</xsl:element>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">addressee</xsl:attribute>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">../claimant[number=1]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">defendant</xsl:attribute>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>

						</xsl:element>
						
					</xsl:element>
				</xsl:element>

			</xsl:element>
		</xsl:if>
		
		<xsl:if test="supsfo:addressee/supsfo:claimants">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:claimants/@event"><xsl:value-of select="supsfo:addressee/supsfo:claimants/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/claimant</xsl:attribute>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">string-length(representativeid) = 0</xsl:attribute>
							<xsl:element name="xsl:call-template">
								<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">mode</xsl:attribute>claimants</xsl:element>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">addressee</xsl:attribute>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/representative</xsl:attribute>
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">representativeId</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">surrogateid</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:if">
						<xsl:attribute name="test">../claimant[representativeid = $representativeId]</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>claimants</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">./*</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">istelephonenumber</xsl:attribute>
								<xsl:value-of select="supsfo:addressee/supsfo:claimants/@isTelephoneNumber"/>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:defendant">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:defendant/@event"><xsl:value-of select="supsfo:addressee/supsfo:defendant/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">mode</xsl:attribute>defendant</xsl:element>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">addressee</xsl:attribute>
						<xsl:element name="xsl:choose">
							<xsl:element name="xsl:when">
								<xsl:attribute name="test">string-length(variabledata/claim/defendant[number=1]/representativeid) &gt; 0</xsl:attribute>
								<xsl:element name="xsl:variable">
									<xsl:attribute name="name">representativeId</xsl:attribute>
									<xsl:element name="xsl:value-of">
										<xsl:attribute name="select">variabledata/claim/defendant[number=1]/representativeid</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:otherwise">
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/claim/defendant[number=1]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:defendants">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:defendants/@event"><xsl:value-of select="supsfo:addressee/supsfo:defendants/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/defendant</xsl:attribute>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">string-length(representativeid) = 0</xsl:attribute>
							<xsl:element name="xsl:call-template">
								<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">mode</xsl:attribute>defendants</xsl:element>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">addressee</xsl:attribute>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/representative</xsl:attribute>
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">representativeId</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">surrogateid</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:if">
						<xsl:attribute name="test">../defendant[representativeid = $representativeId]</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>defendants</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">./*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:instigators">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:instigators/@event"><xsl:value-of select="supsfo:addressee/supsfo:instigators/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/event/InstigatorList/Instigator</xsl:attribute>
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">casePartyNumber</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">CasePartyNumber</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">CasePartyRoleCode = 'CLAIMANT'</xsl:attribute>
							<xsl:element name="xsl:if">
								<xsl:attribute name="test">string-length(/variabledata/claim/claimant[number=$casePartyNumber]/representativeid) = 0</xsl:attribute>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/</xsl:attribute>
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">mode</xsl:attribute>instigator</xsl:element>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">addressee</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">/variabledata/claim/claimant[number=$casePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">CasePartyRoleCode = 'DEFENDANT'</xsl:attribute>
							<xsl:element name="xsl:if">
								<xsl:attribute name="test">string-length(/variabledata/claim/defendant[number=$casePartyNumber]/representativeid) = 0</xsl:attribute>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/</xsl:attribute>
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">mode</xsl:attribute>instigator</xsl:element>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">addressee</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">/variabledata/claim/defendant[number=$casePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">CasePartyRoleCode = 'PT 20 CLMT'</xsl:attribute>
							<xsl:element name="xsl:if">
								<xsl:attribute name="test">string-length(/variabledata/claim/part20claimant[number=$casePartyNumber]/representativeid) = 0</xsl:attribute>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/</xsl:attribute>
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">mode</xsl:attribute>instigator</xsl:element>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">addressee</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">/variabledata/claim/part20claimant[number=$casePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">CasePartyRoleCode = 'PT 20 DEF'</xsl:attribute>
							<xsl:element name="xsl:if">
								<xsl:attribute name="test">string-length(/variabledata/claim/part20defendant[number=$casePartyNumber]/representativeid) = 0</xsl:attribute>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/</xsl:attribute>
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">mode</xsl:attribute>instigator</xsl:element>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">addressee</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">/variabledata/claim/part20defendant[number=$casePartyNumber]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">/variabledata/claim/child::*[(local-name()='claimant' or local-name()='defendant' or local-name()='part20claimant' or local-name()='part20defendant') and string-length(representativeid) > 0]</xsl:attribute>
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">representativeId</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">representativeid</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">alreadyAddressed</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name">instigatorRepresentativeAlreadyAddressed</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:if">
						<xsl:attribute name="test">string-length($alreadyAddressed) = 0</xsl:attribute>
						<xsl:element name="xsl:variable">
							<xsl:attribute name="name">casePartyNumber</xsl:attribute>
							<xsl:element name="xsl:value-of">
								<xsl:attribute name="select">number</xsl:attribute>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:if">
							<xsl:attribute name="test">local-name()='claimant'</xsl:attribute>
							<xsl:element name="xsl:if">
								<xsl:attribute name="test">/variabledata/event/InstigatorList/Instigator[CasePartyRoleCode = 'CLAIMANT' and CasePartyNumber = $casePartyNumber]</xsl:attribute>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/</xsl:attribute>
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">mode</xsl:attribute>instigator_claimant</xsl:element>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">addressee</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:if">
							<xsl:attribute name="test">local-name()='defendant'</xsl:attribute>
							<xsl:element name="xsl:if">
								<xsl:attribute name="test">/variabledata/event/InstigatorList/Instigator[CasePartyRoleCode = 'DEFENDANT' and CasePartyNumber = $casePartyNumber]</xsl:attribute>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/</xsl:attribute>
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">mode</xsl:attribute>instigator_defendant</xsl:element>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">addressee</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:if">
							<xsl:attribute name="test">local-name()='part20claimant'</xsl:attribute>
							<xsl:element name="xsl:if">
								<xsl:attribute name="test">/variabledata/event/InstigatorList/Instigator[CasePartyRoleCode = 'PT 20 CLMT' and CasePartyNumber = $casePartyNumber]</xsl:attribute>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/</xsl:attribute>
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">mode</xsl:attribute>instigator_pt20claimant</xsl:element>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">addressee</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:if">
							<xsl:attribute name="test">local-name()='part20defendant'</xsl:attribute>
							<xsl:element name="xsl:if">
								<xsl:attribute name="test">/variabledata/event/InstigatorList/Instigator[CasePartyRoleCode = 'PT 20 DEF' and CasePartyNumber = $casePartyNumber]</xsl:attribute>
								<xsl:element name="xsl:for-each">
									<xsl:attribute name="select">/</xsl:attribute>
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">mode</xsl:attribute>instigator_pt20defendant</xsl:element>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">addressee</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:part20defendants">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:part20defendants/@event"><xsl:value-of select="supsfo:addressee/supsfo:part20defendants/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/part20defendant</xsl:attribute>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">string-length(representativeid) = 0</xsl:attribute>
							<xsl:element name="xsl:call-template">
								<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">mode</xsl:attribute>part20defendants</xsl:element>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">addressee</xsl:attribute>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/representative</xsl:attribute>
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">representativeId</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">surrogateid</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:if">
						<xsl:attribute name="test">../part20defendant[representativeid = $representativeId]</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>part20defendants</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">./*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:witness">
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:copy-of">
						<xsl:attribute name="select">variabledata/witness/*</xsl:attribute>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:thirdparty">
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:copy-of">
						<xsl:attribute name="select">variabledata/thirdparty/*</xsl:attribute>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:courtbeinformed">
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:copy-of">
						<xsl:attribute name="select">variabledata/informed/*</xsl:attribute>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:selectedcreditor">
			<xsl:element name="xsl:variable">
				<xsl:attribute name="name">DebtSeq</xsl:attribute>
				<xsl:element name="xsl:value-of">
					<xsl:attribute name="select">//debt[creditor/name = //creditorselected/name]/debtseq</xsl:attribute>
				</xsl:element>
			</xsl:element>	
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:selectedcreditor/@event"><xsl:value-of select="supsfo:addressee/supsfo:selectedcreditor/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:choose">
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">string-length(normalize-space(//debt[debtseq = $DebtSeq]/payee/address/line1)) &gt; 0</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>payee</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">/variabledata/order/coorder/debts/debt[debtseq = $DebtSeq]/payee/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">string-length(normalize-space(//debt[debtseq = $DebtSeq]/creditor/address/line1)) &gt; 0</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>creditor</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">/variabledata/order/coorder/debts/debt[debtseq = $DebtSeq]/creditor/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:selectedcreditor2">
			<xsl:element name="xsl:variable">
				<xsl:attribute name="name">DebtSeq</xsl:attribute>
				<xsl:element name="xsl:value-of">
					<xsl:attribute name="select">//debt[creditor/name = //creditorselected/name]/debtseq</xsl:attribute>
				</xsl:element>
			</xsl:element>	
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:selectedcreditor2/@event"><xsl:value-of select="supsfo:addressee/supsfo:selectedcreditor2/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:choose">
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">string-length(normalize-space(//debt[debtseq = $DebtSeq]/payee/address/line1)) &gt; 0</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>payee</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">/variabledata/order/coorder/debts/debt[debtseq = $DebtSeq]/payee/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">string-length(normalize-space(//debt[debtseq = $DebtSeq]/creditor/address/line1)) &gt; 0</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>creditor</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">/variabledata/order/coorder/debts/debt[debtseq = $DebtSeq]/creditor/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:aeemployer">
			<xsl:for-each select="supsfo:addressee/supsfo:aeemployer">
				<xsl:element name="xsl:if">
					<xsl:attribute name="test"><xsl:choose><xsl:when test="./@event"><xsl:value-of select="./@event"/> = $aeeventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
					<xsl:element name="xsl:if">
						<xsl:attribute name="test">string-length(variabledata/aeemployer/name) > 0</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/aeemployer/*</xsl:attribute>
								</xsl:element>										
							</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">type</xsl:attribute>
								<xsl:value-of select="./@sic"/>
							</xsl:element>	
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:for-each>				
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:thirdpartybank">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test">string-length(variabledata/thirdparty/bankdetails) > 0</xsl:attribute>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">addressee</xsl:attribute>
						<xsl:element name="xsl:copy-of">
							<xsl:attribute name="select">variabledata/thirdparty/bankdetails/*</xsl:attribute>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
<xsl:if test="supsfo:addressee/supsfo:officersubject">
	<xsl:element name="xsl:choose">
		<xsl:element name="xsl:when">
			<!-- Use address details supplied by user in variable data screen -->
			<xsl:attribute name="test">string-length(variabledata/notice/officer/name) > 0</xsl:attribute>
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:copy-of">
						<xsl:attribute name="select">variabledata/notice/officer/*</xsl:attribute>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:element>
		<xsl:element name="xsl:otherwise">
			<!-- Same as subject, although must be subject and not subject's solicitor - TRAC 2439 -->
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:subject/@event"><xsl:value-of select="supsfo:addressee/supsfo:subject/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:variable">
					<xsl:attribute name="name">subjectCasePartyNumber</xsl:attribute>
					<xsl:element name="xsl:value-of">
						<xsl:attribute name="select">variabledata/event/SubjectCasePartyNumber</xsl:attribute>
					</xsl:element>
				</xsl:element>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">addressee</xsl:attribute>
						<xsl:element name="xsl:choose">
							<xsl:element name="xsl:when">
								<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'CLAIMANT'</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/claim/claimant[number=$subjectCasePartyNumber]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
							
							<xsl:element name="xsl:when">
								<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'DEFENDANT'</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/claim/defendant[number=$subjectCasePartyNumber]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
							
							<xsl:element name="xsl:when">
								<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'PT 20 CLMT'</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/claim/part20claimant[number=$subjectCasePartyNumber]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
							
							<xsl:element name="xsl:when">
								<xsl:attribute name="test">variabledata/event/SubjectPartyRoleCode = 'PT 20 DEF'</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/claim/part20defendant[number=$subjectCasePartyNumber]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:element>
	</xsl:element>
</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:deponent">
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:copy-of">
						<xsl:attribute name="select">variabledata/order/deponent/*</xsl:attribute>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:debtor">
			<xsl:for-each select="supsfo:addressee/supsfo:debtor">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="./@event"><xsl:value-of select="./@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">mode</xsl:attribute>debtor</xsl:element>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">addressee</xsl:attribute>
						<xsl:element name="xsl:copy-of">
							<xsl:attribute name="select">variabledata/order/coorder/debtor/*</xsl:attribute>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
			</xsl:for-each>
		</xsl:if>
		<!--  selected debtor, first used on L_BLANK_CO for co event 111 -->
		<xsl:if test="supsfo:addressee/supsfo:selecteddebtor">
			<xsl:for-each select="supsfo:addressee/supsfo:selecteddebtor">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="./@event"><xsl:value-of select="./@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:if">
					<xsl:attribute name="test">/variabledata/coevent/details = 'DEBTOR'</xsl:attribute>
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">mode</xsl:attribute>debtor</xsl:element>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">variabledata/order/coorder/debtor/*</xsl:attribute>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
			</xsl:for-each>
		</xsl:if>

		<xsl:if test="supsfo:addressee/supsfo:creditor">
			<xsl:element name="xsl:for-each">
				<xsl:attribute name="select">variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or isnew='Y']</xsl:attribute>
				<xsl:element name="xsl:choose">
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">string-length(normalize-space(./payee/address/line1)) &gt; 0</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>creditor</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">./payee/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:otherwise">
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>creditor</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">./creditor/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		
		<xsl:if test="supsfo:addressee/supsfo:creditorInclPending">
			<xsl:element name="xsl:for-each">
				<xsl:attribute name="select">variabledata/order/coorder/debts/debt[debtstatus='LIVE' or debtstatus='SCHEDULE2' or debtstatus='PENDING' or isnew='Y']</xsl:attribute>
				<xsl:element name="xsl:choose">
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">string-length(normalize-space(./payee/address/line1)) &gt; 0</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>creditor</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">./payee/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:otherwise">
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>creditor</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">./creditor/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:employer">
			<!-- Defect 3283; empty addressee when no employer details -->
			<xsl:element name="xsl:if">
				<xsl:attribute name="test">string-length(variabledata/order/coorder/employer/address/line1) &gt; 0</xsl:attribute>
				<xsl:for-each select="supsfo:addressee/supsfo:employer">
					<xsl:element name="xsl:if">
						<xsl:attribute name="test"><xsl:choose><xsl:when test="./@event"><xsl:value-of select="./@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/order/coorder/employer/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">type</xsl:attribute>
								<xsl:value-of select="./@sic"/>
							</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">isaoeoinforce</xsl:attribute>
								<xsl:element name="xsl:value-of">
									<xsl:attribute name="select">variabledata/coevent/isaoaeinforce</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:for-each>
			</xsl:element>
		</xsl:if>
		<!--  selected employer, first used on L_BLANK_CO for co event 111 -->
		<xsl:if test="supsfo:addressee/supsfo:selectedemployer">
			<!-- Defect 3283; empty addressee when no employer details -->
			<xsl:element name="xsl:if">
				<xsl:attribute name="test">string-length(variabledata/order/coorder/employer/address/line1) &gt; 0</xsl:attribute>
				<xsl:for-each select="supsfo:addressee/supsfo:selectedemployer">
					<xsl:element name="xsl:if">
						<xsl:attribute name="test"><xsl:choose><xsl:when test="./@event"><xsl:value-of select="./@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
						
						<xsl:element name="xsl:if">
							<xsl:attribute name="test">variabledata/coevent/details = 'EMPLOYER'</xsl:attribute>
							<xsl:element name="xsl:call-template">
								<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">addressee</xsl:attribute>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">variabledata/order/coorder/employer/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">type</xsl:attribute>
									<xsl:value-of select="./@sic"/>
								</xsl:element>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">isaoeoinforce</xsl:attribute>
									<xsl:element name="xsl:value-of">
										<xsl:attribute name="select">variabledata/coevent/isaoaeinforce</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
							
						</xsl:element>
						
					</xsl:element>
				</xsl:for-each>
			</xsl:element>
		</xsl:if>
		<!-- defect 3095 -->
		<xsl:if test="supsfo:addressee/supsfo:aejudgmentcreditor">
			<xsl:element name="xsl:variable">
				<xsl:attribute name="name">apartyid</xsl:attribute>
				<xsl:element name="xsl:value-of">
					<xsl:attribute name="select">variabledata/aejudgmentcreditorpid</xsl:attribute>
				</xsl:element>
			</xsl:element>
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">string-length(//variabledata/claim/*[id=$apartyid]/representativeid) &gt; 0</xsl:attribute>
							<xsl:element name="xsl:variable">
								<xsl:attribute name="name">representativeId</xsl:attribute>
								<xsl:element name="xsl:value-of">
									<xsl:attribute name="select">//variabledata/claim/*[id=$apartyid]/representativeid</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">//variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:otherwise">
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">//variabledata/claim/*[id=$apartyid]/*</xsl:attribute>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:selectedpart20claimant">
			<xsl:element name="xsl:variable">
				<xsl:attribute name="name">apartyid</xsl:attribute>
				<xsl:element name="xsl:value-of">
					<xsl:attribute name="select">variabledata/order/part20/claimant</xsl:attribute>
				</xsl:element>
			</xsl:element>
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">string-length(//variabledata/claim/*[id=$apartyid]/representativeid) &gt; 0</xsl:attribute>
							<xsl:element name="xsl:variable">
								<xsl:attribute name="name">representativeId</xsl:attribute>
								<xsl:element name="xsl:value-of">
									<xsl:attribute name="select">//variabledata/claim/*[id=$apartyid]/representativeid</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">//variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:otherwise">
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">//variabledata/claim/*[id=$apartyid]/*</xsl:attribute>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>		
		<xsl:if test="supsfo:addressee/supsfo:part20claimants">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:part20claimants/@event"><xsl:value-of select="supsfo:addressee/supsfo:part20claimants/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/part20claimant</xsl:attribute>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">string-length(representativeid) = 0</xsl:attribute>
							<xsl:element name="xsl:call-template">
								<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">mode</xsl:attribute>part20claimants</xsl:element>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">addressee</xsl:attribute>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/representative</xsl:attribute>
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">representativeId</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">surrogateid</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:if">
						<xsl:attribute name="test">../part20claimant[representativeid = $representativeId]</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>part20claimants</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">./*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:instigator">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:instigators/@event"><xsl:value-of select="supsfo:addressee/supsfo:instigators/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:choose">
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">$vdInstigatorPartyRoleCode = 'CLAIMANT'</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>instigator</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:choose">
									<xsl:element name="xsl:when">
										<xsl:attribute name="test">string-length(variabledata/claim/claimant[number=$vdInstigatorNumber]/representativeid) &gt; 0</xsl:attribute>
										<xsl:element name="xsl:variable">
											<xsl:attribute name="name">representativeId</xsl:attribute>
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">variabledata/claim/claimant[number=$vdInstigatorNumber]/representativeid</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:copy-of">
											<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:otherwise">
										<xsl:element name="xsl:copy-of">
											<xsl:attribute name="select">variabledata/claim/claimant[number=$vdInstigatorNumber]/*</xsl:attribute>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">$vdInstigatorPartyRoleCode = 'DEFENDANT'</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>instigator</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:choose">
									<xsl:element name="xsl:when">
										<xsl:attribute name="test">string-length(variabledata/claim/defendant[number=$vdInstigatorNumber]/representativeid) &gt; 0</xsl:attribute>
										<xsl:element name="xsl:variable">
											<xsl:attribute name="name">representativeId</xsl:attribute>
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">variabledata/claim/defendant[number=$vdInstigatorNumber]/representativeid</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:copy-of">
											<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:otherwise">
										<xsl:element name="xsl:copy-of">
											<xsl:attribute name="select">variabledata/claim/defendant[number=$vdInstigatorNumber]/*</xsl:attribute>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">$vdInstigatorPartyRoleCode = 'PT 20 CLMT'</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>instigator</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:choose">
									<xsl:element name="xsl:when">
										<xsl:attribute name="test">string-length(variabledata/claim/part20claimant[number=$vdInstigatorNumber]/representativeid) &gt; 0</xsl:attribute>
										<xsl:element name="xsl:variable">
											<xsl:attribute name="name">representativeId</xsl:attribute>
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">variabledata/claim/part20claimant[number=$vdInstigatorNumber]/representativeid</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:copy-of">
											<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:otherwise">
										<xsl:element name="xsl:copy-of">
											<xsl:attribute name="select">variabledata/claim/part20claimant[number=$vdInstigatorNumber]/*</xsl:attribute>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:when">
						<xsl:attribute name="test">$vdInstigatorPartyRoleCode = 'PT 20 DEF'</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">mode</xsl:attribute>instigator</xsl:element>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:choose">
									<xsl:element name="xsl:when">
										<xsl:attribute name="test">string-length(variabledata/claim/part20defendant[number=$vdInstigatorNumber]/representativeid) &gt; 0</xsl:attribute>
										<xsl:element name="xsl:variable">
											<xsl:attribute name="name">representativeId</xsl:attribute>
											<xsl:element name="xsl:value-of">
												<xsl:attribute name="select">variabledata/claim/part20defendant[number=$vdInstigatorNumber]/representativeid</xsl:attribute>
											</xsl:element>
										</xsl:element>
										<xsl:element name="xsl:copy-of">
											<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:otherwise">
										<xsl:element name="xsl:copy-of">
											<xsl:attribute name="select">variabledata/claim/part20defendant[number=$vdInstigatorNumber]/*</xsl:attribute>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:debtorparty">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:debtorparty/@event"><xsl:value-of select="supsfo:addressee/supsfo:debtorparty/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/debtor</xsl:attribute>
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:choose">
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">string-length(./representativeid) &gt; 0</xsl:attribute>
									<xsl:element name="xsl:variable">
										<xsl:attribute name="name">representativeId</xsl:attribute>
										<xsl:element name="xsl:value-of">
											<xsl:attribute name="select">./representativeid</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">../representative[surrogateid = $representativeId]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:otherwise">
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:creditorparty">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:creditorparty/@event"><xsl:value-of select="supsfo:addressee/supsfo:creditorparty/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/creditor</xsl:attribute>
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:choose">
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">string-length(./representativeid) &gt; 0</xsl:attribute>
									<xsl:element name="xsl:variable">
										<xsl:attribute name="name">representativeId</xsl:attribute>
										<xsl:element name="xsl:value-of">
											<xsl:attribute name="select">./representativeid</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">../representative[surrogateid = $representativeId]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:otherwise">
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:company">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:company/@event"><xsl:value-of select="supsfo:addressee/supsfo:company/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/company</xsl:attribute>
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:choose">
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">string-length(./representativeid) &gt; 0</xsl:attribute>
									<xsl:element name="xsl:variable">
										<xsl:attribute name="name">representativeId</xsl:attribute>
										<xsl:element name="xsl:value-of">
											<xsl:attribute name="select">./representativeid</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">../representative[surrogateid = $representativeId]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:otherwise">
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:applicant">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:applicant/@event"><xsl:value-of select="supsfo:addressee/supsfo:applicant/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/applicant</xsl:attribute>
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:choose">
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">string-length(./representativeid) &gt; 0</xsl:attribute>
									<xsl:element name="xsl:variable">
										<xsl:attribute name="name">representativeId</xsl:attribute>
										<xsl:element name="xsl:value-of">
											<xsl:attribute name="select">./representativeid</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">../representative[surrogateid = $representativeId]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:otherwise">
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:petitioner">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:petitioner/@event"><xsl:value-of select="supsfo:addressee/supsfo:petitioner/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/petitioner</xsl:attribute>
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:choose">
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">string-length(./representativeid) &gt; 0</xsl:attribute>
									<xsl:element name="xsl:variable">
										<xsl:attribute name="name">representativeId</xsl:attribute>
										<xsl:element name="xsl:value-of">
											<xsl:attribute name="select">./representativeid</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">../representative[surrogateid = $representativeId]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:otherwise">
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:insolvencypractitioner">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:insolvencypractitioner/@event"><xsl:value-of select="supsfo:addressee/supsfo:insolvencypractitioner/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/insolvencypractitioner</xsl:attribute>
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:choose">
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">string-length(./representativeid) &gt; 0</xsl:attribute>
									<xsl:element name="xsl:variable">
										<xsl:attribute name="name">representativeId</xsl:attribute>
										<xsl:element name="xsl:value-of">
											<xsl:attribute name="select">./representativeid</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">../representative[surrogateid = $representativeId]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:otherwise">
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:officialreceiver">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test">string-length(variabledata/claim/officialreceiver/address/line1) &gt; 0</xsl:attribute>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">addressee</xsl:attribute>
						<xsl:element name="xsl:choose">
							<xsl:element name="xsl:when">
								<xsl:attribute name="test">string-length(variabledata/claim/officialreceiver/representativeid) &gt; 0</xsl:attribute>
								<xsl:element name="xsl:variable">
									<xsl:attribute name="name">representativeId</xsl:attribute>
									<xsl:element name="xsl:value-of">
										<xsl:attribute name="select">variabledata/claim/officialreceiver/representativeid</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:otherwise">
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">variabledata/claim/officialreceiver/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:trustee">
			<xsl:element name="xsl:if">
				<xsl:attribute name="test"><xsl:choose><xsl:when test="supsfo:addressee/supsfo:trustee/@event"><xsl:value-of select="supsfo:addressee/supsfo:trustee/@event"/> = $eventId</xsl:when><xsl:otherwise>1 = 1</xsl:otherwise></xsl:choose></xsl:attribute>
				<xsl:element name="xsl:for-each">
					<xsl:attribute name="select">variabledata/claim/trustee</xsl:attribute>
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:choose">
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">string-length(./representativeid) &gt; 0</xsl:attribute>
									<xsl:element name="xsl:variable">
										<xsl:attribute name="name">representativeId</xsl:attribute>
										<xsl:element name="xsl:value-of">
											<xsl:attribute name="select">./representativeid</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">../representative[surrogateid = $representativeId]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:otherwise">
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">./*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:cfo">
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:copy-of">
						<xsl:attribute name="select">variabledata/order/cfo/*</xsl:attribute>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:transferedtocourt">
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:copy-of">
						<xsl:attribute name="select">variabledata/transfer/court/*</xsl:attribute>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:judgmentcreditor">

			<!-- party for -->
			<xsl:element name="xsl:for-each">
				<xsl:attribute name="select">variabledata/judgment/infavourofparties/party</xsl:attribute>
				<xsl:element name="xsl:variable">
					<xsl:attribute name="name">apartyid</xsl:attribute>
					<xsl:element name="xsl:value-of">
						<xsl:attribute name="select">self::node()/partyid</xsl:attribute>
					</xsl:element>
				</xsl:element>

		<xsl:element name="xsl:if">

				<xsl:attribute name="test">string-length(/variabledata/claim/*[id=$apartyid]/representativeid) = 0</xsl:attribute>

				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">/variabledata/claim/*[id=$apartyid]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:element>

		<!-- party for representative -->

			<xsl:element name="xsl:for-each">
				<xsl:attribute name="select">variabledata/claim/representative</xsl:attribute>
				<xsl:element name="xsl:variable">
					<xsl:attribute name="name">asurrogateid</xsl:attribute>
					<xsl:element name="xsl:value-of">
						<xsl:attribute name="select">self::node()/surrogateid</xsl:attribute>
					</xsl:element>
				</xsl:element>
				<xsl:element name="xsl:variable">
					<xsl:attribute name="name">partyTypeNumber</xsl:attribute>
					<xsl:element name="xsl:value-of">
						<xsl:attribute name="select">self::node()/number</xsl:attribute>
					</xsl:element>
				</xsl:element>				
			<xsl:element name="xsl:if">

				<xsl:attribute name="test">//partyid = //variabledata/claim/*[representativeid = concat('SOLICITOR_',$partyTypeNumber)]/id = 'true'</xsl:attribute>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $asurrogateid]/*</xsl:attribute>
								</xsl:element>
				</xsl:element>
			</xsl:element>		

			</xsl:element>		
		</xsl:element>		
			
		</xsl:if>
		<!-- Selected in favour of party from a judgment (or representative) . Used in output L_3_9 -->
		<xsl:if test="supsfo:addressee/supsfo:selectedjudgmentcreditor">
			<xsl:element name="xsl:variable">
				<xsl:attribute name="name">selectedpartyid</xsl:attribute>
				<xsl:element name="xsl:value-of">
					<xsl:attribute name="select">/variabledata/judgment/infavourofparties/selectedinfavourofpartyid</xsl:attribute>
				</xsl:element>
			</xsl:element>
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">string-length(/variabledata/claim/*[id=$selectedpartyid]/representativeid) &gt; 0</xsl:attribute>
							<xsl:element name="xsl:variable">
								<xsl:attribute name="name">representativeId</xsl:attribute>
								<xsl:element name="xsl:value-of">
									<xsl:attribute name="select">/variabledata/claim/*[id=$selectedpartyid]/representativeid</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:otherwise">
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">/variabledata/claim/*[id=$selectedpartyid]/*</xsl:attribute>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:partyforselected">
			<xsl:element name="xsl:for-each">
				<xsl:attribute name="select">variabledata/judgment/partyforselected</xsl:attribute>
				<xsl:element name="xsl:variable">
					<xsl:attribute name="name">partyKey</xsl:attribute>
					<xsl:element name="xsl:value-of">
						<xsl:attribute name="select">.</xsl:attribute>
					</xsl:element>
				</xsl:element>
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">addressee</xsl:attribute>
						<xsl:element name="xsl:choose">
							<xsl:element name="xsl:when">
								<xsl:attribute name="test">string-length(/descendant-or-self::node()/claim/descendant-or-self::node()/parent::node()[solicitorsurrogateid=$partyKey]/representativeid) &gt; 0</xsl:attribute>
								<xsl:element name="xsl:variable">
									<xsl:attribute name="name">representativeId</xsl:attribute>
									<xsl:element name="xsl:value-of">
										<xsl:attribute name="select">/descendant-or-self::node()/claim/descendant-or-self::node()/parent::node()[solicitorsurrogateid=$partyKey]/representativeid</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:otherwise">
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">/descendant-or-self::node()/claim/descendant-or-self::node()/parent::node()[solicitorsurrogateid=$partyKey]/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:judgmentdebtor">
			<!-- party against-->
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">string-length(/variabledata/claim/*[id=../../judgment/partyagainst/id]/representativeid) &gt; 0</xsl:attribute>
							<xsl:element name="xsl:variable">
								<xsl:attribute name="name">representativeId</xsl:attribute>
								<xsl:element name="xsl:value-of">
									<xsl:attribute name="select">/variabledata/claim/*[id=../../judgment/partyagainst/id]/representativeid</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:otherwise">
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">/variabledata/claim/*[id=../../judgment/partyagainst/id]/*</xsl:attribute>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:judgmentdebtornosol">
			<!-- party against-->
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">/variabledata/claim/*[id=../../judgment/partyagainst/id]/*</xsl:attribute>
							</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:warrantPartyFor">
			<!-- warrant party for or representative-->
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:copy-of">
						<xsl:attribute name="select">/variabledata/warrant/warrantparties/warrantpartyfor/*</xsl:attribute>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:warrantPartiesAgainst">
			<!-- warrant party against or representative-->
			<xsl:element name="xsl:choose">
				<!-- Test to see what type of warrant we are dealing with -->
				<xsl:element name="xsl:when">
					<xsl:attribute name="test">string-length(/variabledata/warrant/localnumber) = 0</xsl:attribute>
					<!-- We are dealing with a Home Warrant here -->
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">warPartyAgainst1</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">/variabledata/warrant/warrantparties/warrantpartyagainst1/type</xsl:attribute>
						</xsl:element>
						<xsl:element name="xsl:text">_</xsl:element>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">/variabledata/warrant/warrantparties/warrantpartyagainst1/number</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">warPartyAgainst2</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">/variabledata/warrant/warrantparties/warrantpartyagainst2/type</xsl:attribute>
						</xsl:element>
						<xsl:element name="xsl:text">_</xsl:element>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">/variabledata/warrant/warrantparties/warrantpartyagainst2/number</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:variable">
						<xsl:attribute name="name">partyForRepresentativeId</xsl:attribute>
						<xsl:element name="xsl:value-of">
							<xsl:attribute name="select">/variabledata/warrant/warrantparties/warrantpartyfor/representativeid</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<!-- Test to see if party against 1 is represented -->
					<xsl:element name="xsl:choose">
						<xsl:element name="xsl:when">
							<xsl:attribute name="test">string-length(/variabledata/claim/*[solicitorsurrogateid = $warPartyAgainst1 ]/representativeid) &gt; 0</xsl:attribute>
							<!-- The party is represented so test to see if an output has already been created for the solicitor -->
							<xsl:element name="xsl:variable">
								<xsl:attribute name="name">partyAgainst1RepresentativeId</xsl:attribute>
								<xsl:element name="xsl:value-of">
									<xsl:attribute name="select">/variabledata/claim/*[solicitorsurrogateid = $warPartyAgainst1]/representativeid</xsl:attribute>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:if">
								<xsl:attribute name="test">$partyAgainst1RepresentativeId != $partyForRepresentativeId</xsl:attribute>
								<!-- An output has not already been built for party against 1's solicitor so we can create it -->
								<xsl:element name="xsl:call-template">
									<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
									<xsl:element name="xsl:with-param">
										<xsl:attribute name="name">addressee</xsl:attribute>
										<xsl:element name="xsl:copy-of">
											<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $partyAgainst1RepresentativeId]/*</xsl:attribute>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
						<xsl:element name="xsl:otherwise">
							<!-- Party against 1 is not represented so use the party's address -->
							<xsl:element name="xsl:call-template">
								<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
								<xsl:element name="xsl:with-param">
									<xsl:attribute name="name">addressee</xsl:attribute>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">/variabledata/claim/*[solicitorsurrogateid = $warPartyAgainst1]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
					<!-- Only create the output if warrantpartyagainst2 is present -->
					<xsl:element name="xsl:if">
						<xsl:attribute name="test">string-length(/variabledata/warrant/warrantparties/warrantpartyagainst2/name) > 0</xsl:attribute>
						<!-- Test to see if party against 2 is represented -->
						<xsl:element name="xsl:choose">
							<xsl:element name="xsl:when">
								<xsl:attribute name="test">string-length(/variabledata/claim/*[solicitorsurrogateid = $warPartyAgainst2 ]/representativeid) &gt; 0</xsl:attribute>
								<!-- The party is represented so test to see if an output has already been created for the solicitor -->
								<xsl:element name="xsl:variable">
									<xsl:attribute name="name">partyAgainst1RepresentativeId</xsl:attribute>
									<xsl:element name="xsl:value-of">
										<xsl:attribute name="select">/variabledata/claim/*[solicitorsurrogateid = $warPartyAgainst1]/representativeid</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:variable">
									<xsl:attribute name="name">partyAgainst2RepresentativeId</xsl:attribute>
									<xsl:element name="xsl:value-of">
										<xsl:attribute name="select">/variabledata/claim/*[solicitorsurrogateid = $warPartyAgainst2]/representativeid</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<!-- An output has not already been built for party against 2's solicitor so we can create it -->
								<xsl:element name="xsl:if">
									<xsl:attribute name="test">$partyAgainst2RepresentativeId != $partyAgainst1RepresentativeId and $partyAgainst2RepresentativeId != $partyForRepresentativeId</xsl:attribute>
									<xsl:element name="xsl:call-template">
										<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
										<xsl:element name="xsl:with-param">
											<xsl:attribute name="name">addressee</xsl:attribute>
											<xsl:element name="xsl:copy-of">
												<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $partyAgainst2RepresentativeId]/*</xsl:attribute>
											</xsl:element>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
							<xsl:element name="xsl:otherwise">
								<!-- Party against 2 is not represented so use the party's address -->
								<xsl:element name="xsl:call-template">
									<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
									<xsl:element name="xsl:with-param">
										<xsl:attribute name="name">addressee</xsl:attribute>
										<xsl:element name="xsl:copy-of">
											<xsl:attribute name="select">/variabledata/claim/*[solicitorsurrogateid = $warPartyAgainst2]/*</xsl:attribute>
										</xsl:element>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
				<xsl:element name="xsl:otherwise">
					<!-- We are dealing with a Foreign Warrant -->
					<!-- Address is Party Against 1 -->
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:copy-of">
								<xsl:attribute name="select">/variabledata/warrant/warrantparties/warrantpartyagainst1/*</xsl:attribute>
							</xsl:element>
						</xsl:element>
					</xsl:element>
					<!-- Address is Party Against 2. Only create the output if warrantpartyagainst2 is present -->
					<xsl:element name="xsl:if">
						<xsl:attribute name="test">string-length(/variabledata/warrant/warrantparties/warrantpartyagainst2/name) > 0</xsl:attribute>
						<xsl:element name="xsl:call-template">
							<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
							<xsl:element name="xsl:with-param">
								<xsl:attribute name="name">addressee</xsl:attribute>
								<xsl:element name="xsl:copy-of">
									<xsl:attribute name="select">/variabledata/warrant/warrantparties/warrantpartyagainst2/*</xsl:attribute>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<!-- Selected warrant party against used by output N54 -->
		<xsl:if test="supsfo:addressee/supsfo:selectedWarrantPartyAgainst">
				<xsl:element name="xsl:call-template">
					<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">addressee</xsl:attribute>
						<xsl:element name="xsl:copy-of">
							<xsl:attribute name="select">/variabledata/warrant/possession/*</xsl:attribute>
						</xsl:element>
					</xsl:element>
					<xsl:element name="xsl:with-param">
						<xsl:attribute name="name">isnoticeofeviction</xsl:attribute>
						<xsl:value-of select="supsfo:addressee/supsfo:selectedWarrantPartyAgainst/@isNoticeOfEviction"/>
					</xsl:element>
				</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:eventSelectedWarrantPartyAgainst">
			<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-							<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>
					<xsl:element name="xsl:if">
						<xsl:attribute name="test">/variabledata/warrant/partyagainstnumber = '1'</xsl:attribute>
						<xsl:element name="xsl:copy-of">
							<xsl:attribute name="select">/variabledata/warrant/warrantparties/warrantpartyagainst1/*</xsl:attribute>
						</xsl:element>
					</xsl:element>	
					<xsl:element name="xsl:if">	
						<xsl:attribute name="test">/variabledata/warrant/partyagainstnumber = '2'</xsl:attribute>				
						<xsl:element name="xsl:copy-of">
							<xsl:attribute name="select">/variabledata/warrant/warrantparties/warrantpartyagainst2/*</xsl:attribute>
						</xsl:element>
					</xsl:element>	
				</xsl:element>
			</xsl:element>
		</xsl:if>
		<xsl:if test="supsfo:addressee/supsfo:caps">
				<xsl:element name="xsl:call-template">
				<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-							<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
				<xsl:element name="xsl:with-param">
					<xsl:attribute name="name">addressee</xsl:attribute>				
					<xsl:element name="name">HM Courts &amp; Tribunals Service</xsl:element>
					<xsl:element name="address">
						<xsl:element name="line1">3rd Floor (CAPS)</xsl:element>
						<xsl:element name="line2">St Katharine's House</xsl:element>
						<xsl:element name="line3">St Katharine's Street</xsl:element>
						<xsl:element name="line4">Northampton</xsl:element>
						<xsl:element name="line5"></xsl:element>
						<xsl:element name="postcode">NN1 2ZY</xsl:element>
					</xsl:element>
					<xsl:element name="dx">DX: 702885, Northampton 7</xsl:element>						
				</xsl:element>								
			</xsl:element>
		</xsl:if>
		
		<xsl:if test="supsfo:addressee/supsfo:aeeventdetails">
		<xsl:element name="xsl:choose">
	 		<xsl:element name="xsl:when">
				<xsl:attribute name="test">/variabledata/event/aeeventdetails = 'JUDGMENT CREDITOR'</xsl:attribute>		
				<!-- Judgment Creditor BEGIN -->
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-							<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:choose">
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">string-length(/variabledata/claim/*[name = //aepartyfor]/representativeid) &gt; 0</xsl:attribute>
									<xsl:element name="xsl:variable">
										<xsl:attribute name="name">representativeId</xsl:attribute>
										<xsl:element name="xsl:value-of">
											<xsl:attribute name="select">/variabledata/claim/*[name = //aepartyfor]/representativeid</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:otherwise">
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">//claim//*[name = //aepartyfor]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				<!-- Judgment Creditor END -->
			</xsl:element>
			<xsl:element name="xsl:when">
				<xsl:attribute name="test">/variabledata/event/aeeventdetails = 'JUDGMENT DEBTOR'</xsl:attribute>
				<!-- Judgment Debtor BEGIN -->
					<xsl:element name="xsl:call-template">
						<xsl:attribute name="name"><xsl:value-of select="$pagelayout"/><xsl:if test="string-length($section) > 0">-							<xsl:value-of select="$section"/></xsl:if></xsl:attribute>
						<xsl:element name="xsl:with-param">
							<xsl:attribute name="name">addressee</xsl:attribute>
							<xsl:element name="xsl:choose">
								<xsl:element name="xsl:when">
									<xsl:attribute name="test">string-length(/variabledata/claim/*[name = //aepartyagainst]/representativeid) &gt; 0</xsl:attribute>
									<xsl:element name="xsl:variable">
										<xsl:attribute name="name">representativeId</xsl:attribute>
										<xsl:element name="xsl:value-of">
											<xsl:attribute name="select">/variabledata/claim/*[name = //aepartyagainst]/representativeid</xsl:attribute>
										</xsl:element>
									</xsl:element>
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">/variabledata/claim/representative[surrogateid = $representativeId]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
								<xsl:element name="xsl:otherwise">
									<xsl:element name="xsl:copy-of">
										<xsl:attribute name="select">//claim//*[name = //aepartyagainst]/*</xsl:attribute>
									</xsl:element>
								</xsl:element>
							</xsl:element>
						</xsl:element>
					</xsl:element>
				<!-- Judgment Debtor END -->
			</xsl:element>
		</xsl:element>
		</xsl:if>	

	</xsl:template>
	<xsl:template name="instigatorRepresentativeAlreadyAddressed">
		<xsl:variable name="representativeId">
			<xsl:value-of select="representativeid"/>
		</xsl:variable>
		<xsl:variable name="partyType">
			<xsl:value-of select="local-name()"/>
		</xsl:variable>
		<xsl:for-each select="preceding-sibling::*[representativeid = $representativeId and local-name() = $partyType]">
			<xsl:variable name="casePartyNumber">
				<xsl:value-of select="number"/>
			</xsl:variable>
			<xsl:if test="local-name()='claimant'">
				<xsl:if test="/variabledata/event/InstigatorList/Instigator[CasePartyRoleCode = 'CLAIMANT' and CasePartyNumber = $casePartyNumber]">
					<xsl:value-of select="id"/>
				</xsl:if>
			</xsl:if>
			<xsl:if test="local-name()='defendant'">
				<xsl:if test="/variabledata/event/InstigatorList/Instigator[CasePartyRoleCode = 'DEFENDANT' and CasePartyNumber = $casePartyNumber]">
					<xsl:value-of select="id"/>
				</xsl:if>
			</xsl:if>
			<xsl:if test="local-name()='part20claimant'">
				<xsl:if test="/variabledata/event/InstigatorList/Instigator[CasePartyRoleCode = 'PT 20 CLMT' and CasePartyNumber = $casePartyNumber]">
					<xsl:value-of select="id"/>
				</xsl:if>
			</xsl:if>
			<xsl:if test="local-name()='part20defendant'">
				<xsl:if test="/variabledata/event/InstigatorList/Instigator[CasePartyRoleCode = 'PT 20 DEF' and CasePartyNumber = $casePartyNumber]">
					<xsl:value-of select="id"/>
				</xsl:if>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>

