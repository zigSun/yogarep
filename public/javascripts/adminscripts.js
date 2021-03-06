$(document).ready(function () {
    $('.phone_input').mask('+7 999 999-99-99');
    $('i.fa.fa-plus').click(function () {
        $('#activity-modal').modal('show');
        $('#activity-form')[0].reset();
        var trainingdate = $(this).parent().data().trainingDate;
        var trainingtime = $(this).parent().data().trainingTime;
        members_list(trainingdate, trainingtime);
        $('#trainingdate_input').val(trainingdate);
        $('#trainingtime_input').val(trainingtime);
    });
    $('i.fa.fa-edit').click(function () {
        $('#activity-modal').modal('show');
        $('#activity-form')[0].reset();
        var trainingdate = $(this).parents('.training').data().trainingDate;
        var trainingtime = $(this).parents('.training').data().trainingTime;
        members_list(trainingdate, trainingtime);
        var startTime = $(this).parents('.training').find('#period-cell-start').text();
        var endTime = $(this).parents('.training').find('#period-cell-start').text();
        var activity = $(this).parents('.training').find('.activity-cell').text();
        var instructor = $(this).parents('.training').find('.instructor-cell').text();
        var vacancy = Number($(this).parents('.training').find('.vacancy-count-cell').text());
        $('#trainingdate_input').val(trainingdate);
        $('#trainingtime_input').val(trainingtime);
        $('#timeStart_input').val(startTime);
        $('#timeEnd_input').val(endTime);
        $('#activity_input').val(activity);
        $('#instructor_input').val(instructor);
        $('#vacancy_input').val(vacancy);
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
                location.reload();
            },
        });
    });
    $('#delete-activity').click(function () {
        var trainingDate = $('#trainingdate_input').val();
        var trainingTime = $('#trainingtime_input').val();
        $.ajax({
            type: "POST",
            url: "/admin/activity/delete",
            data: JSON.stringify({
                trainingdate: trainingDate,
                trainingtime: trainingTime,
            }),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                location.reload();
            },
        });
    });
    $('.autocomplete-name').autocomplete({
        serviceUrl: 'search',
        paramName: 'name',
        transformResult: function(response) {
            var arr = JSON.parse(response);
            return {
                suggestions: $.map(arr.suggestions, function(dataItem) {
                    return { value: dataItem.name, data: dataItem.phone_number };
                })
            };
        },
        onSelect: function (suggestion) {
           $('.phone_input').val(suggestion.data);
        }
    });
    $('#add_mem_input').click(function () {
        var mem_name = $('[name="new_mem"]').val();
        var mem_phone = $('[name="new_mem_phone"').val();
        console.log(mem_name + " " + mem_phone);
        var member = {name: mem_name, phone_number : mem_phone};
        var trainingdate=$('#trainingdate_input').val();
        var trainingtime=$('#trainingtime_input').val();
        fill_member(member,trainingdate,trainingtime);
        
    });
});

function members_list(trainingdate, trainingtime) {
    $.ajax({
        type: "POST",
        url: "/admin/activity/member_list",
        data: JSON.stringify({
            trainingdate: trainingdate,
            trainingtime: trainingtime,
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            $('#member_list tr').remove();
            for (var i = 0; i < data.members.length; i++) {
                var member = data.members[i]
                fill_member(member, trainingdate, trainingtime);
            }
            $(".delete-member").click(function () {
                var trainingDate = $(this).data().trainingDate;
                var trainingTime = $(this).data().trainingTime;
                var memberName = $(this).data().memberName;
                var that  =$(this);
                $.ajax({
                    type: "POST",
                    url: "/admin/activity/member_list_delete",
                    data: JSON.stringify({
                        trainingdate: trainingDate,
                        trainingtime: trainingTime, 
                        memberName : memberName
                    }),
                    dataType: "json",
                    contentType: "application/json",
                    success: function (data) {
                        that.parents('tr').remove();
                    }
                })
            });
        }
    })  

};

function fill_member(member, trainingdate, trainingtime) {
    var new_member = "<tr> <th scope='row'></th><td>" + member.name + "</td><td>" + member.phone_number + "</td><td align='right'> <i data-training-date='" + trainingdate + "' data-training-time='" + trainingtime + "'data-member-name='" + member.name + "' class='fa fa-times delete-member'></i></td></tr>";
    $('#member_list').append(new_member);
};