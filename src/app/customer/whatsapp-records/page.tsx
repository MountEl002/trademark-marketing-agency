import TransactionFilesTable from "@/components/customer/WhatsappRecordsTable";

export default function WhatsappRecordsPage() {
  return (
    <div className="mx-auto px-4 max-w-6xl">
      <h4 className="bg-gray-100 p-3 rounded-md">
        Your Whatsapp Upload Records
      </h4>
      <TransactionFilesTable />
    </div>
  );
}
