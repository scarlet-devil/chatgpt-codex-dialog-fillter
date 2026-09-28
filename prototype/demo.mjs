import { VisibilityFilter } from './visibility-filter.mjs';

const $ = id => document.getElementById(id);
const scope = { source: 'synthetic', accountId: 'demo-account', hostId: 'demo-host' };
const project = projectId => ({ ...scope, projectKind: 'local', projectId });
const thread = threadId => ({ ...scope, threadId });
const show = project('show'), hide = project('hide');
const assigned = project => ({ status: 'assigned', project });
const projectRows = [
  { identity: show, title: '示例资料 · 显示' },
  { identity: hide, title: '示例工程 · 隐藏' },
  { identity: project('new'), title: '新项目 · 尚未分类' },
];
const rows = [
  { identity: thread('notes'), title: '阅读笔记' },
  { identity: thread('work'), title: 'Work 报告', origin: 'tpp' },
  { identity: thread('code'), title: '工程讨论' },
  { identity: thread('free'), title: '无项目对话' },
  { identity: thread('unloaded'), title: '尚未补查的搜索结果' },
];
const recent = rows.slice(0, 4);
const pinned = rows.slice(1, 3).map(row => ({ ...row, projectKey: null }));
const cachedSearch = rows.map(row => ({ ...row, projectId: 'stale-display-field' }));
let filter, nativeMembership, disposed = false;

function draw(id, result) {
  const list = $(id);
  list.replaceChildren();
  for (const row of result.items) {
    const li = document.createElement('li');
    li.textContent = row.title;
    list.append(li);
  }
  if (!result.items.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = '当前没有显示项';
    list.append(li);
  }
  $(`${id}-stats`).textContent = `显示 ${result.items.length} · 隐藏 ${result.hidden} · 未覆盖 ${result.uncovered}`;
}

function render() {
  for (const id of ['enabled', 'mode', 'dispose', 'move-show', 'move-hide', 'move-free',
    'membership-failure', 'sidebar-failure', 'late-response']) $(id).disabled = disposed;
  draw('projects', filter.projectItems(projectRows, 'project'));
  draw('recent', filter.projectItems(recent, 'thread'));
  draw('pinned', filter.projectItems(pinned, 'thread'));
  const query = $('search').value;
  draw('search-results', filter.projectItems(cachedSearch.filter(row => row.title.includes(query)), 'thread'));
  $('state').textContent = disposed ? '原型已移除，显示原始记录。'
    : filter.active ? '过滤已启用。关联变化会重新计算这四份现有列表。'
      : '当前显示原始记录。Codex 界面始终绕过过滤。';
}

function hydrate() {
  for (const [id, value] of nativeMembership) filter.updateMembership(thread(id), value);
}

function move(value, message) {
  if (disposed) return;
  nativeMembership.set('code', value);
  filter.updateMembership(thread('code'), value);
  $('log').textContent = message;
}

function reset() {
  filter?.dispose();
  disposed = false;
  $('enabled').checked = false;
  $('mode').value = 'chatgpt';
  $('search').value = '';
  filter = new VisibilityFilter({ onListenerError: () => { $('log').textContent = '演示显示发生错误，请重置。'; } });
  filter.setContext({ accountId: scope.accountId, mode: 'chatgpt', compatible: true });
  filter.setRules([{ project: show, visibility: 'show' }, { project: hide, visibility: 'hide' }]);
  nativeMembership = new Map([
    ['notes', assigned(show)], ['work', assigned(show)], ['code', assigned(hide)], ['free', { status: 'projectless' }],
  ]);
  hydrate();
  filter.subscribe(render);
  render();
  $('log').textContent = '已重置为初始合成数据，过滤关闭。';
}

$('enabled').addEventListener('change', event => { filter.setEnabled(event.target.checked); });
$('mode').addEventListener('change', event => {
  filter.setContext({ accountId: scope.accountId, mode: event.target.value, compatible: true });
  hydrate();
});
$('search').addEventListener('input', render);
$('reset').addEventListener('click', reset);
$('dispose').addEventListener('click', () => {
  disposed = true;
  filter.dispose();
  $('enabled').checked = false;
  render();
});
$('move-show').addEventListener('click', () => move(assigned(show), '工程讨论已跟随显示项目。'));
$('move-hide').addEventListener('click', () => move(assigned(hide), '工程讨论已跟随隐藏项目。'));
$('move-free').addEventListener('click', () => move({ status: 'projectless' }, '工程讨论已移出所有项目，保留显示并计为未覆盖。'));
$('membership-failure').addEventListener('click', () => {
  const before = nativeMembership.get('code');
  move(assigned(hide), '模拟移动中');
  move(before, '成员保存失败：使用原生回退后的旧关联。');
});
$('sidebar-failure').addEventListener('click', () => move(assigned(hide), '成员已保存到隐藏项目；侧栏保存失败不撤销这个关联。'));
$('late-response').addEventListener('click', async () => {
  const instance = filter, id = thread('unloaded');
  if (!instance.active) { $('log').textContent = '请先在 ChatGPT 界面启用过滤。'; return; }
  instance.invalidateMembership(id);
  const pending = instance.resolveMembership(id, () => new Promise(resolve => {
    // Deliberately ignores abort, to demonstrate that ticket checks reject stale data.
    setTimeout(() => resolve(assigned(hide)), 400);
  }));
  await Promise.resolve();
  nativeMembership.set('unloaded', assigned(show));
  instance.updateMembership(id, assigned(show));
  await pending;
  if (instance === filter && !disposed) $('log').textContent = '新关联已经是显示项目。迟到的旧隐藏结果被丢弃。';
});
reset();
