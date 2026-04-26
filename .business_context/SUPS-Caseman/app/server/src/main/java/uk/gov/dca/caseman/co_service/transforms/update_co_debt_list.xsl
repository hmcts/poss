<?xml version="1.0"?>
<!--
	Service: Co
	Method:  updateCoDebtList()
	File:    update_co_debt_list.xsl
	Author:  Phil Haferer (EDS)
	Created: 13 September 2005
	Description: 
		Moves the position of the Reference tags.
	
	Change History:
	18-10-2005 Phil Haferer: Creditor/Payee mapped into the ALLOWED_DEBTS table (as well as PARTIES).
	11-01-2006 Phil Haferer: Comms Method and Welsh Indicator for Creditor/Payee mapped into the ALLOWED_DEBTS.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  version="1.0">
	<!-- xsl:strip-space elements="*"/ -->
	<xsl:output indent="yes"/>

	<xsl:template match="ds/MaintainCO/Debts/Debt">
		<xsl:copy>
			<xsl:element name="CreditorReference">
				<xsl:value-of select="Creditor/Reference"/>
			</xsl:element>
			<xsl:element name="PayeeReference">
				<xsl:value-of select="Payee/Reference"/>
			</xsl:element>
			<xsl:element name="CPCreditorId">
				<xsl:value-of select="Creditor[CPCode != '']/PartyId"/>
			</xsl:element>
			<xsl:element name="CPPayeeId">
				<xsl:value-of select="Payee[CPCode != '']/PartyId"/>
			</xsl:element>
			<xsl:element name="CreditorCommMethod">
				<xsl:value-of select="Creditor/CommMethod"/>
			</xsl:element>
			<xsl:element name="PayeeCommMethod">
				<xsl:value-of select="Payee/CommMethod"/>
			</xsl:element>
			<xsl:element name="CreditorTranslationToWelsh">
				<xsl:value-of select="Creditor/TranslationToWelsh"/>
			</xsl:element>
			<xsl:element name="PayeeTranslationToWelsh">
				<xsl:value-of select="Payee/TranslationToWelsh"/>
			</xsl:element>
			<xsl:apply-templates/>
		</xsl:copy>
	</xsl:template>    
	
	<xsl:template match="ds/MaintainCO/Debts/Debt/CPCreditorId"/>
	<xsl:template match="ds/MaintainCO/Debts/Debt/CPPayeeId"/>

	<!-- Transfer the columns relating to the PARTIES table into a sub-node (so it can be discarded by CheckExists). -->
	<xsl:template match="ds/MaintainCO/Debts/Debt/Creditor">
		<xsl:copy>
			<xsl:element name="Party">
				<xsl:for-each select="node()">
					<xsl:if test="name() != 'Address' and name() != 'AddressHistory'">
						<xsl:apply-templates select="current()"/>
					</xsl:if>
		   	   </xsl:for-each>
			</xsl:element>
			<xsl:for-each select="node()">
				<xsl:if test="name() = 'Address' or name() = 'AddressHistory'">
					<xsl:apply-templates select="current()"/>
				</xsl:if>
	   	   </xsl:for-each>
		</xsl:copy>
	</xsl:template>    

	<xsl:template match="ds/MaintainCO/Debts/Debt/Payee">
		<xsl:copy>
			<xsl:element name="Party">
				<xsl:for-each select="node()">
					<xsl:if test="name() != 'Address' and name() != 'AddressHistory'">
						<xsl:apply-templates select="current()"/>
					</xsl:if>
		   	   </xsl:for-each>
			</xsl:element>
			<xsl:for-each select="node()">
				<xsl:if test="name() = 'Address' or name() = 'AddressHistory'">
					<xsl:apply-templates select="current()"/>
				</xsl:if>
	   	   </xsl:for-each>
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
