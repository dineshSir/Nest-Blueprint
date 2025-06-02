export const helloTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to {{{name}}} {{{age}}} huhu IT Services</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            animation: slideUp 0.8s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255, 255, 255, 0.1) 10px,
                rgba(255, 255, 255, 0.1) 20px
            );
            animation: float 20s linear infinite;
        }

        @keyframes float {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            color: white;
            position: relative;
            z-index: 2;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .company-name {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 2;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            position: relative;
            z-index: 2;
        }

        .content {
            padding: 40px 30px;
        }

        .welcome-title {
            font-size: 32px;
            font-weight: 700;
            color: #333;
            text-align: center;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .welcome-message {
            font-size: 18px;
            color: #555;
            text-align: center;
            margin-bottom: 30px;
            line-height: 1.7;
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }

        .feature-card {
            background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid rgba(102, 126, 234, 0.1);
        }

        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
        }

        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
        }

        .feature-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }

        .feature-desc {
            font-size: 14px;
            color: #666;
            line-height: 1.5;
        }

        .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            text-align: center;
            margin: 30px -30px 0;
            border-radius: 15px 15px 0 0;
        }

        .cta-text {
            color: white;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
        }

        .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .contact-info {
            background: #f8f9ff;
            padding: 25px;
            margin: 0 -30px;
            text-align: center;
        }

        .contact-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
        }

        .contact-details {
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }

        .contact-item {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #666;
            font-size: 14px;
        }

        .contact-icon {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
        }

        .footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            margin: 0 -30px;
        }

        @media (max-width: 480px) {
            .email-container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
            
            .contact-details {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">D</div>
            <h1 class="company-name">{{{name}}} IT Services</h1>
            <p class="tagline">Your Technology Partner for Success</p>
        </div>
        
        <div class="content">
            <h2 class="welcome-title">Welcome Aboard! 🎉</h2>
            <p class="welcome-message">
                We're thrilled to have you join the Dinesh IT Services family! Get ready to experience cutting-edge technology solutions, exceptional support, and innovative services that will transform your business.
            </p>
            
            <div class="features">
                <div class="feature-card">
                    <div class="feature-icon">💻</div>
                    <h3 class="feature-title">Expert Solutions</h3>
                    <p class="feature-desc">Comprehensive IT services tailored to your unique business needs</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3 class="feature-title">24/7 Support</h3>
                    <p class="feature-desc">Round-the-clock technical assistance whenever you need it</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3 class="feature-title">Secure & Reliable</h3>
                    <p class="feature-desc">Enterprise-grade security and reliability you can trust</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📈</div>
                    <h3 class="feature-title">Growth Focused</h3>
                    <p class="feature-desc">Scalable solutions that grow with your business</p>
                </div>
            </div>
        </div>
        
        <div class="cta-section">
            <p class="cta-text">Ready to get started?</p>
            <a href="#" class="cta-button">Contact Our Team</a>
        </div>
        
        <div class="contact-info">
            <h3 class="contact-title">Get in Touch</h3>
            <div class="contact-details">
                <div class="contact-item">
                    <div class="contact-icon">📧</div>
                    <span>info@dineshitservices.com</span>
                </div>
                <div class="contact-item">
                    <div class="contact-icon">📞</div>
                    <span>+1 (555) 123-4567</span>
                </div>
                <div class="contact-item">
                    <div class="contact-icon">🌐</div>
                    <span>www.dineshitservices.com</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; 2025 Dinesh IT Services. All rights reserved.</p>
            <p>Building Tomorrow's Technology Today</p>
        </div>
    </div>
</body>
</html>`;
