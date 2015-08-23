function toggleSaveTag(forceHidden) {
  var div = document.getElementById("saveTagBox");
  if (!forceHidden && div.style.display == 'none') {
    div.style.display = 'block';
    document.getElementById("tagName").focus();
    componentHandler.upgradeElement(div);
  } else {
    div.style.display = 'none';
  }
}

function saveTag() {
  var tagName = document.getElementById("tagName").value;
  if (tagName.trim() == "") {
    document.getElementById("tagName").focus();
    return;
  }
  var query = document.getElementById('bible-query').innerHTML.trim();
  if (query == "") {
    toggleSaveTag();
    tempAlert("還沒有經文索引,無法保存。", 3000);
    return;
  }
  console.log("save " + query + " with name " + tagName + " ... ");
  saveTagToStorage(tagName, query);
  renderTagMemu();
  toggleSaveTag();
  tempAlert("成功保存標籤《" + tagName + "》！", 3000);
  displayTag(tagName);
}

function displayTag(tagName) {
  document.getElementById("tagLabel").innerHTML = (!tagName || tagName == "") ? "" : escapeHtml(tagName);
}

function saveTagToStorage(name, value) {
  name = TongWenWFU.convertToTraditionalChinese(name);
  value = TongWenWFU.convertToTraditionalChinese(value);
  localStorage.setItem('TAG-' + name, value);
  var tags = listTags();
  if (tags.indexOf(name) >= 0) {
    tags.unshift(name);
    localStorage.setItem("tagNames", JSON.stringify(tags));
  }
}

function getTagValue(name) {
  name = TongWenWFU.convertToTraditionalChinese(name);
  return localStorage.getItem('TAG-' + name);
}

function removeTagFromStorage(name) {
  name = TongWenWFU.convertToTraditionalChinese(name);
  localStorage.removeItem('TAG-' + name);
  var tagNames = listTags();
  var index = tagNames.indexOf(name);
  if (index > -1) {
    tagNames.splice(index, 1);
    localStorage.setItem("tagNames", JSON.stringify(tagNames));
  }
}
var InitialTagNames = ["需要祈禱時", "需要安慰時", "需要平安時", "誘惑時",
  "孤獨時", "憂愁時", "徬徨時", "疲乏時", "煩惱時", "病痛時", "哀傷時",
  "分離時", "危難逼迫時", "畏懼時", "救恩", "爭勝世界"
];
var InitialTagValues = {
  "需要祈禱時": "詩 4 6 25 42 51 太 6:5-15 路 18:1-14 約壹 5:14－15 約 17",
  "需要安慰時": "伯5:19 10:16 太11:28 詩25:5 30:5 42:5 103:13 119:50 約壹5:1-21",
  "需要平安時": "詩 1:1－2 4:8 85:8 羅 5:1－5 林後 4:8,10,16,17 西 3:15",
  "危難逼迫時": "詩20:6-9 34 118:5-9 119:121 126 來13:6",
  "誘惑時": "詩 1 73 太6:24 腓4:8 路21:33-36 羅13:13-14 可13:33-37 林前10:13 雅1:12-25",
  "孤獨時": "詩35 41:9-13 55:12-23 路17:34 羅12:14,17,19 來13:8",
  "疲乏時": "申33:27 賽40:31 詩55:22 73:26 拿2:7 太11:28",
  "憂愁時": "詩91 太5:4 5:10-12 10:29-31 11:28 約14:1,16,18,27 羅8:28 8:35-39",
  "煩惱時": "詩 16 31 38 40 彼後2:9",
  "徬徨時": "詩107 腓4:6 彼前5:6 來13:5",
  "病痛時": "太26:39 提後2:3 來2:1-11 雅5:11-15 彼前4:12,13,19",
  "哀傷時": "路6:21 林前15 帖前4:13-18",
  "畏懼時": "詩27 太6:25-34 11:28-30 羅8 約11 17 20 林後 4 5 12:9",
  "分離時": "太10:16-20 路15:11-32 來11:8-16",
  "救恩": "羅3:10,23 5:8,12 6:23 10:9,10,13",
  "爭勝世界": "加2:20 西1:4 徒4:12 彼前1:5-9 約壹2:15-17",
};

function initTags() {
  var tags = listTags();
  if (tags.length == 0) {
    for (var tag in InitialTagValues) {
      saveTagToStorage(tag, InitialTagValues[tag]);
    }
    localStorage.setItem("tagNames", JSON.stringify(InitialTagNames));
  }
}

function listTags() {
  var tagNames = localStorage.getItem('tagNames');
  if (!tagNames) tagNames = new Array();
  else {
    tagNames = JSON.parse(tagNames);
  }
  return tagNames;
}

function renderTagMemu() {
  var tags = listTags();
  var html = "";
  for (var i = 0; i < tags.length; i++) {
    html +=
      '<a class="mdl-navigation__link" href="javascript:void(0)" onclick="showTag(' + i + ')">' + escapeHtml(tags[i]) +
      '</a>';
  }

  var nav = document.getElementsByClassName('mdl-navigation')[0];
  nav.innerHTML = html;
}

function showTag(index) {
  var tags = listTags();

  var tag = tags[index];
  var query = getTagValue(tag);
  if (chineseLanguage == CHINESE_SIMPLIFIED) {
    tag = TongWenWFU.convertToSimpliedChinese(tag);
    query = TongWenWFU.convertToSimpliedChinese(query);
  }
  document.getElementsByName("search")[0].value = query;
  document.getElementById("tagName").value = tag;
  document.getElementById("tagName").setAttribute('searchString', query);
  searchInputChanged(query);
  document.getElementsByClassName('mdl-layout__drawer')[0].className = 'mdl-layout__drawer';
  displayTag(tag);
  toggleSaveTag(true);
  $('.mdl-card__title').hide();
  document.getElementById('saveBtn').style.display = 'none';
  scrollToTop();
}


function removeTag() {
  var tag = document.getElementById("tagName").value;
  if (tag == '') return;
  var r = confirm("確定要刪除《" + tag + "》標籤嗎？");
  if (r == true) {
    removeTagFromStorage(tag);
    renderTagMemu();
    tempAlert("已刪除《" + tag + "》標籤！", 3000);
  }
}

function isQueryChangedForTheTag() {
  return document.getElementById("tagName").getAttribute('searchString') != document.getElementsByName("search")[0]
    .value;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
