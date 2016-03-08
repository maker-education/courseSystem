function ajax_post() {
    var img = $('#imgdiv>img').attr('src');
    var post = $('#summernote_1').summernote('code');

    if ($.trim(post) == '') {
        alert('内容为空,请填写内容')
        return
    }

    var p = new RegExp('^data:image/jpeg;base64');
    post = encodeURIComponent(post);
    var d = {};
    if (p.test(img)) {
        img = encodeURIComponent(img);
        d = { 'img': img, 'post':post };
    } else {
        d = { 'post':post };
    }

    $("#btn_submit").attr("disabled", true);
    $.ajax({
        dataType: "json",
        type : 'post',
        contentType: 'application/json;charset=utf-8',
        data : JSON.stringify(d),
        success: function(data) {
            if (data.success) {
                window.location.href = '/'
            }
        }
    });

}
