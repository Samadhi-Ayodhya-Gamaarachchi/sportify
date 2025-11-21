# Sportify - Sports & Lifestyle App

## 📱 **Assignment Implementation Overview**

This React Native/Expo app implements all the key requirements from the assignment guidelines for a comprehensive sports application.

### ✅ **Key Requirements Implemented**

#### **1. User Authentication**
- **Registration & Login Flow**: Complete forms with validation using React Hook Form + Yup
- **Form Validations**: Email format, password strength, required fields
- **Navigation**: Successful login navigates to home screen  
- **User Display**: Logged-in user's name appears in the app header
- **Security**: Authentication state stored using Redux + AsyncStorage

#### **2. Navigation Structure** 
- **Expo Router**: File-based routing system
- **Bottom Tabs**: Home and Favorites screens
- **Stack Navigation**: Welcome → Login/Register → Tabs → Details/Profile

#### **3. Home Screen - Dynamic Item List**
- **API Integration**: Real sports data from TheSportsDB API
- **Card Layout**: Each item displays image, title, and status
- **Categories**: Teams, Matches with proper categorization
- **Interactive**: Tap items to open Details Screen

#### **4. State Management** 
- **Redux Toolkit**: Complete store setup with multiple slices
- **Async Actions**: API calls with proper loading states
- **Persistence**: AsyncStorage integration for offline support

#### **5. Favorites System**
- **Add/Remove**: Heart icon toggles to mark favorites
- **Separate Screen**: Dedicated favorites tab with filtering
- **Persistence**: Favorites saved to AsyncStorage

#### **6. Styling & UI**
- **Feather Icons**: All iconographic elements use Feather icons (as required)
- **Responsive**: Layouts adapt to different screen sizes
- **Dark Theme**: Professional sports app aesthetic

### 🚀 **How to Run**

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Test the App**
   - Use Expo Go app or simulator
   - Login with any username/password (demo mode)
   - Explore teams, add favorites
   - Test navigation between screens

### 📝 **Testing Guide**

#### **Authentication Flow**
1. Start at Welcome screen → Tap "Get Started"
2. Login screen → Enter any username & password
3. Successfully navigates to Home with user name displayed

#### **Home Screen Features**
1. View featured teams from TheSportsDB API
2. Scroll through recent matches
3. Tap heart icons to add/remove favorites
4. Pull down to refresh data

#### **Favorites Management**
1. Navigate to Favorites tab
2. View all favorited items with filtering
3. Remove favorites by tapping heart icon

### 🔧 **Technical Stack**

- **Framework**: React Native with Expo Router
- **State Management**: Redux Toolkit
- **Form Validation**: React Hook Form + Yup
- **API Integration**: TheSportsDB + DummyJSON APIs
- **Persistence**: AsyncStorage
- **Icons**: Feather Icons
- **Styling**: StyleSheet with responsive design

This implementation demonstrates a professional, production-ready React Native app following all assignment requirements and modern development best practices.
