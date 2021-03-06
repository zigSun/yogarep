$(document).ready(function () {
    $('#phone_input').mask('+7 999 999-99-99');
    $('.go-btn').click(function () {
        $('#activity-modal').modal('show');
        $('#go-form')[0].reset();
        var trainingdate = $(this).parents('.training').data().trainingDate;
        var trainingtime = $(this).parents('.training').data().trainingTime;
        console.log($(this));
        $('#trainingdate_input').val(trainingdate);
        $('#trainingtime_input').val(trainingtime);
        $('#preiod-info-data').text($(this).parents('.training').find('.period-cell').text());
        $('#activity-info-data').text($(this).parents('.training').find('.activity-cell').text());
        $('#instructor-info-data').text($(this).parents('.training').find('.instructor-cell').text());
        $.ajax({
            type: "POST",
            url: "/activity/user/members-count",
            data: JSON.stringify({
                trainingdate: trainingdate,
                trainingtime: trainingtime,
            }),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                $('#member-info-data').text(data.member_count);
            },
        });
    });
    $('#go-form').submit(function (e) {
        e.preventDefault();
        var trainingDate = $('#trainingdate_input').val();
        var trainingTime = $('#trainingtime_input').val();
        var newMemName = $('#new_mem_input').val();
        var newMemPhone = $('#phone_input').val();
        $.ajax({
            type: "POST",
            url: "/activity/user/save",
            data: JSON.stringify({
                trainingdate: trainingDate,
                trainingtime: trainingTime,
                memName: newMemName,
                memPhone: newMemPhone,
            }),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                location.reload();
            },
        });
    })
});