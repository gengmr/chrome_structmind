chrome.runtime.onInstalled.addListener(() => {
  // 设置初始的侧边栏选项
  chrome.sidePanel.setOptions({
    path: 'panel.html'
  });

  // 设置侧边栏的行为，当点击工具栏图标时打开侧边栏
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});

chrome.action.onClicked.addListener(() => {
  // 当用户点击扩展图标时，确保侧边栏路径已设置
  chrome.sidePanel.setOptions({
    path: 'panel.html'
  });
});
