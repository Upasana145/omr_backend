const HTML_TEMPLATE = ({ employee_details, selectedEventType, name }) => {
  return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Email From DCG Data-Core Systems India Pvt Ltd</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
              }
              .container {
                width: 80%;
                margin: 20px auto;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                
              }
              .email-body {
                padding: 20px;
              }
              .email-footer {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
                border-bottom-left-radius: 5px;
                border-bottom-right-radius: 5px;
              }
              h1, h4, p {
                margin: 0;
              }
              .greeting {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .incident-details {
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email">
                <div class="email-header">
                  <h1>Special Day</h1>
                </div>
                <div class="email-body">
                  <p class="greeting">Wishing you on your special day !!</p>
  
                  <div class="incident-details">
                  
                  
                    <p>Wishing you, ${name}, on your ${selectedEventType}, a day filled with laughter, love, and cherished memories!</p>
                  </div>
                </div>
                <div class="email-footer">
                  <p>Don't reply to this mail.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
};

module.exports = HTML_TEMPLATE;
