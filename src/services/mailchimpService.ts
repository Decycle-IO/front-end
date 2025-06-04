/**
 * Submit email to Mailchimp list
 * @param email - The email address to subscribe
 * @returns Promise that resolves to success/error status
 */
export const submitToMailchimp = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Basic validation
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    const MAILCHIMP_URL = 'https://us5.list-manage.com/subscribe/post?u=69ace2a40b7fbc068042b4b8f&id=4d1cccb835';
    
    return new Promise((resolve) => {
      const script = document.createElement('script');
      const callbackName = `mailchimpCallback_${Date.now()}`;
      
      // Define response type
      interface MailchimpResponse {
        result: string;
        msg?: string;
      }
      
      // Set a timeout in case Mailchimp doesn't respond
      const timeoutId = setTimeout(() => {
        // Clean up
        if ((window as unknown as Record<string, unknown>)[callbackName]) {
          delete (window as unknown as Record<string, unknown>)[callbackName];
          if (document.body.contains(script)) {
            document.body.removeChild(script);
          }
          resolve({ 
            success: false, 
            message: 'Request timed out. Please try again later.' 
          });
        }
      }, 10000); // 10 second timeout
      
      // Create a global callback function
      (window as unknown as Record<string, unknown>)[callbackName] = (response: MailchimpResponse) => {
        // Clear the timeout since we got a response
        clearTimeout(timeoutId);
        
        // Clean up
        delete (window as unknown as Record<string, unknown>)[callbackName];
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        
        // Handle the response
        if (response.result === 'success') {
          resolve({ success: true, message: 'Thank you for subscribing!' });
        } else {
          // Extract error message from response
          const message = response.msg || 'An error occurred. Please try again.';
          resolve({ success: false, message });
        }
      };
      
      // Add error handler for the script
      script.onerror = () => {
        clearTimeout(timeoutId);
        delete (window as unknown as Record<string, unknown>)[callbackName];
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        resolve({ 
          success: false, 
          message: 'Failed to connect to the subscription service. Please try again later.' 
        });
      };
      
      // Build the URL with callback and email
      // Remove the c=? from the base URL to avoid duplicate parameters
      const baseUrl = MAILCHIMP_URL.replace('&c=?', '');
      const url = `${baseUrl}&EMAIL=${encodeURIComponent(email)}&c=${callbackName}`;
      
      // Create and append the script
      script.src = url;
      document.body.appendChild(script);
    });
  } catch (error) {
    console.error('Error submitting to Mailchimp:', error);
    return { success: false, message: 'An error occurred. Please try again later.' };
  }
};
