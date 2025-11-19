import { useState } from "react";
import "./App.css";
import "devextreme/dist/css/dx.light.css";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import PrivateRoute from "./auth/PrivateRoute";
import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  MemberDashboardPage,
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
  AdminMembersSubmittedPage,
  //My
  MonthlyPostingEditPage,
  MonthlyPostingsPage,
  AdminMonthlyPostingsPage,
  AdminMonthlyPostingPage,
  ConfigurationSACCOPage,
  AdminAnnouncementsPage,
  AdminAnnouncementEditPage,
  AdminMemberQueriesPage,
  AdminKnowledgebaseCategoriesPage,
  AdminKnowledgebaseArticlesPage,
  AdminKnowledgebaseCategoryEditPage,
  AdminKnowledgebaseArticleEditPage,
  MemberQueriesPage,
  MemberQuerySubmitPage,
  AdminPostingPeriodsPage,
  AdminMeetingsPage,
  MonthlyPostingPage,
  MonthlyPostingApprovalsPage,
  MonthlyPostingApprovePage,
  MonthlyPostingPOPUploadPage,
  MemberSavingsPage,
  MemberSocialFundsPage,
  MemberPenaltiesPage,
  MemberSharesPage,
  MemberLoansPage,
  AdminMeetingsEditPage,
  AdminMeetingPage,
  AdminMemberSummaryPage,
  AdminMonthlyApprovedPostingsPage,
  AdminMonthlyRejectedPostingsPage,
  AdminPostingPeriodPage,
  AdminPostingSubmittedPeriodsPage,
  AdminPostingApprovedPeriodsPage,
  AdminPostingRejectedPeriodsPage,
  AdminMonthlySummaryPage,
  AdminMonthlyPostingsDDACPage,
  AdminMemberPage,
  AdminMembersPage,
  AdminAnnouncementPage,
  AdminKnowledgebaseArticlePage,
  MemberQueryPage,
  AdminMemberQueryPage,
  MemberInterestSharingPage,
  MemberTimeValueSummaryPage,

} from "./pages";
import { BrowserRouter } from "react-router-dom";
import AttendanceTypes from "./pages/admin/dictionairies/attendance_types";
import ReviewStages from "./pages/admin/dictionairies/review_stages";
import AdminMonthlySubmittedPostings from "./pages/admin/monthly-posting/month_posting_submitted";
import AdminMembersApproved from "./pages/admin/members/member_approved";
import AdminMembersRejected from "./pages/admin/members/member_rejected";

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

          <Route path="/home" element={<HomePage></HomePage>} />
          <Route path="/about" element={<AboutPage></AboutPage>} />
          <Route path="/contact" element={<ContactPage></ContactPage>} />
          {/* ADMIN */}
          {/* Dashboards */}
          <Route path="/" element={<MemberDashboardPage></MemberDashboardPage>} />
          {/* Reports */}
          <Route path="/reports/member-summary" element={<AdminMemberSummaryPage/>} />
          <Route path="/reports/monthly-summary" element={<AdminMonthlySummaryPage/>} />
          <Route path="/reports/interest-sharing" element={<MemberInterestSharingPage/>} />
          <Route path="/reports/time-value-summary" element={<MemberTimeValueSummaryPage/>} />
          {/* Dictionaries */}
          <Route path="/admin/dictionairies/statuses" element={<StatusesPage></StatusesPage>} />
          <Route path="/admin/dictionairies/transaction-sources" element={<TransactionSourcesPage></TransactionSourcesPage>} />
          <Route path="/admin/dictionairies/transaction-types" element={<TransactionTypesPage></TransactionTypesPage>} />
          <Route path="/admin/dictionairies/attendance-types" element={<AttendanceTypes></AttendanceTypes>} />
          <Route path="/admin/dictionairies/review-stages" element={<ReviewStages></ReviewStages>} />
          {/* monthly postings */}
          <Route path="/admin/monthly-postings/list" element={<AdminMonthlyPostingsPage/>} />
          <Route path="/admin/monthly-postings/submitted" element={<AdminMonthlySubmittedPostings/>} />
          <Route path="/admin/monthly-postings/approved" element={<AdminMonthlyApprovedPostingsPage/>} />
          <Route path="/admin/monthly-postings/rejected" element={<AdminMonthlyRejectedPostingsPage/>} />
          <Route path="/admin/monthly-postings/ddac-report/:eId" element={<AdminMonthlyPostingsDDACPage/>} />
          <Route path="/admin/monthly-postings/view/:eId" element={<AdminMonthlyPostingPage/>} />
          {/* posting periods */}
          <Route path="/admin/posting-periods/list" element={<AdminPostingPeriodsPage/>} />
          <Route path="/admin/posting-periods/submitted" element={<AdminPostingSubmittedPeriodsPage/>} />
          <Route path="/admin/posting-periods/approved" element={<AdminPostingApprovedPeriodsPage/>} />
          <Route path="/admin/posting-periods/rejected" element={<AdminPostingRejectedPeriodsPage/>} />
          <Route path="/admin/posting-periods/view/:eId" element={<AdminPostingPeriodPage/>} />
          {/* Users */}
          <Route path="/admin/members/list" element={<AdminMembersPage/>} />
          <Route path="/admin/members/submitted" element={<AdminMembersSubmittedPage/>} />
          <Route path="/admin/members/approved" element={<AdminMembersApproved/>} />
          <Route path="/admin/members/rejected" element={<AdminMembersRejected/>} />
          <Route path="/admin/members/view/:eId" element={<AdminMemberPage/>} />
          {/* Configuration */}
          <Route path="/admin/config/sacco" element={<ConfigurationSACCOPage/>} />  
          {/* announcements */}
          <Route path="/admin/announcements/list" element={<AdminAnnouncementsPage/>} />
          <Route path="/admin/announcements/edit/:eId" element={<AdminAnnouncementEditPage/>} />
          <Route path="/admin/announcements/add" element={<AdminAnnouncementEditPage/>} />
          <Route path="/admin/announcements/view/:eId" element={<AdminAnnouncementPage/>} />
          {/* meetings */}
          <Route path="/admin/meetings/list" element={<AdminMeetingsPage/>} />
          <Route path="/admin/meetings/view/:eId" element={<AdminMeetingPage/>} />
          <Route path="/admin/meetings/add" element={<AdminMeetingsEditPage/>} />
          <Route path="/admin/meetings/edit/:eId" element={<AdminMeetingsEditPage/>} />
          {/* member queries */}
          <Route path="/admin/member-queries/list" element={<AdminMemberQueriesPage/>} />
          <Route path="/admin/member-queries/view/:eId" element={<AdminMemberQueryPage/>} />
          {/* knowledge-base */}
          <Route path="/admin/knowledge-base/category/list" element={<AdminKnowledgebaseCategoriesPage/>} />
          <Route path="/admin/knowledge-base/category/edit/:eId" element={<AdminKnowledgebaseCategoryEditPage/>} />
          <Route path="/admin/knowledge-base/category/add" element={<AdminKnowledgebaseCategoryEditPage/>} />
          <Route path="/admin/knowledge-base/article/list" element={<AdminKnowledgebaseArticlesPage/>} />
          <Route path="/admin/knowledge-base/article/edit/:eId" element={<AdminKnowledgebaseArticleEditPage/>} />
          <Route path="/admin/knowledge-base/article/view/:eId" element={<AdminKnowledgebaseArticlePage/>} />
          <Route path="/admin/knowledge-base/article/add" element={<AdminKnowledgebaseArticleEditPage/>} />
          {/* MEMBER */}
          {/* My */}
          <Route path="/" element={<MemberDashboardPage></MemberDashboardPage>} />
          <Route path="/my/monthly-posting/post" element={<MonthlyPostingEditPage/>} />
          <Route path="/my/monthly-posting/edit/:eId" element={<MonthlyPostingEditPage/>} />
          <Route path="/my/monthly-posting/list" element={<MonthlyPostingsPage/>} />
          <Route path="/my/monthly-posting/approvals" element={<MonthlyPostingApprovalsPage/>} />
          <Route path="/my/monthly-posting/view/:eId" element={<MonthlyPostingPage/>} />
          <Route path="/my/monthly-posting/guarantor-approval/:eId" element={<MonthlyPostingApprovePage/>} />
          <Route path="/my/monthly-posting/pop-upload/:eId" element={<MonthlyPostingPOPUploadPage/>} />
          <Route path="/my/member-queries/list" element={<MemberQueriesPage/>} />
          <Route path="/my/member-queries/submit" element={<MemberQuerySubmitPage/>} />
          <Route path="/my/member-queries/edit/:eId" element={<MemberQuerySubmitPage/>} />
          <Route path="/my/member-queries/view/:eId" element={<MemberQueryPage/>} />
          <Route path="/my/savings/list" element={<MemberSavingsPage/>} />
          <Route path="/my/social-funds/list" element={<MemberSocialFundsPage/>} />
          <Route path="/my/penalties/list" element={<MemberPenaltiesPage/>} />
          <Route path="/my/shares/list" element={<MemberSharesPage/>} />
          <Route path="/my/loans/list" element={<MemberLoansPage/>} />
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
