document.addEventListener("DOMContentLoaded", function() {
$('#submit').click(function() {
            alert('clicked'); 
            $.ajax({
                url: "/user",
                type: "POST",
                dataType: "json",
                data: {
                    id: $('#guid').val(),
                    title: $('#page_title').val(),
                    content: $('#page-content').val()
                },
                contentType: "application/json",
                cache: false,
                timeout: 5000,
                complete: function() {
                  //called when complete
                  console.log('process complete');
                },

                success: function(data) {
                  console.log(data);
                  console.log('process sucess');
               },

                error: function() {
                  console.log('process error');
                },
              });
        });
}); 