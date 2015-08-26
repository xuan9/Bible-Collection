var DISPLAY_STYLE_SHOW_BOOK_NAME_AND_LINE_PREFIX = "showBookNameAndLine";
var DISPLAY_STYLE_NO_PREFIX = "noPrefix";
var CHINESE_SIMPLIFIED = 'simplified';
var CHINESE_TRADITIONAL = 'traditional';
var displayStyle = DISPLAY_STYLE_NO_PREFIX;
var chineseLanguage = CHINESE_TRADITIONAL;

var valideLine = function(line) {
  if (line == -1) showError("找不到書名");
  else if (line == -2) showError("章節不存在");
  else if (line == -3) showError("句子不存在");
  else {
    showError("");
    return true
  };
  return false;
};
var showError = function(text) {
  if (text && text != "") {
    $('#error-info-bar').html(text).show();
  } else {
    $('#error-info-bar').html("").hide();
  }
};
var displayTogether = function(startLine, endLine, bookName) {
  var html = "";
  for (var i = startLine; i <= endLine; i++) {
    var l = bible[i];
    var spaceIndex = l.indexOf(' ');
    if (spaceIndex > 0) {
      var lead = l.substring(0, spaceIndex);
      if (displayStyle == DISPLAY_STYLE_SHOW_BOOK_NAME_AND_LINE_PREFIX) {
        html += "<div class='bible-line'><span class='line-prefix'>" + lead + "</span>" + l.substring(spaceIndex + 1) +
          "</div>";
      } else {
        html += "<span class='bible-line'>" + l.substring(spaceIndex + 1) + "</span>";
      }
    } else {
      html += "<div class='bible-line'>" + l + "</div>";
    }
  }
  if (displayStyle != DISPLAY_STYLE_SHOW_BOOK_NAME_AND_LINE_PREFIX) {
    html = "<div>" + html + "</div>";
  }
  return html;
};

var showTitle = function(title) {
  if (chineseLanguage == CHINESE_SIMPLIFIED) {
    title = TongWenWFU.convertToSimpliedChinese(title);
  }
  $(document.getElementsByClassName('bible-title')[0]).append(" " + title);
  $(document.getElementsByClassName('bible-text')[0]).append("<h5>" + title + "</h5>");
}
var showText = function(text) {
  if (chineseLanguage == CHINESE_SIMPLIFIED) {
    text = TongWenWFU.convertToSimpliedChinese(text);
  }
  $(document.getElementsByClassName('bible-text')[0]).append(text);
};

function bindBibleEventHandlers() {
  $(".bible-text").on("click", function(e) {
    var cell = $(e.target); // This is the TD you clicked
    var line = cell.hasClass('bible-line') ? cell : cell.parent().hasClass('bible-line') ? cell.parent() :
      null;
    if (line == null) {
      line = cell.closest('.bible-line');
    }
    if (line && line.length > 0) {
      $(".bible-text-hightlight").removeClass('bible-text-hightlight').addClass('bible-text-hightlight-expired');
      line.addClass('bible-text-hightlight').removeClass('bible-text-hightlight-expired');
    }
  });
}

/* ----------------------- display settings --------------------------------------------*/
function toggleChinese() {
  if (chineseLanguage == CHINESE_SIMPLIFIED) {
    chineseLanguage = CHINESE_TRADITIONAL;
  } else {
    chineseLanguage = CHINESE_SIMPLIFIED;
  }
  setChineseLanguage(chineseLanguage);
};

function setChineseLanguage(lan) {
  chineseLanguage = lan;
  saveSettingToStorage('chineseLanguage', lan);
  if (chineseLanguage == CHINESE_SIMPLIFIED) {
    document.getElementById("menuChinese").innerHTML =
      '<i class="material-icons menu-item-icon">check_box</i>' + "簡體字";
    TongWenWFU.convert(1);
  } else {
    document.getElementById("menuChinese").innerHTML =
      '<i class="material-icons menu-item-icon">check_box_outline_blank</i>' + "簡體字";
    TongWenWFU.convert(0);
  }

}

function toggleDisplayStyle() {
  if (displayStyle == DISPLAY_STYLE_NO_PREFIX) {
    displayStyle = DISPLAY_STYLE_SHOW_BOOK_NAME_AND_LINE_PREFIX;
  } else {
    displayStyle = DISPLAY_STYLE_NO_PREFIX;
  }
  setDisplayStyle(displayStyle);
  fireSearch();
}


function setDisplayStyle(disp, dontFireSearch) {
  displayStyle = disp;
  saveSettingToStorage('displayStyle', disp);
  if (displayStyle == DISPLAY_STYLE_SHOW_BOOK_NAME_AND_LINE_PREFIX) {
    document.getElementById("menuDisplayStyle").innerHTML =
      '<i class="material-icons menu-item-icon">check_box</i>' + "正文顯示章節號";
  } else {
    document.getElementById("menuDisplayStyle").innerHTML =
      '<i class="material-icons menu-item-icon">check_box_outline_blank</i>' + "正文顯示章節號";
  }
  if (!dontFireSearch) {
    fireSearch();
  }
}

function loadSettings() {
  displayStyle = getSettingValue('displayStyle');
  if (!displayStyle) displayStyle = DISPLAY_STYLE_NO_PREFIX;
  setDisplayStyle(displayStyle, true);

  chineseLanguage = getSettingValue('chineseLanguage');
  if (!chineseLanguage) {
    //find default language settings from browser
    var lans = navigator.languages;
    var result = 0;
    for (i in lans) {
      if (lans[i] == 'zh-CN') {
        result = 1;
        break;
      } else if (lans[i].indexOf('zh-') == 0) {
        result = -1;
        break;
      }
    }
    chineseLanguage = result == 1 ? CHINESE_SIMPLIFIED : CHINESE_TRADITIONAL;
  }

  setChineseLanguage(chineseLanguage);
}

function saveSettingToStorage(name, value) {
  localStorage.setItem('SETTING-' + name, value);
}

function getSettingValue(name) {
  return localStorage.getItem('SETTING-' + name);
}
