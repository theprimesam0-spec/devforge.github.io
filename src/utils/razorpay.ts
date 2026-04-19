const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';
const ADMIN_WHATSAPP = '917549159228';
const ADMIN_WHATSAPP_GROUP = 'https://chat.whatsapp.com/HAVBSiN3nd8Lm3oQJrTFbd';

interface PaymentOptions {
  amount: number; // in paise (1 INR = 100 paise)
  currency?: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (response: Record<string, unknown>) => void;
  onFailure?: (response: Record<string, unknown>) => void;
}

export function sendPaymentNotification(amount: number, serviceName: string, paymentId: string): void {
  const timestamp = new Date().toLocaleString();
  const verificationCode = '✅💰'; // Special sign to indicate real payment
  
  const message = `${verificationCode} *PAYMENT DONE* ${verificationCode}\n\n` +
    `💵 Amount: ₹${amount}\n` +
    `📦 Service: ${serviceName}\n` +
    `🆔 Payment ID: ${paymentId}\n` +
    `🕐 Time: ${timestamp}\n\n` +
    `${verificationCode} Verified Payment ${verificationCode}`;
  
  const encodedMessage = encodeURIComponent(message);
  
  // Send to admin's WhatsApp number
  window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`, '_blank');
  
  // Also open the group link (user will need to paste message manually)
  setTimeout(() => {
    window.open(ADMIN_WHATSAPP_GROUP, '_blank');
  }, 1000);
}

export function initiatePayment(options: PaymentOptions): void {
  const {
    amount,
    currency = 'INR',
    name,
    description,
    prefill = {},
    onSuccess,
    onFailure,
  } = options;

  if (!RAZORPAY_KEY_ID) {
    console.error('Razorpay Key ID not configured');
    alert('Payment system is not configured. Please contact support.');
    return;
  }

  // Check if Razorpay script is already loaded
  const RazorpayAvailable = (window as unknown as Record<string, unknown>)['Razorpay'];
  if (RazorpayAvailable) {
    openRazorpayModal();
  } else {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      openRazorpayModal();
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      alert('Failed to load payment system. Please try again.');
    };

    document.body.appendChild(script);
  }

  function openRazorpayModal() {
    const razorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // Convert to paise
      currency,
      name: 'DevForge',
      description: `${name} - ${description}`,
      handler: function (response: Record<string, unknown>) {
        console.log('Payment successful:', response);
        if (onSuccess) {
          onSuccess(response);
        }
      },
      prefill: {
        name: prefill.name || '',
        email: prefill.email || '',
        contact: prefill.contact || '',
      },
      theme: {
        color: '#39FF14',
      },
      modal: {
        ondismiss: function () {
          console.log('Payment modal dismissed');
          // Ensure modal is properly closed
          setTimeout(() => {
            if (onFailure) {
              onFailure({ reason: 'Payment cancelled by user' });
            }
          }, 100);
        },
        escape: true,
      },
    };

    try {
      const RazorpayCtor = (window as unknown as Record<string, unknown>)['Razorpay'];
      if (typeof RazorpayCtor === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (RazorpayCtor as any)(razorpayOptions);

        rzp.on('payment.failed', function (response: Record<string, unknown>) {
          const err = (response && (response as Record<string, unknown>)['error']) ?? response;
          console.error('Payment failed:', err);
          if (onFailure) {
            onFailure(err as Record<string, unknown>);
          }
        });

        rzp.open();
      } else {
        throw new Error('Razorpay constructor not available');
      }
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      alert('Failed to open payment modal. Please try again.');
      if (onFailure) {
        onFailure({ reason: 'Failed to open payment modal' } as Record<string, unknown>);
      }
    }
  }
}
