<?xml version="1.0"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:xalan="http://xml.apache.org/xalan"
                xmlns:ejbx="uk.gov.dca.db.xslt.EJBExtension"
                extension-element-prefixes="ejbx"
                version="1.0">
                
  <xalan:component prefix="ejbx" elements="invoke" functions="">
    <xalan:script lang="javaclass" src="uk.gov.dca.db.xslt.EJBExtension"/>
  </xalan:component>
                
  <xsl:output method="xml" indent="yes"/>
  
  <!-- This tests proves that an XSL stylesheet can be invoked via the service framework -->
  
  <xsl:template match="/RejectedCases">
 <xsl:text disable-output-escaping="yes">&lt;RejectedCases&gt;</xsl:text>
 
  	<xsl:for-each select="./RejectedCase">
  	<xsl:text>&#10;</xsl:text>
 	
 	<xsl:text disable-output-escaping="yes">&lt;RejectedCase&gt;</xsl:text>
 	<xsl:text>&#10;</xsl:text>
 	
        <xsl:text disable-output-escaping="yes">&lt;CaseNumber&gt;</xsl:text>
		<xsl:value-of select="CaseNumber"/>
		<xsl:text disable-output-escaping="yes">&lt;/CaseNumber&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;DateRejected&gt;</xsl:text>
		<xsl:value-of select="DateRejected"/>
		<xsl:text disable-output-escaping="yes">&lt;/DateRejected&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;RejectCode&gt;</xsl:text>
		<xsl:value-of select="RejectCode"/>
		<xsl:text disable-output-escaping="yes">&lt;/RejectCode&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;RejectReason&gt;</xsl:text>
		<xsl:value-of select="RejectReason"/>
		<xsl:text disable-output-escaping="yes">&lt;/RejectReason&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;DespatchNumber&gt;</xsl:text>
		<xsl:value-of select="DespatchNumber"/>
		<xsl:text disable-output-escaping="yes">&lt;/DespatchNumber&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;CreditorCode&gt;</xsl:text>
		<xsl:value-of select="CreditorCode"/>
		<xsl:text disable-output-escaping="yes">&lt;/CreditorCode&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;ClaimantName&gt;</xsl:text>
		<xsl:value-of select="ClaimantName"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantName&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;ClaimantAddress1&gt;</xsl:text>
		<xsl:value-of select="ClaimantAddress1"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantAddress1&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>

        <xsl:text disable-output-escaping="yes">&lt;ClaimantAddress2&gt;</xsl:text>
		<xsl:value-of select="ClaimantAddress2"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantAddress2&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>

        <xsl:text disable-output-escaping="yes">&lt;ClaimantAddress3&gt;</xsl:text>
		<xsl:value-of select="ClaimantAddress3"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantAddress3&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;ClaimantAddress4&gt;</xsl:text>
		<xsl:value-of select="ClaimantAddress4"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantAddress4&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;ClaimantAddress5&gt;</xsl:text>
		<xsl:value-of select="ClaimantAddress5"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantAddress5&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;ClaimantAddress6&gt;</xsl:text>
		<xsl:value-of select="ClaimantAddress6"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantAddress6&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;Reference&gt;</xsl:text>
		<xsl:value-of select="Reference"/>
		<xsl:text disable-output-escaping="yes">&lt;/Reference&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;ClaimantDXNo&gt;</xsl:text>
		<xsl:value-of select="ClaimantDXNo"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantDXNo&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;ClaimantTelNo&gt;</xsl:text>
		<xsl:value-of select="ClaimantTelNo"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantTelNo&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;ClaimantFaxNo&gt;</xsl:text>
		<xsl:value-of select="ClaimantFaxNo"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantFaxNo&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;ClaimantEmail&gt;</xsl:text>
		<xsl:value-of select="ClaimantEmail"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantEmail&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;ClaimantPMC&gt;</xsl:text>
		<xsl:value-of select="ClaimantPMC"/>
		<xsl:text disable-output-escaping="yes">&lt;/ClaimantPMC&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		
		
        <xsl:text disable-output-escaping="yes">&lt;CorresRepName&gt;</xsl:text>
		<xsl:value-of select="CorresRepName"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRepName&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;CorresRebAddress1&gt;</xsl:text>
		<xsl:value-of select="CorresRebAddress1"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRebAddress1&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;CorresRebAddress2&gt;</xsl:text>
		<xsl:value-of select="CorresRebAddress2"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRebAddress2&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;CorresRebAddress3&gt;</xsl:text>
		<xsl:value-of select="CorresRebAddress3"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRebAddress3&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;CorresRebAddress4&gt;</xsl:text>
		<xsl:value-of select="CorresRebAddress4"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRebAddress4&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;CorresRebAddress5&gt;</xsl:text>
		<xsl:value-of select="CorresRebAddress5"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRebAddress5&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>								
		
        <xsl:text disable-output-escaping="yes">&lt;CorresRebPostcode&gt;</xsl:text>
		<xsl:value-of select="CorresRebPostcode"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRebPostcode&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;CorresRepFaxNo&gt;</xsl:text>
		<xsl:value-of select="CorresRepFaxNo"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRepFaxNo&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;CoressRepEmail&gt;</xsl:text>
		<xsl:value-of select="CoressRepEmail"/>
		<xsl:text disable-output-escaping="yes">&lt;/CoressRepEmail&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;CorresRepDXNumber&gt;</xsl:text>
		<xsl:value-of select="CorresRepDXNumber"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRepDXNumber&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;CorresRepTelNumber&gt;</xsl:text>
		<xsl:value-of select="CorresRepTelNumber"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRepTelNumber&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;CorresRepCommMethod&gt;</xsl:text>
		<xsl:value-of select="CorresRepCommMethod"/>
		<xsl:text disable-output-escaping="yes">&lt;/CorresRepCommMethod&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		
        <xsl:text disable-output-escaping="yes">&lt;AmountClaimedCurrency&gt;</xsl:text>
		<xsl:value-of select="AmountClaimedCurrency"/>
		<xsl:text disable-output-escaping="yes">&lt;/AmountClaimedCurrency&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;AmountClaimed&gt;</xsl:text>
		<xsl:value-of select="AmountClaimed"/>
		<xsl:text disable-output-escaping="yes">&lt;/AmountClaimed&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;CourtFeeCurrency&gt;</xsl:text>
		<xsl:value-of select="CourtFeeCurrency"/>
		<xsl:text disable-output-escaping="yes">&lt;/CourtFeeCurrency&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;CourtFee&gt;</xsl:text>
		<xsl:value-of select="CourtFee"/>
		<xsl:text disable-output-escaping="yes">&lt;/CourtFee&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;SolicitorsCostsCurrency&gt;</xsl:text>
		<xsl:value-of select="SolicitorsCostsCurrency"/>
		<xsl:text disable-output-escaping="yes">&lt;/SolicitorsCostsCurrency&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;SolicitorsCosts&gt;</xsl:text>
		<xsl:value-of select="SolicitorsCosts"/>
		<xsl:text disable-output-escaping="yes">&lt;/SolicitorsCosts&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;TotalCurrency&gt;</xsl:text>
		<xsl:value-of select="TotalCurrency"/>
		<xsl:text disable-output-escaping="yes">&lt;/TotalCurrency&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>		
		
        <xsl:text disable-output-escaping="yes">&lt;Total&gt;</xsl:text>
		<xsl:value-of select="Total"/>
		<xsl:text disable-output-escaping="yes">&lt;/Total&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>

        <xsl:text disable-output-escaping="yes">&lt;DateOfIssue&gt;</xsl:text>
        <xsl:value-of select="DateOfIssue"/>
		<xsl:text disable-output-escaping="yes">&lt;/DateOfIssue&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;DateOfService&gt;</xsl:text>
		<xsl:value-of select="DateOfService"/>
		<xsl:text disable-output-escaping="yes">&lt;/DateOfService&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;ParticularsOfClaim&gt;</xsl:text>
		<xsl:value-of select="ParticularsOfClaim"/>
		<xsl:text disable-output-escaping="yes">&lt;/ParticularsOfClaim&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
        <xsl:text disable-output-escaping="yes">&lt;Validated&gt;</xsl:text>
		<xsl:value-of select="Validated"/>
		<xsl:text disable-output-escaping="yes">&lt;/Validated&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Defendants&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Defendant&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantId&gt;</xsl:text>
        <xsl:text>1</xsl:text>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantId&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Name&gt;</xsl:text>
        <xsl:value-of select="Defendant1Name"/>
		<xsl:text disable-output-escaping="yes">&lt;/Name&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Address1&gt;</xsl:text>
        <xsl:value-of select="Defendant1Address1"/>
		<xsl:text disable-output-escaping="yes">&lt;/Address1&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Address2&gt;</xsl:text>
        <xsl:value-of select="Defendant1Address2"/>
		<xsl:text disable-output-escaping="yes">&lt;/Address2&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
				
		<xsl:text disable-output-escaping="yes">&lt;Address3&gt;</xsl:text>
        <xsl:value-of select="Defendant1Address3"/>
		<xsl:text disable-output-escaping="yes">&lt;/Address3&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Address4&gt;</xsl:text>
        <xsl:value-of select="Defendant1Address4"/>
		<xsl:text disable-output-escaping="yes">&lt;/Address4&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>

		<xsl:text disable-output-escaping="yes">&lt;Address5&gt;</xsl:text>
        <xsl:value-of select="Defendant1Address5"/>
		<xsl:text disable-output-escaping="yes">&lt;/Address5&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>		
						
		<xsl:text disable-output-escaping="yes">&lt;Postcode&gt;</xsl:text>
        <xsl:value-of select="Defendant1Postcode"/>
		<xsl:text disable-output-escaping="yes">&lt;/Postcode&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantDXNumber&gt;</xsl:text>
        <xsl:value-of select="Defendant1DXNO"/>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantDXNumber&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantTelNumber&gt;</xsl:text>
        <xsl:value-of select="Defendant1TelNo"/>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantTelNumber&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantFaxNumber&gt;</xsl:text>
        <xsl:value-of select="Defendant1FaxNo"/>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantFaxNumber&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantEmailAddress&gt;</xsl:text>
        <xsl:value-of select="Defendant1Email"/>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantEmailAddress&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantCommMethod&gt;</xsl:text>
        <xsl:value-of select="Defendant1PMC"/>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantCommMethod&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
						
		<xsl:text disable-output-escaping="yes">&lt;/Defendant&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Defendant&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantId&gt;</xsl:text>
        <xsl:text>2</xsl:text>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantId&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Name&gt;</xsl:text>
        <xsl:value-of select="Defendant2Name"/>
		<xsl:text disable-output-escaping="yes">&lt;/Name&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Address1&gt;</xsl:text>
        <xsl:value-of select="Defendant2Address1"/>
		<xsl:text disable-output-escaping="yes">&lt;/Address1&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Address2&gt;</xsl:text>
        <xsl:value-of select="Defendant2Address2"/>
		<xsl:text disable-output-escaping="yes">&lt;/Address2&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
				
		<xsl:text disable-output-escaping="yes">&lt;Address3&gt;</xsl:text>
        <xsl:value-of select="Defendant2Address3"/>
		<xsl:text disable-output-escaping="yes">&lt;/Address3&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		
		<xsl:text disable-output-escaping="yes">&lt;Address4&gt;</xsl:text>
        <xsl:value-of select="Defendant2Address4"/>
		<xsl:text disable-output-escaping="yes">&lt;/Address4&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>

		<xsl:text disable-output-escaping="yes">&lt;Address5&gt;</xsl:text>
        <xsl:value-of select="Defendant2Address5"/>
		<xsl:text disable-output-escaping="yes">&lt;/Address5&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>		
						
		<xsl:text disable-output-escaping="yes">&lt;Postcode&gt;</xsl:text>
        <xsl:value-of select="Defendant2Postcode"/>
		<xsl:text disable-output-escaping="yes">&lt;/Postcode&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantDXNumber&gt;</xsl:text>
        <xsl:value-of select="Defendant2DXNO"/>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantDXNumber&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantTelNumber&gt;</xsl:text>
        <xsl:value-of select="Defendant2TelNo"/>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantTelNumber&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantFaxNumber&gt;</xsl:text>
        <xsl:value-of select="Defendant2FaxNo"/>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantFaxNumber&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantEmailAddress&gt;</xsl:text>
        <xsl:value-of select="Defendant2Email"/>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantEmailAddress&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
		<xsl:text disable-output-escaping="yes">&lt;DefendantCommMethod&gt;</xsl:text>
        <xsl:value-of select="Defendant2PMC"/>
		<xsl:text disable-output-escaping="yes">&lt;/DefendantCommMethod&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>	
		
							
		<xsl:text disable-output-escaping="yes">&lt;/Defendant&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
		<xsl:text disable-output-escaping="yes">&lt;/Defendants&gt;</xsl:text>
		<xsl:text>&#10;</xsl:text>
				
	<xsl:text disable-output-escaping="yes">&lt;/RejectedCase&gt;</xsl:text>
	
  	</xsl:for-each>
	<xsl:text>&#10;</xsl:text>  	
  	 <xsl:text disable-output-escaping="yes">&lt;/RejectedCases&gt;</xsl:text>
  	 <xsl:text>&#10;</xsl:text>
  </xsl:template>
  
  
</xsl:stylesheet>