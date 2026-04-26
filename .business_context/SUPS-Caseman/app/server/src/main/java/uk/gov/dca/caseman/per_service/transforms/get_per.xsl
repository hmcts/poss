<?xml version="1.0"?>
<!--
	Service: Per
	Method:  getPer()
	File:    get_per.xsl
	Author:  Phil Haferer (EDS), Ian Stainer (Valtech)
	Created: 01 June 2005
	Description: 
		An XML translation applied to the data retrieved from the database, before returning to the client.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  version="1.0">
	<!-- xsl:strip-space elements="*"/ -->
	<xsl:output indent="yes"/>

	<xsl:template match="PerDetail/Category">
	</xsl:template>

	<xsl:template match="CalculatePER">	
		<xsl:copy>		
			<!-- Copy all the non-PerDetail nodes. -->
			<xsl:apply-templates select="node()[name() != 'PerDetail']"/>

			<xsl:element name="PersonalAllowances">
				<xsl:for-each select="./PerDetail[./Category = 'A']">
					<xsl:element name="Allowance">
						<xsl:apply-templates select="node()"/>
						</xsl:element>		
				</xsl:for-each>		   
			</xsl:element>		

			<xsl:element name="Premiums">
				<xsl:for-each select="./PerDetail[./Category = 'B']">
					<xsl:element name="Premium">
						<xsl:apply-templates select="node()"/>
					</xsl:element>		
				</xsl:for-each>		   
			</xsl:element>		

			<xsl:element name="OtherLiabilities">
				<xsl:for-each select="./PerDetail[./Category = 'C']">
					<xsl:element name="Liability">
							<xsl:apply-templates select="node()"/>
					</xsl:element>		
				</xsl:for-each>		   
			</xsl:element>		

			<xsl:element name="OtherResources">
				<xsl:for-each select="./PerDetail[./Category = 'D']">
					<xsl:element name="Resource">
						<xsl:apply-templates select="node()"/>
					</xsl:element>		
				</xsl:for-each>		   
			</xsl:element>		
		</xsl:copy>
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
