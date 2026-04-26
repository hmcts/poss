<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N100AC"><div><font size="2" face="Times New Roman">
		<div style="font-weight: bold; margin-bottom: 0.4cm;">
			Before <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> sitting at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtName"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCourtOrDistrict"/>, <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdHearingAtCourtAddress"/>
		</div>
		<div style="margin-bottom: 0.4cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOHearingAttendees"/>
		</div>		
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId='865'">
		<xsl:choose>
			<xsl:when test="$vdFineOrPrison='PRISON'">
				<div xmlns="" style="margin-bottom: 0.4cm;">
					To the District Judge and Bailiffs of the Court, and every Constable within his jurisdiction, and to the Governor of Her Majesty's Prison at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOPrisonName"/>
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					It has been proved to the satisfaction of the court that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/> has committed an offence under paragraph <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOffenceText"/> of section 23(2) of the Attachment of Earnings Act 1971 namely that he <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOffenceDetails"/>.
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					IT IS ORDERED that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/> shall be committed to prison for <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPrisonLength"/> days
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					AND YOU the District Judge, Bailiffs and others, are therefore required to arrest <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/> and deliver him to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOPrisonName"/> Prison
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					AND YOU the Governor to receive <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/> and keep him safely in prison for <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPrisonLength"/> days from the arrest under this order or until he shall be sooner discharged by due course of law. 
				</div>
			</xsl:when>
			<xsl:when test="$vdFineOrPrison='FINE'">
				<div xmlns="" style="margin-bottom: 0.4cm;">
					It has been proved to the satisfaction of the court that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/> has committed an offence under paragraph <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOffenceText"/> of section 23(2) of the Attachment of Earnings Act 1971 namely that he <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOffenceDetails"/>.
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					IT IS ORDERED that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCODebtorName"/> do pay a fine of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAmountOwed"/> for the offence and do pay that sum into the office of this court by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSumPayDate"/>.
				</div>
			</xsl:when>
		</xsl:choose>
		</xsl:if>	
		<xsl:if xmlns="http://eds.com/supsfo" test="$vdEventId='877'">
		<xsl:choose>
			<xsl:when test="$vdFineOrPrison='PRISON'">
				<div xmlns="" style="margin-bottom: 0.4cm;">
					To the District Judge and Bailiffs of the Court, and every Constable within his jurisdiction, and to the Governor of Her Majesty's Prison at <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOPrisonName"/>
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					It has been proved to the satisfaction of the court that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerName"/> has committed an offence under paragraph <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOffenceText"/> of section 23(2) of the Attachment of Earnings Act 1971 namely that he <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOffenceDetails"/>.
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					IT IS ORDERED that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerName"/> shall be committed to prison for <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPrisonLength"/> days
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					AND YOU the District Judge, Bailiffs and others, are therefore required to arrest <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerName"/> and deliver him to <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdCOPrisonName"/> Prison
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					AND YOU the Governor to receive <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerName"/> and keep him safely in prison for <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdPrisonLength"/> days from the arrest under this order or until he shall be sooner discharged by due course of law. 
				</div>
			</xsl:when>
			<xsl:when test="$vdFineOrPrison='FINE'">
				<div xmlns="" style="margin-bottom: 0.4cm;">
					It has been proved to the satisfaction of the court that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerName"/> has committed an offence under paragraph <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOffenceText"/> of section 23(2) of the Attachment of Earnings Act 1971 namely that he <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdOffenceDetails"/>.
				</div>
				<div xmlns="" style="margin-bottom: 0.4cm;">
					IT IS ORDERED that <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEmployerName"/> do pay a fine of £<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAmountOwed"/> for the offence and do pay that sum into the office of this court by <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSumPayDate"/>.
				</div>
			</xsl:when>
		</xsl:choose>
		</xsl:if>		
		<div style="text-align: right;">
			<span style="font-weight: bold;">Dated </span><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdEventDate"/>
		</div>
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>