# PowerBuilder 2021 & Oracle 19c: A Complete Technical Primer

> A full conversation-based guide covering compatibility, connection testing, SQLCA, and Oracle connection strings in Appeon PowerBuilder 2021.

---

## Table of Contents

1. [PB 2021 Compatibility with Oracle 19c](#1-pb-2021-compatibility-with-oracle-19c)
2. [Setting ORACLE_HOME on Windows Server 2019](#2-setting-oracle_home-on-windows-server-2019)
3. [Testing the Connection After Migrating to Oracle 19c](#3-testing-the-connection-after-migrating-to-oracle-19c)
4. [SQLCA and Oracle Connection Strings: A Full Primer](#4-sqlca-and-oracle-connection-strings-a-full-primer)

---

## 1. PB 2021 Compatibility with Oracle 19c

**Q: Is Appeon PowerBuilder 2021 IDE compatible with Oracle 19c? Are there any changes needed in my code?**

**Yes, PowerBuilder 2021 is compatible with Oracle 19c.** Oracle 19c support was introduced back in PB 2017 R3 (build 1915) and PB 2019 (build 2170), so by the time PB 2021 shipped in August 2021, it was already well-established. Appeon's official database compatibility page confirms native Oracle interface support for Oracle 23ai, 21c, 19c, and 18c via the Oracle Database Client or Oracle Instant Client.

That said, compatibility in principle and a smooth migration in practice are two different things. Here is what you need to know across each layer.

---

### 1.1 Client-Side Setup (The Most Common Tripwire)

Make sure the Oracle 19c Client **32-bit** is installed on your machine, then in the PB IDE go to Database Profiles and use the `ORA Oracle` driver to verify the connection. This is a frequent point of confusion — PowerBuilder (even 2021) is a 32-bit IDE, so it requires the 32-bit Oracle client even if your OS and Oracle server are 64-bit. The `oci.dll` not found error stems from a 32-bit/64-bit mismatch in exactly this way.

Your `PATH` environment variable must resolve to the 32-bit `%ORACLE_HOME%\bin` *before* any 64-bit Oracle home, or the IDE simply won't load the driver.

---

### 1.2 The ORA-28040 Authentication Error

This is the most common runtime issue when migrating from Oracle 11g to 19c. Oracle 19c tightened its default authentication protocol requirements. Older Oracle clients may be rejected with:

```
ORA-28040: No matching authentication protocol
```

You may need your Oracle DBA to change Oracle server settings to allow older Oracle clients to connect. The fix is typically adding or modifying these parameters in your Oracle server's `sqlnet.ora`:

```ini
# On the Oracle 19c SERVER side (sqlnet.ora)
SQLNET.ALLOWED_LOGON_VERSION_SERVER = 8
SQLNET.ALLOWED_LOGON_VERSION_CLIENT = 8
```

This relaxes the protocol requirement so PB can authenticate. Your DBA controls this, not your PB code.

---

### 1.3 New Oracle 19c Data Types — Code Changes May Be Needed

Oracle 19c support in PowerBuilder added handling for the data types `NCLOB`, `NCHAR`, `NVARCHAR2`, `BINARY_DOUBLE`, `BINARY_FLOAT`, `TIMESTAMP`, and `XMLTYPE`. If your Oracle 19c schema uses any of these types, verify that your DataWindows and embedded SQL handle them correctly.

The most common areas to audit in your PowerScript code:

**`TIMESTAMP` columns** — Oracle 19c is stricter about `TIMESTAMP` vs. `DATE`. If columns were `DATE` in 11g but are `TIMESTAMP` in 19c, any PowerScript doing direct string comparisons or assignments against those columns may behave differently. Always use `DateTime` variables in PowerScript for timestamp-type columns.

**`NVARCHAR2` / `NCHAR`** — If your migrated schema introduced Unicode character types, make sure your DataWindow column definitions match. A `CHAR` type mapped to an `NVARCHAR2` column can cause truncation or retrieval issues.

**`XMLTYPE`** — PB can now retrieve this, but it comes back as a string blob. Handle XML columns in PowerScript as `String` and parse accordingly.

---

### 1.4 Database Profile — Verify Your Connection String

Open your Database Profile in the PB 2021 IDE and double-check these fields:

```
DBMS:     ORA
Database: <your_service_name_or_TNS_alias>
ServerName: (blank if using TNS, or host:port/service if using Easy Connect)
```

Oracle 19c introduced **Easy Connect Plus** syntax. If you're not using a `tnsnames.ora` file, the Easy Connect format looks like:

```
//hostname:1521/service_name
```

This is more reliable than the old TNS alias approach for 19c+ and worth switching to if you're refactoring your connection setup anyway.

---

### 1.5 What You Almost Certainly Don't Need to Change

The vast majority of your PowerScript application code — DataWindow expressions, embedded SQL, transaction object usage, `CONNECT`/`DISCONNECT`/`COMMIT`/`ROLLBACK` — requires **no changes** for Oracle 19c compatibility. There is no migration of your PB source code required when moving between compatible builds. The compatibility layer Appeon maintains means your `SQLCA` transaction object and all standard DML operations work as-is.

The work is almost entirely in infrastructure: the Oracle client install, the DBA-side `sqlnet.ora` tweak for ORA-28040, and reviewing any schema-level data type changes made during the 11g → 19c migration.

---

## 2. Setting ORACLE_HOME on Windows Server 2019

**Q: How do I set the `ORACLE_HOME` environment variable on Windows Server 2019 after installing the Oracle 19c client?**

`ORACLE_HOME` is the environment variable that tells the Windows OS — and every application running on it, including PowerBuilder — where the Oracle client software lives on disk. Without it set correctly, `oci.dll` can't be found, `tnsnames.ora` can't be located, and `sqlplus` won't run from an arbitrary command prompt. Getting this right is the foundation everything else in this guide depends on.

---

### 2.1 Understand What You're Setting (and Why Two Variables Matter)

There are actually two environment variables that work together for an Oracle client installation:

`ORACLE_HOME` points to the root directory of your specific Oracle client installation — for example, `C:\Oracle\product\19.0.0\client_1`. This is the variable Oracle tools use to find their own binaries, configuration files, and libraries.

`PATH` needs to include `%ORACLE_HOME%\bin` so that Windows can find executables like `sqlplus.exe`, `tnsping.exe`, and the critical `oci.dll` when any application — including PowerBuilder — asks for them. Setting `ORACLE_HOME` alone is not sufficient; `PATH` must also be updated.

A third variable, `TNS_ADMIN`, is optional but worth knowing about. It tells Oracle where to look for `tnsnames.ora` and `sqlnet.ora`. If it's not set, Oracle falls back to looking in `%ORACLE_HOME%\network\admin`. Setting `TNS_ADMIN` explicitly is useful when your `tnsnames.ora` lives in a shared or non-standard location — for example, a network drive maintained by your DBA team.

---

### 2.2 Method 1: Windows GUI (System Properties) — Recommended for Permanence

This is the standard approach for a server environment. The changes survive reboots and apply system-wide to all users and services.

Navigate to **Control Panel → System → Advanced system settings → Environment Variables**. Alternatively, press `Win + R`, type `sysdm.cpl`, press Enter, then click the **Advanced** tab and then **Environment Variables**.

In the dialog, you'll see two sections: **User variables** (apply only to the currently logged-in account) and **System variables** (apply to all users and services on the machine). For a server running PowerBuilder apps as a service or under multiple accounts, always set these in **System variables**.

To set `ORACLE_HOME`:

1. Click **New** under System variables.
2. Set **Variable name** to `ORACLE_HOME`.
3. Set **Variable value** to the full path of your Oracle 19c client root, for example `C:\Oracle\product\19.0.0\client_1`.
4. Click **OK**.

To update `PATH`:

1. Find `Path` in the System variables list and click **Edit**.
2. Click **New** and add `%ORACLE_HOME%\bin` as a new entry. Using the `%ORACLE_HOME%` reference (rather than the literal path) means if you ever change `ORACLE_HOME`, `PATH` updates automatically.
3. Use the **Move Up** button to position `%ORACLE_HOME%\bin` near the top of the list — this is critical for PowerBuilder, which is 32-bit. If a 64-bit Oracle client's `bin` folder appears earlier in `PATH`, PB will load the wrong `oci.dll` and fail silently or with a cryptic error.
4. Click **OK** through all dialogs.

**Important:** Environment variable changes in the GUI do not take effect for already-running processes. After saving, you must open a **new** Command Prompt to test, and any Windows services (including the one that runs your PB app, if applicable) must be restarted.

---

### 2.3 Method 2: Command Line with `setx` — Useful for Scripting

If you're setting this up via a deployment script, RDP session, or want to automate it across multiple servers, `setx` is the right tool. It writes to the registry permanently, just like the GUI method does.

```cmd
:: Set ORACLE_HOME as a system-wide variable (/M flag = machine-level, not user-level)
setx ORACLE_HOME "C:\Oracle\product\19.0.0\client_1" /M

:: Append %ORACLE_HOME%\bin to the system PATH
:: Note: setx truncates PATH if it exceeds 1024 characters — see the warning below
setx PATH "%ORACLE_HOME%\bin;%PATH%" /M
```

**Critical warning about `setx` and `PATH`:** The `setx` command has a well-known limitation — it truncates the value to 1024 characters. On a server with a long existing `PATH`, this can silently strip entries off the end, breaking other applications. The safer approach for `PATH` specifically is to use the GUI or use PowerShell, which has no such limitation:

```powershell
# PowerShell — safe PATH update with no truncation risk
# Run this in an elevated (Administrator) PowerShell session

$oracleHome = "C:\Oracle\product\19.0.0\client_1"
$oracleBin  = "$oracleHome\bin"

# Set ORACLE_HOME permanently at the machine level
[System.Environment]::SetEnvironmentVariable("ORACLE_HOME", $oracleHome, "Machine")

# Prepend Oracle bin to PATH, avoiding duplicates
$currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "Machine")

if ($currentPath -notlike "*$oracleBin*") {
    $newPath = "$oracleBin;$currentPath"
    [System.Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
    Write-Host "PATH updated successfully."
} else {
    Write-Host "Oracle bin already present in PATH. No change made."
}

# Optionally set TNS_ADMIN if your tnsnames.ora lives outside ORACLE_HOME
# [System.Environment]::SetEnvironmentVariable("TNS_ADMIN", "C:\Oracle\network\admin", "Machine")
```

This PowerShell approach is the most robust option for Windows Server 2019 and is safe to run in a deployment script. Run it in an elevated PowerShell session (right-click → **Run as Administrator**).

---

### 2.4 Verify the Variables Are Set Correctly

After setting the variables and opening a **new** Command Prompt (this is mandatory — existing terminals won't see the changes), run these checks in order:

```cmd
:: Check that ORACLE_HOME is set to what you expect
echo %ORACLE_HOME%
:: Expected output: C:\Oracle\product\19.0.0\client_1

:: Check that Oracle bin is visible in PATH
where sqlplus
:: Expected output: C:\Oracle\product\19.0.0\client_1\bin\sqlplus.exe
:: If you get "Could not find files", PATH is not set correctly.

:: Confirm the 32-bit oci.dll is the one being found
:: (PowerBuilder requires the 32-bit version)
:: Check the file properties to confirm it's 32-bit:
dir "%ORACLE_HOME%\bin\oci.dll"
```

To confirm 32-bit vs. 64-bit on `oci.dll` without a third-party tool, you can check with PowerShell:

```powershell
# A 32-bit DLL will report "PE32" and a 64-bit DLL will report "PE32+"
$bytes = [System.IO.File]::ReadAllBytes("$env:ORACLE_HOME\bin\oci.dll")
$peOffset = [System.BitConverter]::ToInt32($bytes, 0x3C)
$magic = [System.BitConverter]::ToUInt16($bytes, $peOffset + 4)
if ($magic -eq 0x10B) { "32-bit (PE32) — correct for PowerBuilder" }
elseif ($magic -eq 0x20B) { "64-bit (PE32+) — WRONG for PowerBuilder IDE" }
```

If it reports 64-bit, your `ORACLE_HOME` is pointing at a 64-bit Oracle client and you need to either install the 32-bit client or correct `ORACLE_HOME` to point at the 32-bit installation.

---

### 2.5 The `tnsnames.ora` File Location

Once `ORACLE_HOME` is correctly set, Oracle will look for `tnsnames.ora` at:

```
%ORACLE_HOME%\network\admin\tnsnames.ora
```

A minimal `tnsnames.ora` entry for your Oracle 19c server looks like this:

```sql
PROD19C =
  (DESCRIPTION =
    (ADDRESS =
      (PROTOCOL = TCP)
      (HOST = your-oracle-server-hostname-or-ip)
      (PORT = 1521)
    )
    (CONNECT_DATA =
      (SERVER = DEDICATED)
      (SERVICE_NAME = your_service_name)
    )
  )
```

`PROD19C` on the first line is the TNS alias — this is the value you'll use in PowerBuilder's `SQLCA.Database` property and in your `sqlplus` connection test. `SERVICE_NAME` is what your DBA configured when setting up Oracle 19c; it's distinct from the old Oracle SID concept (though SIDs still work for backward compatibility using `(SID = ...)` instead of `SERVICE_NAME`). For Oracle 19c, always prefer `SERVICE_NAME`.

If you set `TNS_ADMIN` to a custom path, place `tnsnames.ora` there instead — Oracle will honor `TNS_ADMIN` over the `ORACLE_HOME\network\admin` default.

---

## 3. Testing the Connection After Migrating to Oracle 19c

**Q: After changing `ORACLE_HOME` and `tnsnames.ora` to point to the new Oracle 19c server, how do I test that the PowerBuilder GUI app is connecting to the new database properly?**

Think about this in layers — there are three distinct levels at which the connection can succeed or fail, and you want to validate each one independently. Think of it like testing a plumbing system: confirm water flows from the main line, then to the faucet, then out of the tap — not just turn on the tap and hope for the best.

---

### Layer 1: Validate the Oracle Client Itself (Outside of PB)

Before PowerBuilder ever enters the picture, confirm that the Oracle 19c client installed on that Windows server can actually reach the new database using `sqlplus`:

```cmd
sqlplus your_username/your_password@your_tns_alias
```

If `tnsnames.ora` is configured correctly and the Oracle client is healthy, you'll land at a `SQL>` prompt. If you get `ORA-12154` (TNS could not resolve the connect identifier), your `tnsnames.ora` entry is wrong or `ORACLE_HOME` isn't pointing to the right place. If you get `ORA-28040`, your DBA needs to adjust `sqlnet.ora` on the server side (see Section 1.2). If `ORACLE_HOME` itself seems to be the issue, see Section 2.

A secondary quick check:

```cmd
tnsping your_tns_alias
```

This tells you whether Oracle can resolve and reach the listener at the target server without actually authenticating. It's a faster sanity check on your `tnsnames.ora` entry specifically.

---

### Layer 2: Test the Connection Inside the PB 2021 IDE

Once the Oracle client checks out, open PowerBuilder 2021 and go to **Tools → Database Painter**. Find the `ORA` profile for your database — or create a new one pointed at the 19c server — and click **Connect**.

If the connection succeeds, you'll see database objects (tables, views, stored procedures) appear in the Database Painter's object browser. This means PB's runtime layer, using the 32-bit `oci.dll`, can authenticate and communicate with the new server.

If it fails here but `sqlplus` worked, the most common culprit is the 32-bit vs. 64-bit `oci.dll` issue. Check that `%ORACLE_HOME%\bin` in your `PATH` resolves to the 32-bit client's folder.

---

### Layer 3: Test Your Application's Transaction Logic at Runtime

Once the IDE connects cleanly, verify that your application's own connection code works — meaning the `Transaction` object (`SQLCA`) connects as expected. Add a small diagnostic routine to a test button or temporarily to your app's `Open` event:

```powerscript
// Connect using the global transaction object SQLCA
CONNECT USING SQLCA;

IF SQLCA.SQLCode = 0 THEN
    // SQLCode of 0 means success — connection is live
    MessageBox("DB Test", "Connected successfully to: " + SQLCA.ServerName)

    // Do a trivial query to confirm data retrieval works,
    // not just authentication
    String ls_test
    SELECT 'PING' INTO :ls_test FROM DUAL USING SQLCA;

    IF SQLCA.SQLCode = 0 THEN
        MessageBox("DB Test", "Query test passed. Oracle is responding.")
    ELSE
        // SQLErrText tells you exactly what Oracle reported
        MessageBox("DB Test", "Query failed: " + SQLCA.SQLErrText)
    END IF

ELSE
    // Connection itself failed — SQLErrText has the ORA- error message
    MessageBox("DB Test", "Connection failed: " + SQLCA.SQLErrText)
END IF
```

The `SELECT 'PING' FROM DUAL` is a classic Oracle trick — `DUAL` is a built-in single-row, single-column dummy table that every Oracle database has. It confirms that Oracle is actually processing SQL and returning results to PB. Pay close attention to `SQLCA.SQLErrText` on any failure — Oracle will tell you exactly what's wrong (`ORA-01017` for bad credentials, `ORA-12514` for unknown service name, etc.).

---

### Layer 4: Spot-Check Your DataWindows Against the Real Schema

Open a few key DataWindows in the DataWindow Painter and run a **Preview** against the live 19c database via **Design → Preview**. What you're watching for is whether any DataWindow SQL breaks due to schema changes — column renames, data type changes (the `DATE` vs. `TIMESTAMP` distinction is a common 11g→19c gotcha), or any Oracle 19c reserved words that conflict with existing column or table names.

---

### Mental Model for Remembering This

Think of these four layers as concentric rings of trust. The Oracle client (`sqlplus`/`tnsping`) is the outermost ring — it proves the network and credentials work. The IDE Database Painter is the next ring — it proves PB's driver layer works. Your `SQLCA` connection code is the third ring — it proves your app's connection logic works. And DataWindow Preview is the innermost ring — it proves your actual business data flows correctly end-to-end.

You only need to debug at the layer where something first breaks.

---

## 4. SQLCA and Oracle Connection Strings: A Full Primer

**Q: Please give me a primer on `SQLCA` and Oracle connection strings from PowerBuilder.**

---

### 4.1 Start With the Mental Model: What Problem Does SQLCA Solve?

PowerBuilder was designed to make database access feel almost invisible. The designers wanted developers to write embedded SQL — a `SELECT` statement right in the middle of PowerScript — without having to explicitly wire up a connection object every single time.

To pull that off, they needed a **globally accessible transaction object** that represents an active database connection and that the PowerScript runtime knows to use by default whenever it encounters embedded SQL. That object is `SQLCA`: the **SQL Communications Area**.

Think of `SQLCA` as a persistent, globally shared "telephone line" to your database. Any code anywhere in your application can pick up that phone and talk to Oracle, without needing to know how the line was set up. Your application's job, during startup, is to configure and connect that line once. After that, everything else just uses it.

---

### 4.2 What Exactly Is SQLCA?

`SQLCA` is a built-in global variable of type `Transaction`. PowerBuilder automatically creates it when your application starts. You don't declare it — it's just *there*.

The `Transaction` object type has properties that fall into two categories. The first is **connection properties** — fields you populate *before* calling `CONNECT`. The second is **status/error properties** — fields PowerBuilder populates *after* every database operation.

```powerscript
// ── CATEGORY 1: CONNECTION PROPERTIES ──────────────────────────────────────
// You set these before calling CONNECT.

SQLCA.DBMS        // The database driver to use.
                  // For Oracle native driver: "ORA"
                  // For ODBC:                 "ODBC"

SQLCA.Database    // The TNS alias from tnsnames.ora (or Easy Connect string).
                  // This is Oracle-specific — SQL Server uses ServerName instead.

SQLCA.ServerName  // Not used for Oracle native (ORA) connections. Leave blank.

SQLCA.LogId       // The Oracle username (schema name) to connect as.

SQLCA.LogPass     // The Oracle password for that user.

SQLCA.DBParm      // A catch-all string for driver-specific parameters.
                  // This is where Oracle-specific tuning options live.

SQLCA.AutoCommit  // Boolean. If TRUE, every DML statement is committed immediately.
                  // If FALSE (the default and best practice), you control
                  // transactions yourself with COMMIT and ROLLBACK.
                  // Leave this FALSE for almost all production work.

// ── CATEGORY 2: STATUS/ERROR PROPERTIES ─────────────────────────────────────
// PowerBuilder populates these after every database operation.

SQLCA.SQLCode     // The most important one. Possible values:
                  //   0  = Success
                  //  100 = No rows found (not an error — just means empty result)
                  //   -1 = Error occurred (check SQLDBCode and SQLErrText)

SQLCA.SQLDBCode   // The database-native error code.
                  // For Oracle, this is the ORA-XXXXX number (without the "ORA-").
                  // e.g., 1017 means ORA-01017: invalid username/password.

SQLCA.SQLErrText  // A human-readable description of the error.
                  // Oracle is very descriptive here — your first stop when
                  // something goes wrong.

SQLCA.SQLNRows    // The number of rows affected by the last DML statement.
                  // Useful after an UPDATE or DELETE to confirm rows were touched.
```

---

### 4.3 The `DBParm` Property: Oracle's Control Panel

`DBParm` is a single string containing a comma-separated list of key-value pairs, each formatted as `KeyName='Value'`. Here are the most important settings for Oracle 19c connections:

```powerscript
// A typical DBParm string for an Oracle 19c connection:
SQLCA.DBParm = "StaticBind=0, DisableBind=0, NcharBind=1"

// StaticBind=0
// Tells PB NOT to statically bind result columns at connect time.
// With Oracle 19c, keep this at 0. Setting it to 1 can cause type mismatch
// errors if Oracle returns unexpected types (common after an 11g → 19c migration).

// DisableBind=0
// Controls whether PB uses bind variables in its SQL (0 = use bind variables).
// Bind variables are a crucial Oracle performance feature — they allow Oracle
// to reuse execution plans. Keep this at 0.

// NcharBind=1
// Important if your 19c schema uses NCHAR, NVARCHAR2, or NCLOB columns.
// Tells PB to use national character set binding for those columns.
// If your DBA introduced Unicode types during migration, set this to 1.

// Other useful DBParm settings:
// CursorUpdate='1'   -- Enables updateable cursors for certain DataWindow types
// PBCatalogOwner=''  -- Specifies the schema owner of PB's system catalog tables
```

---

### 4.4 A Complete Production Connection Block

Here is what a full, production-style connection routine looks like — the kind you'd put in your Application object's `Open` event or in a dedicated `f_db_connect()` global function:

```powerscript
// ── STEP 1: Configure the transaction object ─────────────────────────────────

SQLCA.DBMS       = "ORA"              // Use Oracle native driver (not ODBC)
SQLCA.Database   = "PROD19C"          // TNS alias from tnsnames.ora
SQLCA.LogId      = "APP_SCHEMA"       // Oracle username
SQLCA.LogPass    = ls_password        // Never hardcode — read from encrypted ini
                                      // or registry at runtime (see Section 4.5)
SQLCA.DBParm     = "StaticBind=0, DisableBind=0"
SQLCA.AutoCommit = FALSE              // Explicit transaction control

// ── STEP 2: Attempt the connection ───────────────────────────────────────────

CONNECT USING SQLCA;

// ── STEP 3: Check the result immediately ─────────────────────────────────────
// This is non-negotiable. Never assume CONNECT succeeded.

IF SQLCA.SQLCode <> 0 THEN
    // SQLDBCode gives you the raw ORA- number.
    // SQLErrText gives you the human-readable message.
    MessageBox("Connection Failed", &
        "ORA-" + String(SQLCA.SQLDBCode) + ": " + SQLCA.SQLErrText, &
        StopSign!)
    HALT CLOSE  // Shut down the app — no point continuing without a DB
END IF

// ── STEP 4: Optional — verify with a live query ──────────────────────────────
// CONNECT can succeed (SQLCode = 0) but the session may still be degraded.
// A trivial query confirms Oracle is actually responding.

String ls_sysdate
SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS')
INTO  :ls_sysdate
FROM   DUAL
USING  SQLCA;

IF SQLCA.SQLCode = 0 THEN
    // Connection is healthy. ls_sysdate holds the Oracle server's timestamp.
ELSE
    MessageBox("DB Verification Failed", SQLCA.SQLErrText, StopSign!)
    HALT CLOSE
END IF
```

Notice the `USING SQLCA` clause on the `SELECT` statement. This explicitly tells PowerBuilder which transaction object to use. When omitted, PB uses `SQLCA` by default — but being explicit is good practice. It makes the code self-documenting and supports the multi-connection pattern discussed below.

---

### 4.5 Where Does the Password Come From? (The Right Way)

Hardcoding `LogPass = "MyPassword123"` in source code is a security problem that has plagued PowerBuilder applications for decades. The standard pattern is to read connection details from an external source at startup.

```powerscript
// ── Reading from an INI file (classic approach, common in legacy PB apps) ────

String ls_inifile
ls_inifile = GetCurrentDirectory() + "\app.ini"

SQLCA.Database = ProfileString(ls_inifile, "Database", "TNSAlias",  "")
SQLCA.LogId    = ProfileString(ls_inifile, "Database", "Username",  "")
SQLCA.LogPass  = ProfileString(ls_inifile, "Database", "Password",  "")
// Arguments: filename, section, key, default_value


// ── Reading from the Windows Registry (more secure, preferred for modern apps) ──

RegistryGet("HKEY_LOCAL_MACHINE\SOFTWARE\YourApp\DB", "TNSAlias",  RegString!, SQLCA.Database)
RegistryGet("HKEY_LOCAL_MACHINE\SOFTWARE\YourApp\DB", "Username",  RegString!, SQLCA.LogId)
RegistryGet("HKEY_LOCAL_MACHINE\SOFTWARE\YourApp\DB", "Password",  RegString!, SQLCA.LogPass)
// The password in the registry should ideally be encrypted and decrypted at runtime.
```

For an Oracle 19c migration, this is precisely where the change lives: update the `TNSAlias` value in your INI file or registry entry to point to the new 19c server's TNS alias, and all of your PowerScript code stays untouched.

---

### 4.6 Multiple Transaction Objects: When One "Phone Line" Isn't Enough

`SQLCA` is the *default* transaction object, but not the *only* one you can have. You can declare additional `Transaction` objects — useful during a parallel-run migration where you need simultaneous connections to both the old 11g and new 19c databases.

```powerscript
// Declare a second transaction object (as a global variable or Application-level)
Transaction lt_secondary_db

lt_secondary_db = CREATE Transaction  // Must CREATE it — not auto-instantiated like SQLCA

lt_secondary_db.DBMS     = "ORA"
lt_secondary_db.Database = "LEGACY11G"   // The old database, still running during migration
lt_secondary_db.LogId    = "APP_SCHEMA"
lt_secondary_db.LogPass  = ls_password
lt_secondary_db.DBParm   = "StaticBind=0"

CONNECT USING lt_secondary_db;

// Now you can query both databases in the same script:
SELECT col1 INTO :ls_from_new FROM some_table USING SQLCA;
SELECT col1 INTO :ls_from_old FROM some_table USING lt_secondary_db;

// When done, always explicitly disconnect and destroy custom transaction objects.
DISCONNECT USING lt_secondary_db;
DESTROY lt_secondary_db
```

This is also why you sometimes see `USING SQLCA` written explicitly in codebases — those developers were working in multi-connection environments and wanted zero ambiguity about which connection each SQL statement used.

---

### 4.7 The Full SQLCA Lifecycle

The complete lifecycle of a `Transaction` object in a typical PB application is:
**Configure → Connect → Use → Commit/Rollback → Disconnect**

Your Application `Open` event handles Configure and Connect. Your business logic handles Use and Commit/Rollback. Your Application `Close` event handles Disconnect:

```powerscript
// In the Application object's Close event:
DISCONNECT USING SQLCA;

// No need to DESTROY SQLCA — PowerBuilder manages it automatically.
// But you DO need to DESTROY any custom Transaction objects you created.
```

Forgetting to `DISCONNECT` on close is a classic source of orphaned Oracle sessions — your DBA will eventually see ghost connections that never clean up. Always close what you open.

---

### 4.8 The Mental Exercise to Cement This

Here's a way to test your understanding: imagine you're migrating from Oracle 11g to 19c, but you don't want to change any PowerScript code at all. Given everything above, where is the *minimum* set of places you'd need to make changes?

The answer is: only in the connection configuration layer — specifically, the TNS alias in your `tnsnames.ora` (or Easy Connect string), and possibly the value stored in your INI file or registry entry for `Database`. If your schema is identical and credentials haven't changed, your PowerScript code — every `SELECT`, every `UPDATE`, every DataWindow retrieve — touches nothing.

That's the payoff of the `SQLCA` design: the rest of your application is completely decoupled from where the database lives.

---

*Generated from a conversation with Claude (Anthropic) — May 2026.*
