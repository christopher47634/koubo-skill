# 图片搜索下载工作流

**图片完全由 AI 搜索下载，用户不提供。**

## 搜索策略

AI 分析稿子每句话，为需要配图的句子生成搜索关键词：

### 优先级规则

1. **具体品牌/产品名** → 直接搜品牌
   - "豆包" → 搜 "豆包AI界面" / "Doubao ByteDance"
   - "星巴克" → 搜 "Starbucks logo" / "星巴克门店"
   - "ChatGPT" → 搜 "ChatGPT interface" / "OpenAI ChatGPT"

2. **具体人物/角色** → 搜人物描述
   - "奶奶" → 搜 "老人用手机" / "grandmother smartphone"
   - "健身房教练" → 搜 "gym trainer sales" / "健身房销售"

3. **抽象概念** → 搜视觉隐喻
   - "被骗" → 搜 "scam warning" / "诈骗警示"
   - "改命" → 搜 "success promise" / "成功学海报"
   - "修仙" → 搜 "cultivation fantasy" / "玄幻修仙"

4. **场景描述** → 搜对应画面
   - "直播间" → 搜 "livestream selling" / "直播带货画面"
   - "敲键盘" → 搜 "MacBook typing" / "打字工作"
   - "刷手机" → 搜 "scrolling phone social media"

5. **数字/金额** → 搜相关画面
   - "3980" → 搜 "money stack cash" / "账单付款"
   - "月入三万" → 搜 "wealth luxury lifestyle"

### 指向性要求（硬约束）

- 图片必须让人一眼看出对应哪句话
- 不能用泛泛的"科技感""未来感"图片凑数
- 品牌名出现时优先用品牌logo或界面截图
- 场景描述时用真实场景照片，不用插画
- 如果搜不到精准图，宁可不加图也不将就

### 搜索来源

1. **Unsplash**：`https://images.unsplash.com/photo-{ID}?w=600&q=80`
   - 搜索页面：`https://unsplash.com/s/photos/KEYWORD`
   - 免费商用，质量高
2. **Pixabay**：`https://pixabay.com/api/?key=***&q=KEYWORD`
3. **品牌官网**：直接抓取 logo/截图
4. **维基百科**：`https://upload.wikimedia.org/...`
5. **Google 图片**：搜索后取直链

## WSL 下载方式

WSL 内 SSL 连接经常失败，必须绕道 Windows PowerShell：

```bash
# 单图
powershell.exe -Command "
Invoke-WebRequest -Uri 'IMAGE_URL' -OutFile 'C:\Users\25128\AppData\Local\Temp\dl.jpg' -TimeoutSec 15 -UseBasicParsing
"
cp /mnt/c/Users/25128/AppData/Local/Temp/dl.jpg /tmp/remotion-demo/public/images/target.jpg

# 批量
powershell.exe -Command "
\$images = @(
    @{url='URL1'; out='C:\Users\25128\AppData\Local\Temp\img1.jpg'},
    @{url='URL2'; out='C:\Users\25128\AppData\Local\Temp\img2.jpg'}
)
foreach (\$img in \$images) {
    try {
        Invoke-WebRequest -Uri \$img.url -OutFile \$img.out -TimeoutSec 15 -UseBasicParsing
        Write-Host \"OK: \$(\$img.url)\"
    } catch {
        Write-Host \"FAIL: \$(\$img.url) -> \$_\"
    }
}
"
```

## 图片规范

- 格式：JPG（优先）或 PNG
- 尺寸：600x400 ~ 800x600 横向
- 命名：语义化英文，如 `doubao.jpg`、`starbucks-logo.jpg`、`gym-sales.jpg`
- 临时素材：定稿后删除

## 插入密度规则

- 前半段（0%~40%）：每隔 3-5 句插一张
- 中段（40%~70%）：每隔 2-4 句插一张
- 后半段（70%~100%）：每隔 1-3 句插一张（节奏加快）
- 双图序列算一个插入点
- 不是每句都要有图，关键句才触发
