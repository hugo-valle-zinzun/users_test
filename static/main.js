$(document).ready(function() {
    main.init();
});

var main = {

    init: function() {
        $('#addForm').submit(function(event) {
            event.preventDefault();
            main.save();
        });

        $('#updateForm').submit(function(event) {
            event.preventDefault();
            main.update();
        });
        if ($('#user_table').length) {
            getPagination('#user_table');
            $('#maxRows').val('10').change()
        }
        if ($('#roles_count').length) {
            main.getRolesCount()
        }

        $.each($('.btn-delete'), function(index, btn) {
            $(btn).on('click', function() {
                main.delete($(this).data('id'), $(this).data('nick'))

            })
        });
    },
    save: function() {
        let nick = $('#nick').val();
        let nombre = $('#nombre').val();
        let apellidos = $('#apellidos').val();
        let password = $('#password').val();
        let rol = $('#rol').val();
        let email = $('#email').val();

        $.ajax({
            url: '/api/user',
            type: 'POST',
            dataType: "json",
            data: { "nick": nick, "nombre": nombre, "nombre": nombre, "apellidos": apellidos, "password": password, "rol": rol, "email": email },
            success: function(result) {
                console.log(result)
                if (result.status) {
                    main.showFlash('success', 'Se creo el usuario con ID: <strong>' + result.user._id + '</strong>');
                    $('#addForm').trigger("reset");
                } else {
                    main.showFlash('error', result.message);
                }

            },
            error: function(result) {
                console.log(result.responseJSON)
                main.showFlash('error', result.responseJSON.message);
            }
        });
    },
    update: function() {
        let userId = $('#userId').val();
        let nick = $('#nick').val();
        let nombre = $('#nombre').val();
        let apellidos = $('#apellidos').val();
        let password = $('#password').val();
        let rol = $('#rol').val();
        let email = $('#email').val();

        $.ajax({
            url: '/api/user/' + userId,
            type: 'PUT',
            dataType: "json",
            data: { "nick": nick, "nombre": nombre, "nombre": nombre, "apellidos": apellidos, "password": password, "rol": rol, "email": email },
            success: function(result) {
                console.log(result)
                main.showFlash('success', 'Se actualizo al usuario con ID: <strong>' + result.userId + '</strong>');
            },
            error: function(result) {
                console.log(result.responseJSON)
                main.showFlash('error', result.responseJSON.message);
            }
        });
    },
    delete: function(userId, nick) {
        if (confirm('Realmente desea eliminar el registro del usuario ' + nick + ' ?')) {
            $.ajax({
                url: '/api/user/' + userId,
                type: 'DELETE',
                dataType: "json",
                success: function(result) {
                    console.log(result)
                    main.showFlash('success', 'Se ha removido al usuario <strong>' + nick + '</strong> correctamente.');
                    $('#tr_' + userId).remove();
                    getPagination('#user_table');
                    $('#maxRows').val('10').change()
                    main.getRolesCount()
                },
                error: function(result) {
                    console.log(result.responseJSON)
                    main.showFlash('error', result.responseJSON.message);
                }
            });

        }

    },
    showFlash: function(type, msg) {
        $('#flash').remove();
        let htmlMsg = '';
        if (type == 'error') {
            htmlMsg += '<ul>';
            $.each(msg, function(index, error) {
                htmlMsg += '<li>' + error + '</li>';
            });
            htmlMsg += '</ul>';

        } else {
            htmlMsg = msg
        }

        jQuery('body').prepend('<div id="flash" role="alert"></div>');
        jQuery('#flash').html(htmlMsg);
        jQuery('#flash').toggleClass('alert alert-' + (type == 'success' ? 'success' : (type == 'error' ? 'danger' : 'info')));
        jQuery('#flash').slideDown('slow');
        jQuery('#flash').click(function() { $('#flash').toggle('highlight') });
    },
    getRolesCount: function() {
        $.ajax({
            url: '/api/rolescount',
            type: 'GET',
            dataType: "json",
            success: function(result) {
                console.log(result)
                $('#div_count_Admin').text(result.usersCount.Admin)
                $('#div_count_Operador').text(result.usersCount.Operador)
                $('#div_count_Administrativo').text(result.usersCount.Administrativo)


            },
            error: function(result) {
                console.log(result.responseJSON)
                    //main.showFlash('error', result.responseJSON.message);
            }
        });
    },
}