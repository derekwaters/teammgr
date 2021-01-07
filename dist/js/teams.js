// Teams Page related Javascript code

function initPage ()
{
    var theBtn = $('#addTeamDlgaddTeamBtn');
    theBtn.on('click', function(event) {
        var form = $('#addTeamForm')[0];
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            var url = '/teams';
            var params = $(form).serialize();

            $.ajax({
                type: "POST",
                url: url,
                data: params,
                success: function(data, status, xhr) {
                    console.log(data);
                    if (data.success) {
                        var modal = document.getElementById('addTeamDlg');
                        var bsModal = bootstrap.Modal.getInstance(modal);
                        bsModal.hide();
                    } else {
                        alert(data.error);
                    }
                },
                dataType: 'json'
              });
        }
        form.classList.add('was-validated');
    });
};

function addTeamResponse (data, status, xhr) {
    alert('All done');
    console.log(data);
}