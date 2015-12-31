// This script is supposed to be used in environment
// with multiple jQuery versions.
// By saving $ we are ensuring that the version
// that is used in callbacks will be the same as
// the version used during initialization.

var euro = $;
var base_anim_speed = 200;
var scroll_down_anim_mul = 5;
var fade_anim_mul = 1;
function get_selected_post_chunk() {
    var quote_container = euro(
        "<div class='quick-quote-container'>" +
            euro.selection('html') +
        "</div>"
    );
    if (quote_container.find(".postcontent").length > 0 ||
            quote_container.filter(".postcontent").length > 0) {
        return "";
    }
    // Removing new-styled quotes
    euro.each(quote_container.find("div.QUOTE_top, " +
                                   "div.QUOTE, " +
                                   "div.HIDE_top, " +
                                   "div.HIDE, " +
                                   "div.HIDEERROR_top, " +
                                   "div.HIDEERROR, " +
                                   "div.CODE_top, " +
                                   "div.CODE, " +
                                   "div.SQL_top, " +
                                   "div.SQL, " +
                                   "div.HTML_top, " +
                                   "div.HTML"), 
        function(index, value) {
            value.remove();
        }
    );
    var chunks_to_quote = quote_container.find("> .postcolor");
    if (chunks_to_quote.length !== 0) {
        var to_ret = "";
        euro.each(chunks_to_quote, function(index, value) {
            var chunk = euro(value);
            to_ret += chunk.innerText();
        });
        return to_ret;
    } else {
        return quote_container.innerText();
    }
}

function get_post_tbody(post_contents) {
    var parents = euro(post_contents).parentsUntil(euro("table"));
    return euro(parents[parents.length - 1])
}

function get_author_name(quoted_post_contents) {
    return euro.trim(get_post_tbody(quoted_post_contents).find(".normalname").text());
}

function get_date(quoted_post_contents) {
    return euro.trim(
        get_post_tbody(quoted_post_contents)
        .find("tr:eq(0) > td:eq(1) .postdetails")
        .contents()
        .filter(function(){
            return this.nodeType !== 1;
        })
        .text());
}

function build_quote(author, date, contents) {
    return "[quote=" + author + "," + date + "]" +
        contents +
        "[/quote]\n"
}

function get_quoter() {
    return euro("#quick-quote-popup");
}

function show_quoter(author, date, contents, e) {
    var quoter = get_quoter();
    quoter.data("contents", contents);
    quoter.data("author", author);
    quoter.data("date", date);
    function animate_show() {

    }
    return quoter.fadeOut(fade_anim_mul * base_anim_speed).animate({
        top: e.pageY + 1,
        left: e.pageX + 1
    }).fadeIn(fade_anim_mul * base_anim_speed);
}

function hide_quoter() {
    return get_quoter().fadeOut(fade_anim_mul * base_anim_speed);
}

function is_quoter_visible() {
    return get_quoter().is(":visible");
}

function do_quote(quoter) {
    var qr_form = euro("#qr_open");
    qr_form.show();
    var text_area = qr_form.find("textarea");
    var text = text_area.val();
    var text_lines = text.split("\n");
    if (text_lines.length > 0 && text_lines[text_lines.length - 1].length > 0) {
        text += "\n";
    }
    text_area.val(text + build_quote(
            quoter.data("author"),
            quoter.data("date"),
            quoter.data("contents")
        ));
    euro("html, body").animate({
        scrollTop: euro(document).height() 
    }, scroll_down_anim_mul * base_anim_speed);
    text_area.focus();
}

euro(document).ready(function (){
    euro(document).on("mouseup", ".postcontent", function(e) {
        var contents = get_selected_post_chunk();   
        var author = get_author_name(e.currentTarget);
        var date = get_date(e.currentTarget);
        if (contents !== "") {
            show_quoter(author, date, contents, e);
        } else {
            hide_quoter();
        }
        e.stopPropagation();
    });
    euro(document).mouseup(function(e) {
        if (is_quoter_visible()) {
            var quoter = get_quoter();
            if (!quoter.is(e.target) && quoter.has(e.target).length === 0) {
                hide_quoter();
            }
        }
    });
    euro("#quoter-do-quote").click(function(e) {
        e.preventDefault();
        do_quote(get_quoter());
    hide_quoter();
    });
    euro("#quoter-cancel").click(function(e) {
        e.preventDefault();
        hide_quoter();
    });

}); 
