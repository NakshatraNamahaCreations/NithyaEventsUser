const apiUrl = {
  // BASEURL: 'http://192.168.1.103:9000/api',
  // IMAGEURL: 'http://192.168.1.103:9000/',

  BASEURL: 'https://api.nithyaevent.com/api',
  IMAGEURL: 'https://api.nithyaevent.com/',
  // USER
  USER_REGISTER: '/user/user-register',
  USER_LOGIN: '/user/user-login',
  UPDATE_VENDOR_PROFILE: '/user/update-profile/',
  // SERVICE_USER_BUSINESS: '/user/save-vendor-details',
  // SERVICE_ADDITIONAL_DETAILS: '/user/add-service-additional-details',
  GET_USER_PROFILE: '/user/get-user-profile/',
  // FILTEROUT_VENDOR: '/user/filterout-vendors/',
  USER_ORDER: '/userorder/getorder/',
  ADD_ADDRESS: '/user/save-delivery-address/',
  VENDOR_LOGOUT: '/user/delete-vendor-profile/',

  // VENDOR
  GET_ALL_PRODUCT_VENDOR: '/vendor/get-product-vendor',
  GET_VENDOR_PROFILE: '/vendor/getprofile/',
  GET_SERVICES_BY_SERVICE_NAME: '/vendor/get-vendor-by-servicename',

  // Product
  GET_RENTAL_PRODUCTS: '/product/getrentalproduct',
  GET_PARTICULAR_VENDOR_PRODUCTS: '/product/get-particular-vendor-products',
  GET_REVIEW: '/product/getreview/',
  WRITE_A_REVIEW: '/product/review/',

  // SERVICE
  GET_ALL_SERVICE: '/service/get-all-service',

  // SERVICE REVIEW
  GET_SERVICE_REVIEW: '/vendor/get-service-review/',
  WRITE_VENDORS_REVIEW: '/vendor/write-review/',

  // ORDER
  CREATE_ORDER: '/user-order/create-order',
  RESCHEDULE_ORDER: '/user-order/reschedule-order/',
  GET_ORDER: '/user-order/getallorder',
  GET_USER_ORDER: '/user-order/get-a-order/',
  GET_ORDER_BY_ORDER_ID: '/user-order/get-order-by-order-id/',
  CANCEL_ORDER: '/user-order/cancel-order/',
  RETURN_ORDER: '/user-order/return-order/',
  UPDATING_EVENT_STATUS: '/user-order/raise-ticket/',

  // BANNER
  GET_ALL_BANNERS: '/banners/get-all-banners',
  GET_YOUTUBE_VIDEO_LINK: '/youtube/get-active-youtube-links',
  GET_ALL_TECHNICIAN: '/technician/get-all-technician',
  GET_YOUTUBE_VIDEO_LINK: '/youtube/get-active-youtube-links',

  // TICKET
  CREATE_TICKET: '/ticket/create-ticket',
  GET_TICKET_BY_ID: '/ticket/get-ticket-by-id/',

  // COMPANY DETAILS
  GET_PAYOUT_CONFIG: '/payout-config/get-payout-config-profile',
  GET_PROFILE: '/company-profile/get-profile',
};

export {apiUrl};
