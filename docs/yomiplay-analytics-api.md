# YomiPlay 匿名使用统计 — 接口与事件清单

> 状态：已实现（2026-10-10）。iOS 与 Android 共用。
> 上线前：在 Supabase SQL Editor 执行 `supabase/yomiplay_analytics.sql`（建表 + 统计函数），并开启 pg_cron 定时清理（文件末尾）。
> 对应 YomiPlay 产品计划 P0-2（`yomi-play/docs/product-roadmap.md`）。

## 1. 目的与原则

**要回答的问题**

1. 新用户卡在哪一步：装好 → 第一次导入 → 第一次识别完成 → 第一次播放 → 第一次收词 → 第二天还回来。
2. 哪些功能真的有人用：精听模式、跟读、暗记、讲解、导出视频、句子边界对齐……
3. 付费墙在哪里出现得最多，哪里转化。

**隐私底线**（写进 App 隐私说明，也是服务端校验的依据）

- **身份**：只用 `install_id`，即每次安装随机生成的 UUID。不用 IDFA / 广告 ID，不跨 App 关联，不和登录账号关联，因此不需要 ATT（App Tracking Transparency，iOS 的追踪授权弹窗）授权。
- **内容**：只收事件名和**枚举型 / 计数型**参数。字幕、标题、文件名、URL、词条内容、搜索词一律不收。服务端按白名单丢弃未知字段。
- **网络信息**：不存 IP，只存国家代码（来自托管平台的地理头，如 `x-vercel-ip-country`）。
- **关闭开关**：App 设置里有「帮助改进 YomiPlay」开关，默认开。关闭后立即停止记录，并清空本机未上报的事件。
- **App Store 隐私标签**：使用数据 → 产品交互，**不与身份关联、不用于追踪**。

## 2. 接口

### POST `/api/yomiplay/v1/events` — 批量上报

无需 Token，支持 CORS（与社区接口一致）。运行时用 Node（写库用 service role）。

**请求体**

```json
{
  "install_id": "8F0C2A6E-1B7D-4F7E-9C2B-6C1D2E3F4A5B",
  "platform": "ios",
  "app_version": "2.2",
  "build": "26",
  "os_version": "18.6",
  "device_class": "phone",
  "memory_tier": "normal",
  "locale": "zh-Hans",
  "is_pro": false,
  "events": [
    { "name": "app_open", "ts": "2026-10-10T08:01:12Z" },
    { "name": "import_started", "ts": "2026-10-10T08:02:40Z", "props": { "source": "podcast_search" } },
    { "name": "recognition_completed", "ts": "2026-10-10T08:05:03Z",
      "props": { "model": "small", "language": "ja", "duration_bucket": "5_20m" } }
  ]
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `install_id` | UUID 字符串 | 每次安装生成一次，存本机（不进 iCloud 备份恢复——见 §4） |
| `platform` | `ios` / `android` | |
| `app_version` / `build` | string | |
| `os_version` | string | 只到小版本，如 `18.6` |
| `device_class` | `phone` / `pad` | |
| `memory_tier` | `low` / `normal` / `high` | iOS：`DeviceCapability`（< 3.5GB / 其余 / ≥ 8GB） |
| `locale` | string | App 界面语言（`zh-Hans` / `zh-Hant` / `en` / `ja`） |
| `is_pro` | bool | 上报时的状态 |
| `events[].name` | string | 必须在 §3 白名单里，否则丢弃 |
| `events[].ts` | ISO 8601 | 客户端时间。早于 30 天前或晚于服务器时间 1 天的丢弃 |
| `events[].props` | object，可选 | 只收该事件白名单里的键；值只能是字符串（枚举）、整数、布尔 |

**限制**：每批 ≤ 100 条，请求体 ≤ 64 KB，超出返回 `413`。

**响应**

```json
{ "accepted": 3, "rejected": 0 }
```

| 状态码 | 含义 | 客户端处理 |
|---|---|---|
| 200 | 已接收（`rejected` 是被丢弃的条数，比如事件名未知、时间越界） | 删除本批 |
| 400 | 请求体格式错误 | 删除本批（重发也不会成功） |
| 413 | 太大 | 拆小重发 |
| 429 / 5xx / 网络错误 | | 保留，下次再发 |

服务端同时 upsert `yomiplay_installs` 一行（见 §5），用来算日活和留存，不用扫事件表。

## 3. 事件清单（白名单）

参数一律是枚举或计数。`*_bucket` 是分档，不传原始数值。

### 生命周期

| 事件 | 何时 | 参数 |
|---|---|---|
| `app_first_launch` | 首次启动（生成 install_id 时）。统计从 2.2 开始，老用户升级后第一次打开也会记 | `existing_user`: bool — 本机已有旧数据（记录 / 词库 / 示例已播种），即升级或恢复上来的，不是新用户（App 2.3 起带；更早的事件没有这个字段） |
| `app_open` | 进入前台，距上次 `app_open` ≥ 30 分钟才记 | — |
| `sample_opened` | 打开首次启动的示例内容 | — |

### 导入与识别

| 事件 | 何时 | 参数 |
|---|---|---|
| `import_started` | 开始导入（已过付费墙、预检） | `source`: `podcast_search` / `url` / `local_file` / `zip` / `photos` / `tts` / `community` / `share_sheet` / `yomi_replace` |
| `import_failed` | 导入失败 | `source`，`reason`: `disk_space` / `icloud` / `unsupported` / `network` / `other` |
| `recognition_completed` | 识别成功完成 | `model`: `tiny` / `base` / `small` / `medium` / `large`；`language`: `ja` / `en` / `zh` / `auto`；`duration_bucket`: `lt5m` / `5_20m` / `20_60m` / `gt60m` |
| `recognition_failed` | 识别失败 / 取消 | `model`，`reason`: `cancelled` / `memory` / `error` |

### 播放与学习

| 事件 | 何时 | 参数 |
|---|---|---|
| `player_opened` | 打开播放页 | `media`: `audio` / `video`；`has_translation`: bool；`orientation`: `portrait` / `landscape` |
| `playback_preset_selected` | 选精听 / 普通播放 | `preset`: `intensive` / `normal` |
| `translation_run` | 「翻译全部」完成 | `engine`: `system` / `ai`；`segments_bucket`: `lt50` / `50_200` / `gt200` |
| `shadowing_completed` | 一次跟读出分 | `engine`: `speech_analyzer` / `sf_speech` / `whisper`；`score_bucket`: `lt60` / `60_79` / `gte80` |
| `annotation_saved` | 保存一条讲解 | `has_text` / `has_image` / `has_video`: bool |
| `boundary_check_run` | 检查句子边界完成 | `scope`: `document` / `line` / `batch`；`result`: `changed` / `nothing` / `no_silence` / `unreadable` |

### 暗记

| 事件 | 何时 | 参数 |
|---|---|---|
| `vocab_item_added` | 新增一条（合并不算） | `type`: `word` / `sentence` / `passage` / `note`；`from`: `player` / `manual` / `ocr` / `quick_lookup` / `how_to_say` / `yomicard` / `promote`（例句或句中的词升成独立条目） |
| `vocab_quota_hit` | 免费额度挡住新增 | `from`（同上） |
| `vocab_session_completed` | 完成一次今日学习 / 复习 | `new_count`: int；`review_count`: int |
| `vocab_book_exported` | 导出 `.yomibook` | — |
| `vocab_book_imported` | 导入 `.yomibook` | `partial`: bool（只导了前 N 条） |
| `vocab_ai_deck_generated` | AI 生成暗记本 | — |

### 导出与分享

| 事件 | 何时 | 参数 |
|---|---|---|
| `video_export_completed` | 烧录视频导出成功 | `layout`: `landscape` / `portrait`；`range`: `all` / `partial`；`marked_only`: bool；`badge`: bool；`end_card`: bool；`duration_bucket`: `lt1m` / `1_5m` / `5_20m` |
| `file_exported` | 导出字幕 / 资料 | `format`: `yomi` / `srt` / `zip` |

### 变现

| 事件 | 何时 | 参数 |
|---|---|---|
| `paywall_shown` | 付费墙出现 | `trigger`: `local_import` / `zip` / `photos` / `tts` / `share_sheet` / `community` / `recognition_quota` / `vocab_quota` / `album_limit` / `video_export` / `ai_deck` / `book_import_full` / `settings` |
| `purchase_completed` | 购买成功 | `product`: `monthly` / `yearly` / `lifetime`；`trigger`（同上，记最近一次付费墙） |
| `review_prompt_requested` | 调用系统评分弹窗（P0-5） | `moment`: `vocab_session` / `video_export` |

### 数据

| 事件 | 何时 | 参数 |
|---|---|---|
| `backup_completed` | 备份完成 | `kind`: `auto` / `manual` |
| `restore_completed` | 恢复完成 | — |

### 唤起（二期，见 §7）

| 事件 | 何时 | 参数 |
|---|---|---|
| `push_opened` | 点推送打开 App | `campaign_id`: string（服务端生成的 id，不是内容） |

> 加事件 = 同时改服务端白名单（`src/lib/yomi-analytics-events.ts`）和本文档。白名单里没有的事件直接丢弃，不报错。

## 4. 客户端行为（iOS）

- 新建 `AnalyticsService`（`nonisolated` 写盘）：
  - 事件追加到 `Library/Caches/analytics-queue.jsonl`，最多保留 1000 条，超出丢最旧的。
  - 上报时机：进入后台时，以及启动后 10 秒。至少攒到 1 条才发，每批 ≤ 100 条。
  - 失败按 §2 的表格处理，不重试轰炸（每次启动或进后台最多发一轮）。
- `install_id` 存 UserDefaults，并加入备份恢复的 `skippedSettingPrefixes`：恢复到新手机算新安装，不继承旧 id。
- 「帮助改进 YomiPlay」关闭：停止记录、删除队列文件。不删服务端历史（匿名，无法也不需要按人删）。
- DEBUG 构建不上报（或上报到 `platform: "ios-debug"`，查询时排除）。

## 5. 数据表（Supabase）

```sql
-- 原始事件：保留 180 天
CREATE TABLE IF NOT EXISTS yomiplay_events (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  install_id  uuid        NOT NULL,
  name        text        NOT NULL,
  props       jsonb       NOT NULL DEFAULT '{}'::jsonb,
  client_ts   timestamptz NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  platform    text        NOT NULL,
  app_version text        NOT NULL,
  is_pro      boolean     NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS idx_events_name_ts    ON yomiplay_events (name, client_ts DESC);
CREATE INDEX IF NOT EXISTS idx_events_install_ts ON yomiplay_events (install_id, client_ts);
ALTER TABLE yomiplay_events ENABLE ROW LEVEL SECURITY;   -- 无公开策略：只有 service role 能读写

-- 每个安装一行：首末次出现、最新环境。日活 / 留存从这里和 app_open 算
CREATE TABLE IF NOT EXISTS yomiplay_installs (
  install_id   uuid PRIMARY KEY,
  platform     text NOT NULL,
  first_seen   timestamptz NOT NULL DEFAULT now(),
  last_seen    timestamptz NOT NULL DEFAULT now(),
  app_version  text NOT NULL,
  os_version   text,
  device_class text,
  memory_tier  text,
  locale       text,
  country      text,          -- 国家代码，不存 IP
  is_pro       boolean NOT NULL DEFAULT false
);
ALTER TABLE yomiplay_installs ENABLE ROW LEVEL SECURITY;

-- 清理：Supabase 定时任务（pg_cron）每天执行
-- DELETE FROM yomiplay_events WHERE client_ts < now() - interval '180 days';
```

## 6. 常用查询

```sql
-- 新手漏斗：最近 30 天新安装中，各步骤至少做过一次的人数
WITH cohort AS (
  SELECT install_id FROM yomiplay_installs WHERE first_seen > now() - interval '30 days'
)
SELECT name, count(DISTINCT e.install_id)
FROM yomiplay_events e JOIN cohort USING (install_id)
WHERE name IN ('app_first_launch','import_started','recognition_completed','player_opened','vocab_item_added')
GROUP BY name;

-- 功能使用率：最近 7 天各事件的使用人数
SELECT name, count(DISTINCT install_id) AS users, count(*) AS times
FROM yomiplay_events WHERE client_ts > now() - interval '7 days'
GROUP BY name ORDER BY users DESC;

-- 次日留存：首日之后第 1 天有 app_open 的比例（按首日分组）
SELECT date_trunc('day', i.first_seen) AS day,
       count(*) AS installs,
       count(*) FILTER (WHERE EXISTS (
         SELECT 1 FROM yomiplay_events e
         WHERE e.install_id = i.install_id AND e.name = 'app_open'
           AND e.client_ts >= date_trunc('day', i.first_seen) + interval '1 day'
           AND e.client_ts <  date_trunc('day', i.first_seen) + interval '2 days')) AS retained_d1
FROM yomiplay_installs i GROUP BY 1 ORDER BY 1 DESC;

-- 付费墙：各入口出现次数与之后的购买
SELECT props->>'trigger' AS trigger, count(*) FILTER (WHERE name = 'paywall_shown') AS shown,
       count(*) FILTER (WHERE name = 'purchase_completed') AS purchased
FROM yomiplay_events WHERE name IN ('paywall_shown','purchase_completed')
GROUP BY 1 ORDER BY shown DESC;
```

后台先在 YomiPlay 管理页加一个「统计」标签：近 7 / 30 天的新增安装、日活、漏斗、功能使用率、付费墙表。直接调用上面这些查询（做成 Postgres 函数，用 service role 调）。

## 7. 二期：唤起推送（待定）

目标：有新的学习资源（社区新上架的字幕 / 暗记本、专题）时推送给用户，点开直接进到那份资源。

- **通道**：APNs 直连（国内可用；FCM 在国内不可用，Android 另议）。服务端用 `.p8` 密钥签 JWT，走 HTTP/2 发送，Node 运行时。
- **授权**：营销类推送按 App Store 审核指南 4.5.4 要求单独同意，并能在 App 内关闭。设置里加「学习资源推送」开关，默认关；在合适时机（比如第一次从社区导入之后）邀请打开。系统通知权限复用暗记提醒已申请的那个。
- **表**：`yomiplay_push_devices`（`install_id` 主键、`apns_token`、`environment` sandbox/production、`locale`、`app_version`、`is_pro`、`opted_in`、`updated_at`），用 `install_id` 和统计关联；`yomiplay_push_campaigns`（标题 / 正文四种语言、目标链接、受众条件、发送时间、发送数）。
- **接口**：`PUT /api/yomiplay/v1/push/register`（上报 token 与开关），后台「推送」页撰写并发送。
- **落地**：推送里带 `yomiplay://community/<id>` 这类链接，App 打开社区浏览并定位到那份资源，同时记 `push_opened`。
- **频率**：每人每周最多 1～2 条，按界面语言发对应语言的文案。
