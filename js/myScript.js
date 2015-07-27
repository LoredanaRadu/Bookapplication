var populateList =
    function () {
        $.ajax({
            type: "GET",
            url: "http://localhost:8000/api/books",
            dataType: "json",
            success: function (data) {

                $.each(data, function (i, item) {
                    var $title = $('<td>').text(item.title);
                    var $author = $('<td>').text(item.author);
                    var $genre = $('<td>').text(item.genre);
                    var $read = $('<td>').text(item.read);
                    var $deleteBtn = $('<button>').text('Delete');

                    var $tr = $('<tr>').append(
                        $title,
                        $author,
                        $genre,
                        $read,
                        $deleteBtn).appendTo('#myTable');

                    $tr.attr('book-id', item._id);
                });

            },
            error: function () {
                alert('Error at table');
            }


        });
    };

var populateForm =
    function (id) {
        $.ajax({

            type: "GET",
            url: "http://localhost:8000/api/books/" + id,
            dataType: "json",
            success: function (data) {
                //var $myForm = $('form.myForm');
                //$myForm.find("#title").val(data.title);
                $("#title").val(data.title);
                $("#genre").val(data.genre);
                $("#author").val(data.author);
                $("#read").attr("checked", data.read);

                $(".myForm").attr('book-id',id);


            },
            error: function () {
                alert('Error at form');
            }


        });


    }





var updateInformation =
    function(id){
    $.ajax({

        type: "PUT",
        data: { title: $("#title").val(),
                author: $("#author").val(),
                genre: $("#genre").val(),
                read: $("#read").is(':checked')
        },
        url: "http://localhost:8000/api/books/"+ id,
        dataType: "json",

        success: function (data) {

            alert('Success for update');
        },
        error: function () {
            alert('Error for update');
        }
    });
}

var deleteRow =
    function (id, callback) {
        $.ajax({
            type: "DELETE",
            url: "http://localhost:8000/api/books/"+ id,
            dataType: "json",
            success: function (data) {
                callback();
            },

            error: function (data) {
                alert('Error deleting row');
            }
        });
    };

var createNewBook =
    function(callback){
        $.ajax({
            type: "POST",
            data:{  title: $("#title").val(),
                    author: $("#author").val(),
                    genre: $("#genre").val(),
                    read: $("#read").is(':checked')
            },
            url: "http://localhost:8000/api/books",
            dataType: "json",
            success: function (data) {
                callback();
            },

            error: function (data) {
                alert('Error creating new book');
            }
        });



    };

var attachClickEventToSave = function (){
    $(".myForm").on("click", '#saveBook', function() {
      alert('Am apasat butonul save');
    var bookId = $('.myForm').attr('book-id');

        updateInformation(bookId);
    });

}


var attachClickEventToCreate = function () {
    $(".myForm").on("click", '#createBook', function() {
        alert('Am apasat butonul create');
        createNewBook();
    });
}

var attachClickEventToRows = function () {

    $("#myTable").on("click", 'td', function () {
        var $row = $(this).closest('tr');
        var bookId = $row.attr('book-id');

        populateForm(bookId);
    });
};


var attachDeleteEventHandler = function () {


    $("#myTable").on("click", "button", function () {
        var $row = $(this).closest('tr');
        var bookId = $row.attr('book-id');


        deleteRow(bookId, function () {
            $row.remove();
        });
    });

};


$(document).ready(function () {
    populateList();
    attachDeleteEventHandler();
    attachClickEventToRows();
    attachClickEventToSave();
    attachClickEventToCreate();

});

