$(document).ready(function () {
    $('#phone_input').mask('+7 999 999-99-99');
    $('i.fa.fa-plus').click(function () {
        $('#activity-modal').modal('show');
        $('#activity-form')[0].reset();
        var trainingdate = $(this).parent().data().trainingDate;
        var trainingtime = $(this).parent().data().trainingTime;
        $('#trainingdate_input').val(trainingdate);
        $('#trainingtime_input').val(trainingtime);
    });
    $('#activity-form').submit(function (e) {
        e.preventDefault();
        var trainingDate = $('#trainingdate_input').val();
        var trainingTime = $('#trainingtime_input').val();
        var timeStart = $('#timeStart_input').val();
        var timeEnd = $('#timeEnd_input').val();
        var activity = $('#activity_input').val();
        var instructor = $('#instructor_input').val();
        var vacancy = $('#vacancy_input').val();
        $.ajax({
            type: "POST",
            url: "/admin/activity/save",
            data: JSON.stringify({ 
                trainingdate: trainingDate, 
                trainingtime: trainingTime,
                timestart: timeStart,
                timeend: timeEnd,
                activity: activity,
                instructor: instructor,
                vacancy: vacancy
            }),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                $('#activity-modal').modal('hide');
                var edited_cell = $('[data-training-date="'+trainingDate+'"][data-training-time="'+trainingTime+'"] '); //обновляем ячейку
                console.log(edited_cell);
            },
        });
    })
});