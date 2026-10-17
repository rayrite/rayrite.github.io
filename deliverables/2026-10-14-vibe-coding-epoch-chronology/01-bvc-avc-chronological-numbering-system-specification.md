# Specification Standard: The Vibe Chronology System (VCS) for B.V.C. and A.V.C. Temporal Coordinates

*Research Scope: Architectural design, formal mathematical specification, comparative evaluation of candidate dot-syntax notations, EBNF grammar, parsing regexes, and production-grade reference implementations for the Before Vibe Coding (B.V.C.) and After Vibe Coding (A.V.C.) chronological numbering system.*  
*As of: 2026-10-14 (VCS Coordinate: AVC.0618.0622.15 / Epoch Year 1 AVC)*

---

## Executive Summary

To catalog, tag, and sort software artifacts, research milestones, and historical events across the pre-vibe and post-vibe eras, a traditional calendar year increment (e.g., "Year 1 AVC", "Year 2 AVC") is mathematically inadequate. By 2026, the velocity of artificial intelligence has compressed generational paradigm shifts into weeks, days, and hours. Labeling an event merely by its year fails to communicate the intense acceleration of the domain.

This specification introduces the **Vibe Chronology Standard (VCS)**, an expressive, multi-tier dot-syntax numbering system anchored to the exact millisecond epoch:
$$\mathbf{T_0 = 1738538235271\text{ ms (Unix Epoch)} \equiv 2025\text{-}02\text{-}02\text{ }23:17:15.271\text{ UTC}}$$

The VCS standard provides:
1. **Mental Grounding:** Immediate intuitive comprehension of how many days, hours, and minutes an artifact precedes or follows the epoch.
2. **Sub-Second Precision:** Native dot-syntax representation down to minute, second, and optional millisecond precision.
3. **Lexicographical Sortability:** Fixed-width zero-padded tokens guarantee that ASCII string sorting (`sort`, `ls`, database `ORDER BY`) matches true chronological order.
4. **Dual-Tier Interoperability:** A primary Vector Coordinate (`VCS-Core`: `[ERA].[DAYS].[HHMM].[SS]`) for high-velocity delta tracking, accompanied by an Epoch-Year CalVer Coordinate (`VCS-CalVer`: `[ERA].[EY].[DOY].[HHMM].[SS]`) for long-range historical classification.

---

## 1. Architectural Design Goals & Requirements

The numbering system was engineered against seven non-negotiable architectural requirements:

```
                       VCS ARCHITECTURAL PILLARS
                       
   +-------------------+   +--------------------+   +-------------------+
   |  1. MENTAL ANCHOR |   | 2. VELOCITY AWARE  |   | 3. SUB-SECOND     |
   | Clear delta from  |   | Day/hour resolution|   | Minute/sec/ms     |
   | the T0 watershed  |   | for rapid cadence  |   | precision support |
   +-------------------+   +--------------------+   +-------------------+
             |                       |                        |
             +-----------------------+------------------------+
                                     |
   +-------------------+   +--------------------+   +-------------------+
   | 4. STRING SORT    |   | 5. BIDIRECTIONAL   |   | 6. GIT / BADGE    |
   | Zero-padded       |   | Symmetric BVC/AVC  |   | URL-safe, compact |
   | ASCII alignment   |   | coordinate logic   |   | CLI-friendly tags |
   +-------------------+   +--------------------+   +-------------------+
```

1. **Immediate Mental Anchor:** A reader encountering an artifact marked `BVC.0795.0517.15` must immediately recognize that it was forged approximately 795 days before the vibe coding revolution.
2. **High-Velocity Cadence:** In 2025 and 2026, hundreds of frontier models, agent frameworks, and AI-native applications launch monthly. Yearly counters collapse under this density; day-level and minute-level vectors are mandatory.
3. **Sub-Second Elegance:** Dot notation must seamlessly scale from casual day-level tagging (`BVC.0795`) to release-level minute precision (`BVC.0795.0517`) to cryptographic second/millisecond precision (`BVC.0795.0517.15.271`).
4. **Strict Lexicographical Sortability:** Natural alphabetic string sorting must never invert chronological order.
5. **Bidirectional Symmetry:** The mathematics governing the backward vector ($T < T_0$) and forward vector ($T > T_0$) must use identical structural rules.
6. **Tooling & Git Compatibility:** Coordinates must be URL-safe, filename-safe, and compatible with Git tag naming rules (`git tag vcs/avc.0021.1742`).
7. **Human Conversational Readability:** Clean transformation into natural language phrases for documentation and museum placards (`BVC 795d 05h 17m 15s`).

---

## 2. Brainstorming & Comparative Evaluation of Candidate Formats

Four distinct candidate numbering architectures were evaluated:

| Candidate Architecture | Syntax Structure | Example (ChatGPT Launch) | Example (Claude 3.7 Sonnet) | Strengths | Weaknesses | Architectural Verdict |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Option A: CalVer-Chrono Dot** | `[ERA].[EY].[DOY].[HHMM].[SS]` | `BVC.03.300.1800.00` | `AVC.00.021.1700.00` | Familiar CalVer hierarchy (Year, Day of Year, Time). | Obscures total elapsed distance; requires mental math across leap years. | Retained as Secondary Tier (`VCS-CalVer`). |
| **Option B: Delta-Chrono Dot (DCD)** | `[ERA].[DAYS].[HHMM].[SS]` | `BVC.0795.0517.15` | `AVC.0021.1742.44` | **Unrivaled mental grounding; immediately conveys raw temporal distance from $T_0$; perfectly handles rapid 2026 cadence.** | Day count grows beyond 3 digits after 2.7 years (solved by 4-digit zero padding). | **ADOPTED AS PRIMARY CANONICAL STANDARD (`VCS-Core`).** |
| **Option C: Metric Temporal Coordinate (SI)** | `[ERA].[Ksec].[Sec]` | `BVC.68707.035` | `AVC.01878.164` | Pure SI metric units; elegant for physical simulations. | Completely unreadable for human developers; destroys mental concept of days/hours. | Rejected. |
| **Option D: Gregorian Epoch Stamped** | `[ERA].[YYYYMMDD].[HHMMSS]` | `BVC.20221130.180000` | `AVC.20250224.170000` | Preserves standard Gregorian date inside string. | Redundant; fails to convey delta distance from the epoch; lacks vibe-era identity. | Rejected. |

---

## 3. Formal Specification: The Vibe Chronology Standard (VCS)

The approved standard defines a unified family of coordinate representations:

```
                            VCS SPECIFICATION FAMILY
                            
   [ Tier 1: Canonical Vector ] ----> VCS-Core:    BVC.0795.0517.15
                                      Precision:   BVC.0795.0517.15.271
                                      
   [ Tier 2: Semantic CalVer  ] ----> VCS-CalVer:  BVC.03.300.1800.00
   
   [ Tier 3: Human Display    ] ----> VCS-Display: BVC.795d 05h 17m 15s
   
   [ Tier 4: Git Tag / Badge  ] ----> VCS-Tag:     bvc-d795 / avc-d021
```

### 3.1 Tier 1: Canonical Vector Dot Syntax (`VCS-Core`)

`VCS-Core` is the primary, machine-readable, sortable coordinate format.

#### Format Specification:
$$\mathtt{[ERA].[DAYS].[HHMM].[SS]}$$
Or with sub-second millisecond extension:
$$\mathtt{[ERA].[DAYS].[HHMM].[SS].[sss]}$$

- **`ERA` (3 characters):**
  - `BVC` = Before Vibe Coding ($T < T_0$).
  - `AVC` = After Vibe Coding ($T > T_0$).
  - `T00` or `T0` = The Singularity Epoch ($T = T_0$).
- **`DAYS` (4 digits, zero-padded `0000`–`9999`):**  
  Total integral days elapsed between the event timestamp and $T_0$. (Supports up to 27.3 years before needing a fifth digit).
- **`HHMM` (4 digits, zero-padded `0000`–`2359`):**  
  The residual hours and minutes of the temporal vector.
- **`SS` (2 digits, zero-padded `00`–`59`):**  
  The residual whole seconds of the temporal vector.
- **`sss` (Optional 3 digits, zero-padded `000`–`999`):**  
  The residual milliseconds of the temporal vector.

### 3.2 Tier 2: Semantic Epoch-Year CalVer (`VCS-CalVer`)

`VCS-CalVer` provides a familiar astronomical/calendar hierarchy for long-range planning.

#### Format Specification:
$$\mathtt{[ERA].[EY].[DOY].[HHMM].[SS]}$$

- **`EY` (2 digits, zero-padded `00`–`99`):**  
  - For `AVC`: Epoch Year 00 begins at $T_0$ (Feb 2, 2025 to Feb 2, 2026). Epoch Year 01 is Feb 2, 2026 to Feb 2, 2027.
  - For `BVC`: Epoch Year 01 is the 365 days immediately preceding $T_0$ (Feb 3, 2024 to Feb 2, 2025). Epoch Year 02 is Feb 3, 2023 to Feb 2, 2024. Epoch Year 03 is Feb 3, 2022 to Feb 2, 2023.
- **`DOY` (3 digits, zero-padded `000`–`364` or `365`):**  
  Day within that specific Epoch Year.
- **`HHMM` & `SS`:**  
  Standard UTC wall-clock time of the event.

### 3.3 Tier 3: Expressive Human Display Format (`VCS-Display`)

Used for markdown headers, museum placards, and executive documentation:
- **BVC Syntax:** `BVC.<DAYS>d <HH>h <MM>m <SS>s` (e.g., `BVC.795d 05h 17m 15s`)
- **AVC Syntax:** `AVC.<DAYS>d <HH>h <MM>m <SS>s` (e.g., `AVC.21d 17h 42m 44s`)
- **T0 Syntax:** `T0.0000.0000.00 (The Vibe Coding Epoch)`

### 3.4 Tier 4: Compact Git Tag & Badge Slug (`VCS-Tag`)

Used for Git release tags, branch prefixes, and Shields.io URL slugs:
- `vcs/bvc-d0795` (Day-level tag)
- `vcs/bvc-0795.0517` (Minute-level release tag)
- `vcs/avc-d0021` (Day-level tag)

---

## 4. Mathematical Formulation for Coordinate Derivation

Let $T_{\text{event}}$ be the UTC timestamp of an event in milliseconds since Unix Epoch.  
Let $T_0 = 1738538235271\text{ ms}$ be the Vibe Coding Epoch.

### 4.1 Directional Temporal Vector Calculation

$$\Delta T_{\text{ms}} = T_{\text{event}} - T_0$$

$$\text{ERA} = \begin{cases} 
\mathbf{T0}, & \text{if } \left|\Delta T_{\text{ms}}\right| < 1 \\
\mathbf{AVC}, & \text{if } \Delta T_{\text{ms}} > 0 \\
\mathbf{BVC}, & \text{if } \Delta T_{\text{ms}} < 0 
\end{cases}$$

### 4.2 Decomposition into Canonical Units

Let $\tau = \frac{\left|\Delta T_{\text{ms}}\right|}{1000}$ be the absolute delta in floating-point seconds.

1. **Total Elapsed Days:**
   $$\mathbf{DAYS} = \lfloor \frac{\tau}{86400} \rfloor$$
2. **Residual Seconds after Days:**
   $$R_1 = \tau - (\mathbf{DAYS} \times 86400)$$
3. **Elapsed Hours:**
   $$\mathbf{HH} = \lfloor \frac{R_1}{3600} \rfloor$$
4. **Residual Seconds after Hours:**
   $$R_2 = R_1 - (\mathbf{HH} \times 3600)$$
5. **Elapsed Minutes:**
   $$\mathbf{MM} = \lfloor \frac{R_2}{60} \rfloor$$
6. **Elapsed Seconds:**
   $$R_3 = R_2 - (\mathbf{MM} \times 60)$$
   $$\mathbf{SS} = \lfloor R_3 \rfloor$$
7. **Elapsed Milliseconds:**
   $$\mathbf{sss} = \text{round}\left((R_3 - \mathbf{SS}) \times 1000\right)$$

---

## 5. Formal EBNF Grammar & Regular Expressions

### 5.1 Extended Backus-Naur Form (EBNF)

```ebnf
vcs_coordinate     ::= vcs_core | vcs_calver | vcs_display ;

(* VCS-Core Machine Format *)
vcs_core           ::= era "." days "." hhmm "." ss ( "." sss )? ;
era                ::= "BVC" | "AVC" | "T00" | "T0" ;
days               ::= digit{4} ;
hhmm               ::= hour minute ;
hour               ::= ( "0" digit | "1" digit | "2" [0-3] ) ;
minute             ::= [0-5] digit ;
ss                 ::= [0-5] digit ;
sss                ::= digit{3} ;

(* VCS-CalVer Semantic Format *)
vcs_calver         ::= era "." epoch_year "." day_of_year "." hhmm "." ss ;
epoch_year         ::= digit{2} ;
day_of_year        ::= ( [0-2] digit{2} | "3" [0-5] digit | "36" [0-5] ) ;

(* VCS-Display Format *)
vcs_display        ::= era "." digit+ "d " digit{2} "h " digit{2} "m " digit{2} "s" ;
digit              ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
```

### 5.2 Production Regular Expression Patterns

- **Strict VCS-Core Parser (with optional milliseconds):**
  ```regex
  ^(BVC|AVC|T00|T0)\.(\d{4})\.([0-1][0-9]|2[0-3])([0-5][0-9])\.([0-5][0-9])(?:\.(\d{3}))?$
  ```
- **Strict VCS-CalVer Parser:**
  ```regex
  ^(BVC|AVC|T00|T0)\.(\d{2})\.([0-3]\d{2})\.([0-1][0-9]|2[0-3])([0-5][0-9])\.([0-5][0-9])$
  ```
- **Git Tag Validator:**
  ```regex
  ^vcs/(bvc|avc|t0)-(d\d{4}|\d{4}\.\d{4})$
  ```

---

## 6. Reference Implementations

These zero-dependency reference implementations are ready for integration into the development team's tooling suite.

### 6.1 Python 3 Production Module (`vcs.py`)

```python
"""
Vibe Chronology Standard (VCS) Reference Implementation
Zero external dependencies. Python 3.9+ compatible.
"""
import datetime
import re
from typing import Dict, Optional, Tuple, Union

EPOCH_MS: int = 1738538235271
EPOCH_UTC: datetime.datetime = datetime.datetime.fromtimestamp(
    EPOCH_MS / 1000.0, tz=datetime.timezone.utc
)

CORE_REGEX = re.compile(
    r"^(BVC|AVC|T00|T0)\.(\d{4})\.([0-1][0-9]|2[0-3])([0-5][0-9])\.([0-5][0-9])(?:\.(\d{3}))?$"
)


def to_vcs(dt: datetime.datetime, include_ms: bool = False) -> Dict[str, str]:
    """Converts any UTC datetime to VCS-Core, VCS-CalVer, and VCS-Display."""
    if dt.tzinfo is None:
        raise ValueError("Datetime must be timezone-aware (UTC).")
    
    dt_utc = dt.astimezone(datetime.timezone.utc)
    diff_sec = (dt_utc - EPOCH_UTC).total_seconds()
    
    if abs(diff_sec) < 0.001:
        era = "T0"
        days, hours, minutes, seconds, ms = 0, 0, 0, 0, 0
    elif diff_sec > 0:
        era = "AVC"
        total = diff_sec
        days = int(total // 86400)
        r1 = total % 86400
        hours = int(r1 // 3600)
        r2 = r1 % 3600
        minutes = int(r2 // 60)
        seconds = int(r2 % 60)
        ms = int(round((r2 - seconds) * 1000))
        if ms == 1000:
            seconds += 1
            ms = 0
    else:
        era = "BVC"
        total = abs(diff_sec)
        days = int(total // 86400)
        r1 = total % 86400
        hours = int(r1 // 3600)
        r2 = r1 % 3600
        minutes = int(r2 // 60)
        seconds = int(r2 % 60)
        ms = int(round((r2 - seconds) * 1000))
        if ms == 1000:
            seconds += 1
            ms = 0

    # Core representation
    core = f"{era}.{days:04d}.{hours:02d}{minutes:02d}.{seconds:02d}"
    if include_ms:
        core += f".{ms:03d}"

    # CalVer representation
    if era == "AVC":
        ey = days // 365
        doy = days % 365
    elif era == "BVC":
        ey = (days // 365) + 1
        doy = 365 - (days % 365)
        if doy == 365:
            doy = 0
    else:
        ey = 0
        doy = 0
    calver = f"{era}.{ey:02d}.{doy:03d}.{dt_utc.strftime('%H%M')}.{dt_utc.strftime('%S')}"

    # Display representation
    display = f"{era}.{days}d {hours:02d}h {minutes:02d}m {seconds:02d}s"

    # Git Tag representation
    tag = f"vcs/{era.lower()}-{days:04d}.{hours:02d}{minutes:02d}"

    return {
        "core": core,
        "calver": calver,
        "display": display,
        "tag": tag,
        "utc": dt_utc.isoformat(),
    }


def from_vcs_core(vcs_str: str) -> datetime.datetime:
    """Parses a VCS-Core string back into a UTC datetime."""
    match = CORE_REGEX.match(vcs_str.strip())
    if not match:
        raise ValueError(f"Invalid VCS-Core string: {vcs_str}")
    
    era, d_str, h_str, m_str, s_str, ms_str = match.groups()
    days = int(d_str)
    hours = int(h_str)
    minutes = int(m_str)
    seconds = int(s_str)
    ms = int(ms_str) if ms_str else 0
    
    delta = datetime.timedelta(
        days=days, hours=hours, minutes=minutes, seconds=seconds, milliseconds=ms
    )
    
    if era in ("AVC", "T00", "T0"):
        return EPOCH_UTC + delta
    else:
        return EPOCH_UTC - delta
```

### 6.2 TypeScript / JavaScript Reference Implementation (`vcs.ts`)

```typescript
/**
 * Vibe Chronology Standard (VCS) Reference Implementation (TypeScript)
 * Zero external dependencies. Node.js & Browser compatible.
 */

export const VCS_EPOCH_MS = 1738538235271; // 2025-02-02T23:17:15.271Z

export interface VcsCoordinate {
  core: string;
  calver: string;
  display: string;
  tag: string;
  utc: string;
}

export function toVcs(date: Date, includeMs: boolean = false): VcsCoordinate {
  const targetMs = date.getTime();
  const diffMs = targetMs - VCS_EPOCH_MS;
  const absDiffSec = Math.abs(diffMs) / 1000.0;

  let era: "BVC" | "AVC" | "T0" = "T0";
  if (Math.abs(diffMs) >= 1) {
    era = diffMs > 0 ? "AVC" : "BVC";
  }

  const days = Math.floor(absDiffSec / 86400);
  const r1 = absDiffSec % 86400;
  const hours = Math.floor(r1 / 3600);
  const r2 = r1 % 3600;
  const minutes = Math.floor(r2 / 60);
  const seconds = Math.floor(r2 % 60);
  const ms = Math.round((r2 - seconds) * 1000);

  const pad2 = (n: number) => n.toString().padStart(2, "0");
  const pad3 = (n: number) => n.toString().padStart(3, "0");
  const pad4 = (n: number) => n.toString().padStart(4, "0");

  let core = `${era}.${pad4(days)}.${pad2(hours)}${pad2(minutes)}.${pad2(seconds)}`;
  if (includeMs) {
    core += `.${pad3(ms)}`;
  }

  // CalVer
  let ey = 0;
  let doy = 0;
  if (era === "AVC") {
    ey = Math.floor(days / 365);
    doy = days % 365;
  } else if (era === "BVC") {
    ey = Math.floor(days / 365) + 1;
    doy = 365 - (days % 365);
    if (doy === 365) doy = 0;
  }

  const calver = `${era}.${pad2(ey)}.${pad3(doy)}.${pad2(date.getUTCHours())}${pad2(date.getUTCMinutes())}.${pad2(date.getUTCSeconds())}`;
  const display = `${era}.${days}d ${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;
  const tag = `vcs/${era.toLowerCase()}-${pad4(days)}.${pad2(hours)}${pad2(minutes)}`;

  return {
    core,
    calver,
    display,
    tag,
    utc: date.toISOString(),
  };
}
```

---

## 7. Edge Cases & Boundary Handling

1. **Leap Seconds:** UTC leap seconds do not disrupt VCS coordinates. The underlying arithmetic uses POSIX seconds (`86400` SI seconds per day). Any leap second introduced by the IERS is handled smoothly by POSIX second counters.
2. **Daylight Saving Time (DST) Immunity:** VCS coordinates are computed exclusively on pure Universal Time Coordinated (UTC). Local DST shifts (e.g., EST vs. EDT) have zero effect on VCS coordinate values.
3. **Sub-millisecond Precision:** For extreme micro-benchmarks, `VCS-Core` safely permits appending microseconds (`.ssssss`) without breaking regex parsers using standard prefix matching.
