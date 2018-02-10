console.log("Front End JS Connected");
// HOME PAGE JAVASCRIPT









// SAVED ARTICLES JAVASCRIPT
$(document).ready(function(){
    $(".triggerModal").on("click", function(){
        var articleID = $(this).val();
        noteModal(articleID);
        articleID = "";
    })
});

var noteModal = function(articleID){
    var commentResponse;
    $.ajax({
        method: "GET",
        url: "/saved/" + articleID,
        success: function(response){
            $("#insertComment").empty();
            $("#insertComment").append(response.note.comment);
          }
  })
    $("#notesModal").modal("show");
    $(".modal-title").empty();
    $(".modal-title").append("Notes For"+articleID);
    $("#modalForm").attr("action", "/saved/"+articleID);
}