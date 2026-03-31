WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF


/*-------------------------------------------------------------------------------
|
| FILENAME      : ddl_trac_178.sql
|
| SYNOPSIS      : SQL script to remove Materialized Views (MV)
|                 MV_CMAN_PARTIES and MV_CMAN_PARTY_ADDRESSES.
|                 Plus, creates MV MV_QBP_CASE
|                 and Views V_CMAN_PARTIES and V_CMAN_PARTY_ADDRESSES.
|
| $Author: barisa $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2008 Logica plc.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : MV_QBP_CASE is built as soon as it is compiled on the target schema.
|                 Therefore, script must be applied outside business operation hours.
|                 i.e. During the Maintenance/Batch window.
|
|---------------------------------------------------------------------------------
|
| $Rev: 1492 $:          Revision of last commit
| $Date: 2009-01-28 19:01:16 +0000 (Wed, 28 Jan 2009) $:         Date of last commit
| $Id: ddl_trac_178.sql 1492 2009-01-28 19:01:16Z barisa $         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL ddl_trac_178.log

ALTER SESSION ENABLE PARALLEL DDL;


PROMPT ************************************************************************
PROMPT Drop MV_CMAN_PARTIES
PROMPT ************************************************************************

DROP MATERIALIZED VIEW MV_CMAN_PARTIES;

PROMPT ************************************************************************
PROMPT Dropped MV_CMAN_PARTIES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Drop MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

DROP MATERIALIZED VIEW MV_CMAN_PARTY_ADDRESSES;

PROMPT ************************************************************************
PROMPT Dropped MV_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************



PROMPT ************************************************************************
PROMPT Drop MV_QBP_CASE if it already exists
PROMPT ************************************************************************
DECLARE

    v_mv_exists VARCHAR2(1) := 'N';

BEGIN

    -- Check MV exists before dropping to suppress DROP MV exception
    SELECT  'Y'
    INTO    v_mv_exists
    FROM    user_mviews
    WHERE   mview_name = 'MV_QBP_CASE';

    IF v_mv_exists = 'Y' THEN
        EXECUTE IMMEDIATE 'DROP MATERIALIZED VIEW mv_qbp_case';
    END IF;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        NULL; -- mv does not exist
    WHEN OTHERS THEN
        RAISE;
END;
/

PROMPT ************************************************************************
PROMPT Dropped MV_QBP_CASE if present
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Create MV_QBP_CASE
PROMPT ************************************************************************
CREATE MATERIALIZED VIEW mv_qbp_case
NOLOGGING
PARALLEL 15
PARTITION BY LIST(admin_crt_code)
    (PARTITION mv_qc_prt_admin_court_101 VALUES(101)
    ,PARTITION mv_qc_prt_admin_court_102 VALUES(102)
    ,PARTITION mv_qc_prt_admin_court_103 VALUES(103)
    ,PARTITION mv_qc_prt_admin_court_104 VALUES(104)
    ,PARTITION mv_qc_prt_admin_court_106 VALUES(106)
    ,PARTITION mv_qc_prt_admin_court_111 VALUES(111)
    ,PARTITION mv_qc_prt_admin_court_112 VALUES(112)
    ,PARTITION mv_qc_prt_admin_court_113 VALUES(113)
    ,PARTITION mv_qc_prt_admin_court_114 VALUES(114)
    ,PARTITION mv_qc_prt_admin_court_117 VALUES(117)
    ,PARTITION mv_qc_prt_admin_court_118 VALUES(118)
    ,PARTITION mv_qc_prt_admin_court_119 VALUES(119)
    ,PARTITION mv_qc_prt_admin_court_120 VALUES(120)
    ,PARTITION mv_qc_prt_admin_court_122 VALUES(122)
    ,PARTITION mv_qc_prt_admin_court_123 VALUES(123)
    ,PARTITION mv_qc_prt_admin_court_124 VALUES(124)
    ,PARTITION mv_qc_prt_admin_court_126 VALUES(126)
    ,PARTITION mv_qc_prt_admin_court_127 VALUES(127)
    ,PARTITION mv_qc_prt_admin_court_128 VALUES(128)
    ,PARTITION mv_qc_prt_admin_court_130 VALUES(130)
    ,PARTITION mv_qc_prt_admin_court_131 VALUES(131)
    ,PARTITION mv_qc_prt_admin_court_132 VALUES(132)
    ,PARTITION mv_qc_prt_admin_court_136 VALUES(136)
    ,PARTITION mv_qc_prt_admin_court_137 VALUES(137)
    ,PARTITION mv_qc_prt_admin_court_138 VALUES(138)
    ,PARTITION mv_qc_prt_admin_court_139 VALUES(139)
    ,PARTITION mv_qc_prt_admin_court_140 VALUES(140)
    ,PARTITION mv_qc_prt_admin_court_141 VALUES(141)
    ,PARTITION mv_qc_prt_admin_court_143 VALUES(143)
    ,PARTITION mv_qc_prt_admin_court_144 VALUES(144)
    ,PARTITION mv_qc_prt_admin_court_146 VALUES(146)
    ,PARTITION mv_qc_prt_admin_court_150 VALUES(150)
    ,PARTITION mv_qc_prt_admin_court_151 VALUES(151)
    ,PARTITION mv_qc_prt_admin_court_152 VALUES(152)
    ,PARTITION mv_qc_prt_admin_court_153 VALUES(153)
    ,PARTITION mv_qc_prt_admin_court_154 VALUES(154)
    ,PARTITION mv_qc_prt_admin_court_155 VALUES(155)
    ,PARTITION mv_qc_prt_admin_court_156 VALUES(156)
    ,PARTITION mv_qc_prt_admin_court_157 VALUES(157)
    ,PARTITION mv_qc_prt_admin_court_158 VALUES(158)
    ,PARTITION mv_qc_prt_admin_court_159 VALUES(159)
    ,PARTITION mv_qc_prt_admin_court_162 VALUES(162)
    ,PARTITION mv_qc_prt_admin_court_163 VALUES(163)
    ,PARTITION mv_qc_prt_admin_court_164 VALUES(164)
    ,PARTITION mv_qc_prt_admin_court_165 VALUES(165)
    ,PARTITION mv_qc_prt_admin_court_166 VALUES(166)
    ,PARTITION mv_qc_prt_admin_court_167 VALUES(167)
    ,PARTITION mv_qc_prt_admin_court_168 VALUES(168)
    ,PARTITION mv_qc_prt_admin_court_170 VALUES(170)
    ,PARTITION mv_qc_prt_admin_court_171 VALUES(171)
    ,PARTITION mv_qc_prt_admin_court_172 VALUES(172)
    ,PARTITION mv_qc_prt_admin_court_174 VALUES(174)
    ,PARTITION mv_qc_prt_admin_court_176 VALUES(176)
    ,PARTITION mv_qc_prt_admin_court_177 VALUES(177)
    ,PARTITION mv_qc_prt_admin_court_178 VALUES(178)
    ,PARTITION mv_qc_prt_admin_court_180 VALUES(180)
    ,PARTITION mv_qc_prt_admin_court_181 VALUES(181)
    ,PARTITION mv_qc_prt_admin_court_182 VALUES(182)
    ,PARTITION mv_qc_prt_admin_court_183 VALUES(183)
    ,PARTITION mv_qc_prt_admin_court_184 VALUES(184)
    ,PARTITION mv_qc_prt_admin_court_185 VALUES(185)
    ,PARTITION mv_qc_prt_admin_court_186 VALUES(186)
    ,PARTITION mv_qc_prt_admin_court_187 VALUES(187)
    ,PARTITION mv_qc_prt_admin_court_189 VALUES(189)
    ,PARTITION mv_qc_prt_admin_court_190 VALUES(190)
    ,PARTITION mv_qc_prt_admin_court_191 VALUES(191)
    ,PARTITION mv_qc_prt_admin_court_194 VALUES(194)
    ,PARTITION mv_qc_prt_admin_court_196 VALUES(196)
    ,PARTITION mv_qc_prt_admin_court_197 VALUES(197)
    ,PARTITION mv_qc_prt_admin_court_198 VALUES(198)
    ,PARTITION mv_qc_prt_admin_court_202 VALUES(202)
    ,PARTITION mv_qc_prt_admin_court_203 VALUES(203)
    ,PARTITION mv_qc_prt_admin_court_205 VALUES(205)
    ,PARTITION mv_qc_prt_admin_court_208 VALUES(208)
    ,PARTITION mv_qc_prt_admin_court_211 VALUES(211)
    ,PARTITION mv_qc_prt_admin_court_212 VALUES(212)
    ,PARTITION mv_qc_prt_admin_court_213 VALUES(213)
    ,PARTITION mv_qc_prt_admin_court_214 VALUES(214)
    ,PARTITION mv_qc_prt_admin_court_215 VALUES(215)
    ,PARTITION mv_qc_prt_admin_court_216 VALUES(216)
    ,PARTITION mv_qc_prt_admin_court_217 VALUES(217)
    ,PARTITION mv_qc_prt_admin_court_218 VALUES(218)
    ,PARTITION mv_qc_prt_admin_court_220 VALUES(220)
    ,PARTITION mv_qc_prt_admin_court_221 VALUES(221)
    ,PARTITION mv_qc_prt_admin_court_223 VALUES(223)
    ,PARTITION mv_qc_prt_admin_court_225 VALUES(225)
    ,PARTITION mv_qc_prt_admin_court_227 VALUES(227)
    ,PARTITION mv_qc_prt_admin_court_228 VALUES(228)
    ,PARTITION mv_qc_prt_admin_court_229 VALUES(229)
    ,PARTITION mv_qc_prt_admin_court_231 VALUES(231)
    ,PARTITION mv_qc_prt_admin_court_233 VALUES(233)
    ,PARTITION mv_qc_prt_admin_court_234 VALUES(234)
    ,PARTITION mv_qc_prt_admin_court_235 VALUES(235)
    ,PARTITION mv_qc_prt_admin_court_236 VALUES(236)
    ,PARTITION mv_qc_prt_admin_court_237 VALUES(237)
    ,PARTITION mv_qc_prt_admin_court_238 VALUES(238)
    ,PARTITION mv_qc_prt_admin_court_239 VALUES(239)
    ,PARTITION mv_qc_prt_admin_court_240 VALUES(240)
    ,PARTITION mv_qc_prt_admin_court_241 VALUES(241)
    ,PARTITION mv_qc_prt_admin_court_242 VALUES(242)
    ,PARTITION mv_qc_prt_admin_court_243 VALUES(243)
    ,PARTITION mv_qc_prt_admin_court_244 VALUES(244)
    ,PARTITION mv_qc_prt_admin_court_245 VALUES(245)
    ,PARTITION mv_qc_prt_admin_court_247 VALUES(247)
    ,PARTITION mv_qc_prt_admin_court_249 VALUES(249)
    ,PARTITION mv_qc_prt_admin_court_251 VALUES(251)
    ,PARTITION mv_qc_prt_admin_court_253 VALUES(253)
    ,PARTITION mv_qc_prt_admin_court_254 VALUES(254)
    ,PARTITION mv_qc_prt_admin_court_256 VALUES(256)
    ,PARTITION mv_qc_prt_admin_court_257 VALUES(257)
    ,PARTITION mv_qc_prt_admin_court_258 VALUES(258)
    ,PARTITION mv_qc_prt_admin_court_260 VALUES(260)
    ,PARTITION mv_qc_prt_admin_court_261 VALUES(261)
    ,PARTITION mv_qc_prt_admin_court_262 VALUES(262)
    ,PARTITION mv_qc_prt_admin_court_263 VALUES(263)
    ,PARTITION mv_qc_prt_admin_court_266 VALUES(266)
    ,PARTITION mv_qc_prt_admin_court_267 VALUES(267)
    ,PARTITION mv_qc_prt_admin_court_268 VALUES(268)
    ,PARTITION mv_qc_prt_admin_court_269 VALUES(269)
    ,PARTITION mv_qc_prt_admin_court_270 VALUES(270)
    ,PARTITION mv_qc_prt_admin_court_271 VALUES(271)
    ,PARTITION mv_qc_prt_admin_court_273 VALUES(273)
    ,PARTITION mv_qc_prt_admin_court_274 VALUES(274)
    ,PARTITION mv_qc_prt_admin_court_275 VALUES(275)
    ,PARTITION mv_qc_prt_admin_court_276 VALUES(276)
    ,PARTITION mv_qc_prt_admin_court_277 VALUES(277)
    ,PARTITION mv_qc_prt_admin_court_278 VALUES(278)
    ,PARTITION mv_qc_prt_admin_court_279 VALUES(279)
    ,PARTITION mv_qc_prt_admin_court_280 VALUES(280)
    ,PARTITION mv_qc_prt_admin_court_282 VALUES(282)
    ,PARTITION mv_qc_prt_admin_court_283 VALUES(283)
    ,PARTITION mv_qc_prt_admin_court_284 VALUES(284)
    ,PARTITION mv_qc_prt_admin_court_285 VALUES(285)
    ,PARTITION mv_qc_prt_admin_court_286 VALUES(286)
    ,PARTITION mv_qc_prt_admin_court_287 VALUES(287)
    ,PARTITION mv_qc_prt_admin_court_288 VALUES(288)
    ,PARTITION mv_qc_prt_admin_court_289 VALUES(289)
    ,PARTITION mv_qc_prt_admin_court_291 VALUES(291)
    ,PARTITION mv_qc_prt_admin_court_292 VALUES(292)
    ,PARTITION mv_qc_prt_admin_court_293 VALUES(293)
    ,PARTITION mv_qc_prt_admin_court_294 VALUES(294)
    ,PARTITION mv_qc_prt_admin_court_296 VALUES(296)
    ,PARTITION mv_qc_prt_admin_court_297 VALUES(297)
    ,PARTITION mv_qc_prt_admin_court_298 VALUES(298)
    ,PARTITION mv_qc_prt_admin_court_299 VALUES(299)
    ,PARTITION mv_qc_prt_admin_court_300 VALUES(300)
    ,PARTITION mv_qc_prt_admin_court_302 VALUES(302)
    ,PARTITION mv_qc_prt_admin_court_303 VALUES(303)
    ,PARTITION mv_qc_prt_admin_court_304 VALUES(304)
    ,PARTITION mv_qc_prt_admin_court_305 VALUES(305)
    ,PARTITION mv_qc_prt_admin_court_306 VALUES(306)
    ,PARTITION mv_qc_prt_admin_court_307 VALUES(307)
    ,PARTITION mv_qc_prt_admin_court_308 VALUES(308)
    ,PARTITION mv_qc_prt_admin_court_310 VALUES(310)
    ,PARTITION mv_qc_prt_admin_court_311 VALUES(311)
    ,PARTITION mv_qc_prt_admin_court_312 VALUES(312)
    ,PARTITION mv_qc_prt_admin_court_313 VALUES(313)
    ,PARTITION mv_qc_prt_admin_court_315 VALUES(315)
    ,PARTITION mv_qc_prt_admin_court_316 VALUES(316)
    ,PARTITION mv_qc_prt_admin_court_317 VALUES(317)
    ,PARTITION mv_qc_prt_admin_court_318 VALUES(318)
    ,PARTITION mv_qc_prt_admin_court_319 VALUES(319)
    ,PARTITION mv_qc_prt_admin_court_320 VALUES(320)
    ,PARTITION mv_qc_prt_admin_court_321 VALUES(321)
    ,PARTITION mv_qc_prt_admin_court_322 VALUES(322)
    ,PARTITION mv_qc_prt_admin_court_324 VALUES(324)
    ,PARTITION mv_qc_prt_admin_court_325 VALUES(325)
    ,PARTITION mv_qc_prt_admin_court_327 VALUES(327)
    ,PARTITION mv_qc_prt_admin_court_328 VALUES(328)
    ,PARTITION mv_qc_prt_admin_court_329 VALUES(329)
    ,PARTITION mv_qc_prt_admin_court_330 VALUES(330)
    ,PARTITION mv_qc_prt_admin_court_331 VALUES(331)
    ,PARTITION mv_qc_prt_admin_court_333 VALUES(333)
    ,PARTITION mv_qc_prt_admin_court_334 VALUES(334)
    ,PARTITION mv_qc_prt_admin_court_336 VALUES(336)
    ,PARTITION mv_qc_prt_admin_court_338 VALUES(338)
    ,PARTITION mv_qc_prt_admin_court_339 VALUES(339)
    ,PARTITION mv_qc_prt_admin_court_340 VALUES(340)
    ,PARTITION mv_qc_prt_admin_court_343 VALUES(343)
    ,PARTITION mv_qc_prt_admin_court_344 VALUES(344)
    ,PARTITION mv_qc_prt_admin_court_345 VALUES(345)
    ,PARTITION mv_qc_prt_admin_court_346 VALUES(346)
    ,PARTITION mv_qc_prt_admin_court_347 VALUES(347)
    ,PARTITION mv_qc_prt_admin_court_348 VALUES(348)
    ,PARTITION mv_qc_prt_admin_court_352 VALUES(352)
    ,PARTITION mv_qc_prt_admin_court_353 VALUES(353)
    ,PARTITION mv_qc_prt_admin_court_354 VALUES(354)
    ,PARTITION mv_qc_prt_admin_court_355 VALUES(355)
    ,PARTITION mv_qc_prt_admin_court_356 VALUES(356)
    ,PARTITION mv_qc_prt_admin_court_357 VALUES(357)
    ,PARTITION mv_qc_prt_admin_court_358 VALUES(358)
    ,PARTITION mv_qc_prt_admin_court_359 VALUES(359)
    ,PARTITION mv_qc_prt_admin_court_360 VALUES(360)
    ,PARTITION mv_qc_prt_admin_court_361 VALUES(361)
    ,PARTITION mv_qc_prt_admin_court_362 VALUES(362)
    ,PARTITION mv_qc_prt_admin_court_363 VALUES(363)
    ,PARTITION mv_qc_prt_admin_court_364 VALUES(364)
    ,PARTITION mv_qc_prt_admin_court_366 VALUES(366)
    ,PARTITION mv_qc_prt_admin_court_368 VALUES(368)
    ,PARTITION mv_qc_prt_admin_court_370 VALUES(370)
    ,PARTITION mv_qc_prt_admin_court_371 VALUES(371)
    ,PARTITION mv_qc_prt_admin_court_372 VALUES(372)
    ,PARTITION mv_qc_prt_admin_court_373 VALUES(373)
    ,PARTITION mv_qc_prt_admin_court_374 VALUES(374)
    ,PARTITION mv_qc_prt_admin_court_375 VALUES(375)
    ,PARTITION mv_qc_prt_admin_court_376 VALUES(376)
    ,PARTITION mv_qc_prt_admin_court_378 VALUES(378)
    ,PARTITION mv_qc_prt_admin_court_379 VALUES(379)
    ,PARTITION mv_qc_prt_admin_court_380 VALUES(380)
    ,PARTITION mv_qc_prt_admin_court_382 VALUES(382)
    ,PARTITION mv_qc_prt_admin_court_383 VALUES(383)
    ,PARTITION mv_qc_prt_admin_court_384 VALUES(384)
    ,PARTITION mv_qc_prt_admin_court_385 VALUES(385)
    ,PARTITION mv_qc_prt_admin_court_386 VALUES(386)
    ,PARTITION mv_qc_prt_admin_court_387 VALUES(387)
    ,PARTITION mv_qc_prt_admin_court_388 VALUES(388)
    )
BUILD IMMEDIATE
AS
SELECT  null                        code
       ,cpr.case_number             case_number
       ,ga.address_line1            address_line1
       ,ga.address_line2            address_line2
       ,p.person_requested_name     person_requested_name
       ,pr.party_role_description   party_role_description
       ,cpr.party_role_code         party_role_code
       ,c.admin_crt_code            admin_crt_code
       ,c.insolvency_number
FROM    case_party_roles cpr
       ,given_addresses ga
       ,parties p
       ,party_roles pr
       ,cases c
WHERE   c.admin_crt_code != 335
  AND   pr.party_role_code = cpr.party_role_code
  AND   p.party_id = cpr.party_id
  AND   c.case_number = cpr.case_number
  AND   ga.case_number = cpr.case_number
  AND   ga.party_role_code = cpr.party_role_code
  AND   ga.case_party_no = cpr.case_party_no
  AND   ga.valid_to IS NULL
  AND  (cpr.party_role_code != 'SOLICITOR'
        OR EXISTS
         (
            SELECT NULL
            FROM   cpr_to_cpr_relationship cpr2cprb
            WHERE  cpr2cprb.cpr_b_case_number = cpr.case_number
              AND  cpr2cprb.cpr_b_party_role_code = cpr.party_role_code
              AND  cpr2cprb.cpr_b_case_party_no   = cpr.case_party_no
              AND  cpr2cprb.deleted_flag          = 'N'
         )
       )
UNION ALL
SELECT   cp.code                    code
        ,cpr.case_number            case_number
        ,cp.address_line1           address_line1
        ,cp.address_line2           address_line2
        ,cp.person_requested_name   person_requested_name
        ,pr.party_role_description  party_role_description
        ,cpr.party_role_code        party_role_code
        ,c.admin_crt_code           admin_crt_code
        ,c.insolvency_number
FROM     coded_parties cp
        ,case_party_roles cpr
        ,party_roles pr
        ,cases c
WHERE    c.admin_crt_code != 335
  AND    pr.party_role_code = cpr.party_role_code
  AND    c.case_number  = cpr.case_number
  AND    cp.party_id    = cpr.party_id
  AND   (cpr.party_role_code != 'SOLICITOR'
         OR EXISTS
           (
            SELECT  NULL
            FROM    cpr_to_cpr_relationship cpr2cprb
            WHERE   cpr2cprb.cpr_b_case_number     = cpr.case_number
              AND   cpr2cprb.cpr_b_party_role_code = cpr.party_role_code
              AND   cpr2cprb.cpr_b_case_party_no   = cpr.case_party_no
              AND   cpr2cprb.deleted_flag          = 'N'
           )
        )
ORDER BY 2,6,5,1,3,4;

PROMPT ************************************************************************
PROMPT Created MV_QBP_CASE
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Create V_CMAN_PARTIES
PROMPT ************************************************************************

CREATE VIEW v_cman_parties
AS
SELECT   c.admin_crt_code admin_crt_code
        ,cpr.case_number case_number
        ,p.party_id AS party_id
        ,cpr.party_role_code AS party_role_code
        ,cpr.case_party_no AS case_party_no
        ,ncp.code coded_party_no
        ,p.person_requested_name AS person_requested_name
        ,p.tel_no tel_no
        ,p.dx_number dx_number
        ,cpr.reference reference
        ,cpr.deft_date_of_service_ro    date_of_service_ro
        ,cpr.deft_date_of_service       date_of_service
        ,cpr.payee_flag payee_flag
        ,DECODE (pr.reporting_role_code
                ,'OTHER', cpr.party_role_code
                ,pr.reporting_role_code
                )                       reporting_party_role_code
FROM     parties p
        ,cases c
        ,case_party_roles cpr
        ,coded_parties ncp
        ,party_roles pr
WHERE    c.admin_crt_code != 335
  AND    c.case_number = cpr.case_number
  AND    cpr.party_id = p.party_id
  AND    cpr.party_role_code = pr.party_role_code
  AND    cpr.party_id = ncp.party_id(+)
ORDER BY 1,2,3,4;

PROMPT ************************************************************************
PROMPT Created V_CMAN_PARTIES
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Create V_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************

CREATE VIEW v_cman_party_addresses
AS
SELECT  c.admin_crt_code admin_crt_code
       ,c.case_number case_number
       ,cpr.case_party_no case_party_no
       ,cpr.party_id party_id
       ,ga.address_line1 address_line1
       ,ga.address_line2 address_line2
       ,ga.address_line3 address_line3
       ,ga.address_line4 address_line4
       ,ga.address_line5 address_line5
       ,ga.postcode postcode
       ,ga.address_type_code address_type_code
       ,cpr.party_role_code party_role_code
FROM    cases c
       ,given_addresses ga
       ,case_party_roles cpr
WHERE   c.admin_crt_code != '335'
  AND   cpr.case_number = c.case_number
  AND   ga.valid_to IS NULL
  AND  (
        (DECODE (ga.address_type_code
                 ,'CODED PARTY', 'CODED PARTY'
                 ,ga.address_type_code
                 ) = 'CODED PARTY'
        AND ga.party_id = cpr.party_id
        )
   OR  (cpr.case_number = ga.case_number
        AND cpr.case_party_no = ga.case_party_no
        AND cpr.party_role_code = ga.party_role_code
        )
       )
ORDER BY 1,2;

PROMPT ************************************************************************
PROMPT Created V_CMAN_PARTY_ADDRESSES
PROMPT ************************************************************************


PROMPT ************************************************************************
PROMPT Enable Logging On MV_QBP_CASE
PROMPT ************************************************************************

ALTER MATERIALIZED VIEW mv_qbp_case LOGGING PARALLEL;


PROMPT ************************************************************************
PROMPT gathering stats ON MV_QBP_CASE table and partitions
PROMPT ************************************************************************

BEGIN

    dbms_stats.gather_table_stats(ownname => USER
                                 ,tabname => 'MV_QBP_CASE'
                                 ,granularity => 'PARTITION'
                                 ,degree => 15
                                 ,estimate_percent => 20
                                 );

EXCEPTION
    WHEN OTHERS THEN
        RAISE;
END;
/

PROMPT ************************************************************************
PROMPT Stats gathered ON MV_QBP_CASE table and partitions
PROMPT ************************************************************************



