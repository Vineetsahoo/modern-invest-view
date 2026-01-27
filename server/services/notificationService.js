const nodemailer = require('nodemailer');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Send email notification
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('[EMAIL] SMTP not configured, skipping email to:', to);
      return { success: false, error: 'SMTP not configured' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `Portfolio Manager <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[EMAIL] Sent to:', to, 'MessageID:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EMAIL] Error sending to:', to, error.message);
    return { success: false, error: error.message };
  }
};

// Send price alert email
const sendPriceAlertEmail = async (userEmail, alert) => {
  const subject = `Price Alert: ${alert.symbol} ${alert.alertType}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Price Alert Triggered</h2>
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #1e293b;">${alert.symbol}</h3>
        <p style="margin: 5px 0; color: #475569;">
          <strong>Alert Type:</strong> ${alert.alertType}
        </p>
        <p style="margin: 5px 0; color: #475569;">
          <strong>Target Price:</strong> ₹${alert.targetPrice.toFixed(2)}
        </p>
        <p style="margin: 5px 0; color: #475569;">
          <strong>Triggered At:</strong> ₹${alert.triggeredPrice.toFixed(2)}
        </p>
        <p style="margin: 5px 0; color: #475569;">
          <strong>Time:</strong> ${new Date(alert.triggeredAt).toLocaleString()}
        </p>
        ${alert.message ? `<p style="margin: 15px 0 5px 0; color: #64748b; font-style: italic;">${alert.message}</p>` : ''}
      </div>
      <p style="color: #64748b; font-size: 12px;">
        This is an automated notification from your Portfolio Manager.
      </p>
    </div>
  `;
  
  const text = `
Price Alert Triggered

Symbol: ${alert.symbol}
Alert Type: ${alert.alertType}
Target Price: ₹${alert.targetPrice.toFixed(2)}
Triggered At: ₹${alert.triggeredPrice.toFixed(2)}
Time: ${new Date(alert.triggeredAt).toLocaleString()}
${alert.message ? `\nMessage: ${alert.message}` : ''}

---
This is an automated notification from your Portfolio Manager.
  `;
  
  return sendEmail({ to: userEmail, subject, html, text });
};

// Send portfolio snapshot summary email
const sendPortfolioSummaryEmail = async (userEmail, portfolioName, snapshot) => {
  const subject = `Portfolio Summary: ${portfolioName}`;
  
  const changePercent = snapshot.totalReturnPercent || 0;
  const changeColor = changePercent >= 0 ? '#10b981' : '#ef4444';
  const changeSymbol = changePercent >= 0 ? '▲' : '▼';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Daily Portfolio Summary</h2>
      <h3 style="color: #475569; font-weight: normal;">${portfolioName}</h3>
      
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <div style="margin-bottom: 15px;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">Total Value</p>
          <h2 style="margin: 5px 0; color: #1e293b;">₹${snapshot.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h2>
          <p style="margin: 0; color: ${changeColor}; font-weight: bold;">
            ${changeSymbol} ${Math.abs(changePercent).toFixed(2)}%
          </p>
        </div>
        
        <div style="border-top: 1px solid #cbd5e1; padding-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <p style="margin: 0; color: #64748b; font-size: 12px;">Invested</p>
            <p style="margin: 5px 0; color: #1e293b; font-weight: bold;">₹${snapshot.invested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
          <div>
            <p style="margin: 0; color: #64748b; font-size: 12px;">Unrealized P/L</p>
            <p style="margin: 5px 0; color: ${snapshot.unrealizedPnl >= 0 ? '#10b981' : '#ef4444'}; font-weight: bold;">
              ₹${snapshot.unrealizedPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p style="margin: 0; color: #64748b; font-size: 12px;">Realized P/L</p>
            <p style="margin: 5px 0; color: ${snapshot.realizedPnl >= 0 ? '#10b981' : '#ef4444'}; font-weight: bold;">
              ₹${snapshot.realizedPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p style="margin: 0; color: #64748b; font-size: 12px;">Income</p>
            <p style="margin: 5px 0; color: #1e293b; font-weight: bold;">₹${snapshot.income.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
      
      <p style="color: #64748b; font-size: 12px;">
        Date: ${new Date(snapshot.snapshotDate).toLocaleDateString()}<br>
        This is an automated daily summary from your Portfolio Manager.
      </p>
    </div>
  `;
  
  const text = `
Daily Portfolio Summary: ${portfolioName}

Total Value: ₹${snapshot.totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Change: ${changeSymbol} ${Math.abs(changePercent).toFixed(2)}%

Invested: ₹${snapshot.invested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Unrealized P/L: ₹${snapshot.unrealizedPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Realized P/L: ₹${snapshot.realizedPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Income: ₹${snapshot.income.toLocaleString('en-IN', { maximumFractionDigits: 2 })}

Date: ${new Date(snapshot.snapshotDate).toLocaleDateString()}
---
This is an automated daily summary from your Portfolio Manager.
  `;
  
  return sendEmail({ to: userEmail, subject, html, text });
};

module.exports = {
  sendEmail,
  sendPriceAlertEmail,
  sendPortfolioSummaryEmail
};
