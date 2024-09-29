import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

// Create hCaptcha context
const HCaptchaContext = createContext();

// Create a provider component
export const HCaptchaProvider = ({ children }) => {
  const captchaRef = useRef(null); // This will be used to trigger the hCaptcha
  const [captchaToken, setCaptchaToken] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // Store pending form submission

  const onVerifyCaptcha = useCallback(
    (token) => {
      setCaptchaToken(token); // Store the verified token

      if (pendingAction) {
        // Call the pending action (form submit) after captcha is verified
        pendingAction();
        setPendingAction(null); // Clear pending action after execution
      }
    },
    [pendingAction]
  );

  const executeCaptcha = useCallback(() => {
    if (captchaRef.current) {
      captchaRef.current.execute(); // Manually trigger captcha
    }
  }, []);

  const resetCaptcha = useCallback(() => {
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha(); // Manually reset captcha
    }
  }, []);

  // Higher-order function to handle captcha validation
  const withCaptcha = useCallback(
    (submitHandler) => {
      return (formData) => {
        if (!captchaToken) {
          // If captcha is not verified, trigger it and store the pending form action
          setPendingAction(() => () => submitHandler(formData)); // Store the form action to be executed after captcha
          executeCaptcha(); // Trigger the captcha
        } else {
          // If captcha is already verified, proceed with form submission
          submitHandler(formData);
        }
      };
    },
    [captchaToken, executeCaptcha]
  );

  return (
    <HCaptchaContext.Provider
      value={{ captchaToken, executeCaptcha, resetCaptcha, withCaptcha }}
    >
      <HCaptcha
        ref={captchaRef} // Attach the ref to the hCaptcha component
        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY} // hCaptcha site key
        size="invisible" // Invisible captcha for better UX
        onVerify={onVerifyCaptcha} // Callback for when captcha is verified
      />
      {children}
    </HCaptchaContext.Provider>
  );
};

// Custom hook to use hCaptcha
export const useHCaptcha = () => {
  return useContext(HCaptchaContext);
};
