# WSL 环境推 GitHub 的方法

WSL 的 GnuTLS 握手对 GitHub API 和 git push 经常失败（SSL: UNEXPECTED_EOF_WHILE_READING）。绕道 PowerShell 是唯一稳定方案。

## 创建仓库

用 PowerShell 调 GitHub API：

```python
import subprocess
# 读 ~/.git-credentials 提取 token
with open("/home/chris47634/.git-credentials", "r") as f:
    cred = f.read().strip()
token = cred.split(":", 2)[2].split("@")[0]

ps_script = f'''
$headers = @{{
    "Authorization" = "token {token}"
    "Accept" = "application/vnd.github.v3+json"
    "User-Agent" = "koubo-skill"
}}
$body = @{{
    name = "repo-name"
    description = "描述"
    private = $false
    auto_init = $false
}} | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
Write-Output "OK: $($resp.full_name) $($resp.html_url)"
'''
result = subprocess.run(["powershell.exe", "-Command", ps_script], capture_output=True, text=True, timeout=30)
print(result.stdout.strip())
```

## 推送代码

1. 把文件复制到 Windows 临时目录（排除 .git）
2. 用 PowerShell git clone 空仓库到 Windows 临时目录
3. 复制文件进去，git add/commit/push

```bash
# WSL 侧复制
cp -r /tmp/my-project /mnt/c/Users/25128/AppData/Local/Temp/my-project-copy
rm -rf /mnt/c/Users/25128/AppData/Local/Temp/my-project-copy/.git
```

```powershell
# PowerShell 侧
Set-Location 'C:\Users\25128\AppData\Local\Temp'
git clone https://user:***@github.com/user/repo.git repo-push
Set-Location repo-push
Get-ChildItem -Path '..\my-project-copy' -Exclude '.git','node_modules' | Copy-Item -Destination '.' -Recurse -Force
git add -A
git commit -m "init"
git branch -M main
git push -u origin main
```

## 注意事项

- **不要在 WSL 里直接 git push**，GnuTLS 必挂
- **不要用 Python urllib 调 GitHub API**，SSL 同样挂
- **PowerShell 的 git credential helper 默认是 Windows 侧的**，能直接用
- **CRLF 警告无害**，Windows 侧 git 默认 autocrlf=true
- 推完清理 Windows 临时目录
- Python `subprocess.run(["powershell.exe", ...])` 的 stdout 可能有 GBK 编码问题，遇到 UnicodeDecodeError 用 `errors='replace'` 或直接在 PowerShell 内处理输出
