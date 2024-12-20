import signature from '../../assets/signature.png';

export const generateHtmlContent = (
  order,
  bookingInfo,
  address,
  invoiceNumber,
  invoiceInfo,
  billingDetails,
  termsConditions,
  // serviceOrders,
  userDataFromContext,
) => {
  const serviceOrders = bookingInfo.service_data;
  return `
   <html>
  <head>
    <style>
      body {
        font-family: "Montserrat";
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
      .total {
        margin-top: 10px;
        /* text-align: right;
        
        /* font-weight: bold; */
        /* border: 1px solid black; */
      }
      .row-total{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
      }
      .col-total{
        text-align: end;
        font-weight:500;
      }
       .footer {
  font-size: 14px;
  font-weight: 600;
}
      .img { 
        margin-left: 5px;
       margin-top: 5px;  
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
               <div style="font-size: 15px; font-weight: bold">
          GSTIN: 29AADPI4078B1ZW
          </div>
          <div style="font-size: 15px; font-weight: bold">
            SAC CODE: 998387
            </div>
          </div> 
            <div style="font-size: 15px; font-weight: bold;margin-top: 20px;">
            To
            </div>
            <div>
             <div style="font-size: 15px">
             ${userDataFromContext?.username} </div>              
                   <div style="font-size: 15px">
             ${bookingInfo.receiver_mobilenumber}</div>       
            <div style="font-size: 15px">
             ${bookingInfo.event_location}</div>              
          </div>
        <div style="font-size: 15px;margin-top: 20px">
          GST:  ${
            userDataFromContext?.company_profile?.length > 0
              ? userDataFromContext.company_profile[0].gst_number
              : 'N/A'
          }
        </div>       
        </div>
        <div class="col">        
           
              <div style="border:1px solid black;">
                  ${invoiceInfo
                    .map(
                      ele => `
                  <div class="row-box-invoice" style="border-bottom: 1px solid black;">
                    <div class="col">${ele.head}</div>
                    <div class="col">${ele.value}</div>
                  </div>
                `,
                    )
                    .join('')}
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
         order.length > 0
           ? `
                <tr style="background-color: yellow;">
                  <td style="font-weight:500;">Product</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              `
           : ''
       }
              ${order
                .map(
                  item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.productDimension}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.productPrice}</td>
                  <td>${bookingInfo.number_of_days}</td>
                  <td>₹${item.totalPrice * bookingInfo.number_of_days}</td>
                </tr>
              `,
                )
                .join('')}                                      
        ${
          serviceOrders.length > 0
            ? `
                <tr style="background-color: yellow;">
                  <td style="font-weight:500;">Service</td>
                  <td></td>
                  <td> </td>
                  <td></td>
                  <td> </td>
                  <td> </td>
                </tr>
              `
            : ''
        }
            ${serviceOrders
              .map(
                item => `
              <tr>
                <td>${item.shopName}</td>
                <td>- </td>
                <td>-</td>
                <td>₹${item.pricing}</td>
                <td>${bookingInfo.number_of_days}</td>
                <td>₹${item.pricing * bookingInfo.number_of_days}</td>
              </tr>
              `,
              )
              .join('')}
        </tbody>
      </table>
     
            <div class="total">
             ${billingDetails
               .map(
                 ele => `
              <div class="row-total">
                <div class="col-total">${ele.title}</div>
                <div class="col-total">${ele.value}</div>
              </div>
                  `,
               )
               .join('')}
            </div>
      
      <div>
        <div style="font-size: 15px; font-weight: bold;margin-top: 20px;margin-bottom: 20px">
        Terms & Condition
          </div>
           ${termsConditions
             .map(
               (item, index) => `
          <div>
          <div style="font-size: 13px; font-weight: bold;margin-top: 10px;">
          ${index + 1}.${item.title}
              </div>
              <div style="font-size: 13px;margin-top: 5px">
               ${item.paragraph}
              </div>
             </div>`,
             )
             .join('')}              
      </div>
      <div style="margin: 20px; text-align: right;">
        <div class="footer">
          Signature                 
        </div>
        <img src=${signature} style="width: 150px; height: 50px; margin-top: 5px;margin-left: 5px;" />
      </div>
      </div>
    </div>
  </body>
</html>
  `;
};
