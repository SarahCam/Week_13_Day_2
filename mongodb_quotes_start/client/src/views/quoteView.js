var QuoteView = function(){
  this.quotes = [];
}

QuoteView.prototype.addQuote = function(quote) {
  this.quotes.push(quote);
  this.render(quote);
}

QuoteView.prototype.clear = function(quote) {
  this.quotes = [];
  const ul = document.querySelector('#quotes');
  ul.innerHTML = '';
}

QuoteView.prototype.render = function(quote){
  // Add render stuff here...
}

 module.exports = QuoteView;
