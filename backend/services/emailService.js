const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email credentials not found. Skipping email send.');
      return;
    }
    const mailOptions = {
      from: `"VistaVoyage Concierge" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html // Use the full premium HTML provided by the caller
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email Send Error:', err);
  }
};

exports.sendBookingConfirmation = async (booking) => {
  const quotes = [
    "Jobs fill your pocket, but adventures fill your soul.",
    "The world is a book and those who do not travel read only one page.",
    "Travel is the only thing you buy that makes you richer.",
    "To travel is to live."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,600&family=Inter:wght@400;600;800&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050F1E; font-family: 'Inter', sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050F1E; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.5);">
              
              <!-- Premium Header Image Space -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #0A1628 0%, #1A2E44 100%); padding: 60px 40px;">
                  <div style="color: #C9A84C; font-size: 14px; font-weight: 800; letter-spacing: 5px; text-transform: uppercase; margin-bottom: 20px;">VistaVoyage</div>
                  <h1 style="color: #ffffff; font-family: 'Cormorant Garamond', serif; font-size: 42px; margin: 0; font-weight: 700; line-height: 1.1;">Your Grand Escape <br/>is Confirmed! 🥂</h1>
                </td>
              </tr>
              
              <!-- Content Body -->
              <tr>
                <td style="padding: 50px 50px 40px 50px;">
                  <p style="color: #64748B; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Hello Adventurer,</p>
                  <h2 style="color: #0A1628; font-size: 28px; margin: 0 0 24px 0; font-family: 'Cormorant Garamond', serif;">Congratulations, ${booking.name}!</h2>
                  
                  <p style="color: #475569; font-size: 16px; line-height: 1.8; margin-bottom: 40px;">
                    We are honored to be the architects of your next journey. Your reservation for the magnificent <strong>${booking.package.title}</strong> has been secured. Get ready to create memories that will last a lifetime. ✨
                  </p>
                  
                  <!-- Booking Card -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #F8FAFC; border-radius: 30px; border: 1px solid #E2E8F0; margin-bottom: 40px;">
                    <tr>
                      <td style="padding: 35px;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td colspan="2" style="padding-bottom: 25px; border-bottom: 1px solid #E2E8F0;">
                              <div style="color: #94A3B8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Official Booking Reference</div>
                              <div style="color: #0A1628; font-size: 20px; font-weight: 800;">#${booking.bookingId} 🎫</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 25px 10px 0 0;">
                              <div style="color: #94A3B8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Date of Departure 🗓️</div>
                              <div style="color: #0A1628; font-size: 15px; font-weight: 700;">${new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            </td>
                            <td style="padding: 25px 0 0 10px;">
                              <div style="color: #94A3B8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Investment 💳</div>
                              <div style="color: #C9A84C; font-size: 18px; font-weight: 800;">₹${booking.totalAmount.toLocaleString()}</div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Inspirational Quote -->
                  <div style="border-left: 3px solid #C9A84C; padding: 10px 25px; margin-bottom: 40px; font-style: italic; color: #475569; font-family: 'Cormorant Garamond', serif; font-size: 20px;">
                    "${randomQuote}" 🌍
                  </div>

                  <!-- Closing Section -->
                  <div style="text-align: center; padding-top: 20px;">
                    <div style="color: #0A1628; font-size: 22px; font-family: 'Cormorant Garamond', serif; font-weight: 700; margin-bottom: 10px;">See You There! 👋</div>
                    <p style="color: #64748B; font-size: 14px; margin-bottom: 30px;">Our team is already preparing for your arrival.</p>
                    <a href="http://localhost:3001/profile" style="display: inline-block; background: #0A1628; color: #ffffff; padding: 20px 45px; border-radius: 100px; font-weight: 800; font-size: 15px; text-decoration: none; letter-spacing: 1px; box-shadow: 0 15px 30px rgba(10, 22, 40, 0.2);">Manage My Journey ✈️</a>
                  </div>

                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #F1F5F9; padding: 50px 40px; text-align: center; border-top: 1px solid #E2E8F0;">
                  <p style="color: #64748B; font-size: 13px; line-height: 1.6; margin: 0;">
                    Have questions? Our Concierge Team is available 24/7.<br/>
                    Contact us at <a href="mailto:support@vistavoyage.com" style="color: #C9A84C; text-decoration: none; font-weight: 700;">concierge@vistavoyage.com</a>
                  </p>
                  <div style="margin-top: 30px; opacity: 0.5;">
                    <img src="https://img.icons8.com/ios-filled/24/0A1628/instagram-new.png" style="margin: 0 10px;"/>
                    <img src="https://img.icons8.com/ios-filled/24/0A1628/facebook-new.png" style="margin: 0 10px;"/>
                    <img src="https://img.icons8.com/ios-filled/24/0A1628/twitter.png" style="margin: 0 10px;"/>
                  </div>
                  <p style="color: #94A3B8; font-size: 11px; margin-top: 30px; text-transform: uppercase; letter-spacing: 2px;">© 2024 VistaVoyage • Luxury Reimagined</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  await sendEmail(booking.email, `Confirmed: Your Journey to ${booking.package.title} ✈️`, html);
};

exports.sendTripReminder = async (booking) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Inter:wght@400;700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f9;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(10, 22, 40, 0.08);">
              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #0A1628; padding: 40px 0;">
                  <h1 style="color: #C9A84C; font-family: 'Cormorant Garamond', serif; font-size: 32px; margin: 0; letter-spacing: 2px; text-transform: uppercase;">VistaVoyage</h1>
                  <p style="color: rgba(255,255,255,0.7); font-size: 12px; letter-spacing: 3px; margin: 10px 0 0 0; text-transform: uppercase; font-weight: 700;">Journey Beyond The Horizon</p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 48px 40px;">
                  <h2 style="color: #0A1628; font-size: 24px; margin: 0 0 16px 0;">Time to Pack! 🎒</h2>
                  <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">Hi <strong>${booking.name}</strong>,</p>
                  <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">Your incredible journey to <strong>${booking.package.title}</strong> is just 2 days away! We want to make sure you're fully prepared for the magic ahead.</p>
                  
                  <!-- Checklist Card -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 20px; border: 1px solid #e2e8f0;">
                    <tr>
                      <td style="padding: 32px;">
                        <h4 style="color: #0A1628; margin: 0 0 16px 0;">Quick Checklist:</h4>
                        <ul style="color: #4A5568; font-size: 15px; padding-left: 20px; margin: 0;">
                          <li style="margin-bottom: 12px;">Download your e-tickets from your profile.</li>
                          <li style="margin-bottom: 12px;">Check the 5-day weather forecast for ${booking.package.location}.</li>
                          <li style="margin-bottom: 12px;">Ensure you have valid ID proofs and travel documents.</li>
                          <li>Charge your camera—you won't want to miss a single moment!</li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Button -->
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 40px;">
                    <tr>
                      <td align="center">
                        <a href="http://localhost:3001/profile" style="display: inline-block; border: 2px solid #C9A84C; color: #0A1628; padding: 16px 32px; border-radius: 12px; font-weight: 800; font-size: 16px; text-decoration: none;">Manage My Booking</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 40px; border-top: 1px solid #e2e8f0; text-align: center;">
                  <p style="color: #718096; font-size: 14px; line-height: 1.5; margin: 0;">Safe travels from the entire VistaVoyage team!</p>
                  <p style="color: #A0AEC0; font-size: 12px; margin-top: 24px;">© 2024 VistaVoyage Travel Agency. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  await sendEmail(booking.email, `Your trip to ${booking.package.title} is almost here!`, html);
};

exports.sendReviewRequest = async (booking) => {
  const html = `
    <h2>Welcome Back! 🏠</h2>
    <p>Hi ${booking.name},</p>
    <p>We hope you had a magical time in ${booking.package.location}. We'd love to hear about your experience!</p>
    <p>Your feedback helps us make VistaVoyage even better.</p>
    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-bookings" style="background: #c9a84c; color: #0a1628; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-top: 20px;">Rate Your Trip</a>
  `;
  await sendEmail(booking.email, 'How was your trip?', html);
};

exports.sendAIPlanEmail = async (to, name, planTitle, message) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Inter:wght@400;700&display=swap');
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Inter', sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f9; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              <tr>
                <td align="center" style="background-color: #0A1628; padding: 40px 0;">
                  <h1 style="color: #C9A84C; font-family: 'Cormorant Garamond', serif; font-size: 32px; margin: 0; letter-spacing: 2px; text-transform: uppercase;">VistaVoyage</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 48px 40px;">
                  <h2 style="color: #0A1628; font-size: 24px; margin: 0 0 16px 0; font-family: 'Cormorant Garamond', serif;">Message from your Travel Architect</h2>
                  <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hi ${name},</p>
                  <p style="color: #4A5568; font-size: 16px; line-height: 1.8; margin-bottom: 32px; white-space: pre-line;">
                    ${message}
                  </p>
                  <div style="background-color: #f9fafb; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
                    <p style="margin: 0; color: #718096; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Regarding your plan:</p>
                    <p style="margin: 8px 0 0 0; color: #0A1628; font-size: 18px; font-weight: 700;">${planTitle}</p>
                  </div>
                  <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/ai-planner" style="display: inline-block; background: #0A1628; color: #ffffff; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; text-decoration: none;">View AI Planner</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f9fafb; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #A0AEC0; font-size: 12px; margin: 0;">© 2024 VistaVoyage • Luxury Reimagined</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  await sendEmail(to, `Travel Update: ${planTitle} 🌍`, html);
};
