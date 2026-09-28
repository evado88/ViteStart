import { AuditTrail } from "../../../components/auditTrail";

//every change made through the system, and page views
const AdminAudits = () => <AuditTrail signIns={false} />;

export default AdminAudits;
