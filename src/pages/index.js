export { default as AboutPage } from './about'
export { default as ContactPage } from './contact'

export { default as HomePage } from './home'
//Error
export { default as NotFoundPage } from './404'
//Auth
export { default as LoginPage } from '../auth/login'
export { default as SignupPage } from '../auth/signup'

//ADMIN
//dahsboard

//reports
export { default as AdminMemberSummaryPage } from './admin/reports/member_summary'
//posting period
export { default as AdminPostingPeriodsPage } from './admin/posting-periods/posting_period_list'

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
export { default as AdminMonthlyPostingPage } from './admin/monthly-posting/month_posting'
//annoucement
export { default as AdminAnnouncementsPage } from './admin/announcements/announcement_list'
export { default as AdminAnnouncementEditPage } from './admin/announcements/announcement_edit'

//meetings
export { default as AdminMeetingsPage } from './admin/meetings/meeting_list'
export { default as AdminMeetingsEditPage } from './admin/meetings/meeting_edit'
export { default as AdminMeetingPage } from './admin/meetings/meeting'
//member queries
export { default as AdminMemberQueriesPage } from './admin/member-queries/query_list'
//knowledge-base
export { default as AdminKnowledgebaseArticlesPage } from './admin/knowledge-base/article_list'
export { default as AdminKnowledgebaseArticleEditPage } from './admin/knowledge-base/article_edit'
export { default as AdminKnowledgebaseCategoriesPage } from './admin/knowledge-base/category_list'
export { default as AdminKnowledgebaseCategoryEditPage } from './admin/knowledge-base/category_edit'
//users
export { default as UsersPendingPage} from './admin/users/users_pending'
//config
export { default as ConfigurationSACCOPage} from './admin/configuration/sacco'


//MEMBER
//My
export { default as MemberDashboardPage } from './dashboard'
export { default as MonthlyPostingEditPage} from './my/month_posting_edit'
export { default as MonthlyPostingPage} from './my/month_posting'
export { default as MonthlyPostingApprovePage} from './my/month_posting_approve'
export { default as MonthlyPostingsPage} from './my/month_posting_list'
export { default as MonthlyPostingApprovalsPage} from './my/month_posting_approvals'
export { default as MonthlyPostingPOPUploadPage} from './my/month_posting_pop_upload'
export { default as MemberQueriesPage} from './my/query_list'
export { default as MemberQuerySubmitPage} from './my/query_edit'
export { default as MemberSavingsPage} from './my/savings'
export { default as MemberSocialFundsPage} from './my/social'
export { default as MemberPenaltiesPage} from './my/penalties'
export { default as MemberSharesPage} from './my/shares'
export { default as MemberLoansPage} from './my/loans'
