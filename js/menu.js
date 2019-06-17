var $ = require('jquery');
var emailValidator = require('email-validator');

module.exports = function(){
    
    var $form = $('form');
    var $radio = $form.find('input[type=radio]');
    var $email = $form.find('input[type=email]');
    var $submit = $form.find('button');
    
    function validate(){
        
        var food = $radio.filter(':checked').val();
        var email = $email.val();
        
        var valid = !!( food && email && emailValidator.validate( email ) );
        
        $submit.attr( 'disabled', !valid );
        
    }
    
    $radio.change( validate );
    $email.on('change input keydown blur', validate );
    
    $form.submit( function(e){
        
        e.preventDefault();
        
        document.body.classList.add('wait');
        
        $.post({
            url: 'http://cms.podgeevents.com/api2/order/key/qu4dz669p1bls3t5zec4alps3yevuwoazo04jvq',
            crossDomain: true,
            data: $form.serialize(),
            success: function( data, status, xhr ){
                document.body.classList.remove('wait');
                $form.addClass(data);
            }
        })
        .fail(function(xhr, status){
            $form.addClass('fail');
            $('.message_fail p').text(status);
        })
        
    })
    
}