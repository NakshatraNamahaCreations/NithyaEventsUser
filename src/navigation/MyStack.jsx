import FlashScreen from '../screens/FlashScreen';
import Login from '../screens/Login';
import OtpScreen from '../screens/OtpScreen';
import BottomTab from './BottomTab';
import AddAddress from '../components/cart_screen/AddAddress';
import Project from '../mood board/Project';
import OrderSummary from '../components/cart_screen/OrderSummary';
import AddLocality from '../components/cart_screen/AddLocality';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Register from '../screens/Register';
import EnableLocation from '../screens/EnableLocation';
import BookingSummary from '../components/booking_screen/BookingSummary';
import UpdateAccount from '../components/profile_screen/UpdateAccount';
import Favourites from '../components/profile_screen/Favourites';
import UpdateAddress from '../components/profile_screen/UpdateAddress';
import Notification from '../notification/Notification';
import ProductFiltered from '../components/product_screen/ProductFiltered';
import ProductDetails from '../components/product_screen/ProductDetails';
import ProductReview from '../components/product_screen/ProductReview';
import AddProfile from '../screens/AddProfile';
import CompanyDetails from '../components/cart_screen/CompanyDetails';
import Moodbooard from '../mood board/Moodbooard';
import SplashScreen from '../screens/SplashScreen';
import ServiceDetails from '../components/home_screen/ServiceDetails';
import OrderSuccess from '../components/cart_screen/OrderSuccess';
import CreateProject from '../mood board/CreateProject';
import AllProducts from '../components/product_screen/AllProducts';
import InvoiceFormat from '../components/booking_screen/InvoiceFormat';
import AddressList from '../components/cart_screen/AddressList';
// import EnableLocationcopy from '../screens/EnableLocationcopy';
import FAQList from '../components/profile_screen/FAQList';
import Search from '../components/home_screen/Search';
// import CancellationPolicy from '../components/booking_screen/CancellationPolicy';
import ReasonForCancel from '../components/booking_screen/ReasonForCancel';
// import RequestReturn from '../components/booking_screen/RequestReturn';
import RaiseTicket from '../components/booking_screen/RaiseTicket';
import MyTickets from '../components/booking_screen/MyTickets';
import CompanyProfile from '../screens/CompanyProfile';
import Reschedule from '../components/cart_screen/Reschedule';
import TermsNCondition from '../components/profile_screen/TermsNCondition';
import PrivacyPolicy from '../components/profile_screen/PrivacyPolicy';
import HelpCenter from '../components/profile_screen/HelpCenter';
import Aboutus from '../components/profile_screen/Aboutus';
import CalenderDisplay from '../components/home_screen/CalenderDisplay';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FlashScreen"
        component={FlashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Calender"
        component={CalenderDisplay}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddProfile"
        component={AddProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CompanyProfile"
        component={CompanyProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Otp"
        component={OtpScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Enable Location"
        component={EnableLocation}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Address List"
        component={AddressList}
        options={{title: 'Address List', headerShown: false}}
      />
      <Stack.Screen
        name="Add Address"
        component={AddAddress}
        options={{title: 'Event Address', headerShown: false}}
      />
      <Stack.Screen
        name="Add Locality"
        component={AddLocality}
        options={{headerShown: false}}
      />
      {/* cart///start */}
      <Stack.Screen
        name="Company Details"
        component={CompanyDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Order Summary"
        component={OrderSummary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccess}
        options={{headerShown: false}}
      />
      {/* cart///// end */}
      <Stack.Screen
        name="project"
        component={Project}
        options={{headerShown: true, headerTitle: 'Create New Project'}}
      />
      {/* suman's one */}
      <Stack.Screen
        name="moodboard"
        component={Moodbooard}
        options={{headerShown: true, headerTitle: 'Mood Board'}}
      />
      {/* mine not working*/}
      <Stack.Screen
        name="CreateProject"
        component={CreateProject}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notifications"
        component={Notification}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="ProductFiltered"
        component={ProductFiltered}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AllProducts"
        component={AllProducts}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductReview"
        component={ProductReview}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Booking Summary"
        component={BookingSummary}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="Cancellation Policy"
        component={CancellationPolicy}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="ReasonForCancel"
        component={ReasonForCancel}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Raise Ticket"
        component={RaiseTicket}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyTickets"
        component={MyTickets}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Reschedule"
        component={Reschedule}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="Request Return"
        component={RequestReturn}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="InvoiceFormat"
        component={InvoiceFormat}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Account"
        component={UpdateAccount}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Favourites"
        component={Favourites}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Address"
        component={UpdateAddress}
        options={{headerShown: true}}
      />
      {/* service detail */}
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Aboutus"
        component={Aboutus}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HelpCentre"
        component={HelpCenter}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TermsCondition"
        component={TermsNCondition}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQList}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default MyStack;
