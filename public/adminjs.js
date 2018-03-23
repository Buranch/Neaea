
// '.tbl-content' consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .
$(window).on("load resize ", function() {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({'padding-right': scrollWidth});
}).resize();

$(document).ready(function() {

    $(window).click(() => {

        $(".suggestion").css("display", "none");

    })

    var holder = $("#holder");
    var touched = [];


    //template
    var j = {"name": "Biruk"};
    $("#done").on('click', function(){
      console.log("Done clicked");
      console.log("touched is ");
      console.log(touched);

      $.ajax({
        method: "post",
        url: "admin/manipulate",
        contentType: "application/json",
        processData: false,
        dataType: "json",
        data: JSON.stringify(touched)
      })
      .done(function( msg ) {
        console.log("msg: ", msg);
        $("#success").css('display', 'block');
        $("#success").css('backgroundColor', '#bce438');
        $("#success").text("Submitted!");

      });

    })
    $(".searchButton").click(function() {
        console.log("clicked searchButton");
        console.log($("#searched").val());

        $.get(`admin/school_list?school=${$("#searched").val()}`, function(data) {

            holder.html(" ");
            console.log("data received");
            console.log(data);
            $("#success").css('display', 'block');
            $("#success").text(data.length + " students");
            $("#success").css('backgroundColor', '#00ff86');

            renderStudnet(data);

        })

    })
    $("#searched").keyup(function() {

        if ($("#searched").val().length >= 2) {

            $(".suggestion").css("display", "block");
            $(".suggestion").html(" ");

            $.get(`admin/school?school=${$("#searched").val().toUpperCase()}`, function(result) {
                console.log("result is ");
                console.log(result);
                var counter = 0;
                result.every((school) => {
                    $(".suggestion").append(`<li id=${school}>` + school + `</li>`);
                    counter += 1
                    console.log("counter ");
                    var last = $('li').last();

                    last.on("click", function() {
                        $("#success").css("display", "block");
                        
                        $("#success").text("Loading...");
                        $("#success").css("backgroundColor","rgb(255, 197, 0)");
                        console.log("you clicked " + $(this)[0].id);
                        // $("#searched").val($(this)[0].id);
                        // clousure here
                        $("#searched").val(school);
                        $(".searchButton").click();

                    });

                    if (counter > 6) {
                        return false
                    } else {
                        return true;
                    }
                })

            })

        } else {
            $(".suggestion").css("display", "none");

        }

    });
    function renderStudnet(student) {
        for (var i = 0; i < student.length; i++) {

            var template = `<tr>
        <td>${student[i]["Reg No"]}</td>
        <td><input  id="${student[i]["Reg No"] + "_Eng"}"  maxlength="2" class = "subject" placeholder="${student[i]["Eng"]}" type="number"/></td>
        <td><input id="${student[i]["Reg No"] + "_NMa"}" maxlength="2" class = "subject" placeholder="` + student[i]["NMa"] + `" type="number"/></td>
        <td><input id="${student[i]["Reg No"] + "_Phy"}"  maxlength="2" class = "subject" placeholder="` + student[i]["Phy"] + `" type="number"/></td>
        <td><input id="${student[i]["Reg No"] + "_Che"}"  maxlength="2" class = "subject" placeholder="` + student[i]["Che"] + `" type="number"/></td>
        <td><input id="${student[i]["Reg No"] + "_Bio"}"  maxlength="2" class = "subject" placeholder="` + student[i]["Bio"] + `" type="number"/></td>
        <td><input id="${student[i]["Reg No"] + "_Civ"}"  maxlength="2" class = "subject" placeholder="` + student[i]["Civ"] + `" type="number"/></td>
        <td><input id="${student[i]["Reg No"] + "_Apt"}"  maxlength="2" class = "subject" placeholder="` + student[i]["Apt"] + `" type="number"/></td>
        <td><input disabled id="${student[i]["Reg No"] + "_Total"}"  maxlength="3" class = "subject" placeholder="` + student[i]["Total"] + `" type="number"/></td>
    </tr>`;

            holder.append(template);

            //onchange attachement should be for all subjects
            var sub = [
                "Eng",
                "NMa",
                "Phy",
                "Che",
                "Bio",
                "Civ",
                "Apt",
                "Total"
            ];
            sub.forEach(function(sub) {


                var currentStudent = student[i];
                $(`#${student[i]["Reg No"]}_${sub}`).on("change", function() {
                    //previous point
                    // var previous = student[i][sub];
                    console.log("student[i]");
                    console.log(currentStudent);
                                        
                    // console.log("previous  ", previous);
                    console.log("value changed to ", $(this).val());
                    console.log("id is ", $(this)[0].id);
                    // studnet[$(this)[0].id.substring(0, 6);
                    console.log("typeof ", $(this)[0].id.toUpperCase());
                    var id = $(this)[0].id.substring(0, 6);
                    var subject = $(this)[0].id.substring(7);
                    var val = $(this).val();
                    var newVal = 0;

                    newVal = val - currentStudent[sub];

                    console.log("new add ", newVal);
                    //send the data to server to update it
                    var o = {};
                    o["id"] = id;

                    o["subject"] = {
                    };
                    o["subject"][subject] = val;
                    o["subject"]["Total"] = eval(currentStudent["Total"]) + eval(newVal);
                    var flag = false;
                    touched.every((student)=>{
                    //  var newVal = newVal;
                      if(student.id == id){
                          
                        console.log("woo this object is already created");
                        // newVal = $(this).val() - student["subject"][subject];
                        student["subject"][subject] = val;
                        var total = student["subject"]["Total"] + newVal;
                        student["subject"]["Total"] = total;
                        $(`#${currentStudent["Reg No"]}_Total`).val(total);            
                        flag = true;
                        return false;
                      }
                      return true;
                    });
                    if(!flag){
                      console.log("no this object before");
                      touched.push(o);
                      $(`#${currentStudent["Reg No"]}_Total`).val(o["subject"]["Total"]);
                    }

                    Object.keys(student).forEach(function(e) {
                        // console.log("e is ", student[e]);
                        if (student[e]["Reg No"] == id) {
                            console.log("woo found it");
                            console.log(student[e]);

                            student[e][subject] = val;

                        }
                    });
                    console.log("object after");
                    console.log(student);
                });

            });

        }

    }

});
