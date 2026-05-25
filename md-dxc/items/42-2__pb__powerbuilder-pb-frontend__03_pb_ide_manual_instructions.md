# LCD PB GUI — Manual Implementation Instructions for PowerBuilder 2021 IDE

> **Task**: 42-2 PB GUI Frontend
> **Date**: May 24, 2026
> **Author**: RdW (Cascade-assisted)
> **IDE**: Appeon PowerBuilder 2021 (Build 1854 or later)
> **Reference**: [PB 2021 Users Guide — Writing Scripts](https://docs.appeon.com/pb2021/pbug/ug84079.html)

---

## Section 1: Agent-Applied Changes — Manual Replication in PB IDE

The Cascade agent applied text-level patches to UTF-16 LE source files in the `patched/` folder. Because PowerBuilder PBLs are binary library files, these text patches **must be manually applied** in the PowerBuilder IDE to produce a deployable PBL. This section provides step-by-step instructions for each change.

---

### Change 1: PB-01 — Remove Upper() from Password Comparison (w_reconnect.srw)

**PBL**: `SHARED.PBL`
**Object**: `w_reconnect` (Window)
**Risk**: HIGH — Reconnection will fail on Oracle 19c without this fix

#### Steps:

1. **Open the PBL**
   - In PB IDE, go to **File > Open** or use the Library painter
   - Navigate to and open `SHARED.PBL`

2. **Open the Window Object**
   - In the Library painter or System Tree, double-click `w_reconnect`
   - The Window painter opens

3. **Edit the `cb_ok` Clicked Event**
   - In the Window painter, right-click the **OK** button (`cb_ok`)
   - Select **Script...** (or double-click the button)
   - The Script painter opens at the **Clicked** event
   - If not already on the Clicked event, select it from the event dropdown at the top

4. **Make Change #1** — First password comparison
   - Use **Edit > Find** (Ctrl+F) to search for: `upper(sqlca.dbpass) and ii_repeat`
   - You should find the line:
     ```
     IF is_passwd <> upper(sqlca.dbpass) and ii_repeat = 0 THEN
     ```
   - **Add a comment line above it**:
     ```
     // RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration - PB-01 Remove Upper() for case-sensitive passwords
     ```
   - **Replace** `upper(sqlca.dbpass)` with `sqlca.dbpass` so it reads:
     ```
     IF is_passwd <> sqlca.dbpass and ii_repeat = 0 THEN
     ```

5. **Make Change #2** — Second password comparison
   - Search for the next occurrence: `upper(sqlca.dbpass) THEN`
   - You should find:
     ```
     IF is_passwd <> upper(sqlca.dbpass) THEN
     ```
   - **Add the same comment above** and change to:
     ```
     IF is_passwd <> sqlca.dbpass THEN
     ```

6. **Edit the `sle_password` Modified Event**
   - In the Window painter, click on the password text field (`sle_password`)
   - Right-click → **Script...**
   - Select the **Modified** event from the dropdown
   - Find the line:
     ```
     is_passwd = Upper(Trim(this.text))
     ```
   - **Add a comment above**:
     ```
     // RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration - PB-01 Preserve password case for Oracle 19c
     ```
   - **Replace** with:
     ```
     is_passwd = Trim(this.text)
     ```

7. **Save and Compile**
   - Press **Ctrl+S** to save
   - Right-click the PBL in the System Tree → **Build > Incremental Build**
   - Verify **0 errors** in the Output window

---

### Change 2: PB-04 — Add LISTAGG Overflow Handling (d_user_roles_orgs.srd)

**PBL**: `LCD7.PBL`
**Object**: `d_user_roles_orgs` (DataWindow)
**Risk**: MEDIUM — Report will crash with ORA-01489 if org list exceeds 4000 chars

#### Steps:

1. **Open the DataWindow**
   - In the Library painter, open `LCD7.PBL`
   - Double-click `d_user_roles_orgs` to open it in the DataWindow painter

2. **Open the SQL Data Source**
   - From the menu: **Design > Data Source**
   - Or: Right-click in the DataWindow design area → **Data Source...**
   - The SQL Select painter opens showing the graphical query

3. **Switch to SQL Syntax View**
   - Click the **Syntax** tab (or **SQL** button in the toolbar)
   - You'll see the raw SQL SELECT statement

4. **Make the Change**
   - Find the text:
     ```sql
     listagg(LCD.APPL_USER.ORG_CODE,', ')
     ```
   - Replace with:
     ```sql
     listagg(LCD.APPL_USER.ORG_CODE,', ' ON OVERFLOW TRUNCATE '...' WITHOUT COUNT)
     ```

5. **Verify Syntax**
   - Click **Verify Syntax** button (or **Design > Verify Syntax**)
   - If connected to Oracle 19c: Should show "Syntax is valid"
   - If connected to Oracle 11g: May show error (ON OVERFLOW is 12c R2+ syntax) — this is expected

6. **Save**
   - **Return** to the DataWindow painter and save (**Ctrl+S**)

> **Note**: If you cannot edit the SQL directly in the graphical query builder, switch to the **Source** editor:
> - Right-click the DataWindow in the Library painter → **Edit Source...**
> - Find the `retrieve="SELECT ...` section and make the same change
> - Save and close the source editor

---

### Change 3: PB-09 — Add ORA-28001/28002 Error Handlers (w_login.srw)

**PBL**: `LCD7.PBL`
**Object**: `w_login` (Window)
**Risk**: MEDIUM — Users with expired Oracle passwords get unhelpful error messages

#### Steps:

1. **Open the Window**
   - In the Library painter, open `LCD7.PBL`
   - Double-click `w_login` to open in the Window painter

2. **Open the `cb_ok` Clicked Event**
   - Right-click the **OK** button → **Script...**
   - Select **Clicked** event

3. **Locate the Error Handling Block**
   - Search for: `SQLDBCode = 28000`
   - You should find:
     ```powerscript
     ELSEIF SQLCA.SQLDBCode = 28000 THEN
         MessageBox ("Database Connect", "You ID is locked ...")
         HALT CLOSE
     ```

4. **Insert New Code After HALT CLOSE**
   - Position your cursor at the end of the `HALT CLOSE` line (after the 28000 block)
   - Press Enter to create new lines
   - Insert the following code **before** the next `ELSEIF` (which checks `FileExists`):

     ```powerscript
     // RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration - PB-09 Handle ORA-28001 password expired
     ELSEIF SQLCA.SQLDBCode = 28001 THEN
         MessageBox ("Database Connect", "Your Oracle password has expired." + &
                                       "~r~nYou will be redirected to the Change Password screen.")
         // 19c_DEBUG PB-09 ORA-28001 password expired for user
         nvo_KeyGlobals.is_Who_Calls = 'LOGIN'
         Open(w_Change_Password)
         RETURN

     // RdW 5/24/2026 Powerbuilder GUI-SS Oracle 19c Migration - PB-09 Handle ORA-28002 password will expire
     ELSEIF SQLCA.SQLDBCode = 28002 THEN
         MessageBox ("Database Connect", "Warning: Your Oracle password will expire soon." + &
                                       "~r~nPlease change your password at your earliest convenience." + &
                                       "~r~n" + SQLCA.SQLErrText)
         // 19c_DEBUG PB-09 ORA-28002 password expiring soon - allow login to continue
     ```

5. **Verify the Control Flow**
   - Ensure the new `ELSEIF` blocks are at the same indentation level as the existing ones
   - Ensure the final `ELSE` or next `ELSEIF` follows correctly
   - The order should be: 1017 → 28000 → **28001** → **28002** → FileExists check → general ELSE

6. **Save and Compile**
   - **Ctrl+S** to save
   - Incremental build of `LCD7.PBL`
   - Verify **0 errors**

---

## Section 2: Changes That Cannot Be Done by Agent (Manual-Only)

The following changes require manual action in the PB IDE or database that cannot be performed by a text-editing agent:

### M-01: Full PBL Rebuild

**Why manual**: The agent can edit source text files but cannot compile PowerBuilder PBLs. A full rebuild must be done in the IDE.

**Steps**:
1. Open the LCD workspace in PB 2021
2. Go to **Run > Full Build** (or right-click target → **Full Build**)
3. Review the Output window for any errors
4. Fix any compilation errors (should be none if changes were applied correctly)
5. Verify all PBLs in the library list are rebuilt

---

### M-02: DataWindow Syntax Verification Against 19c

**Why manual**: The PB IDE validates DataWindow SQL syntax by connecting to the database. The agent cannot establish a live database connection.

**Steps**:
1. Connect PB IDE to the Oracle 19c UAT database:
   - Go to **Tools > Database Painter** (or use the DB Profile)
   - Create/edit an Oracle profile pointing to the 19c PDB (TNS alias)
   - Connect
2. Open each of these DataWindows and verify their SQL syntax:
   - `d_user_roles_orgs` (LISTAGG change)
   - `d_granted_roles` (USER_ROLE_PRIVS access)
   - `d_user_roles` (DBA_ROLE_PRIVS access)
   - `dddw_special_wages` (DBA_ROLE_PRIVS subquery)
3. For each: **Design > Data Source** → **Verify Syntax**
4. Expected: All should pass against 19c

---

### M-03: Test the ORA-28001 Password Expiration Flow

**Why manual**: Requires a live Oracle 19c instance with a test user whose password is expired.

**Steps**:
1. As DBA, create a test profile and user:
   ```sql
   CREATE PROFILE LCD_TEST_EXPIRED LIMIT PASSWORD_LIFE_TIME 1/1440; -- 1 minute
   CREATE USER LCD_TEST_USER IDENTIFIED BY "TestPass1!" PROFILE LCD_TEST_EXPIRED;
   GRANT CREATE SESSION TO LCD_TEST_USER;
   GRANT LCD_DEFAULT TO LCD_TEST_USER;
   ```
2. Wait 2 minutes for the password to expire
3. Launch LCD application
4. Log in as `LCD_TEST_USER` with password `TestPass1!`
5. Expected: MessageBox says "Your Oracle password has expired" and opens Change Password screen
6. Cleanup:
   ```sql
   DROP USER LCD_TEST_USER CASCADE;
   DROP PROFILE LCD_TEST_EXPIRED;
   ```

---

### M-04: Verify Database Link Configuration for Table Copy

**Why manual**: Requires DBA access to verify and recreate database links.

**Steps**:
1. Query current DB links:
   ```sql
   SELECT DB_LINK, HOST, OWNER FROM DBA_DB_LINKS ORDER BY DB_LINK;
   ```
2. Compare against `LCD.SUPPORT_SYSTEMS`:
   ```sql
   SELECT SYSTEM_CODE, SYSTEM_DESC FROM LCD.SUPPORT_SYSTEMS WHERE SYSTEM_TYPE = 'DBLINK';
   ```
3. If links need recreation:
   ```sql
   CREATE DATABASE LINK <link_name> CONNECT TO <user> IDENTIFIED BY "<password>" USING '<tns_alias>';
   ```
4. Update `SUPPORT_SYSTEMS` if link names changed:
   ```sql
   UPDATE LCD.SUPPORT_SYSTEMS SET SYSTEM_DESC = '<new_link_name>'
   WHERE SYSTEM_TYPE = 'DBLINK' AND SYSTEM_CODE = '<environment>';
   COMMIT;
   ```

---

### M-05: PBL Deployment to Server

**Why manual**: Requires file system access to the application deployment server.

**Steps**:
1. After successful full build, locate the compiled PBLs (typically in the target output directory)
2. Create a backup of existing PBLs on the deployment server
3. Copy the new PBLs to replace the old ones
4. Update the LCD.INI file if the database connection string changed:
   ```ini
   [database]
   DBMS=O19 Oracle19c
   ServerName=<19c_tns_alias>
   ```
5. Test launch on the server

---

### M-06: Regression Test of Outer Join DataWindows (PB-03)

**Why manual**: Requires running the full application and exercising each screen that uses `(+)` outer joins.

**Steps**:
1. Connect to Oracle 19c
2. For each module listed in PB-03, open the relevant screens:
   - **DISTRIB7**: Run distribution reconciliation
   - **TBLCOST**: Open Primary Wage Setup, Time Generated Wage Setup
   - **TBLWO**: Open Work Orders, Default WOs, Alternate WOs — trigger error display
   - **TBLADMIN**: Open Org Param, Expense Types, Vendor Groups — trigger error display
   - **REPORTS**: Run Vendor Summary, Subcontractor AP Voucher reports
   - **TIME**: Open Time Transactions — trigger error display
3. Verify each screen loads data without errors
4. Document any ORA- errors encountered

---

## PowerBuilder 2021 IDE Quick Reference

| Task | Menu/Shortcut |
|---|---|
| Open Library | File > Open |
| Open Window painter | Double-click window in Library |
| Open Script painter | Right-click control → Script... |
| Select event | Dropdown at top of Script painter |
| Find in script | Ctrl+F |
| Save | Ctrl+S |
| Full Build | Run > Full Build |
| Incremental Build | Right-click target → Build |
| DataWindow data source | Design > Data Source |
| Verify DW SQL | Design > Verify Syntax (in DW painter) |
| Database Profile | Tools > Database Profile |
| Output window | View > Output |

---

*End of PB IDE manual instructions.*
