var KEYS;

//functie care creeaza optiunile din dropdown
var createOptionWithMsg = function(key,val){
    var $option = $('<option>').html(val.toString());           //cauta valoarea si o pune in option
    $('.filter-' + key).append($option);                    //apenduieste valoare gasita in cheie
};


var createDropDowns = function (books) {                    //functie care creeaza dropdown-ul
    var keys = Object.keys(books[0]);                     //keys tine toate cheile din books, books fiind array-ul meu de obiecte din baza de date. books[0] imi ia un model din baza de date

    $.each(keys, function (i, key) {                //each care merge prin toate cheile
        onChangeDropDownValue(key);                             //apelam onChangeDropdownValue care listeaza optiunile in functie de optiunea apasata(titlu, autor etc)
        createOptionWithMsg(key,'');                   //apeleaza functia care face prima optiune empty ca sa imi afiseze toate elementele din baza de date
        var values = _.uniq(_.pluck(books, key));           //pune in values un array cu cheile din baza de date, o singura data
        $.each(values, function (j, val) {              //merge prin array-ul values si creeaza optiune pt fiecare cheie
            createOptionWithMsg(key,val);
        });
    });
};

var createTableHeader = function(keys){                                                                  //functia asta imi creeaza headerul tabelului si stie sa imi puna valorile title, read, author datorita cheilor (keys)
    var row =  $('<tr>');                                                                               //salvez in row tr in care voi avea th
    $.each(keys, function (i, key) {
         if(key !== '__v' )  {
             var cell =   $('<th>').addClass("capitalize").append($('<em>').text(key));  //iterez prin keys si o functie de i si key
                                                                                            // in cell imi pun th carora le apenduiesc clasa capitalize care imi face prima litera mare si em (italic)
         }
        if(key !== '_id')                                                                             //asta este necesara ca sa nu imi puna si id in tabel. Daca e diferit de id imi apenduieste cell la row
            row.append(cell);
    });
    row.appendTo('#myTable thead');                                                                     //la final de tot imi apenduieste row la headul din myTable
};
var createTable = function (books) {                            //asta este functia care imi creeaza tabelul si are un parametru books
    $.each(books, function (i, book) {                          //imi itereaza prin books si o functie cu param i si book

        var keys = Object.keys(book);                           //variabila keys este un obiect cu metoda keys(book)
        KEYS = keys;                                            //KYES ia valorile lui keys (vectorul de chei din jsonul meu)

        var row =  $('<tr>');                                   //imi pun tr intr-o variabila row
        $.each(keys, function (i, key) {
            if(key !== '__v' )
            {
                var cell =   $('<td>').addClass("text-justify").text(book[key]);
            } //imi adaug td in care pun cheile. gen ca un vector, book[key]=> v[i]
            if(key !== '_id') //ca sa nu pun si id
            row.append(cell);
            if(key === '_id') //daca am cheia === cu id atunci atribui book[key] in book-id
            row.attr('book-id', book[key]);
            else
            row.attr('book-'+key, book[key]);                                                               //altfel atribui book[key] pe care il denumesc 'book + cheia pe rand(titlu, gen, read si autor)
        });
        var $deleteBtn = $('<button>').addClass("center-block btn btn-info btn-sm styling text-justify").text('Delete');        //aici adaug dinamic butoanele care imi permit sa sterg
        row.append($deleteBtn);                                                                             //apenduiesc la tr butoanele astea
        row.appendTo('#myTable');                                                                           //apenduiesc row cu toate elementele la tabel


    });
    createTableHeader(KEYS);                        //apelez metoda createTableHeader cu param KEYS, adica KEYS se comporta ca si keys.
};

var populateList =                            //functia care imi populeaza lista. am un get care imi ia datele din baza de date, format json
    function () {
        $.ajax({
            type: "GET",
            url: "http://localhost:8000/api/books",
            dataType: "json",
            success: function (data) {
                createDropDowns(data);                            //apelez functia createDropDowns cu param data (data imi tine toate chestiile din json
                createTable(data);                                //apelez functia createTable cu param data ->il puteam numi cum voiam eu.
            },
            error: function () {
                alert('Error at table');
            }


        });
    };

var populateForm =                                 //functia care imi populeaza formularul dupa id(ca sa stie la ce carte ma aflu, sa nu dau click pe o carte si sa mi-o puna pe alta)
    function (id) {
        $.ajax({

            type: "GET",
            url: "http://localhost:8000/api/books/" + id,
            dataType: "json",
            success: function (data) {


                $("#title").val(data.title);               //#title este id inputului unde trebuie sa ajunga titlul meu si pun in el data.title adica titlul meu din baza de date
                $("#genre").val(data.genre);
                $("#author").val(data.author);
                $("#read").attr("checked", data.read);

                $(".myForm").attr('book-id', id);  //atribui formularului id in book-id ca sa stie si formul ce imi retine


            },
            error: function () {
                alert('Error at form');
            }


        });


    }


var updateInformation =                                              //functia care imi retine schimbarile pe care vreau sa le fac in formular (gen sa schimb un titlu de carte sau orice si sa pot trimite asta in baza mea de date)
    function (id) {
        $.ajax({

            type: "PUT",              //metoda put care imi permite update-ul
            data: {
                title: $("#title").val(),         //iau valoarea din celula cu titlul pe care o gasesc si o pun in titlu. Pun asta aici ca normal e ca intai sa imi ia datele si apoi sa faca ce mai vreau eu
                author: $("#author").val(),
                genre: $("#genre").val(),
                read: $("#read").is(':checked')
            },
            url: "http://localhost:8000/api/books/" + id,
            dataType: "json",

            success: function (data) {

                alert('Success for update');
            },
            error: function () {
                alert('Error for update');
            }
        });
    }

var deleteRow =                              //functia care imi permite stergerea unui rand in momentul in care apas butonul delete(tot dupa id) -> de exemplu daca iau deleteRow de (key si o functia inseamna ca id este cheia si functia aia este callback-ul meu)
    function (id, callback) {
        $.ajax({
            type: "DELETE",
            url: "http://localhost:8000/api/books/" + id,
            dataType: "json",
            success: function (data) {
                callback();    //am o functie de param id si callback, callback care este apelat aici, dar declarat in alta parte
            },

            error: function (data) {
                alert('Error deleting row');
            }
        });
    };

var createNewBook =                            //functia care imi permite crearea uneu carti noi
    function (callback) {
        $.ajax({
            type: "POST",                         //trimit datele in baza de date
            data: {
                title: $("#title").val(),
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


var attachClickEventToSave = function () {                              //functia care imi permite sa salvez modificarile facute in form
    $(".myForm").on("click", '#saveBook', function () {                 //cand dau click pe butonul save din my form
        alert('Am apasat butonul save');
        var bookId = $('.myForm').attr('book-id');                      //atribui formului atributul book-id care a fost declarat mai sus(in el tin id)

        updateInformation(bookId);                                      //apelez updateInformation de bookId, adica de id la care am fost cand am dat click pe tabel
    });

}


var attachClickEventToCreate = function () {                      //functia care imi permite sa creez o noua carte
    $(".myForm").on("click", '#createBook', function () {
        alert('Am apasat butonul create');
        createNewBook();         //creez o noua carte, de data asta nu am nevoie de niciun id pt ca el trbuie sa imi atribuie singur un id unic
    });
}

var attachClickEventToRows = function () {             //functia care imi da click pe randurile tabelului ca sa imi trimita datele in form

    $("#myTable").on("click", 'td', function () {    //cand dau click pe tabel, pe orice rand din tabel
        var $row = $(this).closest('tr');           //imi retine unde dau click (cauta cel mai apropiat tr)
        var bookId = $row.attr('book-id');          //si in bookId imi pune id de la ala unde am dat click (ca sa nu imi trimita alta carte in form)

        populateForm(bookId);                       //apelez functia care imi populeaza formul cu id pe care tocmai l-am salvat
    });
};


var attachDeleteEventHandler = function () {                //functia care imi ataseaza un handler atunci cand dau click pe randuri


    $("#myTable").on("click", "button", function () {       //dau click pe butonul delete
        var $row = $(this).closest('tr');                   //identific unde am dat click
        var bookId = $row.attr('book-id');                  //iau valoarea atributului de la book-id


        deleteRow(bookId, function () {           //functia care imi sterge randurile de la id respectiv
            $row.remove();                         //am functia de un param si o functie care asta mai sus era callback
        });
    });

};

var filterTable = function(){                                                       //functie care filtreaza tabelul
    $('#myTable tbody tr').hide();                                                 //mai intai ascundem toate liniile tabelului
    var cssSelector = '#myTable tbody tr';
    _.each(KEYS, function(filterItem){                                              //each care merge prin KEYS(vector de chei). are un parametru si atunci cand il apelez cu ce vreau eu, se comporta
        var selectedValue = $('.filter-' + filterItem).val();                       //pune in selectedValue valoarea cheii selectate
        if(selectedValue)
        {
        var filter = '[book-' + filterItem + '="' + selectedValue + '"]';           //imi pune in filter o chestie de genul aleia cu [], +o val+ cand vreau sa pun la un string (gen sa pun cheia la string, care cheie o iau eu din alta parte)
        cssSelector+=filter;                                                        //concateneaza cele 2 siruri
        }
    });
    $(cssSelector).show();                                                          //afiseaza pe pagina sirul
};

var onChangeDropDownValue = function (filterItem) {                                 //functie care listeaza optiunile in functie de optiunea apasata(titlu, autor etc)
    $('.filter-' + filterItem).change(function () {
        filterTable();                                                             //apeleaza filterTable

    });
};


$(document).ready(function () {


    populateList();  //apelez populateList care are in ea o multime de alte functii si balarii
    attachDeleteEventHandler();        //apelez functiile declarate pe undeva mai sus
    attachClickEventToRows();
    attachClickEventToSave();
    attachClickEventToCreate();

});

