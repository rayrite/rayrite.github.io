# Oracle 11g to 19c Migration - Issue Findings

## Summary
Comprehensive scan of LCD-Oracle SQL files identifying 11g-specific features for 19c migration.

## Key Issues Found:
1. **UTL_FILE usage** - Widespread across multiple files; needs Directory Objects instead of UTL_FILE_DIR
2. **DBMS_JOB usage** - WOA and NPS scheduler files; must migrate to DBMS_SCHEDULER
3. **LCD_FILE_PARAM & LCD_SERVER_LOC references** - File path management tied to deprecated parameter
4. **CONNECT BY with LEVEL** - Found in multiple extract/feed procedures
5. **File I/O procedures** - Multiple packages with file handling routines

## File Categories
- Main SQL directory: 200+ files scanned
- SQL (CPI) directory: 13 files with extensive UTL_FILE usage
- SQL (UK-I) directory: Files with UTL_FILE and file I/O
- SQL (WOA) directory: DBMS_JOB scheduling issues
- Packages directory: Multiple package directories with file I/O

## Next Steps:
- Compile detailed file listing with specific issues per file
- Identify which files require refactoring vs. simple parameter changes
- Create migration plan for DBMS_JOB to DBMS_SCHEDULER conversion
