# 常见问题与踩坑记录

## 渲染相关

### TMPDIR 问题
**症状**：`ENOENT: no such file or directory, open 'C:\Users\...\Temp/remotion-webpack-bundle-xxx/bundle.js'`
**原因**：WSL 的 TMPDIR 指向 Windows temp 路径，webpack bundle 写到 Windows 侧但 Remotion 从 Linux 侧读
**解决**：渲染时设 `TMPDIR=/tmp`

### Composition ID 错误
**症状**：`Could not find composition with ID MainComposition`
**原因**：Root.tsx 中 id 是 `"main"` 不是 `"MainComposition"`
**解决**：`npx remotion render src/index.ts main ...`

### H.265 不兼容
**症状**：视频无法播放或渲染报错
**原因**：Remotion/浏览器不支持 H.265 编码
**解决**：`ffmpeg -i input.mp4 -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 128k public/input-video.mp4`

### Video muted 属性
**症状**：口播视频在预览中不播放
**原因**：浏览器自动播放策略要求视频 muted
**解决**：`<Video src={...} muted />`

## 字体相关

### 中文字体不显示
**症状**：字幕显示方块或空白
**原因**：字体文件未正确加载或路径错误
**解决**：用 @font-face + staticFile() 注册字体，确认 public/fonts/ 下有 LXGWWenKai-Regular.ttf

### @remotion/google-fonts 不可用
**症状**：中文字体加载失败
**原因**：@remotion/google-fonts 不支持 LXGW WenKai
**解决**：手动用 @font-face 注册本地字体文件

## 字幕相关

### subtitles.json 不同步
**症状**：渲染的字幕内容和预期不同
**原因**：修改了根目录 subtitles.json 但没复制到 src/
**解决**：`cp subtitles.json src/subtitles.json`

### 字幕时间戳重叠
**症状**：字幕闪烁或切换异常
**原因**：两条字幕的 start/end 时间重叠
**解决**：对齐脚本中自动修复重叠（midpoint 分割）

### SCHEDULE subIdx 偏移
**症状**：图片在错误的字幕出现
**原因**：字幕增删后 SCHEDULE 的 subIdx 没同步更新
**解决**：每次修改字幕后，检查所有 SCHEDULE 的 subIdx 是否对应

## 下载相关

### WSL SSL 不通
**症状**：requests/urllib 报 SSL: UNEXPECTED_EOF_WHIER_READING
**原因**：WSL 网络层 SSL 握手问题
**解决**：绕道 PowerShell `Invoke-WebRequest`，再 cp 到 WSL

### npm 安装慢
**症状**：npm install 卡住
**原因**：默认 registry 连接慢
**解决**：`npm install --registry=https://registry.npmmirror.com`

### 删 node_modules
**症状**：WSL 下 rm -rf node_modules 报 ENOTEMPTY
**原因**：Windows 文件系统残留
**解决**：从 Windows 侧删除 `powershell Remove-Item -Recurse -Force node_modules`

## 视频叠加相关

### 视频素材不播放
**症状**：弹入的视频素材是静止的
**原因**：Video 组件需要 muted 属性
**解决**：`<Video src={...} muted loop />`

### 视频 H.265 素材
**症状**：视频叠加无法渲染
**原因**：public/videos/ 中的视频也是 H.265
**解决**：同样需要 ffmpeg 转 H.264

## 沟通相关

### 不要问已知答案的问题
**场景**：用户问 Mode1 提交什么，你已经读过 skill 但还追问
**原因**：skill 里写得很清楚（口播视频+稿子），不需要确认
**教训**：问问题前先检查 skill 内容，已有的信息不要重复问用户

### anti-bot 网页打不开时用 scrapling
**场景**：浏览器工具打不开抖音等反爬网站
**原因**：browser_navigate 超时，curl 拿到的是 JS 加密壳
**解决**：用 `scrapling` skill 的 StealthyFetcher/DynamicFetcher，或直接 PowerShell 截屏看已打开的页面

## 参考视频调研相关

### 不能只看画面就开做
**场景**：用户发参考视频链接，要求"做成这样"
**错误做法**：只截几帧看视觉风格就开始搭模板
**正确做法**：深度调研 BGM/音效/节奏/剪辑频率/动画时机，全部搞清楚再动手
**Chris 原话（2026-06-11）**："一定要充分的调研清楚借鉴清楚才开始做"
**调研方法**：截多帧分析 + ffmpeg 提取音轨分析节奏 + vision_analyze 看截图

### UI 元素必须根据内容定制
**场景**：做测试视频时用了占位标签（"示例", "DEMO"）
**Chris 反馈**："旁边的ui你简单根据内容做一下呗"
**教训**：即使测试阶段，UI 元素也要根据稿子语义写具体内容，不能用泛泛占位符

### 干净风字幕必须中英双行
**场景**：干净风模板用单行中文字幕
**Chris 反馈**："一般都是上面是中文然后下面配个英文"
**参数**：中文 46px 上方 + 英文 28px 下方半透明
**数据格式**：subtitles.json 需要 `en` 字段

### UI 组件不要固定大小
**场景**：第一版组件用了固定 width/height
**Chris 反馈**："还有右侧的动画组件库，不要固定大小啊"
**教训**：所有 UI 组件必须自适应内容宽度，用 maxWidth 限制而非固定 width
**实现**：去掉固定 width，让内容撑开，只设 maxWidth 兜底

### 参考视频必须深度调研
**场景**：看了一下参考视频的截图就开始做模板
**Chris 反馈**："你到底有没有调研清楚啊，你好好看看别人怎么做的再做"
**正确做法**：逐段截10帧以上 + vision_analyze 详细分析每帧的 UI 元素/动画/布局 + 汇总视觉规律后再动手
**Chris 原话**：给你100亿token去调研，能不能做出来人家的效果？

### 右侧元素混搭太乱
**场景**：同一时间段右侧同时出现图片叠加+聊天窗口+信息卡片
**Chris 反馈**：右侧太乱，模板和截图混在一起
**正确做法**：每个时间段右侧只放一种主元素，或智能判断能搭配的一左一右

### 元素太小
**场景**：UI 组件只占画面一小块
**Chris 反馈**：参考视频的元素几乎占半屏
**正确做法**：右侧 640px（1/3画面），左侧 480px（1/4画面），高度可拉满

### 音效太小
**场景**：SFX 音量 0.3，几乎听不到
**Chris 反馈**：音效可以配的大一点
**正确做法**：默认音量 1.2（从 0.3 翻 4 倍）

### 动画衔接太紧
**场景**：元素退出和下一个元素进入之间没有呼吸空间
**Chris 反馈**：动画可以慢一点，不用衔接那么近
**正确做法**：默认留 0.8 秒余量，用户要求时用 1.5 秒

### 先扩充组件库再渲染
**场景**：Chris 说扩充组件库，你直接渲染了新视频
**Chris 反馈**：我让你扩充组件库，不是让你现在做视频
**正确做法**：只更新 E 盘组件库文件，不渲染。等 Chris 确认后再渲染验证。

### 调研 GitHub 再做组件
**场景**：凭自己经验写组件，样式不够精致
**Chris 反馈**：你自己去 GitHub 上探索一下看看需要加什么样的
**正确做法**：搜 GitHub 看别人怎么实现的（macOS 窗口、毛玻璃、spring 配置），参考最佳实践再写

## 组件开发踩坑

### Math.random() 在 Remotion 渲染中导致崩溃
**症状**：`Error inputRange must contain only numbers`，frame 0 就报错
**原因**：组件内用 `Math.random()` 生成 clipPath/位移等值，Remotion 渲染时每帧调用 render，random 值不可复现导致 inputRange 出现 NaN
**解决**：用确定性 hash 函数代替：
```typescript
const hash = (n: number) => ((n * 9301 + 49297) % 233280) / 233280;
const glitchX = (hash(frame) - 0.5) * 8;  // 确定性伪随机
```

### require("remotion") 不可用
**症状**：渲染报错或 hook 规则违反
**原因**：Remotion 用 ESM，`require()` 不走正确的模块路径
**解决**：始终用 `import { useCurrentFrame, Audio, staticFile } from "remotion"`

### SubtitleOverlay 必须传显式 props
**症状**：渲染报错或字幕不显示
**原因**：SubtitleOverlay 需要 text, en, startFrame, endFrame 四个 props
**错误写法**：`<SubtitleOverlay />`
**正确写法**：
```tsx
{subtitles.map((sub, i) => (
  <SubtitleOverlay
    key={i}
    text={sub.text}
    en={sub.en}
    startFrame={Math.round(sub.start * fps)}
    endFrame={Math.round(sub.end * fps)}
  />
))}
```

### NeonBorder 内文字被裁剪
**症状**：NeonBorder 容器内的 GlitchText/GlowText 被截断，只显示后半部分
**原因**：NeonBorder 是 inline-block 容器，文字从左侧开始写，容器宽度不够时右边溢出被裁
**解决**：NeonBorder 内层 div 加 `minWidth: 700` + `textAlign: "center"`：
```tsx
<NeonBorder enterFrame={135} exitFrame={205} color="#00D4FF">
  <div style={{ padding: "36px 60px", minWidth: 700, textAlign: "center" }}>
    <GlitchText text="GLITCH EFFECT" ... />
  </div>
</NeonBorder>
```

### 截桌面截图验证视频效果不可靠
**症状**：截图抓到的是桌面/终端窗口，不是视频内容
**原因**：终端窗口遮挡了视频播放器
**正确做法**：用 ffmpeg 从渲染好的 mp4 直接抽帧：
```bash
ffmpeg -y -ss 3 -i /tmp/remotion-demo/output.mp4 -frames:v 1 /tmp/verify_3s.png
```
然后对每张抽帧调用 `vision_analyze` 分析。不要依赖桌面截图。

### 数据面板字号太小看不清
**症状**：1920x1080 视频中 HudPanel/StatusIndicator 的文字太小
**原因**：默认字号 11-12px 在 1080p 视频中太小
**解决**：HudPanel 标签 13px+fontWeight:600，数值 22px+fontWeight:700，进度条 8px；StatusIndicator 圆点 10px，文字 14px

### 渲染被 kill（OOM）
**症状**：渲染到 90%+ 突然退出，exit_code=0
**原因**：并发渲染帧数过多，内存耗尽
**解决**：加 `--concurrency 1`，或减少同时渲染的组件数量

### execute_code 中 read_file 返回值的 key 不是 'content'
**症状**：`KeyError: 'content'` 或读到空字符串
**原因**：execute_code 内置的 `read_file()` 返回 dict 的 key 是 `content_returned`，不是 `content`
**解决**：用 `r.get('content_returned', '')` 或直接用 `terminal("cat file")` 读取

### execute_code heredoc 写入带行号的内容
**症状**：文件每行开头有 `1|`、`2|` 等前缀，esbuild 报 `Expected "(" but found "import"` 之类语法错误
**原因**：`terminal("cat > file << 'XEOF'\n{content}\nXEOF")` 中 content 如果包含 read_file 的行号前缀（`1|import React...`），会原样写入文件
**正确做法**：
1. 用 `write_file(path, content)` 而非 terminal heredoc
2. 如果必须用 terminal，先 strip 行号前缀
3. 批量 sed 后检查：`head -1 file | grep -q "^1|"` 来检测损坏

### 批量 sed 修改组件文件后需要验证
**症状**：某些文件被 sed 改坏但没注意到
**原因**：sed 替换可能匹配到非预期位置
**解决**：批量修改后运行语法检查：
```bash
# 检查文件是否被行号前缀损坏
for f in src/components/*.tsx; do
  head -1 "$f" | grep -q "^1|" && echo "CORRUPTED: $f"
done
# 修复
sed -i 's/^[0-9]*|//' corrupted_file.tsx
```

### Chris 要求所有组件整体放大
**场景**：组件字号/内边距/图标在 1080p 视频中太小
**Chris 反馈**："所有组件的大小全部都放大一点，里面的文字字号也需要调大"
**批量放大规则**（通过 regex 批量替换）：
- fontSize < 14 → +3
- fontSize 14-19 → +4
- fontSize 20-29 → +5
- fontSize 30-49 → +6
- fontSize >= 50 → +8
- padding < 20px → +4
- padding 20-39px → +6
- padding >= 40px → +8
- 图标容器 36-44px → +6，44-52px → +8，>52px → +10
- gap < 12 → +2，12-19 → +4，>=20 → +6
- borderRadius < 16 → +2，16-23 → +4，>=24 → +6

**注意**：某些组件用变量 `fontSize`（不是字面量），regex 匹配不到。需要手动改函数签名的默认值，如 `fontSize = 48` → `fontSize = 56`。
