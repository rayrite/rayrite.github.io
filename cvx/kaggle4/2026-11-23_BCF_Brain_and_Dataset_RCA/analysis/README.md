# analysis: how Document 01 was produced

The classification and the root-cause analysis of the 129 published problems were produced with the scripts in this folder. Every number in `../01_Dataset_Taxonomy_and_Root_Cause_Analysis.md` is inserted by `tools_render_task1.py` from the records in `../data/`.

## Pipeline

| Step | Script | Input | Output |
|---|---|---|---|
| 1 | `tools_profile.py` | `tasks.jsonl` | Size and shape statistics of the tasks (printed) |
| 2 | `tools_features.py` | `tasks.jsonl` | `features.jsonl`: one deterministic record per task (statement, gold patch, test digest, missing packages) |
| 3 | `tools_snapshot_index.py` | the competition zip | A content-addressed store of every repository snapshot: `snapidx/<task>.tsv` and `blobs/` (about one minute; text files only) |
| 4 | `tools_build_packs.py` | the store and `tasks.jsonl` | `packs/<task>.md`: statement, gold patch with the pre-fix function around every change, test digest; `pack_features.jsonl` |
| 5 | review against `RCA-SCHEMA.md` | the packs, with `tools_show_base.py` to open the pre-fix source | `data/rca/batch_*.json`: the coded records |
| 6 | `tools_merge_rca.py` | the coded records, `features.jsonl`, `pack_features.jsonl` | `data/rca_merged.jsonl` and `data/rca_stats.json`, with every code and file list cross-checked |
| 7 | `tools_render_task1.py` | the merged records, the localizer evaluation, `task1_partA/B/C.md.tpl` | `../01_Dataset_Taxonomy_and_Root_Cause_Analysis.md` |

Step 5 is the only step that is not mechanical: thirteen independent review passes coded the tasks against the closed scheme and opened the pre-fix source where the patch alone left the mechanism open. The cross-check in step 6 found no invalid code and no file list that differed from the gold patch.

## Commands

Run from this folder, with `<store>` the folder built in step 3 and `<work>` any scratch folder:

```bash
python tools_profile.py   <tasks.jsonl>
python tools_features.py  <tasks.jsonl> <work>
python tools_snapshot_index.py <competition.zip> <tasks.jsonl> <store> 6
python tools_build_packs.py <store> <tasks.jsonl>
python tools_show_base.py <store> <task id> <path in the repository> [first line] [last line]
python tools_merge_rca.py ../data <tasks.jsonl>      # re-creates ../data/rca_merged.jsonl and rca_stats.json from the coded records
python tools_render_task1.py ../data . <output.md>   # re-creates Document 01
```

`tools_render_task1.py` reads the localizer evaluation from `../bcf-brain/validation/localizer_final.json`.

## The other documents

| Document | Renderer | Sources |
|---|---|---|
| `../02_BCF_Brain_Design_and_Justification.md` | `tools_render_task2.py` | `doc02_parts/part1.md`, `part2.md`, `part3.md`, `../data/rca_merged.jsonl`, `../bcf-brain/src/bcf.py` (the two generated tables) |
| `../03_Validation_Results_and_Submission_Playbook.md` | `tools_render_task3.py` | `doc03.tpl.md`, `../bcf-brain/dist/MANIFEST.json`, `../bcf-brain/tests/test_bcf.py`, the result files in `../bcf-brain/validation/` and in the work folder |

## Data

| File in `../data/` | Content |
|---|---|
| `rca_merged.jsonl` | One record per task: category, sub-category, mechanism, route, specification gap, difficulty, drivers, the analysis text, and the deterministic features |
| `rca/batch_01.json` to `batch_13.json` | The coded records as written by the thirteen review passes |
| `rca_stats.json` | Every distribution quoted in Document 01 |
| `features.jsonl` | The deterministic features of step 2 |
| `pack_features.jsonl` | The spec-sufficiency features of step 4 |

The repository snapshots and the analysis packs are not included; both are rebuilt from the competition zip with steps 3 and 4.

## The coding scheme

`RCA-SCHEMA.md` defines the closed lists: six categories (C1 to C6), seventeen engineering domains, sixteen root-cause mechanisms (R01 to R16), ten brain routes (P1 to P10), three levels of specification gap, a difficulty from 1 to 5, and seventeen difficulty drivers. The statement level (L1 to L4) is computed from the statement text and does not depend on a reviewer.
