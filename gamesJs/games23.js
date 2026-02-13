document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.querySelector(".preloader");

  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("hidden");

      setTimeout(() => {
        preloader.style.display = "none";
        const nextDiv = document.querySelector(".next-div");
        if (nextDiv) nextDiv.style.display = "block";
      }, 500);
    }, 4000);
  }
});

$(function () {
  // ❗ Guard: jika game_container_23 tak wujud, jangan run game
  if (!$("#game_container_23").length) return;

  // ❗ Guard: pastikan jQuery UI ada
  if (typeof $.fn.sortable !== "function") {
    console.error("jQuery UI sortable not loaded.");
    return;
  }

  var answers = [
    { text: "be honest", order: "1" },
    { text: "makes perfect", order: "2" },
    { text: "we become experts", order: "3" },
  ];

  var subcontainers = [
    { text: "When the same tasks over and over again, ______", id: "fruits" },
    { text: "Have a positive mindset and ______", id: "vegetables" },
    { text: "Practice ______", id: "neverpresent" },
  ];

  var fruits_correct = ["answer3"];
  var veggies_correct = ["answer1"];
  var os_correct = ["answer2"];

  reset_game();

  $("#reset_button_23").on("click", reset_game);

  $("#check_button_23").on("click", function () {
    $("#game_container_23 .qanswer").promise().done(score_game);
  });

  $("#ok_button_23").on("click", function () {
    $("#message_23")
      .animate({ width: 0, height: 0, padding: 0, opacity: 0 }, 600)
      .hide(600);
  });

  function reset_game() {
    $("#draggable_container_23").empty().removeClass();
    $("#droppable_container_23").empty();

    $("#check_button_23").prop("disabled", false);
    $("#message_23").hide();
    $("#score_container").hide();

    subcontainers.forEach((item) => {
      $("<div><strong>" + item.text + "</strong></div>")
        .addClass("subcontainer")
        .attr("id", item.id)
        .appendTo("#droppable_container_23")
        .sortable({
          containment: "#game_container_23",
          cursor: "move",
          items: "div",
          revert: 250,
          connectWith: "#game_container_23 .subcontainer",
          receive: function (event, ui) {
            if (ui.item.parents("#game_container_23 .subcontainer").length) {
              ui.item.removeClass("dragthis").addClass("dropped");
            } else {
              ui.item.removeClass("dropped").addClass("dragthis");
            }
          },
        })
        .disableSelection();
    });

    answers.sort(() => 0.5 - Math.random());

    answers.forEach((ans) => {
      $("<div>" + ans.text + "</div>")
        .attr("id", "answer" + ans.order)
        .addClass("dragthis qanswer")
        .appendTo("#draggable_container_23")
        .disableSelection();
    });

    $("#draggable_container_23")
      .sortable({
        connectWith: "#game_container_23 .subcontainer",
        containment: "#game_container_23",
        cursor: "move",
        items: "div",
        revert: 250,
      })
      .disableSelection();
  }

  function score_game() {
    if (!$("#draggable_container_23").is(":empty")) {
      $("#message_23 #text").html(
        "The game is not complete! Please drag all the answers"
      );

      $("#message_23")
        .show()
        .css({
          top: $("#droppable_container_23").position().top - 50,
          left: $("#droppable_container_23").position().left + 100,
        })
        .animate(
          { width: "450px", height: "80px", padding: "20px", opacity: 1 },
          400
        );
      return;
    }

    $("#game_container_23 .subcontainer").sortable("option", "disabled", true);
    $("#check_button_23").prop("disabled", true);

    let correctCounter = 0;

    $("#game_container_23 .dropped").each(function () {
      const thisId = $(this).attr("id");
      const parentId = $(this).parent().attr("id");
      $(this).css("cursor", "default");

      const isCorrect =
        ($.inArray(thisId, fruits_correct) > -1 && parentId === "fruits") ||
        ($.inArray(thisId, veggies_correct) > -1 &&
          parentId === "vegetables") ||
        ($.inArray(thisId, os_correct) > -1 && parentId === "neverpresent");

      if (isCorrect) {
        $(this).addClass("correct").removeClass("dropped");
        correctCounter++;
      } else {
        $(this).addClass("incorrect").removeClass("dropped");
      }
    });

    $("#score_text_23").html(
      'You got <span class="score">' + correctCounter + "</span> out of 3 correct!"
    );
    $("#score_container").slideDown(400);
  }
});
