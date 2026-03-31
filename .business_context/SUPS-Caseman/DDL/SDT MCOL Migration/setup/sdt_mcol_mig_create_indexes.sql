PROMPT ************************************************************************
PROMPT Create Index CASES_FX3 on Table CASES
PROMPT ************************************************************************

CREATE INDEX cases_fx3 ON cases
    (NVL(cred_code,-1)
    ,admin_crt_code
    );

PROMPT ************************************************************************
PROMPT Index CASES_FX3 on Table CASES created
PROMPT ************************************************************************