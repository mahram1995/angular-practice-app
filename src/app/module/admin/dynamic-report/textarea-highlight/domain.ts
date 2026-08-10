export const LOGICAL_OPERATORS: string[] = [
    // DML
    'SELECT',
    'INSERT',
    'INTO',
    'UPDATE',
    'SET',
    'DELETE',
    'MERGE',

    // Query clauses
    'FROM',
    'WHERE',
    'GROUP BY',
    'HAVING',
    'ORDER BY',
    'OFFSET',
    'FETCH',
    'LIMIT',

    // Conditions
    'AND',
    'OR',
    'NOT',
    'IN',
    'NOT IN',
    'LIKE',
    'NOT LIKE',
    'BETWEEN',
    'NOT BETWEEN',
    'IS',
    'IS NOT',
    'EXISTS',
    'NOT EXISTS',

    // Join
    'JOIN',
    'INNER JOIN',
    'LEFT JOIN',
    'LEFT OUTER JOIN',
    'RIGHT JOIN',
    'RIGHT OUTER JOIN',
    'FULL JOIN',
    'FULL OUTER JOIN',
    'CROSS JOIN',
    'NATURAL JOIN',
    'ON',
    'USING',

    // Set operators
    'UNION',
    'UNION ALL',
    'INTERSECT',
    'MINUS',

    // Subquery / query
    'WITH',
    'AS',
    'ALL',
    'ANY',
    'SOME',
    'DISTINCT',
    'UNIQUE',

    // DDL
    'CREATE',
    'ALTER',
    'DROP',
    'TRUNCATE',
    'RENAME',
    'COMMENT',

    // Database objects
    'TABLE',
    'VIEW',
    'MATERIALIZED VIEW',
    'INDEX',
    'SEQUENCE',
    'SYNONYM',
    'DATABASE',
    'SCHEMA',

    // PL/SQL
    'DECLARE',
    'BEGIN',
    'END',
    'EXCEPTION',
    'IF',
    'THEN',
    'ELSIF',
    'ELSE',
    'LOOP',
    'FOR',
    'WHILE',
    'EXIT',
    'CONTINUE',
    'RETURN',
    'NULL',
    'RAISE',
    'RAISE_APPLICATION_ERROR',

    // Procedure / Function / Package
    'PROCEDURE',
    'FUNCTION',
    'PACKAGE',
    'BODY',
    'TRIGGER',
    'TYPE',

    // CREATE statements
    'OR REPLACE',
    'AUTHID',
    'DEFINER',
    'CURRENT_USER',

    // Transaction
    'COMMIT',
    'ROLLBACK',
    'SAVEPOINT',
    'SET TRANSACTION',

    // Locking
    'FOR UPDATE',
    'FOR UPDATE OF',
    'NOWAIT',
    'WAIT',
    'SKIP LOCKED',

    // Constraints
    'CONSTRAINT',
    'PRIMARY KEY',
    'FOREIGN KEY',
    'REFERENCES',
    'UNIQUE',
    'CHECK',
    'DEFAULT',
    'NOT NULL',

    // ALTER / table options
    'ADD',
    'MODIFY',
    'ENABLE',
    'DISABLE',
    'VALIDATE',
    'NOVALIDATE',
    'CASCADE',
    'PURGE',

    // Data types
    'VARCHAR2',
    'VARCHAR',
    'CHAR',
    'NCHAR',
    'NVARCHAR2',
    'NUMBER',
    'INTEGER',
    'INT',
    'DECIMAL',
    'NUMERIC',
    'FLOAT',
    'BINARY_FLOAT',
    'BINARY_DOUBLE',
    'DATE',
    'TIMESTAMP',
    'TIMESTAMP WITH TIME ZONE',
    'TIMESTAMP WITH LOCAL TIME ZONE',
    'INTERVAL',
    'CLOB',
    'NCLOB',
    'BLOB',
    'RAW',
    'LONG',
    'LONG RAW',
    'ROWID',
    'UROWID',
    'XMLTYPE',
    'JSON',

    // NULL / Boolean
    'TRUE',
    'FALSE',

    // CASE
    'CASE',
    'WHEN',
    'THEN',
    'ELSE',

    // Ordering
    'ASC',
    'DESC',
    'NULLS FIRST',
    'NULLS LAST',

    // Analytic
    'OVER',
    'PARTITION BY',
    'ROWS',
    'RANGE',
    'UNBOUNDED',
    'PRECEDING',
    'FOLLOWING',
    'CURRENT ROW',

    // Pivot
    'PIVOT',
    'UNPIVOT',
    'INCLUDE',
    'EXCLUDE',

    // Hierarchical queries
    'START WITH',
    'CONNECT BY',
    'PRIOR',
    'LEVEL',
    'NOCYCLE',
    'CONNECT_BY_ROOT',

    // Flashback
    'AS OF',
    'VERSIONS BETWEEN',
    'SCN',
    'TIMESTAMP',

    // Privileges
    'GRANT',
    'REVOKE',
    'PRIVILEGES',
    'ROLE',

    // Authorization
    'IDENTIFIED',
    'BY',
    'PASSWORD',
    'ROLE',

    // Miscellaneous SQL
    'COLUMN',
    'COLUMNS',
    'VALUES',
    'VALUE',
    'RETURNING',
    'BULK COLLECT',
    'INTO',
    'USING',
    'MERGE',
    'MATCHED',
    'WHEN MATCHED',
    'WHEN NOT MATCHED',

    // Oracle-specific
    'ROWNUM',
    'ROWID',
    'DUAL',
    'SYSDATE',
    'SYSTIMESTAMP',
    'CURRENT_DATE',
    'CURRENT_TIMESTAMP',

    // PL/SQL cursor
    'CURSOR',
    'OPEN',
    'CLOSE',
    'FETCH',
    'BULK',
    'COLLECT',

    // Exception handling
    'WHEN OTHERS',
    'SQLCODE',
    'SQLERRM',

    // Object types
    'FORCE',
    'EDITIONABLE',
    'NONEDITIONABLE',
    'INVALIDATION',

    // Comments / SQL*Plus
    'REM',
    'PROMPT',
    'SPOOL'
];


export const CONDITIONAL_CLAUSE: string[] = [
    'TRUE',
    'FALSE',

    'GROUP BY',
    'HAVING',
    'ORDER BY',

    'WHERE',
    'AND',
    'OR',
    'NOT',

    'IN',
    'NOT IN',
    'LIKE',
    'NOT LIKE',

    'BETWEEN',
    'NOT BETWEEN',

    'IS NULL',
    'IS NOT NULL',

    'EXISTS',
    'NOT EXISTS',

    'CASE',
    'WHEN',
    'THEN',
    'ELSE',
    'END',

    'IF',
    'ELSIF'
];


export const FUNCTION_NAMES: string[] = [
    // Aggregate
    'AVG',
    'COUNT',
    'MAX',
    'MIN',
    'SUM',
    'LISTAGG',
    'MEDIAN',
    'STATS_MODE',
    'STDDEV',
    'STDDEV_POP',
    'STDDEV_SAMP',
    'VARIANCE',
    'VAR_POP',
    'VAR_SAMP',
    'GROUPING',
    'GROUPING_ID',

    // Numeric
    'ABS',
    'ACOS',
    'ASIN',
    'ATAN',
    'ATAN2',
    'CEIL',
    'CEILING',
    'COS',
    'COSH',
    'EXP',
    'FLOOR',
    'LN',
    'LOG',
    'MOD',
    'POWER',
    'REMAINDER',
    'ROUND',
    'SIGN',
    'SIN',
    'SINH',
    'SQRT',
    'TAN',
    'TANH',
    'TRUNC',

    // Character
    'ASCII',
    'ASCIISTR',
    'CHR',
    'CONCAT',
    'INITCAP',
    'INSTR',
    'INSTRB',
    'LENGTH',
    'LENGTHB',
    'LOWER',
    'LPAD',
    'LTRIM',
    'NCHR',
    'NLS_INITCAP',
    'NLS_LOWER',
    'NLS_UPPER',
    'NLSSORT',
    'REGEXP_COUNT',
    'REGEXP_INSTR',
    'REGEXP_REPLACE',
    'REGEXP_SUBSTR',
    'REPLACE',
    'RPAD',
    'RTRIM',
    'SOUNDEX',
    'SUBSTR',
    'SUBSTRB',
    'TRANSLATE',
    'TRIM',
    'UPPER',

    // Conversion
    'CAST',
    'CONVERT',
    'TO_CHAR',
    'TO_DATE',
    'TO_TIMESTAMP',
    'TO_TIMESTAMP_TZ',
    'TO_CLOB',
    'TO_NCHAR',
    'TO_NCLOB',
    'TO_NUMBER',
    'TO_DSINTERVAL',
    'TO_YMINTERVAL',
    'VALIDATE_CONVERSION',

    // Date / Time
    'ADD_MONTHS',
    'CURRENT_DATE',
    'CURRENT_TIMESTAMP',
    'DBTIMEZONE',
    'EXTRACT',
    'FROM_TZ',
    'LAST_DAY',
    'LOCALTIMESTAMP',
    'MONTHS_BETWEEN',
    'NEXT_DAY',
    'NUMTODSINTERVAL',
    'NUMTOYMINTERVAL',
    'SYSDATE',
    'SYSTIMESTAMP',

    // Null / Conditional
    'COALESCE',
    'DECODE',
    'GREATEST',
    'LEAST',
    'LNNVL',
    'NULLIF',
    'NVL',
    'NVL2',

    // Analytic / Ranking
    'CUME_DIST',
    'DENSE_RANK',
    'FIRST_VALUE',
    'LAG',
    'LAST_VALUE',
    'LEAD',
    'NTH_VALUE',
    'NTILE',
    'PERCENT_RANK',
    'PERCENTILE_CONT',
    'PERCENTILE_DISC',
    'RANK',
    'RATIO_TO_REPORT',
    'ROW_NUMBER',

    // JSON
    'JSON_ARRAY',
    'JSON_ARRAYAGG',
    'JSON_EXISTS',
    'JSON_OBJECT',
    'JSON_OBJECTAGG',
    'JSON_QUERY',
    'JSON_SERIALIZE',
    'JSON_TABLE',
    'JSON_VALUE',

    // XML
    'EXISTSNODE',
    'EXTRACTVALUE',
    'SYS_XMLAGG',
    'SYS_XMLGEN',
    'XMLAGG',
    'XMLCAST',
    'XMLCOLATTVAL',
    'XMLELEMENT',
    'XMLFOREST',
    'XMLPARSE',
    'XMLPI',
    'XMLQUERY',
    'XMLROOT',
    'XMLSERIALIZE',
    'XMLTABLE',

    // System
    'SYS_CONTEXT',
    'SYS_GUID',
    'UID',
    'USER',
    'USERENV',
    'VSIZE',

    // Hash
    'STANDARD_HASH',
    'ORA_HASH',

    // Miscellaneous
    'DUMP',
    'EMPTY_BLOB',
    'EMPTY_CLOB',
    'BFILENAME',
    'HEXTORAW',
    'RAWTOHEX',
    'RAWTONHEX'
];