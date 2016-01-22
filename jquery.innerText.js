(function($){
   $.fn.innerText = function(msg) {
         if (msg) {
            if (document.body.innerText) {
               for (var i in this) {
                  this[i].innerText = msg;
               }
            } else {
               for (var i in this) {
                  this[i].innerHTML.replace(/<\s*br\s*\/?>/gi,"\n").replace(/(<([^>;]+)>)/gi, "");
               }
            }
            return this;
         } else {
            console.log("NO MSG!!!");
            if (document.body.innerText) {
               return this[0].innerText;
            } else {
               return this[0].innerHTML.replace(/<\s*br\s*\/?>/gi,"\n").replace(/(<([^>;]+)>)/gi, "");
            }
         }
   };
})(jQuery);
