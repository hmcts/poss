<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  version="1.0">
	<!-- xsl:strip-space elements="*"/ -->
	<xsl:output indent="yes"/>

	<!-- Try and add an SCN for the CPR2CPR table, if one exists. -->
	<xsl:template match="ds/ManageCase">
	   <xsl:copy>
			<xsl:if test="./Parties/LitigiousParty/SCN[@table='CPR2CPR']">
				<xsl:copy-of select="(./Parties/LitigiousParty/SCN[@table = 'CPR2CPR'])[1]"/>
			</xsl:if>
			<xsl:apply-templates/>
	   </xsl:copy>
	</xsl:template>

	<!-- Determine the OtherPossessionAddressPresent flag state. -->
	<xsl:template match="OtherPossessionAddressPresent">
	</xsl:template>

	<xsl:template match="OtherPossessionAddress">
	   <xsl:element name="OtherPossessionAddressPresent">
     	  <xsl:choose>
			<xsl:when test="Address">true</xsl:when>
			<xsl:otherwise>false</xsl:otherwise>
		  </xsl:choose>
	   </xsl:element>
	   <xsl:copy-of select="current()"/>
	</xsl:template>

	<!-- Mark those Solicitors that are not referred to by any of the LitigousParty's as 'Removed'. -->
	<xsl:template match="ds/ManageCase/Parties/Solicitor/Status">
	   <xsl:copy>
	      <xsl:variable name="varTypeCode" select="../TypeCode"/>
	      <xsl:variable name="varNumber" select="../Number"/>
     	  <xsl:choose>
			<xsl:when test="../../LitigiousParty[.//SolicitorTypeCode = $varTypeCode][SolicitorNumber = $varNumber]">EXISTING</xsl:when>
			<xsl:otherwise>REMOVED</xsl:otherwise>
		  </xsl:choose>		    
	   </xsl:copy>
	</xsl:template>

	<!-- Transfer the Historical Addresses related to each Party into it's own node. -->
	<xsl:template match="ds/ManageCase/Parties/LitigiousParty/HistoricalAddresses">
	   <xsl:copy>
	       <xsl:variable name="varPartyRoleCode" select="../TypeCode"/>
	       <xsl:variable name="varCasePartyNumber" select="../Number"/>
		   <xsl:copy-of select="../../HistoricalAddresses/Address[PartyRoleCode = $varPartyRoleCode][CasePartyNumber = $varCasePartyNumber]"/>
	   </xsl:copy>
	</xsl:template>

	<!-- Discard the source of Historical Addresses used by the above template. -->
	<xsl:template match="ds/ManageCase/Parties/HistoricalAddresses">
	</xsl:template>

	<xsl:template match="@*|node()">
	   <xsl:copy>
	      <xsl:apply-templates select="@*"/>
	      <xsl:apply-templates/>
	   </xsl:copy>
	</xsl:template>

	<xsl:template match="/">
      <xsl:apply-templates/>
	</xsl:template>

</xsl:stylesheet>
