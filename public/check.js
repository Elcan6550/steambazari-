var fs = require('fs');
var c = fs.readFileSync('index.html','utf8');

// Find the card click handler
var clickStart = c.indexOf('document.querySelectorAll');
if (clickStart >= 0) {
  var clickEnd = c.indexOf('});', clickStart) + 3;
  if (clickEnd > clickStart + 100) {
    var handler = c.substring(clickStart, clickEnd);
    console.log('=== Card click handler ===');
    console.log(handler);
  }
}

// Also check the modal HTML structure
var modalHTML = c.indexOf('game-info-body');
if (modalHTML >= 0) {
  console.log('\n=== Modal HTML ===');
  var start = c.lastIndexOf('<div', modalHTML - 200);
  var end = c.indexOf('</div>', modalHTML + 300);
  console.log(c.substring(start < 0 ? modalHTML - 100 : start, end + 6));
}
