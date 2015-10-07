function onload() {
  initTags();
  renderTagMemu();
  mainPage();
  loadSettings();
  watchSearchFocusing();
  listBooks();
  bindBibleEventHandlers();
}

function mainPage(withDetail) {
  cleanSearch();
  document.getElementsByClassName('mdl-layout__drawer')[0].className = 'mdl-layout__drawer';
  /*
  var tags = listTags();
  var html = "<ul class='" + (!withDetail ? 'two-column-center-list' : '') + "'>";

  for (var i = 0; i < tags.length; i++) {
    var tag = tags[i];
    if (chineseLanguage == CHINESE_SIMPLIFIED) {
      tag = TongWenWFU.convertToSimpliedChinese(tag);
    }
    html += "<li onclick='showTag(" + i + ")'> <b>" + tag + "</b>"
    if (withDetail) {
      var query = getTagValue(tag);
      if (chineseLanguage == CHINESE_SIMPLIFIED) {
        query = TongWenWFU.convertToSimpliedChinese(query);
      }
      html += "<br/>" + query;
    }
    html += '</li>';
  }
  html += "</ul>";
  */
  var title =
    "<h4 style='text-align:center;font-weight:bold' onclick='mainPage(" + !withDetail + ")'>耶穌說：我是道路、真理、生命 . . . </h4>" +
    "<div style = 'text-align:center;padding-top:5px;' onclick='mainPage(" + !withDetail + ")'>基督徒生活指引</div>";
  document.getElementsByClassName('bible-title')[0].innerHTML = title;
  $('.mdl-card__title').show();

  var html = displayTogether(23235, 23345, '太');
  html += "<div style='text-align:right;color:gray'> —— 马太福音 5，6，7</div>";
  document.getElementsByClassName('bible-text')[0].innerHTML = html;
  document.getElementById("deleteBtn").style.display = "none";
};

function cleanSearch() {
  document.getElementsByName("search")[0].value = "";
  document.getElementById("tagName").value = "";
  displayTag("");
  document.getElementById("deleteBtn").style.display = "none";
  setFootLinks();
}

function scrollToTop() {
  $('.mdl-layout__content').animate({
    scrollTop: 0
  }, 300).focus();
}

function tempAlert(msg, duration) {
  var el = document.createElement("div");
  el.setAttribute("class", 'infoBox infoBoxPop');
  el.innerHTML = msg;
  setTimeout(function() {
    el.parentNode.removeChild(el);
  }, duration);
  document.body.appendChild(el);
}
