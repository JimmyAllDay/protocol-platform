import { useEffect } from 'react';

const Recaptcha = ({ onVerify }) => {
  useEffect(() => {
    const loadReCaptcha = () => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.RECAPTCHA_SITE_KEY}`;
      script.addEventListener('load', () => {
        grecaptcha.ready(() => {
          grecaptcha
            .execute(process.env.RECAPTCHA_SITE_KEY, {
              action: 'submit',
            })
            .then(onVerify);
        });
      });
      document.body.appendChild(script);
    };

    if (!window.grecaptcha) {
      loadReCaptcha();
    } else {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.RECAPTCHA_SITE_KEY, {
            action: 'submit',
          })
          .then(onVerify);
      });
    }
  }, [onVerify]);

  return null;
};

export default Recaptcha;
