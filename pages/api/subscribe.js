// File: pages/api/subscribe.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'aayushshah983@gmail.com',
          pass: 'ywdesayrmevuyjvo',
        },
      });

      // Define the HTML content for the subscription email
      const htmlContent = `
        <div style="font-family: Georgia, serif; line-height: 1.6; margin: 0; padding: 0; color: #ffffff; background: linear-gradient(to bottom right, #111827, #4c1d95, #1e40af);">
          <div style="max-width: 600px; margin: 20px auto; border-radius: 15px; overflow: hidden; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);">
            <div style="padding: 20px; background: rgba(255, 255, 255, 0.2); text-align: center;">
              <h1 style="font-size: 36px; margin: 0; color: #f3e8ff; text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4); font-weight: 700;">Subekshya's Artistry</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #333333; border-top: 1px solid #e0e0e0;">
              <h2 style="font-size: 32px; margin-bottom: 20px; border-bottom: 3px solid #4c1d95; padding-bottom: 10px; color: #4c1d95;">Welcome to Our Newsletter</h2>
              <p>Dear <span style="color: #4c1d95; font-weight: bold;">Subscriber,</span></p>
              <p>Thank you for subscribing to Subekshya's Artistry newsletter! We're excited to share our latest artworks, events, and updates with you.</p>
              <p>Stay tuned for our upcoming editions, and feel free to reach out if you have any questions or suggestions.</p>
              <p>Best regards,<br><strong>Subekshya</strong></p>
              <div style="margin-top: 30px; border-top: 2px solid #e0e0e0; padding-top: 20px; font-style: italic; color: #333333;">
                <p>Connect with Subekshya:</p>
                <div style="margin-top: 10px;">
                  <a href="https://www.facebook.com/i.aayushhh" target="_blank" style="display: inline-block; margin: 0 10px;">
                    <img src="https://img.icons8.com/fluent/48/000000/facebook-new.png" alt="Facebook" style="width: 30px; height: 30px; opacity: 0.8; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='1';" onmouseout="this.style.opacity='0.8';">
                  </a>
                  <a href="https://wa.me/9779816835214?text=Hello%2C%20I%20would%20like%20to%20contact%20you" target="_blank" style="display: inline-block; margin: 0 10px;">
                    <img src="https://img.icons8.com/color/48/000000/whatsapp.png" alt="WhatsApp" style="width: 30px; height: 30px; opacity: 0.8; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='1';" onmouseout="this.style.opacity='0.8';">
                  </a>
                  <a href="https://www.instagram.com/i.aayushhh_/" target="_blank" style="display: inline-block; margin: 0 10px;">
                    <img src="https://img.icons8.com/fluent/48/000000/instagram-new.png" alt="Instagram" style="width: 30px; height: 30px; opacity: 0.8; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='1';" onmouseout="this.style.opacity='0.8';">
                  </a>
                  <a href="https://www.linkedin.com/in/aayushshah07/" target="_blank" style="display: inline-block; margin: 0 10px;">
                    <img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="LinkedIn" style="width: 30px; height: 30px; opacity: 0.8; transition: opacity 0.3s ease;" onmouseover="this.style.opacity='1';" onmouseout="this.style.opacity='0.8';">
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Send confirmation email to the subscriber
      await transporter.sendMail({
        from: 'aayushshah983@gmail.com',
        to: email,
        subject: 'Welcome to Subekshya\'s Artistry Newsletter',
        text: 'Thank you for subscribing to our newsletter! We\'re excited to share our latest artworks and events with you.',
        html: htmlContent,
      });

      res.status(200).json({ message: 'Subscription successful' });
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ error: 'An error occurred while subscribing' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
