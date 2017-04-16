/*global $, alert, console*/

$(document).ready(function () {
    "use strict";

    var contents = {};
    // var url = './partials/contactpage.html';
    var url = './partials/homepage.html';

    var nm, em, sb, ms, i;
    var dt = {};
    var errors = [];
    var collect;

    $( "a" ).on( "click", notify );

    function notify(ev) {
        ev.preventDefault();
        url = $(this).attr('href');
        storeContents(".container");
    }

    function handleResponse(rsp) {
        $(".feedback").html(rsp).hide().fadeIn(500);
        $(".input").val("");
    }

    function handleError(jqXHR, textStatus, errorThrown) {
        console.log("textStatus: " + textStatus + "\n" +
            "errorThrown: " + errorThrown);
    }

    function validateForm(ev) {

        errors = [];

        console.log('Inside validateForm');

        ev.preventDefault();

        nm = $.trim($("#name").val());
        em = $.trim($("#email").val());
        sb = $.trim($("#subject").val());
        ms = $.trim($("#comment").val());

        if (nm !== "") { dt.name = nm; } else { errors.push("Name?"); }
        if (em !== "") { dt.email = em; } else { errors.push("Email?"); }
        if (sb !== "") { dt.subject = sb; } else { errors.push("subject?"); }
        if (ms !== "") { dt.comment = ms; } else { errors.push("comment?"); }

        // Check if the data is ready
        if (errors.length === 0) {
            
            console.log('no errors so, handle ajax request');

            // handle ajax request
            $.ajax({
                type: "post",
                url: "./server-side-script/web-service.php",
                data: dt,
                dataType: "text"
            }).done(handleResponse).fail(handleError);

        } else {
            collect = 'Please fix the following errors:<ul>';
            for (i = 0; i < errors.length; ++i) 
            {
                collect+= '<li>' + errors[i] + '</li>';
            }
            collect+= '</ul>';
            $( ".feedback" ).html(collect);
            collect = '';
            console.log('Errors: ' + errors);
        }
    }

    function storeContents(container) {
        console.log(contents[url]);

        if (contents[url] == undefined) {
            console.log('contents[url] == undefined');

            $(container).load(url, function (pageRsp) {
                contents[url] = pageRsp;
                $("form").on("submit", validateForm);
            });
        }
        else {
            console.log('contents[url] != undefined');

            $(container).html(contents[url]);
        }
    }


    storeContents(".container");

});


