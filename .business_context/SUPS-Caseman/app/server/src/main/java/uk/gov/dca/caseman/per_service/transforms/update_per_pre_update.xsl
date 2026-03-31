<?xml version="1.0"?>
<!--
	Service: Per
	Method:  updatePer()
	File:    update_per_pre_update.xsl
	Author:  Phil Haferer (EDS), Ian Stainer (Valtech)
	Created: 07 June 2005
	Description: 
		An XML translation applied to the input document from the client, before 
		attempting the 'Update' pipeline step.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  version="1.0">
	<!-- xsl:strip-space elements="*"/ -->
	<xsl:output indent="yes"/>

	<!-- Remove the 'Category' grouping nodes, as they aren't required for the update. -->
	<xsl:template match="PersonalAllowances|Premiums|OtherLiabilities|OtherResources">
		<xsl:apply-templates/>
	</xsl:template>

	<!-- Replace the node name other category nodes with 'PerDetail'. -->
	<xsl:template match="Allowance|Premium|Liability|Resource">
		<xsl:element name="PerDetail">
			<xsl:apply-templates/>
		</xsl:element>		
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
