import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import {generateHtmlContent} from './pdfUtils';

export const useGenerateInvoice = () => {
  const generatePdf = async (
    order,
    bookingInfo,
    address,
    invoiceNumber,
    invoiceInfo,
    billingDetails,
    termsConditions,
    userDataFromContext,
    serviceOrders,
  ) => {
    try {
      const path = `${RNFS.DocumentDirectoryPath}/Nithyaevent.pdf`; // or use another directory
      // console.log('Path for PDF:', path);
      const pdfContent = generateHtmlContent(
        order,
        bookingInfo,
        address,
        invoiceNumber,
        invoiceInfo,
        billingDetails,
        termsConditions,
        userDataFromContext,
        serviceOrders,
      );

      const options = {
        html: pdfContent,
        fileName: 'Nithyaevent',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      // console.log('PDF generated at:', file.filePath);

      return file.filePath;
      // Example function to create PDF
      //   await RNFS.writeFile(path, pdfContent, 'utf8');

      // Return the path if the PDF was created successfully
      return path;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return undefined; // Return undefined if an error occurs
    }
  };

  //   const generatePdf = useCallback(
  //     async (
  //       order,
  //       vendorData,
  //       invoiceNumber,
  //       sellerAddress,
  //       taxes,
  //       finalAmountWithIncludingTax,
  //     ) => {
  //       const html = generateHtmlContent(
  //         order,
  //         vendorData,
  //         invoiceNumber,
  //         sellerAddress,
  //         taxes,
  //         finalAmountWithIncludingTax,
  //       );
  //       try {
  //         const options = {
  //           html,
  //           fileName: 'Invoice',
  //           directory: 'Documents',
  //         };
  //         const file = await RNHTMLtoPDF.convert(options);
  //         console.log('PDF File:', file.filePath);
  //       } catch (error) {
  //         console.error('Error generating PDF:', error);
  //       }
  //     },
  //     [],
  //   );

  return {generatePdf};
};
