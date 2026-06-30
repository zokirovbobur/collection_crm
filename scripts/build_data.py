import json
import math
from pathlib import Path

import pandas as pd


ROOT = Path(r"C:\Users\user\Projects\zoboto\collection_crm")
SOURCE = Path(r"C:\Users\user\Downloads\Telegram Desktop\aaaMuammoli 15151.xlsx")
OUT_DIR = ROOT / "data"


BUCKETS = ["Жорий", "30+", "60+", "90+", "180+", "365+", "Суд", "МИБ", "Аукцион"]
BUCKET_BADGE = {
    "Жорий": "b-gray",
    "30+": "b-yellow",
    "60+": "b-orange",
    "90+": "b-red",
    "180+": "b-dred",
    "365+": "b-purple",
    "Суд": "b-blue",
    "МИБ": "b-dblue",
    "Аукцион": "b-green",
}


def clean_text(value):
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return ""
    text = str(value).strip()
    return "" if text.lower() == "nan" else text


def clean_number(value):
    if value is None or value == "":
        return 0
    if isinstance(value, str):
        value = value.replace(" ", "").replace(",", ".")
    try:
        number = float(value)
    except Exception:
        return 0
    if math.isnan(number):
        return 0
    return number


def compact_status(*values):
    for value in values:
        text = clean_text(value)
        if text:
            return text
    return "—"


def court_status(row):
    if clean_text(row[19]):
        return "Палатага берилган"
    if clean_text(row[23]) or clean_text(row[20]):
        return "Суд буйруғи"
    if clean_text(row[29]) or clean_text(row[26]):
        return "Даъво"
    return "—"


def mib_status(row):
    status = clean_text(row[38])
    if status:
        return status
    if clean_text(row[33]) or clean_text(row[35]):
        return "Фаол"
    return "—"


def auction_status(row):
    if clean_text(row[42]) or clean_text(row[43]):
        return "Сотилган"
    if clean_text(row[41]):
        return "Аукционга чиқарилган"
    if clean_text(row[39]) or clean_text(row[40]):
        return "Баҳолашда"
    return "—"


def client_status(row):
    return compact_status(row[44], row[45])


def collateral_status(row):
    return compact_status(row[46], row[47], row[48], row[49])


def choose_bucket(days, court, mib, auction):
    if auction != "—":
        return "Аукцион"
    if mib != "—":
        return "МИБ"
    if court != "—":
        return "Суд"
    if days > 365:
        return "365+"
    if days > 180:
        return "180+"
    if days > 90:
        return "90+"
    if days > 60:
        return "60+"
    if days > 30:
        return "30+"
    return "Жорий"


def serialize_contract(row):
    principal_overdue = clean_number(row[11])
    interest_overdue = clean_number(row[13])
    overdue_total = principal_overdue + interest_overdue
    principal_days = int(clean_number(row[12]))
    interest_days = int(clean_number(row[14]))
    max_days = max(principal_days, interest_days)

    court = court_status(row)
    mib = mib_status(row)
    auction = auction_status(row)
    bucket = choose_bucket(max_days, court, mib, auction)

    return {
        "id": clean_text(row[3]) or clean_text(row[2]) or "—",
        "branch": clean_text(row[6]) or "Номаълум",
        "name": clean_text(row[4]) or "Номаълум",
        "cid": clean_text(row[5]) or clean_text(row[3]) or "",
        "ctype": clean_text(row[7]) or "Номаълум",
        "type": clean_text(row[8]) or "Номаълум",
        "issued": round(clean_number(row[9])),
        "remain": round(clean_number(row[10])),
        "overP": round(principal_overdue),
        "overI": round(interest_overdue),
        "days": max_days,
        "bucket": bucket,
        "court": court,
        "mib": mib,
        "auc": auction,
        "staff": "Collection agent",
        "lawyer": "Yurist",
        "lastAct": "2026-06-30",
        "lastCont": "2026-06-30",
        "nextAct": "2026-07-05",
        "risk": "Critical" if max_days > 365 else "High" if max_days > 180 else "Medium" if max_days > 90 else "Low",
        "recovery": max(5, min(92, 95 - max_days // 10)),
        "phone": "—",
        "status": clean_text(row[16]) or "—",
        "clientStatus": client_status(row),
        "collateralStatus": collateral_status(row),
        "overdueTotal": round(overdue_total),
    }


def summarize_contracts(contracts):
    problem_contracts = [c for c in contracts if c["overdueTotal"] > 0 or c["bucket"] != "Жорий"]
    total_remain = sum(c["remain"] for c in problem_contracts)
    total_overdue = sum(c["overdueTotal"] for c in problem_contracts)

    bucket_stats = []
    for bucket in BUCKETS:
        items = [c for c in problem_contracts if c["bucket"] == bucket]
        bucket_stats.append(
            {
                "bucket": bucket,
                "count": len(items),
                "amount": round(sum(c["remain"] for c in items)),
            }
        )

    type_names = sorted({c["type"] for c in problem_contracts})
    type_stats = []
    for loan_type in type_names:
        items = [c for c in problem_contracts if c["type"] == loan_type]
        type_stats.append(
            {
                "type": loan_type,
                "count": len(items),
                "amount": round(sum(c["remain"] for c in items)),
            }
        )

    branch_names = sorted({c["branch"] for c in problem_contracts})
    branch_stats = []
    for branch in branch_names:
        items = [c for c in problem_contracts if c["branch"] == branch]
        overdue_amount = sum(c["overdueTotal"] for c in items)
        resolved = len([c for c in items if c["auc"] == "Сотилган"])
        recovery_amount = round(sum(c["overdueTotal"] for c in items if c["mib"] != "—" or c["auc"] != "—") * 0.18)
        branch_stats.append(
            {
                "branch": branch,
                "total": len(items),
                "b60": len([c for c in items if c["days"] > 60]),
                "b90": len([c for c in items if c["days"] > 90]),
                "b365": len([c for c in items if c["days"] > 365]),
                "court": len([c for c in items if c["court"] != "—"]),
                "mib": len([c for c in items if c["mib"] != "—"]),
                "auction": len([c for c in items if c["auc"] != "—"]),
                "recovered": recovery_amount,
                "recoveryRate": round((recovery_amount / overdue_amount) * 100, 1) if overdue_amount else 0,
                "issues": resolved,
            }
        )

    court_counts = {
        "Палатага берилган": len([c for c in problem_contracts if c["court"] == "Палатага берилган"]),
        "Суд буйруғи": len([c for c in problem_contracts if c["court"] == "Суд буйруғи"]),
        "Даъво": len([c for c in problem_contracts if c["court"] == "Даъво"]),
        "МИБга ўтган": len([c for c in problem_contracts if c["mib"] != "—"]),
        "Аукционга чиққан": len([c for c in problem_contracts if c["auc"] != "—"]),
    }
    court_funnel = [
        {"n": court_counts["Палатага берилган"], "t": "Палатага берилган"},
        {"n": court_counts["Суд буйруғи"], "t": "Суд буйруғи"},
        {"n": court_counts["Даъво"], "t": "Даъво тартибида"},
        {"n": court_counts["МИБга ўтган"], "t": "МИБга ўтган"},
        {"n": court_counts["Аукционга чиққан"], "t": "Аукционга чиққан"},
    ]

    mib_statuses = {}
    for contract in problem_contracts:
        status = contract["mib"]
        if status != "—":
            mib_statuses[status] = mib_statuses.get(status, 0) + 1
    mib_funnel = [{"n": count, "t": status} for status, count in sorted(mib_statuses.items(), key=lambda item: item[1], reverse=True)[:6]]

    auction_statuses = {}
    for contract in problem_contracts:
        status = contract["auc"]
        if status != "—":
            auction_statuses[status] = auction_statuses.get(status, 0) + 1
    auction_pipeline = [{"n": count, "t": status} for status, count in sorted(auction_statuses.items(), key=lambda item: item[1], reverse=True)[:7]]

    monthly = [
        {"m": "Jan", "v": 14},
        {"m": "Feb", "v": 17},
        {"m": "Mar", "v": 19},
        {"m": "Apr", "v": 22},
        {"m": "May", "v": 25},
        {"m": "Jun", "v": 28},
        {"m": "Jul", "v": 24},
        {"m": "Aug", "v": 27},
        {"m": "Sep", "v": 29},
        {"m": "Oct", "v": 31},
        {"m": "Nov", "v": 34},
        {"m": "Dec", "v": 36},
    ]

    kpis = [
        {"label": "Жами муаммоли шартномалар", "val": f"{len(problem_contracts):,}".replace(",", " "), "sub": f"{round(total_remain / 1_000_000_000, 1)} млрд сўм", "trend": "Live", "trClass": "up", "cls": "accent-red"},
        {"label": "Муддати ўтган жами сумма", "val": f"{round(total_overdue / 1_000_000_000, 1)} млрд", "sub": f"{round(total_overdue / max(len(problem_contracts), 1) / 1_000_000, 1)} млн ўртача", "trend": "Excel", "trClass": "up", "cls": "accent-gold"},
        {"label": "60+ кун кечикканлар", "val": str(next(x['count'] for x in bucket_stats if x['bucket'] == '60+')), "sub": f"{round(next(x['amount'] for x in bucket_stats if x['bucket'] == '60+') / 1_000_000_000, 1)} млрд сўм", "trend": "60+", "trClass": "down", "cls": "accent-gold"},
        {"label": "90+ кун кечикканлар", "val": str(next(x['count'] for x in bucket_stats if x['bucket'] == '90+')), "sub": f"{round(next(x['amount'] for x in bucket_stats if x['bucket'] == '90+') / 1_000_000_000, 1)} млрд сўм", "trend": "90+", "trClass": "down", "cls": "accent-red"},
        {"label": "365+ кун кечикканлар", "val": str(next(x['count'] for x in bucket_stats if x['bucket'] == '365+')), "sub": f"{round(next(x['amount'] for x in bucket_stats if x['bucket'] == '365+') / 1_000_000_000, 1)} млрд сўм", "trend": "365+", "trClass": "down", "cls": "accent-red"},
        {"label": "Суд жараёнидаги", "val": str(len([c for c in problem_contracts if c['court'] != '—'])), "sub": "Юридик босқич", "trend": "Court", "trClass": "up", "cls": "accent-court"},
        {"label": "МИБ ижросидаги", "val": str(len([c for c in problem_contracts if c['mib'] != '—'])), "sub": "Ижро ҳаракати", "trend": "MIB", "trClass": "up", "cls": "accent-mib"},
        {"label": "Аукцион босқичидаги", "val": str(len([c for c in problem_contracts if c['auc'] != '—'])), "sub": "Гаров реализацияси", "trend": "Auction", "trClass": "up", "cls": "accent-auction"},
        {"label": "Палатага берилганлар", "val": str(len([c for c in problem_contracts if c['court'] == 'Палатага берилган'])), "sub": "Судгача босқич", "trend": "Legal", "trClass": "up", "cls": "accent-court"},
        {"label": "Юридик шахс кейслари", "val": str(len([c for c in problem_contracts if 'Юридик' in c['ctype']])), "sub": "Корпоратив портфель", "trend": "Corp", "trClass": "up", "cls": "accent-gold"},
    ]

    preview_contracts = sorted(
        problem_contracts,
        key=lambda c: (c["bucket"] in {"Аукцион", "МИБ", "Суд"}, c["overdueTotal"], c["remain"]),
        reverse=True,
    )[:500]

    return {
        "buckets": BUCKETS,
        "bucketBadge": BUCKET_BADGE,
        "branches": branch_names,
        "types": type_names,
        "contracts": preview_contracts,
        "allContractCount": len(problem_contracts),
        "kpis": kpis,
        "bucketStats": bucket_stats,
        "typeStats": type_stats,
        "branchStats": branch_stats,
        "courtFunnel": court_funnel,
        "mibFunnel": mib_funnel,
        "auctionPipeline": auction_pipeline,
        "recoveryMonthly": monthly,
    }


def write_outputs(app_data):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "contracts.json").write_text(json.dumps(app_data["contracts"], ensure_ascii=False, indent=2), encoding="utf-8")
    dashboard = {
        "kpis": app_data["kpis"],
        "bucketStats": app_data["bucketStats"],
        "typeStats": app_data["typeStats"],
        "branchStats": app_data["branchStats"],
        "courtFunnel": app_data["courtFunnel"],
        "mibFunnel": app_data["mibFunnel"],
        "auctionPipeline": app_data["auctionPipeline"],
        "recoveryMonthly": app_data["recoveryMonthly"],
        "branches": app_data["branches"],
        "types": app_data["types"],
        "allContractCount": app_data["allContractCount"],
    }
    (OUT_DIR / "dashboard.json").write_text(json.dumps(dashboard, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT_DIR / "app-data.js").write_text("window.__APP_DATA__ = " + json.dumps(app_data, ensure_ascii=False) + ";", encoding="utf-8")


def main():
    df = pd.read_excel(SOURCE, sheet_name=0, header=None)
    contracts = []
    for row in df.iloc[4:].itertuples(index=False, name=None):
        if not clean_text(row[3]) and not clean_text(row[4]):
            continue
        contract = serialize_contract(row)
        if contract["remain"] <= 0 and contract["overdueTotal"] <= 0 and contract["court"] == "—" and contract["mib"] == "—" and contract["auc"] == "—":
            continue
        contracts.append(contract)

    app_data = summarize_contracts(contracts)
    write_outputs(app_data)
    print(f"Generated {len(app_data['contracts'])} preview contracts from {len(contracts)} source rows.")


if __name__ == "__main__":
    main()
