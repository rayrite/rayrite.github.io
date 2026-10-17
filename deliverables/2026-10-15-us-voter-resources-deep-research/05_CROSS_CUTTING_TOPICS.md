## 7. Electoral maps and district geometry

Understanding electoral representation in the United States requires navigating complex, multi-tiered district geometry spanning congressional seats (435 districts), state senate districts (1,973 districts), state house/assembly districts (5,413 districts), and tens of thousands of county commission, municipal council, and school board districts. This section inventories the authoritative federal, state, and nonpartisan mapping engines.

### 7.1 Federal Mapping Foundations: U.S. Census Bureau

| Resource Name | Managing Entity | URL | Geographic Scope | Evidential Standard |
| :--- | :--- | :--- | :--- | :--- |
| Census Redistricting Data Program (P.L. 94-171) | U.S. Census Bureau | [https://www.census.gov/programs-surveys/decennial-census/about/rdo.html](https://www.census.gov/programs-surveys/decennial-census/about/rdo.html) | National (all states, counties, VTDs, census blocks) | Official / Federal Gold Standard |
| TIGER/Line Shapefiles | U.S. Census Bureau - Geography Division | [https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) | National spatial vector files of legal and statistical boundaries | Official / Federal Core GIS |
| Census Geocoder | U.S. Census Bureau | [https://geocoding.geo.census.gov](https://geocoding.geo.census.gov) | Address-to-coordinates and boundary lookup REST API | Official / Federal Utility |
| My Congressional District | U.S. Census Bureau | [https://www.census.gov/mycd/](https://www.census.gov/mycd/) | Interactive demographic and economic profiles for all 435 congressional seats | Official / Federal Citizen Tool |

### 7.2 State Redistricting Authorities (50 States + DC)
Following each decennial census, state legislative and congressional district lines are drawn through one of four primary institutional mechanisms: independent citizen redistricting commissions, politician commissions, advisory commissions, or standard state legislative enactment subject to gubernatorial veto.

| State | Redistricting Authority | Commission Type | Current Cycle Status | Official Portal / Authority URL |
| :--- | :--- | :--- | :---: | :--- |
| Alabama | Alabama Permanent Legislative Committee on Reapportionment | Legislative | Post-2020 / Court-Ordered (Allen v. Milligan) | [https://www.legislature.state.al.us/aliswww/reapportionment/reapportionment.aspx](https://www.legislature.state.al.us/aliswww/reapportionment/reapportionment.aspx) |
| Alaska | Alaska Redistricting Board | Politician Commission | Post-2020 Adopted | [https://www.akredistrict.org](https://www.akredistrict.org) |
| Arizona | Arizona Independent Redistricting Commission (AIRC) | Independent Citizen | Post-2020 Enacted | [https://irc.az.gov](https://irc.az.gov) |
| Arkansas | Arkansas Board of Apportionment | Politician Commission (Governor, AG, SOS) | Post-2020 Enacted | [https://arkansasredistricting.org](https://arkansasredistricting.org) |
| California | California Citizens Redistricting Commission (CCRC) | Independent Citizen | Post-2020 Enacted | [https://www.wedrawthelinesca.org](https://www.wedrawthelinesca.org) |
| Colorado | Colorado Independent Redistricting Commissions | Independent Citizen | Post-2020 Enacted | [https://redistricting.colorado.gov](https://redistricting.colorado.gov) |
| Connecticut | Connecticut Reapportionment Commission | Legislative / Politician | Post-2020 Enacted | [https://www.cga.ct.gov/red/](https://www.cga.ct.gov/red/) |
| Delaware | Delaware General Assembly | Legislative | Post-2020 Enacted | [https://redistricting.delaware.gov](https://redistricting.delaware.gov) |
| District of Columbia | Council of the District of Columbia (Subcommittee on Redistricting) | Council Legislative | Post-2020 Enacted | [https://dccouncil.gov/redistricting/](https://dccouncil.gov/redistricting/) |
| Florida | Florida Legislature (House Redistricting Committee / Senate Reapportionment) | Legislative | Post-2020 Enacted | [https://www.floridaredistricting.gov](https://www.floridaredistricting.gov) |
| Georgia | Georgia General Assembly (Legislative and Congressional Reapportionment Office) | Legislative | Post-2020 / Court-Ordered (Alpha Phi Alpha) | [https://www.legis.ga.gov/joint-office/reapportionment](https://www.legis.ga.gov/joint-office/reapportionment) |
| Hawaii | Hawaii Reapportionment Commission | Politician Commission | Post-2020 Enacted | [https://elections.hawaii.gov/about-us/boards-and-commissions/reapportionment/](https://elections.hawaii.gov/about-us/boards-and-commissions/reapportionment/) |
| Idaho | Idaho Commission for Reapportionment | Politician Commission | Post-2020 Enacted | [https://redistricting.idaho.gov](https://redistricting.idaho.gov) |
| Illinois | Illinois General Assembly (House & Senate Redistricting Committees) | Legislative | Post-2020 Enacted | [https://www.ilsenateredistricting.com](https://www.ilsenateredistricting.com) |
| Indiana | Indiana General Assembly | Legislative | Post-2020 Enacted | [https://www.in.gov/legislative/redistricting/](https://www.in.gov/legislative/redistricting/) |
| Iowa | Iowa Legislative Services Agency (LSA) | Nonpartisan Agency / Legislative Approval | Post-2020 Enacted | [https://www.legis.iowa.gov/agencies/nonpartisan/lsa](https://www.legis.iowa.gov/agencies/nonpartisan/lsa) |
| Kansas | Kansas Legislature (House & Senate Redistricting Committees) | Legislative | Post-2020 Enacted | [https://www.kslegresearch.org/KLRD-web/Redistricting.html](https://www.kslegresearch.org/KLRD-web/Redistricting.html) |
| Kentucky | Kentucky General Assembly | Legislative | Post-2020 Enacted | [https://legislature.ky.gov](https://legislature.ky.gov) |
| Louisiana | Louisiana State Legislature | Legislative | Post-2020 / Court-Ordered (Robinson v. Landry) | [https://redist.legis.la.gov](https://redist.legis.la.gov) |
| Maine | Maine Apportionment Commission | Politician / Advisory | Post-2020 Enacted | [https://legislature.maine.gov/apportionment](https://legislature.maine.gov/apportionment) |
| Maryland | Maryland General Assembly (Legislative Redistricting Advisory Commission) | Legislative / Advisory | Post-2020 Enacted | [https://mgaleg.maryland.gov](https://mgaleg.maryland.gov) |
| Massachusetts | Massachusetts General Court (Joint Committee on Redistricting) | Legislative | Post-2020 Enacted | [https://malegislature.gov/Committees/Joint/J48](https://malegislature.gov/Committees/Joint/J48) |
| Michigan | Michigan Independent Citizens Redistricting Commission (MICRC) | Independent Citizen | Post-2020 / Court Redraw (Agee v. Benson) | [https://www.michigan.gov/micrc](https://www.michigan.gov/micrc) |
| Minnesota | Minnesota Special Redistricting Panel (Judicial Branch) | Judicial Panel | Post-2020 Enacted | [https://www.mncourts.gov/special-redistricting-panel.aspx](https://www.mncourts.gov/special-redistricting-panel.aspx) |
| Mississippi | Mississippi Standing Joint Legislative Committee on Reapportionment | Legislative | Post-2020 Enacted | [https://billstatus.ls.state.ms.ms/htms/reapportionment.htm](https://billstatus.ls.state.ms.ms/htms/reapportionment.htm) |
| Missouri | Missouri Independent Bipartisan Citizens Commissions | Politician / Citizen | Post-2020 Enacted | [https://oa.mo.gov/budget-planning/redistricting-commissions](https://oa.mo.gov/budget-planning/redistricting-commissions) |
| Montana | Montana Districting and Apportionment Commission | Independent Citizen / Politician | Post-2020 Enacted | [https://mtredistricting.gov](https://mtredistricting.gov) |
| Nebraska | Nebraska Unicameral Legislature (Redistricting Committee) | Legislative | Post-2020 Enacted | [https://nebraskalegislature.gov/committees/redistricting.php](https://nebraskalegislature.gov/committees/redistricting.php) |
| Nevada | Nevada Legislature | Legislative | Post-2020 Enacted | [https://www.leg.state.nv.us/Division/Research/Districts/Reapportionment/](https://www.leg.state.nv.us/Division/Research/Districts/Reapportionment/) |
| New Hampshire | New Hampshire General Court | Legislative | Post-2020 Enacted | [https://www.gencourt.state.nh.us](https://www.gencourt.state.nh.us) |
| New Jersey | New Jersey Apportionment Commission & Redistricting Commission | Politician Commissions | Post-2020 Enacted | [https://www.redistricting.state.nj.us](https://www.redistricting.state.nj.us) |
| New Mexico | New Mexico Citizen Redistricting Committee (CRC) | Advisory Commission | Post-2020 Enacted | [https://www.nmredistricting.org](https://www.nmredistricting.org) |
| New York | New York Independent Redistricting Commission (IRC) | Advisory Commission / Legislative Redraw | Post-2020 / Judicial Redraws | [https://www.nyirc.gov](https://www.nyirc.gov) |
| North Carolina | North Carolina General Assembly (Joint Redistricting Committee) | Legislative | Post-2020 Enacted (2023 Enacted Map) | [https://www.ncleg.gov/Redistricting](https://www.ncleg.gov/Redistricting) |
| North Dakota | North Dakota Legislative Assembly | Legislative | Post-2020 Enacted | [https://ndlegis.gov/redistricting](https://ndlegis.gov/redistricting) |
| Ohio | Ohio Redistricting Commission | Politician Commission | Post-2020 Enacted | [https://www.redistricting.ohio.gov](https://www.redistricting.ohio.gov) |
| Oklahoma | Oklahoma Legislature (House & Senate Redistricting Committees) | Legislative | Post-2020 Enacted | [https://oksenate.gov/redistricting](https://oksenate.gov/redistricting) |
| Oregon | Oregon Legislative Assembly | Legislative | Post-2020 Enacted | [https://www.oregonlegislature.gov/redistricting](https://www.oregonlegislature.gov/redistricting) |
| Pennsylvania | Pennsylvania Legislative Reapportionment Commission | Politician Commission (Legislative) / General Assembly (Congressional) | Post-2020 Enacted | [https://www.redistricting.state.pa.us](https://www.redistricting.state.pa.us) |
| Rhode Island | Rhode Island Special Commission on Reapportionment | Advisory Commission | Post-2020 Enacted | [https://www.rilegislature.gov](https://www.rilegislature.gov) |
| South Carolina | South Carolina General Assembly | Legislative | Post-2020 Enacted (Alexander v. SC NAACP) | [https://redistricting.scsenate.gov](https://redistricting.scsenate.gov) |
| South Dakota | South Dakota Legislature | Legislative | Post-2020 Enacted | [https://sdlegislature.gov](https://sdlegislature.gov) |
| Tennessee | Tennessee General Assembly (Select Committee on Redistricting) | Legislative | Post-2020 Enacted | [https://www.capitol.tn.gov](https://www.capitol.tn.gov) |
| Texas | Texas Legislature (House & Senate Redistricting Committees) | Legislative | Post-2020 Enacted | [https://redistricting.capitol.texas.gov](https://redistricting.capitol.texas.gov) |
| Utah | Utah Legislative Redistricting Committee | Legislative (Independent Advisory Overridden) | Post-2020 Enacted | [https://redistricting.utah.gov](https://redistricting.utah.gov) |
| Vermont | Vermont Legislative Apportionment Board (LAB) | Advisory Commission | Post-2020 Enacted | [https://sos.vermont.gov/elections/administrators-officials/reapportionment/](https://sos.vermont.gov/elections/administrators-officials/reapportionment/) |
| Virginia | Supreme Court of Virginia Special Masters | Judicial Appointment (Commission Deadlocked) | Post-2020 Enacted | [https://www.vacourts.gov/courts/scv/districting/home.html](https://www.vacourts.gov/courts/scv/districting/home.html) |
| Washington | Washington State Redistricting Commission | Politician Commission | Post-2020 / Court-Ordered (Soto Palmer) | [https://www.redistricting.wa.gov](https://www.redistricting.wa.gov) |
| West Virginia | West Virginia Legislature | Legislative | Post-2020 Enacted | [https://www.wvlegislature.gov](https://www.wvlegislature.gov) |
| Wisconsin | Wisconsin State Legislature / Supreme Court of Wisconsin | Legislative / Judicial Redraw (Clarke v. WEC) | Post-2020 Enacted (2024 Legislative Maps) | [https://maps.legis.wisconsin.gov](https://maps.legis.wisconsin.gov) |
| Wyoming | Wyoming State Legislature | Legislative | Post-2020 Enacted | [https://wyoleg.gov/Committees/2021/RED](https://wyoleg.gov/Committees/2021/RED) |

### 7.3 Nonpartisan District Finders and Historical Mapping Tools

| Platform Name | Organization / Publisher | URL | Core Cartographic Function | Quality Label |
| :--- | :--- | :--- | :--- | :--- |
| Open States | Open States Project / Plural Policy | [https://openstates.org](https://openstates.org) | Find-your-legislator tool; aggregates current state legislative and congressional boundaries by address. | Nonpartisan / Open Source |
| Dave's Redistricting App (DRA 2020) | DRA 2020 (501(c)(3)) | [https://davesredistricting.org](https://davesredistricting.org) | Comprehensive web-based redistricting simulator and precinct analysis platform with full demographic and partisan data. | Nonpartisan / Civic Tech |
| Representable | Princeton Gerrymandering Project | [https://representable.org](https://representable.org) | Crowdsourced Community of Interest (COI) mapping tool used by citizens to submit testified boundaries to redistricting commissions. | Academic / Nonpartisan |
| Ballotpedia District Lookup | Lucy Burns Institute | [https://ballotpedia.org/List_of_United_States_Congressional_districts](https://ballotpedia.org/List_of_United_States_Congressional_districts) | Comprehensive directory of all 435 U.S. House seats, historical margin trackers, and district boundary maps. | Nonpartisan / National |
| Dave Leip's Atlas of U.S. Presidential Elections | David Leip | [https://uselectionatlas.org](https://uselectionatlas.org) | The definitive historical cartographic archive of presidential, gubernatorial, and congressional returns by county since 1789. | Independent Research / Gold Standard |
| 270toWin | Electoral Ventures LLC | [https://www.270towin.com](https://www.270towin.com) | Interactive presidential electoral college maps, consensus forecast projections, and congressional district maps. | Nonpartisan Commercial |

---

## 8. Voter rights and protections

The right to vote in the United States is anchored in the federal Constitution (14th, 15th, 19th, 24th, and 26th Amendments) and fortified by federal civil rights enactments. However, because states establish operational election mechanics, voter qualification rules, identification requirements, and restoration protocols vary profoundly across state borders.

### 8.1 Federal Statutory Protections
- **Voting Rights Act of 1965 (52 U.S.C. §§ 10301 et seq.):** Prohibits racially discriminatory voting qualifications or prerequisites (Section 2); mandates non-English language assistance for language minorities in covered jurisdictions (Section 203).
- **National Voter Registration Act of 1993 (NVRA / 'Motor Voter', 52 U.S.C. §§ 20501 et seq.):** Mandates voter registration opportunities at state motor vehicle departments (DMVs), public assistance agencies, and disability offices; regulates voter roll maintenance and purge safeguards.
- **Help America Vote Act of 2002 (HAVA, 52 U.S.C. §§ 20901 et seq.):** Mandates provisional voting for any citizen whose name does not appear on rolls, establishes minimum federal standards for electronic voting systems, and requires statewide computerized voter registration databases.
- **Uniformed and Overseas Citizens Absentee Voting Act of 1986 (UOCAVA, 52 U.S.C. §§ 20301 et seq.):** Protects the voting franchise of active-duty military, merchant marine, and overseas citizens, reinforced by the MOVE Act of 2009 mandating ballots be transmitted at least 45 days before federal elections.
- **Americans with Disabilities Act of 1990 (ADA Title II):** Guarantees equal access to voting precincts, ballot marking devices, and voter registration for individuals with physical, cognitive, or sensory disabilities.

### 8.2 State-by-State Voter Identification Rules Table (51 Jurisdictions)
The table below categorizes all 50 states and the District of Columbia into five distinct legal voter ID categories as of October 2026, complete with statutory citations, acceptable credential types, and cure/affidavit exceptions.

| State | Statutory Rule Category | Governing Statute / Authority | Acceptable Credentials | Exception / Affidavit / Cure Procedure | Trust Label |
| :--- | :--- | :--- | :--- | :--- | :---: |
| Alabama | Non-Strict Photo ID | Ala. Code § 17-9-30 | AL driver license, state ID, passport, military ID, tribal ID | Two election officials may sign sworn identity affidavit; or provisional ballot cured by county board. | Official / State |
| Alaska | Non-Strict Documentary ID | Alaska Stat. § 15.15.225 | Official photo ID, driver license, passport, utility bill, bank statement | Personal recognition by poll worker; or voter signs identity affirmation. | Official / State |
| Arizona | Strict Photo or Strict Non-Photo | A.R.S. § 16-579 | List 1 (unexpired photo ID with address) OR List 2 (two non-photo address documents) | Provisional ballot must be cured within 3 business days (5 days for federal elections). | Official / State |
| Arkansas | Strict Photo ID | Ark. Code Ann. § 7-5-305; Ark. Const. amend. 99 | Government-issued photo ID showing name and photo | Provisional ballot must be cured by presenting qualifying photo ID to county board by noon Monday post-election. | Official / State |
| California | No Document Required | Cal. Elec. Code § 14216 | No document required for registered voters; states name and address | First-time federal HAVA voters show ID or utility bill. | Official / State |
| Colorado | Non-Strict Documentary ID | C.R.S. § 1-1-104(19.5); § 1-7-110 | CO driver license, passport, employee badge, utility bill, Medicare card | All active voters mailed ballots; in-person voters without ID cast provisional ballot. | Official / State |
| Connecticut | Non-Strict Non-Photo ID | Conn. Gen. Stat. § 9-261 | Social security card or any document showing name and address | Voter may execute sworn affidavit affirming identity under penalty of perjury. | Official / State |
| Delaware | Non-Strict Documentary ID | 15 Del. C. § 4937 | Photo ID, utility bill, paycheck, or government document | Voter may sign sworn affirmation of identity. | Official / State |
| District of Columbia | No Document Required | D.C. Official Code § 1-1001.07 | No document required for registered voters; signature check | Universal mail ballot jurisdiction; first-time federal voters show HAVA proof. | Official / State |
| Florida | Strict Photo & Signature ID | Fla. Stat. § 101.043 | Approved photo ID from list of 12 forms showing photo and signature | Voter without ID casts provisional ballot; validated automatically if signature matches registration record. | Official / State |
| Georgia | Strict Photo ID | O.C.G.A. § 21-2-417 | Georgia driver license, state ID, passport, military ID, tribal photo ID | Provisional ballot must be cured within 3 business days with County Board of Registrars. | Official / State |
| Hawaii | Non-Strict Photo ID | HRS § 11-136 | Photo ID at Voter Service Centers | Universal mail ballot state; in-person voters verified by signature or personal questionnaire. | Official / State |
| Idaho | Strict Photo ID | Idaho Code § 34-1113; HB 340 | Idaho driver license, state ID, passport, military ID, tribal photo ID | Student IDs and personal affidavits repealed in 2023; provisional ballot cured with county clerk. | Official / State |
| Illinois | No Document Required | 10 ILCS 5/17-9 | No document required for registered voters | Voter signs poll book; signature compared against registration card on file. | Official / State |
| Indiana | Strict Photo ID | Ind. Code § 3-11-8-25.1 | Government-issued photo ID displaying name, photo, and expiration date | Provisional ballot cured by appearing before County Election Board within 10 days; religious objection exception. | Official / State |
| Iowa | Strict Photo ID | Iowa Code § 49.78 | Iowa driver license, non-operator ID, passport, military ID, state voter ID card | Voter without ID may have identity attested by another registered voter in precinct, or cure provisional ballot. | Official / State |
| Kansas | Strict Photo ID | K.S.A. § 25-2908 (SAFE Act) | Driver license, state ID, passport, military ID, tribal ID, handgun license | Provisional ballot must be cured before county canvass by presenting photo ID. | Official / State |
| Kentucky | Non-Strict Photo ID | KRS § 117.228 | Kentucky driver license, military ID, passport, university student photo ID | Voter without photo ID may sign Voter Affirmation Form and present secondary non-photo ID. | Official / State |
| Louisiana | Non-Strict Photo ID | La. R.S. § 18:562 | LA driver license, special ID card, or military photo ID | Voter without photo ID may execute Voter Identification Affidavit and answer identifying questions. | Official / State |
| Maine | No Document Required | 21-A M.R.S. § 671 | No document required for registered voters; states name and address | First-time federal HAVA voters show ID or utility bill. | Official / State |
| Maryland | No Document Required | Md. Code Ann., Elec. Law § 10-310 | No document required for registered voters; states name, address, DOB | First-time HAVA voters show ID. | Official / State |
| Massachusetts | No Document Required | M.G.L. c. 54, § 76B | No document required for standard registered voters | ID requested only if first-time federal registrant, inactive voter, or challenged. | Official / State |
| Michigan | Non-Strict Photo ID | MCL § 168.523 | Driver license, state ID, passport, military ID, student ID | Voter who does not possess acceptable photo ID signs Affidavit of Voter Not in Possession of Picture ID and votes standard ballot. | Official / State |
| Minnesota | No Document Required | Minn. Stat. § 204C.10 | No document required for registered voters; signs roster oath | Strict proof of residence required only for Election Day Registration (EDR). | Official / State |
| Mississippi | Strict Photo ID | Miss. Code Ann. § 23-15-563 | Mississippi driver license, state ID, passport, military ID, tribal ID | Voter casts affidavit ballot; has 5 business days to present qualifying ID to circuit clerk. | Official / State |
| Missouri | Strict Photo ID | RSMo § 115.427 (HB 1878) | Non-expired Missouri driver license, state ID, passport, or military photo ID | Provisional ballot counted only if signature matches voter registration file or voter returns with ID on election day. | Official / State |
| Montana | Non-Strict Photo / Documentary ID | Mont. Code Ann. § 13-13-114 | Photo ID OR two non-photo documents showing name and address | Voter may present alternative credentials or cure provisional ballot. | Official / State |
| Nebraska | Strict Photo ID | Neb. Rev. Stat. § 32-111; Initiative 432 | Nebraska driver license, state ID, passport, military ID, college student ID | Effective 2024; provisional ballot must be cured with county election official within 7 days. | Official / State |
| Nevada | No Document Required | NRS § 293.277 | No document required for registered voters; signature verification | Universal mail ballot state; in-person signature compared against voter record. | Official / State |
| New Hampshire | Strict Photo ID | RSA § 659:13; HB 1569 | Valid driver license, passport, armed services ID | Affidavit exception eliminated in 2024 (HB 1569); provisional ballot must be cured. | Official / State |
| New Jersey | No Document Required | N.J.S.A. § 19:15-17 | No document required for registered voters; signature check | First-time HAVA registrants show ID. | Official / State |
| New Mexico | Non-Strict Non-Photo ID | NMSA 1978, § 1-1-24 | Verbal statement of name, birth year, last 4 SSN; or utility bill | Physical document not mandatory if verbal identity confirmed. | Official / State |
| New York | No Document Required | N.Y. Elec. Law § 8-302 | No document required for registered voters; signature check | Signature compared against voter registration digit on electronic poll book. | Official / State |
| North Carolina | Strict Photo ID | N.C.G.S. § 163-166.16 | NC driver license, state ID, passport, military ID, approved student/government ID | Voter may execute an ID Exception Form (reasonable impediment) or cure provisional ballot. | Official / State |
| North Dakota | Strict Photo / Address ID | N.D.C.C. § 16.1-05-07 | Valid ND driver license, state ID, or tribal ID with residential address | No voter registration; provisional ballot must be cured within 6 days with county auditor. | Official / State |
| Ohio | Strict Photo ID | R.C. § 3505.18 (HB 458) | Ohio driver license, state ID, passport, military ID | Utility bills and bank statements eliminated; provisional ballot cured within 4 days. | Official / State |
| Oklahoma | Non-Strict Documentary ID | 26 O.S. § 7-114 | Government photo ID or free County Election Board voter identification card | Voter without document may sign sworn affidavit and cast provisional ballot. | Official / State |
| Oregon | No Document Required (All-Mail) | ORS § 254.470 | Universal vote-by-mail; signature verification on return envelope | Automatic voter registration via DMV; signature matched against motor vehicle records. | Official / State |
| Pennsylvania | No Document Required | 25 P.S. § 3050 | No document required for registered voters in existing precinct | First-time voters in a new precinct show photo or non-photo ID. | Official / State |
| Rhode Island | Non-Strict Photo ID | R.I. Gen. Laws § 17-19-24.2 | RI driver license, passport, military ID, government employee ID | Voter without photo ID casts provisional ballot verified by signature match. | Official / State |
| South Carolina | Non-Strict Photo ID | S.C. Code Ann. § 7-13-710 | SC driver license, DMV ID card, passport, military ID, voter card with photo | Voter with reasonable impediment may show non-photo voter card and sign affidavit. | Official / State |
| South Dakota | Non-Strict Photo ID | SDCL § 12-18-6.1 | South Dakota driver license, passport, military ID, tribal ID | Voter without photo ID signs personal identification affidavit and votes regular ballot. | Official / State |
| Tennessee | Strict Photo ID | Tenn. Code Ann. § 2-7-112 | Federal or Tennessee state government photo ID | College student photo IDs strictly prohibited; provisional ballot cured in 2 business days. | Official / State |
| Texas | Strict Photo ID (with RID) | Tex. Elec. Code § 63.0101 (SB 14 / SB 5) | Texas driver license, election ID certificate, DPS ID, handgun license, military ID, passport | Voter without photo ID who has reasonable impediment may sign RID and show secondary document. | Official / State |
| Utah | Non-Strict Photo / Documentary ID | Utah Code § 20A-1-102; § 20A-3a-205 | Valid photo ID OR two non-photo address documents | Universal mail ballot state; in-person voters show ID or cast provisional ballot. | Official / State |
| Vermont | No Document Required | 17 V.S.A. § 2563 | No document required for registered voters; states name | Universal mail ballot jurisdiction for general elections. | Official / State |
| Virginia | Non-Strict Documentary ID | Va. Code § 24.2-643 | Photo ID, DMV card, passport, utility bill, bank statement | Voter without ID signs sworn ID Confirmation Statement. | Official / State |
| Washington | No Document Required (All-Mail) | RCW 29A.40.110 | Universal vote-by-mail; signature verification on envelope | Signature verified against driver license and voter registration file. | Official / State |
| West Virginia | Non-Strict Documentary ID | W. Va. Code § 3-1-34 | Driver license, voter card, utility bill, student ID, bank statement | Poll worker who has known voter for 6 months may execute affidavit. | Official / State |
| Wisconsin | Strict Photo ID | Wis. Stat. § 6.79(2) (Act 23) | Wisconsin driver license, state ID, military ID, passport, qualifying student ID | Provisional ballot must be cured by presenting photo ID to municipal clerk by 4 p.m. Friday. | Official / State |
| Wyoming | Strict Photo ID | Wyo. Stat. Ann. § 22-1-102; § 22-15-110 | Wyoming driver license, tribal ID, passport, military ID, state ID | Enacted in 2021; provisional ballot cured with county clerk. | Official / State |

### 8.3 Restoration of Voting Rights (Felony Disenfranchisement)
State policies on felony disenfranchisement fall into four distinct statutory tiers:
1. **Never Lose Right to Vote / Incarceration Voting:** Maine, Vermont, and the District of Columbia permit individuals to vote by absentee ballot while serving felony sentences.
2. **Disenfranchised Only While Incarcerated (Automatic Upon Release):** 23 states automatically restore voting rights immediately upon release from prison, regardless of probation, parole, or restitution status: California, Colorado, Connecticut, Hawaii, Illinois, Indiana, Maryland, Massachusetts, Michigan, Minnesota, Montana, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Dakota, Ohio, Oregon, Pennsylvania, Rhode Island, Utah, and Washington.
3. **Loss During Incarceration, Probation, and Parole (Automatic Upon Completion):** 14 states restore rights automatically only after completion of full sentence, including probation, parole, and payment of court fines/fees: Alaska, Arkansas, Georgia, Idaho, Kansas, Louisiana (after 5 years on probation/parole), Missouri, Nebraska, North Carolina, Oklahoma, South Carolina, South Dakota, Texas, West Virginia, and Wisconsin.
4. **Individual Petition, Waiting Period, or Governor Pardon Required:** 10 states impose post-sentence waiting periods, gubernatorial pardon requirements, or permanent disenfranchisement for specific crimes: Alabama, Arizona, Delaware, Florida (requires payment of all legal financial obligations under Amendment 4 / SB 7066), Iowa (executive order restoration), Kentucky (gubernatorial discretion), Mississippi (constitutional carve-out of 22 specific disenfranchising crimes), Tennessee, Virginia (executive discretion), and Wyoming.

### 8.4 Section 203 Language Access Coverage and Multilingual Resources
Under Section 203 of the Voting Rights Act (52 U.S.C. § 10503), jurisdictions where more than 10,000 or 5% of voting-age citizens are members of a single language minority and have limited English proficiency must provide all registration, ballot, and election information in the covered language. Per the latest Census Bureau determination published by the Attorney General (86 FR 69611):
- **National Scope:** 331 jurisdictions across 30 states are covered.
- **Covered Language Groups:** Spanish, Native American / Alaska Native languages (Navajo, Yup'ik, Inupiat, Apache, Pueblo, Choctaw, Cherokee), Chinese (Mandarin and Cantonese), Vietnamese, Korean, Tagalog, Hindi, and Khmer.
- **Statewide Coverage:** California, Florida, and Texas are covered statewide for Spanish; Alaska is covered statewide for Alaska Native languages.

### 8.5 Election Protection Hotlines and Official Complaint Pathways

| Hotline / Organization | Contact Information | Languages Covered | Operational Focus | Quality Label |
| :--- | :--- | :--- | :--- | :--- |
| Election Protection (National Nonpartisan) | 1-866-OUR-VOTE (1-866-687-8683) / [866ourvote.org](https://866ourvote.org) | English | Nonpartisan volunteer legal coalition led by Lawyers' Committee for Civil Rights Under Law. | Nonpartisan / National |
| ¡Ve Y Vota! (NALEO Educational Fund) | 1-888-VE-Y-VOTA (1-888-839-8682) / [veyvota.org](https://veyvota.org) | Spanish / Bilingual | Dedicated voter assistance hotline for Latino voters nationwide. | Nonpartisan / National |
| Asian Americans Advancing Justice (AAJC) | 1-888-API-VOTE (1-888-274-8683) / [advancingjustice-aajc.org](https://www.advancingjustice-aajc.org) | Mandarin, Cantonese, Korean, Vietnamese, Tagalog, Urdu, Hindi, English | Multilingual Asian American legal assistance and language access monitoring. | Nonpartisan / National |
| Yalla Vote (Arab American Institute) | 1-844-YALLA-US (1-844-925-5287) / [aaiusa.org/yallavote](https://www.aaiusa.org/yallavote) | Arabic / English | Assistance for Arab American voters navigating registration and civil rights. | Nonpartisan / National |
| U.S. Department of Justice - Civil Rights Division | 1-800-253-3931 / [civilrights.justice.gov](https://civilrights.justice.gov) | English, Spanish, multiple language translation services | Federal statutory civil rights enforcement, voter intimidation, and discrimination complaint intake. | Official / Federal |

---

## 9. Candidate information and campaign finance

Transparency in campaign finance is governed by federal disclosure statutes (FECA) for federal officeholders, and by independent state ethics commissions, public disclosure commissions, and secretary of state bureaus for state and local candidates.

### 9.1 Federal Campaign Finance: Federal Election Commission (FEC)
- **Portal URL:** [https://www.fec.gov](https://www.fec.gov)
- **Candidate & Committee Search:** [https://www.fec.gov/data/](https://www.fec.gov/data/)
- **Statutory Mandate:** Administers the Federal Election Campaign Act (FECA), regulating contribution limits, source prohibitions (foreign nationals, government contractors), and mandatory itemized reporting of contributions and expenditures over $200.
- **Developer API:** [https://api.open.fec.gov](https://api.open.fec.gov) provides programmatic access to candidate summaries, financial reports, independent expenditures, and election cycle disbursements.

### 9.2 State Campaign Finance Commissions and Disclosure Portals (50 States + DC)

| State | Governing Agency / Commission | Canonical Disclosure Portal URL | Search Capability | Cycle Scope | Quality Label |
| :--- | :--- | :--- | :---: | :---: | :--- |
| Alabama | Alabama Secretary of State - Elections Division | [https://fcpa.alabamavotes.gov](https://fcpa.alabamavotes.gov) | Searchable Database | Current / Historical | Official / State |
| Alaska | Alaska Public Offices Commission (APOC) | [https://doa.alaska.gov/apoc/](https://doa.alaska.gov/apoc/) | Searchable Database | Current / Historical | Official / State |
| Arizona | Arizona Secretary of State - Campaign Finance | [https://seethesource.az.gov](https://seethesource.az.gov) | Searchable Database | Current / Historical | Official / State |
| Arkansas | Arkansas Secretary of State - Elections Division | [https://financial-disclosures.sos.arkansas.gov](https://financial-disclosures.sos.arkansas.gov) | Searchable Database | Current / Historical | Official / State |
| California | Fair Political Practices Commission (FPPC) / Cal-Access | [https://powersearch.sos.ca.gov](https://powersearch.sos.ca.gov) | Searchable Database | Current / Historical | Official / State |
| Colorado | Colorado Secretary of State - TRACER | [https://tracer.sos.colorado.gov](https://tracer.sos.colorado.gov) | Searchable Database | Current / Historical | Official / State |
| Connecticut | State Elections Enforcement Commission (SEEC) | [https://seec.ct.gov](https://seec.ct.gov) | Searchable Database (eCRIS) | Current / Historical | Official / State |
| Delaware | Delaware Department of Elections - CFRS | [https://cfrs.elections.delaware.gov](https://cfrs.elections.delaware.gov) | Searchable Database | Current / Historical | Official / State |
| District of Columbia | District of Columbia Office of Campaign Finance (OCF) | [https://ocf.dc.gov](https://ocf.dc.gov) | Searchable Database | Current / Historical | Official / State |
| Florida | Florida Division of Elections - Campaign Finance | [https://dos.elections.myflorida.com/campaign-finance/](https://dos.elections.myflorida.com/campaign-finance/) | Searchable Database | Current / Historical | Official / State |
| Georgia | Georgia Government Transparency & Campaign Finance Commission | [https://ethics.ga.gov](https://ethics.ga.gov) | Searchable Database | Current / Historical | Official / State |
| Hawaii | Hawaii Campaign Spending Commission | [https://csc.hawaii.gov](https://csc.hawaii.gov) | Searchable Database | Current / Historical | Official / State |
| Idaho | Idaho Secretary of State - Sunshine Portal | [https://sunshine.sos.idaho.gov](https://sunshine.sos.idaho.gov) | Searchable Database | Current / Historical | Official / State |
| Illinois | Illinois State Board of Elections - Campaign Disclosure | [https://www.elections.il.gov/CampaignDisclosure/](https://www.elections.il.gov/CampaignDisclosure/) | Searchable Database | Current / Historical | Official / State |
| Indiana | Indiana Election Division - Campaign Finance | [https://campaignfinance.in.gov](https://campaignfinance.in.gov) | Searchable Database | Current / Historical | Official / State |
| Iowa | Iowa Ethics and Campaign Disclosure Board | [https://ethics.iowa.gov](https://ethics.iowa.gov) | Searchable Database | Current / Historical | Official / State |
| Kansas | Kansas Governmental Ethics Commission | [https://ethics.kansas.gov](https://ethics.kansas.gov) | Searchable Database | Current / Historical | Official / State |
| Kentucky | Kentucky Registry of Election Finance (KREF) | [https://kref.ky.gov](https://kref.ky.gov) | Searchable Database | Current / Historical | Official / State |
| Louisiana | Louisiana Ethics Administration Program | [https://ethics.la.gov](https://ethics.la.gov) | Searchable Database | Current / Historical | Official / State |
| Maine | Commission on Governmental Ethics and Election Practices | [https://mainecampaignfinance.com](https://mainecampaignfinance.com) | Searchable Database | Current / Historical | Official / State |
| Maryland | Maryland State Board of Elections - CRIS | [https://campaignfinance.maryland.gov](https://campaignfinance.maryland.gov) | Searchable Database | Current / Historical | Official / State |
| Massachusetts | Office of Campaign and Political Finance (OCPF) | [https://www.ocpf.us](https://www.ocpf.us) | Searchable Database | Current / Historical | Official / State |
| Michigan | Michigan Bureau of Elections - Campaign Finance | [https://miboecfr.nictusa.com](https://miboecfr.nictusa.com) | Searchable Database | Current / Historical | Official / State |
| Minnesota | Campaign Finance and Public Disclosure Board | [https://cfb.mn.gov](https://cfb.mn.gov) | Searchable Database | Current / Historical | Official / State |
| Mississippi | Mississippi Secretary of State - Campaign Finance | [https://www.sos.ms.gov/campaign-finance](https://www.sos.ms.gov/campaign-finance) | Searchable Database | Current / Historical | Official / State |
| Missouri | Missouri Ethics Commission (MEC) | [https://mec.mo.gov](https://mec.mo.gov) | Searchable Database | Current / Historical | Official / State |
| Montana | Commissioner of Political Practices (COPP) - CERS | [https://politicalpractices.mt.gov](https://politicalpractices.mt.gov) | Searchable Database | Current / Historical | Official / State |
| Nebraska | Nebraska Accountability and Disclosure Commission (NADC) | [https://nadc.nebraska.gov](https://nadc.nebraska.gov) | Searchable Database | Current / Historical | Official / State |
| Nevada | Nevada Secretary of State - Aurora | [https://www.nvsos.gov/sos/elections/aurora](https://www.nvsos.gov/sos/elections/aurora) | Searchable Database | Current / Historical | Official / State |
| New Hampshire | New Hampshire Secretary of State - CFS | [https://cfs.sos.nh.gov](https://cfs.sos.nh.gov) | Searchable Database | Current / Historical | Official / State |
| New Jersey | Election Law Enforcement Commission (ELEC) | [https://www.elec.nj.gov](https://www.elec.nj.gov) | Searchable Database | Current / Historical | Official / State |
| New Mexico | New Mexico Secretary of State - CFIS | [https://campaignfinance.sos.nm.gov](https://campaignfinance.sos.nm.gov) | Searchable Database | Current / Historical | Official / State |
| New York | NYS Board of Elections - Campaign Finance | [https://publicreporting.elections.ny.gov](https://publicreporting.elections.ny.gov) | Searchable Database | Current / Historical | Official / State |
| North Carolina | State Board of Elections - Campaign Finance | [https://vt.ncsbe.gov/CFRptSearch/](https://vt.ncsbe.gov/CFRptSearch/) | Searchable Database | Current / Historical | Official / State |
| North Dakota | North Dakota Secretary of State - Campaign Finance | [https://vip.sos.nd.gov/cf](https://vip.sos.nd.gov/cf) | Searchable Database | Current / Historical | Official / State |
| Ohio | Ohio Secretary of State - Campaign Finance | [https://campaignfinance.ohiosos.gov](https://campaignfinance.ohiosos.gov) | Searchable Database | Current / Historical | Official / State |
| Oklahoma | Oklahoma Ethics Commission - The Guardian System | [https://guardian.ok.gov](https://guardian.ok.gov) | Searchable Database | Current / Historical | Official / State |
| Oregon | Oregon Secretary of State - ORESTAR | [https://sos.oregon.gov/elections/Pages/orestar.aspx](https://sos.oregon.gov/elections/Pages/orestar.aspx) | Searchable Database | Current / Historical | Official / State |
| Pennsylvania | Pennsylvania Department of State - Campaign Finance | [https://www.campaignfinanceonline.pa.gov](https://www.campaignfinanceonline.pa.gov) | Searchable Database | Current / Historical | Official / State |
| Rhode Island | Rhode Island Board of Elections - ERTS | [https://ricampaignfinance.com](https://ricampaignfinance.com) | Searchable Database | Current / Historical | Official / State |
| South Carolina | State Ethics Commission - Public Disclosure | [https://ethics.sc.gov](https://ethics.sc.gov) | Searchable Database | Current / Historical | Official / State |
| South Dakota | South Dakota Secretary of State - Campaign Finance | [https://sdsos.gov/elections-voting/campaign-finance/](https://sdsos.gov/elections-voting/campaign-finance/) | Searchable Database | Current / Historical | Official / State |
| Tennessee | Tennessee Bureau of Ethics and Campaign Finance | [https://www.tn.gov/tbecf](https://www.tn.gov/tbecf) | Searchable Database | Current / Historical | Official / State |
| Texas | Texas Ethics Commission | [https://www.ethics.state.tx.us](https://www.ethics.state.tx.us) | Searchable Database | Current / Historical | Official / State |
| Utah | Lieutenant Governor Elections Office - Disclosures | [https://disclosures.utah.gov](https://disclosures.utah.gov) | Searchable Database | Current / Historical | Official / State |
| Vermont | Vermont Secretary of State - Campaign Finance | [https://campaignfinance.vermont.gov](https://campaignfinance.vermont.gov) | Searchable Database | Current / Historical | Official / State |
| Virginia | Virginia Department of Elections - COMET | [https://www.elections.virginia.gov/campaign-finance/](https://www.elections.virginia.gov/campaign-finance/) | Searchable Database | Current / Historical | Official / State |
| Washington | Washington Public Disclosure Commission (PDC) | [https://www.pdc.wa.gov](https://www.pdc.wa.gov) | Searchable Database (Open Data) | Current / Historical | Official / State |
| West Virginia | West Virginia Secretary of State - CFRS | [https://cfrs.wvsos.gov](https://cfrs.wvsos.gov) | Searchable Database | Current / Historical | Official / State |
| Wisconsin | Wisconsin Ethics Commission - CFIS | [https://cfis.wi.gov](https://cfis.wi.gov) | Searchable Database | Current / Historical | Official / State |
| Wyoming | Wyoming Secretary of State - WYCFIS | [https://www.wycampaignfinance.gov](https://www.wycampaignfinance.gov) | Searchable Database | Current / Historical | Official / State |

### 9.3 Major Municipal Campaign Finance Portals
- **New York City Campaign Finance Board (NYCCFB):** [https://www.nyccfb.info](https://www.nyccfb.info) - Administers the nation's premier public matching funds program (8-to-1 match for small-dollar contributions) and the *Follow the Money NYC* disclosure database.
- **City of Los Angeles Ethics Commission:** [https://ethics.lacity.org](https://ethics.lacity.org) - Electronic filing, public matching funds, and lobbying disclosure for municipal candidates.
- **City of Chicago Board of Ethics:** [https://www.chicago.gov/ethics](https://www.chicago.gov/ethics) - Municipal campaign contribution limits, lobbyist tracking, and public filings.
- **San Francisco Ethics Commission:** [https://sfethics.org](https://sfethics.org) - City campaign finance transparency, public matching funds, and campaign finance audits.
- **Seattle Ethics and Elections Commission (SEEC):** [https://www.seattle.gov/ethics](https://www.seattle.gov/ethics) - Administers the groundbreaking 'Democracy Voucher' public financing program.
- **Philadelphia Board of Ethics:** [https://www.phila.gov/ethics](https://www.phila.gov/ethics) - Campaign finance reporting and contribution limit enforcement for city elections.

---

## 10. Accessibility and language access

Voting accessibility ensures that citizens with visual, mobility, auditory, or cognitive disabilities, as well as language minority voters, can exercise an independent and private ballot.

### 10.1 EAC Accessibility Clearinghouse and Technical Guidance
- **Portal URL:** [https://www.eac.gov/voting-accessibility](https://www.eac.gov/voting-accessibility)
- **Core Deliverables:** Best practice checklists for polling place physical accessibility, sensory-friendly voting guides, accessible electronic absentee voting standards, and poll worker training modules.
- **VVSG 2.0 Benchmarks:** Requires certified voting systems to provide independent ballot verification via audio tactile interfaces (ATI), dual-switch sip-and-puff inputs, adjustable font magnification, and high-contrast color inversion.

### 10.2 Department of Justice Limited English Proficiency (LEP) Guidance
- **Portal URL:** [https://www.lep.gov](https://www.lep.gov)
- **Enforcement Framework:** Federal guidance pursuant to Executive Order 13166 and Voting Rights Act Section 203, establishing standards for competent oral interpreter assistance at polling precincts, translated written notices, and bilingual sample ballots.

### 10.3 National Disability Rights Network (NDRN) Protection & Advocacy (P&A) System
- **Portal URL:** [https://www.ndrn.org](https://www.ndrn.org)
- **Statutory Mandate:** Federally mandated Protection and Advocacy (P&A) agencies established under HAVA Section 291 in every U.S. state, territory, and DC to protect the legal voting rights of individuals with disabilities.
- **Key State Affiliates:** Disability Rights California ([disabilityrightsca.org](https://www.disabilityrightsca.org)), Equip for Equality Illinois ([equipforequality.org](https://www.equipforequality.org)), Disability Rights New York ([drny.org](https://www.drny.org)), Disability Rights Texas ([disabilityrightstx.org](https://www.disabilityrightstx.org)), Disability Rights Florida ([disabilityrightsflorida.org](https://www.disabilityrightsflorida.org)).

---

## 11. Election administration infrastructure

The institutional backbone supporting America's voting infrastructure includes national intergovernmental associations, professional societies of election administrators, and standards certification bodies.

| Organization Name | URL | Governance / Character | Key Operational Programs & Resources | Quality Label |
| :--- | :--- | :--- | :--- | :--- |
| National Association of Secretaries of State (NASS) | [https://www.nass.org](https://www.nass.org) | Intergovernmental Association (Est. 1904) | Maintains Can I Vote (canivote.org); national cybersecurity coordination committees; bipartisan policy resolutions. | Official / Intergovernmental |
| National Association of State Election Directors (NASED) | [https://www.nased.org](https://www.nased.org) | Professional State Association | Consortium of operational election directors; operational manuals, cybersecurity training, EAVS collaboration. | Professional Association |
| The Election Center (National Association of Election Officials) | [https://www.electioncenter.org](https://www.electioncenter.org) | Professional Society | Administers the Certified Elections/Registration Administrator (CERA) professional credential in partnership with Auburn University. | Professional Association |
| National Institute of Standards and Technology (NIST) | [https://www.nist.gov/itl/voting](https://www.nist.gov/itl/voting) | Federal Standards Agency (DoC) | Computer Security Division / CSTL; technical authoring of Voluntary Voting System Guidelines (VVSG); common data format (CDF) standards. | Official / Federal |
| EAC Voting System Certification Program | [https://www.eac.gov/voting-equipment](https://www.eac.gov/voting-equipment) | Federal Regulatory Body | Federal testing and certification of electronic voting machines, optical scanners, and epollbooks; VSTL lab accreditation. | Official / Federal |

---

## 12. Monitoring, research, and accountability

Independent academic institutes, nonpartisan watchdogs, and investigative newsrooms provide external auditing, empirical data science, and transparency over American elections.

| Organization / Desk | URL | Institutional Home | Core Empirical Data Products | Methodology URL | Quality Label |
| :--- | :--- | :--- | :--- | :--- | :--- |
| MIT Election Data and Science Lab (MEDSL) | [https://electionlab.mit.edu](https://electionlab.mit.edu) | Massachusetts Institute of Technology | Elections Performance Index (EPI); precinct-level historical election returns dataset; nationwide polling wait time studies. | [https://electionlab.mit.edu/data](https://electionlab.mit.edu/data) | Academic / Nonpartisan Gold Standard |
| Brennan Center for Justice | [https://www.brennancenter.org](https://www.brennancenter.org) | NYU School of Law | Voting Laws Roundup (tracking restrictive and expansive state voting statutes); Voting Rights Act litigation; election denialism audits. | [https://www.brennancenter.org/our-work/research-reports](https://www.brennancenter.org/our-work/research-reports) | Nonpartisan / Legal Research & Advocacy |
| Verified Voting | [https://verifiedvoting.org](https://verifiedvoting.org) | Verified Voting Foundation (501(c)(3)) | The Verifier (searchable national database mapping voting equipment, optical scanners, and post-election audit laws across all 3,143 U.S. counties). | [https://verifiedvoting.org/verifier/](https://verifiedvoting.org/verifier/) | Civic Tech / Audit Standard |
| Center for Election Innovation & Research (CEIR) | [https://electioninnovation.org](https://electioninnovation.org) | CEIR (501(c)(3)) | State voting system cybersecurity audits, voter registration roll accuracy analysis, Electronic Registration Information Center (ERIC) technical support. | [https://electioninnovation.org/research/](https://electioninnovation.org/research/) | Nonpartisan Civic Research |
| ProPublica - Represent & Electionland | [https://projects.propublica.org/represent/](https://projects.propublica.org/represent/) | ProPublica (Independent Nonprofit Newsroom) | Represent API (congressional votes, bills, and disclosures); Electionland coalition tracking real-time voting machine failures and long lines. | [https://www.propublica.org/datastore/](https://www.propublica.org/datastore/) | Investigative Journalism |
| Associated Press (AP) Elections Desk | [https://apnews.com/hub/elections](https://apnews.com/hub/elections) | The Associated Press | AP Race Calls (authoritative national race caller); AP VoteCast comprehensive national voter survey examining electorate demographics. | [https://www.ap.org/about/our-role-in-elections/](https://www.ap.org/about/our-role-in-elections/) | Reputable News Consortium |
| Stanford-MIT Healthy Elections Project | [https://healthyelections.org](https://healthyelections.org) | Stanford University & MIT | Empirical research on election administration resilience, mail balloting capacity, poll worker recruitment, and health protocols. | [https://healthyelections.org](https://healthyelections.org) | Academic Research |
