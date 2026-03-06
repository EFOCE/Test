"""
生成示例销售数据 sales_data.csv
运行一次即可，后续直接使用 sales_analysis.py 分析
"""
import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

random.seed(42)
np.random.seed(42)

products = {
    "笔记本电脑": ("电子产品", 4500, 800),
    "无线鼠标":   ("电子产品",  120,  25),
    "机械键盘":   ("电子产品",  350,  70),
    "显示器":     ("电子产品", 1800, 300),
    "耳机":       ("电子产品",  280,  60),
    "办公椅":     ("家具",     1200, 200),
    "站立式办公桌": ("家具",   2500, 400),
    "文件柜":     ("家具",      650, 100),
    "白板":       ("文具",      380,  60),
    "钢笔套装":   ("文具",      160,  30),
    "打印纸":     ("文具",       85,  10),
    "订书机":     ("文具",       45,   8),
    "运动水壶":   ("运动",       95,  20),
    "瑜伽垫":     ("运动",      200,  50),
    "跳绳":       ("运动",       35,   8),
}

regions = ["华北", "华东", "华南", "西南", "东北"]

rows = []
start_date = datetime(2024, 1, 1)
end_date   = datetime(2024, 12, 31)

for _ in range(800):
    date = start_date + timedelta(days=random.randint(0, (end_date - start_date).days))
    product, (category, base_price, base_profit) = random.choice(list(products.items()))
    quantity = random.randint(1, 20)

    # 加入价格波动
    price_factor  = np.random.normal(1.0, 0.1)
    profit_factor = np.random.normal(1.0, 0.3)   # 利润波动更大，制造负利润场景

    revenue = round(base_price * quantity * price_factor, 2)
    profit  = round(base_profit * quantity * profit_factor, 2)
    region  = random.choice(regions)

    rows.append({
        "Date":     date.strftime("%Y-%m-%d"),
        "Product":  product,
        "Category": category,
        "Revenue":  revenue,
        "Profit":   profit,
        "Quantity": quantity,
        "Region":   region,
    })

df = pd.DataFrame(rows).sort_values("Date").reset_index(drop=True)
df.to_csv("sales_data.csv", index=False, encoding="utf-8-sig")
print(f"sales_data.csv 已生成，共 {len(df)} 条记录。")
print(df.head())
