import { AuditTrail } from "../../../components/auditTrail";

//every sign-in attempt, including failed ones
const AdminSessions = () => <AuditTrail signIns={true} />;

export default AdminSessions;
