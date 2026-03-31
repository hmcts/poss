<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N10091"><div><font size="4" face="Times New Roman">
		<div style="margin-bottom: 0.8cm;">
			<xsl:value-of xmlns="http://eds.com/supsfo" select="$vdJudge"/> has considered the statements of case and allocation questionnaires filed 
			and allocated the <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdAQConsideredInRespectOf"/> <span style="font-weight: bold;">to the multi-track.</span>
		</div>
		
		<div style="margin-bottom: 0.8cm;">          
        <xsl:choose xmlns="http://eds.com/supsfo">
            <xsl:when test="$vdMultiTrackTransfer= 'CTC'">
                The claim is being transferred to the Civil Trial Centre at 
            <xsl:call-template name="convertcase">
                    <xsl:with-param name="toconvert">
                        <xsl:value-of select="variabledata/transfer/court/cname"/>
                    </xsl:with-param>
                    <xsl:with-param name="conversion">proper</xsl:with-param>
                </xsl:call-template>
                County Court where all future applications, correspondence and so on will be dealt with.
            </xsl:when>
            <xsl:when test="$vdMultiTrackTransfer= 'RCJ'">
                The claim is being transferred to 
                <xsl:value-of select="variabledata/transfer/court/rcjdivision"/> 
                Division of the Royal Court of Justice where all future applications, correspondence and so on will be dealt with.
            </xsl:when>
            <xsl:when test="$vdMultiTrackTransfer= 'NT'"/>
        </xsl:choose>
		</div>

		<div style="margin-bottom: 0.8cm;">
		<xsl:choose xmlns="http://eds.com/supsfo">
			<xsl:when test="$vdAllocationReasonGiven = 'Y'">
				<div xmlns="">The reasons the judge has given for allocation to this track are that</div>
			</xsl:when>
			<xsl:otherwise>
				<div xmlns="">The reason the judge has given for allocation to this track is that</div>
			</xsl:otherwise>
		</xsl:choose>
		</div>
		<div><xsl:call-template xmlns="http://eds.com/supsfo" name="formatTextAreaText">
					<xsl:with-param name="text"><xsl:copy-of select="$vdAllocationReason"/>
					</xsl:with-param></xsl:call-template></div>
		
	</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>