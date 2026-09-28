import "./App.css";
import "devextreme/dist/css/dx.greenmist.compact.css";
// the app-wide theme goes last so it applies over the template and DevExtreme
import "./assets/css/app-theme.css";
import MainLayout from "./components/MainLayout";
import AuthLayout from "./components/AuthLayout";
import PrivateRoute from "./auth/PrivateRoute";
import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  MemberDashboardPage,
  //Error
  NotFoundPage,
  //Auth
  LoginPage,
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
  AdminPostingPeriodEditPage,
  AdminExpenseEarningGroupsPage,
  AdminExpenseEarningGroupsEditPage,
  AdminExpenseEarningsSubmittedPage,
  AdminExpenseEarningsEditPage,
  AdminExpenseEarningsRejectedPage,
  AdminExpenseEarningsApprovedPage,
  AdminExpenseEarningPage,
  AdminExpenseEarningsPage,
  AdminMonthlyExpenseEarningsSummaryPage,
  GuarantorsPage,
  PaymentMethodsPage,
  GuarantorSubmitPage,
  GuarantorPage,
  PaymentMethodSubmitPage,
  PaymentMethodPage,
  AdminUsersPage,
  AdminUserEditPage,
  AdminUserPage,
  AdminPaymentMethodsPage,
  AdminPaymentMethodPage,
  AdminGuarantorPage,
  AdminGuarantorsPage,
  MemberPayoutSummaryPage,
  ProfilePage,
  PasswordPage,
  MidMonthlyPostingEditPage,
  MidMonthlyPostingsPage,
  GuarantorApprovalsPage,
  GuarantorApprovePage,
  UnauthorizedPage,
  AdminSavingsPage,
  AdminSocialFundsPage,
  AdminLoansPage,
  AdminSharesPage,
  AdminPenaltiesPage,
  MemberMeetingsPage,
  MemberMeetingPage,
  AdminSessionsPage,
  AdminAuditsPage,

} from "./pages";
import { BrowserRouter } from "react-router-dom";
import AttendanceTypes from "./pages/admin/dictionairies/attendance_types";
import ReviewStages from "./pages/admin/dictionairies/review_stages";
import AdminMonthlySubmittedPostings from "./pages/admin/monthly-posting/month_posting_submitted";
import AdminApprovalsPage from "./pages/admin/approvals/approvals";
import { PendingAnnouncements, ApprovedAnnouncements, RejectedAnnouncements } from "./pages/admin/announcements/announcement_list";
import { PendingMeetings, ApprovedMeetings, RejectedMeetings } from "./pages/admin/meetings/meeting_list";
import { PendingMemberQueries, ApprovedMemberQueries, RejectedMemberQueries } from "./pages/admin/member-queries/query_list";
import { PendingPaymentMethods, ApprovedPaymentMethods, RejectedPaymentMethods } from "./pages/admin/payment-methods/payment_method_list";
import { PendingGuarantors, ApprovedGuarantors, RejectedGuarantors } from "./pages/admin/guarantors/guarantor_list";
import { PendingArticles, ApprovedArticles, RejectedArticles } from "./pages/admin/knowledge-base/article_list";
import { PendingUsers, ApprovedUsers, RejectedUsers } from "./pages/admin/users/user_list";
import {
  AnnouncementsPage,
  AnnouncementViewPage,
  KnowledgeBasePage,
  ArticleViewPage,
} from "./components/reading";
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
          <Route path="/401" element={<UnauthorizedPage/>} />
          <Route path="/home" element={<HomePage></HomePage>} />
          {/* ALL */}
          <Route path="/account/profile" element={<ProfilePage/>} />
          <Route path="/account/security" element={<PasswordPage/>} />
          {/* ADMIN */}
          {/* users */}
          <Route path="/admin/audit/sessions/list" element={<AdminSessionsPage/>} />
          <Route path="/admin/audit/events/list" element={<AdminAuditsPage/>} />
          {/* users */}
          <Route path="/admin/users/list" element={<AdminUsersPage/>} />
          <Route path="/admin/users/pending" element={<PendingUsers/>} />
          <Route path="/admin/users/approved" element={<ApprovedUsers/>} />
          <Route path="/admin/users/rejected" element={<RejectedUsers/>} />
          <Route path="/admin/announcements/pending" element={<PendingAnnouncements/>} />
          <Route path="/admin/announcements/approved" element={<ApprovedAnnouncements/>} />
          <Route path="/admin/announcements/rejected" element={<RejectedAnnouncements/>} />
          <Route path="/admin/meetings/pending" element={<PendingMeetings/>} />
          <Route path="/admin/meetings/approved" element={<ApprovedMeetings/>} />
          <Route path="/admin/meetings/rejected" element={<RejectedMeetings/>} />
          <Route path="/admin/member-queries/pending" element={<PendingMemberQueries/>} />
          <Route path="/admin/member-queries/approved" element={<ApprovedMemberQueries/>} />
          <Route path="/admin/member-queries/rejected" element={<RejectedMemberQueries/>} />
          <Route path="/admin/payment-methods/pending" element={<PendingPaymentMethods/>} />
          <Route path="/admin/payment-methods/approved" element={<ApprovedPaymentMethods/>} />
          <Route path="/admin/payment-methods/rejected" element={<RejectedPaymentMethods/>} />
          <Route path="/admin/guarantors/pending" element={<PendingGuarantors/>} />
          <Route path="/admin/guarantors/approved" element={<ApprovedGuarantors/>} />
          <Route path="/admin/guarantors/rejected" element={<RejectedGuarantors/>} />
          <Route path="/admin/knowledge-base/article/pending" element={<PendingArticles/>} />
          <Route path="/admin/knowledge-base/article/approved" element={<ApprovedArticles/>} />
          <Route path="/admin/knowledge-base/article/rejected" element={<RejectedArticles/>} />
          <Route path="/admin/users/edit/:eId" element={<AdminUserEditPage/>} />
          <Route path="/admin/users/add" element={<AdminUserEditPage/>} />
          <Route path="/admin/users/view/:eId" element={<AdminUserPage/>} />
          <Route path="/users/view/id/:eId" element={<AdminUserPage/>} />
          {/* Dashboards */}
          <Route path="/" element={<MemberDashboardPage></MemberDashboardPage>} />
          {/* Reports */}
          <Route path="/reports/member-summary" element={<AdminMemberSummaryPage/>} />
          <Route path="/reports/monthly-summary" element={<AdminMonthlySummaryPage/>} />
          <Route path="/reports/expense-earnings-summary" element={<AdminMonthlyExpenseEarningsSummaryPage/>} />
          <Route path="/reports/interest-sharing" element={<MemberInterestSharingPage/>} />
          <Route path="/reports/time-value-summary" element={<MemberTimeValueSummaryPage/>} />
          <Route path="/reports/payout-summary" element={<MemberPayoutSummaryPage/>} />
          {/* Dictionaries */}
          <Route path="/admin/dictionairies/statuses" element={<StatusesPage></StatusesPage>} />
          <Route path="/admin/dictionairies/transaction-sources" element={<TransactionSourcesPage></TransactionSourcesPage>} />
          <Route path="/admin/dictionairies/transaction-types" element={<TransactionTypesPage></TransactionTypesPage>} />
          <Route path="/admin/dictionairies/attendance-types" element={<AttendanceTypes></AttendanceTypes>} />
          <Route path="/admin/dictionairies/review-stages" element={<ReviewStages></ReviewStages>} />
          {/* monthly postings */}
          <Route path="/admin/monthly-postings/list" element={<AdminMonthlyPostingsPage/>} />
          <Route path="/admin/monthly-postings/submitted" element={<AdminMonthlySubmittedPostings/>} />
          <Route path="/admin/approvals" element={<AdminApprovalsPage/>} />
          <Route path="/admin/monthly-postings/approved" element={<AdminMonthlyApprovedPostingsPage/>} />
          <Route path="/admin/monthly-postings/rejected" element={<AdminMonthlyRejectedPostingsPage/>} />
          <Route path="/admin/monthly-postings/ddac-report/:eId" element={<AdminMonthlyPostingsDDACPage/>} />
          <Route path="/admin/monthly-postings/view/:eId" element={<AdminMonthlyPostingPage/>} />
          {/* mid-month posting */}

          {/* transactions */}
          <Route path="/admin/savings/approved" element={<AdminSavingsPage/>} />
          <Route path="/admin/social-fund/approved" element={<AdminSocialFundsPage/>} />
          <Route path="/admin/loans/approved" element={<AdminLoansPage/>} />
          <Route path="/admin/shares/approved" element={<AdminSharesPage/>} />
          <Route path="/admin/penalties/approved" element={<AdminPenaltiesPage/>} />
          {/*expense and earnings*/}
          <Route path="/admin/expense-earning/group/list" element={<AdminExpenseEarningGroupsPage/>} />
          <Route path="/admin/expense-earning/group/add" element={<AdminExpenseEarningGroupsEditPage/>} />
          <Route path="/admin/expense-earning/group/edit/:eId" element={<AdminExpenseEarningGroupsEditPage/>} />
           <Route path="/admin/expenses-earnings/list" element={<AdminExpenseEarningsPage/>} />
          <Route path="/admin/expenses-earnings/submitted" element={<AdminExpenseEarningsSubmittedPage/>} />
          <Route path="/admin/expenses-earnings/approved" element={<AdminExpenseEarningsApprovedPage/>} />
          <Route path="/admin/expenses-earnings/rejected" element={<AdminExpenseEarningsRejectedPage/>} />
          <Route path="/admin/expenses-earnings/add" element={<AdminExpenseEarningsEditPage/>} />
          <Route path="/admin/expenses-earnings/edit/:eId" element={<AdminExpenseEarningsEditPage/>} />
          <Route path="/admin/expenses-earnings/view/:eId" element={<AdminExpenseEarningPage/>} />
          {/* posting periods */}
          <Route path="/admin/posting-periods/list" element={<AdminPostingPeriodsPage/>} />
          <Route path="/admin/posting-periods/submitted" element={<AdminPostingSubmittedPeriodsPage/>} />
          <Route path="/admin/posting-periods/approved" element={<AdminPostingApprovedPeriodsPage/>} />
          <Route path="/admin/posting-periods/rejected" element={<AdminPostingRejectedPeriodsPage/>} />
          <Route path="/admin/posting-periods/view/:eId" element={<AdminPostingPeriodPage/>} />
          <Route path="/admin/posting-periods/edit/:eId" element={<AdminPostingPeriodEditPage/>} />
          {/* Members */}
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
          <Route path="/announcements" element={<AnnouncementsPage/>} />
          <Route path="/announcements/view/id/:eId" element={<AnnouncementViewPage/>} />
          {/* meetings */}
          <Route path="/admin/meetings/list" element={<AdminMeetingsPage/>} />
          <Route path="/admin/meetings/view/:eId" element={<AdminMeetingPage/>} />
          <Route path="/admin/meetings/add" element={<AdminMeetingsEditPage/>} />
          <Route path="/admin/meetings/edit/:eId" element={<AdminMeetingsEditPage/>} />
          {/* member queries */}
          <Route path="/admin/member-queries/list" element={<AdminMemberQueriesPage/>} />
          <Route path="/admin/member-queries/view/:eId" element={<AdminMemberQueryPage/>} />
          {/* payment-methods */}
          <Route path="/admin/payment-methods/list" element={<AdminPaymentMethodsPage/>} />
          <Route path="/admin/payment-methods/view/:eId" element={<AdminPaymentMethodPage/>} />

          {/* guarantors */}
          <Route path="/admin/guarantors/list" element={<AdminGuarantorsPage/>} />
          <Route path="/admin/guarantors/view/:eId" element={<AdminGuarantorPage/>} />
          {/* knowledge-base */}
          <Route path="/admin/knowledge-base/category/list" element={<AdminKnowledgebaseCategoriesPage/>} />
          <Route path="/admin/knowledge-base/category/edit/:eId" element={<AdminKnowledgebaseCategoryEditPage/>} />
          <Route path="/admin/knowledge-base/category/add" element={<AdminKnowledgebaseCategoryEditPage/>} />
          <Route path="/admin/knowledge-base/article/list" element={<AdminKnowledgebaseArticlesPage/>} />
          <Route path="/admin/knowledge-base/article/edit/:eId" element={<AdminKnowledgebaseArticleEditPage/>} />
          <Route path="/admin/knowledge-base/article/view/:eId" element={<AdminKnowledgebaseArticlePage/>} />
          <Route path="/admin/knowledge-base/article/add" element={<AdminKnowledgebaseArticleEditPage/>} />
          <Route path="/knowledge-base" element={<KnowledgeBasePage/>} />
          <Route path="/knowledge-base/article/view/id/:eId" element={<ArticleViewPage/>} />
          {/* MEMBER */}
          {/* My */}
          <Route path="/" element={<MemberDashboardPage></MemberDashboardPage>} />
          <Route path="/my/monthly-posting/post" element={<MonthlyPostingEditPage/>} />
          <Route path="/my/monthly-posting/edit/:eId" element={<MonthlyPostingEditPage/>} />
          <Route path="/my/mid-month-posting/post" element={<MidMonthlyPostingEditPage/>} />
          <Route path="/my/mid-month-posting/edit/:eId" element={<MidMonthlyPostingEditPage/>} />
          <Route path="/my/monthly-posting/list" element={<MonthlyPostingsPage/>} />
          <Route path="/my/mid-month-posting/list" element={<MidMonthlyPostingsPage/>} />
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
          <Route path="/my/guarantors/list" element={<GuarantorsPage/>} />
          <Route path="/my/guarantors/approvals" element={<GuarantorApprovalsPage/>} />
          <Route path="/my/guarantors/submit" element={<GuarantorSubmitPage/>} />
          <Route path="/my/guarantors/edit/:eId" element={<GuarantorSubmitPage/>} />
          <Route path="/my/guarantors/view/:eId" element={<GuarantorPage/>} />
          <Route path="/my/guarantors/review/:eId" element={<GuarantorApprovePage/>} />
          <Route path="/my/payment-methods/list" element={<PaymentMethodsPage/>} />
          <Route path="/my/payment-methods/add" element={<PaymentMethodSubmitPage/>} />
          <Route path="/my/payment-methods/edit/:eId" element={<PaymentMethodSubmitPage/>} />
          <Route path="/my/payment-methods/view/:eId" element={<PaymentMethodPage/>} />
          <Route path="/my/meetings/list" element={<MemberMeetingsPage/>} />
          <Route path="/my/meetings/view/:eId" element={<MemberMeetingPage/>} />
          {/* Error */}   
          <Route path="*" element={<NotFoundPage></NotFoundPage>} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage></LoginPage>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
