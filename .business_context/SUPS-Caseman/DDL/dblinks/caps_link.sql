Prompt Database Link CAPS_LINK;
--
-- CAPS_LINK  (Database Link)
--
CREATE DATABASE LINK caps_link
    CONNECT TO &1
    IDENTIFIED BY &2
    USING '&3';


