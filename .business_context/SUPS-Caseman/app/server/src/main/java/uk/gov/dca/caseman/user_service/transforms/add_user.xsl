<?xml version="1.0"?>
<!--
	Service: User
	Method:  addUser()
	File:    add_user.xsl
	Author:  Phil Haferer (EDS)
	Created: 09 November 2005
	Description: 
		Add an extra tag into the XML to allow a separate pivot node to be executed.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  version="1.0">
	<!-- xsl:strip-space elements="*"/ -->
	<xsl:output indent="yes"/>

	<xsl:template match="ds/MaintainUser/Role">
		<xsl:element name="UserCourt">
			<xsl:copy-of select="../CourtCode"/>
			<xsl:copy-of select="../SectionForBMS"/>			
			<xsl:copy-of select="../HomeFlag"/>	
			<xsl:copy-of select="../DateFrom"/>									
			<xsl:element name="UserRole">
				<xsl:copy-of select="current()"/>
			</xsl:element>
		</xsl:element>
	</xsl:template>    

	<!-- Match but do nothing so the following fields are not copied twice -->
	<xsl:template match="ds/MaintainUser/CourtCode"/>
	<xsl:template match="ds/MaintainUser/SectionForBMS"/>	
	<xsl:template match="ds/MaintainUser/HomeFlag"/>	
	<xsl:template match="ds/MaintainUser/DateFrom"/>	

	<!-- Copy through everything else -->
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
