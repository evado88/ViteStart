export { default as HomePage } from './home'
//Error
export { default as NotFoundPage } from './404'
//Auth
export { default as LoginPage } from '../auth/login'
export { default as SignupPage } from '../auth/signup'

//All users
export { default as PasswordPage } from './password'
export { default as ProfilePage } from './profile'
//ADMIN
//dahsboard
//user
export { default as AdminUsersPage } from './admin/users/user_list'
export { default as AdminUserEditPage } from './admin/users/user_edit'
export { default as AdminUserPage } from './admin/users/user'
//reports
export { default as AdminMemberSummaryPage } from './reports/member_summary'
export { default as AdminMonthlySummaryPage } from './reports/monthly_summary'
export { default as AdminMonthlyExpenseEarningsSummaryPage } from './reports/expense_earning_summary'
export { default as MemberInterestSharingPage } from './reports/member_interest_sharing'
export { default as MemberTimeValueSummaryPage } from './reports/member_time_value_summary'
export { default as MemberPayoutSummaryPage } from './reports/member_payout_summary'
//posting period
export { default as AdminPostingPeriodEditPage } from './admin/posting-periods/posting_period_edit'
export { default as AdminPostingPeriodsPage } from './admin/posting-periods/posting_period_list'
export { default as AdminPostingSubmittedPeriodsPage } from './admin/posting-periods/posting_period_submitted'
export { default as AdminPostingApprovedPeriodsPage } from './admin/posting-periods/posting_period_approved'
export { default as AdminPostingRejectedPeriodsPage } from './admin/posting-periods/posting_period_rejected'
export { default as AdminPostingPeriodPage } from './admin/posting-periods/posting_period'

//Dictionairies
export { default as StatusesPage} from './admin/dictionairies/status_types'
export { default as TransactionTypesPage} from './admin/dictionairies/transaction_types'
export { default as TransactionSourcesPage} from './admin/dictionairies/transaction_sources'
export { default as AttendanceTypesPage} from './admin/dictionairies/attendance_types'
export { default as ReviewStagesPage} from './admin/dictionairies/review_stages'

//monthly posting
export { default as AdminMonthlyPostingsPage } from './admin/monthly-posting/month_posting_list'
export { default as AdminMonthlySubmittedPostingsPage } from './admin/monthly-posting/month_posting_submitted'
export { default as AdminMonthlyApprovedPostingsPage } from './admin/monthly-posting/month_posting_approved'
export { default as AdminMonthlyRejectedPostingsPage } from './admin/monthly-posting/month_posting_rejected'
export { default as AdminMonthlyPostingsDDACPage } from './admin/monthly-posting/month_posting_ddac'
export { default as AdminMonthlyPostingPage } from './admin/monthly-posting/month_posting'

//mid-month posting


//expense and earnings
export { default as AdminExpenseEarningGroupsPage } from './admin/expense-earnings/group_list'
export { default as AdminExpenseEarningGroupsEditPage } from './admin/expense-earnings/group_edit'
export { default as AdminExpenseEarningsPage } from './admin/expense-earnings/expense_earning_list'
export { default as AdminExpenseEarningsSubmittedPage } from './admin/expense-earnings/expense_earning_submitted'
export { default as AdminExpenseEarningsApprovedPage } from './admin/expense-earnings/expense_earning_approved'
export { default as AdminExpenseEarningsRejectedPage } from './admin/expense-earnings/expense_earning_rejected'
export { default as AdminExpenseEarningsEditPage } from './admin/expense-earnings/expense_earning_edit'
export { default as AdminExpenseEarningPage } from './admin/expense-earnings/expense_earning'
//annoucement
export { default as AdminAnnouncementsPage } from './admin/announcements/announcement_list'
export { default as AdminAnnouncementEditPage } from './admin/announcements/announcement_edit'
export { default as AdminAnnouncementPage } from './admin/announcements/announcement'
//meetings
export { default as AdminMeetingsPage } from './admin/meetings/meeting_list'
export { default as AdminMeetingsEditPage } from './admin/meetings/meeting_edit'
export { default as AdminMeetingPage } from './admin/meetings/meeting'
//member queries
export { default as AdminMemberQueriesPage } from './admin/member-queries/query_list'
export { default as AdminMemberQueryPage } from './admin/member-queries/query'
//payment methods
export { default as AdminPaymentMethodsPage } from './admin/payment-methods/payment_method_list'
export { default as AdminPaymentMethodPage } from './admin/payment-methods/payment_method'
//guarantors
export { default as AdminGuarantorsPage } from './admin/guarantors/guarantor_list'
export { default as AdminGuarantorPage } from './admin/guarantors/guarantor'
//knowledge-base
export { default as AdminKnowledgebaseArticlesPage } from './admin/knowledge-base/article_list'
export { default as AdminKnowledgebaseArticlePage } from './admin/knowledge-base/article'
export { default as AdminKnowledgebaseArticleEditPage } from './admin/knowledge-base/article_edit'
export { default as AdminKnowledgebaseCategoriesPage } from './admin/knowledge-base/category_list'
export { default as AdminKnowledgebaseCategoryEditPage } from './admin/knowledge-base/category_edit'
//users
export { default as AdminMembersPage} from './admin/members/member_list'
export { default as AdminMembersSubmittedPage} from './admin/members/member_submitted'
export { default as AdminMemberPage} from './admin/members/member'

//config
export { default as ConfigurationSACCOPage} from './admin/configuration/sacco'


//MEMBER
//My
export { default as MemberDashboardPage } from './dashboard'
export { default as MonthlyPostingEditPage} from './my/month_posting_edit'
export { default as MidMonthlyPostingEditPage} from './my/midmonth_posting_edit'
export { default as MonthlyPostingPage} from './my/month_posting'
export { default as MonthlyPostingApprovePage} from './my/month_posting_approve'
export { default as MonthlyPostingsPage} from './my/month_posting_list'
export { default as MidMonthlyPostingsPage} from './my/midmonth_posting_list'
export { default as MonthlyPostingApprovalsPage} from './my/month_posting_approvals'
export { default as MonthlyPostingPOPUploadPage} from './my/month_posting_pop_upload'
export { default as MemberQueriesPage} from './my/query_list'
export { default as MemberQuerySubmitPage} from './my/query_edit'
export { default as MemberQueryPage} from './my/query'
export { default as MemberSavingsPage} from './my/savings'
export { default as MemberSocialFundsPage} from './my/social'
export { default as MemberPenaltiesPage} from './my/penalties'
export { default as MemberSharesPage} from './my/shares'
export { default as MemberLoansPage} from './my/loans'
export { default as GuarantorsPage} from './my/guarantors'
export { default as GuarantorSubmitPage} from './my/guarantor_edit'
export { default as GuarantorApprovalsPage} from './my/guarantor_approvals'
export { default as GuarantorPage} from './my/guarantor'
export { default as GuarantorApprovePage} from './my/guarantor_approve'
export { default as PaymentMethodsPage} from './my/payment_methods'
export { default as PaymentMethodSubmitPage} from './my/payment_method_edit'
export { default as PaymentMethodPage} from './my/payment_method'
