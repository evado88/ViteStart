import { useState } from "react";
import "./App.css";
import "devextreme/dist/css/dx.light.css";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import PrivateRoute from "./auth/PrivateRoute";
import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  DashboardPage,
  ContactPage,
  AboutPage,
  //Error
  NotFoundPage,
  //Auth
  LoginPage,
  SignupPage,
  //dictionairies
  StatusesPage,
  TransactionSourcesPage,
  TransactionTypesPage,
  //Users
  UsersPendingPage,
  //My
  MonthlyPostingPage,
  MonthlyPostingsPage
} from "./pages";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<DashboardPage></DashboardPage>} />
          <Route path="/home" element={<HomePage></HomePage>} />
          <Route path="/about" element={<AboutPage></AboutPage>} />
          <Route path="/contact" element={<ContactPage></ContactPage>} />
          {/* Dictionaries */}
          <Route path="/admin/dictionairies/statuses" element={<StatusesPage></StatusesPage>} />
          <Route path="/admin/dictionairies/transaction-sources" element={<TransactionSourcesPage></TransactionSourcesPage>} />
          <Route path="/admin/dictionairies/transaction-types" element={<TransactionTypesPage></TransactionTypesPage>} />
          {/* Users */}
          <Route path="/admin/users/pending" element={<UsersPendingPage/>} />
          {/* My */}
          <Route path="/my/monthly-posting" element={<MonthlyPostingPage/>} />
          <Route path="/my/monthly-postings" element={<MonthlyPostingsPage/>} />
          {/* Error */}   
          <Route path="*" element={<NotFoundPage></NotFoundPage>} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage></LoginPage>} />
          <Route path="/signup" element={<SignupPage></SignupPage>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
