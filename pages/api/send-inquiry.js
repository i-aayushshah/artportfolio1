import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, message, artworkId, artworkTitle, price } = req.body;

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "aayushshah983@gmail.com",
        pass: 'ywdesayrmevuyjvo',
      },
    });

    // Define the HTML content with inline styles
    const htmlContent = `
      <div style="font-family: Georgia, serif; line-height: 1.6; margin: 0; padding: 0; color: #ffffff; background: linear-gradient(to bottom right, #111827, #4c1d95, #1e40af);">
        <div style="max-width: 600px; margin: 20px auto; border-radius: 15px; overflow: hidden; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);">
          <div style="padding: 20px; background: rgba(255, 255, 255, 0.2); text-align: center;">
            <h1 style="font-size: 36px; margin: 0; color: #f3e8ff; text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4); font-weight: 700;">Subekshya's Artistry</h1>
          </div>
          <div style="padding: 30px; background-color: #ffffff; color: #333333; border-top: 1px solid #e0e0e0;">
            <h2 style="font-size: 32px; margin-bottom: 20px; border-bottom: 3px solid #4c1d95; padding-bottom: 10px; color: #4c1d95;">New Artwork Inquiry</h2>
            <p>Dear Subekshya,</p>
            <p>You have received a new inquiry for your artwork <strong style="color: #4c1d95;">"${artworkTitle}"</strong>. Here are the details:</p>
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-top: 20px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Message:</strong></p>
              <p style="background-color: #ffffff; border-left: 5px solid #4c1d95; padding: 15px; border-radius: 4px; color: #333333;">${message}</p>
            </div>
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-top: 20px; box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);">
              <h3 style="font-size: 24px; color: #4c1d95;">Artwork Details:</h3>
              <p><strong>Title:</strong> ${artworkTitle}</p>
              <p><strong>ID:</strong> ${artworkId}</p>
              <p><strong>Price:</strong> ${price}</p>
            </div>
            <div style="margin-top: 30px; border-top: 2px solid #e0e0e0; padding-top: 20px; font-style: italic; color: #333333;">
              <p>Best regards,<br><strong>Subekshya</strong></p>
            </div>
          </div>
          <div style="text-align: center; background-color: #1e40af; padding: 20px; border-radius: 0 0 15px 15px;">
            <p style="margin: 0; font-size: 18px; color: #ffffff;">Connect with Subekshya:</p>
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
    `;

    try {
      // Send email
      await transporter.sendMail({
        from: 'aayushshah983@gmail.com',
        to: email, // The gallery's email address
        subject: `New Inquiry for "${artworkTitle}"`,
        text: `
          Name: ${name}
          Email: ${email}
          Phone: ${phone}
          Message: ${message}

          Artwork Details:
          Title: ${artworkTitle}
          ID: ${artworkId}
          Price: ${price}
        `,
        html: htmlContent,
      });

      res.status(200).json({ message: 'Inquiry sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ message: 'Error sending inquiry' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
