export interface DesignDoc {
  id: string;
  title: string;
  date: string;
  content: string;
}

export const designDocs: DesignDoc[] = [
  {
    id: 'assessment-center',
    title: '评估中心模块',
    date: '2026-03-31',
    content: `# 评估中心模块

## 功能说明
提供评估表的选择、新建以及历史记录的查看与管理功能，帮助教师快速定位和使用适合学员的评估量表。

---

## 触发方式
> 侧边栏导航 → 点击“评估表”

---

## 结构与布局
| 区域/组件 | 内容描述 | 交互类型 |
|----------|----------|---------|
| 侧边栏 | 导航菜单 | 路由跳转 |
| 新建评估表页 | 展示可用量表卡片 | 点击跳转详情/历史 |
| 评估历史页 | 历史记录列表、多条件筛选 | 筛选、分页、操作(复制/编辑/删除/查看) |

---

## 字段/数据说明

### 评估历史记录
- **类型**：Object Array
- **字段**：
  - \`title\` (String): 量表名称
  - \`student\` (String): 学员姓名
  - \`age\` (String): 学员年龄
  - \`creator\` (String): 创建人
  - \`assessmentId\` (String): 评估编号
  - \`date\` (String): 评估日期 (YYYY-MM-DD)

---

## 交互流程 (Happy Path)
1. 用户点击左侧菜单“评估表” → 2. 进入新建评估表页面，浏览可用量表 → 3. 点击卡片上的“选择/继续”进入具体表单，或点击右上角“评估历史”查看过往记录。

## 异常处理
- 若暂无历史记录：展示空状态提示。
- 若接口报错：弹出 Toast 提示“获取数据失败，请重试”。
`
  }
];
