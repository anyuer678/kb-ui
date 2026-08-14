// 批量生成缺失的组件文档页（docs/components/*.md）
// 用法：node scripts/gen-docs.mjs
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '../docs/components')

// 每个组件：标题/简介/基础用法代码/真实渲染代码/API（props/events/slots）
const COMPONENTS = [
  {
    file: 'skeleton', name: 'Skeleton', title: '骨架屏', brief: '加载占位骨架，提供段落/标题/头像/图片等占位形态。',
    usage: '<KbSkeleton :rows="3" animated />', render: '<KbSkeleton :rows="3" animated style="max-width: 420px" />',
    props: [['`rows`', '`number`', '`3`', '段落行数'], ['`animated`', '`boolean`', '`false`', '是否开启动画'], ['`title`', '`boolean`', '`true`', '是否显示标题占位']],
    events: [], slots: [],
  },
  {
    file: 'empty', name: 'Empty', title: '空状态', brief: '数据为空时的占位提示，支持自定义描述与插槽。',
    usage: '<KbEmpty description="暂无数据" />', render: '<KbEmpty description="暂无数据" />',
    props: [['`description`', '`string`', `'暂无数据'`, '描述文案'], ['`image`', '`string`', `''`, '自定义图片 URL']],
    events: [], slots: [['`default`', '自定义占位内容'], ['`description`', '自定义描述']],
  },
  {
    file: 'breadcrumb', name: 'Breadcrumb', title: '面包屑', brief: '页面路径导航，支持分隔符自定义与链接跳转。',
    usage: '<KbBreadcrumb :items="[{ label: \'首页\', href: \'/\' }, { label: \'组件\' }, { label: \'面包屑\' }]" />',
    render: '<KbBreadcrumb :items="[{ label: \'首页\', href: \'/\' }, { label: \'组件\' }, { label: \'面包屑\' }]" />',
    props: [['`items`', '`BreadcrumbItem[]`', '`[]`', '面包屑项（label/href）'], ['`separator`', '`string`', `'/'`, '分隔符']],
    events: [], slots: [],
  },
  {
    file: 'collapse', name: 'Collapse', title: '折叠面板', brief: '可折叠的内容区域，支持手风琴模式。',
    usage: '<KbCollapse :items="[{ title: \'面板一\', content: \'内容\' }]" />',
    render: '<KbCollapse :items="[{ title: \'面板一\', content: \'这是第一个面板的内容。\' }, { title: \'面板二\', content: \'这是第二个面板的内容。\' }]" style="max-width: 480px" />',
    props: [['`items`', '`CollapseItem[]`', '`[]`', '面板项（title/content）'], ['`accordion`', '`boolean`', '`false`', '手风琴模式'], ['`modelValue`', '`string[]`', '`[]`', '展开面板 key 列表']],
    events: [['`update:modelValue`', '`string[]`', '展开状态变化']], slots: [],
  },
  {
    file: 'tabs', name: 'Tabs', title: '标签页', brief: '页签切换容器，支持卡片样式与插槽内容。',
    usage: '<KbTabs :tabs="[{ label: \'Tab 1\', key: \'1\' }]"><template #1>内容</template></KbTabs>',
    render: '<KbTabs :tabs="[{ label: \'简介\', key: \'a\' }, { label: \'特性\', key: \'b\' }, { label: \'API\', key: \'c\' }]"><template #a>第一个面板</template><template #b>第二个面板</template><template #c>第三个面板</template></KbTabs>',
    props: [['`tabs`', '`TabItem[]`', '`[]`', '页签列表（label/key）'], ['`modelValue`', '`string`', `''`, '当前激活 key'], ['`card`', '`boolean`', '`false`', '卡片风格']],
    events: [['`update:modelValue`', '`string`', '切换']], slots: [['`[key]`', '对应页签内容']],
  },
  {
    file: 'pagination', name: 'Pagination', title: '分页', brief: '数据分页控件，支持总页数/总数两种模式与快速跳页。',
    usage: '<KbPagination :total="100" :page-size="10" v-model:current-page="page" />',
    render: '<KbPagination :total="100" :page-size="10" :current-page="3" @update:current-page="() => {}" />',
    props: [['`total`', '`number`', '`0`', '数据总数'], ['`page-size`', '`number`', '`10`', '每页条数'], ['`current-page`', '`number`', '`1`', '当前页'], ['`show-total`', '`boolean`', '`false`', '显示总数']],
    events: [['`update:current-page`', '`number`', '页码变化'], ['`change`', '`number`', '页码变化（同义）']], slots: [],
  },
  {
    file: 'dropdown', name: 'Dropdown', title: '下拉菜单', brief: '悬停/点击触发的菜单，支持命令回调。',
    usage: '<KbDropdown :items="[{ label: \'编辑\', command: \'edit\' }]"><KbButton>更多</KbButton></KbDropdown>',
    render: '<KbDropdown :items="[{ label: \'编辑\', command: \'edit\' }, { label: \'删除\', command: \'del\', danger: true }]"><KbButton>更多</KbButton></KbDropdown>',
    props: [['`items`', '`DropdownItem[]`', '`[]`', '菜单项（label/command/divider/danger）'], ['`trigger`', `'hover' \\| 'click'`, `'hover'`, '触发方式']],
    events: [['`command`', '`string`', '点击菜单项']], slots: [['`default`', '触发元素']],
  },
  {
    file: 'drawer', name: 'Drawer', title: '抽屉', brief: '从侧边滑出的面板，支持四个方向与插槽。',
    usage: '<KbDrawer v-model="visible" title="抽屉标题">内容</KbDrawer>',
    render: '<KbDrawer :model-value="false" title="抽屉标题">（通过 v-model 控制）</KbDrawer>',
    props: [['`modelValue`', '`boolean`', '`false`', '是否显示'], ['`title`', '`string`', `''`, '标题'], ['`placement`', `'left' \\| 'right' \\| 'top' \\| 'bottom'`, `'right'`, '滑出方向'], ['`width`', '`string`', `'320px'`, '宽度（左右）']],
    events: [['`update:modelValue`', '`boolean`', '关闭'], ['`close`', '—', '关闭动画后']], slots: [['`default`', '内容'], ['`footer`', '底部']],
  },
  {
    file: 'popover', name: 'Popover', title: '气泡卡片', brief: '鼠标悬停/点击弹出的内容卡片，带标题与箭头。',
    usage: '<KbPopover title="标题" content="内容"><KbButton>悬停</KbButton></KbPopover>',
    render: '<KbPopover title="提示标题" content="这里是气泡卡片的内容。"><KbButton>悬停查看</KbButton></KbPopover>',
    props: [['`title`', '`string`', `''`, '标题'], ['`content`', '`string`', `''`, '内容'], ['`trigger`', `'hover' \\| 'click'`, `'hover'`, '触发方式']],
    events: [], slots: [['`default`', '触发元素']],
  },
  {
    file: 'rate', name: 'Rate', title: '评分', brief: '星级评分，支持半星与只读。',
    usage: '<KbRate v-model="score" />',
    render: '<KbRate :model-value="4" @update:model-value="() => {}" />',
    props: [['`modelValue`', '`number`', '`0`', '分值'], ['`count`', '`number`', '`5`', '星数'], ['`allow-half`', '`boolean`', '`false`', '半星'], ['`readonly`', '`boolean`', '`false`', '只读']],
    events: [['`update:modelValue`', '`number`', '评分变化']], slots: [],
  },
  {
    file: 'slider', name: 'Slider', title: '滑块', brief: '拖动选择数值，支持范围与步长。',
    usage: '<KbSlider v-model="value" :min="0" :max="100" />',
    render: '<KbSlider :model-value="60" :min="0" :max="100" @update:model-value="() => {}" style="max-width: 360px" />',
    props: [['`modelValue`', '`number`', '`0`', '当前值'], ['`min`', '`number`', '`0`', '最小值'], ['`max`', '`number`', '`100`', '最大值'], ['`step`', '`number`', '`1`', '步长'], ['`disabled`', '`boolean`', '`false`', '禁用']],
    events: [['`update:modelValue`', '`number`', '值变化'], ['`change`', '`number`', '拖动结束']], slots: [],
  },
  {
    file: 'result', name: 'Result', title: '结果页', brief: '操作反馈结果页，如成功/失败/404，支持自定义操作。',
    usage: '<KbResult status="success" title="提交成功" description="您的申请已受理。" />',
    render: '<KbResult status="success" title="提交成功" description="您的申请已受理。" />',
    props: [['`status`', `'success' \\| 'warning' \\| 'danger' \\| 'info' \\| '404'`, `'success'`, '状态'], ['`title`', '`string`', `''`, '标题'], ['`description`', '`string`', `''`, '描述']],
    events: [], slots: [['`default`', '操作区'], ['`title`', '自定义标题']],
  },
  {
    file: 'statistic', name: 'Statistic', title: '统计数值', brief: '展示统计数据，支持千分位、小数位与前后缀。',
    usage: '<KbStatistic title="总用户" :value="12345" prefix="¥" />',
    render: '<KbStatistic title="总用户" :value="1234567" />',
    props: [['`title`', '`string`', `''`, '标题'], ['`value`', '`number`', '`0`', '数值'], ['`precision`', '`number`', '`0`', '小数位'], ['`prefix` / `suffix`', '`string`', `''`, '前后缀'], ['`group-separator`', '`boolean`', '`true`', '千分位']],
    events: [], slots: [['`default`', '自定义数值显示']],
  },
  {
    file: 'steps', name: 'Steps', title: '步骤条', brief: '分步流程指示，支持自定义标题/描述/状态。',
    usage: '<KbSteps :items="[{ title: \'第一步\' }, { title: \'第二步\' }]" :current="1" />',
    render: '<KbSteps :items="[{ title: \'填写信息\', description: \'基础资料\' }, { title: \'确认订单\', description: \'核对内容\' }, { title: \'完成\', description: \'提交成功\' }]" :current="1" />',
    props: [['`items`', '`StepsItem[]`', '`[]`', '步骤项（title/description）'], ['`current`', '`number`', '`0`', '当前步骤']],
    events: [], slots: [],
  },
  {
    file: 'timeline', name: 'Timeline', title: '时间线', brief: '垂直时间线展示事件流，支持状态色。',
    usage: '<KbTimeline :items="[{ content: \'事件\', time: \'5 分钟前\' }]" />',
    render: '<KbTimeline :items="[{ content: \'发布 v1.0\', time: \'2026-08-08\', type: \'success\' }, { content: \'设计评审\', time: \'2026-08-10\' }, { content: \'计划 v2.0\', time: \'2026-09\', type: \'warning\' }]" />',
    props: [['`items`', '`TimelineItem[]`', '`[]`', '事件项（content/time/type）']],
    events: [], slots: [],
  },
  {
    file: 'notification', name: 'Notification', title: '通知提醒', brief: '函数式通知 API，从右上角弹出。',
    usage: 'notification.success({ title: \'成功\', content: \'操作完成\' })',
    render: '<KbButton @click="$event => $kbNotification?.success({ title: \'示例\', content: \'这是一条通知\' })">（函数式 API，见说明）</KbButton>',
    props: [['`title`', '`string`', `''`, '标题'], ['`content`', '`string`', `''`, '内容'], ['`duration`', '`number`', '`3000`', '自动关闭 ms，0 不关闭']],
    events: [], slots: [],
  },
  {
    file: 'input-number', name: 'InputNumber', title: '数字输入', brief: '带步进按钮的数字输入框，支持范围与精度。',
    usage: '<KbInputNumber v-model="num" :min="0" :max="100" />',
    render: '<KbInputNumber :model-value="10" :min="0" :max="100" @update:model-value="() => {}" />',
    props: [['`modelValue`', '`number`', '`0`', '当前值'], ['`min` / `max`', '`number`', '—', '范围'], ['`step`', '`number`', '`1`', '步长'], ['`precision`', '`number`', '`0`', '小数位'], ['`disabled`', '`boolean`', '`false`', '禁用']],
    events: [['`update:modelValue`', '`number`', '值变化']], slots: [],
  },
  {
    file: 'textarea', name: 'Textarea', title: '文本域', brief: '多行文本输入，支持字数统计与最大长度。',
    usage: '<KbTextarea v-model="text" :rows="3" :maxlength="200" show-word-limit />',
    render: '<KbTextarea :model-value="\'支持多行文本输入\'" :rows="3" @update:model-value="() => {}" style="max-width: 480px" />',
    props: [['`modelValue`', '`string`', `''`, '值'], ['`rows`', '`number`', '`3`', '行数'], ['`maxlength`', '`number`', '—', '最大长度'], ['`show-word-limit`', '`boolean`', '`false`', '字数统计'], ['`resize`', `'none' \\| 'both' \\| 'vertical'`, `'vertical'`, '缩放']],
    events: [['`update:modelValue`', '`string`', '输入']], slots: [],
  },
  {
    file: 'search', name: 'Search', title: '搜索框', brief: '带搜索按钮的输入框，回车或点击触发 search 事件。',
    usage: '<KbSearch v-model="kw" @search="onSearch" />',
    render: '<KbSearch :model-value="\'关键字\'" @search="() => {}" style="max-width: 360px" />',
    props: [['`modelValue`', '`string`', `''`, '值'], ['`placeholder`', '`string`', `'搜索'`, '占位'], ['`button-text`', '`string`', `'搜索'`, '按钮文案']],
    events: [['`update:modelValue`', '`string`', '输入'], ['`search`', '`string`', '搜索（回车/按钮）']], slots: [],
  },
  {
    file: 'segmented', name: 'Segmented', title: '分段控制器', brief: '单选的按钮组，适合少量选项切换。',
    usage: '<KbSegmented v-model="view" :options="[{ label: \'列表\', value: \'list\' }]" />',
    render: '<KbSegmented :model-value="\'week\'" :options="[{ label: \'日\', value: \'day\' }, { label: \'周\', value: \'week\' }, { label: \'月\', value: \'month\' }]" @update:model-value="() => {}" />',
    props: [['`modelValue`', '`string \\| number`', `''`, '选中值'], ['`options`', '`SegmentedOption[]`', '`[]`', '选项（label/value/disabled）']],
    events: [['`update:modelValue`', '`string \\| number`', '切换'], ['`change`', '`string \\| number`', '切换']], slots: [],
  },
  {
    file: 'watermark', name: 'Watermark', title: '水印', brief: '页面/容器水印，支持文字与倾斜角度。',
    usage: '<KbWatermark content="机密"><div>内容区域</div></KbWatermark>',
    render: '<KbWatermark content="KB UI"><div style="height: 120px; border: 1px dashed var(--kb-color-border); border-radius: 8px"></div></KbWatermark>',
    props: [['`content`', '`string`', `''`, '水印文字'], ['`rotate`', '`number`', `'-22'`, '旋转角度'], ['`font-size`', '`number`', '`14`', '字号'], ['`z-index`', '`number`', '`9`', '层级']],
    events: [], slots: [['`default`', '内容区域']],
  },
  {
    file: 'popconfirm', name: 'Popconfirm', title: '气泡确认框', brief: '点击元素弹出确认框，确定/取消回调。',
    usage: '<KbPopconfirm title="确认删除？" @confirm="del"><KbButton>删除</KbButton></KbPopconfirm>',
    render: '<KbPopconfirm title="确认删除该条记录？" @confirm="() => {}"><KbButton type="danger" plain>删除</KbButton></KbPopconfirm>',
    props: [['`title`', '`string`', `''`, '确认文案'], ['`confirm-text`', '`string`', `'确定'`, '确定按钮'], ['`cancel-text`', '`string`', `'取消'`, '取消按钮']],
    events: [['`confirm`', '—', '点击确定'], ['`cancel`', '—', '点击取消']], slots: [['`default`', '触发元素']],
  },
  {
    file: 'carousel', name: 'Carousel', title: '轮播图', brief: '图片/内容轮播，支持自动播放与指示器。',
    usage: '<KbCarousel :images="[\'/a.jpg\']" />',
    render: '<KbCarousel :images="[\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22160%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%233b82f6%22/><text x=%22150%22 y=%2285%22 fill=%22white%22 font-size=%2224%22>幻灯片 1</text></svg>\', \'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22160%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%2310b981%22/><text x=%22150%22 y=%2285%22 fill=%22white%22 font-size=%2224%22>幻灯片 2</text></svg>\']" :height="160" />',
    props: [['`images`', '`string[]`', '`[]`', '图片列表'], ['`height`', '`number`', '`200`', '高度'], ['`autoplay`', '`boolean`', '`true`', '自动播放'], ['`interval`', '`number`', '`3000`', '间隔 ms']],
    events: [], slots: [],
  },
  {
    file: 'descriptions', name: 'Descriptions', title: '描述列表', brief: '只读信息描述列表，支持边框与列数。',
    usage: '<KbDescriptions :items="[{ label: \'姓名\', value: \'张三\' }]" :columns="2" />',
    render: '<KbDescriptions :items="[{ label: \'姓名\', value: \'张三\' }, { label: \'角色\', value: \'管理员\' }, { label: \'邮箱\', value: \'a@b.com\' }, { label: \'状态\', value: \'在线\' }]" :columns="2" border />',
    props: [['`items`', '`DescriptionItem[]`', '`[]`', '条目（label/value）'], ['`columns`', '`number`', '`1`', '列数'], ['`border`', '`boolean`', '`false`', '边框']],
    events: [], slots: [],
  },
  {
    file: 'calendar', name: 'Calendar', title: '日历', brief: '月视图日历，支持选择日期与自定义单元格。',
    usage: '<KbCalendar v-model="date" />',
    render: '<KbCalendar :model-value="\'2026-08-15\'" @update:model-value="() => {}" />',
    props: [['`modelValue`', '`string`', `''`, '选中日期（YYYY-MM-DD）'], ['`first-day`', '`number`', '`1`', '周起始（0 周日）']],
    events: [['`update:modelValue`', '`string`', '选择日期']], slots: [['`cell`', '自定义单元格']],
  },
  {
    file: 'loading', name: 'Loading', title: '加载中', brief: '全屏/局部加载遮罩，支持文案与图标切换。',
    usage: '<KbLoading v-model="loading" text="加载中…" />',
    render: '<KbLoading :model-value="false" text="加载中…"><div style="height: 100px; display: grid; place-items: center; border: 1px dashed var(--kb-color-border); border-radius: 8px">内容区域</div></KbLoading>',
    props: [['`modelValue`', '`boolean`', '`false`', '是否加载'], ['`text`', '`string`', `''`, '加载文案'], ['`fullscreen`', '`boolean`', '`false`', '全屏遮罩']],
    events: [], slots: [['`default`', '内容区域']],
  },
  {
    file: 'form', name: 'Form', title: '表单', brief: '表单容器 + 校验（required/pattern/validator），与 FormItem 配合使用。',
    usage: '<KbForm ref="formRef" :model="form" :rules="rules"><KbFormItem label="姓名" prop="name"><KbInput v-model="form.name" /></KbFormItem></KbForm>',
    render: '<KbForm :model="{ name: \'\' }" :rules="{ name: [{ required: true, message: \'请输入姓名\' }] }"><KbFormItem label="姓名" prop="name"><KbInput :model-value="\'\'" @update:model-value="() => {}" /></KbFormItem></KbForm>',
    props: [['`model`', '`object`', '`{}`', '表单数据'], ['`rules`', '`FormRules`', '`{}`', '校验规则'], ['`label-width`', '`string`', `'auto'`, '标签宽度']],
    events: [], slots: [['`default`', 'FormItem 列表']],
  },
  {
    file: 'date-picker', name: 'DatePicker', title: '日期选择', brief: '日期选择器，弹出日历面板。',
    usage: '<KbDatePicker v-model="date" />',
    render: '<KbDatePicker :model-value="\'2026-08-15\'" @update:model-value="() => {}" />',
    props: [['`modelValue`', '`string`', `''`, '日期（YYYY-MM-DD）'], ['`placeholder`', '`string`', `'选择日期'`, '占位'], ['`disabled`', '`boolean`', '`false`', '禁用']],
    events: [['`update:modelValue`', '`string`', '选择']], slots: [],
  },
  {
    file: 'upload', name: 'Upload', title: '文件上传', brief: '文件选择与列表展示，支持多选/大小限制/删除。',
    usage: '<KbUpload v-model="files" accept="image/*" />',
    render: '<KbUpload :model-value="[{ name: \'示例文件.txt\', size: 1024 }]" @update:model-value="() => {}" />',
    props: [['`modelValue`', '`UploadFile[]`', '`[]`', '文件列表（name/size/status）'], ['`accept`', '`string`', `''`, '接受类型'], ['`multiple`', '`boolean`', '`false`', '多选'], ['`max-size`', '`number`', '`0`', '大小上限 MB，0 不限']],
    events: [['`update:modelValue`', '`UploadFile[]`', '列表变化'], ['`remove`', '`UploadFile`', '删除']], slots: [],
  },
  {
    file: 'tree', name: 'Tree', title: '树形控件', brief: '树形数据展示，支持展开/折叠/选中。',
    usage: '<KbTree :data="[{ label: \'节点\', children: [] }]" />',
    render: '<KbTree :data="[{ label: \'根节点\', children: [{ label: \'子节点 1\', children: [{ label: \'叶子\' }] }, { label: \'子节点 2\' }] }]" />',
    props: [['`data`', '`TreeNode[]`', '`[]`', '树数据（label/children）'], ['`default-expanded`', '`boolean`', '`false`', '默认展开'], ['`selectable`', '`boolean`', '`true`', '可选中']],
    events: [['`select`', '`TreeNode`', '选中节点']], slots: [],
  },
  {
    file: 'color-picker', name: 'ColorPicker', title: '颜色选择', brief: '预设色板取色器，支持自定义颜色。',
    usage: '<KbColorPicker v-model="color" />',
    render: '<KbColorPicker :model-value="\'#3b82f6\'" @update:model-value="() => {}" />',
    props: [['`modelValue`', '`string`', `'#3b82f6'`, '颜色值'], ['`preset`', '`string[]`', '内置色板', '预设色']],
    events: [['`update:modelValue`', '`string`', '取色']], slots: [],
  },
  {
    file: 'input-password', name: 'InputPassword', title: '密码输入', brief: '密码输入框，点击眼睛切换明文。',
    usage: '<KbInputPassword v-model="password" />',
    render: '<KbInputPassword :model-value="\'123456\'" @update:model-value="() => {}" />',
    props: [['`modelValue`', '`string`', `''`, '值'], ['`placeholder`', '`string`', `''`, '占位'], ['`size`', `'small' \\| 'medium' \\| 'large'`, `'medium'`, '尺寸']],
    events: [['`update:modelValue`', '`string`', '输入']], slots: [],
  },
  {
    file: 'count-up', name: 'CountUp', title: '数字滚动', brief: '数字滚动动画，支持缓动/前缀后缀/小数位。',
    usage: '<KbCountUp :end="100" :duration="1500" prefix="$" />',
    render: '<KbCountUp :end="12345" prefix="¥" :duration="1200" />',
    props: [['`end`', '`number`', '—', '目标值'], ['`start`', '`number`', '`0`', '起始值'], ['`duration`', '`number`', '`1500`', '时长 ms'], ['`prefix` / `suffix`', '`string`', `''`, '前后缀'], ['`decimals`', '`number`', '`0`', '小数位']],
    events: [], slots: [],
  },
  {
    file: 'list', name: 'List', title: '列表', brief: '通用列表容器，支持插槽与空态。',
    usage: '<KbList :items="[\'苹果\']" />',
    render: '<KbList :items="[\'苹果\', \'香蕉\', \'橙子\']" bordered style="max-width: 360px" />',
    props: [['`items`', '`unknown[]`', '`[]`', '数据项'], ['`empty`', '`string`', `'暂无数据'`, '空态文案'], ['`bordered`', '`boolean`', '`false`', '分割线']],
    events: [], slots: [['`item`', '自定义渲染（item/index）']],
  },
  {
    file: 'transfer', name: 'Transfer', title: '穿梭框', brief: '左右列表穿梭选择，支持批量移动。',
    usage: '<KbTransfer :data="[{ key: \'a\', label: \'A\' }]" v-model="selected" />',
    render: '<KbTransfer :data="[{ key: \'a\', label: \'选项 A\' }, { key: \'b\', label: \'选项 B\' }, { key: \'c\', label: \'选项 C\' }]" :model-value="[\'a\']" @update:model-value="() => {}" />',
    props: [['`data`', '`TransferItem[]`', '`[]`', '数据（key/label）'], ['`modelValue`', '`string[]`', '`[]`', '已选 key']],
    events: [['`update:modelValue`', '`string[]`', '穿梭变化']], slots: [],
  },
  {
    file: 'cascader', name: 'Cascader', title: '级联选择', brief: '多级级联选择，面板逐级展开。',
    usage: '<KbCascader :options="[{ label: \'浙江\', value: \'zj\', children: [] }]" />',
    render: '<KbCascader :options="[{ label: \'浙江\', value: \'zj\', children: [{ label: \'杭州\', value: \'hz\' }, { label: \'宁波\', value: \'nb\' }] }, { label: \'广东\', value: \'gd\', children: [{ label: \'广州\', value: \'gz\' }] }]" :model-value="[\'zj\', \'hz\']" @update:model-value="() => {}" />',
    props: [['`options`', '`CascaderOption[]`', '`[]`', '选项（label/value/children）'], ['`modelValue`', '`(string \\| number)[]`', '`[]`', '已选路径'], ['`placeholder`', '`string`', `'请选择'`, '占位']],
    events: [['`update:modelValue`', '`(string \\| number)[]`', '选择变化']], slots: [],
  },
]

function renderPage(c) {
  const propsRows = c.props.map((p) => `| ${p[0]} | \`${p[1]}\` | ${p[2]} | ${p[3]} |`).join('\n')
  const eventsRows = c.events.map((e) => `| \`${e[0]}\` | \`${e[1]}\` | ${e[2]} |`).join('\n')
  const slotsRows = c.slots.map((s) => `| \`${s[0]}\` | ${s[1]} |`).join('\n')
  return `# ${c.name} ${c.title}

${c.brief}

## 基础用法

\`\`\`vue
<template>
  ${c.usage}
</template>
\`\`\`

${c.render}

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|---|---|---|---|
${propsRows}
${c.events.length ? `\n### 事件\n\n| 事件 | 参数 | 说明 |\n|---|---|---|\n${eventsRows}\n` : ''}${c.slots.length ? `\n### 插槽\n\n| 名称 | 说明 |\n|---|---|\n${slotsRows}\n` : ''}
`
}

// 仅生成缺失的文件
mkdirSync(outDir, { recursive: true })
let count = 0
for (const c of COMPONENTS) {
  const file = join(outDir, `${c.file}.md`)
  if (existsSync(file)) continue
  writeFileSync(file, renderPage(c), 'utf-8')
  count++
}
console.log(`生成 ${count} 个组件文档页（共 ${COMPONENTS.length} 个，缺失 ${COMPONENTS.length - count} 个已跳过）`)
