# KPIs

Every number comes from `ledger.csv`; `baselines.yml` contains assumptions that Lemonade can
replace without changing the calculation.

- **Auto-publish rate:** auto-published rows divided by all completed rows.
- **First-pass approval rate:** approved rows with zero revisions divided by approved rows.
- **Revisions per approved piece:** total revisions divided by approved rows.
- **Corrections per piece:** open and resolved corrections divided by completed pieces.
- **Compliance blocks:** rows whose outcome is blocked by the veto.
- **Cost per approved piece:** API cost divided by auto-published and reviewed rows.
- **Minutes saved:** full baseline for auto-published; baseline × reviewed multiplier for reviewed;
  subtract minutes per revision. These are estimates, not observed time studies.
