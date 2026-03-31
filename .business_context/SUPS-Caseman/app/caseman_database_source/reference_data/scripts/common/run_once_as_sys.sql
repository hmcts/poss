create or replace directory caseman_rd_dir
as '/export/home/oracle/casemanrefdata1.2.4';

grant read, write on directory caseman_rd_dir to uct01;

