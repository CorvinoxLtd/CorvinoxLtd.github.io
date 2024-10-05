(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
      e.addEventListener('submit', function (event) {
          event.preventDefault();

          let thisForm = this;

          let action = thisForm.getAttribute('action');
          let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

          if (!action) {
              displayError(thisForm, 'The form action property is not set!');
              return;
          }
          thisForm.querySelector('.loading').style.display = 'block';
          thisForm.querySelector('.error-message').style.display = 'none';
          thisForm.querySelector('.sent-message').style.display = 'none';

          let formData = new FormData(thisForm);

          fetch(action, {
              method: 'POST',
              body: formData,
              headers: { 'Accept': 'application/json' }
          })
          .then(response => response.json())
          .then(data => {
              thisForm.querySelector('.loading').style.display = 'none';
              if (data.ok) {
                  let successMessage = 'Your message has been sent. Thank you!';
                  if (data.next && data.next.includes('/thanks')) {
                      successMessage = 'Your message has been sent successfully!';
                  }
                  thisForm.querySelector('.sent-message').innerHTML = successMessage;
                  thisForm.querySelector('.sent-message').style.display = 'block';
                  thisForm.reset();
              } else {
                  throw new Error(data.error);
              }
          })
          .catch(error => {
              displayError(thisForm, error.message);
          });
      });
  });

  function displayError(thisForm, error) {
      thisForm.querySelector('.loading').style.display = 'none';
      thisForm.querySelector('.error-message').innerHTML = error;
      thisForm.querySelector('.error-message').style.display = 'block';
  }

})();