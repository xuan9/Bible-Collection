function fireSearch() {
  if (document.getElementsByName("search")[0].value.trim() != "")
    searchInputChanged(document.getElementsByName("search")[0].value);
}

var searchInputChanged = function(query) {
  if (!query) query = '';
  document.getElementsByClassName('bible-title')[0].innerHTML = "";
  document.getElementsByClassName('bible-text')[0].innerHTML = "";
  document.getElementById('bible-query').innerHTML = query;
  var isFound = false,
    isNoError = true;
  var reBooks = /\s*([\u4e00-\u9fa5]{1,10})([\s0-9\:：•\-－,，]*)/g;
  var re = /\s*•?\s*([0-9]+)\s*(?:[:：]\s*([0-9]+)(?:\s*[-－]\s*([0-9]+))?((?:\s*[,，]\s*[0-9]+)*))?/g;
  var m;
  while ((m = reBooks.exec(query)) !== null) {
    if (m.index === reBooks.lastIndex) {
      reBooks.lastIndex++;
    }
    var bookName = m[1];
    var indexes = m[2].trim();
    var m2;
    if (indexes.trim() == '') {
      isNoError = find(bookName, -1, -1, -1, -1);
      isFound = true;
    } else {
      while ((m2 = re.exec(indexes)) !== null) {
        if (m2.index === re.lastIndex) {
          re.lastIndex++;
        }
        var chapterIndex1 = m2[1] ? parseInt(m2[1]) : -1,
          lineIndex1 = m2[2] ? parseInt(m2[2]) : -1,
          lineIndex2 = m2[3] ? parseInt(m2[3]) : -1,
          moreLines = m2[4];
        isFound = true;
        if (lineIndex2 !== -1) {
          isNoError = find(bookName, chapterIndex1, lineIndex1, chapterIndex1, lineIndex2) && isNoError;
        } else {
          isNoError = find(bookName, chapterIndex1, lineIndex1, chapterIndex1, lineIndex1) && isNoError;
          if (moreLines != '') {
            var reLines = /\s*[,，]\s*([0-9]+)/g;
            var m3;
            while ((m3 = reLines.exec(moreLines)) !== null) {
              if (m3.index === reLines.lastIndex) {
                reLines.lastIndex++;
              }
              var lineIndex = parseInt(m3[1]);
              isNoError = find(bookName, chapterIndex1, lineIndex, chapterIndex1, lineIndex) && isNoError;
            }
          }
        }
        if (indexes == '') {
          break;
        }
      }
    }
  }

  toggleSaveTag(true); //force hidden tag save box if showing
  if (isFound && isNoError && isQueryChangedForTheTag()) {
    document.getElementById('saveBtn').style.display = 'inline-block';
    if (document.getElementById("tagLabel").innerHTML == '') {
      $("#saveBtn i").html('label_outline');
    } else {
      $("#saveBtn i").html('label');
    }
  } else {
    document.getElementById('saveBtn').style.display = 'none';
  }

  if (query.trim() == '') {
    document.getElementById("tagName").value = '';
    document.getElementById('tagLabel').innerHTML = '';
    document.getElementById("deleteBtn").style.display = 'none';
    mainPage();
  } else {
    if (!isQueryChangedForTheTag()) {
      document.getElementById("deleteBtn").style.display = "inline-block";
    } else {
      document.getElementById("deleteBtn").style.display = "none";
    }
  }

  if (isFound && isNoError) parseBookChapterQueryForFooterLinks(query);
};

var find = function(bookName, iChapterIndex1, iLine1, iChapterIndex2, iLine2) {
  bookName = TongWenWFU.convertToTraditionalChinese(bookName);
  console.info('search ' + bookName + " " + iChapterIndex1 + ":" + iLine1 + " -- " + iChapterIndex2 + ":" + iLine2);
  var bookIndex = getBookIndex(bookName);
  var chapterIndex1, line1, chapterIndex2, line2;
  chapterIndex1 = iChapterIndex1 === -1 ? 1 : iChapterIndex1;
  chapterIndex2 = iChapterIndex2 === -1 ?
    (iChapterIndex1 === -1 ? getTotalChapters(bookIndex) : iChapterIndex1) : iChapterIndex2;
  line1 = iLine1 === -1 ? 1 : iLine1;
  line2 = iLine2 === -1 ? (getTotalLines(bookIndex,
    chapterIndex2)) : iLine2;
  var totalChapters = getTotalChapters(bookIndex);
  var startLine = searchLine(bookIndex, chapterIndex1, line1);
  var endLine = searchLine(bookIndex, chapterIndex2, line2);
  console.info("startLine: " + startLine + ", endLine: " + endLine);
  if (!valideLine(startLine) || !valideLine(endLine)) return false; //validate

  //sort
  if (chapterIndex1 > chapterIndex2) {
    showError("章節順序錯誤！");
    return false;
  } else if (chapterIndex1 === chapterIndex2) {
    if (line2 < line1) {
      showError("句子順序錯誤！");
      return false;
    }
  }

  if (endLine < startLine) {
    var tmp = endLine;
    endLine = startLine;
    startLine = tmp;
  }
  var title = getFullName(bookName);
  if (chapterIndex1 === chapterIndex2) {
    title += ' ' + chapterIndex1;
    if (line1 === line2) title += ":" + line1;
    else if (line1 != line2 && !(iLine1 === -1 && iLine2 === -1)) title += ":" + line1 + "-" + line2;
  } else {
    if (iChapterIndex1 === -1 && iChapterIndex2 === -1);
    else if ((iLine1 === -1 && iLine2 === -1)) title += " " + chapterIndex1 + "-" + chapterIndex2;
    else title += ' ' + chapterIndex1 + ":" + line1 + "-" + chapterIndex2 + ":" + line2;
  };
  showTitle(title);
  var text = displayTogether(startLine, endLine, bookName);
  showText(text);
  return true;
};

function watchSearchFocusing() {
  $('input[name=search]').on('focus', function() {
    $('.mdl-card__title').show();
  });
  $('input[name=search]').on('blur', function() {
    if (this.value.trim() != "")
      $('.mdl-card__title').hide();
  });
}
