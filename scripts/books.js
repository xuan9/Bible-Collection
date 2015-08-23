function listBooks() {
  var menu = '';
  var isNewLine = false;
  for (i in simple_books) {
    if (i % 6 === 0 && !isNewLine) {
      isNewLine = true;
      menu += '<li class="mdl-menu__item">';
    } else {
      isNewLine = false;
    }
    menu += '<span class="book-menu-item" onclick="book(\'' + simple_books[i] + '\')">' + simple_books[i] +
      '</span>';
    if ((i + 1) % 6 === 0) {
      menu += '</li>';
    }
  }
  if (simple_books.length % 6 !== 0) {
    menu += '</li>';
  }
  $("#top-right-menu").html(menu + $("#top-right-menu").html());
}

function book(simpleName, chapter) {
  if (!chapter) {
    chapter = "1";
  }
  cleanSearch();
  document.getElementsByName("search")[0].value = simpleName + " " + chapter;
  searchInputChanged(simpleName + " " + chapter);
  scrollToTop();
}

function setFootLinks(centerLink, leftLink) {
  if (centerLink) {
    $('#footer_center_link').attr('href', centerLink[1]);
    $('#footer_center_link').html(centerLink[0]);
  } else {
    $('#footer_center_link').attr('href', "");
    $('#footer_center_link').html("");
  }
  if (leftLink) {
    $('#footer_left_link').attr('href', leftLink[1]);
    $('#footer_left_link').html(leftLink[0]);
  } else {
    $('#footer_left_link').attr('href', "");
    $('#footer_left_link').html("");
  }
}

function bookLink(bookIndex, chapter) {
  var longBookName = books[bookIndex];
  var book = simple_books[bookIndex];
  return [longBookName + ' ' + chapter, 'javascript:book("' + book + '", ' + chapter + ')'];
}

function parseBookChapterQueryForFooterLinks(query) {
  var reBooks = /^\s*([\u4e00-\u9fa5]{1,10})\s*([0-9]+)\s*$/;
  var m;
  if ((m = reBooks.exec(query)) !== null) {
    var bookName = m[1];
    var chapter = parseInt(m[2]);
    var bookIndex = getBookIndex(bookName);
    var bookTotalChapters = getTotalChapters(bookIndex);
    if (bookIndex > 0 && chapter > 0 && chapter <= bookTotalChapters && bookTotalChapters > 1) {
      if (chapter == 1) {
        setFootLinks(bookLink(bookIndex, 2));
      } else if (chapter == bookTotalChapters) {
        setFootLinks(bookLink(bookIndex, 2), bookLink(bookIndex, chapter - 1));
      } else {
        setFootLinks(bookLink(bookIndex, chapter + 1), bookLink(bookIndex, chapter - 1));
      }
    } else {
      setFootLinks();
    }
  } else {
    setFootLinks();
  }
}
