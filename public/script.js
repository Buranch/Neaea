$(document).ready(function () {
    const $gender = $("#gender");
    const $uniqueID = $("#uniqueID");
    const $firstName = $("#firstName");
    const $middleName = $("#middleName");
    const $lastName = $("#lastName");
    const $schoolName = $("#schoolName");
    const $totalScore = $("#totalScore");
    const $subjectEnglish = $("#subjectEnglish");
    const $subjectMath = $("#subjectMath");
    const $subjectPhysics = $("#subjectPhysics");
    const $subjectChemistry = $("#subjectChemistry");
    const $subjectBiology = $("#subjectBiology");
    const $subjectCivics = $("#subjectCivics");
    const $subjectAptitude = $("#subjectAptitude");
    const $univeristy = $("#univeristy");
    const $field = $("#field");
    
    const university = ["Addis Ababa Univeristy",
        "Hawassa University",
        "Mekelle University",
        "ASTU Techno Insititue",
        "Adama University",
        "DireDawa University",
        "Arba Minch Univeristy",
        "Bahir Dar University",
        "Gondor University",
        "Assela University",
        "Debre Birhan University",
        "Adigrat Univeristy",
        "Haramaya University"];
    const field = ["Engineering","Agrictulture", "Medicine", "Other Science", "Dental Medicine", "Health Science", "Veternary Medicine", "Verternary Science"];


    $(window).click(() => {

        $(".suggestion").css("display", "none");

    })


    $("#searched").keyup(function () {

        if ($("#searched").val().length >= 5) {
            var currentName = $("#searched").val().toUpperCase();
            $(".suggestion").html(" ");
            if (currentName.split(" ").length > 0) {
                var s = "firstName?name=" + currentName.split(" ")[0] + "&lname=" + currentName.split(" ")[1];
            }
            else {
                var s = "firstName?name=" + currentName;
            }
            $.get(s, function (result) {
                // console.log(result);
                var data = result[0];
                var index = result[1];
                $(".suggestion").html("");

                for (var i = 0; i < 10; i++) {
                    if (data[i] != undefined) {
                        $(".suggestion").append(`<li id= "` + index[i] + `">` + data[i] + `</li>`);
                        var last = $("li").last();
                        //  console.log("added ", data[i]);
                        //  last.on("click", clickedd(last[0].id));
                        last.on("click", function () {
                            // console.log($(this)[0].id)
                            //   alert($(this)[0].id);
                            $("#searched").val($(this)[0].id);
                            $(".searchButton").click();


                        });


                    }
                }
            })
            $(".suggestion").css("display", "block");


        }
        else {
            $(".suggestion").css("display", "none");

        }
    });




    //handling enter key
    $(document).keypress((e) => {

        if (e.which == 13) {
            $(".searchButton").click();
        }
    });

    // handling search button
    $(".searchButton").click(function () {
        console.log("clicked");
        console.log($("#searched").val());
        var s = "exam_result?id=" + $("#searched").val();
        // $(".suggest").css("display", "none");

        $.get(s, function (data) {

            renderName(
                data["Name"],
                data["F Name"],
                data["GF Name"],
                data["Reg No"],
                data["Sex"],
                data["School Name"],
                data["Total"]);
            renderSubjects(
                data["Eng"],
                data["NMa"],
                data["Phy"],
                data["Che"],
                data["Bio"],
                data["Civ"],
                data["Apt"]);
            var lucky = Math.floor(Math.random() * (14 - 1 + 1)) + 1;
            console.log("lucky ", lucky);
            if (data["Sex"] == "F") {

                $("#photo").attr("src", `images/F` + lucky + `.jpg`);
            }
            else {
                $("#photo").attr("src", `images/M` + lucky + `.jpg`);
            }
        });
        function renderSubjects(eng, math, phy, che, bio, civ, apt) {
            $subjectEnglish.text(eng);
            $subjectMath.text(math);
            $subjectPhysics.text(phy);
            $subjectChemistry.text(che);
            $subjectBiology.text(bio);
            $subjectCivics.text(civ);
            $subjectAptitude.text(apt);
            var lucky = Math.floor(Math.random() * (university.length - 1)) + 0;
            var lucky_2 = Math.floor(Math.random() * (field.length - 1)) + 0;

            $univeristy.text(university[lucky]);
            $field.text(field[lucky_2]);


        };


        function renderName(first, father, gfather, id, gender, school, total) {
            $firstName.text(first.charAt(0) + first.substring(1, first.length).toLowerCase());
            //father name
            $middleName.text(" " + father.charAt(0) + father.substring(1, father.length).toLowerCase() + " ");
            $lastName.text(" " + gfather.charAt(0) + gfather.substring(1, gfather.length).toLowerCase());
            //id
            $uniqueID.text(" " + id);
            $gender.text(" " + gender);
            $schoolName.text(" " + school)
            $totalScore.text(" " + total)

        }

    });
    //for login
    $('.message a').click(
        function () {
            $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");

        });
});
