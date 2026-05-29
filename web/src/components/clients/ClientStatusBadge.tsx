import { CLIENT_STATUS_LABELS, CLIENT_STATUS_STYLES, type ClientStatus } from "@/lib/clients-data";

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${CLIENT_STATUS_STYLES[status]}`}>
      {CLIENT_STATUS_LABELS[status]}
    </span>
  );
}
