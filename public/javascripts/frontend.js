
$(document).ready(function(){
// HOME PAGE JAVASCRIPT
    

// SAVED ARTICLES JAVASCRIPT
    $(".triggerModal").on("click", function(){
        var articleID = $(this).val();
        noteModal(articleID);
        articleID = "";
    })
    $("")
});




// SAVED ARTICLES MODAL
var noteModal = function(articleID){
    $.ajax({
        method: "GET",
        url: "/saved/" + articleID,
        success: function(response){
            console.log(response);
            $("#insertComment").empty();
            $("#insertComment").append(response.note.comment);
            var commentEndpoint = "/note/"+response.note._id;
            $("#clearComment").attr("action", commentEndpoint)
            $("#clearCommentBtn").attr('value', response.note._id);
          }
  })
    $("#notesModal").modal("show");
    $(".modal-title").empty();
    $(".modal-title").append("Notes For: "+articleID);
    $("#modalForm").attr("action", "/saved/"+articleID);
}