export const generateHtmlContent = (
  order,
  bookingInfo,
  address,
  invoiceNumber,
  invoiceInfo,
  billingDetails,
  termsConditions,
  serviceOrders,
  userDataFromContext,
) => {
  return `
   <html>
  <head>
    <style>
      body {
        font-family: "Montserrat", sans-serif;
      }
      .header {
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        margin-top: 20px;
      }
      .section {
        margin: 20px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .col {
        flex: 1;
      }
      .row-box-invoice{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
      }
      .table th,
      .table td {
        border: 1px solid black;
        padding: 8px;
        text-align: center;
      }
      .table th {
        background-color: #cacaca;
      }
      .row-total{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
      }
      .col-total{
        text-align: end;
      }
      .total {
        margin-top: 20px;
        /* text-align: right;
        
        /* font-weight: bold; */
        /* border: 1px solid black; */
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="section">
      <div class="row">
        <div class="col">
          <div style="font-size: 15px; font-weight: bold">
            KADAGAM VENTURES PRIVATE LIMITED
          </div>
          <div>
            <div style="font-size: 15px">
              #34 & 35 Venkatappa Road, </div>
              <div style="font-size: 15px">Tasker Town, Off Queens Road,</div> 
              <div style="font-size: 15px"> Bengaluru, Karnataka, India, 560051 </div> 
              <div style="font-size: 15px">www.nithyaevent.com</div>
          </div> 
            <div style="font-size: 15px; font-weight: bold;margin-top: 20px;">
            To
            </div>
            <div>
            <div style="font-size: 15px">
             ${bookingInfo.event_location} </div>
              
          </div>
        <div style="font-size: 15px;margin-top: 20px">
          GST:  ${
            userDataFromContext?.company_profile?.length > 0
              ? userDataFromContext.company_profile[0].gst_number
              : 'N/A'
          }
        </div>
        <div style="font-size: 15px;margin-top: 20px">
          Kind Attn: ${bookingInfo.receiver_name}
        </div>
        <div style="font-size: 15px">
         Mobile: +91 ${bookingInfo.receiver_mobilenumber}
        </div>
        </div>
        <div class="col">
          <div style="font-size: 15px; font-weight: bold">
          TEC GSTIN: 29AADPI4078B1ZW
          </div>
          <div style="font-size: 15px; font-weight: bold">
            SAC CODE: 998387
            </div>
            <div style="font-size: 15px; font-weight: bold">
              EVENT NAME: ${bookingInfo.event_name?.toUpperCase()}
              </div>
              <div style="border:1px solid black;margin-top: 10px;">
              ${invoiceInfo.map(ele => (
                <div
                  key={ele.id}
                  class="row-box-invoice"
                  style="border-bottom: 1px solid black;">
                  <div class="col">{ele.head}</div>
                  <div class="col">{ele.value}</div>
                </div>
              ))}
               </div>
        </div>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>items</th>
            <th>Size</th>
            <th>Qty </th>
            <th>Price</th>
            <th>Days</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
        ${
          order.length > 0 && (
            <tr style="background-color: yellow;">
              <td>Product</td>
              <td></td>
              <td> </td>
              <td></td>
              <td> </td>
              <td> </td>
            </tr>
          )
        }
          ${order.map(item => (
            <tr>
              <td>{item.productName} </td>
              <td> {item.productDimension} </td>
              <td> {item.quantity}</td>
              <td> ₹{item.productPrice}</td>
              <td> {bookingInfo.number_of_days}</td>
              <td>₹{item.totalPrice * bookingInfo.number_of_days}</td>
            </tr>
          ))}       
        </tbody>
      </table>
      ${billingDetails.map(ele => (
        <div class="total">
          <div class="row-total">
            <div class="col-total">{ele.title}</div>
            <div class="col-total">{ele.value}</div>
          </div>
        </div>
      ))}
      <div>
        <div style="font-size: 15px; font-weight: bold;margin-top: 20px;">
        Terms & Condition
          </div>
          <div style="font-size: 13px; font-weight: bold;margin-top: 20px;">
            Introduction
              </div>
              <div style="font-size: 13px;margin-top: 20px">
                Welcome to Kadagam Ventures Pvt ltd (Bookevnt.com.) By accessing or using our platform, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, you must refrain from using our services. 
              </div>

              <div style="font-size: 13px; font-weight: bold;margin-top: 20px;">
                Account Registration
                   </div>
                   <div style="font-size: 13px;margin-top: 20px">
                    Eligibility: You must be at least 18 years old to create an account and use our services.
                    Accuracy of Information: You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                   </div>
      </div>
      </div>
    </div>
  </body>
</html>
  `;
};
