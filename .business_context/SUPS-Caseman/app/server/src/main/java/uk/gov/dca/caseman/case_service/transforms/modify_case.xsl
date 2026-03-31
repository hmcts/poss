<?xml version="1.0"?>
<!--
	Service: Case
	Method:  addCase()/updateCase()
	File:    modify_case.xml
	Author:  Phil Haferer (EDS)
	Created: November 2004
	Description: 
		Transform the Case XML in order to facilitate persistence.
		
	Change History:
	19-Jul-2005 Phil Haferer: Changes to support Address Type of 'SERVICE' (for AE).
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  version="1.0">
	<xsl:strip-space elements="*"/>
	<xsl:output indent="yes"/>

	<!-- Create a CPR_TO_CPR_RELATIONSHIP pivot node if a LitigiousParty has an associated Solicitor. -->
	<xsl:template match="SolicitorSurrogateId">
		<!-- Copy the element we've matching against (regardless). -->
		<xsl:copy>
		  <xsl:apply-templates/>
		</xsl:copy>

		<!-- When a SolicitorSurrogateId is specified... -->		 	  
		<xsl:choose>
			<xsl:when test=". != ''">
			   <xsl:element name="CPR2CPRUpdate">
			   </xsl:element>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<!-- Some Solicitor's are Coded Parties, their Addresses cannot be modified.
	     Don't include the Address node, if we're dealing with a coded Party. -->
	<xsl:template match="Solicitor[Code != '']/ContactDetails/Address">
	</xsl:template>

	<!-- Some LitigiousParty's are Coded Parties, their Addresses cannot be modified.
	     Don't include the Address node, if we're dealing with a coded Party. --> 
	<xsl:template match="LitigiousParty[Code != '']/ContactDetails/Address">
	</xsl:template>

	<!-- Only include new LitigiousParty's Historical Addresses, discard the others. -->
	<xsl:template match="LitigiousParty/HistoricalAddresses/Address[Status != 'NEW']">
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
