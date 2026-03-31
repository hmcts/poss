<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:ora="http://www.oracle.com/XSL/Transform/java" xmlns:supsfo="http://eds.com/supsfo" xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:ns0="xmlns" ns0:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:import href="supsfo.xsl"/><xsl:strip-space elements="*"/><xsl:output method="xml"/><xsl:template match="/"><editableSections><div class="EDITME" id="N1002D"><div><font size="4" face="Arial">
				<div style="margin-bottom: 0.4cm;">Dear <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdGreeting"/></div>
				<div style="margin-bottom: 0.4cm; font-size: 12pt; font-weight: bold; text-align: center;">Re: Case Number: <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdClaimNumber"/> <xsl:value-of xmlns="http://eds.com/supsfo" select="variabledata/claim/applicant[./number = 1]/name"/>
				</div>
				<div style="margin-bottom: 0.4cm; font-weight: bold;">
					Your application to set aside a statutory demand.
				</div>
				<div style="margin-bottom: 0.4cm;">
					The court has received your application to set aside a statutory demand.
				</div>
				<div style="margin-bottom: 0.4cm;">
					Your application will not be given a hearing date immediately. It will first be referred to a District Judge. If the judge considers that your application shows no cause for setting the demand aside, your application may be dismissed. If this happens you and the judgment creditor will be told.
				</div>
				<div style="margin-bottom: 0.8cm;">
					If the district judge does not dismiss your application on this first consideration, you and the judgment creditor will be sent a time and date when the application will be reconsidered.
				</div>
				<div style="margin-bottom: 1.5cm;"><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdLetterEnding"/>,</div>
				<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdName"/></div>
				<div><xsl:value-of xmlns="http://eds.com/supsfo" select="$vdSection"/> Section</div>
				<div>Ext <xsl:value-of xmlns="http://eds.com/supsfo" select="$vdExtension"/></div>
				</font></div></div></editableSections></xsl:template><xsl:template name="pagesequence"><xsl:param name="addressee"/></xsl:template></xsl:stylesheet>