import math

N = None  # N/A

# id, source, pop, stakes, C1, C2, C3, C4, C5, compliance, recorded_total_in_scores_md
ROWS = [
    ("S-01","LEM-042","real","low", 2,2,N,0,2,"pass",8),
    ("S-03","LEM-002","real","low", 2,2,N,0,2,"pass",8),
    ("S-04","LEM-037","real","high",2,2,2,1,2,"pass",9),
    ("S-06","LEM-021","real","low", 2,2,2,2,2,"pass",10),
    ("S-07","LEM-045","real","low", 2,2,N,0,2,"pass",8),
    ("S-09","LEM-013","real","med", 2,2,2,2,2,"pass",10),
    ("S-10","LEM-030","real","high",2,1,2,2,2,"pass",9),
    ("S-11","LEM-009","real","med", 2,2,2,2,2,"pass",10),
    ("S-13","LEM-046","real","med", 2,2,2,2,2,"pass",10),
    ("S-14","LEM-020","real","high",2,2,2,1,2,"pass",9),
    ("S-16","LEM-004","real","low", 2,2,N,0,2,"pass",8),
    ("S-17","LEM-027","real","low", 2,2,N,1,2,"pass",9),
    ("S-19","LEM-036","real","med", 1,2,2,0,2,"pass",7),
    ("S-20","LEM-018","real","low", 2,2,2,2,2,"pass",10),
    ("S-22","LEM-031","real","med", 2,2,N,2,2,"pass",10),
    ("S-23","LEM-008","real","low", 2,2,2,1,2,"pass",9),
    ("S-24","LEM-053","real","low", 2,2,2,0,2,"pass",8),
    ("S-26","LEM-023","real","low", 2,2,N,1,1,"pass",8),
    ("S-27","LEM-040","real","high",0,N,2,0,2,"FAIL",5),
    ("S-29","LEM-017","real","med", 2,2,2,1,2,"pass",9),
    ("S-30","LEM-001","real","low", 2,2,N,1,2,"pass",9),
    ("S-32","LEM-028","real","med", 1,2,N,2,2,"pass",9),
    ("S-35","LEM-024","real","low", 2,2,N,1,1,"pass",8),
    ("S-36","LEM-015","real","med", 2,2,N,1,2,"pass",9),
    ("S-37","LEM-049","real","low", 2,2,2,0,2,"pass",8),
    ("S-39","LEM-022","real","med", 2,2,2,2,2,"pass",10),
    ("S-40","LEM-012","real","med", 2,2,2,2,2,"pass",10),
    ("S-41","LEM-038","real","med", 1,2,2,0,2,"pass",7),
    ("S-42","LEM-029","real","high",2,2,2,2,2,"pass",10),
    ("S-43","LEM-003","real","low", 2,2,2,1,2,"pass",9),
    ("S-44","LEM-019","real","low", 1,2,2,2,2,"pass",9),
    ("S-45","LEM-010","real","med", 2,2,2,N,2,"pass",10),
    ("S-46","LEM-043","real","low", 2,2,N,0,2,"pass",8),
    ("S-47","LEM-044","real","low", 2,2,N,0,2,"pass",8),
    ("S-48","LEM-026","real","med", 2,2,2,2,2,"pass",10),
    ("S-02","OFF-007","off","med", 0,2,1,0,1,"pass",4),
    ("S-05","OFF-003","off","low", 0,1,N,0,1,"pass",3),
    ("S-08","OFF-010","off","med", 1,2,0,0,1,"pass",4),
    ("S-12","OFF-001","off","low", 0,1,0,1,2,"pass",4),
    ("S-15","OFF-005","off","med", 2,2,0,N,2,"pass",8),
    ("S-18","OFF-011","off","med", 0,1,2,1,1,"pass",5),
    ("S-21","OFF-002","off","high",0,0,1,2,1,"FAIL",4),
    ("S-25","OFF-008","off","med", 1,2,0,0,1,"pass",4),
    ("S-28","OFF-012","off","high",0,0,2,1,2,"FAIL",5),
    ("S-31","OFF-004","off","high",1,2,0,0,1,"pass",4),
    ("S-34","OFF-009","off","high",1,2,0,0,1,"pass",4),
    ("S-38","OFF-006","off","low", 1,1,N,0,1,"pass",4),
]

# Fix 1: direct address is N/A where the format has no addressee by design.
C4_NA = {"LEM-042","LEM-002","LEM-045","LEM-004","LEM-036","LEM-053",
         "LEM-040","LEM-049","LEM-038","LEM-043","LEM-044","OFF-006"}
# Fix 2: register allows casual commentary *about* legal text (1 -> 2).
C1_FIX = {"LEM-036","LEM-038"}
# Fix 3: compliance veto now catches contradicting known policy.
COMP_FAIL = {"OFF-011"}


def total(cs):
    applicable = [c for c in cs if c is not None]
    return math.floor(sum(applicable) / (2 * len(applicable)) * 10 + 0.5)


def band(t, comp):
    if comp == "FAIL":
        return "veto"
    if any(c == 0 for c in (t if isinstance(t, list) else [])):
        pass
    return "publish" if t >= 9 else ("review" if t == 8 else "regenerate")


print("=== encoding check: recomputed original vs recorded in eval/scores.md ===")
bad = 0
for r in ROWS:
    sid, src, pop, stk, c1, c2, c3, c4, c5, comp, rec = r
    t = total([c1, c2, c3, c4, c5])
    if t != rec:
        print(f"  MISMATCH {sid} {src}: recomputed {t}, file says {rec}")
        bad += 1
print(f"  {len(ROWS)-bad}/{len(ROWS)} rows match the recorded totals\n")

new = []
for r in ROWS:
    sid, src, pop, stk, c1, c2, c3, c4, c5, comp, rec = r
    if src in C1_FIX:
        c1 = 2
    if src in C4_NA:
        c4 = N
    if src in COMP_FAIL:
        comp = "FAIL"
    t = total([c1, c2, c3, c4, c5])
    new.append((sid, src, pop, stk, c1, c2, c3, c4, c5, comp, t, rec))


def stats(pop):
    rows = [n for n in new if n[2] == pop]
    tots = [n[10] for n in rows]
    return rows, sum(tots) / len(tots)


real, real_mean = stats("real")
off, off_mean = stats("off")
print("=== after the fixes ===")
print(f"  real mean      {real_mean:.2f}   (was 8.80, target 9+)")
print(f"  off-brand mean {off_mean:.2f}   (was 4.42, target <=5)")
print(f"  gap            {real_mean-off_mean:.2f}   (was 4.38)\n")

no_outlier = [n[10] for n in real if n[1] != "LEM-040"]
print(f"  real mean excluding the deliberate LEM-040 outlier: {sum(no_outlier)/len(no_outlier):.2f}\n")

for pop, rows in (("real", real), ("off-brand", off)):
    b = {"publish": 0, "review": 0, "regenerate": 0, "veto": 0}
    for n in rows:
        b[band(n[10], n[9])] += 1
    tot = len(rows)
    print(f"  {pop} bands: " + ", ".join(
        f"{k} {v} ({v/tot*100:.0f}%)" for k, v in b.items()))

print("\n=== per-criterion means ===")
names = ["1 Register", "2 Humour", "3 Plain lang", "4 Direct addr", "5 Mechanics"]
old_gaps = [1.25, 0.64, 1.40, 0.55, 0.61]
print(f"  {'criterion':<15}{'real':>7}{'off':>7}{'gap':>7}{'was':>7}")
for i, nm in enumerate(names):
    rv = [n[4 + i] for n in real if n[4 + i] is not None]
    ov = [n[4 + i] for n in off if n[4 + i] is not None]
    rm, om = sum(rv) / len(rv), sum(ov) / len(ov)
    print(f"  {nm:<15}{rm:>7.2f}{om:>7.2f}{rm-om:>7.2f}{old_gaps[i]:>7.2f}")

print("\n=== every item whose band changed ===")
for n in new:
    sid, src, pop, stk, c1, c2, c3, c4, c5, comp, t, rec = n
    ob = band(rec, "FAIL" if (src == "LEM-040" or src in ("OFF-002", "OFF-012")) else "pass")
    nb = band(t, comp)
    if ob != nb or t != rec:
        print(f"  {sid} {src:<8} {pop:<4} {rec:>2} {ob:<10} -> {t:>2} {nb}")

print("\n=== overlap check ===")
worst_real = min(n[10] for n in real if n[9] != "FAIL")
best_off = max(n[10] for n in off if n[9] != "FAIL")
print(f"  lowest non-vetoed real item:      {worst_real}")
print(f"  highest non-vetoed off-brand item:{best_off}")
print(f"  off-brand items reaching review or above: "
      f"{sum(1 for n in off if n[10] >= 8 and n[9] != 'FAIL')}")
print(f"  real items an off-brand item out-scores: "
      f"{sum(1 for n in real if n[9] != 'FAIL' and n[10] < best_off)}  (was 2)")
