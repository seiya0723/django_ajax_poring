window.addEventListener("load" , function (){

    //イベントをセットする要素が動的に変化する場合、documentからイベントを指定する
    $(document).on("click","#submit_form", function(){ submit_form(); });
    $(document).on("click","#submit_url", function(){ submit_url(); });


    $(document).on("click",".trash", function(){ trash(this); });

    //要素に対して直接イベントをセットすると動的に変化した時、イベントが発動しなくなる
    //$("#submit_form").on("click",function(){ submit_form(); });
    //$("#submit_url").on("click",function(){ submit_url(); });
    //$(".trash").on("click", function(){ trash(this); });

    refresh();

});


function submit_url(){

    let form_elem   = "#form_area";

    //Ajaxの送信するデータ形式が、Ajaxを使用しないで送信するデータ形式と異なる場合、ビューの処理が変化する
    let data    = new FormData( $(form_elem).get(0) );
    let url     = $(form_elem).prop("action");
    let method  = $(form_elem).prop("method");

    url_encode  = "";

    //FormDataのオブジェクトを1つずつ取り出す(送信する内容)
    for (let v of data ){
        console.log(v);

        //URL_encode形式にする
        url_encode += v[0] + "=" + v[1] + "&";
    }

    console.log(url_encode);

    //参照:http://semooh.jp/jquery/api/ajax/jQuery.ajax/options/

    $.ajax({
        url: url,
        type: method,
        data: url_encode, //URL_encode形式であれば、contentType、processDataの指定は不要
        dataType: 'json' //返り値はjsonを指定
    }).done( function(data, status, xhr ) { 

        if (data.error){
            console.log("ERROR");
        }
        else{
            //ビューがレンダリングした文字列を貼り付ける
            $("#content_area").html(data.content);
            $("#textarea").val("");
        }

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    }); 

}


function submit_form(){

    let form_elem   = "#form_area";

    //Ajaxの送信するデータ形式が、Ajaxを使用しないで送信するデータ形式と異なる場合、ビューの処理が変化する
    let data    = new FormData( $(form_elem).get(0) );
    let url     = $(form_elem).prop("action");
    let method  = $(form_elem).prop("method");

    //FormDataのオブジェクトを1つずつ取り出して確認(送信する内容)
    for (let v of data ){ console.log(v); }

    //参照:http://semooh.jp/jquery/api/ajax/jQuery.ajax/options/


    $.ajax({
        url: url,
        type: method,
        data: data,
        processData: false, //URLエンコードされた文字列ではなくFormData形式なのでfalseを指定
        contentType: false, //URLエンコードされた文字列ではないためfalseを指定
        dataType: 'json' //返り値はjsonを指定
    }).done( function(data, status, xhr ) { 

        if (data.error){
            console.log("ERROR");
        }
        else{
            //ビューがレンダリングした文字列を貼り付ける
            $("#content_area").html(data.content);
            $("#textarea").val("");
        }

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    }); 
}

function trash(elem){

    let form_elem   = $(elem).parent("form");
    let url         = $(form_elem).prop("action");

    //リクエストボディ(data無し)
    $.ajax({
        url: url,
        type: "DELETE",
        dataType: 'json'
    }).done( function(data, status, xhr ) { 

        if (data.error){
            console.log("ERROR");
        }
        else{
            $("#content_area").html(data.content);
        }

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    }); 
}


function refresh(){

    $.ajax({
        url: "refresh/",
        type: "GET",
        dataType: 'json'
    }).done( function(data, status, xhr ) { 

        if (data.error){
            console.log("ERROR");
        }
        else{
            $("#content_area").html(data.content);
        }

    }).fail( function(xhr, status, error) {
        console.log(status + ":" + error );
    }).always( function(){

        //成功しても失敗しても実行されるalways

        console.log("refresh");
        setTimeout(refresh, 1000);

    });    
    
}
