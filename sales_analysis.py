"""
销售数据统计与分析
-----------------
依赖: pandas, matplotlib, seaborn, openpyxl
用法: python sales_analysis.py [--csv sales_data.csv]
"""

import argparse
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")          # 非交互式后端，适合服务器/无 GUI 环境

import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import pandas as pd
import seaborn as sns

# ── 中文字体支持 ──────────────────────────────────────────────────────────────
plt.rcParams["font.family"] = ["WenQuanYi Micro Hei", "SimHei",
                                "Arial Unicode MS", "sans-serif"]
plt.rcParams["axes.unicode_minus"] = False


# ══════════════════════════════════════════════════════════════════════════════
# 1. 数据加载与清洗
# ══════════════════════════════════════════════════════════════════════════════

def load_data(filepath: str) -> pd.DataFrame:
    """读取 CSV 并做基础清洗。"""
    path = Path(filepath)
    if not path.exists():
        sys.exit(f"[错误] 找不到文件: {filepath}")

    df = pd.read_csv(path, parse_dates=["Date"])

    required = {"Date", "Product", "Category", "Revenue", "Profit", "Quantity", "Region"}
    missing = required - set(df.columns)
    if missing:
        sys.exit(f"[错误] CSV 缺少列: {missing}")

    # 删除关键列为空的行
    before = len(df)
    df.dropna(subset=list(required), inplace=True)
    dropped = before - len(df)
    if dropped:
        print(f"[清洗] 删除 {dropped} 条含空值记录，剩余 {len(df)} 条。")

    df["Revenue"]  = pd.to_numeric(df["Revenue"],  errors="coerce").fillna(0)
    df["Profit"]   = pd.to_numeric(df["Profit"],   errors="coerce").fillna(0)
    df["Quantity"] = pd.to_numeric(df["Quantity"], errors="coerce").fillna(0).astype(int)

    # 衍生字段
    df["YearMonth"]      = df["Date"].dt.to_period("M")
    df["ProfitMargin"]   = df.apply(
        lambda r: r["Profit"] / r["Revenue"] if r["Revenue"] != 0 else 0, axis=1
    )
    return df


# ══════════════════════════════════════════════════════════════════════════════
# 2. 基础统计
# ══════════════════════════════════════════════════════════════════════════════

def basic_stats(df: pd.DataFrame) -> dict:
    total_revenue    = df["Revenue"].sum()
    total_profit     = df["Profit"].sum()
    avg_order_amount = df["Revenue"].mean()
    overall_margin   = total_profit / total_revenue if total_revenue else 0
    order_count      = len(df)

    stats = {
        "订单总数":     order_count,
        "总销售额":     total_revenue,
        "总利润":       total_profit,
        "平均订单金额": avg_order_amount,
        "整体利润率":   overall_margin,
    }

    _section("基础统计")
    print(f"  订单总数     : {order_count:>10,} 条")
    print(f"  总销售额     : {total_revenue:>12,.2f} 元")
    print(f"  总利润       : {total_profit:>12,.2f} 元")
    print(f"  平均订单金额 : {avg_order_amount:>12,.2f} 元")
    print(f"  整体利润率   : {overall_margin:>11.2%}")
    return stats


# ══════════════════════════════════════════════════════════════════════════════
# 3. 多维度分析
# ══════════════════════════════════════════════════════════════════════════════

def monthly_trend(df: pd.DataFrame) -> pd.DataFrame:
    """按月汇总销售趋势。"""
    monthly = (
        df.groupby("YearMonth")
          .agg(Revenue=("Revenue", "sum"),
               Profit=("Profit", "sum"),
               Orders=("Revenue", "count"))
          .reset_index()
    )
    monthly["ProfitMargin"] = monthly["Profit"] / monthly["Revenue"]
    monthly["Month"] = monthly["YearMonth"].dt.strftime("%Y-%m")

    _section("月度销售趋势")
    print(monthly[["Month", "Revenue", "Profit", "ProfitMargin", "Orders"]]
          .to_string(index=False,
                     formatters={
                         "Revenue":      lambda x: f"{x:>12,.2f}",
                         "Profit":       lambda x: f"{x:>10,.2f}",
                         "ProfitMargin": lambda x: f"{x:>8.2%}",
                         "Orders":       lambda x: f"{x:>6}",
                     }))
    return monthly


def top_products(df: pd.DataFrame, n: int = 5) -> pd.DataFrame:
    """销售额 Top-N 产品。"""
    top = (
        df.groupby("Product")
          .agg(Revenue=("Revenue", "sum"),
               Profit=("Profit", "sum"),
               Quantity=("Quantity", "sum"),
               Orders=("Revenue", "count"))
          .sort_values("Revenue", ascending=False)
          .head(n)
          .reset_index()
    )
    top["ProfitMargin"] = top["Profit"] / top["Revenue"]

    _section(f"销售额 Top-{n} 产品")
    print(top[["Product", "Revenue", "Profit", "ProfitMargin", "Quantity", "Orders"]]
          .to_string(index=False,
                     formatters={
                         "Revenue":      lambda x: f"{x:>12,.2f}",
                         "Profit":       lambda x: f"{x:>10,.2f}",
                         "ProfitMargin": lambda x: f"{x:>8.2%}",
                         "Quantity":     lambda x: f"{x:>8}",
                         "Orders":       lambda x: f"{x:>6}",
                     }))
    return top


def regional_performance(df: pd.DataFrame) -> pd.DataFrame:
    """各地区销售对比。"""
    region = (
        df.groupby("Region")
          .agg(Revenue=("Revenue", "sum"),
               Profit=("Profit", "sum"),
               Quantity=("Quantity", "sum"),
               Orders=("Revenue", "count"))
          .sort_values("Revenue", ascending=False)
          .reset_index()
    )
    region["ProfitMargin"]   = region["Profit"] / region["Revenue"]
    region["RevenueShare"]   = region["Revenue"] / region["Revenue"].sum()

    _section("地区销售对比")
    print(region[["Region", "Revenue", "Profit", "ProfitMargin",
                  "RevenueShare", "Quantity", "Orders"]]
          .to_string(index=False,
                     formatters={
                         "Revenue":      lambda x: f"{x:>12,.2f}",
                         "Profit":       lambda x: f"{x:>10,.2f}",
                         "ProfitMargin": lambda x: f"{x:>8.2%}",
                         "RevenueShare": lambda x: f"{x:>8.2%}",
                         "Quantity":     lambda x: f"{x:>8}",
                         "Orders":       lambda x: f"{x:>6}",
                     }))
    return region


# ══════════════════════════════════════════════════════════════════════════════
# 4. 数据异常提醒
# ══════════════════════════════════════════════════════════════════════════════

def anomaly_detection(df: pd.DataFrame) -> pd.DataFrame:
    """找出利润率为负的订单。"""
    neg = df[df["ProfitMargin"] < 0].copy()
    neg_sorted = neg.sort_values("ProfitMargin")

    _section("异常订单：利润率为负")
    if neg_sorted.empty:
        print("  未发现利润率为负的订单。")
    else:
        print(f"  共发现 {len(neg_sorted)} 条利润率为负的订单：\n")
        display_cols = ["Date", "Product", "Category", "Region",
                        "Revenue", "Profit", "ProfitMargin", "Quantity"]
        print(neg_sorted[display_cols].to_string(
            index=False,
            formatters={
                "Date":         lambda x: str(x)[:10],
                "Revenue":      lambda x: f"{x:>10,.2f}",
                "Profit":       lambda x: f"{x:>9,.2f}",
                "ProfitMargin": lambda x: f"{x:>8.2%}",
                "Quantity":     lambda x: f"{x:>8}",
            }))
    return neg_sorted


# ══════════════════════════════════════════════════════════════════════════════
# 5. 可视化
# ══════════════════════════════════════════════════════════════════════════════

def plot_dashboard(monthly: pd.DataFrame,
                   top: pd.DataFrame,
                   region: pd.DataFrame,
                   output: str = "sales_dashboard.png"):
    """生成 2×2 仪表盘图表并保存。"""
    palette = sns.color_palette("muted")
    fig, axes = plt.subplots(2, 2, figsize=(16, 10))
    fig.suptitle("销售数据分析仪表盘", fontsize=16, fontweight="bold", y=1.01)

    months = monthly["Month"].tolist()

    # ── (0,0) 月度销售额柱状图 + 利润折线 ──────────────────────────────────
    ax1 = axes[0, 0]
    ax1_r = ax1.twinx()
    bars = ax1.bar(months, monthly["Revenue"] / 1e4,
                   color=palette[0], alpha=0.75, label="销售额（万元）")
    line = ax1_r.plot(months, monthly["ProfitMargin"] * 100,
                      color=palette[1], marker="o", linewidth=2, label="利润率（%）")
    ax1.set_title("月度销售额与利润率趋势")
    ax1.set_ylabel("销售额（万元）")
    ax1_r.set_ylabel("利润率（%）")
    ax1.set_xticks(range(len(months)))
    ax1.set_xticklabels(months, rotation=45, ha="right", fontsize=8)
    # 合并图例
    h1, l1 = ax1.get_legend_handles_labels()
    h2, l2 = ax1_r.get_legend_handles_labels()
    ax1.legend(h1 + h2, l1 + l2, loc="upper left", fontsize=8)

    # ── (0,1) Top-5 产品水平条形图 ─────────────────────────────────────────
    ax2 = axes[0, 1]
    top_rev = top.sort_values("Revenue")
    ax2.barh(top_rev["Product"], top_rev["Revenue"] / 1e4,
             color=palette[2], alpha=0.8)
    ax2.set_title(f"销售额 Top-{len(top)} 产品")
    ax2.set_xlabel("销售额（万元）")
    for bar, val in zip(ax2.patches, top_rev["Revenue"]):
        ax2.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height() / 2,
                 f"{val/1e4:.1f}",
                 va="center", fontsize=8)
    ax2.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"{x:.0f}"))

    # ── (1,0) 地区销售额饼图 ───────────────────────────────────────────────
    ax3 = axes[1, 0]
    wedges, texts, autotexts = ax3.pie(
        region["Revenue"],
        labels=region["Region"],
        autopct="%1.1f%%",
        colors=sns.color_palette("pastel", len(region)),
        startangle=140,
    )
    for at in autotexts:
        at.set_fontsize(8)
    ax3.set_title("各地区销售额占比")

    # ── (1,1) 地区利润率对比条形图 ────────────────────────────────────────
    ax4 = axes[1, 1]
    colors = [palette[3] if m >= 0 else "tomato" for m in region["ProfitMargin"]]
    ax4.bar(region["Region"], region["ProfitMargin"] * 100, color=colors, alpha=0.85)
    ax4.axhline(0, color="black", linewidth=0.8, linestyle="--")
    ax4.set_title("各地区利润率对比")
    ax4.set_ylabel("利润率（%）")
    ax4.set_xlabel("地区")
    for i, (reg, margin) in enumerate(zip(region["Region"], region["ProfitMargin"])):
        ax4.text(i, margin * 100 + 0.3, f"{margin:.1%}", ha="center", fontsize=8)

    plt.tight_layout()
    fig.savefig(output, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"\n  图表已保存至: {output}")


# ══════════════════════════════════════════════════════════════════════════════
# 6. 导出 Excel
# ══════════════════════════════════════════════════════════════════════════════

def export_excel(df: pd.DataFrame,
                 monthly: pd.DataFrame,
                 top: pd.DataFrame,
                 region: pd.DataFrame,
                 anomaly: pd.DataFrame,
                 output: str = "sales_summary.xlsx"):
    """将各分析结果写入多 sheet 的 Excel 文件。"""
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        # Sheet 1: 原始数据（格式化日期）
        raw = df.copy()
        raw["Date"] = raw["Date"].dt.strftime("%Y-%m-%d")
        raw["ProfitMargin"] = raw["ProfitMargin"].map("{:.2%}".format)
        raw.drop(columns=["YearMonth"], errors="ignore").to_excel(
            writer, sheet_name="原始数据", index=False)

        # Sheet 2: 月度趋势
        m_out = monthly.copy()
        m_out["ProfitMargin"] = m_out["ProfitMargin"].map("{:.2%}".format)
        m_out[["Month", "Revenue", "Profit", "ProfitMargin", "Orders"]].to_excel(
            writer, sheet_name="月度趋势", index=False)

        # Sheet 3: Top 产品
        t_out = top.copy()
        t_out["ProfitMargin"] = t_out["ProfitMargin"].map("{:.2%}".format)
        t_out[["Product", "Revenue", "Profit", "ProfitMargin",
               "Quantity", "Orders"]].to_excel(
            writer, sheet_name="Top产品", index=False)

        # Sheet 4: 地区对比
        r_out = region.copy()
        r_out["ProfitMargin"] = r_out["ProfitMargin"].map("{:.2%}".format)
        r_out["RevenueShare"] = r_out["RevenueShare"].map("{:.2%}".format)
        r_out[["Region", "Revenue", "Profit", "ProfitMargin",
               "RevenueShare", "Quantity", "Orders"]].to_excel(
            writer, sheet_name="地区对比", index=False)

        # Sheet 5: 异常订单
        if not anomaly.empty:
            a_out = anomaly.copy()
            a_out["Date"] = a_out["Date"].dt.strftime("%Y-%m-%d")
            a_out["ProfitMargin"] = a_out["ProfitMargin"].map("{:.2%}".format)
            a_out.drop(columns=["YearMonth"], errors="ignore").to_excel(
                writer, sheet_name="负利润订单", index=False)

    _section("Excel 导出")
    print(f"  汇总文件已保存至: {output}")
    print(f"  包含工作表: 原始数据 / 月度趋势 / Top产品 / 地区对比 / 负利润订单")


# ══════════════════════════════════════════════════════════════════════════════
# 工具函数
# ══════════════════════════════════════════════════════════════════════════════

def _section(title: str):
    width = 60
    print(f"\n{'═' * width}")
    print(f"  {title}")
    print(f"{'─' * width}")


# ══════════════════════════════════════════════════════════════════════════════
# 主程序
# ══════════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="销售数据统计与分析")
    parser.add_argument("--csv",   default="sales_data.csv",     help="输入 CSV 路径")
    parser.add_argument("--chart", default="sales_dashboard.png", help="图表输出路径")
    parser.add_argument("--excel", default="sales_summary.xlsx",  help="Excel 输出路径")
    parser.add_argument("--top",   default=5, type=int,           help="Top-N 产品数量")
    args = parser.parse_args()

    print("=" * 60)
    print("  销售数据分析系统  v1.0")
    print("=" * 60)

    # 1. 加载数据
    df = load_data(args.csv)
    print(f"\n  数据区间: {df['Date'].min().date()} ~ {df['Date'].max().date()}")
    print(f"  记录总数: {len(df):,} 条")

    # 2. 基础统计
    basic_stats(df)

    # 3. 多维度分析
    monthly = monthly_trend(df)
    top     = top_products(df, n=args.top)
    region  = regional_performance(df)

    # 4. 异常检测
    anomaly = anomaly_detection(df)

    # 5. 可视化
    _section("生成可视化图表")
    plot_dashboard(monthly, top, region, output=args.chart)

    # 6. 导出 Excel
    export_excel(df, monthly, top, region, anomaly, output=args.excel)

    print(f"\n{'═' * 60}")
    print("  分析完成！")
    print(f"{'═' * 60}\n")


if __name__ == "__main__":
    main()
